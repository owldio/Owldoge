export const staticImageWidths = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920];
export const staticImageQuality = 78;

export default function staticImageLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith('/') || src.startsWith('//') || src.includes('..') || /[?#]/.test(src)) {
    throw new Error(`Static export requires a local public image: ${src}`);
  }
  if (/\.svg$/i.test(src)) return src;
  if (!staticImageWidths.includes(width)) {
    throw new Error(`Unsupported static image width: ${width}`);
  }
  return `/_images${src}.w${width}.webp`;
}
