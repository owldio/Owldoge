import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Owldio — 校園音樂會錄音錄影',
  description: '學生友善、4K 製作、多軌錄音、72 小時快交可選',
  icons: {
    icon: '/Owldio.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
