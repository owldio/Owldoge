import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '作品集 — 校園音樂會錄製作品展示',
  description: '欣賞 Owldio 精心錄製的校園音樂會作品。包含獲獎音樂會、畢業演奏、室內樂等多種類型精彩演出。',
  path: '/portfolio',
});

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
