"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  autoStart?: boolean;
  revealOnView?: boolean;
  trigger?: number;
  triggerOnHover?: boolean;
  onComplete?: () => void;
  characters?: string;
}

export function DecryptedText({
  text,
  className = "",
  speed = 30,
  delay = 0,
  autoStart = true,
  revealOnView = true,
  trigger,
  triggerOnHover = false,
  onComplete,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*",
}: DecryptedTextProps) {
  const [displayed, setDisplayed] = useState(text);
  const [started, setStarted] = useState(false);
  const hasRunOnce = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hoverTriggerCount = useRef(0);

  // Initial auto-start reveal (first load)
  useEffect(() => {
    if (!autoStart || hasRunOnce.current) return;

    if (!revealOnView) {
      const timer = setTimeout(() => {
        setStarted(true);
        hasRunOnce.current = true;
      }, delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => {
            setStarted(true);
            hasRunOnce.current = true;
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [autoStart, delay, revealOnView]);

  // Re-trigger scramble when trigger prop changes
  useEffect(() => {
    if (trigger === undefined || trigger === 0) return;
    hasRunOnce.current = true;
    setStarted(false);
    setDisplayed(
      text
        .split("")
        .map((char) =>
          char === " "
            ? " "
            : characters[Math.floor(Math.random() * characters.length)]!,
        )
        .join(""),
    );
    const timer = setTimeout(() => setStarted(true), 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when trigger changes
  }, [trigger]);

  // Run the decrypt animation
  useEffect(() => {
    if (!started) return;

    let revealedCount = 0;
    const interval = setInterval(() => {
      revealedCount++;
      if (revealedCount > text.length) {
        clearInterval(interval);
        setDisplayed(text);
        onComplete?.();
        return;
      }

      setDisplayed(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < revealedCount) return text[i]!;
            return characters[Math.floor(Math.random() * characters.length)]!;
          })
          .join(""),
      );
    }, speed);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onComplete intentionally omitted to avoid restarting animation
  }, [started, text, speed, characters]);

  const handleMouseEnter = () => {
    if (!triggerOnHover) return;
    hoverTriggerCount.current++;
    setStarted(false);
    setDisplayed(
      text
        .split("")
        .map((char) =>
          char === " "
            ? " "
            : characters[Math.floor(Math.random() * characters.length)]!,
        )
        .join(""),
    );
    setTimeout(() => setStarted(true), 50);
  };

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: autoStart ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
      onMouseEnter={handleMouseEnter}
    >
      {displayed}
    </motion.span>
  );
}
