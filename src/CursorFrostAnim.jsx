import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {CursorFrost, OUTER} from './CursorFrost.jsx';

/**
 * CursorFrostAnim — 毛玻璃光标动效层（透明底）
 *
 * 动效：右下滑入 → 停下 → 第 36-46 帧压下回弹 → 两圈错开涟漪 → 静止
 * 造型来自用户提供的「指针.svg」，tone 固定素白，hollow 切换实心 / 镂空。
 */

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

// 指针尖端（1024 viewBox 内的轮廓最左点）归一化到 0-1 包围盒
// 实测 4K 静帧 alpha 边界得到，不要再靠估：写作 S*0.18 会偏右近 15%
const TIP = {x: 0.0319, y: 0.3836};

export const CursorFrostAnim = ({hollow = false, ratio = 0.085, bg = 'transparent'}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  const S = width * ratio; // 光标外接方框边长
  const u = S / 1024;

  const enter = spring({frame, fps, config: {damping: 190, mass: 0.85, stiffness: 105}});
  const x = interpolate(enter, [0, 1], [width * 0.66, width * 0.52]);
  const y = interpolate(enter, [0, 1], [height * 0.66, height * 0.50]);
  const opacity = interpolate(frame, [0, 7], [0, 1], clamp);

  // 单击：压下 - 回弹
  const press = interpolate(frame, [36, 40, 46], [1, 0.92, 1], clamp);

  // 双圈涟漪
  const r1 = interpolate(frame, [38, 78], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const r1o = interpolate(frame, [38, 50, 78], [0, 0.55, 0], clamp);
  const r2 = interpolate(frame, [46, 92], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const r2o = interpolate(frame, [46, 58, 92], [0, 0.32, 0], clamp);

  const ringBase = S * 0.62;
  // 涟漪从指针尖发出（= 实际点击点），而不是方框中心
  const tipX = x - S / 2 + S * TIP.x;
  const tipY = y - S / 2 + S * TIP.y;

  return (
    <AbsoluteFill style={{backgroundColor: bg}}>
      {/* 涟漪 */}
      <svg
        width={width}
        height={height}
        style={{position: 'absolute', inset: 0, opacity}}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* 实心版：把光标本体从涟漪里抠掉，否则圆环会横穿玻璃，像画错了一道线 */}
        {!hollow && (
          <defs>
            <mask id="rippleCut">
              <rect width={width} height={height} fill="#fff" />
              <path
                d={OUTER}
                fill="#000"
                transform={`translate(${x - S / 2 + S * TIP.x * (1 - press)} ${
                  y - S / 2 + S * TIP.y * (1 - press)
                }) scale(${(press * S) / 1024})`}
              />
            </mask>
          </defs>
        )}
        <g mask={hollow ? undefined : 'url(#rippleCut)'}>
          <circle
            cx={tipX}
            cy={tipY}
            r={ringBase * r1}
            fill="none"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={Math.max(1, u * 3.4)}
            opacity={r1o}
          />
          <circle
            cx={tipX}
            cy={tipY}
            r={ringBase * r2}
            fill="none"
            stroke="rgba(214,236,252,0.95)"
            strokeWidth={Math.max(1, u * 2.6)}
            opacity={r2o}
          />
        </g>
      </svg>

      {/* 光标本体 */}
      <div
        style={{
          position: 'absolute',
          left: x - S / 2,
          top: y - S / 2,
          width: S,
          height: S,
          opacity,
          transform: `scale(${press})`,
          // 点击时绕尖端缩小：尖端是真正的触点，不能让它跟着飘走
          transformOrigin: `${TIP.x * 100}% ${TIP.y * 100}%`,
        }}
      >
        <CursorFrost tone="white" size={S} hollow={hollow} />
      </div>
    </AbsoluteFill>
  );
};
