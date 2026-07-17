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
import StepBeam from "@/components/StepBeam";
import { formatTwd, serviceCatalog } from "@/lib/pricing";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, margin: "-80px" } as const;

const processSteps = [
  { numeral: "I", title: "諮詢討論", description: "了解演出需求，提供合適的錄製配置與專業建議。" },
  { numeral: "II", title: "報價確認", description: "透明報價，確認機位、收音、後製範圍與交付時間。" },
  { numeral: "III", title: "現場錄製", description: "演出當天由 Owldio 低干擾錄製，讓您專心完成演出。" },
  { numeral: "IV", title: "後製交付", description: "整理影像與音訊，如期交付可上傳與留存的成品。" },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-parchment">
      <Navigation currentPage="services" />

      <main>
        {/* ============ Hero ============ */}
        <section className="grain relative overflow-hidden border-b border-hairline">
          <HeroBackdrop src="/pic/IMG_9060.JPG" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-40 md:px-8 lg:pb-28 lg:pt-52">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-7 font-mono text-[12px] tracking-[0.4em] text-copper-bright"
            >
              SERVICES — 服務項目
            </motion.p>
            <HeroRule />
            <h1 className="mb-8 font-serif font-extralight leading-[1.1] text-parchment">
              <RevealLine delay={0.2} className="text-[clamp(2.6rem,7vw,6rem)]">
                專業服務
              </RevealLine>
              <RevealLine delay={0.38} className="text-[clamp(2.6rem,7vw,6rem)] text-copper-bright">
                全方位製作
              </RevealLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="max-w-xl text-base font-light leading-loose tracking-[0.04em] text-parchment-dim md:text-lg"
            >
              從錄音、錄影到直播與後製，依演出需求配置，一站式完成音樂會的完整紀錄。
            </motion.p>
          </div>
        </section>

        {/* ============ 01 — Services ============ */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="01" zh="服務項目" en="SERVICES" />
              <p className="mb-14 max-w-2xl text-base font-light leading-loose text-parchment-dim">
                從學生音樂會、畢業演出到室內樂與作品集，錄影、收音與後製都能依需求自由組合。
              </p>
            </motion.div>

            <div>
              {serviceCatalog.map((service, index) => (
                <motion.div
                  key={service.no}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="grid grid-cols-1 gap-x-10 gap-y-6 border-t border-hairline py-12 last:border-b md:grid-cols-[5rem_1fr_auto]"
                >
                  <span className="font-display text-lg italic text-parchment-faint">
                    {service.no}
                  </span>

                  <div>
                    <div className="mb-2 flex flex-wrap items-baseline gap-x-4">
                      <h3 className="text-2xl font-extralight tracking-[0.08em] text-parchment md:text-3xl">
                        {service.title}
                      </h3>
                      <span className="font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                        {service.en}
                      </span>
                    </div>
                    <p className="mb-6 max-w-md text-sm font-light leading-loose text-parchment-dim">
                      {service.description}
                    </p>
                    <ul className="flex flex-wrap gap-x-8 gap-y-2.5">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-baseline gap-2.5 text-sm font-light text-parchment"
                        >
                          <span className="font-mono text-[10px] text-copper">+</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-start md:items-end md:text-right">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                      FROM
                    </span>
                    <span className="mt-1 text-2xl font-extralight text-copper-bright">
                      {formatTwd(service.price)}
                      <span className="ml-2 text-sm font-light text-parchment-dim">起</span>
                    </span>
                    <Link
                      href="/contact"
                      className="group mt-5 inline-flex items-center gap-2 border-b border-hairline-strong pb-1 text-sm tracking-[0.12em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
                    >
                      詢問此服務
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 02 — Process ============ */}
        <section className="border-t border-hairline bg-night-raised/40">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="02" zh="服務流程" en="PROCESS" />
              <p className="mb-16 max-w-2xl text-base font-light leading-loose text-parchment-dim">
                簡單四個樂章，從第一次討論到成品交付都清楚透明。
              </p>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-4 md:gap-0">
              {processSteps.map((step, index) => (
                <motion.article
                  key={step.numeral}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className="relative border-l border-hairline pl-7 md:pr-8"
                >
                  <StepBeam delay={index * 0.18} />
                  <motion.div
                    initial={{ opacity: 0.25 }}
                    whileInView={{ opacity: 1 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.7, delay: index * 0.18 + 0.45 }}
                    className="mb-7 font-display text-5xl font-light italic text-copper/80"
                  >
                    {step.numeral}
                  </motion.div>
                  <h3 className="mb-4 text-xl font-light tracking-[0.06em] text-parchment">
                    {step.title}
                  </h3>
                  <p className="text-sm font-light leading-loose text-parchment-dim">
                    {step.description}
                  </p>
                </motion.article>
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
              START YOUR PROJECT — 開始你的錄製
            </p>
            <h2 className="mb-8 text-3xl font-extralight leading-snug tracking-[0.05em] text-parchment md:text-5xl md:leading-[1.35]">
              開始你的
              <br className="md:hidden" />
              專業錄製
            </h2>
            <p className="mx-auto mb-14 max-w-xl text-base font-light leading-loose text-parchment-dim">
              歡迎來訊洽談，我們會依機位、收音、時長、後製與交付需求提供清楚報價。
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-copper px-10 py-4 text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
              >
                立即預約諮詢
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-hairline-strong px-10 py-4 text-base tracking-[0.14em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
              >
                查看完整價目
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
