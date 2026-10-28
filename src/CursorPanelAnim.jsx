import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {CursorFrost, OUTER} from './CursorFrost.jsx';

/**
 * CursorPanelAnim — 光标「从右滑入 → 点击 → 带着文字面板向右下滑出」
 *
 * 时间轴（30fps，105 帧 = 3.5s）：
 *   0-24    光标从画布右侧水平滑入（右 → 左），淡入
 *   34-42   点击：压下回弹 + 两圈涟漪（圆心 = 指针尖）
 *   42-72   光标向右下滑动
 *   44-74   文字面板从触点被「拉」出来，向右下展开
 *   72-102  面板内文字逐层浮现
 *   102-105 静止收尾
 *
 * 光标造型沿用「指针.svg」轮廓，顺时针转 30° 让尖端明确朝左上（↖）。
 */

const FONT =
  "'VIng-Chinese','Microsoft YaHei','PingFang SC','Helvetica Neue','Segoe UI',Arial,sans-serif";

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

/**
 * PanelGlass — CursorFrost（white 变体）的矩形 flat 版
 * 与 flat 光标完全一致：只剩半透本体、双层颗粒、内侧霜边、外描边，
 * 没有任何阴影与光效（无投影、无辉光、无斜面、无高光、无反光）。
 */
const PanelGlass = ({w, h, r}) => {
  const id = 'pg';
  const u = h / 460; // 以 460 高的面板为基准等比缩放

  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        {/* 本体：flat 模式下与 CursorFrost 的 flat tint 完全一致（0.64/0.50/0.43），
            保证面板和光标同材质、灰度对齐 */}
        <linearGradient id={id + '-body'} x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.64)" />
          <stop offset="46%" stopColor="rgba(244,250,255,0.50)" />
          <stop offset="100%" stopColor="rgba(224,237,248,0.43)" />
        </linearGradient>
        {/* 颗粒：与光标同一组频率/种子/透明度（grain 0.5） */}
        <filter id={id + '-n1'}>
          <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="4" seed="11" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id={id + '-n2'}>
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="23" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id={id + '-clip'}>
          <rect width={w} height={h} rx={r} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-clip)`}>
        <rect width={w} height={h} fill={`url(#${id}-body)`} />
        <rect width={w} height={h} filter={`url(#${id}-n1)`} opacity={0.11} />
        <rect width={w} height={h} filter={`url(#${id}-n2)`} opacity={0.05} />
        {/* 内侧磨砂薄边：越靠边越白 */}
        <rect width={w} height={h} rx={r} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={u * 22} />
        <rect width={w} height={h} rx={r} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={u * 11} />
      </g>

      {/* 外描边：与光标同一组（轮廓定义，不是光效）。与光标一致按设备像素兜底，
          保证面板长到 4K 或缩到小卡时轮廓强度都不变 */}
      <rect width={w} height={h} rx={r} fill="none" stroke="rgba(120,140,160,0.55)" strokeWidth={Math.max(2.4, u * 1.2)} />
      <rect width={w} height={h} rx={r} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={Math.max(1.2, u * 0.5)} />
    </svg>
  );
};

// 朝向按对照图第 6 格：逆时针 90°，尖端落在左上 45° 方向
const ROT = -90;
// 尖端 = 原图右上角 (920,100) 绕 (512,512) 逆时针 90° 后的位置
const TIP = {x: 0.0977, y: 0.1016};

