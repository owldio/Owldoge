import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '學生優惠方案 — 8折優惠音樂會錄製',
  description: '專為學生推出的優惠方案！憑學生證享全方案 8 折優惠。提供 4K 錄影、多軌錄音、後製服務，讓學生也能享受專業品質。',
};

export default function StudentProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}