import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

const contactPage = read("src/app/contact/page.tsx");
const pricingPage = read("src/app/pricing/page.tsx");
const studentPage = read("src/app/student-projects/page.tsx");
const homePage = read("src/app/page.tsx");
const portfolioPage = read("src/app/portfolio/page.tsx");
const portfolioLayout = read("src/app/portfolio/layout.tsx");
const footerLegal = read("src/components/FooterLegal.tsx");
const siteFooter = read("src/components/SiteFooter.tsx");
const sitemapConfig = read("next-sitemap.config.js");
const pricingMarkdownRoute = read("src/app/pricing.md/route.ts");
const llmsRoute = read("src/app/llms.txt/route.ts");

test("pricing choices survive the trip into the contact form", () => {
  assert.match(pricingPage, /href=\{`\/contact\?plan=\$\{plan\.contactValue\}`\}/);
  assert.match(
    studentPage,
    /href=\{`\/contact\?plan=\$\{studentCollaborationPlan\.contactValue\}`\}/,
  );
  assert.match(contactPage, /new URLSearchParams\(window\.location\.search\)\.get\("plan"\)/);
  assert.match(contactPage, /requestedPlan === studentCollaborationPlan\.contactValue/);
  assert.match(contactPage, /generalContactPlans\.some\(\(plan\) => plan\.value === requestedPlan\)/);
});

test("quote request uses a two-step flow without dropping application safeguards", () => {
  assert.match(contactPage, /type FormStep = 1 \| 2/);
  assert.match(contactPage, /STEP \{formStep\} \/ 2/);
  assert.match(contactPage, /continueToDetails/);
  assert.match(contactPage, /formRef\.current\?\.reportValidity\(\)/);
  assert.match(contactPage, /製作細節 · PRODUCTION DETAILS/);
  assert.match(contactPage, /STUDENT_APPLICATION_ACKNOWLEDGMENT/);
  assert.match(contactPage, /studentAuthorizationCompleted: false/);
  assert.match(contactPage, /name="applicationNoticeAccepted"/);
});

test("homepage makes the service category visible without waiting for hero animation", () => {
  assert.match(homePage, /音樂會錄影、錄音與後製服務/);
  assert.match(homePage, /DeferredInkBackground/);
  assert.doesNotMatch(
    homePage,
    /<motion\.p[\s\S]{0,250}OWLDIO STUDIO — 音樂會錄影/,
  );
});

test("portfolio page is honest while public cases are pending", () => {
  assert.match(portfolioPage, /公開案例仍在整理與確認授權中/);
  assert.match(portfolioPage, /靜態案例不會被當成影音品質證明/);
  assert.match(portfolioPage, /若有合適且可分享的素材/);
  assert.match(portfolioLayout, /作品與製作方式/);
  assert.doesNotMatch(portfolioLayout, /瀏覽 Owldio Studio 音樂會錄影錄音作品/);
});

test("footer legal information stays quiet but meets the intended readable treatment", () => {
  assert.match(footerLegal, /text-\[11px\]/);
  assert.match(footerLegal, /text-parchment-dim/);
  assert.doesNotMatch(siteFooter, /FooterLegal className="[^"]*opacity-60/);
});

test("machine-readable routes share canonical pricing and sitemap dates are not fabricated", () => {
  for (const route of [pricingMarkdownRoute, llmsRoute]) {
    assert.match(route, /@\/lib\/pricing/);
    assert.doesNotMatch(route, /(?:7800|14800|21200|3300)/);
  }

  assert.match(pricingMarkdownRoute, /Content-Type": "text\/markdown; charset=utf-8"/);
  assert.match(llmsRoute, /Content-Type": "text\/plain; charset=utf-8"/);
  assert.match(llmsRoute, /\[Home\]\(\$\{siteUrl\}\/\)/);
  assert.match(sitemapConfig, /autoLastmod: false/);
  assert.doesNotMatch(sitemapConfig, /lastmod:\s*new Date/);
});

test("home avoids loading the large Noto Serif TC webfont bundle", () => {
  const layout = read("src/app/layout.tsx");
  const globals = read("src/app/globals.css");

  assert.doesNotMatch(layout, /Noto_Serif_TC/);
  assert.match(globals, /"Noto Serif TC", "Source Han Serif TC"/);
});

test("pricing FAQ markup mirrors the visible FAQ source", () => {
  assert.match(pricingPage, /"@type": "FAQPage"/);
  assert.match(pricingPage, /mainEntity: faqs\.map/);
  assert.match(pricingPage, /JSON\.stringify\(faqStructuredData\)/);
});
