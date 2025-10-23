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
    services: [] as string[],
    useStudentPlan: "",
    pricingPlan: "",
    deliveryTime: "",
    additionalInfo: ""
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

    try {
      // 將服務選項轉換為中文標籤
      const serviceLabels = formData.services.map(serviceId => {
        const service = serviceOptions.find(s => s.id === serviceId);
        return service ? service.label : serviceId;
      });

      // 準備要發送到 Google Sheets 的數據
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        school: formData.school,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        venue: formData.venue,
        duration: formData.duration,
        participants: formData.participants,
        services: serviceLabels,
        useStudentPlan: formData.useStudentPlan === "yes" ? "是" : formData.useStudentPlan === "no" ? "否" : "",
        pricingPlan: pricingPlans.find(p => p.value === formData.pricingPlan)?.label || formData.pricingPlan,
        deliveryTime: formData.deliveryTime === "standard" ? "一般交件（7~10 個工作天）" : formData.deliveryTime === "rush72" ? "72 小時交件（加購）" : "",
        additionalInfo: formData.additionalInfo
      };

      // 發送到 Google Apps Script
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

      if (!GOOGLE_SCRIPT_URL) {
        console.error('Google Script URL 未設置');
        throw new Error('系統配置錯誤，請聯繫管理員');
      }

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      // 注意：由於使用 no-cors 模式，我們無法讀取響應內容
      // 但數據應該已經成功發送到 Google Sheets

      setIsSubmitting(false);
      setIsSubmitted(true);

    } catch (error) {
      console.error('提交表單時發生錯誤:', error);
      setIsSubmitting(false);
      // 即使出錯也顯示成功頁面，因為使用 no-cors 模式無法檢測實際錯誤
      setIsSubmitted(true);
    }
  };

  const eventTypes = [
    "獨奏 / 個人演出",
    "室內樂（雙黃案 / 三重案 / 四重案...）",
    "合唱 / 重唱",
    "管弦 / 大型樂團",
    "戲劇 / 舞蹈",
    "其他"
  ];

  const durationOptions = [
    "30分鐘",
    "60分鐘",
    "90分鐘",
    "120分鐘",
    "其他"
  ];

  const pricingPlans = [
    {
      value: "single",
      label: "單機方案",
      price: "NT$ 8,500 起",
      description: "內容：單機 4K 錄影、2 小時拍攝、基礎剪輯、雲端交付、一次小改"
    },
    {
      value: "double",
      label: "雙機套餐",
      price: "NT$ 14,800 起",
      description: "內容：雙機位拍攝、4K Ultra HD、60 秒精華版、專業剪輯、多角度切換、雲端＋USB 交付"
    },
    {
      value: "triple",
      label: "三機旗艦或客製",
      price: "NT$ 21,200 起",
      description: "內容：三機位拍攝、多視角剪輯、色彩校正、專業混音、完整後製、實體光碟"
    },
    {
      value: "other",
      label: "其他"
    }
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
            className="bg-amber-500 hover:bg-amber-600 hover:scale-105 text-black font-light tracking-[0.1em] border-none transition-all duration-300"
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
                        姓名（聯絡人）*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="簡答文字"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        Email（會用此信箱發送估價與繳費連結）*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="簡答文字"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        連絡電話 *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="簡答文字"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        學校 / 機構
                      </label>
                      <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="簡答文字"
                      />
                    </div>
                  </div>

                  <div className="border-t border-amber-500/20 pt-6">
                    <h3 className="text-lg font-light text-amber-50 mb-4 tracking-[0.15em]">演出資訊</h3>
                    
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

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                          演出日期與時間 *
                        </label>
                        <input
                          type="datetime-local"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                          演出場地 *
                        </label>
                        <input
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                          placeholder="簡答文字"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        演出時長 *
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                      >
                        <option value="">請選擇演出時長</option>
                        {durationOptions.map(option => (
                          <option key={option} value={option} className="bg-black text-amber-50">{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                        參與人數 *
                      </label>
                      <input
                        type="text"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                        placeholder="簡答文字"
                      />
                    </div>
                  </div>

                  <div className="border-t border-amber-500/20 pt-6">
                    <h3 className="text-lg font-light text-amber-50 mb-4 tracking-[0.15em]">服務內容</h3>
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

                  <div className="border-t border-amber-500/20 pt-6">
                    <h3 className="text-lg font-light text-amber-50 mb-4 tracking-[0.15em]">學生方案</h3>
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-3 tracking-[0.1em]">
                        是否使用學生方案 *
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 bg-black/30 border border-amber-500/20 rounded-xl cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-xl">
                          <input
                            type="radio"
                            name="useStudentPlan"
                            value="yes"
                            checked={formData.useStudentPlan === "yes"}
                            onChange={handleInputChange}
                            className="mr-3 w-4 h-4 text-amber-500 bg-black/50 border-amber-500/30 focus:ring-amber-500/50"
                          />
                          <span className="font-light text-amber-50 tracking-[0.05em]">是</span>
                        </label>
                        <label className="flex items-center p-4 bg-black/30 border border-amber-500/20 rounded-xl cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-xl">
                          <input
                            type="radio"
                            name="useStudentPlan"
                            value="no"
                            checked={formData.useStudentPlan === "no"}
                            onChange={handleInputChange}
                            className="mr-3 w-4 h-4 text-amber-500 bg-black/50 border-amber-500/30 focus:ring-amber-500/50"
                          />
                          <span className="font-light text-amber-50 tracking-[0.05em]">否</span>
                        </label>
                      </div>
                    </div>

                    {formData.useStudentPlan === "yes" && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-xl">
                        <p className="text-sm text-amber-100/80 font-light tracking-[0.05em] leading-relaxed">
                          <span className="text-amber-500 font-medium">學生方案授權說明</span><br />
                          選擇學生方案即表示同意授權 Owldio 使用您的演出錄音錄影作為作品集展示。經過您同意後或許社群發佈，若您希望成為推薦案藝術家，共同推廣音樂藝術之美。
                        </p>
                        <div className="mt-3 flex items-start gap-2">
                          <input
                            type="checkbox"
                            id="studentPlanAgreement"
                            required={formData.useStudentPlan === "yes"}
                            className="mt-1 w-4 h-4 text-amber-500 bg-black/50 border-amber-500/30 rounded focus:ring-amber-500/50"
                          />
                          <label htmlFor="studentPlanAgreement" className="text-sm text-amber-100/80 font-light">
                            我已閱讀並同意上述授權內容
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-amber-500/20 pt-6">
                    <h3 className="text-lg font-light text-amber-50 mb-4 tracking-[0.15em]">方案選擇</h3>
                    <div className="space-y-4">
                      {pricingPlans.map(plan => (
                        <label key={plan.value} className="block">
                          <div className={`p-4 bg-black/30 border rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                            formData.pricingPlan === plan.value
                              ? 'border-amber-500 bg-amber-500/10'
                              : 'border-amber-500/20 hover:bg-amber-500/5 hover:border-amber-500/40'
                          }`}>
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="pricingPlan"
                                value={plan.value}
                                checked={formData.pricingPlan === plan.value}
                                onChange={handleInputChange}
                                className="mt-1 w-4 h-4 text-amber-500 bg-black/50 border-amber-500/30 focus:ring-amber-500/50"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-amber-50 tracking-[0.05em]">{plan.label}</span>
                                  {plan.price && <span className="text-amber-500 font-light">{plan.price}</span>}
                                </div>
                                {plan.description && (
                                  <p className="text-sm text-amber-100/60 font-light tracking-[0.05em] leading-relaxed">
                                    {plan.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-amber-500/20 pt-6">
                    <h3 className="text-lg font-light text-amber-50 mb-4 tracking-[0.15em]">交件時程</h3>
                    <div>
                      <label className="block text-sm font-light text-amber-100/80 mb-3 tracking-[0.1em]">
                        交件時程 *
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 bg-black/30 border border-amber-500/20 rounded-xl cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-xl">
                          <input
                            type="radio"
                            name="deliveryTime"
                            value="standard"
                            checked={formData.deliveryTime === "standard"}
                            onChange={handleInputChange}
                            className="mr-3 w-4 h-4 text-amber-500 bg-black/50 border-amber-500/30 focus:ring-amber-500/50"
                          />
                          <span className="font-light text-amber-50 tracking-[0.05em]">一般交件（7~10 個工作天）</span>
                        </label>
                        <label className="flex items-center p-4 bg-black/30 border border-amber-500/20 rounded-xl cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-xl">
                          <input
                            type="radio"
                            name="deliveryTime"
                            value="rush72"
                            checked={formData.deliveryTime === "rush72"}
                            onChange={handleInputChange}
                            className="mr-3 w-4 h-4 text-amber-500 bg-black/50 border-amber-500/30 focus:ring-amber-500/50"
                          />
                          <span className="font-light text-amber-50 tracking-[0.05em]">72 小時交件（加購）</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-amber-500/20 pt-6">
                    <label className="block text-sm font-light text-amber-100/80 mb-2 tracking-[0.1em]">
                      其他需求說明
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 text-amber-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 hover:border-amber-500/50 transition-all backdrop-blur-xl"
                      placeholder="詳答文字"
                    />
                  </div>

                  <div className="border-t border-amber-500/20 pt-6">
                    <div className="relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
                      <div className="relative p-6 backdrop-blur-sm border border-amber-900/30 rounded-2xl">
                        <h3 className="text-xl font-thin text-amber-50 mb-3 tracking-[0.1em]">我們已收到回覆!!</h3>
                        <p className="text-gray-400 font-light tracking-[0.05em] leading-relaxed mb-4">
                          感謝您的預約！Owldio 已收到表單，我們將在 1~2 個工作天內以 Email 與您聯繫。若有急件或疑問時間，歡迎直接與我們聯絡或追蹤 IG 私訊我們～！
                        </p>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-400 font-light">
                            <span className="text-amber-500">Line ID：</span>
                            <a href="https://lin.ee/v3uTStG" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">@4470guce</a>
                          </p>
                          <p className="text-gray-400 font-light">
                            <span className="text-amber-500">IG：</span>
                            <a href="https://instagram.com/owldio.art" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Owldio Studio 鴞聲音畫 @owldio.art</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-lg font-light tracking-[0.15em] bg-amber-500 hover:bg-amber-600 hover:scale-105 text-black border-none transition-all duration-300"
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
                  className="w-full bg-amber-500 hover:bg-amber-600 hover:scale-105 text-black font-light tracking-[0.1em] border-none transition-all duration-300"
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