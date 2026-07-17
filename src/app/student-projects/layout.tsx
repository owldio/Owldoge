import type { Metadata } from 'next';
import { createPageMetadata, studentOgImage } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '學生作品授權合作方案 — 校園音樂會錄影錄音',
  description: 'Owldio Studio 學生作品授權合作方案，提供單機 4K 錄影、立體聲錄音與基礎剪輯，適用於有效學生身分與作品展示授權合作。',
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
