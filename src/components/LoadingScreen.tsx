"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onAnimationComplete: () => void;
}

export default function LoadingScreen({ onAnimationComplete }: LoadingScreenProps) {
  const [stage, setStage] = useState<'black' | 'logo' | 'fade' | 'complete'>('black');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('logo'), 500);
    const timer2 = setTimeout(() => setStage('fade'), 2500);
    const timer3 = setTimeout(() => {
      setStage('complete');
      onAnimationComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []); // 空依賴陣列，只執行一次

  return (
    <AnimatePresence>
      {stage !== 'complete' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={stage === 'logo' ? { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { 
                duration: 1, 
                ease: "easeOut",
                delay: 0.2
              }
            } : stage === 'fade' ? {
              opacity: 0,
              scale: 1.1,
              transition: {
                duration: 0.8,
                ease: "easeInOut"
              }
            } : {}}
            className="flex flex-col items-center"
          >
            <motion.img
              src="/Owldio.svg"
              alt="Owldio"
              className="h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 mb-6"
              animate={stage === 'logo' ? {
                filter: "brightness(0) invert(1)",
                transition: { duration: 0.3, delay: 0.5 }
              } : {}}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={stage === 'logo' ? {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.8 }
              } : stage === 'fade' ? {
                opacity: 0,
                transition: { duration: 0.8 }
              } : {}}
              className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide"
            >
              Owldio
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}