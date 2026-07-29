"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const InkBackground = dynamic(() => import("@/components/InkBackground"), {
  ssr: false,
});

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/**
 * Defers the decorative WebGL mist until after the hero has rendered.
 * The photograph remains the complete visual on mobile and reduced-motion
 * devices, keeping the primary content independent from this enhancement.
 */
export default function DeferredInkBackground() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const canEnhance = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    ).matches;

    if (!canEnhance) {
      return;
    }

    const idleWindow = window as IdleWindow;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    let idleHandle: number | undefined;

    const reveal = () => setShouldRender(true);

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(reveal, { timeout: 1800 });
    } else {
      timeoutHandle = setTimeout(reveal, 1200);
    }

    return () => {
      if (idleHandle !== undefined) {
        idleWindow.cancelIdleCallback?.(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return <InkBackground />;
}
