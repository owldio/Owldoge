import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '服務項目 — 音樂會錄製、直播、後製',
  description: '提供完整音樂會錄製服務：4K高清錄影、多軌錄音、直播服務、後製發行。學生友善價格，快速交付。',
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}