"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface StepBeamProps {
  /** Seconds before the beam begins to draw. */
  delay?: number;
}

/**
 * StepBeam — a copper beam that draws itself down a process step's left
 * rule as it scrolls into view, lighting the movement up. Place inside a
 * `relative` step article that carries the hairline border.
 */
export default function StepBeam({ delay = 0 }: StepBeamProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      initial={reduceMotion ? { opacity: 0 } : { scaleY: 0 }}
      whileInView={reduceMotion ? { opacity: 1 } : { scaleY: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -left-px top-0 h-full w-px origin-top bg-gradient-to-b from-copper via-copper/70 to-copper/15"
    />
  );
}
