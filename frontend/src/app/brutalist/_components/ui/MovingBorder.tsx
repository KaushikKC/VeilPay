"use client";

import { useRef, useEffect } from "react";

interface MovingBorderProps {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
  duration?: number;
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
}

export function MovingBorder({
  children,
  className = "",
  borderClassName = "",
  duration = 3000,
  as: Component = "button",
  href,
  onClick,
}: MovingBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let lastTime: number | null = null;

    const animate = (time: number) => {
      lastTime ??= time;
      const delta = time - lastTime;
      lastTime = time;

      angleRef.current = (angleRef.current + (delta / duration) * 360) % 360;

      if (containerRef.current) {
        containerRef.current.style.setProperty(
          "--border-angle",
          `${angleRef.current}deg`
        );
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration]);

  const componentProps = {
    className: `relative inline-flex overflow-hidden rounded-full p-[2px] ${borderClassName}`,
    ...(Component === "a" ? { href } : {}),
    ...(onClick ? { onClick } : {}),
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Component {...(componentProps as any)}>
      {/* Static base border */}
      <div className="absolute inset-0 rounded-full bg-green-500/20" />

      {/* Animated highlight sweep */}
      <div
        ref={containerRef}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from var(--border-angle, 0deg), transparent 40%, rgba(27,204,128,0.8) 50%, transparent 60%)",
        }}
      />

      <span
        className={`relative z-10 flex items-center justify-center rounded-full bg-green-950 ${className}`}
      >
        {children}
      </span>
    </Component>
  );
}
