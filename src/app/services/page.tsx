"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Video, Headphones, Wifi, Package, ChevronRight, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import BackgroundGradient from "@/components/BackgroundGradient";

export default function ServicesPage() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      icon: <Video className="h-8 w-8" />,
      title: "音樂會錄影",
      subtitle: "CONCERT VIDEO",
      description: "多機位4K錄影，完整捕捉每個精彩瞬間",
      features: [
        "4K Ultra HD 畫質",
        "多機位拍攝",
        "專業調色",
        "快速交付"
      ],
      pricing: "NT$ 7,800",
      pricingUnit: "起",
      gradient: "from-cyan-600 to-blue-600"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "專業錄音",
      subtitle: "AUDIO RECORDING",
      description: "多軌同步錄音，呈現最純淨的聲音",
      features: [
        "24bit/48kHz",
        "多軌錄音",
        "特殊需求處理",
        "母帶處理"
      ],
      pricing: "NT$ 3,300",
      pricingUnit: "起",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "現場直播",
      subtitle: "LIVE STREAMING",
      description: "多平台同步直播，即時分享音樂感動",
      features: [
        "多平台同步",
        "即時導播",
        "互動功能",
        "錄影存檔"
      ],
      pricing: "NT$ 18,800",
      pricingUnit: "起",
      gradient: "from-amber-600 to-orange-600"
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "後製服務",
      subtitle: "POST PRODUCTION",
      description: "專業剪輯調色，打造影院級成品",
      features: [
        "影片剪輯",
        "音頻混音",
        "字幕製作",
        "特效合成"
      ],
      pricing: "NT$ 10,800",
      pricingUnit: "起",
      gradient: "from-green-600 to-emerald-600"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white overflow-x-hidden"
    >
      <BackgroundGradient />
      {/* Navigation */}
      <Navigation currentPage="services" />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-black"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 backdrop-blur-sm border border-zinc-700/50 rounded-full text-gray-400 text-sm font-normal tracking-[0.3em] mb-8">
                OUR SERVICES
              </span>
              
              <h1 className="text-[clamp(3rem,8vw,6rem)] font-thin leading-[1.2] mb-8">
                專業服務
                <br />
                <span className="font-extralight italic text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 inline-block pr-4">
                  全方位製作
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl font-normal text-gray-400 mb-12 max-w-3xl mx-auto leading-[1.2]">
                從錄音到錄影，從直播到後製
                <br />
                一站式專業音樂製作服務
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-32 relative">
          <div className="max-w-[90vw] mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}
                  className="relative group"
                >
                  <div className="relative h-full bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 rounded-xl p-10 transition-all duration-500">
                    {/* Gradient Accent */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.gradient} rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Icon */}
                    <motion.div 
                      className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${service.gradient} bg-opacity-10 mb-6`}
                      animate={{ 
                        rotate: hoveredService === i ? 360 : 0,
                        scale: hoveredService === i ? 1.1 : 1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-white">
                        {service.icon}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="mb-8">
                      <h3 className="text-3xl font-normal mb-2">{service.title}</h3>
                      <p className="text-xs font-normal tracking-[0.3em] text-gray-500 mb-4">
                        {service.subtitle}
                      </p>
                      <p className="text-base font-normal text-gray-400 leading-[1.2]">
                        {service.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {service.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-amber-500" />
                          <span className="text-sm font-normal text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm font-normal text-gray-500 mb-1">起始價格</p>
                        <p className="text-3xl font-thin text-white">
                          {service.pricing}
                          <span className="text-sm text-gray-500 ml-2">{service.pricingUnit}</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="group/btn border border-zinc-700 hover:border-amber-500 hover:text-amber-500 transition-all duration-300"
                      >
                        了解詳情
                        <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Consultation Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-20 max-w-4xl mx-auto"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
                <div className="relative p-8 lg:p-12 text-center backdrop-blur-sm border border-amber-900/30">
                  <h3 className="text-3xl lg:text-4xl font-thin mb-4">
                    專屬服務諮詢
                  </h3>
                  <p className="text-lg font-normal text-gray-400 mb-6">
                    歡迎來電洽談，為您量身打造最適合的方案
                  </p>
                  <div className="inline-block px-6 py-3 bg-amber-500/10 backdrop-blur-xl rounded-full border border-amber-500/20">
                    <span className="text-sm font-normal text-amber-400 tracking-[0.1em]">首次合作享專屬優惠折扣</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-32 bg-zinc-950 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
          
          <div className="relative z-10 max-w-[90vw] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-amber-500 text-xs font-normal tracking-[0.3em] mb-6 block">
                OUR PROCESS
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2]">
                服務流程
              </h2>
              <p className="text-xl font-normal text-gray-500 max-w-2xl mx-auto">
                簡單四步驟，輕鬆完成專業錄製
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-8">
              {[
                { 
                  step: "01", 
                  title: "諮詢討論",
                  desc: "了解需求，提供專業建議",
                  icon: "💬"
                },
                { 
                  step: "02", 
                  title: "報價確認",
                  desc: "透明報價，確認服務細節",
                  icon: "📋"
                },
                { 
                  step: "03", 
                  title: "現場錄製",
                  desc: "專業團隊，用心記錄",
                  icon: "🎬"
                },
                { 
                  step: "04", 
                  title: "後製交付",
                  desc: "精心製作，準時交付",
                  icon: "✨"
                }
              ].map((process, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-1/4 left-full w-full h-px bg-gradient-to-r from-zinc-700 to-transparent z-0"></div>
                  )}
                  
                  <div className="relative z-10 text-center px-4">
                    <div className="inline-block mb-6">
                      <div className="text-5xl mb-4">{process.icon}</div>
                      <span className="text-amber-500 text-xs font-normal tracking-[0.3em]">
                        STEP {process.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-normal mb-3">{process.title}</h3>
                    <p className="text-sm font-normal text-gray-500 leading-relaxed">{process.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="relative py-32">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black"></div>
          </div>
          
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
              <span className="italic font-extralight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 inline-block pr-4">
                專業錄製
              </span>
            </h2>
            <p className="text-xl font-normal text-gray-400 mb-12 max-w-2xl mx-auto">
              讓我們為你的音樂注入專業品質
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="group bg-amber-500 hover:bg-amber-600 hover:scale-105 text-black px-12 py-6 text-sm font-normal tracking-[0.2em] transition-all duration-300"
                asChild
              >
                <Link href="/contact">
                  立即預約諮詢
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-zinc-700 hover:border-amber-500 hover:text-amber-500 px-12 py-6 text-sm font-normal tracking-[0.2em] transition-all duration-500"
                asChild
              >
                <Link href="/pricing">
                  查看完整價格
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black">
        <div className="max-w-[90vw] mx-auto py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/Owldio.svg" alt="Owldio" width={24} height={24} className="h-6 w-6 invert" />
              <span className="text-lg font-normal tracking-[0.1em]">OWLDIO</span>
              <span className="text-xs font-normal text-gray-600">© 2024</span>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-xs font-normal text-gray-600 hover:text-amber-500 transition-colors">
                首頁
              </Link>
              <Link href="/student-projects" className="text-xs font-normal text-gray-600 hover:text-amber-500 transition-colors">
                學生專案
              </Link>
              {/* <Link href="/portfolio" className="text-xs font-normal text-gray-600 hover:text-amber-500 transition-colors">
                作品
              </Link> */}
              <Link href="/contact" className="text-xs font-normal text-gray-600 hover:text-amber-500 transition-colors">
                聯絡
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}