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

const portfolioFormats = [
  {
    no: "01",
    title: "影音短片",
    en: "VIDEO EXCERPT",
    status: "案例素材整理中",
    description:
      "未來以 15–45 秒片段呈現構圖、鏡頭切換與現場聲音；只有完成書面公開授權的演出才會上線。",
  },
  {
    no: "02",
    title: "靜態案例摘要",
    en: "CASE NOTES",
    status: "可先建立",
    description:
      "以授權劇照或畫面截圖，搭配演出類型、機位、收音方式與交付內容；靜態案例不會被當成影音品質證明。",
  },
  {
    no: "03",
    title: "私人樣片洽詢",
    en: "PRIVATE SAMPLE",
    status: "依授權狀況確認",
    description:
      "如果你正準備畢業音樂會、獨奏或室內樂演出，可先告訴我們編制與用途；若有合適且可分享的素材，再個別提供參考。",
  },
];

const productionStandards = [
  {
    no: "I",
    title: "先確認用途",
    description: "投件、留存、公開分享或完整演出紀錄，需要的機位、收音與交付格式並不相同。",
  },
  {
    no: "II",
    title: "再安排機位與收音",
    description: "單機以穩定完整為主；多機位增加演奏細節與切換空間，多軌則依編制與場地需求評估。",
  },
  {
    no: "III",
    title: "最後整理成品",
    description: "依方案完成剪輯、音訊平衡與色彩處理；一般作業時間為 7–10 個工作天。",
  },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-parchment">
      <Navigation currentPage="portfolio" />

      <main>
        {/* ============ Hero ============ */}
        <section className="grain relative flex min-h-svh flex-col justify-end overflow-hidden">
          <HeroBackdrop src="/pic/edited/owldio-piano-strings-detail.jpg" />

          <div className="writing-vertical absolute right-5 top-28 hidden font-light tracking-[0.5em] text-parchment-faint lg:block">
            作品需要被誠實呈現
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-40 md:px-8 lg:pb-24">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-7 font-mono text-[12px] tracking-[0.4em] text-copper-bright"
            >
              PORTFOLIO — 作品輯
            </motion.p>

            <HeroRule />

            <h1 className="mb-8 font-serif font-extralight leading-[1.1] text-parchment">
              <RevealLine delay={0.25} className="text-[clamp(2.6rem,7vw,6rem)]">
                作品與
              </RevealLine>
              <RevealLine delay={0.45} className="text-[clamp(2.6rem,7vw,6rem)] text-copper-bright">
                製作方式
              </RevealLine>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-12 max-w-xl text-base font-light leading-loose tracking-[0.04em] text-parchment-dim md:text-lg"
            >
              公開案例仍在整理與確認授權中。在完整作品上線前，這裡先說明案例會如何呈現、
              不同方案如何製作，以及如何洽詢適合你需求的參考素材。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/contact?plan=recommend"
                className="group inline-flex items-center justify-center gap-3 bg-copper px-9 py-4 text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
              >
                洽詢合適參考素材
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-hairline-strong px-9 py-4 text-base tracking-[0.14em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
              >
                比較錄製方案
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ============ 01 — Portfolio formats ============ */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="01" zh="作品會如何呈現" en="PORTFOLIO FORMAT" />
              <p className="mb-14 max-w-2xl text-base font-light leading-loose text-parchment-dim">
                作品集不必只有完整影片。短片、靜態案例與私人樣片各自證明不同事情；
                Owldio 只公開已取得適當授權的內容，也不會用器材照片代替成品證據。
              </p>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-3 md:gap-0">
              {portfolioFormats.map((format, index) => (
                <motion.article
                  key={format.no}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="border-l border-hairline pl-7 md:pr-10"
                >
                  <div className="mb-7 font-display text-5xl font-light italic text-copper/80">
                    {format.no}
                  </div>
                  <h3 className="mb-2 text-xl font-light tracking-[0.06em] text-parchment">
                    {format.title}
                  </h3>
                  <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                    {format.en}
                  </p>
                  <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-copper">
                    {format.status}
                  </p>
                  <p className="text-sm font-light leading-loose text-parchment-dim">
                    {format.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 02 — Production standard ============ */}
        <section className="border-t border-hairline bg-night-raised/30">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="02" zh="案例上線前先了解" en="PRODUCTION STANDARD" />
              <p className="mb-14 max-w-2xl text-base font-light leading-loose text-parchment-dim">
                即使案例尚未公開，你仍可先確認服務如何從演出需求走到可交付成品，
                再決定單機、多機位或收音升級是否適合。
              </p>
            </motion.div>

            <div className="grid gap-px border border-hairline bg-hairline md:grid-cols-3">
              {productionStandards.map((standard, index) => (
                <motion.article
                  key={standard.no}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className="bg-night p-7 md:p-9"
                >
                  <p className="font-display text-4xl italic text-copper/80">{standard.no}</p>
                  <h3 className="mt-6 text-xl font-light tracking-[0.06em] text-parchment">
                    {standard.title}
                  </h3>
                  <p className="mt-4 text-sm font-light leading-loose text-parchment-dim">
                    {standard.description}
                  </p>
                </motion.article>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
              className="mt-12 flex flex-col gap-4 border-t border-hairline pt-10 sm:flex-row"
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center border border-hairline-strong px-8 py-3.5 text-sm tracking-[0.14em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
              >
                查看服務流程
              </Link>
              <Link
                href="/contact?plan=recommend"
                className="group inline-flex items-center justify-center gap-3 bg-copper px-8 py-3.5 text-sm tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
              >
                告訴我們你的演出
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
