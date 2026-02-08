"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  rotateIntensity?: number;
}

export function ThreeDCard({
  children,
  className = "",
  rotateIntensity = 10,
}: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    setRotateX((-y / (rect.height / 2)) * rotateIntensity);
    setRotateY((x / (rect.width / 2)) * rotateIntensity);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="perspective-1000" style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
