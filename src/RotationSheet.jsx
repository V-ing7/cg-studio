import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CursorFrost} from './CursorFrost.jsx';

/**
 * RotationSheet — 光标朝向对照图
 * 每格都画一条从中心指向「左上 45°」的虚线，用来判断哪个角度真正对齐左上。
 */

const ITEMS = [
  {deg: 0, label: '0°'},
  {deg: -15, label: '-15°'},
  {deg: -30, label: '-30°'},
  {deg: -45, label: '-45°'},
  {deg: -60, label: '-60°'},
];

export const RotationSheet = () => {
  const W = 2400;
  const H = 760;
  const cell = W / ITEMS.length;
  const SIZE = 420;

  return (
    <AbsoluteFill style={{backgroundColor: '#16171B'}}>
      {ITEMS.map((it, i) => (
        <div
          key={it.label}
          style={{
            position: 'absolute',
            left: i * cell,
            top: 0,
            width: cell,
            height: H,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 26,
          }}
        >
          <div style={{position: 'relative', width: SIZE, height: SIZE}}>
            {/* 目标方向参考线：中心 → 左上 45° */}
            <svg
              width={SIZE}
              height={SIZE}
              style={{position: 'absolute', inset: 0, opacity: 0.5}}
            >
              <line
                x1={SIZE / 2}
                y1={SIZE / 2}
                x2={SIZE / 2 - SIZE * 0.46}
                y2={SIZE / 2 - SIZE * 0.46}
                stroke="rgba(90,200,255,0.9)"
                strokeWidth="3"
                strokeDasharray="10 8"
              />
              <circle cx={SIZE / 2} cy={SIZE / 2} r="4" fill="rgba(90,200,255,0.9)" />
            </svg>
            <div
              style={{
                transform: `rotate(${it.deg}deg)`,
                filter: 'drop-shadow(0 18px 34px rgba(0,0,0,0.45))',
              }}
            >
              <CursorFrost tone="white" size={SIZE} hollow={false} />
            </div>
          </div>
          <div
            style={{
              fontFamily: "'VIng-Chinese','Microsoft YaHei','PingFang SC',sans-serif",
              fontSize: 26,
              letterSpacing: 2,
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            {it.label}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
