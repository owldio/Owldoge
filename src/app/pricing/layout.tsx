import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '價格方案 — 音樂會錄影錄音與學生合作方案',
  description: '查看 Owldio Studio 音樂會錄影錄音價格方案，包含 4K 錄影、立體聲與多軌錄音、現場直播、後製交付及學生作品授權合作方案。',
  path: '/pricing',
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
