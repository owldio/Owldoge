import type { Metadata } from "next";

export const siteUrl = "https://www.owldio.art";
export const siteName = "Owldio Studio";
export const siteDescription =
  "專業音樂會錄影、錄音、直播與後製服務。Owldio Studio 提供 4K 錄影、多軌錄音、現場直播、影片剪輯與學生音樂會優惠方案，讓每一場演出都留下完整作品。";

const ogImage = "/seo/owldio-music-production.png";
export const defaultOgImage = ogImage;
export const studentOgImage = "/seo/owldio-student-discount.png";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
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
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteName} 音樂會錄影錄音服務`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [image],
    },
  };
}
