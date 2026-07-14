"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealLineProps {
  children: React.ReactNode;
  /** Seconds before this line begins to rise. */
  delay?: number;
  /** Classes applied to the text itself (size, colour, font). */
  className?: string;
}

/**
 * RevealLine — a hero headline line that rises from behind its baseline,
 * like a programme title emerging from the fold. Falls back to a plain
 * fade when the visitor prefers reduced motion.
 */
export function RevealLine({ children, delay = 0, className = "" }: RevealLineProps) {
  const reduceMotion = useReducedMotion();
  return (
    <span className="-mb-[0.12em] block overflow-hidden">
      <motion.span
        initial={reduceMotion ? { opacity: 0 } : { y: "112%" }}
        animate={reduceMotion ? { opacity: 1 } : { y: "0%" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`block pb-[0.12em] ${className}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

interface HeroRuleProps {
  /** Seconds before the rule begins to draw. */
  delay?: number;
}

/**
 * HeroRule — a short copper hairline that draws itself across beneath the
 * hero kicker, echoing the programme's printed rules.
 */
export function HeroRule({ delay = 0.45 }: HeroRuleProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      initial={reduceMotion ? { opacity: 0 } : { scaleX: 0 }}
      animate={reduceMotion ? { opacity: 1 } : { scaleX: 1 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 block h-px w-24 origin-left bg-copper/70"
    />
  );
}
