import React from 'react';
import {AbsoluteFill} from 'remotion';

/**
 * FrostPanelPicker — 毛玻璃面板材质对照图
 * 4 个候选配方，同一尺寸（1520×460）、同一文案，2×2 排布。
 * 用户指认编号后，把对应配方移植进 CursorPanelAnim 的 PanelGlass。
 *
 * 注意：透明画布上没有可模糊的内容，真正的 backdrop blur 无法烘焙进
 * 透明视频，毛玻璃只能靠「乳白本体 + 可见颗粒 + 柔和高光」模拟。
 */

const FONT =
  "'VIng-Chinese','Microsoft YaHei','PingFang SC','Helvetica Neue','Segoe UI',Arial,sans-serif";

const W = 1520;
const H = 460;
const R = 44;

// 每个配方的差异只在这张表里：本体透明度、颗粒、高光方式、斜面强度
const RECIPES = [
  {
    no: 1,
    name: '轻磨砂',
    note: '在现有光面基础上加雾：保留玻璃斜面，高光减弱',
    body: [
      ['0%', 'rgba(255,255,255,0.90)'],
      ['46%', 'rgba(247,251,255,0.84)'],
      ['100%', 'rgba(224,236,248,0.78)'],
    ],
    g1: {f: 0.6, o: 4, op: 0.2, blur: 0.004},
    g2: {f: 1.4, o: 2, op: 0.09},
    line: {c: 'rgba(255,255,255,0.55)', w: 0.012},
    bevelOp: 0.3,
    bevelStops: [
      ['0%', 'rgba(255,255,255,0.6)'],
      ['50%', 'rgba(255,255,255,0.05)'],
      ['100%', 'rgba(12,24,40,0.26)'],
    ],
  },
  {
    no: 2,
    name: '标准毛玻璃',
    note: '乳白雾面 + 均匀细颗粒，无锐利高光，经典 frosted glass',
    body: [
      ['0%', 'rgba(255,255,255,0.93)'],
      ['46%', 'rgba(244,249,253,0.88)'],
      ['100%', 'rgba(228,238,248,0.84)'],
    ],
    g1: {f: 0.9, o: 3, op: 0.24, blur: 0.005},
    g2: {f: 2.2, o: 2, op: 0.1},
    line: null,
    softBand: {c: 'rgba(255,255,255,0.5)', w: 0.05, blur: 0.02},
    bevelOp: 0.22,
    bevelStops: [
      ['0%', 'rgba(255,255,255,0.45)'],
      ['50%', 'rgba(255,255,255,0.04)'],
      ['100%', 'rgba(12,24,40,0.18)'],
    ],
  },
  {
    no: 3,
    name: '厚雾磨砂',
    note: '近乎不透明的哑光，内部带柔云般的扩散层次，最「雾」',
    body: [
      ['0%', 'rgba(255,255,255,0.96)'],
      ['46%', 'rgba(246,250,253,0.92)'],
      ['100%', 'rgba(230,240,249,0.9)'],
    ],
    g1: {f: 0.5, o: 4, op: 0.3, blur: 0.006},
    g2: {f: 1.8, o: 2, op: 0.12},
    line: null,
    softBand: {c: 'rgba(255,255,255,0.6)', w: 0.09, blur: 0.035},
    cloud: true,
    bevelOp: 0.15,
    bevelStops: [
      ['0%', 'rgba(255,255,255,0.35)'],
      ['50%', 'rgba(255,255,255,0.03)'],
      ['100%', 'rgba(12,24,40,0.14)'],
    ],
  },
  {
    no: 4,
    name: '冰晶霜玻璃',
    note: '冷调 + 高频冰晶颗粒，像冬天窗上的霜花',
    body: [
      ['0%', 'rgba(255,255,255,0.94)'],
      ['46%', 'rgba(238,247,253,0.88)'],
      ['100%', 'rgba(205,228,246,0.84)'],
    ],
    g1: {f: 2.6, o: 2, op: 0.2, blur: 0},
    g2: {f: 0.7, o: 3, op: 0.14, blur: 0.004},
    line: {c: 'rgba(255,255,255,0.6)', w: 0.01},
    cold: true,
    bevelOp: 0.28,
    bevelStops: [
      ['0%', 'rgba(255,255,255,0.55)'],
      ['50%', 'rgba(255,255,255,0.04)'],
      ['100%', 'rgba(30,80,120,0.22)'],
    ],
  },
];

