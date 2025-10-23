"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import MistAnimation from "@/components/MistAnimation";

export default function OwldioSite() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  if (!loadingComplete) {
    return <LoadingScreen onAnimationComplete={handleLoadingComplete} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white overflow-x-hidden"
    >
      {/* Navigation */}
      <Navigation currentPage="home" />

      {/* Hero Section - Fullscreen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Mist Background */}
        <div className="absolute inset-0 z-0">
          <MistAnimation />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1
              className="text-[clamp(3rem,10vw,8rem)] font-thin leading-[1.1] tracking-[-0.02em] mb-10"
              initial={{ letterSpacing: "0.5em", opacity: 0 }}
              animate={{ letterSpacing: "-0.02em", opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            >
              CAPTURE
              <br />
              <span className="font-extralight italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60">
                EVERY NOTE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-xl md:text-2xl font-light tracking-wider text-white/80 mb-12 max-w-2xl mx-auto"
            >
              專業音樂會錄製 · 為藝術而生
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button
                size="lg"
                className="bg-amber-500 text-black hover:bg-amber-600 hover:scale-105 px-12 py-6 text-base font-light tracking-[0.2em] transition-all duration-300"
                asChild
              >
                <Link href="/portfolio">
                  探索作品
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={() => {
            // 立即開始滾動，給用戶即時反饋
            const target = window.innerHeight;
            window.scrollTo({
              top: target,
              behavior: 'smooth'
            });
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-light tracking-[0.3em] text-white/60">SCROLL</span>
            <ChevronDown className="h-5 w-5 text-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section - Split Screen */}
      <section className="relative min-h-screen flex items-center bg-zinc-950">
        <div className="w-full grid lg:grid-cols-2">
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center p-12 lg:p-24"
          >
            <div className="max-w-xl">
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                ABOUT STUDIO
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-10 leading-[1.2]">
                音樂的
                <br />
                <span className="italic font-extralight text-amber-500">靈魂捕手</span>
              </h2>
              <p className="text-lg font-light leading-[1.2] text-gray-400 mb-8">
                Owldio 是專注於音樂會錄製的新創團隊。
                我們運用新世代技術與創新思維，
                為學生音樂家提供高品質且平價的錄製服務。
              </p>
              <div className="space-y-4">
                {[
                  '4K 高清影像錄製',
                  '多軌同步錄音', 
                  '專業後製剪輯',
                  '快速交付服務'
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className="w-12 h-px bg-amber-500"></span>
                    <span className="text-sm font-light tracking-wider text-gray-300">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Image Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-full min-h-[600px] lg:min-h-screen"
          >
            <div className="absolute inset-4 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-[60%] bg-gradient-to-br from-amber-900/20 to-amber-600/20 rounded-lg overflow-hidden relative">
                  <Image
                    src="/IMG_9089.JPG"
                    alt="Studio"
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={75}
                  />
                </div>
                <div className="h-[35%] bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg overflow-hidden relative">
                  <Image
                    src="/IMG_9054.JPG"
                    alt="Equipment"
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={75}
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-[45%] bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-lg overflow-hidden relative">
                  <Image
                    src="/IMG_9133.JPG"
                    alt="Recording"
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={75}
                  />
                </div>
                <div className="h-[50%] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl font-thin text-amber-500 mb-2">100+</div>
                    <div className="text-sm font-light tracking-[0.2em] text-gray-400">錄製場次</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section - Cards with Hover Effects */}
      <section id="服務" className="py-32 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black"></div>
        <div className="relative z-10 max-w-[90vw] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
              OUR SERVICES
            </span>
            <h2 className="text-5xl lg:text-7xl font-thin mb-8 leading-[1.2]">
              專業服務
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
              專注校園音樂會錄製，提供學生友善的專業服務
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "音樂會錄製",
                subtitle: "CONCERT RECORDING",
                price: "NT$ 10,980",
                features: ["4K 多機位拍攝", "多軌同步錄音", "專業調色校音", "快速交付"],
                color: "from-amber-600 to-orange-600"
              },
              {
                title: "直播服務",
                subtitle: "LIVE STREAMING",
                price: "NT$ 15,800",
                features: ["多平台同步", "即時導播切換", "互動功能整合", "錄影存檔"],
                color: "from-purple-600 to-pink-600"
              },
              {
                title: "後製發行",
                subtitle: "POST PRODUCTION",
                price: "NT$ 8,800",
                features: ["混音母帶處理", "影片剪輯調色", "數位發行上架", "版權登記"],
                color: "from-cyan-600 to-blue-600"
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-8">
                  <div className={`w-16 h-px bg-gradient-to-r ${service.color} mb-8`}></div>
                  <h3 className="text-2xl font-light mb-2">{service.title}</h3>
                  <p className="text-xs font-light tracking-[0.2em] text-gray-500 mb-6">
                    {service.subtitle}
                  </p>
                  <div className="text-3xl font-thin text-amber-500 mb-8">
                    {service.price}
                    <span className="text-sm text-gray-600 font-light"> 起</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        <span className="text-sm font-light text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/pricing" className="block w-full py-3 border border-zinc-700 text-sm font-light tracking-[0.2em] text-center">
                    了解詳情
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Special Offer Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 relative overflow-hidden rounded-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
            <div className="relative p-12 lg:p-16 text-center backdrop-blur-sm border border-amber-900/30">
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="inline-block text-xs font-light tracking-[0.3em] text-amber-500 mb-4"
                style={{
                  backgroundImage: "linear-gradient(90deg, #f59e0b, #ea580c, #f59e0b)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                LIMITED OFFER
              </motion.div>
              <h3 className="text-3xl lg:text-4xl font-thin mb-4">
                學生專屬優惠
              </h3>
              <p className="text-lg font-light text-gray-400 mb-8">
                憑學生證享全方案 8 折優惠
              </p>
              <Button
                size="lg"
                className="bg-amber-500 text-black hover:bg-amber-600 hover:scale-105 px-12 py-4 text-sm font-light tracking-[0.2em] transition-all duration-300"
                asChild
              >
                <Link href="/student-projects">
                  查看學生方案
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section - Masonry Grid */}
      <section id="作品" className="py-32 bg-zinc-950 relative">
        <div className="max-w-[90vw] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
              PORTFOLIO
            </span>
            <h2 className="text-5xl lg:text-7xl font-thin mb-8 leading-[1.2]">
              精選作品
            </h2>
          </motion.div>

          {/* Masonry Grid Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {[
              { span: "col-span-2 row-span-2", title: "鋼琴錄音", type: "古典樂", img: "/IMG_9106.JPG" },
              { span: "col-span-1 row-span-1", title: "爵士演出", type: "爵士樂", img: "/IMG_9124.JPG" },
              { span: "col-span-1 row-span-2", title: "室內樂錄製", type: "室內樂", img: "/IMG_9076.JPG" },
              { span: "col-span-1 row-span-1", title: "合唱錄音", type: "合唱團", img: "/IMG_9089.JPG" },
              { span: "col-span-2 row-span-1", title: "獨奏會錄影", type: "獨奏會", img: "/IMG_9102.JPG" },
              { span: "col-span-1 row-span-1", title: "弦樂錄製", type: "室內樂", img: "/IMG_9117.JPG" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`${item.span} relative cursor-pointer overflow-hidden rounded-lg group`}
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  loading="lazy"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-amber-500 text-xs font-light tracking-[0.2em]">
                    {item.type}
                  </span>
                  <h3 className="text-2xl font-light mt-2">{item.title}</h3>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 group-hover:scale-110">
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                    <Play className="h-6 w-6 text-black ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-16"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-700 text-white px-12 py-4 text-sm font-light tracking-[0.2em]"
              asChild
            >
              <Link href="/portfolio">
                瀏覽全部作品
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Minimalist Cards */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-[90vw] mx-auto">
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
            <h2 className="text-5xl lg:text-7xl font-thin">
              客戶見證
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                quote: "新創團隊很用心，錄製品質很好，價格也很學生友善。",
                author: "陳小明",
                title: "台大音樂系",
                rating: 5
              },
              {
                quote: "團隊年輕有活力，溝通很順暢，交付速度也很快。",
                author: "林雅婷",
                title: "師大管弦樂團",
                rating: 5
              },
              {
                quote: "CP值很高，服務態度親切，是學生音樂會的好選擇。",
                author: "王大衛",
                title: "政大合唱團",
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
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <span key={j} className="text-amber-500 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-lg font-light leading-[1.2] text-gray-300 mb-8">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-orange-600"></div>
                    <div>
                      <div className="font-light">{testimonial.author}</div>
                      <div className="text-sm font-light text-gray-500">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Dramatic & Minimal */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-black"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
        >
          <h2 className="text-5xl lg:text-7xl font-thin mb-10 leading-[1.2]">
            開始你的
            <br />
            <span className="italic font-extralight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400">專業錄製</span>
          </h2>
          <p className="text-xl font-light text-gray-400 mb-12 max-w-2xl mx-auto">
            讓我們為你的音樂注入專業品質
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 text-white px-12 py-6 text-base font-medium tracking-[0.1em] transition-all duration-300"
              asChild
            >
              <Link href="/contact">
                立即預約諮詢
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-white/10 hover:bg-amber-500/20 text-amber-400 border-2 border-amber-400/50 hover:border-amber-400 hover:scale-105 px-12 py-6 text-base font-medium tracking-[0.1em] transition-all duration-300"
              asChild
            >
              <Link href="/pricing">
                查看完整價格
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 flex flex-wrap justify-center gap-6 text-sm font-light text-gray-500"
          >
            <span>24小時內回覆</span>
            <span className="hidden sm:inline">·</span>
            <span>免費諮詢</span>
            <span className="hidden sm:inline">·</span>
            <span>無隱藏費用</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer - Ultra Minimal */}
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
                {['音樂會錄製', '直播服務', '後製發行', '場地錄音'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm font-light text-gray-500">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-light tracking-[0.3em] text-gray-400 mb-6">COMPANY</h4>
              <ul className="space-y-3">
                {['關於我們', '作品集', '定價方案', '聯絡我們'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm font-light text-gray-500">
                      {item}
                    </a>
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
              <a href="#" className="text-xs font-light text-gray-600">
                隱私政策
              </a>
              <a href="#" className="text-xs font-light text-gray-600">
                服務條款
              </a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}