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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, margin: "-80px" } as const;

const reasons = [
  {
    no: "01",
    title: "專業品質",
    en: "QUALITY",
    description: "4K 多機位錄影搭配多軌收音，舞台全景、演奏細節與現場氛圍都被完整留下。",
  },
  {
    no: "02",
    title: "學生友善",
    en: "STUDENT FRIENDLY",
    description: "畢業音樂會、成果發表與作品集需求不同，方案可依機位、收音與後製範圍彈性調整。",
  },
  {
    no: "03",
    title: "如期交付",
    en: "ON TIME",
    description: "演出後整理鏡頭、調色與音訊平衡，一般 7–10 個工作天交付，可上傳、投件與留存。",
  },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-parchment">
      <Navigation currentPage="portfolio" />

      <main>
        {/* ============ Hero — coming soon ============ */}
        <section className="grain relative flex min-h-svh flex-col justify-end overflow-hidden">
          <HeroBackdrop src="/pic/edited/owldio-piano-strings-detail.jpg" />

          <div className="writing-vertical absolute right-5 top-28 hidden font-light tracking-[0.5em] text-parchment-faint lg:block">
            正在編寫的篇章
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-40 md:px-8 lg:pb-24">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-7 font-mono text-[11px] tracking-[0.4em] text-copper"
            >
              PORTFOLIO — 作品輯
            </motion.p>

            <HeroRule />

            <h1 className="mb-8 font-serif font-extralight leading-[1.1] text-parchment">
              <RevealLine delay={0.25} className="text-[clamp(2.6rem,7vw,6rem)]">
                精選作品
              </RevealLine>
              <RevealLine delay={0.45} className="text-[clamp(2.6rem,7vw,6rem)] text-copper-bright">
                即將推出
              </RevealLine>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-12 max-w-xl text-base font-light leading-loose tracking-[0.04em] text-parchment-dim md:text-lg"
            >
              我們正在整理近期的音樂會錄製成果。在作品輯上線前，歡迎直接來信或透過 LINE
              洽詢相關影音樣本。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 bg-copper px-9 py-4 text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
              >
                洽詢作品樣本
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center border border-hairline-strong px-9 py-4 text-base tracking-[0.14em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
              >
                瀏覽服務項目
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ============ 01 — Why Owldio ============ */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="01" zh="為什麼選擇 Owldio" en="WHY OWLDIO" />
              <p className="mb-14 max-w-2xl text-base font-light leading-loose text-parchment-dim">
                作品還在路上，但我們對每一場演出的標準不變。
              </p>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-3 md:gap-0">
              {reasons.map((reason, index) => (
                <motion.article
                  key={reason.no}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="border-l border-hairline pl-7 md:pr-10"
                >
                  <div className="mb-7 font-display text-5xl font-light italic text-copper/80">
                    {reason.no}
                  </div>
                  <h3 className="mb-2 text-xl font-light tracking-[0.06em] text-parchment">
                    {reason.title}
                  </h3>
                  <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                    {reason.en}
                  </p>
                  <p className="text-sm font-light leading-loose text-parchment-dim">
                    {reason.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