const FrostedPanel = ({w, h, r, recipe}) => {
  const id = 'fp' + recipe.no;
  const g1Blur = recipe.g1.blur ? h * recipe.g1.blur : 0;
  const g2Blur = recipe.g2.blur ? h * recipe.g2.blur : 0;

  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id={id + '-body'} x1="0.06" y1="0" x2="0.55" y2="1">
          {recipe.body.map((s, i) => (
            <stop key={i} offset={s[0]} stopColor={s[1]} />
          ))}
        </linearGradient>
        <linearGradient id={id + '-bevel'} x1="0.06" y1="0" x2="0.55" y2="1">
          {recipe.bevelStops.map((s, i) => (
            <stop key={i} offset={s[0]} stopColor={s[1]} />
          ))}
        </linearGradient>
        <linearGradient id={id + '-shade'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(10,16,26,0.12)" />
          <stop offset="16%" stopColor="rgba(10,16,26,0.03)" />
          <stop offset="100%" stopColor="rgba(10,16,26,0)" />
        </linearGradient>
        <linearGradient id={id + '-bounce'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="78%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
        </linearGradient>
        <filter id={id + '-g1'}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={recipe.g1.f}
            numOctaves={recipe.g1.o}
            seed="11"
          />
          <feColorMatrix type="saturate" values="0" />
          {g1Blur > 0 && <feGaussianBlur stdDeviation={g1Blur} />}
        </filter>
        <filter id={id + '-g2'}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={recipe.g2.f}
            numOctaves={recipe.g2.o}
            seed="23"
          />
          <feColorMatrix type="saturate" values="0" />
          {g2Blur > 0 && <feGaussianBlur stdDeviation={g2Blur} />}
        </filter>
        {recipe.softBand && (
          <filter id={id + '-softband'} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={h * recipe.softBand.blur} />
          </filter>
        )}
        {recipe.cloud && (
          <filter id={id + '-cloud'} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={h * 0.09} />
          </filter>
        )}
        <clipPath id={id + '-clip'}>
          <rect width={w} height={h} rx={r} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-clip)`}>
        <rect width={w} height={h} fill={`url(#${id}-body)`} />
        <rect width={w} height={h} fill={`url(#${id}-shade)`} />
        <rect width={w} height={h} fill={`url(#${id}-bounce)`} />
        {recipe.cold && (
          <rect
            width={w}
            height={h}
            fill="rgba(150,200,240,0.10)"
            style={{mixBlendMode: 'multiply'}}
          />
        )}
        {recipe.cloud && (
          <g filter={`url(#${id}-cloud)`} opacity={0.55}>
            <ellipse cx={w * 0.22} cy={h * 0.25} rx={w * 0.2} ry={h * 0.5} fill="#fff" />
            <ellipse cx={w * 0.68} cy={h * 0.85} rx={w * 0.26} ry={h * 0.55} fill="#fff" />
            <ellipse cx={w * 0.9} cy={h * 0.15} rx={w * 0.12} ry={h * 0.4} fill="#fff" />
          </g>
        )}
        <rect width={w} height={h} filter={`url(#${id}-g1)`} opacity={recipe.g1.op} />
        <rect width={w} height={h} filter={`url(#${id}-g2)`} opacity={recipe.g2.op} />
        {/* 玻璃壁斜面：毛玻璃上只留很弱的一层，保持边缘厚度但不抢镜 */}
        <rect
          width={w}
          height={h}
          rx={r}
          fill="none"
          stroke={`url(#${id}-bevel)`}
          strokeWidth={h * 0.03}
          opacity={recipe.bevelOp}
        />
        {/* 高光：要么是宽而虚的柔光带（磨砂感），要么是弱化的细线 */}
        {recipe.softBand && (
          <rect
            width={w}
            height={h}
            rx={r}
            fill="none"
            stroke={recipe.softBand.c}
            strokeWidth={h * recipe.softBand.w}
            filter={`url(#${id}-softband)`}
          />
        )}
        {recipe.line && (
          <rect
            width={w}
            height={h}
            rx={r}
            fill="none"
            stroke={recipe.line.c}
            strokeWidth={Math.max(1, h * recipe.line.w)}
          />
        )}
        {/* 外沿细线：保证在深色画面上有轮廓 */}
        <rect
          width={w}
          height={h}
          rx={r}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={Math.max(1.2, h * 0.0026)}
        />
      </g>
    </svg>
  );
};

const PanelText = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: 66,
      paddingRight: 66,
      fontFamily: FONT,
    }}
  >
    <div
      style={{
        fontSize: 22,
        letterSpacing: 7,
        color: 'rgba(26,42,62,0.8)',
        marginBottom: 14,
      }}
    >
      微影 V-ING · 案例
    </div>
    <div
      style={{
        fontSize: 72,
        fontWeight: 600,
        letterSpacing: 1,
        color: '#0E1218',
        lineHeight: 1.18,
      }}
    >
      让每一帧都有情绪
    </div>
    <div
      style={{
        height: 1.5,
        width: 118,
        marginTop: 20,
        marginBottom: 18,
        background:
          'linear-gradient(90deg, rgba(20,40,60,0.42) 0%, rgba(20,40,60,0.05) 100%)',
      }}
    />
    <div style={{fontSize: 27, lineHeight: 1.55, color: 'rgba(20,30,44,0.78)'}}>
      品牌短片 / 产品片 / 人物纪录
    </div>
  </div>
);

export const FrostPanelPicker = () => {
  const cellW = 1920;
  const cellH = 1080;

  return (
    <AbsoluteFill style={{backgroundColor: '#151619'}}>
      {RECIPES.map((recipe, i) => {
        const cellX = (i % 2) * cellW;
        const cellY = Math.floor(i / 2) * cellH;
        const panelX = cellX + (cellW - W) / 2;
        const panelY = cellY + (cellH - H) / 2 + 70;

        return (
          <React.Fragment key={recipe.no}>
            {/* 编号 + 名称 */}
            <div
              style={{
                position: 'absolute',
                left: cellX + 80,
                top: cellY + 70,
                fontFamily: FONT,
                color: '#fff',
              }}
            >
              <span style={{fontSize: 92, fontWeight: 700, opacity: 0.95}}>
                {recipe.no}
              </span>
              <span style={{fontSize: 34, fontWeight: 600, marginLeft: 24, opacity: 0.9}}>
                {recipe.name}
              </span>
              <div style={{fontSize: 22, opacity: 0.5, marginTop: 10}}>{recipe.note}</div>
            </div>

            {/* 面板 */}
            <div
              style={{
                position: 'absolute',
                left: panelX,
                top: panelY,
                width: W,
                height: H,
                borderRadius: R,
                overflow: 'hidden',
                boxShadow:
                  '0 0 0 1px rgba(18,28,42,0.10), 0 22px 64px rgba(6,10,16,0.26), 0 4px 12px rgba(6,10,16,0.14)',
              }}
            >
              <FrostedPanel w={W} h={H} r={R} recipe={recipe} />
              <PanelText />
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
