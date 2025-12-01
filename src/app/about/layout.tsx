import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '關於我們 — 校園音樂會錄製專家',
  description: 'Owldio 是專注校園音樂會錄製的新創團隊，用心為每一場演出留下最珍貴的瞬間。專業設備、學生友善價格。',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}