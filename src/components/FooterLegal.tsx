import { cn } from "@/lib/utils";

type FooterLegalProps = {
  className?: string;
};

export default function FooterLegal({ className }: FooterLegalProps) {
  return (
    <div
      aria-label="公司登記資訊"
      className={cn(
        "flex w-fit flex-col items-end gap-1 text-right text-[11px] font-normal leading-relaxed text-parchment-dim not-italic",
        className,
      )}
    >
      <span>
        <span className="font-serif tracking-[0.08em]">鴞賦創造工作室</span>
        <span className="font-mono tracking-[0.04em]">｜61265436</span>
      </span>
    </div>
  );
}
