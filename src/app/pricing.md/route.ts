import {
  addOns,
  baseDurationNote,
  formatTwd,
  standardPlans,
  studentCollaborationPlan,
} from "@/lib/pricing";
import { siteName, siteUrl } from "@/lib/seo";

export const revalidate = 86400;

export function GET() {
  const standardPlanSections = standardPlans
    .map(
      (plan) => `## ${plan.name}
- Price: ${formatTwd(plan.price)} 起
- Best for: ${plan.bestFor}
- Recording duration: 2 小時內
- Includes:
${plan.features.map((feature) => `  - ${feature}`).join("\n")}
- Quote URL: ${siteUrl}/contact?plan=${plan.contactValue}`,
    )
    .join("\n\n");

  const addOnLines = addOns
    .map((addOn) => {
      const price =
        addOn.amount === null
          ? addOn.unit
          : `${formatTwd(addOn.amount)}${addOn.unit ? ` ${addOn.unit}` : ""}`;
      return `- ${addOn.name}: ${price}`;
    })
    .join("\n");

  const body = `# ${siteName} Pricing

${standardPlanSections}

## ${studentCollaborationPlan.name}
- Price: ${formatTwd(studentCollaborationPlan.price)} 起
- Eligibility: 有效學生身分，並經後續書面確認作品展示授權合作條件
- Base configuration: 單機 4K 錄影與立體聲錄音
- Includes:
${studentCollaborationPlan.included.map((feature) => `  - ${feature}`).join("\n")}
- Important: 送出申請不會成立服務契約或作品展示授權
- Application URL: ${siteUrl}/contact?plan=${studentCollaborationPlan.contactValue}

## Add-ons
${addOnLines}

## Notes
- ${baseDurationNote}
- 公開價格是報價起點；場地、交通、編制、機位、收音與特殊交付需求可能影響正式報價。
- Website pricing page: ${siteUrl}/pricing
- Contact: service@owldio.art
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
