import React from 'react';

/**
 * CursorVariants — 圆润 iOS 风格光标候选造型
 *
 * 统一规则（Vikyi 定的硬规则）：
 * - 不加扫光、不加顶部高光带、不加背后柔光
 * - 冰蓝玻璃质感，白 → 冰蓝纵向渐变 + 深色描边 + 内白描边 + 左缘细高光 + 投影
 * - 所有变体共用 viewBox 0 0 84 132，圆角靠 linejoin-round 的粗描边统一生成
 */

export const CURSOR_VARIANTS = [
  {
    key: 'squircle',
    no: '01',
    name: '方角圆润箭头',
    note: '经典光标，四角全部圆润',
    path: 'M 6 6 L 6 112 L 30 90 L 44 124 L 62 116 L 48 86 L 78 86 Z',
    rim: 9,
  },
  {
    key: 'tri',
    no: '02',
    name: '圆润三角',
    note: '去掉凹口，最简形态',
    path: 'M 10 8 L 10 118 L 80 118 Z',
    rim: 10,
  },
  {
    key: 'drop',
    no: '03',
    name: '水滴光标',
    note: '无柄，尖端指向左上',
    path:
      'M 8 8 L 8 96 C 8 116 24 128 44 128 C 68 128 80 112 80 92 C 80 68 58 50 34 42 C 20 37 12 22 8 8 Z',
    rim: 8,
  },
  {
    key: 'chevron',
    no: '04',
    name: '空心 V 形',
    note: '纯描边，玻璃中空通透',
    path: 'M 16 10 L 16 118 L 74 48',
    rim: 13,
    hollow: true,
  },
  {
    key: 'frost',
    no: '05',
    name: '磨砂箭头',
    note: '半透磨砂 + 强内发光，最「液态玻璃」',
    path: 'M 6 6 L 6 112 L 30 90 L 44 124 L 62 116 L 48 86 L 78 86 Z',
    rim: 7,
    frost: true,
  },
];

const clampPathEdge = 'M 7.4 14 L 7.4 101';

/** 单个光标造型，height 为实际像素高度 */
export const CursorShape = ({
  variant = 'squircle',
  height = 240,
  ice = '#8FC8EE',
  shadow = true,
  opacity = 1,
}) => {
  const conf = typeof variant === 'string' ? CURSOR_VARIANTS.find((v) => v.key === variant) : variant;
  const v = conf || CURSOR_VARIANTS[0];
  const w = (height * 84) / 132;
  const u = height / 132;
  const gid = 'cg-' + v.key;

  const fill = v.frost
    ? 'url(#' + gid + '-frost)'
    : v.hollow
      ? 'none'
      : 'url(#' + gid + '-body)';

  return (
    <div
      style={{
        width: w,
        height,
        opacity,
        filter: shadow
          ? `drop-shadow(0 ${u * 12}px ${u * 26}px rgba(0,0,0,0.42)) drop-shadow(0 ${u * 2}px ${u * 4}px rgba(0,0,0,0.26))` +
            (v.frost ? ` drop-shadow(0 0 ${u * 9}px rgba(198,232,255,0.42))` : '')
          : 'none',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 84 132">
        <defs>
          <linearGradient id={gid + '-body'} x1="0" y1="0" x2="0.28" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.99)" />
            <stop offset="36%" stopColor="rgba(226,242,254,0.97)" />
            <stop offset="76%" stopColor="rgba(178,220,248,0.95)" />
            <stop offset="100%" stopColor={ice} stopOpacity="0.97" />
          </linearGradient>

          <linearGradient id={gid + '-frost'} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,1)" />
            <stop offset="38%" stopColor="rgba(234,247,255,0.96)" />
            <stop offset="100%" stopColor="rgba(188,224,250,0.90)" />
          </linearGradient>

          <linearGradient id={gid + '-inner'} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>

          <linearGradient id={gid + '-edge'} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* 玻璃主体：粗描边 + linejoin round 把每个角都磨圆 */}
        <path
          d={v.path}
          fill={fill}
          stroke="rgba(8,18,32,0.94)"
          strokeWidth={v.rim}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* 磨砂版：主体已经是半透明磨砂，内部再叠一层顶部乳白，做出玻璃厚度 */}
        {v.frost && (
          <path
            d={v.path}
            fill={`url(#${gid}-inner)`}
            stroke="none"
            opacity="0.30"
          />
        )}

        {/* 内白描边：玻璃第二层线 */}
        <path
          d={v.path}
          fill="none"
          stroke={`url(#${gid}-inner)`}
          strokeWidth={Math.max(1, u * 1.8)}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* 左缘细高光：代替大面积高光，只在转折处出现 */}
        {!v.hollow && (
          <path
            d={clampPathEdge}
            stroke={`url(#${gid}-edge)`}
            strokeWidth={Math.max(1, u * 3.2)}
            strokeLinecap="round"
            opacity="0.8"
          />
        )}
      </svg>
    </div>
  );
};
