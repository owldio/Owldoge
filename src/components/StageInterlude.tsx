"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface StageInterludeProps {
  /** Path under /public of the stage photograph (or future showreel poster). */
  src: string;
  alt: string;
  /** Mono kicker above the caption. */
  kicker: string;
  /** Caption lines. */
  line1: string;
  line2?: string;
}

/**
 * StageInterlude — a quiet full-bleed interlude between programme sections.
 * The photograph settles open once as it enters view (a gentle clip + scale,
 * no scroll pinning), then holds still beneath the caption. Static under
 * prefers-reduced-motion.
 */
export default function StageInterlude({ src, alt, kicker, line1, line2 }: StageInterludeProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="grain relative overflow-hidden border-t border-hairline">
      <motion.div
        aria-hidden
        initial={reduceMotion ? undefined : { clipPath: "inset(10% 8% 10% 8%)", scale: 1.06 }}
        whileInView={reduceMotion ? undefined : { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image src={src} alt={alt} fill quality={75} sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-night/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-night/35" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-3xl px-5 py-36 text-center md:px-8 lg:py-52"
      >
        <p className="mb-6 font-mono text-[11px] tracking-[0.4em] text-copper">{kicker}</p>
        <h2 className="text-3xl font-extralight leading-snug tracking-[0.05em] text-parchment md:text-5xl md:leading-[1.35]">
          {line1}
          {line2 && (
            <>
              <br />
              {line2}
            </>
          )}
        </h2>
      </motion.div>
    </section>
  );
}
