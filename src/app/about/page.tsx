"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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

const storyParagraphs = [
  "Owldio 成立於 2024 年，由一群熱愛音樂與影像的年輕創作者組成。我們深知學生音樂家在舞台上的每一個音符，都承載著無數的練習與夢想。",
  "因此，我們致力於運用最新的錄製技術與創新思維，為學生提供專業且平價的音樂會錄製服務，讓每一場演出都能被完整保存。",
  "我們相信音樂是連接心靈的橋樑，而我們的使命，就是成為那個忠實記錄美好瞬間的守護者。",
];

const values = [
  {
    no: "I",
    title: "專業品質",
    description: "採用業界標準設備與技術，確保每一個作品都達到專業水準。",
  },
  {
    no: "II",
    title: "用心服務",
    description: "以學生為中心，提供客製化的解決方案與貼心的服務體驗。",
  },
  {
    no: "III",
    title: "創新思維",
    description: "持續探索新技術與創意表現，為傳統錄製服務注入新的活力。",
  },
];

const privacySections = [
  {
    heading: "資料收集與使用",
    body: "我們僅收集為提供服務所必要的個人資料，包括但不限於：聯絡資訊（姓名、電話、電子郵件）、服務預約相關資訊，以及錄製活動的基本資料。",
  },
  {
    heading: "資料保護",
    body: "我們採用適當的技術與管理措施保護您的個人資料安全，防止未經授權的存取、使用或洩露。您的個人資料僅用於提供服務，不會與第三方分享，除非經過您的明確同意或法律要求。",
  },
  {
    heading: "影像權利",
    body: "我們錄製的影音內容版權歸客戶所有。除非另有約定，我們不會將錄製內容用於商業宣傳或其他用途。如需使用部分內容作為作品集展示，將事先徵得客戶同意。",
  },
  {
    heading: "Cookie 使用",
    body: "本網站可能使用 Cookie 來改善使用者體驗。您可以透過瀏覽器設定選擇接受或拒絕 Cookie，但這可能影響某些網站功能的正常運作。",
  },
  {
    heading: "政策更新",
    body: "我們保留隨時修改此隱私政策的權利。任何重大變更將會在網站上公告，並透過電子郵件通知已註冊的使用者。",
  },
];

const termsSections = [
  {
    heading: "服務內容",
    body: "Owldio 提供專業的音樂會錄製服務，包括 4K 多機位影像錄製、多軌同步音訊錄音、專業後製剪輯與調色，以及數位檔案交付。",
  },
  {
    heading: "預約與付款",
    body: "服務預約需提前至少 7 個工作天確認。預約時需支付 30% 訂金，服務完成後支付餘款；接受現金、轉帳或信用卡付款。",
  },
  {
    heading: "取消政策",
    body: "客戶可在錄製日期前 3 個工作天免費取消預約。3 個工作天內取消將酌收 50% 手續費，錄製當日取消恕不退費。如因不可抗力因素（如天災、疫情等）需要調整，雙方可協商重新安排。",
  },
  {
    heading: "作品交付",
    body: "影音作品將在錄製完成後 5–10 個工作天內交付。交付格式為數位檔案，透過雲端連結下載。如需實體光碟或其他格式，將另外收費。",
  },
  {
    heading: "責任限制",
    body: "我們將盡力提供最佳服務品質，但不對因設備故障、場地限制或其他不可控因素造成的錄製品質問題承擔責任。如有爭議，將以誠信原則協商解決。",
  },
  {
    heading: "智慧財產權",
    body: "錄製內容的版權歸客戶所有。Owldio 保留將部分內容（經客戶同意）用於作品集展示的權利。客戶需確保錄製內容不侵犯第三方版權。",
  },
  {
    heading: "聯絡資訊",
    body: "如對本服務條款有任何疑問，請來信 owldio.art@gmail.com，我們將於 24 小時內回覆您的詢問。",
  },
];

