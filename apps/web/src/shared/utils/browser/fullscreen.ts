type FullscreenElement = Element & {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
};

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
};

/**
 * Returns whether the document is currently in fullscreen mode.
 *
 * @example
 * isFullscreen() // false
 */
export function isFullscreen(): boolean {
  const doc = document as FullscreenDocument;
  return !!(doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.mozFullScreenElement);
}

/**
 * Requests fullscreen for a given element.
 * Defaults to `document.documentElement` if no element is provided.
 *
 * @example
 * await enterFullscreen()
 * await enterFullscreen(document.getElementById('video')!)
 */
export async function enterFullscreen(element?: Element): Promise<void> {
  const el = (element ?? document.documentElement) as FullscreenElement;
  if (el.requestFullscreen) {
    await el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    await el.webkitRequestFullscreen();
  } else if (el.mozRequestFullScreen) {
    await el.mozRequestFullScreen();
  }
}

/**
 * Exits fullscreen mode.
 *
 * @example
 * await exitFullscreen()
 */
export async function exitFullscreen(): Promise<void> {
  const doc = document as FullscreenDocument;
  if (doc.exitFullscreen) {
    await doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    await doc.webkitExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    await doc.mozCancelFullScreen();
  }
}

/**
 * Toggles fullscreen mode for a given element.
 *
 * @example
 * await toggleFullscreen()
 */
export async function toggleFullscreen(element?: Element): Promise<void> {
  if (isFullscreen()) {
    await exitFullscreen();
  } else {
    await enterFullscreen(element);
  }
}
