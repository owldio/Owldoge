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

const benefits = [
  { no: "I", title: "學生證優惠", description: "出示學生證即享專屬折扣，把預算留給最重要的演出。" },
  { no: "II", title: "72 小時快交", description: "趕畢業製作？可加購快交服務，我們懂你的急迫。" },
  { no: "III", title: "專業品質", description: "不因價格犧牲錄製品質，設備與標準與一般方案一致。" },
  { no: "IV", title: "免費諮詢", description: "前期規劃與配置建議完全免費，先談清楚再開始。" },
];

const mainPackage = {
  price: "NT$ 3,300",
  originalPrice: "NT$ 5,990",
  discount: "省 NT$ 2,690",
  included: ["多軌同步收音", "4K 錄影服務", "基礎剪輯後製", "雲端交付（30 天）", "一次免費修改"],
  addons: ["延長錄製", "多機位拍攝", "72 小時快交", "實體隨身碟", "特殊需求（可詳談）"],
};

const otherPackages = [
  {
    title: "單機錄影",
    en: "SINGLE CAM",
    price: "NT$ 7,800",
    originalPrice: "NT$ 10,500",
    features: ["單機錄影", "2 小時拍攝", "基礎剪輯"],
    popular: false,
  },
  {
    title: "雙機套餐",
    en: "DUAL CAM",
    price: "NT$ 14,800",
    originalPrice: "NT$ 18,800",
    features: ["雙機位拍攝", "4K Ultra HD", "專業剪輯"],
    popular: true,
  },
  {
    title: "三機旗艦",
    en: "PROFESSIONAL",
    price: "NT$ 21,200",
    originalPrice: "NT$ 27,200",
    features: ["三機位拍攝", "多軌錄音", "色彩校正"],
    popular: false,
  },
];

const authorizationNote =
  "※ 選擇學生方案即表示同意授權 Owldio 使用您的演出影片作為作品集展示、網站宣傳素材或社群媒體推廣等用途。我們將以專業方式呈現您的精彩演出，共同推廣音樂藝術之美。";

