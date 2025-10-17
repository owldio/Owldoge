"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Calendar,
  Music,
  Video,
  Users,
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  Menu,
  Facebook,
  Instagram
} from "lucide-react";
import Navigation from "@/components/Navigation";
import MouseGlow from "@/components/MouseGlow";
import BackgroundGradient from "@/components/BackgroundGradient";
import EmailModal from "@/components/EmailModal";

const ContactPage = () => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    eventType: "",
    eventDate: "",
    venue: "",
    duration: "",
    participants: "",
    budget: "",
    services: [] as string[],
    additionalInfo: "",
    urgency: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const eventTypes = [
    "畢業獨奏會",
    "室內樂演出",
    "合唱團表演",
    "樂團演出",
    "成果發表會",
    "比賽錄影",
    "其他"
  ];

  const serviceOptions = [
    { id: "recording", label: "專業錄音", icon: <Music className="h-4 w-4" /> },
    { id: "video", label: "錄影服務", icon: <Video className="h-4 w-4" /> },
    { id: "live", label: "直播服務", icon: <Users className="h-4 w-4" /> },
    { id: "editing", label: "後製剪輯", icon: <CheckCircle2 className="h-4 w-4" /> }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-amber-500/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <CheckCircle2 className="h-10 w-10 text-amber-500" />
            </div>
            <h1 className="text-2xl font-thin text-amber-50 mb-2 tracking-[0.2em]">預約申請已送出</h1>
            <p className="text-amber-100/60 font-light">
              感謝您的預約申請，我們將在 24 小時內與您聯繫，提供詳細報價與檔期確認。
            </p>
          </div>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-black font-light tracking-[0.1em] border-none shadow-xl hover:shadow-amber-500/20"
            asChild
          >
            <Link href="/">返回首頁</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-amber-50">
      <BackgroundGradient />
      <MouseGlow />
      <Navigation currentPage="contact" />

      <main className="py-32">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-thin mb-8 tracking-[0.3em] leading-[1.2]">
              <span className="bg-gradient-to-r from-amber-200 via-amber-500 to-yellow-400 bg-clip-text text-transparent">
                聯絡預約
              </span>
            </h1>
            <p className="text-xl text-amber-100/60 max-w-2xl mx-auto font-light tracking-[0.1em]">
              填寫表單告訴我們您的需求
              <br />
              我們將在 24 小時內回覆詳細報價與檔期安排
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/20 p-8 shadow-2xl">
                <h2 className="text-2xl font-thin text-amber-50 mb-6 tracking-[0.2em]">預約表單</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        姓名 *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="請輸入您的姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        聯絡電話
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="09XX-XXX-XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        學校/機構
                      </label>
                      <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="例：國立台灣大學"
                      />
                    </div>
                  </div>

                  <div className="border-t border-amber-500/20 pt-6">
                    <h3 className="text-lg font-light text-amber-50 mb-4 tracking-[0.15em]">演出資訊</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                          演出類型 *
                        </label>
                        <select
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        >
                          <option value="">請選擇演出類型</option>
                          {eventTypes.map(type => (
                            <option key={type} value={type} className="bg-black text-amber-50">{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                          演出日期 *
                        </label>
                        <input
                          type="date"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                          演出場地
                        </label>
                        <input
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                          placeholder="例：音樂廳、演奏廳"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                          演出時長
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                          placeholder="例：60分鐘、90分鐘"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        參與人數
                      </label>
                      <input
                        type="text"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="例：獨奏、四重奏、20人合唱團"
                      />
                    </div>
                  </div>

                  <div className="border-t border-amber-500/20 pt-6">
                    <h3 className="text-lg font-light text-amber-50 mb-4 tracking-[0.15em]">需要的服務</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {serviceOptions.map(service => (
                        <label key={service.id} className="flex items-center p-4 bg-black/30 border border-amber-500/20 rounded-xl cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-xl">
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service.id)}
                            onChange={() => handleServiceChange(service.id)}
                            className="mr-3 w-4 h-4 text-amber-500 bg-black/50 border-amber-500/30 rounded focus:ring-amber-500/50"
                          />
                          <div className="flex items-center gap-2">
                            {service.icon}
                            <span className="font-light text-amber-50 tracking-[0.05em]">{service.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 border-t border-amber-500/20 pt-6">
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        預算範圍
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                      >
                        <option value="">請選擇預算範圍</option>
                        <option value="3000-5000" className="bg-black text-amber-50">NT$ 3,000 - 5,000</option>
                        <option value="5000-8000" className="bg-black text-amber-50">NT$ 5,000 - 8,000</option>
                        <option value="8000-12000" className="bg-black text-amber-50">NT$ 8,000 - 12,000</option>
                        <option value="12000-20000" className="bg-black text-amber-50">NT$ 12,000 - 20,000</option>
                        <option value="20000+" className="bg-black text-amber-50">NT$ 20,000 以上</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        急件需求
                      </label>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                      >
                        <option value="">一般交件時間</option>
                        <option value="72h" className="bg-black text-amber-50">72小時急件</option>
                        <option value="48h" className="bg-black text-amber-50">48小時急件</option>
                        <option value="24h" className="bg-black text-amber-50">24小時急件</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                      其他需求說明
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                      placeholder="請詳述您的特殊需求、曲目資訊或其他注意事項..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-lg font-light tracking-[0.15em] bg-amber-500 hover:bg-amber-600 text-black border-none shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        送出中...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        送出預約申請
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 shadow-2xl">
                <h3 className="text-xl font-thin text-amber-50 mb-6 tracking-[0.2em]">聯絡資訊</h3>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setIsEmailModalOpen(true)}
                    className="flex items-center gap-4 w-full text-left group hover:translate-x-1 transition-transform"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 group-hover:bg-amber-500/30 transition-all">
                      <Mail className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-light text-amber-50 tracking-[0.1em]">Email</p>
                      <p className="text-amber-100/60 font-light group-hover:text-amber-500 transition-colors">owldio.art@gmail.com</p>
                    </div>
                  </button>
                  
                  <a href="https://lin.ee/v3uTStG" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 group-hover:bg-amber-500/30 transition-all">
                      <MessageCircle className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-light text-amber-50 tracking-[0.1em]">LINE</p>
                      <p className="text-amber-100/60 font-light group-hover:text-amber-500 transition-colors">@owldio</p>
                    </div>
                  </a>
                  
                  <a href="https://www.facebook.com/owldio.art" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 group-hover:bg-amber-500/30 transition-all">
                      <Facebook className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-light text-amber-50 tracking-[0.1em]">Facebook</p>
                      <p className="text-amber-100/60 font-light group-hover:text-amber-500 transition-colors">@owldio.art</p>
                    </div>
                  </a>
                  
                  <a href="https://instagram.com/owldio.art" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 group-hover:bg-amber-500/30 transition-all">
                      <Instagram className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-light text-amber-50 tracking-[0.1em]">Instagram</p>
                      <p className="text-amber-100/60 font-light group-hover:text-amber-500 transition-colors">@owldio.art</p>
                    </div>
                  </a>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-500/30">
                      <Clock className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-light text-amber-50 tracking-[0.1em]">回覆時間</p>
                      <p className="text-amber-100/60 font-light">24 小時內回覆</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 shadow-2xl">
                <h3 className="text-xl font-thin text-amber-50 mb-4 tracking-[0.2em]">服務承諾</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-100/80 font-light tracking-[0.05em]">24 小時內回覆報價</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-100/80 font-light tracking-[0.05em]">免費檔期查詢</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-100/80 font-light tracking-[0.05em]">學生優惠價格</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-100/80 font-light tracking-[0.05em]">專業品質保證</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl">
                <h3 className="text-xl font-thin text-amber-50 mb-4 tracking-[0.2em]">急件諮詢</h3>
                <p className="text-amber-100/60 mb-6 font-light tracking-[0.05em]">
                  如有急件需求或特殊情況，歡迎直接與我們聯絡
                </p>
                <Button 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-light tracking-[0.1em] border-none shadow-xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  立即聯絡
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        recipientEmail="owldio.art@gmail.com"
      />

      <footer className="border-t border-amber-500/20 mt-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center">
              <img src="/Owldio.svg" alt="Owldio" className="h-8 w-8 brightness-0 invert" />
            </div>
            <span className="font-light tracking-[0.1em] text-amber-50">Owldio</span>
            <span className="text-amber-100/60 font-light">© 2024</span>
          </div>
          <div className="flex gap-4 font-light tracking-[0.05em]">
            <Link href="/" className="text-amber-100/80 hover:text-amber-500 transition-colors">首頁</Link>
            <Link href="/services" className="text-amber-100/80 hover:text-amber-500 transition-colors">服務</Link>
            <Link href="/pricing" className="text-amber-100/80 hover:text-amber-500 transition-colors">價目</Link>
            <Link href="/portfolio" className="text-amber-100/80 hover:text-amber-500 transition-colors">作品</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;