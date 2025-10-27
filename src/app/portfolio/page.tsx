"use client"

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import BackgroundGradient from "@/components/BackgroundGradient";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-black text-amber-50">
      <BackgroundGradient />
      <Navigation currentPage="portfolio" />

      <main className="pt-32">
        {/* Coming Soon Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black"></div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-6 py-3 bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full text-amber-100/60 text-sm font-light tracking-[0.3em] mb-8">
                COMING SOON
              </div>
              
              <h1 className="text-[clamp(3rem,8vw,6rem)] font-thin leading-[1.2] mb-8">
                精選作品
                <br />
                <span className="font-extralight italic text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  即將推出
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-amber-100/60 mb-12 max-w-3xl mx-auto leading-relaxed tracking-[0.1em]">
                我們正在精心準備精彩的作品集，敬請期待
              </p>

              <div className="flex items-center justify-center gap-8 text-sm font-light text-amber-100/40 mb-12">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  即將上線
                </span>
                <span>·</span>
                <span>專業作品集</span>
                <span>·</span>
                <span>高品質展示</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="group bg-amber-500 hover:bg-amber-600 hover:scale-105 text-black px-12 py-6 text-sm font-light tracking-[0.15em] transition-all duration-300 border-none"
                  asChild
                >
                  <Link href="/contact">
                    立即預約
                    <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 text-amber-50 px-12 py-6 text-sm font-light tracking-[0.15em] transition-all duration-300"
                  asChild
                >
                  <Link href="/services">
                    瀏覽服務
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Placeholder Content */}
        <section className="py-20 bg-zinc-950 relative">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-thin mb-8 tracking-[0.15em] text-amber-50">
                為什麼選擇 Owldio？
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    title: "專業品質",
                    description: "4K高畫質錄影，專業級音響設備"
                  },
                  {
                    title: "學生友善",
                    description: "專為學生設計的優惠方案與靈活服務"
                  },
                  {
                    title: "快速交付",
                    description: "高效後製流程，確保準時交付"
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-6 bg-black/40 backdrop-blur-xl border border-amber-500/20 rounded-lg"
                  >
                    <h3 className="text-lg font-light text-amber-50 mb-3 tracking-[0.1em]">
                      {feature.title}
                    </h3>
                    <p className="text-sm font-light text-amber-100/60 leading-relaxed tracking-[0.05em]">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-500/20 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/Owldio.svg" alt="Owldio" width={24} height={24} className="h-6 w-6 brightness-0 invert" />
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