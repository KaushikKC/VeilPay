"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface SparklesProps {
  children?: React.ReactNode;
  className?: string;
  count?: number;
  trigger?: boolean;
  color?: string;
}

export function Sparkles({
  children,
  className = "",
  count = 12,
  trigger = true,
  color = "#1bcc80",
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const generateSparkles = useCallback(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      delay: Math.random() * 0.5,
    }));
  }, [count]);

  useEffect(() => {
    if (trigger) {
      setSparkles(generateSparkles());
      const timer = setTimeout(() => setSparkles([]), 1500);
      return () => clearTimeout(timer);
    }
    setSparkles([]);
  }, [trigger, generateSparkles]);

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.svg
            key={sparkle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, delay: sparkle.delay }}
            className="pointer-events-none absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
            }}
            viewBox="0 0 24 24"
            fill={color}
          >
            <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  );
}
