import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.owldio.art'),
  title: {
    default: 'Owldio Studio | 鴞聲音畫 — 音樂會錄音錄影工作室',
    template: '%s | Owldio Studio'
  },
  description: '專業校園音樂會錄製服務。提供 4K 高清錄影、多軌錄音、後製服務。學生友善價格，72 小時快交。為你的音樂注入專業品質。',
  icons: {
    icon: '/Owldio.svg',
    shortcut: '/favicon.ico',
    apple: '/owldio-logo.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://www.owldio.art',
    siteName: 'Owldio Studio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
