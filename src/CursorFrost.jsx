import React from 'react';

/**
 * CursorFrost — 基于用户提供「指针.svg」轮廓的毛玻璃光标
 *
 * 造型完全沿用用户 SVG 的路径（viewBox 0 0 1024 1024），只做质感改造：
 * 半透磨砂面 + 细颗粒 + 内外描边 + 底部内折射。
 *
 * 注意：透明画布上没有可模糊的内容，真正的 backdrop blur 无法渲染，
 * 所以毛玻璃只能靠「半透白 + 噪声颗粒 + 边缘折射」模拟。
 */

export const OUTER =
  'M365.248 639.104a44.032 44.032 0 0 1 19.648 19.584l136.832 273.664a106.24 106.24 0 0 0 96.128 59.648 102.4 102.4 0 0 0 6.848-0.192 106.432 106.432 0 0 0 95.104-71.424L985.6 176.32A107.84 107.84 0 0 0 847.68 38.4L103.68 304.192a107.84 107.84 0 0 0-11.968 198.08z';

export const INNER =
  'M125.12 364.416l744.064-265.728a45.504 45.504 0 0 1 15.168-2.688 44.096 44.096 0 0 1 40.96 58.816l-265.728 744a43.84 43.84 0 0 1-80.64 4.928L442.176 630.144a108.16 108.16 0 0 0-48.256-48.32L120.32 445.056a43.904 43.904 0 0 1 4.864-80.64z';

export const FROST_VARIANTS = [
  {
    key: 'white',
    no: 'F1',
    name: '素白毛玻璃',
    note: '中性白雾面，任何画面上都不抢戏',
    tint: ['rgba(255,255,255,0.34)', 'rgba(240,246,252,0.20)', 'rgba(216,230,242,0.14)'],
    grain: 0.5,
    rim: 'rgba(255,255,255,0.85)',
    edge: 'rgba(120,140,160,0.55)',
    glow: 0,
  },
  {
    key: 'ice',
    no: 'F2',
    name: '冰蓝毛玻璃',
    note: '带冰蓝冷调，和你的标题条同一色系',
    tint: ['rgba(255,255,255,0.60)', 'rgba(206,236,255,0.44)', 'rgba(150,204,240,0.40)'],
    grain: 0.55,
    rim: 'rgba(255,255,255,0.9)',
    edge: 'rgba(30,80,120,0.55)',
    glow: 0.5,
  },
  {
    key: 'hollow',
    no: 'F3',
    name: '镂空毛玻璃',
    note: '保留原图镂空轮廓，只有一圈玻璃边',
    hollow: true,
    tint: ['rgba(255,255,255,0.72)', 'rgba(222,240,252,0.52)', 'rgba(168,212,244,0.46)'],
    grain: 0.4,
    rim: 'rgba(255,255,255,0.95)',
    edge: 'rgba(24,52,80,0.6)',
    glow: 0.3,
  },
  {
    key: 'thick',
    no: 'F4',
    name: '厚玻璃',
    note: '加厚边缘 + 强内折射，最「液态玻璃」',
    tint: ['rgba(255,255,255,0.70)', 'rgba(224,244,255,0.48)', 'rgba(160,206,238,0.42)'],
    grain: 0.7,
    rim: 'rgba(255,255,255,1)',
    edge: 'rgba(14,30,48,0.7)',
    glow: 0.9,
  },
];

