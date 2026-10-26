const {Config} = require('@remotion/cli/config');

/**
 * Remotion 渲染配置（跨机器像素级一致锁死）
 *
 * 关键：所有机器必须用同一份配置文件，否则 scale/concurrency 不同
 * 会导致 SVG 抗锯齿、feTurbulence 种子噪声、Canvas 亚像素渲染全变。
 */

// 强制 scale=1：禁用 HiDPI 自动缩放，所有机器统一用 1x 渲染。
// 不同电脑系统 DPI 不同（100%/125%/150%），会导致 Canvas 抗锯齿差异。
Config.setScale(1);

// 固定并发数：多进程并发渲染可能产生细微的 ffmpeg 输出差异。
// 单进程最稳。如果渲染速度太慢可以改成 2，先确认输出一致再放开。
Config.setConcurrency(1);

// ffmpeg 路径不显式指定，让 Remotion 用内置的那套。
// 只要 package-lock.json 一致，内置 ffmpeg 版本就一致。

Config.setVideoImageFormat('png');

console.log('[remotion.config.js] scale=1, concurrency=1 已锁定');
