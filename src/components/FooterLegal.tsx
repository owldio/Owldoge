import { cn } from "@/lib/utils";

type FooterLegalProps = {
  className?: string;
};

export default function FooterLegal({ className }: FooterLegalProps) {
  return (
    <div
      aria-label="公司登記資訊"
      className={cn(
        "flex flex-col gap-1 font-sans text-xs font-normal leading-relaxed tracking-normal not-italic",
        className,
      )}
    >
      <span>鴞賦創造工作室｜61265436</span>
    </div>
  );
}