/** size 为实际像素边长；tone 指定变体 key；hollow 可覆盖造型（实心 / 镂空）；flat 去掉所有阴影与光效 */
export const CursorFrost = ({tone = 'white', size = 420, hollow, flat = false}) => {
  const v = FROST_VARIANTS.find((x) => x.key === tone) || FROST_VARIANTS[0];
  const id = 'frost-' + v.key + (hollow ? '-h' : '');
  const isHollow = hollow === undefined ? !!v.hollow : hollow;
  const path = isHollow ? `${OUTER}${INNER}` : OUTER;
  const fillRule = isHollow ? 'evenodd' : 'nonzero';
  const u = size / 1024;

  // flat 模式下去掉了斜面/高光/反光等所有加白层，而面板是扁矩形、霜边覆盖面积大，
  // 小尺寸光标就会明显比面板暗一档。这里提亮本体，让两者在深色底上灰度统一。
  const tint = flat
    ? ['rgba(255,255,255,0.64)', 'rgba(244,250,255,0.50)', 'rgba(224,237,248,0.43)']
    : v.tint;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      style={{
        filter: flat
          ? 'none'
          : `drop-shadow(0 ${u * 26}px ${u * 40}px rgba(0,0,0,0.34))` +
            (v.glow ? ` drop-shadow(0 0 ${u * 26}px rgba(190,228,255,${0.30 * v.glow}))` : ''),
      }}
    >
      <defs>
        <linearGradient id={id + '-body'} x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={tint[0]} />
          <stop offset="46%" stopColor={tint[1]} />
          <stop offset="100%" stopColor={tint[2]} />
        </linearGradient>

        {/* 玻璃壁的斜面：上左受光亮、下右背光暗，这是「厚度」的来源 */}
        <linearGradient id={id + '-bevel'} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="34%" stopColor="rgba(255,255,255,0.30)" />
          <stop offset="52%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="68%" stopColor="rgba(12,24,40,0.30)" />
          <stop offset="100%" stopColor="rgba(12,24,40,0.46)" />
        </linearGradient>

        <filter id={id + '-noise'}>
          <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="4" seed="11" />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        <filter id={id + '-noise2'}>
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="23" />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        {/* 外溢柔光：玻璃边缘把光漏到画面上，没有这层边缘是「切」出来的 */}
        <filter id={id + '-bloom'} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="22" />
        </filter>

        <filter id={id + '-soft'} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>

        <linearGradient id={id + '-haze'} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.30)" />
          <stop offset="42%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* 顶部内阴影：玻璃缺了这一层就是一张平的灰贴纸 */}
        <linearGradient id={id + '-shade'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(10,16,26,0.20)" />
          <stop offset="14%" stopColor="rgba(10,16,26,0.05)" />
          <stop offset="100%" stopColor="rgba(10,16,26,0)" />
        </linearGradient>

        {/* 底部反光：玻璃下沿兜住的一点光 */}
        <linearGradient id={id + '-bounce'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="76%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.34)" />
        </linearGradient>

        {/* 底部冷色折射：光源是白的，玻璃会把背景的冷调压到最下沿 */}
        <linearGradient id={id + '-caustic'} x1="0.2" y1="0.3" x2="0.8" y2="1">
          <stop offset="0%" stopColor="rgba(150,200,240,0)" />
          <stop offset="72%" stopColor="rgba(150,200,240,0.06)" />
          <stop offset="100%" stopColor="rgba(150,200,240,0.20)" />
        </linearGradient>

        <clipPath id={id + '-clip'}>
          <path d={path} fillRule={fillRule} />
        </clipPath>
      </defs>

      {/* 轮廓外溢光（画在本体之下）；flat 模式去掉 */}
      {!flat && (
        <path
          d={path}
          fillRule={fillRule}
          fill="rgba(255,255,255,0.55)"
          opacity={0.22 + v.glow * 0.25}
          filter={`url(#${id}-bloom)`}
        />
      )}

      {/* 磨砂本体（裁剪在轮廓内） */}
      <g clipPath={`url(#${id}-clip)`}>
        <path d={path} fill={`url(#${id}-body)`} fillRule={fillRule} />
        {/* 柔光 / 内阴影 / 冷调折射 / 底部反光都是「光」层，flat 模式全部去掉 */}
        {!flat && (
          <>
            <rect width="1024" height="1024" fill={`url(#${id}-haze)`} />
            <rect width="1024" height="1024" fill={`url(#${id}-shade)`} />
            <rect width="1024" height="1024" fill={`url(#${id}-caustic)`} />
            <rect width="1024" height="1024" fill={`url(#${id}-bounce)`} />
          </>
        )}
        <rect
          width="1024"
          height="1024"
          filter={`url(#${id}-noise)`}
          opacity={v.grain * 0.22}
        />
        <rect
          width="1024"
          height="1024"
          filter={`url(#${id}-noise2)`}
          opacity={v.grain * 0.10}
        />
        {/* 内侧磨砂厚边：描边被裁掉外侧，只留轮廓内的一圈白霜（越靠边越白） */}
        <path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.13)"
          strokeWidth={u * 230}
          strokeLinejoin="round"
        />
        <path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={u * 120}
          strokeLinejoin="round"
        />
        {/* 玻璃壁斜面与高光线都是「光」的建模，flat 模式去掉 */}
        {!flat && (
          <>
            <path
              d={path}
              fill="none"
              stroke={`url(#${id}-bevel)`}
              strokeWidth={u * 64}
              strokeLinejoin="round"
              filter={`url(#${id}-soft)`}
              opacity={0.42}
            />
            <path
              d={path}
              fill="none"
              stroke={`url(#${id}-bevel)`}
              strokeWidth={u * 34}
              strokeLinejoin="round"
            />
            <path
              d={path}
              fill="none"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth={u * 9}
              strokeLinejoin="round"
            />
          </>
        )}
      </g>

      {/* 外描边：轮廓定义。注意 strokeWidth 是 viewBox 坐标，还会再乘一次 u，
          小尺寸下必须按「设备像素」兜底（n / u），否则会缩到亚像素而彻底消失 */}
      <path
        d={path}
        fillRule={fillRule}
        fill="none"
        stroke={v.edge}
        strokeWidth={Math.max(2.4 / u, u * 3)}
        strokeLinejoin="round"
      />
      <path
        d={path}
        fillRule={fillRule}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth={Math.max(1.2 / u, u * 1.2)}
        strokeLinejoin="round"
      />
    </svg>
  );
};
