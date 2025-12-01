import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '聯絡我們 — 免費諮詢音樂會錄製',
  description: '聯絡 Owldio 團隊獲取免費諮詢服務。提供全方位音樂會錄製解決方案，24小時內快速回覆。',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}