export const CursorPanelAnim = ({hollow = false, ratio = 0.026, bg = 'transparent'}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  // 以 3840×2160 为设计基准，其它尺寸等比缩放
  const sc = width / 3840;
  const U = (n) => n * sc;

  const S = width * ratio;
  const u = S / 1024;

  // ---- 光标入场：右 → 左 ----
  const enter = interpolate(frame, [0, 24], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const inX = interpolate(enter, [0, 1], [width * 1.02, width * 0.38]);
  const inY = interpolate(enter, [0, 1], [height * 0.37, height * 0.4]);
  const opacity = interpolate(frame, [0, 6], [0, 1], clamp);

  // 光标动画结束后（105f = 3.5s）渐渐淡出并略微收小，文字面板继续保留
  const fadeOut = interpolate(frame, [105, 134], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const cursorShrink = 1 - 0.04 * interpolate(frame, [105, 134], [0, 1], clamp);

  // ---- 点击 ----
  const press = interpolate(frame, [34, 37, 42], [1, 0.93, 1], clamp);

  const r1 = interpolate(frame, [36, 78], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const r1o = interpolate(frame, [36, 48, 78], [0, 0.55, 0], clamp);
  const r2 = interpolate(frame, [44, 90], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const r2o = interpolate(frame, [44, 56, 90], [0, 0.32, 0], clamp);

  // ---- 点击后光标向右下滑动 ----
  // 触点（= 旋转后的指针尖），全程固定在点击瞬间的位置
  const clickX = inX - S / 2 + S * TIP.x;
  const clickY = inY - S / 2 + S * TIP.y;

  const panelW = U(1520);
  const panelH = U(460);

  const drag = interpolate(frame, [42, 74], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  // 面板左上角钉在触点上、宽高随拉扯增长；光标尖端则咬住它的右下角。
  // 光标位置必须由面板右下角反推，不能再单独插值——两条曲线不同步时，
  // 中途尖端会滑进面板内部，看起来就是「面板自己长大」而不是「被拉出来」
  const grow = drag;
  const panelW2 = panelW * grow;
  const panelH2 = panelH * grow;
  const panelLeft = clickX;
  const panelTop = clickY;
  const radius = Math.min(U(44), panelH2 / 2);
  // 圆角把外接矩形的角切空了，尖端要对准圆角弧上 45° 的点，
  // 否则会飘在角的缺口里（差 0.293r，4K 下约 13px，肉眼能看出来）
  const gripInset = radius * 0.2929;
  const cornerX = panelLeft + panelW2 - gripInset;
  const cornerY = panelTop + panelH2 - gripInset;

  const x = cornerX + S / 2 - S * TIP.x;
  const y = cornerY + S / 2 - S * TIP.y;

  const tipX = cornerX;
  const tipY = cornerY;
  const ringBase = S * 0.62;

  // 光标包围盒左上 / 中心，供 ripple mask 复用同一套变换
  const left = x - S / 2;
  const top = y - S / 2;
  const cx = x;
  const cy = y;

  // ---- 文字面板：左上角钉在触点，被光标向外「拉扯」展开 ----
  // 宽高直接跟 drag 同步（而不是 transform: scale）：面板从点击点的一颗
  // 小点开始被拉出来，内容不做缩放，只有形状在生长
  const panelO = interpolate(frame, [42, 46], [0, 1], clamp);
  const panelBlur = interpolate(frame, [42, 58], [U(4), 0], clamp);

  // 面板文字
  const eyebrowO = interpolate(frame, [72, 84], [0, 1], clamp);
  const eyebrowY = interpolate(frame, [72, 84], [U(10), 0], clamp);
  const titleO = interpolate(frame, [76, 90], [0, 1], clamp);
  const titleY = interpolate(frame, [76, 90], [U(18), 0], clamp);
  const lineW = U(
    interpolate(frame, [80, 98], [0, 118], {...clamp, easing: Easing.inOut(Easing.cubic)})
  );
  const bodyO = interpolate(frame, [84, 98], [0, 1], clamp);
  const bodyY = interpolate(frame, [84, 98], [U(12), 0], clamp);
  const chipO = interpolate(frame, [90, 102], [0, 1], clamp);
  const chipS = interpolate(frame, [90, 102], [0.9, 1], clamp);

  const inset = U(66);

  return (
    <AbsoluteFill style={{backgroundColor: bg}}>
      {/* 涟漪（圆心 = 指针尖，变换与光标保持一致） */}
      <svg
        width={width}
        height={height}
        style={{position: 'absolute', inset: 0, opacity}}
        viewBox={`0 0 ${width} ${height}`}
      >
        {!hollow && (
          <defs>
            <mask id="panelRippleCut">
              <rect width={width} height={height} fill="#fff" />
              <path
                d={OUTER}
                fill="#000"
                transform={`translate(${tipX} ${tipY}) scale(${press}) translate(${-tipX} ${-tipY}) translate(${cx} ${cy}) rotate(${ROT}) translate(${-cx} ${-cy}) translate(${left} ${top}) scale(${S / 1024})`}
              />
            </mask>
          </defs>
        )}
        <g mask={hollow ? undefined : 'url(#panelRippleCut)'}>
          <circle
            cx={clickX}
            cy={clickY}
            r={ringBase * r1}
            fill="none"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={Math.max(1, u * 3.4)}
            opacity={r1o}
          />
          <circle
            cx={clickX}
            cy={clickY}
            r={ringBase * r2}
            fill="none"
            stroke="rgba(214,236,252,0.95)"
            strokeWidth={Math.max(1, u * 2.6)}
            opacity={r2o}
          />
        </g>
      </svg>

      {/* 毛玻璃文字面板 */}
      <div
        style={{
          position: 'absolute',
          left: panelLeft,
          top: panelTop,
          width: panelW2,
          height: panelH2,
          borderRadius: radius,
          overflow: 'hidden',
          opacity: panelO,
          filter: panelBlur > 0.1 ? `blur(${panelBlur}px)` : undefined,
          isolation: 'isolate',
        }}
      >
        <PanelGlass w={panelW2} h={panelH2} r={radius} />
        {/* 文本 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: inset,
            paddingRight: inset,
            fontFamily: FONT,
          }}
        >
          <div
            style={{
              fontSize: U(22),
              letterSpacing: U(7),
              color: 'rgba(255,255,255,0.82)',
              opacity: eyebrowO,
              transform: `translateY(${eyebrowY}px)`,
              marginBottom: U(14),
            }}
          >
            微影 V-ING · 案例
          </div>

          <div
            style={{
              fontSize: U(72),
              fontWeight: 600,
              letterSpacing: U(1),
              color: '#FFFFFF',
              lineHeight: 1.18,
              opacity: titleO,
              transform: `translateY(${titleY}px)`,
            }}
          >
            让每一帧都有情绪
          </div>

          <div
            style={{
              height: Math.max(1, U(1.5)),
              width: lineW,
              marginTop: U(20),
              marginBottom: U(18),
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.08) 100%)',
            }}
          />

          <div
            style={{
              fontSize: U(27),
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.88)',
              opacity: bodyO,
              transform: `translateY(${bodyY}px)`,
            }}
          >
            品牌短片 / 产品片 / 人物纪录
          </div>
        </div>

        {/* 右上角标签：右下角会被光标压住，所以放在右上 */}
        <div
          style={{
            position: 'absolute',
            right: U(44),
            top: U(34),
            display: 'flex',
            alignItems: 'center',
            gap: U(9),
            padding: `${U(9)}px ${U(18)}px`,
            borderRadius: 999,
            // 与光标同款的白色半透胶囊
            background: 'rgba(255,255,255,0.16)',
            border: `${Math.max(1, U(1))}px solid rgba(255,255,255,0.42)`,
            color: 'rgba(255,255,255,0.85)',
            fontSize: U(18),
            letterSpacing: U(3),
            fontFamily: FONT,
            opacity: chipO,
            transform: `scale(${chipS})`,
          }}
        >
          <span
            style={{
              width: U(7),
              height: U(7),
              borderRadius: 999,
              background: 'rgba(60,120,180,0.75)',
              display: 'inline-block',
            }}
          />
          4K · 透明图层
        </div>
      </div>

      {/* 光标本体（压在最上层）：外圈管压下，内圈管朝向 */}
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: S,
          height: S,
          opacity: opacity * fadeOut,
          transform: `scale(${press * cursorShrink})`,
          transformOrigin: `${TIP.x * 100}% ${TIP.y * 100}%`,
        }}
      >
        <div style={{width: '100%', height: '100%', transform: `rotate(${ROT}deg)`}}>
          <CursorFrost tone="white" size={S} hollow={hollow} flat />
        </div>
      </div>
    </AbsoluteFill>
  );
};
