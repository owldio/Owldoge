"use client"

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white"
    >
      <Navigation currentPage="about" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-black"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
        >
          <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
            ABOUT US
          </span>
          <h1 className="text-5xl lg:text-7xl font-thin mb-8 leading-[1.2]">
            關於
            <br />
            <span className="italic font-extralight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Owldio
            </span>
          </h1>
          <p className="text-xl font-light text-gray-400 max-w-2xl mx-auto">
            專注校園音樂會錄製的新創團隊，用心為每一場演出留下最珍貴的瞬間
          </p>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                OUR STORY
              </span>
              <h2 className="text-4xl lg:text-5xl font-thin mb-8 leading-[1.2]">
                我們的故事
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  Owldio 成立於 2024 年，由一群熱愛音樂與影像的年輕創作者組成。我們深知學生音樂家在舞台上的每一個音符都承載著無數的練習與夢想。
                </p>
                <p>
                  因此，我們致力於運用最新的錄製技術與創新思維，為學生提供專業且平價的音樂會錄製服務，讓每一場演出都能被完美保存。
                </p>
                <p>
                  我們相信，音樂是連接心靈的橋樑，而我們的使命就是成為那個忠實記錄美好瞬間的守護者。
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-lg overflow-hidden">
                <Image
                  src="/IMG_9089.JPG"
                  alt="Owldio Team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
              OUR VALUES
            </span>
            <h2 className="text-4xl lg:text-5xl font-thin mb-8">
              我們的價值觀
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "專業品質",
                description: "採用業界標準設備與技術，確保每一個作品都達到專業水準",
                icon: "🎯"
              },
              {
                title: "用心服務",
                description: "以學生為中心，提供客製化的解決方案與貼心的服務體驗",
                icon: "❤️"
              },
              {
                title: "創新思維",
                description: "持續探索新技術與創意表現，為傳統錄製服務注入新活力",
                icon: "💡"
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-8"
              >
                <div className="text-4xl mb-6">{value.icon}</div>
                <h3 className="text-xl font-light mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section id="privacy" className="py-20 bg-zinc-950/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
              PRIVACY POLICY
            </span>
            <h2 className="text-4xl lg:text-5xl font-thin mb-8">
              隱私政策
            </h2>
          </motion.div>

          <div className="space-y-8 text-gray-400 leading-relaxed">
            <div>
              <h3 className="text-xl font-light text-white mb-4">資料收集與使用</h3>
              <p className="mb-4">
                我們僅收集為提供服務所必要的個人資料，包括但不限於：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>聯絡資訊（姓名、電話、電子郵件）</li>
                <li>服務預約相關資訊</li>
                <li>錄製活動的基本資料</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">資料保護</h3>
              <p>
                我們採用適當的技術和管理措施來保護您的個人資料安全，防止未經授權的存取、使用或洩露。您的個人資料僅用於提供服務，不會與第三方分享，除非經過您的明確同意或法律要求。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">影像權利</h3>
              <p>
                我們錄製的影音內容版權歸客戶所有。除非另有約定，我們不會將錄製內容用於商業宣傳或其他用途。如需使用部分內容作為作品集展示，將事先徵得客戶同意。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">Cookie 使用</h3>
              <p>
                本網站可能使用 Cookie 來改善用戶體驗。您可以通過瀏覽器設定選擇接受或拒絕 Cookie，但這可能影響某些網站功能的正常運作。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">政策更新</h3>
              <p>
                我們保留隨時修改此隱私政策的權利。任何重大變更將會在網站上公告，並通過電子郵件通知已註冊的用戶。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Service Section */}
      <section id="terms" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
              TERMS OF SERVICE
            </span>
            <h2 className="text-4xl lg:text-5xl font-thin mb-8">
              服務條款
            </h2>
          </motion.div>

          <div className="space-y-8 text-gray-400 leading-relaxed">
            <div>
              <h3 className="text-xl font-light text-white mb-4">服務內容</h3>
              <p className="mb-4">
                Owldio 提供專業的音樂會錄製服務，包括：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>4K 多機位影像錄製</li>
                <li>多軌同步音訊錄音</li>
                <li>專業後製剪輯與調色</li>
                <li>數位檔案交付</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">預約與付款</h3>
              <p className="mb-4">
                服務預約需提前至少 7 個工作天確認。付款方式包括：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>預約時需支付 30% 訂金</li>
                <li>服務完成後支付餘款</li>
                <li>接受現金、轉帳或信用卡付款</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">取消政策</h3>
              <p>
                客戶可在錄製日期前 3 個工作天免費取消預約。3 個工作天內取消將酌收 50% 手續費。錄製當日取消恕不退費。如因不可抗力因素（如天災、疫情等）需要調整，雙方可協商重新安排。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">作品交付</h3>
              <p>
                影音作品將在錄製完成後 5-10 個工作天內交付。交付格式為數位檔案，透過雲端連結下載。如需實體光碟或其他格式，將另外收費。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">責任限制</h3>
              <p>
                我們將盡力提供最佳服務品質，但不對因設備故障、場地限制或其他不可控因素造成的錄製品質問題承擔責任。如有爭議，將以誠信原則協商解決。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">智慧財產權</h3>
              <p>
                錄製內容的版權歸客戶所有。Owldio 保留將部分內容（經客戶同意）用於作品集展示的權利。客戶需確保錄製內容不侵犯第三方版權。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-white mb-4">聯絡資訊</h3>
              <p>
                如對本服務條款有任何疑問，請聯絡我們：
                <br />
                電子郵件：owldio.art@gmail.com
                <br />
                我們將於 24 小時內回覆您的詢問。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <h2 className="text-4xl lg:text-5xl font-thin mb-8">
            準備開始合作？
          </h2>
          <p className="text-xl font-light text-gray-400 mb-8">
            讓我們為您的下一場音樂會創造完美的錄製體驗
          </p>
          <Button
            size="lg"
            className="bg-amber-500 text-black hover:bg-amber-600 hover:scale-105 px-12 py-6 text-base font-light tracking-[0.2em] transition-all duration-300"
            asChild
          >
            <Link href="/contact">
              立即聯絡我們
              <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black">
        <div className="max-w-[90vw] mx-auto py-16">
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image src="/Owldio.svg" alt="Owldio" width={32} height={32} className="h-8 w-8 invert" />
                <span className="text-xl font-light tracking-[0.1em]">OWLDIO</span>
              </div>
              <p className="text-sm font-light text-gray-500 leading-[1.2]">
                校園音樂會錄製專家
                <br />
                新創團隊，用心服務
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-light tracking-[0.3em] text-gray-400 mb-6">SERVICES</h4>
              <ul className="space-y-3">
                {[
                  { name: '音樂會錄製', href: '/services#concert-recording' },
                  { name: '直播服務', href: '/services#live-streaming' },
                  { name: '後製發行', href: '/services#post-production' },
                  { name: '場地錄音', href: '/services#studio-recording' }
                ].map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm font-light text-gray-500 hover:text-amber-500 transition-colors duration-200">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-light tracking-[0.3em] text-gray-400 mb-6">COMPANY</h4>
              <ul className="space-y-3">
                {[
                  { name: '關於我們', href: '/about' },
                  { name: '作品集', href: '/portfolio' },
                  { name: '定價方案', href: '/pricing' },
                  { name: '聯絡我們', href: '/contact' }
                ].map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm font-light text-gray-500 hover:text-amber-500 transition-colors duration-200">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-light tracking-[0.3em] text-gray-400 mb-6">CONNECT</h4>
              <div className="space-y-3">
                <a href="mailto:owldio.art@gmail.com" className="block text-sm font-light text-gray-500">
                  owldio.art@gmail.com
                </a>
                <div className="flex gap-4 mt-6">
                  <a
                    href="https://www.instagram.com/owldio.art/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-light text-gray-500"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/share/19xTqkqM9Y/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-light text-gray-500"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://youtube.com/@owldioart?si=ypYR6wo0a1LLiGeS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-light text-gray-500"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-zinc-900 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-xs font-light text-gray-600">
              © 2024 Owldio. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/about#privacy" className="text-xs font-light text-gray-600 hover:text-amber-500 transition-colors">
                隱私政策
              </Link>
              <Link href="/about#terms" className="text-xs font-light text-gray-600 hover:text-amber-500 transition-colors">
                服務條款
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}