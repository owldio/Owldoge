"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import InkBackground from "@/components/InkBackground";

const studioMoments = {
  main: {
    src: "/pic/edited/owldio-performance-main.jpg",
    alt: "鋼琴演奏者與攝影機同步錄製的音樂會現場",
  },
  performer: {
    src: "/pic/edited/owldio-performance-performer.jpg",
    alt: "鋼琴演奏者在舞台燈光下演出",
  },
  detail: {
    src: "/pic/edited/owldio-piano-strings-detail.jpg",
    alt: "平台鋼琴琴弦與收音細節",
  },
};

const proofPoints = [
  { code: "4K", label: "舞台完整紀錄" },
  { code: "MULTI", label: "多軌收音穩定清楚" },
  { code: "7–10D", label: "整理後完整交付" },
  { code: "STUDENT", label: "學生方案可調整" },
];

const promiseLines = [
  "機位與收音先安排好",
  "演出當天低干擾錄製",
  "畫面與聲音同步整理",
  "成品可用於投件與分享",
];

const serviceTracks = [
  {
    no: "01",
    title: "音樂會錄影",
    en: "Concert Filming",
    description: "機位、構圖與關鍵角度先安排好，讓舞台全景、演奏細節與現場氛圍都被留下。",
  },
  {
    no: "02",
    title: "現場錄音",
    en: "Live Recording",
    description: "依編制與空間配置收音，保留鋼琴、弦樂、聲樂與室內樂的自然質感。",
  },
  {
    no: "03",
    title: "後製剪輯",
    en: "Post-Production",
    description: "演出後整理鏡頭切換、基礎調色與音訊平衡，交付適合上傳、投件與留存的成品。",
  },
];

const workflowMovements = [
  {
    numeral: "I",
    title: "留下演出資訊",
    description: "提供日期、場地、編制與成品用途，我們先確認檔期與合適的錄製配置。",
  },
  {
    numeral: "II",
    title: "安排錄製細節",
    description: "機位、收音、後製範圍與交付時間先整理好，錄製當天不需要臨時煩惱。",
  },
  {
    numeral: "III",
    title: "專心完成演出",
    description: "現場錄影與收音由 Owldio 處理，演出後再整理影片與音訊檔案交付。",
  },
];

const footerLinks = [
  { name: "關於我們", href: "/about" },
  { name: "服務項目", href: "/services" },
  { name: "價目方案", href: "/pricing" },
  { name: "聯絡預約", href: "/contact" },
];

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/owldio.art/" },
  { name: "Facebook", href: "https://www.facebook.com/share/19xTqkqM9Y/?mibextid=wwXIfr" },
  { name: "YouTube", href: "https://youtube.com/@owldioart?si=ypYR6wo0a1LLiGeS" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, margin: "-80px" } as const;

function SectionMark({ no, zh, en }: { no: string; zh: string; en: string }) {
  return (
    <div className="mb-12 flex items-baseline gap-5">
      <span className="font-display text-lg italic text-copper">{no}</span>
      <h2 className="text-2xl font-light tracking-[0.1em] text-parchment md:text-3xl">{zh}</h2>
      <span className="hidden font-mono text-[11px] tracking-[0.3em] text-parchment-faint sm:inline">
        {en}
      </span>
      <span className="ml-auto hidden h-px max-w-40 flex-1 bg-hairline md:block" />
    </div>
  );
}

