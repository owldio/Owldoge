"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import BackgroundGradient from "@/components/BackgroundGradient";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState("duo");

  const pricingPlans = useMemo(() => [
    {
      id: "single",
      name: "單機方案",
      subtitle: "SINGLE CAM",
      price: "NT$ 8,500",
      originalPrice: "NT$ 10,500",
      discount: "省 NT$ 2,000",
      bestFor: "個人演出",
      features: [
        "單機4K錄影",
        "基礎剪輯",
        "雲端交付",
        "一次小改"
      ],
      gradient: "from-cyan-600 to-blue-600",
      popular: false
    },
    {
      id: "duo",
      name: "雙機套餐",
      subtitle: "DUAL CAM",
      price: "NT$ 14,800",
      originalPrice: "NT$ 18,800",
      discount: "省 NT$ 4,000",
      bestFor: "小型室內樂",
      features: [
        "雙機位拍攝",
        "4K Ultra HD",
        "專業剪輯",
        "多角度切換",
        "雲端+USB交付"
      ],
      gradient: "from-purple-600 to-pink-600",
      popular: true
    },
    {
      id: "pro",
      name: "三機旗艦",
      subtitle: "PROFESSIONAL",
      price: "NT$ 21,200",
      originalPrice: "NT$ 27,200",
      discount: "省 NT$ 6,000",
      bestFor: "大型演出",
      features: [
        "三機位拍攝",
        "多視角剪輯",
        "色彩校正",
        "特殊需求處理",
        "完整後製",
        "實體隨身碟"
      ],
      gradient: "from-amber-600 to-orange-600",
      popular: false
    }
  ], []);

  const addOns = useMemo(() => [
    { name: "延長錄製", price: "+NT$ 1,200", unit: "/30分鐘", icon: "⏰" },
    { name: "快速交付", price: "+NT$ 2,000", unit: "起", icon: "⚡" },
    { name: "精華剪輯", price: "+NT$ 1,800", unit: "", icon: "✂️" },
    { name: "多軌錄音", price: "+NT$ 2,500", unit: "", icon: "🎵" },
    { name: "特殊需求", price: "可詳談", unit: "", icon: "🎚️" },
    { name: "實體隨身碟", price: "+NT$ 300", unit: "/個", icon: "💾" }
  ], []);

  return (
    <div className="min-h-screen bg-black text-amber-50">
      <BackgroundGradient />
      <Navigation currentPage="pricing" />

      <main className="pt-32">
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black"></div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-6 py-3 bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full text-amber-100/60 text-sm font-light tracking-[0.3em] mb-8">
                TRANSPARENT PRICING
              </span>
              
              <h1 className="text-[clamp(3rem,8vw,6rem)] font-thin leading-[1.2] mb-8">
                透明定價
                <br />
                <span className="font-extralight italic text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  無隱藏費用
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-amber-100/60 mb-12 max-w-3xl mx-auto leading-relaxed tracking-[0.1em]">
                所有價格皆含稅・學生享專屬折扣
              </p>

              <div className="flex items-center justify-center gap-8 text-sm font-light text-amber-100/40">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  24小時內回覆
                </span>
                <span>·</span>
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  學生專屬折扣
                </span>
                <span>·</span>
                <span>免費諮詢</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 mb-20">
              {pricingPlans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative group cursor-pointer ${
                    plan.popular ? 'lg:scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-full text-sm font-light tracking-[0.1em] shadow-xl">
                        🔥 最受歡迎
                      </span>
                    </div>
                  )}

                  <div className={`relative h-full bg-black/40 backdrop-blur-xl border transition-all duration-500 rounded-2xl p-8 ${
                    selectedPlan === plan.id 
                      ? 'border-amber-500/50 bg-black/60' 
                      : 'border-amber-500/20 hover:border-amber-500/40'
                  }`}>
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-thin mb-2 tracking-[0.15em] text-amber-50">{plan.name}</h3>
                      <p className="text-xs font-light tracking-[0.3em] text-amber-100/40 mb-6">
                        {plan.subtitle}
                      </p>
                      
                      <div className="mb-4">
                        <div className="text-5xl font-thin text-amber-50 mb-2 tracking-[0.05em]">
                          {plan.price}
                          <span className="text-base font-light text-amber-100/40 ml-2">起</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-lg text-amber-100/40 line-through font-light">{plan.originalPrice}</span>
                          <span className="text-sm text-amber-500 font-light">{plan.discount}</span>
                        </div>
                      </div>

                      <div className="inline-block px-4 py-2 bg-amber-500/10 backdrop-blur-xl rounded-full border border-amber-500/20">
                        <span className="text-xs font-light text-amber-100/60 tracking-[0.1em]">適合：{plan.bestFor}</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-6">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          <span className="text-sm font-light text-amber-100/80 tracking-[0.05em]">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mb-6 p-4 bg-amber-500/5 backdrop-blur-xl border border-amber-500/20 rounded-lg">
                      <p className="text-xs font-light text-amber-100/70 text-center tracking-[0.05em] leading-relaxed">
                        💬 歡迎來電洽談，我們將為您量身打造最適合的方案
                        <br />
                        <span className="text-amber-400">首次合作享專屬優惠折扣</span>
                      </p>
                    </div>

                    <Button
                      className={`w-full py-4 text-sm font-light tracking-[0.15em] transition-all duration-200 ${
                        plan.popular 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black border-none shadow-xl hover:shadow-amber-500/30'
                          : 'border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 bg-transparent text-amber-50'
                      }`}
                      asChild
                    >
                      <Link href="/contact">
                        選擇此方案
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
                <div className="relative p-8 lg:p-12 text-center backdrop-blur-xl border border-green-500/20">
                  <div className="inline-block px-4 py-2 bg-green-500 text-black rounded-full text-sm font-light tracking-[0.1em] mb-6">
                    🎓 學生專屬優惠
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-thin mb-4 tracking-[0.15em] text-amber-50">
                    學生專屬優惠方案
                  </h3>
                  <p className="text-lg font-light text-amber-100/60 mb-6 tracking-[0.05em]">
                    憑學生證享超值價格・支持你的音樂夢想
                  </p>
                  
                  <div className="max-w-2xl mx-auto mb-6 p-4 bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-lg">
                    <p className="text-sm font-light text-amber-100/80 text-center tracking-[0.05em] leading-relaxed">
                      🎯 <span className="text-green-400 font-medium">學生團體預約享額外優惠</span>
                      <br />
                      歡迎音樂系所、社團洽談學期合作專案
                    </p>
                  </div>
                  
                  <div className="max-w-2xl mx-auto mb-8">
                    <p className="text-sm font-light text-amber-100/40 leading-relaxed tracking-[0.05em]">
                      ※ 選擇學生方案即表示同意授權 Owldio 使用您的演出影片作為作品集展示、網站宣傳素材或社群媒體推廣等用途。我們將以專業方式呈現您的精彩演出，共同推廣音樂藝術之美。
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 hover:scale-105 text-black px-12 py-4 text-sm font-light tracking-[0.15em] border-none transition-all duration-300"
                    asChild
                  >
                    <Link href="/student-projects">
                      查看學生專案
                      <ArrowRight className="ml-3 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-black relative">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                ADD-ON SERVICES
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2] tracking-[0.2em] text-amber-50">
                加值服務
              </h2>
              <p className="text-xl font-light text-amber-100/60 max-w-2xl mx-auto tracking-[0.1em] mb-6">
                根據需求客製化你的錄製服務
              </p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/30 rounded-full"
              >
                <p className="text-sm font-light text-amber-100/80 tracking-[0.05em]">
                  💰 <span className="text-amber-400">批量服務享額外折扣</span> • 歡迎來電討論組合優惠
                </p>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {addOns.map((addon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  whileHover={{ y: -3 }}
                  className="group"
                >
                  <div className="p-6 bg-black/40 border border-amber-500/20 hover:border-amber-500/40 rounded-lg transition-colors duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{addon.icon}</span>
                      <span className="text-amber-500 text-lg font-thin tracking-[0.05em]">
                        {addon.price}
                        <span className="text-xs text-amber-100/40">{addon.unit}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-light text-amber-50 tracking-[0.1em]">{addon.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-black relative">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                COMPARISON
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2] tracking-[0.2em] text-amber-50">
                方案比較
              </h2>
            </motion.div>

            <div className="overflow-x-auto">
              <motion.table
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full border-collapse"
              >
                <thead>
                  <tr className="border-b border-amber-500/20">
                    <th className="text-left py-6 pr-8 text-lg font-light text-amber-100/60 tracking-[0.1em]">功能項目</th>
                    <th className="text-center py-6 px-4 text-lg font-light text-amber-50 tracking-[0.1em]">單機方案</th>
                    <th className="text-center py-6 px-4 text-lg font-light text-amber-500 tracking-[0.1em]">雙機套餐</th>
                    <th className="text-center py-6 px-4 text-lg font-light text-amber-50 tracking-[0.1em]">三機旗艦</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["錄影品質", "4K", "4K", "4K"],
                    ["機位數量", "1", "2", "3"],
                    ["錄音方式", "基礎立體聲錄音", "進階立體聲錄音", "多軌錄音"],
                    ["音頻後製", "✓", "✓", "✓"],
                    ["色彩校正", "基本", "基本", "進階"],
                    ["特殊需求處理(加值服務)", "✓", "✓", "✓"],
                    ["交付格式", "YouTube連結\n雲端高品質影片檔", "YouTube連結\n雲端高品質影片檔", "YouTube連結\n雲端高品質影片檔"],
                  ].map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="border-b border-amber-500/10 hover:bg-amber-500/5"
                    >
                      <td className="py-4 pr-8 text-sm font-light text-amber-100/80 tracking-[0.05em]">{row[0]}</td>
                      <td className="text-center py-4 px-4 text-sm font-light text-amber-100/60 whitespace-pre-line">{row[1]}</td>
                      <td className="text-center py-4 px-4 text-sm font-light text-amber-500 whitespace-pre-line">{row[2]}</td>
                      <td className="text-center py-4 px-4 text-sm font-light text-amber-100/60 whitespace-pre-line">{row[3]}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </motion.table>
            </div>
          </div>
        </section>

        <section className="py-20 bg-black relative">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                FAQ
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2] tracking-[0.2em] text-amber-50">
                常見問題
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: "學生優惠方案有哪些內容？",
                  a: "憑有效學生證可享特別價格等專屬優惠。"
                },
                {
                  q: "錄製當天需要準備什麼？",
                  a: "我們會提供所有專業設備，您只需準備好演出內容即可。"
                },
                {
                  q: "後製交付需要多長時間？",
                  a: "一般作業時間為 7-10 個工作天，急件可選擇 72 小時快交服務。"
                },
                {
                  q: "可以指定特定的剪輯風格嗎？",
                  a: "當然可以！我們會在前期溝通中了解您的需求和喜好。"
                }
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border border-amber-500/20 rounded-lg p-6 hover:border-amber-500/40 transition-colors bg-black/40 backdrop-blur-xl"
                >
                  <h3 className="text-lg font-light text-amber-50 mb-3 tracking-[0.1em]">{faq.q}</h3>
                  <p className="text-sm font-light text-amber-100/60 leading-[1.2] tracking-[0.05em]">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-black"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="text-5xl lg:text-6xl font-thin mb-10 leading-[1.2] tracking-[0.2em] text-amber-50">
              準備好
              <br />
              <span className="font-thin text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-yellow-400">開始錄製了嗎？</span>
            </h2>
            <p className="text-xl font-light text-amber-100/60 mb-12 max-w-2xl mx-auto tracking-[0.1em]">
              立即預約，享受透明定價的專業服務
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="group bg-amber-500 hover:bg-amber-600 hover:scale-105 text-black px-12 py-6 text-sm font-light tracking-[0.15em] transition-all duration-300 border-none"
                asChild
              >
                <Link href="/contact">
                  立即預約諮詢
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 flex justify-center gap-8 text-sm font-light text-amber-100/40"
            >
              <span>24小時內回覆</span>
              <span>·</span>
              <span>免費諮詢</span>
              <span>·</span>
              <span>無隱藏費用</span>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-amber-500/20 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/Owldio.svg" alt="Owldio" className="h-6 w-6 brightness-0 invert" />
              <span className="text-lg font-light tracking-[0.1em] text-amber-50">OWLDIO</span>
              <span className="text-xs font-light text-amber-100/40">© 2024</span>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-xs font-light text-amber-100/60 hover:text-amber-500 transition-colors tracking-[0.05em]">
                首頁
              </Link>
              <Link href="/student-projects" className="text-xs font-light text-amber-100/60 hover:text-amber-500 transition-colors tracking-[0.05em]">
                學生專案
              </Link>
              <Link href="/services" className="text-xs font-light text-amber-100/60 hover:text-amber-500 transition-colors tracking-[0.05em]">
                服務
              </Link>
              <Link href="/contact" className="text-xs font-light text-amber-100/60 hover:text-amber-500 transition-colors tracking-[0.05em]">
                聯絡
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}