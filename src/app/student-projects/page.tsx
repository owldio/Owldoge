"use client"

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock, Sparkles, ChevronDown, Play, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import MouseGlow from "@/components/MouseGlow";
import BackgroundGradient from "@/components/BackgroundGradient";

export default function StudentProjectsPage() {

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white overflow-x-hidden"
    >
      <BackgroundGradient />
      <MouseGlow />
      {/* Navigation */}
      <Navigation currentPage="student-projects" />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-black"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm border border-amber-600/30 rounded-full text-amber-500 text-sm font-light tracking-[0.3em] mb-8">
                STUDENT EXCLUSIVE
              </span>
              
              <h1 className="text-[clamp(3rem,8vw,6rem)] font-thin leading-[1.2] mb-8">
                為學生
                <br />
                <span className="font-extralight italic text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  量身打造
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-gray-400 mb-12 max-w-3xl mx-auto leading-[1.2]">
                專屬優惠・快速交付・用心服務
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg"
                  className="group bg-amber-500 hover:bg-amber-600 hover:scale-105 text-black px-12 py-6 text-sm font-light tracking-[0.2em] transition-all duration-300"
                  asChild
                >
                  <a href="#pricing">
                    查看學生價格
                    <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </a>
                </Button>
                <div className="flex items-center gap-2 text-amber-500/70">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-light tracking-wider">最高省 20%</span>
                </div>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center gap-2"
              >
                <ChevronDown className="h-5 w-5 text-white/60" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-32 relative">
          <div className="max-w-[90vw] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                WHY CHOOSE US
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2]">
                學生專屬優勢
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🎓",
                  title: "學生證優惠",
                  desc: "出示學生證即享專屬折扣",
                  highlight: true
                },
                {
                  icon: "⚡",
                  title: "72小時快交",
                  desc: "趕畢製？我們懂你的急迫",
                  highlight: false
                },
                {
                  icon: "💎",
                  title: "專業品質",
                  desc: "不因價格犧牲錄製品質",
                  highlight: false
                },
                {
                  icon: "🤝",
                  title: "免費諮詢",
                  desc: "前期規劃完全免費",
                  highlight: false
                }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  <div className={`relative p-8 rounded-lg border ${
                    benefit.highlight 
                      ? 'bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-600/30' 
                      : 'bg-zinc-900/30 border-zinc-800'
                  } backdrop-blur-sm transition-all duration-500 hover:border-amber-600/50`}>
                    <div className="text-4xl mb-6">{benefit.icon}</div>
                    <h3 className="text-xl font-light mb-3 text-white">{benefit.title}</h3>
                    <p className="text-sm font-light text-gray-400 leading-[1.2]">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-zinc-950 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
          
          <div className="relative z-10 max-w-[90vw] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                STUDENT PRICING
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2]">
                透明定價
              </h2>
              <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
                所有價格皆含稅，無隱藏費用
              </p>
            </motion.div>

            {/* Main Student Package */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto mb-20"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 blur-3xl"></div>
                <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-amber-600/30 rounded-2xl p-12">
                  {/* Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-black rounded-full text-sm font-bold">
                      🔥 最受歡迎
                    </span>
                  </div>

                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-light mb-4">學生錄音錄影套餐</h3>
                    <div className="flex items-center justify-center gap-6">
                      <div>
                        <div className="text-6xl font-thin text-amber-500">
                          NT$ 3,300
                          <span className="text-xl font-light text-amber-400/60 ml-2">起</span>
                        </div>
                      </div>
                      <div className="text-gray-600">
                        <div className="text-sm">原價</div>
                        <div className="text-2xl line-through">NT$ 5,990</div>
                        <div className="text-amber-500 font-medium">省 NT$ 2,690</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-lg font-light mb-6 text-amber-500">包含服務</h4>
                      <ul className="space-y-4">
                        {[
                          "2小時專業錄音",
                          "多軌同步收音",
                          "4K 錄影服務",
                          "基礎剪輯後製",
                          "雲端交付 (30天)",
                          "一次免費修改"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <Check className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-light text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-light mb-6 text-amber-500">加購選項</h4>
                      <ul className="space-y-4">
                        {[
                          { item: "延長錄製", price: "+NT$ 1,200/30分鐘" },
                          { item: "多機位拍攝", price: "+NT$ 2,000" },
                          { item: "72小時快交", price: "+NT$ 2,000" },
                          { item: "特殊需求", price: "可詳談" },
                          { item: "實體隨身碟", price: "+NT$ 300" }
                        ].map((addon, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span className="text-sm font-light text-gray-400">{addon.item}</span>
                            <span className="text-sm font-light text-amber-300">{addon.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 mb-8">
                    <div className="bg-amber-900/10 border border-amber-600/20 rounded-lg p-6">
                      <p className="text-sm font-light text-amber-100/70 leading-relaxed tracking-[0.05em] text-center">
                        ※ 選擇學生方案即表示同意授權 Owldio 使用您的演出影片作為作品集展示、網站宣傳素材或社群媒體推廣等用途。我們將以專業方式呈現您的精彩演出，共同推廣音樂藝術之美。
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      size="lg"
                      className="bg-amber-500 hover:bg-amber-600 hover:scale-105 text-black px-12 py-4 text-sm font-light tracking-[0.2em] transition-all duration-300"
                      asChild
                    >
                      <Link href="/contact">
                        立即預約
                        <ArrowRight className="ml-3 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Other Packages */}
            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: "單機錄影",
                  price: "NT$ 7,800",
                  originalPrice: "NT$ 10,500",
                  features: ["單機4K錄影", "2小時拍攝", "基礎剪輯"],
                  color: "from-cyan-600 to-blue-600"
                },
                {
                  title: "雙機套餐",
                  price: "NT$ 14,800",
                  originalPrice: "NT$ 18,800",
                  features: ["雙機位拍攝", "60秒精華", "專業剪輯"],
                  color: "from-purple-600 to-pink-600",
                  popular: true
                },
                {
                  title: "三機旗艦",
                  price: "NT$ 21,200",
                  originalPrice: "NT$ 27,200",
                  features: ["三機位拍攝", "完整後製", "色彩校正"],
                  color: "from-amber-600 to-orange-600"
                }
              ].map((pkg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative group"
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full font-medium">
                        熱門選擇
                      </span>
                    </div>
                  )}
                  <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 rounded-lg p-8 transition-all duration-500">
                    <div className={`w-16 h-px bg-gradient-to-r ${pkg.color} mb-6`}></div>
                    <h3 className="text-2xl font-light mb-2">{pkg.title}</h3>
                    <div className="mb-6">
                      <div className="text-3xl font-thin text-white">
                        {pkg.price}
                        <span className="text-sm font-light text-gray-400 ml-2">起</span>
                      </div>
                      <div className="text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                          <span className="text-sm font-light text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 border border-zinc-700 hover:border-amber-500 hover:text-amber-500 text-sm font-light tracking-[0.2em] transition-all duration-500">
                      了解詳情
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-32 bg-black relative">
          <div className="max-w-[90vw] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                STUDENT WORKS
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2]">
                學生作品
              </h2>
              <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
                超過 100+ 場學生音樂會錄製經驗
              </p>
            </motion.div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "畢業音樂會錄影", category: "獨奏會" },
                { title: "管弦樂團演出", category: "交響樂" },
                { title: "合唱團演出", category: "合唱" },
                { title: "室內樂展演", category: "室內樂" },
                { title: "爵士演出錄影", category: "爵士樂" },
                { title: "國樂團演出", category: "國樂" }
              ].map((work, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="relative group cursor-pointer aspect-video overflow-hidden rounded-lg"
                >
                  <img 
                    src={`/${
                      ['IMG_9106.JPG', 'IMG_9089.JPG', 'IMG_9124.JPG',
                       'IMG_9076.JPG', 'IMG_9102.JPG', 'IMG_9117.JPG'][i]
                    }`}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-amber-500 text-xs font-light tracking-[0.2em]">
                      {work.category}
                    </span>
                    <h3 className="text-xl font-light mt-1">{work.title}</h3>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Play className="h-5 w-5 text-black ml-0.5" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 bg-zinc-950 relative">
          <div className="max-w-[90vw] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                TESTIMONIALS
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin leading-[1.2]">
                學生評價
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  quote: "團隊超用心！畢業音樂會的錄製品質超乎預期，價格也很學生友善。",
                  author: "陳同學",
                  school: "台灣大學音樂系",
                  rating: 5
                },
                {
                  quote: "72小時就收到成品，趕畢製的救星！品質完全不輸專業錄音室。",
                  author: "林同學",
                  school: "師範大學音樂系",
                  rating: 5
                },
                {
                  quote: "溝通很順暢，會給很多專業建議。學生預算也能有專業品質！",
                  author: "王同學",
                  school: "音樂系學生",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-lg p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-base font-light leading-[1.2] text-gray-300 mb-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600"></div>
                      <div>
                        <div className="font-light text-white">{testimonial.author}</div>
                        <div className="text-xs font-light text-gray-500">{testimonial.school}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-black"></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="text-5xl lg:text-6xl font-thin mb-10 leading-[1.2]">
              開始你的
              <br />
              <span className="italic font-extralight text-amber-500">音樂旅程</span>
            </h2>
            <p className="text-xl font-light text-gray-400 mb-12 max-w-2xl mx-auto">
              立即預約，享受學生專屬優惠
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="group bg-amber-500 hover:bg-amber-600 hover:scale-105 text-black px-12 py-6 text-sm font-light tracking-[0.2em] transition-all duration-300"
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
              className="mt-12 flex justify-center gap-8 text-sm font-light text-gray-500"
            >
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                24小時內回覆
              </span>
              <span>·</span>
              <span>免費諮詢</span>
              <span>·</span>
              <span>學生優惠</span>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black">
        <div className="max-w-[90vw] mx-auto py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/Owldio.svg" alt="Owldio" className="h-6 w-6 invert" />
              <span className="text-lg font-light tracking-[0.1em]">OWLDIO</span>
              <span className="text-xs font-light text-gray-600">© 2024</span>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-xs font-light text-gray-600 hover:text-amber-500 transition-colors">
                首頁
              </Link>
              <Link href="/services" className="text-xs font-light text-gray-600 hover:text-amber-500 transition-colors">
                服務
              </Link>
              <Link href="/portfolio" className="text-xs font-light text-gray-600 hover:text-amber-500 transition-colors">
                作品
              </Link>
              <Link href="/contact" className="text-xs font-light text-gray-600 hover:text-amber-500 transition-colors">
                聯絡
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}