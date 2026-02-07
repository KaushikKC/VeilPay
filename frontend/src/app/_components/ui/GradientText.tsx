"use client";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className = "",
  from = "#4ddb9a",
  via = "#1bcc80",
  to = "#15a366",
  animate = true,
}: GradientTextProps) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${animate ? "animate-gradient-shift bg-[length:200%_auto]" : ""} ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from}, ${via}, ${to}, ${from})`,
      }}
    >
      {children}
    </span>
  );
}
