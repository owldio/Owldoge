"use client"

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoShowcaseProps {
  videoSrc: string;
  title?: string;
  description?: string;
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ 
  videoSrc, 
  title = "音樂會精彩片段",
  description = "現場演出精華"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative"
    >
      {/* iPhone 17 風格的影片容器 */}
      <div className="relative mx-auto" style={{ width: '240px', perspective: '1000px' }}>
        {/* iPhone 17 框架 - 增加立體感 */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 p-[3px] shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:shadow-[0_25px_60px_rgba(8,_112,_184,_0.8)] transition-all duration-300 transform hover:rotateY-[2deg] hover:scale-[1.02]"
             style={{ 
               background: 'linear-gradient(145deg, #4a4a4a, #1a1a1a)',
               boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.1), inset -2px -2px 5px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3)',
               transform: 'rotateX(2deg) rotateY(-1deg)'
             }}>
          {/* 金屬質感邊框 */}
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-zinc-400/20 via-transparent to-zinc-900/30 pointer-events-none"></div>
          
          {/* 內部螢幕框 */}
          <div className="relative rounded-[2.8rem] bg-black p-[2px]" 
               style={{ 
                 boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8), inset 0 -2px 10px rgba(255,255,255,0.05)' 
               }}>
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-16 h-5 bg-black rounded-full" 
                 style={{ 
                   boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.9), 0 1px 2px rgba(255,255,255,0.1)' 
                 }}></div>
            
            {/* 螢幕 */}
            <div className="relative overflow-hidden rounded-[2.6rem] bg-black"
                 style={{ 
                   boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' 
                 }}>
            {/* 影片容器 */}
            <div 
              className="relative aspect-[9/16] cursor-pointer group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(isPlaying ? false : true)}
              onClick={handleVideoClick}
            >
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={videoSrc}
                muted={isMuted}
                playsInline
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                onEnded={() => setIsPlaying(false)}
              />
              
              {/* 漸層覆蓋 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
              
              {/* 播放控制覆蓋層 */}
              <motion.div 
                className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
                initial={false}
                animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-slate-800" />
                  ) : (
                    <Play className="h-6 w-6 text-slate-800 ml-1" />
                  )}
                </motion.div>
              </motion.div>

              {/* 底部控制列 */}
              <motion.div 
                className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
                initial={false}
                animate={{ opacity: showControls ? 1 : 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-white/20 to-blue-200/30 backdrop-blur-sm text-slate-900 hover:from-white/40 hover:to-blue-200/50 transition-all duration-300 shadow-lg"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* 頂部標題 */}
              <div className="absolute top-0 left-0 right-0 p-4">
                <div className="text-slate-900">
                  <h3 className="text-sm font-semibold text-shadow">{title}</h3>
                  <p className="text-xs opacity-80">{description}</p>
                </div>
              </div>
            </div>
          </div>
          </div>
          
          {/* 側邊按鈕 - 音量鍵 */}
          <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-l-lg"
               style={{ 
                 boxShadow: 'inset 1px 0 2px rgba(255,255,255,0.2), -2px 0 4px rgba(0,0,0,0.3)' 
               }}></div>
          <div className="absolute -left-[3px] top-36 w-[3px] h-8 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-l-lg"
               style={{ 
                 boxShadow: 'inset 1px 0 2px rgba(255,255,255,0.2), -2px 0 4px rgba(0,0,0,0.3)' 
               }}></div>
          
          {/* 側邊按鈕 - 電源鍵 */}
          <div className="absolute -right-[3px] top-32 w-[3px] h-12 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-r-lg"
               style={{ 
                 boxShadow: 'inset -1px 0 2px rgba(255,255,255,0.2), 2px 0 4px rgba(0,0,0,0.3)' 
               }}></div>
          
          {/* iPhone 底部指示器 */}
          <div className="absolute bottom-3 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-gradient-to-r from-zinc-600/60 via-zinc-400/80 to-zinc-600/60"
               style={{ 
                 boxShadow: '0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.2)' 
               }}></div>
        </div>

        {/* 浮動裝飾元素 */}
        <div className="absolute -right-6 top-8 h-4 w-4 rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 opacity-80 animate-pulse shadow-lg"></div>
        <div className="absolute -left-4 bottom-12 h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 opacity-60 animate-pulse delay-1000 shadow-lg"></div>
        <div className="absolute -top-2 left-8 h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 opacity-70 animate-pulse delay-500 shadow-md"></div>

        {/* 品質標章 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="absolute -left-8 bottom-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-800/95 to-emerald-900/95 p-3 shadow-2xl backdrop-blur-sm hidden lg:block hover:shadow-3xl transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
            </div>
            <span className="text-sm font-medium text-slate-900">專業品質</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VideoShowcase;