export default function StudentProjectsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-parchment">
      <Navigation currentPage="student-projects" />

      <main>
        {/* ============ Hero ============ */}
        <section className="grain relative overflow-hidden border-b border-hairline">
          <HeroBackdrop src="/pic/IMG_9120.JPG" />
          <div className="writing-vertical absolute right-5 top-28 hidden font-light tracking-[0.5em] text-parchment-faint lg:block">
            為學生而生的紀錄
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-40 md:px-8 lg:pb-28 lg:pt-52">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-7 font-mono text-[11px] tracking-[0.4em] text-copper"
            >
              STUDENT — 學生專案
            </motion.p>
            <HeroRule />
            <h1 className="mb-8 font-serif font-extralight leading-[1.1] text-parchment">
              <RevealLine delay={0.2} className="text-[clamp(2.6rem,7vw,6rem)]">
                為學生
              </RevealLine>
              <RevealLine delay={0.38} className="text-[clamp(2.6rem,7vw,6rem)] text-copper-bright">
                量身打造
              </RevealLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-12 max-w-xl text-base font-light leading-loose tracking-[0.04em] text-parchment-dim md:text-lg"
            >
              專屬優惠、快速交付、用心服務。最高省 45%，把每一分預算用在最需要的地方。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="#pricing"
                className="group inline-flex items-center justify-center gap-3 bg-copper px-9 py-4 text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
              >
                查看學生價格
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <span className="font-mono text-[11px] tracking-[0.25em] text-parchment-faint">
                STUDENT EXCLUSIVE · 最高省 45%
              </span>
            </motion.div>
          </div>
        </section>

        {/* ============ 01 — Why us ============ */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="01" zh="學生專屬優勢" en="WHY US" />
            </motion.div>

            <div className="grid gap-12 md:grid-cols-4 md:gap-0">
              {benefits.map((benefit, index) => (
                <motion.article
                  key={benefit.no}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className="border-l border-hairline pl-7 md:pr-8"
                >
                  <div className="mb-7 font-display text-5xl font-light italic text-copper/80">
                    {benefit.no}
                  </div>
                  <h3 className="mb-4 text-xl font-light tracking-[0.06em] text-parchment">
                    {benefit.title}
                  </h3>
                  <p className="text-sm font-light leading-loose text-parchment-dim">
                    {benefit.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 02 — Student pricing ============ */}
        <section id="pricing" className="scroll-mt-24 border-t border-hairline bg-night-raised/40">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="02" zh="學生方案" en="STUDENT PRICING" />
              <p className="mb-14 max-w-2xl text-base font-light leading-loose text-parchment-dim">
                所有價格皆含稅，無隱藏費用。最受歡迎的學生錄音錄影套餐，一次到位。
              </p>
            </motion.div>

            {/* Feature package */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
              className="border border-hairline-strong bg-night"
            >
              <div className="flex flex-col gap-8 border-b border-hairline p-8 md:flex-row md:items-end md:justify-between md:p-12">
                <div>
                  <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-copper">
                    MOST CHOSEN — 最受歡迎
                  </p>
                  <h3 className="text-2xl font-extralight tracking-[0.08em] text-parchment md:text-3xl">
                    學生錄音錄影套餐
                  </h3>
                </div>
                <div className="md:text-right">
                  <div className="flex items-baseline gap-2 md:justify-end">
                    <span className="text-4xl font-extralight text-copper-bright md:text-5xl">
                      {mainPackage.price}
                    </span>
                    <span className="text-sm font-light text-parchment-dim">起</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-3 md:justify-end">
                    <span className="text-sm font-light text-parchment-faint line-through">
                      {mainPackage.originalPrice}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.1em] text-copper">
                      {mainPackage.discount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-12 p-8 md:grid-cols-2 md:p-12">
                <div>
                  <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                    包含服務
                  </p>
                  <ul className="space-y-3.5">
                    {mainPackage.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-3 text-sm font-light text-parchment"
                      >
                        <span className="font-mono text-[10px] text-copper">+</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                    加購選項
                  </p>
                  <ul className="space-y-3.5">
                    {mainPackage.addons.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-3 text-sm font-light text-parchment-dim"
                      >
                        <span className="font-mono text-[10px] text-parchment-faint">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-hairline p-8 md:p-12">
                <p className="mb-8 text-xs font-light leading-loose tracking-[0.04em] text-parchment-faint">
                  {authorizationNote}
                </p>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 bg-copper px-10 py-4 text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
                >
                  立即預約
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>

            {/* Other packages */}
            <div className="mt-16 grid gap-px border border-hairline bg-hairline md:grid-cols-3">
              {otherPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col p-8 ${pkg.popular ? "bg-night-raised" : "bg-night"}`}
                >
                  <div className="mb-5 flex items-baseline justify-between">
                    <h4 className="text-xl font-extralight tracking-[0.08em] text-parchment">
                      {pkg.title}
                    </h4>
                    {pkg.popular && (
                      <span className="font-mono text-[10px] tracking-[0.3em] text-copper">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                    {pkg.en}
                  </p>
                  <div className="mt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extralight text-copper-bright">
                        {pkg.price}
                      </span>
                      <span className="text-sm font-light text-parchment-dim">起</span>
                    </div>
                    <span className="text-sm font-light text-parchment-faint line-through">
                      {pkg.originalPrice}
                    </span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                    {pkg.features.map((feature) => (
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
                    href="/contact"
                    className="group mt-8 inline-flex items-center gap-2 border-b border-hairline-strong pb-1 text-sm tracking-[0.12em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
                  >
                    詢問此方案
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
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
            <p className="mb-7 font-mono text-[11px] tracking-[0.4em] text-copper">
              YOUR MUSIC JOURNEY — 開始你的音樂旅程
            </p>
            <h2 className="mb-8 text-3xl font-extralight leading-snug tracking-[0.05em] text-parchment md:text-5xl md:leading-[1.35]">
              開始你的
              <br className="md:hidden" />
              音樂旅程
            </h2>
            <p className="mx-auto mb-14 max-w-xl text-base font-light leading-loose text-parchment-dim">
              立即預約，享受學生專屬優惠。24 小時內回覆，免費諮詢。
            </p>
            <Link
              href="/contact"
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
