import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '服務項目 — 音樂會錄影、錄音、直播、後製',
  description: 'Owldio Studio 提供完整音樂會錄製服務：4K 音樂會錄影、多軌錄音、現場直播、影片後製與雲端交付，適合校園演出、畢業音樂會與室內樂。',
  path: '/services',
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
