import type { Metadata } from 'next';
import './globals.css';
import { siteDescription, siteName, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: 'Owldio Studio | 鴞聲音畫 — 音樂會錄音錄影工作室',
    template: '%s | Owldio Studio'
  },
  description: siteDescription,
  keywords: [
    '音樂會錄影',
    '音樂會錄音',
    '校園音樂會錄製',
    '學生演奏錄影',
    '4K 錄影',
    '多軌錄音',
    '現場直播',
    'Owldio',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
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
    url: siteUrl,
    siteName,
    title: 'Owldio Studio | 鴞聲音畫 — 音樂會錄音錄影工作室',
    description: siteDescription,
    images: [
      {
        url: '/owldio-logo.png',
        width: 1200,
        height: 630,
        alt: 'Owldio Studio 音樂會錄製服務',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Owldio Studio | 鴞聲音畫 — 音樂會錄音錄影工作室',
    description: siteDescription,
    images: ['/owldio-logo.png'],
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
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/owldio-logo.png`,
      image: `${siteUrl}/owldio-logo.png`,
      email: 'owldio.art@gmail.com',
      areaServed: 'Taiwan',
      serviceType: [
        '音樂會錄影',
        '音樂會錄音',
        '現場直播',
        '影片後製',
      ],
      sameAs: [
        'https://www.instagram.com/owldio.art/',
        'https://www.facebook.com/share/19xTqkqM9Y/?mibextid=wwXIfr',
        'https://youtube.com/@owldioart?si=ypYR6wo0a1LLiGeS',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
      inLanguage: 'zh-Hant',
      description: siteDescription,
    },
  ];

  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
