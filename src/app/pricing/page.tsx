"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import SectionMark from "@/components/SectionMark";
import HeroBackdrop from "@/components/HeroBackdrop";
import { RevealLine, HeroRule } from "@/components/HeroReveal";
import {
  addOns,
  baseDurationNote,
  formatTwd,
  standardPlans,
  studentAuthorizationNote,
  studentCollaborationPlan,
} from "@/lib/pricing";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, margin: "-80px" } as const;

const comparisonRows = [
  ["錄影品質", "4K", "4K", "4K"],
  ["機位數量", "1", "2", "3"],
  ["錄音方式", "基礎立體聲", "進階立體聲", "多軌錄音"],
  ["錄製時長", "2 小時內", "2 小時內", "2 小時內"],
  ["音頻後製", "✓", "✓", "✓"],
  ["色彩校正", "基本", "基本", "進階"],
  ["特殊需求處理（加值）", "✓", "✓", "✓"],
  ["交付格式", "YouTube + 雲端", "YouTube + 雲端", "YouTube + 雲端"],
];

const faqs = [
  { q: "學生合作方案有哪些內容？", a: `持有效學生證並參與作品展示授權合作，可申請 ${formatTwd(studentCollaborationPlan.price)} 起的單機錄音錄影方案；授權範圍將於預約確認時另行以書面約定。` },
  { q: "錄製當天需要準備什麼？", a: "我們會提供所有專業設備，您只需準備好演出內容即可。" },
  { q: "後製交付需要多長時間？", a: "一般作業時間為 7–10 個工作天，急件可選擇 72 小時快交服務。" },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function PricingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-parchment">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Navigation currentPage="pricing" />

      <main>
        {/* ============ Hero ============ */}
        <section className="grain relative overflow-hidden border-b border-hairline">
          <HeroBackdrop src="/pic/IMG_9084.JPG" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-40 md:px-8 lg:pb-28 lg:pt-52">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-7 font-mono text-[12px] tracking-[0.4em] text-copper-bright"
            >
              PRICING — 價目方案
            </motion.p>
            <HeroRule />
            <h1 className="mb-8 font-serif font-extralight leading-[1.1] text-parchment">
              <RevealLine delay={0.2} className="text-[clamp(2.6rem,7vw,6rem)]">
                透明定價
              </RevealLine>
              <RevealLine delay={0.38} className="text-[clamp(2.6rem,7vw,6rem)] text-copper-bright">
                無隱藏費用
              </RevealLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="max-w-xl text-base font-light leading-loose tracking-[0.04em] text-parchment-dim md:text-lg"
            >
              所有價格皆含稅，另有學生作品授權合作方案。24 小時內回覆，免費諮詢。
            </motion.p>
          </div>
        </section>

        {/* ============ 01 — Plans ============ */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="01" zh="方案總覽" en="PLANS" />
            </motion.div>

            <div className="grid gap-px overflow-hidden border border-hairline bg-hairline md:grid-cols-3">
              {standardPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col p-8 md:p-10 ${
                    plan.popular ? "bg-night-raised" : "bg-night"
                  }`}
                >
                  <div className="mb-6 flex items-baseline justify-between">
                    <span className="font-display text-lg italic text-parchment-faint">
                      {plan.no}
                    </span>
                    {plan.popular && (
                      <span className="font-mono text-[10px] tracking-[0.3em] text-copper">
                        MOST CHOSEN
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-extralight tracking-[0.08em] text-parchment">
                    {plan.name}
                  </h3>
                  <p className="mt-1.5 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                    {plan.en}
                  </p>

                  <div className="mt-7">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extralight text-copper-bright">
                        {formatTwd(plan.price)}
                      </span>
                      <span className="text-sm font-light text-parchment-dim">起</span>
                    </div>
                  </div>

                  <p className="mt-6 border-t border-hairline pt-6 font-mono text-[10px] tracking-[0.25em] text-parchment-faint">
                    適合 · {plan.bestFor}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-baseline gap-3 text-sm font-light text-parchment"
                      >
                        <span className="font-mono text-[10px] text-copper">+</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/contact?plan=${plan.contactValue}`}
                    className={`group mt-9 inline-flex items-center justify-center gap-3 px-7 py-3.5 text-sm tracking-[0.14em] transition-colors duration-300 ${
                      plan.popular
                        ? "bg-copper text-night hover:bg-copper-bright"
                        : "border border-hairline-strong text-parchment hover:border-copper hover:text-copper-bright"
                    }`}
                  >
                    選擇此方案
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Student band */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
              className="mt-px flex flex-col gap-6 border border-t-0 border-hairline bg-night-raised/40 p-8 md:flex-row md:items-center md:justify-between md:p-10"
            >
              <div className="max-w-2xl">
                <p className="mb-3 font-mono text-[12px] tracking-[0.4em] text-copper-bright">
                  STUDENT COLLABORATION — 學生授權合作
                </p>
                <p className="text-sm font-light leading-loose text-parchment-dim">
                  持有效學生證並參與作品展示授權合作，可申請單機錄音錄影合作價；音樂系所、社團亦可洽談學期合作專案。
                </p>
                <p className="mt-3 text-sm font-light leading-loose text-parchment-dim">
                  {studentAuthorizationNote}
                </p>
              </div>
              <Link
                href="/student-projects"
                className="group inline-flex shrink-0 items-center gap-3 border border-hairline-strong px-8 py-3.5 text-sm tracking-[0.14em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
              >
                查看學生專案
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ============ 02 — Add-ons ============ */}
        <section className="border-t border-hairline bg-night-raised/40">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="02" zh="加值服務" en="ADD-ONS" />
              <p className="mb-14 max-w-2xl text-base font-light leading-loose text-parchment-dim">
                依需求客製錄製內容，多場次與學期合作可另行報價，歡迎來訊討論合適配置。
              </p>
              <p className="-mt-9 mb-14 max-w-2xl text-sm font-light leading-loose text-parchment-faint">
                {baseDurationNote}
              </p>
            </motion.div>

            <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
              {addOns.map((addon) => (
                <div
                  key={addon.name}
                  className="flex items-baseline justify-between bg-night px-6 py-7 transition-colors duration-300 hover:bg-night-raised"
                >
                  <span className="text-base font-light tracking-[0.06em] text-parchment">
                    {addon.name}
                  </span>
                  <span className="font-mono text-sm text-copper">
                    {addon.amount === null ? addon.unit : `+${formatTwd(addon.amount)}`}
                    {addon.amount !== null && addon.unit && (
                      <span className="ml-1 text-[10px] text-parchment-faint">{addon.unit}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 03 — Comparison ============ */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="03" zh="方案比較" en="COMPARISON" />
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-hairline-strong">
                    <th className="py-5 pr-6 font-mono text-[10px] font-normal tracking-[0.25em] text-parchment-faint">
                      項目
                    </th>
                    <th className="px-4 py-5 text-center text-sm font-light tracking-[0.06em] text-parchment">
                      單機方案
                    </th>
                    <th className="px-4 py-5 text-center text-sm font-light tracking-[0.06em] text-copper-bright">
                      雙機套餐
                    </th>
                    <th className="px-4 py-5 text-center text-sm font-light tracking-[0.06em] text-parchment">
                      三機旗艦
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row[0]} className="border-b border-hairline">
                      <td className="py-4 pr-6 text-sm font-light text-parchment-dim">{row[0]}</td>
                      <td className="px-4 py-4 text-center text-sm font-light text-parchment-dim">
                        {row[1]}
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-light text-copper">
                        {row[2]}
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-light text-parchment-dim">
                        {row[3]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ============ 04 — FAQ ============ */}
        <section className="border-t border-hairline bg-night-raised/40">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="04" zh="常見問題" en="FAQ" />
            </motion.div>

            <div className="max-w-3xl">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.q}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="grid grid-cols-1 gap-3 border-t border-hairline py-8 last:border-b md:grid-cols-[auto_1fr] md:gap-10"
                >
                  <div className="flex items-baseline gap-4 md:w-72">
                    <span className="font-mono text-[11px] text-copper">0{index + 1}</span>
                    <h3 className="text-lg font-light leading-snug tracking-[0.04em] text-parchment">
                      {faq.q}
                    </h3>
                  </div>
                  <p className="text-sm font-light leading-loose text-parchment-dim">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Finale — CTA ============ */}
        <section className="border-t border-hairline">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl px-5 py-28 text-center md:px-8 lg:py-40"
          >
            <p className="mb-7 font-mono text-[12px] tracking-[0.4em] text-copper-bright">
              READY TO RECORD — 開始錄製
            </p>
            <h2 className="mb-8 text-3xl font-extralight leading-snug tracking-[0.05em] text-parchment md:text-5xl md:leading-[1.35]">
              準備好開始錄製了嗎？
            </h2>
            <p className="mx-auto mb-14 max-w-xl text-base font-light leading-loose text-parchment-dim">
              立即預約，享受透明定價的專業服務。24 小時內回覆，免費諮詢，無隱藏費用。
            </p>
            <Link
              href="/contact?plan=recommend"
              className="group inline-flex items-center gap-3 bg-copper px-12 py-4 text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
            >
              立即預約諮詢
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
