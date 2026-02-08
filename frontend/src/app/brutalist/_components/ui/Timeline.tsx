"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TimelineItem {
  number: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-16">
      {/* Background line */}
      <div className="absolute left-6 top-0 h-full w-px bg-white/5 sm:left-8" />

      {/* Animated fill line */}
      <motion.div
        className="absolute left-6 top-0 w-px bg-gradient-to-b from-green-500 via-green-400 to-green-500/50 sm:left-8"
        style={{ height: lineHeight }}
      />

      {items.map((item, i) => (
        <motion.div
          key={item.number}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          className="flex items-start gap-6 sm:gap-8"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 + 0.2 }}
            className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-green-500/40 bg-green-950 shadow-lg shadow-green-500/10 sm:h-16 sm:w-16"
          >
            <span className="font-display text-lg tracking-wider text-green-400 sm:text-xl">
              {item.number}
            </span>
          </motion.div>
          <div className="pt-1 sm:pt-3">
            <h3 className="font-display text-xl tracking-wider text-white sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 leading-relaxed text-white/50">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
