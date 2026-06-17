import { cn } from "@/lib/utils";

type FooterLegalProps = {
  className?: string;
};

export default function FooterLegal({ className }: FooterLegalProps) {
  return (
    <div
      aria-label="公司登記資訊"
      className={cn(
        "flex flex-col gap-1 font-serif text-xs font-normal leading-relaxed tracking-normal",
        className,
      )}
    >
      <span>公司名稱：鴞賦創造工作室</span>
      <span>統編：61265436</span>
    </div>
  );
}
