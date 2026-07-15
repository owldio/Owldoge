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
      <span>公司名稱：鴞賦創造工作室</span>
      <span>
        統編：<span className="font-sans not-italic tracking-normal [font-family:Arial,Helvetica,sans-serif] [font-variant-numeric:normal]">61265436</span>
      </span>
    </div>
  );
}
