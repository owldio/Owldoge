import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '價格方案 — 音樂會錄製學生優惠方案',
  description: '查看 Owldio 音樂會錄製服務完整價格。學生優惠方案、8折優惠，從 NT$7,800 起。包含 4K 錄影、多軌錄音、後製服務。',
  path: '/pricing',
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
