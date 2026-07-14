import React from "react";

interface SectionMarkProps {
  no: string;
  zh: string;
  en: string;
}

/**
 * SectionMark — programme-style section heading.
 * A copper movement number, the Chinese title, an English caption,
 * and a hairline that runs to the page edge.
 */
export default function SectionMark({ no, zh, en }: SectionMarkProps) {
  return (
    <div className="mb-12 flex items-baseline gap-5">
      <span className="font-display text-lg italic text-copper">{no}</span>
      <h2 className="text-2xl font-light tracking-[0.1em] text-parchment md:text-3xl">{zh}</h2>
      <span className="hidden font-mono text-[11px] tracking-[0.3em] text-parchment-faint sm:inline">
        {en}
      </span>
      <span className="ml-auto hidden h-px max-w-40 flex-1 bg-hairline md:block" />
    </div>
  );
}
