import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '服務項目 — 音樂會錄影、錄音、直播、後製',
  description: 'Owldio Studio 提供完整音樂會錄製服務：單機或多機位 4K 錄影、立體聲與多軌錄音、現場直播、客供素材後製與雲端交付。',
  path: '/services',
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