function PolicyList({ items }: { items: { heading: string; body: string }[] }) {
  return (
    <div className="max-w-3xl">
      {items.map((item, index) => (
        <motion.div
          key={item.heading}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="grid grid-cols-1 gap-3 border-t border-hairline py-8 last:border-b md:grid-cols-[auto_1fr] md:gap-10"
        >
          <div className="flex items-baseline gap-4 md:w-56">
            <span className="font-mono text-[11px] text-copper">0{index + 1}</span>
            <h3 className="text-lg font-light tracking-[0.06em] text-parchment">{item.heading}</h3>
          </div>
          <p className="text-sm font-light leading-loose text-parchment-dim">{item.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-parchment">
      <Navigation currentPage="about" />

      <main>
        {/* ============ Hero ============ */}
        <section className="grain relative overflow-hidden border-b border-hairline">
          <HeroBackdrop src="/pic/IMG_9068.JPG" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-40 md:px-8 lg:pb-28 lg:pt-52">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-7 font-mono text-[11px] tracking-[0.4em] text-copper"
            >
              ABOUT — 關於我們
            </motion.p>
            <HeroRule />
            <h1 className="mb-8 font-serif font-extralight leading-[1.1] text-parchment">
              <RevealLine delay={0.2} className="text-[clamp(2.6rem,7vw,6rem)]">
                關於
              </RevealLine>
              <RevealLine
                delay={0.38}
                className="font-display text-[clamp(2.9rem,7.5vw,6.5rem)] italic text-copper-bright"
              >
                Owldio
              </RevealLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="max-w-xl text-pretty text-base font-light leading-loose tracking-[0.04em] text-parchment-dim md:text-lg"
            >
              專注校園音樂會錄製的新創團隊，<br className="hidden sm:block" />用心為每一場演出留下最珍貴的瞬間。
            </motion.p>
          </div>
        </section>

        {/* ============ 01 — Our Story ============ */}
        <section className="border-t border-hairline">
          <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 md:px-8 lg:grid-cols-12 lg:py-36">
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
                  src="/pic/edited/owldio-performance-main.jpg"
                  alt="Owldio 在音樂廳錄製鋼琴演奏的現場"
                  fill
                  quality={78}
                  sizes="(max-width: 1024px) 80vw, 34vw"
                  loading="lazy"
                  className="object-cover object-[44%_38%]"
                />
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-8 lg:col-span-6 lg:col-start-7 lg:mt-0"
            >
              <p className="mb-6 font-mono text-[11px] tracking-[0.4em] text-copper">
                01 — OUR STORY
              </p>
              <h2 className="mb-8 text-3xl font-extralight leading-snug tracking-[0.04em] text-parchment md:text-[2.6rem] md:leading-[1.3]">
                我們的故事
              </h2>
              <div className="max-w-xl space-y-6">
                {storyParagraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 12)}
                    className="text-base font-light leading-loose text-parchment-dim"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============ 02 — Values ============ */}
        <section className="border-t border-hairline bg-night-raised/40">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="02" zh="我們的價值觀" en="OUR VALUES" />
            </motion.div>

            <div className="grid gap-12 md:grid-cols-3 md:gap-0">
              {values.map((value, index) => (
                <motion.article
                  key={value.no}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="border-l border-hairline pl-7 md:pr-10"
                >
                  <div className="mb-7 font-display text-5xl font-light italic text-copper/80">
                    {value.no}
                  </div>
                  <h3 className="mb-4 text-xl font-light tracking-[0.06em] text-parchment">
                    {value.title}
                  </h3>
                  <p className="text-sm font-light leading-loose text-parchment-dim">
                    {value.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 03 — Privacy ============ */}
        <section id="privacy" className="scroll-mt-24 border-t border-hairline">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="03" zh="隱私政策" en="PRIVACY POLICY" />
            </motion.div>
            <PolicyList items={privacySections} />
          </div>
        </section>

        {/* ============ 04 — Terms ============ */}
        <section id="terms" className="scroll-mt-24 border-t border-hairline bg-night-raised/40">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-36">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.7 }}
            >
              <SectionMark no="04" zh="服務條款" en="TERMS OF SERVICE" />
            </motion.div>
            <PolicyList items={termsSections} />
          </div>
        </section>

        {/* ============ Finale — CTA ============ */}
        <section className="grain relative overflow-hidden border-t border-hairline">
          <div className="absolute inset-0">
            <Image
              src="/pic/edited/owldio-piano-strings-detail.jpg"
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
            className="relative z-10 mx-auto max-w-3xl px-5 py-28 text-center md:px-8 lg:py-40"
          >
            <p className="mb-7 font-mono text-[11px] tracking-[0.4em] text-copper">
              LET&apos;S WORK TOGETHER — 開始合作
            </p>
            <h2 className="mb-8 text-3xl font-extralight leading-snug tracking-[0.05em] text-parchment md:text-5xl md:leading-[1.35]">
              準備開始合作？
            </h2>
            <p className="mx-auto mb-14 max-w-xl text-base font-light leading-loose text-parchment-dim">
              讓我們為您的下一場音樂會，創造完整而安心的錄製體驗。
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-copper px-12 py-4 text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
            >
              立即聯絡我們
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
