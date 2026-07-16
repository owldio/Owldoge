"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  currentPage?: string;
}

const navItems = [
  { label: "學生專案", href: "/student-projects", highlight: true, id: "student-projects" },
  { label: "服務項目", href: "/services", id: "services" },
  { label: "價目方案", href: "/pricing", id: "pricing" },
  { label: "作品展示", href: "/portfolio", id: "portfolio" },
  { label: "聯絡預約", href: "/contact", id: "contact" },
];

const Navigation = ({ currentPage }: NavigationProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      setIsPastHero(window.scrollY > window.innerHeight * 0.6);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-500 ${
        isScrolled || showMobileMenu
          ? "border-b border-hairline bg-night-veil-strong"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setShowMobileMenu(false)}
        >
          <Image
            src="/Owldio.svg"
            alt="Owldio"
            width={44}
            height={44}
            className="h-11 w-11 brightness-0 invert transition-opacity duration-300"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-medium tracking-[0.28em] text-parchment">
              OWLDIO
            </span>
            <span className="mt-1.5 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
              CONCERT RECORDING
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="主選單" className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative pb-1 text-[0.9rem] tracking-[0.08em] transition-colors duration-300 ${
                  isActive
                    ? "text-copper-bright"
                    : item.highlight
                      ? "text-parchment hover:text-copper-bright"
                      : "text-parchment-dim hover:text-parchment"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-px bg-copper transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="border border-hairline-strong px-6 py-2.5 text-sm tracking-[0.14em] text-parchment transition-all duration-300 hover:border-copper hover:bg-copper hover:text-night"
          >
            詢問檔期
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={showMobileMenu ? "關閉選單" : "開啟選單"}
          aria-expanded={showMobileMenu}
          onClick={() => setShowMobileMenu((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center border border-hairline text-parchment transition-colors duration-300 hover:border-copper lg:hidden"
        >
          {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu — full programme page */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            key="mobile-menu"
            initial={{ y: -14 }}
            animate={{ y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-[69px] z-40 flex flex-col bg-night lg:hidden"
          >
            <nav aria-label="行動選單" className="flex flex-1 flex-col justify-center px-8">
              {navItems.map((item, index) => {
                const isActive = currentPage === item.id;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: 0.06 + index * 0.06 }}
                    className="border-b border-hairline"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-baseline justify-between py-5 ${
                        isActive ? "text-copper-bright" : "text-parchment"
                      }`}
                    >
                      <span className="text-2xl font-light tracking-[0.06em]">{item.label}</span>
                      <span className="font-mono text-xs text-parchment-faint">
                        0{index + 1}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.42 }}
              className="px-8 pb-12"
            >
              <Link
                href="/contact"
                onClick={() => setShowMobileMenu(false)}
                className="block border border-copper bg-copper px-6 py-4 text-center text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
              >
                詢問檔期
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky CTA — appears once the hero has scrolled past */}
      <AnimatePresence>
        {isPastHero && !showMobileMenu && currentPage !== "contact" && (
          <motion.div
            key="mobile-cta"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-night-veil-strong px-5 pb-[calc(env(safe-area-inset-bottom)+0.7rem)] pt-3 backdrop-blur-md lg:hidden"
          >
            <Link
              href="/contact"
              className="flex items-center justify-center gap-3 bg-copper py-3.5 text-sm tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
            >
              詢問檔期 · 24 小時內回覆
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
