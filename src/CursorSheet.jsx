import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CursorShape, CURSOR_VARIANTS} from './CursorVariants.jsx';

const FONT =
  "'VIng-Chinese','Microsoft YaHei','PingFang SC','Helvetica Neue','Segoe UI',Arial,sans-serif";

const COLS = CURSOR_VARIANTS.length;

export const CursorSheet = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0E0E12', fontFamily: FONT, overflow: 'hidden'}}>
      {/* 上半深色 / 下半浅色，同一造型亮暗各验一次 */}
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

      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 46,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 22,
        }}
      >
        <div style={{fontSize: 44, fontWeight: 600, color: '#FFFFFF', letterSpacing: 2}}>
          光标方案 · 5 选 1
        </div>
        <div style={{fontSize: 22, color: 'rgba(255,255,255,0.5)', letterSpacing: 3}}>
          ROUNDED iOS · LIQUID GLASS
        </div>
      </div>

      {/* 五列 */}
      <div style={{position: 'absolute', top: 130, left: 0, right: 0, bottom: 0, display: 'flex'}}>
        {CURSOR_VARIANTS.map((v) => (
          <div
            key={v.key}
            style={{
              width: 2400 / COLS,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* 编号 + 名称 */}
            <div style={{height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{fontSize: 26, letterSpacing: 6, color: 'rgba(255,255,255,0.34)'}}>{v.no}</div>
              <div style={{fontSize: 30, fontWeight: 600, color: '#FFFFFF', marginTop: 4, letterSpacing: 1}}>
                {v.name}
              </div>
            </div>

            {/* 深色背景 */}
            <div style={{height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CursorShape variant={v.key} height={250} />
            </div>

            {/* 浅色背景 */}
            <div style={{height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CursorShape variant={v.key} height={250} />
            </div>

            {/* 说明 */}
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
