import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '關於我們 — 校園音樂會錄影錄音團隊',
  description: 'Owldio Studio 是專注校園音樂會錄影錄音的新創團隊，提供 4K 錄影、多軌錄音、直播與後製，協助學生與演出者留下專業作品。',
  path: '/about',
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
