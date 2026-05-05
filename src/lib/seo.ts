import type { Metadata } from "next";

export const siteUrl = "https://www.owldio.art";
export const siteName = "Owldio Studio";
export const siteDescription =
  "專業校園音樂會錄製服務。提供 4K 高清錄影、多軌錄音、現場直播與後製服務。學生友善價格，讓每一場演出都留下專業作品。";

const ogImage = "/owldio-logo.png";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: path,
      siteName,
      locale: "zh_TW",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} 音樂會錄製服務`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage],
    },
  };
}

