import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '作品與製作方式 — 音樂會錄影錄音案例說明',
  description: '了解 Owldio Studio 音樂會錄影錄音案例將如何呈現、不同機位與收音方式的差異，以及如何洽詢具授權的參考素材。',
  path: '/portfolio',
});

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
