"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface HeroBackdropProps {
  /** Path under /public of the photograph to lay behind the hero. */
  src: string;
  /** Tailwind object-position class to tune the crop per page. */
  position?: string;
}

/**
 * HeroBackdrop — a full-bleed photograph laid behind a page hero,
 * dimmed with the night gradient so parchment text stays readable.
 * The photograph breathes: a slow Ken Burns settle on load and a gentle
 * parallax drift as the hero scrolls away (transform-only, honours
 * prefers-reduced-motion). Place inside a `relative overflow-hidden`
 * section, before a `relative z-10` content container.
 */
export default function HeroBackdrop({ src, position = "object-center" }: HeroBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden>
      <motion.div
        style={reduceMotion ? undefined : { y }}
        initial={reduceMotion ? undefined : { scale: 1.12 }}
        animate={reduceMotion ? undefined : { scale: 1.045 }}
        transition={{ duration: 9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          quality={70}
          sizes="100vw"
          className={`object-cover ${position}`}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/55" />
      <div className="absolute inset-0 bg-night/55" />
    </div>
  );
}
