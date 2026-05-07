import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '作品集 — 音樂會錄影錄音作品展示',
  description: '瀏覽 Owldio Studio 音樂會錄影錄音作品，包含校園音樂會、畢業演奏、室內樂與多機位 4K 錄影成品。',
  path: '/portfolio',
});

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
