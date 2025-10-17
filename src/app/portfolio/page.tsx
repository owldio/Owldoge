"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Grid, Video, Music, Clock, Star, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import MouseGlow from "@/components/MouseGlow";
import BackgroundGradient from "@/components/BackgroundGradient";

export default function PortfolioPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const categories = [
    { id: "all", name: "全部作品", icon: Grid },
    { id: "classical", name: "古典樂", icon: Music },
    { id: "chamber", name: "室內樂", icon: Users },
    { id: "solo", name: "獨奏會", icon: Star },
    { id: "student", name: "學生專案", icon: "🎓" }
  ];

  const portfolioWorks = [
    {
      id: 1,
      title: "鋼琴獨奏會錄影",
      category: "classical",
      type: "古典樂",
      artist: "客戶委託",
      venue: "音樂廳",
      date: "2024.06",
      duration: "90 分鐘",
      image: "/IMG_9106.JPG",
      video: "/percussion.mp4",
      description: "專業鋼琴獨奏會錄影，完整捕捉演奏者的精湛技巧與音樂表現",
      highlights: ["4K 三機位拍攝", "24軌錄音", "色彩校正", "實況直播"],
      featured: true
    },
    {
      id: 2,
      title: "管弦樂團音樂會錄影",
      category: "classical",
      type: "交響樂",
      artist: "客戶委託",
      venue: "音樂廳",
      date: "2024.05",
      duration: "120 分鐘",
      image: "/IMG_9089.JPG",
      video: "/percussion.mp4",
      description: "大型管弦樂團演出錄影，多機位拍攝捕捉整個樂團的壯觀氣勢",
      highlights: ["多機位拍攝", "空間錄音", "特殊需求處理"],
      featured: true
    },
    {
      id: 3,
      title: "合唱團公演錄影",
      category: "classical",
      type: "合唱",
      artist: "客戶委託",
      venue: "藝文中心",
      date: "2024.04",
      duration: "110 分鐘",
      image: "/IMG_9124.JPG",
      video: "/percussion.mp4",
      description: "合唱團公演完整錄影，專業的音響設備捕捉每一個声部細節",
      highlights: ["空間音響", "合唱收音", "後製混音"],
      featured: false
    },
    {
      id: 4,
      title: "小提琴獨奏會錄影",
      category: "solo",
      type: "獨奏會",
      artist: "客戶委託",
      venue: "音樂廳",
      date: "2024.03",
      duration: "80 分鐘",
      image: "/IMG_9076.JPG",
      video: "/percussion.mp4",
      description: "小提琴獨奏會的精綻錄影，近距離捕捉演奏者的每一個細節",
      highlights: ["親密錄音", "近距離拍攝", "細節捕捉"],
      featured: false
    },
    {
      id: 5,
      title: "室內樂演出錄影",
      category: "chamber",
      type: "室內樂",
      artist: "客戶委託",
      venue: "演奏廳",
      date: "2024.02",
      duration: "100 分鐘",
      image: "/IMG_9102.JPG",
      video: "/percussion.mp4",
      description: "室內樂團演出的完整錄影，專業的音響設備展現最佳效果",
      highlights: ["多組錄製", "快速轉換", "統一品質"],
      featured: false
    },
    {
      id: 6,
      title: "爵士樂團演出錄影",
      category: "chamber",
      type: "爵士樂",
      artist: "客戶委託",
      venue: "演出場地",
      date: "2024.01",
      duration: "95 分鐘",
      image: "/IMG_9117.JPG",
      video: "/percussion.mp4",
      description: "爵士樂團現場演出錄影，捕捉現場的熱烈氣氛與音樂魅力",
      highlights: ["現場氛圍", "動態收音", "節奏感"],
      featured: false
    }
  ];

  const filteredWorks = selectedFilter === "all" 
    ? portfolioWorks 
    : portfolioWorks.filter(work => work.category === selectedFilter);

  const featuredWorks = portfolioWorks.filter(work => work.featured);

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
      <Navigation currentPage="portfolio" />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-black"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 backdrop-blur-sm border border-zinc-700/50 rounded-full text-gray-400 text-sm font-light tracking-[0.3em] mb-8">
                PORTFOLIO
              </span>
              
              <h1 className="text-[clamp(3rem,8vw,6rem)] font-thin leading-[1.2] mb-8">
                精選作品
                <br />
                <span className="font-extralight italic text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  音樂記憶
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl font-light text-gray-400 mb-12 max-w-3xl mx-auto leading-[1.2]">
                超過 100+ 場音樂會錄製經驗
                <br />
                每一場都是獨特的藝術創作
              </p>

              <div className="flex items-center justify-center gap-8 text-sm font-light text-gray-500">
                <span className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  100+ 場錄製
                </span>
                <span>·</span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  50+ 學校合作
                </span>
                <span>·</span>
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  4.9 滿意度
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Works */}
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
                FEATURED WORKS
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2]">
                精選項目
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredWorks.map((work, i) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative cursor-pointer"
                  onClick={() => console.log('Selected work:', work.title)}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img 
                      src={work.image}
                      alt={work.title}
                      className="w-full aspect-[16/10] object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Play Button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                      >
                        <Play className="h-8 w-8 text-black ml-1" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-amber-600 text-black rounded-full text-xs font-bold">
                          {work.type}
                        </span>
                        <span className="text-xs text-gray-300">{work.date}</span>
                      </div>
                      <h3 className="text-2xl font-light mb-2 text-white">{work.title}</h3>
                      <p className="text-sm font-light text-gray-300 mb-4">{work.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {work.highlights.slice(0, 3).map((highlight, j) => (
                          <span key={j} className="text-xs text-amber-500/70 bg-amber-500/10 px-2 py-1 rounded">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter & Gallery */}
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
              <span className="text-amber-500 text-xs font-light tracking-[0.3em] mb-6 block">
                ALL WORKS
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2]">
                完整作品集
              </h2>
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedFilter(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-full text-sm font-light tracking-wider transition-all duration-300 ${
                    selectedFilter === category.id
                      ? 'bg-amber-600 text-black'
                      : 'bg-zinc-800/50 border border-zinc-700 text-gray-400 hover:border-amber-600/50 hover:text-amber-500'
                  }`}
                >
                  {typeof category.icon === 'string' ? (
                    <span className="mr-2">{category.icon}</span>
                  ) : (
                    <category.icon className="w-4 h-4 inline mr-2" />
                  )}
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* Works Grid */}
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredWorks.map((work, i) => (
                <motion.div
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => console.log('Selected work:', work.title)}
                  className="group relative cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                    <img 
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Play Button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center"
                      >
                        <Play className="h-5 w-5 text-black ml-0.5" />
                      </motion.div>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-light text-white">
                      {work.date}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-amber-500 text-xs font-light tracking-[0.2em]">
                        {work.type}
                      </span>
                      <span className="text-gray-600">·</span>
                      <span className="text-xs text-gray-500">{work.venue}</span>
                    </div>
                    <h3 className="text-xl font-light mb-2 text-white group-hover:text-amber-500 transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-sm font-light text-gray-500 mb-4">
                      {work.artist}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {work.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
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
                className="border-zinc-700 hover:border-amber-500 hover:text-amber-500 px-12 py-4 text-sm font-light tracking-[0.2em] transition-all duration-500"
              >
                載入更多作品
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
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
                ACHIEVEMENTS
              </span>
              <h2 className="text-5xl lg:text-6xl font-thin mb-8 leading-[1.2]">
                我們的成就
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "100+", label: "錄製場次", icon: Video },
                { number: "50+", label: "合作學校", icon: Users },
                { number: "4.9", label: "平均評分", icon: Star },
                { number: "72h", label: "最快交付", icon: Clock }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-4 rounded-lg bg-zinc-900/30 border border-zinc-800 mb-6">
                    <stat.icon className="h-8 w-8 text-amber-500" />
                  </div>
                  <div className="text-4xl font-thin text-white mb-2">{stat.number}</div>
                  <div className="text-sm font-light text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
            <h2 className="text-5xl lg:text-6xl font-thin mb-10 leading-[1.2]">
              讓我們記錄
              <br />
              <span className="italic font-extralight text-amber-500">你的音樂故事</span>
            </h2>
            <p className="text-xl font-light text-gray-400 mb-12 max-w-2xl mx-auto">
              成為下一個精選作品的主角
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="group bg-amber-600 hover:bg-amber-700 text-black px-12 py-6 text-sm font-light tracking-[0.2em] transition-all duration-500"
                asChild
              >
                <Link href="/contact">
                  立即預約錄製
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-zinc-700 hover:border-amber-500 hover:text-amber-500 px-12 py-6 text-sm font-light tracking-[0.2em] transition-all duration-500"
                asChild
              >
                <Link href="/pricing">
                  查看價格方案
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
              <img src="/Owldio.svg" alt="Owldio" className="h-6 w-6 invert" />
              <span className="text-lg font-light tracking-[0.1em]">OWLDIO</span>
              <span className="text-xs font-light text-gray-600">© 2024</span>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-xs font-light text-gray-600 hover:text-amber-500 transition-colors">
                首頁
              </Link>
              <Link href="/student-projects" className="text-xs font-light text-gray-600 hover:text-amber-500 transition-colors">
                學生專案
              </Link>
              <Link href="/services" className="text-xs font-light text-gray-600 hover:text-amber-500 transition-colors">
                服務
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