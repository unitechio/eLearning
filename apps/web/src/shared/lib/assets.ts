export type ImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
};

const REMOTE_IMAGE_HOSTS = ['images.unsplash.com', 'plus.unsplash.com'];

export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="%23eef2f7"/><path d="M146 304h348L383 184l-78 82-48-54z" fill="%23cbd5e1"/><circle cx="220" cy="150" r="36" fill="%23dbe3ee"/></svg>';

export function buildImageURL(src?: string | null, options: ImageTransformOptions = {}) {
  if (!src) return FALLBACK_IMAGE;
  try {
    const url = new URL(src);
    if (REMOTE_IMAGE_HOSTS.includes(url.hostname)) {
      if (options.width) url.searchParams.set('w', String(options.width));
      if (options.height) url.searchParams.set('h', String(options.height));
      url.searchParams.set('q', String(options.quality ?? 78));
      url.searchParams.set('auto', 'format');
      if (!url.searchParams.has('fit')) url.searchParams.set('fit', 'crop');
      return url.toString();
    }
  } catch {
    return src;
  }
  return src;
}

export function buildSrcSet(src?: string | null, widths: number[] = [320, 480, 768, 1024]) {
  if (!src) return undefined;
  return widths.map((width) => `${buildImageURL(src, { width })} ${width}w`).join(', ');
}

export function getAssetKindFromMime(mimeType?: string) {
  if (!mimeType) return 'file';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'file';
}

export function shouldPreloadMedia(index: number, explicitPriority?: boolean) {
  return explicitPriority || index < 2;
}
