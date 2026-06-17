import type { Metadata } from 'next';
import { Cormorant_Garamond, IBM_Plex_Mono, Noto_Serif_TC } from 'next/font/google';
import './globals.css';
import { defaultOgImage, siteDescription, siteName, siteUrl } from '@/lib/seo';

const displayLatin = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display-latin',
  display: 'swap',
});

const serifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-serif-tc',
  display: 'swap',
});

const monoLatin = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-latin',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: 'Owldio Studio | 音樂會錄影、錄音、直播與後製服務',
    template: '%s | Owldio Studio'
  },
  description: siteDescription,
  keywords: [
    '音樂會錄影',
    '音樂會錄音',
    '音樂會錄影錄音',
    '校園音樂會錄製',
    '學生演奏錄影',
    '學生音樂會錄影',
    '4K 錄影',
    '多軌錄音',
    '現場直播',
    '影片後製',
    '畢業音樂會錄影',
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
    title: 'Owldio Studio | 音樂會錄影、錄音、直播與後製服務',
    description: siteDescription,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Owldio Studio 音樂會錄影錄音服務',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Owldio Studio | 音樂會錄影、錄音、直播與後製服務',
    description: siteDescription,
    images: [defaultOgImage],
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
      image: `${siteUrl}/seo/owldio-music-production.png`,
      email: 'owldio.art@gmail.com',
      areaServed: 'Taiwan',
      serviceType: [
        '音樂會錄影',
        '音樂會錄音',
        '現場直播',
        '影片後製',
      ],
      "hasOfferCatalog": {
        '@type': 'OfferCatalog',
        name: '音樂會錄製服務',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '4K 音樂會錄影',
              description: '校園音樂會、畢業演奏與室內樂演出的 4K 多機位錄影服務。',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '多軌錄音',
              description: '現場多軌收音、混音與音檔整理交付。',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '現場直播與後製',
              description: '音樂會現場直播、影片剪輯、調色與成品交付。',
            },
          },
        ],
      },
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
    <html
      lang="zh-Hant"
      suppressHydrationWarning
      className={`${displayLatin.variable} ${serifTC.variable} ${monoLatin.variable}`}
    >
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
