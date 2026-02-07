"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, []);

  const onPointerUp = useCallback(() => {
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  const onPointerOut = useCallback(() => {
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (pointerInteracting.current !== null && e.touches[0]) {
      const delta = e.touches[0].clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = 0;
    const canvas = canvasRef.current;

    const onResize = () => {
      if (canvas) width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 0,
      mapSamples: 16000,
      mapBrightness: 12,
      mapBaseBrightness: 0,
      baseColor: [1, 1, 1],
      markerColor: [1, 1, 1],
      glowColor: [1, 1, 1],
      scale: 0.92,
      offset: [0, 0],
      markers: [
        // Major financial cities
        { location: [51.5074, -0.1278], size: 0.05 }, // London
        { location: [40.7128, -74.006], size: 0.05 }, // New York
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
        { location: [22.3193, 114.1694], size: 0.05 }, // Hong Kong
        { location: [47.3769, 8.5417], size: 0.05 }, // Zurich
        { location: [48.8566, 2.3522], size: 0.05 }, // Paris
        { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco
        { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
        { location: [52.52, 13.405], size: 0.05 }, // Berlin
        { location: [55.7558, 37.6173], size: 0.05 }, // Moscow
        { location: [19.076, 72.8777], size: 0.05 }, // Mumbai
        { location: [-23.5505, -46.6333], size: 0.05 }, // Sao Paulo
        { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
        { location: [13.7563, 100.5018], size: 0.05 }, // Bangkok
      ],
      opacity: 0.9,
      onRender: (state) => {
        state.phi = phiRef.current + pointerInteractionMovement.current / 200;
        phiRef.current += 0.003;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (canvas) canvas.style.opacity = "1";
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-black"
        style={{ width: "92%", height: "92%" }}
      />
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerOut={onPointerOut}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