export default function OwldioSite() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-parchment">
      <Navigation currentPage="home" />

      <main>
        {/* ============ Hero — the stage ============ */}
        <section className="grain relative flex min-h-svh flex-col justify-end overflow-hidden">
          {/* Photo layer */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 lg:left-[30%]">
              <Image
                src={studioMoments.main.src}
                alt={studioMoments.main.alt}
                fill
                priority
                quality={80}
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover object-[60%_42%]"
              />
            </div>
            {/* Blend the photograph into the hall */}
            <div className="absolute inset-0 bg-gradient-to-r from-night via-night/75 to-night/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/25 to-night/60" />
          </div>

          {/* Ambient ink — sumi mist drifting in the dark hall, behind everything */}
          <div className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen">
            <InkBackground />
          </div>

          {/* REC indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute right-5 top-24 z-10 flex items-center gap-2.5 border border-hairline bg-night/55 px-3.5 py-2 backdrop-blur-sm md:right-10 md:top-28"
          >
            <span className="animate-rec h-2 w-2 rounded-full bg-red-500" />
            <span className="font-mono text-[11px] tracking-[0.25em] text-parchment-dim">
              REC · 4K · 48kHz
            </span>
          </motion.div>

          {/* Headline block */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-40 md:px-8 lg:pb-20">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-7 font-mono text-[11px] tracking-[0.4em] text-copper"
            >
              OWLDIO STUDIO — 音樂會錄影 · 錄音 · 後製
            </motion.p>

            <h1 className="mb-8 font-display font-light leading-[1.02] text-parchment">
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="block text-[clamp(2.9rem,8vw,7rem)]"
              >
                Be the moment.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="block text-[clamp(2.9rem,8vw,7rem)] italic text-copper-bright"
              >
                We make it stay.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-12 text-lg font-extralight tracking-[0.16em] text-parchment-dim md:text-xl"
            >
              台上交給你，台下交給 Owldio。
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
                詢問錄製方案
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-hairline-strong px-9 py-4 text-base tracking-[0.14em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
              >
                查看價目方案
              </Link>
            </motion.div>
          </div>

          {/* Proof metadata strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="relative z-10 border-t border-hairline bg-night/65 backdrop-blur-sm"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
              {proofPoints.map((item, index) => (
                <div
                  key={item.code}
                  className={`px-5 py-5 md:px-8 ${index > 0 ? "border-l border-hairline" : ""}`}
                >
                  <div className="mb-1.5 font-mono text-sm tracking-[0.2em] text-copper">
                    {item.code}
                  </div>
                  <div className="text-sm font-light text-parchment-dim">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ============ 01 — Promise ============ */}
        <section id="about-studio" className="relative border-t border-hairline">
          <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 md:px-8 lg:grid-cols-12 lg:py-36">
            {/* Vertical margin note */}
            <div className="writing-vertical absolute right-5 top-24 hidden font-extralight tracking-[0.5em] text-parchment-faint lg:top-36 xl:block">
              被音樂留下的瞬間
            </div>

            {/* Offset photo pairing */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
              className="relative lg:col-span-5"
            >
              <div className="grain relative aspect-[3/4] w-4/5 overflow-hidden">
                <Image
                  src={studioMoments.performer.src}
                  alt={studioMoments.performer.alt}
                  fill
                  quality={78}
                  sizes="(max-width: 1024px) 80vw, 34vw"
                  loading="lazy"
                  className="object-cover object-[47%_48%]"
                />
              </div>
              <div className="grain absolute -bottom-12 right-0 aspect-[4/3] w-3/5 overflow-hidden border-[6px] border-night">
                <Image
                  src={studioMoments.detail.src}
                  alt={studioMoments.detail.alt}
                  fill
                  quality={78}
                  sizes="(max-width: 1024px) 60vw, 26vw"
                  loading="lazy"
                  className="object-cover object-[50%_54%]"
                />
              </div>
            </motion.div>

            {/* Statement */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-16 lg:col-span-6 lg:col-start-7 lg:mt-0"
            >
              <p className="mb-6 font-mono text-[11px] tracking-[0.4em] text-copper">
                01 — OUR PROMISE
              </p>
              <h2 className="mb-8 text-3xl font-extralight leading-snug tracking-[0.04em] text-parchment md:text-[2.6rem] md:leading-[1.3]">
                上台那一刻，
                <br />
                只需要專注演出
              </h2>
              <p className="mb-12 max-w-xl text-base font-light leading-loose text-parchment-dim md:text-lg">
                錄製不該成為演出的負擔。從場地確認、器材架設到後製整理，Owldio
                會把細節處理好，讓音樂會自然地被看見、被聽見、被保留下來。
              </p>

              <ul className="max-w-xl">
                {promiseLines.map((line, index) => (
                  <li
                    key={line}
                    className="flex items-baseline gap-5 border-t border-hairline py-4 last:border-b"
                  >
                    <span className="font-mono text-[11px] text-copper">0{index + 1}</span>
                    <span className="text-base font-light text-parchment">{line}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ============ 02 — Services as a tracklist ============ */}
        <section id="services" className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="02" zh="服務項目" en="SERVICES" />
              <p className="mb-14 max-w-2xl text-base font-light leading-loose text-parchment-dim">
                從學生音樂會、畢業演出到室內樂與作品集，錄影、收音與後製都能依演出需求配置。
              </p>
            </motion.div>

            <div>
              {serviceTracks.map((track, index) => (
                <motion.div
                  key={track.no}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href="/services"
                    className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 border-t border-hairline py-9 transition-colors duration-300 last:border-b md:grid-cols-[5rem_1fr_1fr_auto] md:gap-x-10"
                  >
                    <span className="font-display text-lg italic text-parchment-faint transition-colors duration-300 group-hover:text-copper">
                      {track.no}
                    </span>
                    <span>
                      <span className="block text-2xl font-extralight tracking-[0.08em] text-parchment transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-copper-bright md:text-4xl">
                        {track.title}
                      </span>
                      <span className="mt-2 block font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                        {track.en.toUpperCase()}
                      </span>
                    </span>
                    <span className="col-span-3 col-start-2 mt-4 max-w-md text-sm font-light leading-relaxed text-parchment-dim md:col-span-1 md:col-start-3 md:mt-0">
                      {track.description}
                    </span>
                    <ArrowUpRight className="hidden h-5 w-5 self-center text-parchment-faint opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-copper group-hover:opacity-100 md:block" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 03 — Workflow as movements ============ */}
        <section className="border-t border-hairline bg-night-raised/40">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="03" zh="合作流程" en="PROGRAMME" />
              <p className="mb-16 max-w-2xl text-base font-light leading-loose text-parchment-dim">
                從檔期、場地到交付內容先確認清楚，讓演出當天回到音樂本身。
              </p>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-3 md:gap-0">
              {workflowMovements.map((movement, index) => (
                <motion.article
                  key={movement.numeral}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="border-l border-hairline pl-7 md:pr-10"
                >
                  <div className="mb-7 font-display text-5xl font-light italic text-copper/80">
                    {movement.numeral}
                  </div>
                  <h3 className="mb-4 text-xl font-light tracking-[0.06em] text-parchment">
                    {movement.title}
                  </h3>
                  <p className="text-sm font-light leading-loose text-parchment-dim">
                    {movement.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Finale — student CTA ============ */}
        <section className="grain relative overflow-hidden border-t border-hairline">
          <div className="absolute inset-0">
            <Image
              src={studioMoments.detail.src}
              alt=""
              fill
              quality={70}
              sizes="100vw"
              loading="lazy"
              className="object-cover object-center"
              aria-hidden
            />
            <div className="absolute inset-0 bg-night/88" />
            <div className="absolute inset-0 bg-gradient-to-b from-night via-transparent to-night" />
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ duration: 0.8 }}
            className="relative z-10 mx-auto max-w-3xl px-5 py-28 text-center md:px-8 lg:py-44"
          >
            <p className="mb-7 font-mono text-[11px] tracking-[0.4em] text-copper">
              STUDENT FRIENDLY — 學生友善方案
            </p>
            <h2 className="mb-8 text-3xl font-extralight leading-snug tracking-[0.05em] text-parchment md:text-5xl md:leading-[1.35]">
              重要的演出，
              <br className="md:hidden" />
              值得被安心留下
            </h2>
            <p className="mx-auto mb-14 max-w-xl text-base font-light leading-loose text-parchment-dim">
              畢業音樂會、成果發表與作品集需求不同，方案可依機位、收音、後製範圍與交付時間調整，把預算用在最需要的地方。
            </p>
            <div className="flex flex-col items-center gap-6">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-copper px-12 py-4 text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
              >
                填寫錄製需求
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <span className="font-mono text-[11px] tracking-[0.25em] text-parchment-faint">
                通常 24 小時內回覆 · 可透過 LINE 聯繫
              </span>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ============ Footer ============ */}
      <footer className="border-t border-hairline bg-night-deep">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <Image
                  src="/Owldio.svg"
                  alt="Owldio"
                  width={30}
                  height={30}
                  className="h-7 w-7 brightness-0 invert opacity-90"
                />
                <span className="font-display text-lg font-medium tracking-[0.28em] text-parchment">
                  OWLDIO
                </span>
              </div>
              <p className="text-sm font-light leading-relaxed text-parchment-faint">
                音樂會錄影、錄音與後製服務
                <br />
                owldio.art@gmail.com
              </p>
            </div>

            <div className="flex gap-16">
              <nav aria-label="網站導覽" className="flex flex-col gap-3.5">
                <span className="mb-1 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                  SITE
                </span>
                {footerLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-light text-parchment-dim transition-colors duration-300 hover:text-copper-bright"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <nav aria-label="社群連結" className="flex flex-col gap-3.5">
                <span className="mb-1 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                  SOCIAL
                </span>
                {socialLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light text-parchment-dim transition-colors duration-300 hover:text-copper-bright"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-2 border-t border-hairline pt-7 font-mono text-[10px] tracking-[0.25em] text-parchment-faint sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} OWLDIO. ALL RIGHTS RESERVED.</span>
            <span>BE THE MOMENT — WE MAKE IT STAY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
