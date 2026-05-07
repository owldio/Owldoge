import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '價格方案 — 音樂會錄影錄音與學生優惠',
  description: '查看 Owldio Studio 音樂會錄影錄音價格方案，包含學生優惠、4K 錄影、多軌錄音、現場直播與後製交付。',
  path: '/pricing',
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
