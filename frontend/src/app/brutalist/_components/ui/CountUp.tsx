"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function CountUp({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.5,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  const prevTargetRef = useRef(0);
  const hasAnimatedIn = useRef(false);

  useEffect(() => {
    if (!isInView) return;

    const from = hasAnimatedIn.current ? prevTargetRef.current : 0;
    prevTargetRef.current = target;
    hasAnimatedIn.current = true;

    const startTime = Date.now();
    const durationMs = duration * 1000;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className={className}
    >
      {prefix}
      {formatted}
      {suffix}
    </motion.span>
  );
}
