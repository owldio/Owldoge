import type { Metadata } from 'next';
import { createPageMetadata, studentOgImage } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '學生優惠方案 — 校園音樂會錄影錄音 8 折',
  description: 'Owldio Studio 學生音樂會錄影錄音優惠方案，提供 4K 錄影、多軌錄音、現場直播與後製交付，憑學生證享專屬折扣。',
  path: '/student-projects',
  image: studentOgImage,
});

export default function StudentProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
