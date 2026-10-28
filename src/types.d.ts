// Ambient types the browser libs and React don't ship.
export {};

declare global {
  interface Window {
    // Older Safari only exposes Web Audio under the prefixed name.
    webkitAudioContext?: typeof AudioContext;
  }
}

declare module "react" {
  // Allow CSS custom properties (e.g. `--shift`) in inline styles.
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
