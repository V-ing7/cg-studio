import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CursorFrost, FROST_VARIANTS} from './CursorFrost.jsx';

const FONT =
  "'VIng-Chinese','Microsoft YaHei','PingFang SC','Helvetica Neue','Segoe UI',Arial,sans-serif";

const COLS = FROST_VARIANTS.length;

export const CursorFrostSheet = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0E0E12', fontFamily: FONT, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 655,
          background: 'linear-gradient(160deg, #101016 0%, #1B1B23 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 655,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(160deg, #EDEEF3 0%, #F9F9FC 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 44,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 22,
        }}
      >
        <div style={{fontSize: 42, fontWeight: 600, color: '#FFFFFF', letterSpacing: 2}}>
          毛玻璃光标 · 基于你的指针轮廓
        </div>
        <div style={{fontSize: 21, color: 'rgba(255,255,255,0.5)', letterSpacing: 3}}>
          FROSTED GLASS · TRANSPARENT
        </div>
      </div>

      <div style={{position: 'absolute', top: 128, left: 0, right: 0, bottom: 0, display: 'flex'}}>
        {FROST_VARIANTS.map((v) => (
          <div
            key={v.key}
            style={{
              width: 2400 / COLS,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{height: 108, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{fontSize: 24, letterSpacing: 6, color: 'rgba(255,255,255,0.34)'}}>{v.no}</div>
              <div style={{fontSize: 30, fontWeight: 600, color: '#FFFFFF', marginTop: 4}}>{v.name}</div>
            </div>

            <div style={{height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CursorFrost tone={v.key} size={330} />
            </div>

            <div style={{height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CursorFrost tone={v.key} size={330} />
            </div>

            <div
              style={{
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 26,
                paddingRight: 26,
              }}
            >
              <div style={{fontSize: 22, color: 'rgba(20,20,26,0.62)', letterSpacing: 1, textAlign: 'center', lineHeight: 1.5}}>
                {v.note}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
