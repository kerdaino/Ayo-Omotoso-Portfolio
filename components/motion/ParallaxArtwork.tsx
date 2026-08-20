"use client";

import type { PointerEvent, ReactNode } from "react";

type ParallaxArtworkProps = {
  children: ReactNode;
  className?: string;
};

export function ParallaxArtwork({
  children,
  className = "",
}: ParallaxArtworkProps) {
  const classes = ["hero-artwork", className].filter(Boolean).join(" ");

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    event.currentTarget.style.setProperty("--pointer-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--pointer-y", y.toFixed(3));
  }

  function resetPointer(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.removeProperty("--pointer-x");
    event.currentTarget.style.removeProperty("--pointer-y");
  }

  return (
    <div
      className={classes}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      {children}
    </div>
  );
}
