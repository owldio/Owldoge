import { formatTwd, standardPlans, studentCollaborationPlan } from "@/lib/pricing";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 86400;

export function GET() {
  const planSummary = standardPlans
    .map((plan) => `- ${plan.name}: ${formatTwd(plan.price)} 起`)
    .join("\n");

  const body = `# ${siteName}

> ${siteDescription}

Owldio Studio 是台灣的音樂會錄影、錄音、直播與後製服務團隊，服務學生演出者、室內樂團、校園團體與小型演出主辦單位。

## Core pages
- [Home](${siteUrl}/)
- [Services](${siteUrl}/services)
- [Pricing](${siteUrl}/pricing)
- [Machine-readable pricing](${siteUrl}/pricing.md)
- [Student collaboration](${siteUrl}/student-projects)
- [Portfolio and production approach](${siteUrl}/portfolio)
- [Contact and quote request](${siteUrl}/contact)

## Public pricing
${planSummary}
- ${studentCollaborationPlan.name}: ${formatTwd(studentCollaborationPlan.price)} 起；須符合學生身分及後續書面授權合作條件

## Important commercial notes
- 所有公開價格均為起價，正式範圍依場地、時長、編制、機位、收音、交通與交付需求確認。
- 學生合作價不是一般折扣，而是有條件的作品展示授權合作。
- 送出詢價或學生方案申請，不代表服務契約、檔期保留、付款承諾或作品展示授權已成立。

## Contact
- [Email](mailto:service@owldio.art)
- [Website](${siteUrl}/contact)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
