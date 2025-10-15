"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
}

const EmailModal = ({ isOpen, onClose, recipientEmail }: EmailModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // 模擬發送郵件 (實際應用中需要後端 API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    setIsSent(true);
    
    // 2秒後關閉視窗
    setTimeout(() => {
      onClose();
      setIsSent(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* 彈出視窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl">
              {/* 標題列 */}
              <div className="flex items-center justify-between p-6 border-b border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-500/30">
                    <Mail className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-thin tracking-[0.2em] text-amber-50">傳送郵件</h3>
                    <p className="text-sm text-amber-100/60 font-light">至 {recipientEmail}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-amber-500/10 transition-colors"
                >
                  <X className="h-5 w-5 text-amber-100/60 hover:text-amber-500" />
                </button>
              </div>
              
              {/* 表單內容 */}
              {!isSent ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        您的姓名 *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all"
                        placeholder="請輸入姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        您的 Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                      主旨 *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all"
                      placeholder="請輸入郵件主旨"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                      訊息內容 *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all resize-none"
                      placeholder="請詳細說明您的需求..."
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="outline"
                      className="flex-1 bg-transparent border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50 text-amber-100 font-light tracking-[0.1em]"
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSending}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-light tracking-[0.1em] border-none shadow-xl hover:shadow-amber-500/20"
                    >
                      {isSending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          發送中...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          發送郵件
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div className="w-16 h-16 bg-amber-500/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                      <Send className="h-8 w-8 text-amber-500" />
                    </div>
                  </motion.div>
                  <h4 className="text-xl font-thin tracking-[0.2em] text-amber-50 mb-2">郵件已發送</h4>
                  <p className="text-amber-100/60 font-light">我們將盡快回覆您的郵件</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmailModal;