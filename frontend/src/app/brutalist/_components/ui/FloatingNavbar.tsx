"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";

interface FloatingNavbarProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatingNavbar({ children, className = "" }: FloatingNavbarProps) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = lastScrollY;
    setLastScrollY(current);
    setScrolled(current > 50);

    if (current < 50) {
      setVisible(true);
      return;
    }

    if (current < prev) {
      setVisible(true);
    } else if (current > prev && current > 150) {
      setVisible(false);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 z-50 w-full transition-all ${
          scrolled
            ? "border-b border-white/5 bg-green-950/80 backdrop-blur-xl"
            : "bg-transparent"
        } ${className}`}
      >
        {children}
      </motion.nav>
    </AnimatePresence>
  );
}
