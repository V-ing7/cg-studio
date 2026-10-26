import React from 'react';
import {registerRoot, Composition, AbsoluteFill} from 'remotion';
import './fonts.css';  /* 打包字体，消除跨机器字体差异 */
import {TitleBarGlass} from './TitleBarGlass.jsx';
import {CursorGlass} from './CursorGlass.jsx';
import {CursorSheet} from './CursorSheet.jsx';
import {CursorFrostSheet} from './CursorFrostSheet.jsx';
import {CursorFrostAnim} from './CursorFrostAnim.jsx';
import {CursorPanelAnim} from './CursorPanelAnim.jsx';
import {RotationSheet} from './RotationSheet.jsx';
import {OrientationPicker} from './OrientationPicker.jsx';
import {FrostPanelPicker} from './FrostPanelPicker.jsx';

const TitleBarPreview = ({bg = '#101014', ...rest}) => (
  <AbsoluteFill style={{backgroundColor: bg}}>
    <TitleBarGlass {...rest} />
  </AbsoluteFill>
);

const CursorPreview = ({bg = '#151518', ...rest}) => (
  <AbsoluteFill style={{backgroundColor: bg}}>
    <CursorGlass {...rest} />
  </AbsoluteFill>
);

const Root = () => {
  return (
    <>
      <Composition
        id="TitleBarGlass"
        component={TitleBarGlass}
        durationInFrames={120}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          title: '透明图层 · 视频包装',
          eyebrow: 'CG LIBRARY · 微影 V-ing',
          tag: 'V-ING CG',
          width: 1180,
          height: 232,
          radius: 44,
          scale: 2,
        }}
      />
      <Composition
        id="TitleBarPreview"
        component={TitleBarPreview}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: '透明图层 · 视频包装',
          eyebrow: 'CG LIBRARY · 微影 V-ing',
          tag: 'V-ING CG',
          width: 1180,
          height: 232,
          radius: 44,
          bg: '#101014',
        }}
      />
      <Composition
        id="CursorGlass"
        component={CursorGlass}
        durationInFrames={120}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{}}
      />
      <Composition
        id="CursorPreview"
        component={CursorPreview}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{bg: '#151518'}}
      />
      <Composition
        id="CursorSheet"
        component={CursorSheet}
        durationInFrames={30}
        fps={30}
        width={2400}
        height={1300}
      />
      <Composition
        id="CursorFrostSheet"
        component={CursorFrostSheet}
        durationInFrames={30}
        fps={30}
        width={2400}
        height={1300}
      />
      <Composition
        id="CursorFrostSolid"
        component={CursorFrostAnim}
        durationInFrames={120}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{hollow: false}}
      />
      <Composition
        id="CursorFrostHollow"
        component={CursorFrostAnim}
        durationInFrames={120}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{hollow: true}}
      />
      <Composition
        id="CursorFrostPreview"
        component={CursorFrostAnim}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{hollow: false, ratio: 0.15, bg: '#151619'}}
      />
      <Composition
        id="CursorPanel"
        component={CursorPanelAnim}
        durationInFrames={405}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{hollow: false, ratio: 0.026}}
      />
      <Composition
        id="CursorPanelPreview"
        component={CursorPanelAnim}
        durationInFrames={405}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{hollow: false, ratio: 0.043, bg: '#151619'}}
      />
      <Composition
        id="CursorPanelLight"
        component={CursorPanelAnim}
        durationInFrames={405}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{hollow: false, ratio: 0.043, bg: '#F0F1F5'}}
      />
      <Composition
        id="RotationSheet"
        component={RotationSheet}
        durationInFrames={30}
        fps={30}
        width={2400}
        height={760}
      />
      <Composition
        id="OrientationPicker"
        component={OrientationPicker}
        durationInFrames={30}
        fps={30}
        width={2400}
        height={1620}
      />
      <Composition
        id="FrostPanelPicker"
        component={FrostPanelPicker}
        durationInFrames={30}
        fps={30}
        width={3840}
        height={2160}
      />
    </>
  );
};

registerRoot(Root);
