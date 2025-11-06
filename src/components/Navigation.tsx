"use client"

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: "學生專案", href: "/student-projects", highlight: true, id: "student-projects" },
    { label: "服務項目", href: "/services", id: "services" },
    { label: "價目方案", href: "/pricing", id: "pricing" },
    { label: "作品展示", href: "/portfolio", id: "portfolio" },
    { label: "聯絡預約", href: "/contact", id: "contact" }
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [showMobileMenu]);

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-black/80 border-b border-amber-500/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="flex h-12 w-12 items-center justify-center"
          >
            <Image src="/Owldio.svg" alt="Owldio" width={40} height={40} className="h-10 w-10 brightness-0 invert" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-thin tracking-[0.2em] text-amber-50">
              OWLDIO
            </span>
            <span className="text-xs text-amber-100/60 font-normal tracking-[0.1em]">專業音樂會錄製服務</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden gap-10 lg:flex">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`text-sm font-normal tracking-[0.1em] transition-all duration-300 relative group ${
                currentPage === item.id
                  ? "text-amber-500" 
                  : item.highlight 
                  ? "text-amber-50 hover:text-amber-500" 
                  : "text-amber-100/70 hover:text-amber-500"
              }`}
            >
              {item.highlight && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-2 -right-3 text-xs"
                >
                  ✨
                </motion.span>
              )}
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                currentPage === item.id
                  ? "w-full bg-amber-500" 
                  : "w-0 group-hover:w-full bg-amber-500"
              }`}></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-all duration-300 border border-amber-500/30"
        >
          {showMobileMenu ? (
            <X className="h-5 w-5 text-amber-500" />
          ) : (
            <Menu className="h-5 w-5 text-amber-500" />
          )}
        </button>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-black font-normal tracking-[0.1em] px-6 border-none shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:scale-[1.02]"
            asChild
          >
            <Link href="/contact">立即預約</Link>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {/* Mobile Menu Backdrop - Click to close */}
        {showMobileMenu && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            key="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden absolute left-0 right-0 top-full z-50 border-t border-amber-500/20 bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mx-auto max-w-7xl px-4 py-4"
            >
              <nav className="space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link 
                      href={item.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={`block text-sm font-normal tracking-[0.1em] py-3 px-4 rounded-lg transition-all duration-300 ${
                        currentPage === item.id
                          ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" 
                          : item.highlight 
                          ? "text-amber-50 hover:bg-amber-500/10 hover:border hover:border-amber-500/30" 
                          : "text-amber-100/70 hover:bg-amber-500/10 hover:border hover:border-amber-500/30"
                      }`}
                    >
                      {item.highlight && <span className="mr-2">✨</span>}
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-4 pt-4 border-t border-amber-500/20"
              >
                <Button 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-normal tracking-[0.1em] border-none shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/contact">立即預約</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;