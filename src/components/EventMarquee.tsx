import React from "react";

const defaultItems = [
  "畢業音樂會",
  "獨奏會",
  "室內樂",
  "合唱團",
  "管弦樂團",
  "聲樂",
  "鋼琴獨奏",
  "弦樂重奏",
  "成果發表",
  "作品集錄製",
];

interface EventMarqueeProps {
  items?: string[];
}

/**
 * EventMarquee — a slow, tape-label ticker of the performance types Owldio
 * records, drifting between sections. Content is duplicated once so the
 * -50% keyframe loops seamlessly; pauses on hover, freezes under
 * prefers-reduced-motion (global rule).
 */
export default function EventMarquee({ items = defaultItems }: EventMarqueeProps) {
  const row = [...items, ...items];
  return (
    <div aria-hidden className="overflow-hidden border-b border-hairline bg-night-deep/60 py-4">
      <div className="marquee-track flex w-max items-center gap-8">
        {row.map((item, index) => (
          <React.Fragment key={`${item}-${index}`}>
            <span className="whitespace-nowrap font-mono text-[11px] tracking-[0.35em] text-parchment-faint">
              {item}
            </span>
            <span className="text-copper">·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
