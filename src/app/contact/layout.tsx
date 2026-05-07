import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '聯絡我們 — 音樂會錄影錄音免費諮詢',
  description: '聯絡 Owldio Studio 諮詢音樂會錄影錄音需求，包含 4K 錄影、多軌錄音、現場直播、影片後製與學生優惠方案。',
  path: '/contact',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
