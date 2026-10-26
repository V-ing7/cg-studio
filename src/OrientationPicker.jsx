import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CursorFrost} from './CursorFrost.jsx';

/**
 * OrientationPicker — 24 格朝向选择图
 * 每格编号 1-24，角度 -165° ~ +180°（步长 15°），都画了左上 45° 参考虚线。
 * 只需要用户报编号，避免角度符号歧义。
 */

const ANGLES = [];
for (let a = -165; a <= 180; a += 15) ANGLES.push(a);

const COLS = 6;
const CELL = 400;
const SIZE = 250;

export const OrientationPicker = () => {
  const W = COLS * CELL;
  const H = Math.ceil(ANGLES.length / COLS) * CELL + 20;

  return (
    <AbsoluteFill style={{backgroundColor: '#16171B'}}>
      {ANGLES.map((deg, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        return (
          <div
            key={deg}
            style={{
              position: 'absolute',
              left: col * CELL,
              top: row * CELL,
              width: CELL,
              height: CELL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{position: 'relative', width: SIZE, height: SIZE}}>
              <svg
                width={SIZE}
                height={SIZE}
                style={{position: 'absolute', inset: 0}}
              >
                <line
                  x1={SIZE / 2}
                  y1={SIZE / 2}
                  x2={SIZE / 2 - SIZE * 0.47}
                  y2={SIZE / 2 - SIZE * 0.47}
                  stroke="rgba(90,200,255,0.55)"
                  strokeWidth="2"
                  strokeDasharray="8 7"
                />
                <circle cx={SIZE / 2} cy={SIZE / 2} r="3" fill="rgba(90,200,255,0.7)" />
              </svg>
              <div
                style={{
                  transform: `rotate(${deg}deg)`,
                  filter: 'drop-shadow(0 12px 26px rgba(0,0,0,0.45))',
                }}
              >
                <CursorFrost tone="white" size={SIZE} hollow={false} />
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                left: 16,
                top: 12,
                fontFamily: "'VIng-Chinese','Microsoft YaHei','PingFang SC',sans-serif",
                fontSize: 30,
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                position: 'absolute',
                right: 16,
                top: 18,
                fontFamily: "'VIng-Chinese','Microsoft YaHei','PingFang SC',sans-serif",
                fontSize: 18,
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {deg > 0 ? `+${deg}` : deg}°
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
