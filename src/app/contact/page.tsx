"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import HeroBackdrop from "@/components/HeroBackdrop";
import DatePicker from "@/components/DatePicker";
import { RevealLine, HeroRule } from "@/components/HeroReveal";
import {
  addOns,
  formatTwd,
  standardPlans,
  studentAuthorizationNote,
  studentCollaborationPlan,
} from "@/lib/pricing";
import {
  getStudentConsentMode,
  STUDENT_AUTHORIZATION_EFFECTIVE_DATE,
  STUDENT_AUTHORIZATION_VERSION,
  studentAuthorizationScopeSummary,
  studentAuthorizationTerms,
  type StudentAgeStatus,
  type StudentPerformerScope,
} from "@/lib/student-authorization";
import {
  APPLICATION_NOTICE_TEXT,
  APPLICATION_NOTICE_VERSION,
  GENERAL_APPLICATION_ACKNOWLEDGMENT,
  STUDENT_APPLICATION_ACKNOWLEDGMENT,
} from "@/lib/application-notice";

const fieldClass =
  "w-full border border-hairline-strong bg-night-raised/40 px-4 py-3 text-base font-light text-parchment transition-colors duration-300 placeholder:italic placeholder:text-parchment-faint focus:border-copper focus:outline-none";

const labelClass = "mb-2 block font-mono text-[13px] tracking-[0.25em] text-parchment";

const optionClass =
  "flex cursor-pointer items-center gap-3 border border-hairline-strong bg-night-raised/40 px-4 py-3.5 text-base font-light text-parchment transition-colors duration-300 hover:border-copper/60 has-[:checked]:border-copper has-[:checked]:bg-copper/10";

const lineOfficialAccountUrl = "https://line.me/R/ti/p/@447nguoe";

const eventTypes = [
  "獨奏 / 個人演出",
  "室內樂（雙重奏 / 三重奏 / 四重奏...）",
  "合唱 / 重唱",
  "管弦 / 大型樂團",
  "戲劇 / 舞蹈",
  "其他",
];

const durationOptions = ["30分鐘", "60分鐘", "90分鐘", "120分鐘", "其他"];

const timeOptions = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00",
];

type ContactPricingPlan = {
  value: string;
  label: string;
  price?: string;
  description?: string;
};

const standardContactPlans: ContactPricingPlan[] = standardPlans.map((plan) => ({
  value: plan.contactValue,
  label: plan.name,
  price: `${formatTwd(plan.price)} 起`,
  description: `內容：${plan.features.join("、")}`,
}));

const flexibleContactPlans: ContactPricingPlan[] = [
  {
    value: "recommend",
    label: "請為我推薦最適合的方案",
    description: "根據您的演出類型、場地與需求，我們將為您推薦最合適的拍攝方案與報價",
  },
  {
    value: "other",
    label: "其他需求",
  },
];

const generalContactPlans = [...standardContactPlans, ...flexibleContactPlans];

const studentContactPlan: ContactPricingPlan = {
  value: studentCollaborationPlan.contactValue,
  label: studentCollaborationPlan.name,
  price: `${formatTwd(studentCollaborationPlan.price)} 起`,
  description: `內容：${studentCollaborationPlan.included.join("、")}；須符合學生身分與作品展示授權合作條件`,
};

const serviceOptions = [
  { id: "recording", label: "專業錄音" },
  { id: "video", label: "錄影服務" },
  { id: "live", label: "直播服務" },
  { id: "editing", label: "後製剪輯" },
];

const contactChannels = [
  { label: "EMAIL", value: "owldio.art@gmail.com", href: "mailto:owldio.art@gmail.com" },
  { label: "LINE", value: "@447nguoe", href: lineOfficialAccountUrl, external: true },
  {
    label: "FACEBOOK",
    value: "@owldio.art",
    href: "https://www.facebook.com/owldio.art",
    external: true,
  },
  {
    label: "INSTAGRAM",
    value: "@owldio.art",
    href: "https://instagram.com/owldio.art",
    external: true,
  },
];

const promises = ["24 小時內回覆報價", "免費檔期查詢", "學生合作方案", "專業品質保證"];

const emptyStudentAuthorization = {
  studentAgeStatus: "" as StudentAgeStatus,
  studentPerformerScope: "" as StudentPerformerScope,
  studentGuardianName: "",
  studentGuardianEmail: "",
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    instrument: "",
    venue: "",
    duration: "",
    participants: "",
    services: [] as string[],
    useStudentPlan: "",
    ...emptyStudentAuthorization,
    applicationNoticeAccepted: false,
    pricingPlan: "",
    selectedAddOns: [] as string[],
    deliveryTime: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const studentAuthorizationDialogRef = useRef<HTMLDialogElement>(null);

  const availableAddOns =
    formData.useStudentPlan === "yes" ? studentCollaborationPlan.addons : addOns;
  const selectableAddOns = availableAddOns.filter((addon) => addon.id !== "rush");

  const studentConsentMode = getStudentConsentMode(
    formData.studentAgeStatus,
    formData.studentPerformerScope,
  );
  const studentFutureContractingParty =
    formData.studentAgeStatus === "minor" ? formData.studentGuardianName : formData.name;

  const openStudentAuthorizationDialog = () => {
    studentAuthorizationDialogRef.current?.showModal();
  };

  const closeStudentAuthorizationDialog = () => {
    studentAuthorizationDialogRef.current?.close();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleStudentPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      useStudentPlan: value,
      pricingPlan: value === "yes" ? studentCollaborationPlan.contactValue : "",
      selectedAddOns: [],
      applicationNoticeAccepted: false,
      ...(value === "no" ? emptyStudentAuthorization : {}),
    }));
  };

  const handleAddOnChange = (addOnId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(addOnId)
        ? prev.selectedAddOns.filter((id) => id !== addOnId)
        : [...prev.selectedAddOns, addOnId],
    }));
  };

  const handleStudentAuthorizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "studentAgeStatus" && value === "adult"
        ? { studentGuardianName: "", studentGuardianEmail: "" }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // 將服務選項轉換為中文標籤
      const serviceLabels = formData.services.map((serviceId) => {
        const service = serviceOptions.find((s) => s.id === serviceId);
        return service ? service.label : serviceId;
      });
      const selectedAddOnLabels = formData.selectedAddOns.map((addOnId) => {
        const addOn = addOns.find((option) => option.id === addOnId);
        return addOn ? addOn.name : addOnId;
      });
      const rushAddOn = addOns.find((addOn) => addOn.id === "rush");

      // 準備要發送到 Google Sheets 的數據
      const submitData = {
        requestType: "booking",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        school: formData.school,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        instrument: formData.instrument,
        eventDateTime:
          formData.eventDate && formData.eventTime
            ? (() => {
                const d = new Date(formData.eventDate + "T00:00:00");
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
                const weekday = weekdays[d.getDay()];
                return `${yyyy}年${mm}月${dd}日（週${weekday}）${formData.eventTime}`;
              })()
            : "",
        venue: formData.venue,
        duration: formData.duration,
        participants: formData.participants,
        services: serviceLabels,
        useStudentPlan:
          formData.useStudentPlan === "yes" ? "是" : formData.useStudentPlan === "no" ? "否" : "",
        studentPlanRequested: formData.useStudentPlan === "yes",
        applicationNoticeAccepted: formData.applicationNoticeAccepted,
        applicationNoticeVersion: APPLICATION_NOTICE_VERSION,
        studentApplicationNoticeAcknowledged:
          formData.useStudentPlan === "yes" && formData.applicationNoticeAccepted,
        studentAuthorizationCompleted: false,
        studentAuthorizationVersion:
          formData.useStudentPlan === "yes" ? STUDENT_AUTHORIZATION_VERSION : "",
        studentAuthorizationEffectiveDate:
          formData.useStudentPlan === "yes" ? STUDENT_AUTHORIZATION_EFFECTIVE_DATE : "",
        studentApplicationNoticeClientAcknowledgedAt:
          formData.useStudentPlan === "yes" && formData.applicationNoticeAccepted
            ? new Date().toISOString()
            : "",
        studentApplicantName: formData.useStudentPlan === "yes" ? formData.name : "",
        studentFutureContractingParty:
          formData.useStudentPlan === "yes" ? studentFutureContractingParty : "",
        studentAgeStatus: formData.studentAgeStatus,
        studentAgeStatusLabel:
          formData.studentAgeStatus === "adult"
            ? "已滿 18 歲"
            : formData.studentAgeStatus === "minor"
              ? "未滿 18 歲"
              : "",
        studentPerformerScope: formData.studentPerformerScope,
        studentPerformerScopeLabel:
          formData.studentPerformerScope === "solo"
            ? "單人演出"
            : formData.studentPerformerScope === "group"
              ? "多人演出"
              : "",
        studentConsentMode,
        studentConsentStatus:
          studentConsentMode === "online-checkbox"
            ? "成年單人：待後續書面報價與授權確認"
            : studentConsentMode === "enhanced-signature-required"
              ? "待後續個別同意或正式電子簽署"
              : "",
        studentGuardianName: formData.studentGuardianName,
        studentGuardianEmail: formData.studentGuardianEmail,
        studentAuthorizationScope:
          formData.useStudentPlan === "yes" ? studentAuthorizationScopeSummary : "",
        pricingPlan:
          formData.useStudentPlan === "yes"
            ? studentContactPlan.label
            : generalContactPlans.find((plan) => plan.value === formData.pricingPlan)?.label ||
              formData.pricingPlan,
        addOns: [
          ...selectedAddOnLabels,
          ...(formData.deliveryTime === "rush72" && rushAddOn ? [rushAddOn.name] : []),
        ],
        deliveryTime:
          formData.deliveryTime === "standard"
            ? "一般交件（7~10 個工作天）"
            : formData.deliveryTime === "rush72"
              ? "72 小時交件（加購）"
              : "",
        additionalInfo: formData.additionalInfo,
      };

      // 透過同源 API route 提交到 Google Apps Script（伺服器端持有 URL，避免 NEXT_PUBLIC_ 洩漏）
      const response = await fetch("/api/submit-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`提交失敗 (${response.status})，請稍後再試或透過 email 聯絡我們`);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      setIsSubmitting(false);
      const message = error instanceof Error ? error.message : "發生未知錯誤，請稍後再試";
      setSubmitError(message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night px-5 py-16 text-parchment">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg text-center"
        >
          <p className="mb-6 font-mono text-[12px] tracking-[0.4em] text-copper-bright">
            REQUEST RECEIVED — 申請已送出
          </p>
          <h1 className="mb-5 font-display text-4xl font-light italic text-copper-bright">
            預約／報價申請已送出
          </h1>
          <p className="mb-10 text-sm font-light leading-loose text-parchment-dim">
            感謝您的申請，我們將在 24 小時內與您聯繫，提供詳細報價與檔期確認。
          </p>

          <div className="mb-10 border-y border-hairline py-10">
            <a
              href={lineOfficialAccountUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="加入 Owldio LINE 官方帳號"
              className="mx-auto mb-6 block w-44 overflow-hidden border border-hairline bg-white p-3 transition-transform duration-300 hover:scale-105"
            >
              <Image
                src="/pic/LINEQR.jpg"
                alt="Owldio LINE 官方帳號 QR Code"
                width={320}
                height={320}
                className="h-auto w-full"
                priority
              />
            </a>
            <p className="mx-auto mb-6 max-w-sm text-sm font-light leading-loose text-parchment-dim">
              表單送出後，請加入 Owldio LINE 官方帳號，讓我們能更即時地與您確認檔期、需求細節與後續安排。
            </p>
            <a
              href={lineOfficialAccountUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-copper px-8 py-3.5 text-sm tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright"
            >
              加入 LINE 官方帳號
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center border border-hairline-strong px-8 py-3.5 text-sm tracking-[0.14em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
          >
            返回首頁
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-parchment">
      <Navigation currentPage="contact" />

      <main>
        {/* ============ Hero ============ */}
        <section className="grain relative overflow-hidden border-b border-hairline">
          <HeroBackdrop src="/pic/IMG_8903.JPG" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-40 md:px-8 lg:pb-20 lg:pt-48">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-7 font-mono text-[12px] tracking-[0.4em] text-copper-bright"
            >
              CONTACT — 聯絡我們
            </motion.p>
            <HeroRule />
            <h1 className="mb-8 font-serif font-extralight leading-[1.1] text-parchment">
              <RevealLine delay={0.2} className="text-[clamp(2.6rem,7vw,6rem)] text-copper-bright">
                聯絡我們
              </RevealLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-xl text-base font-light leading-loose tracking-[0.04em] text-parchment-dim md:text-lg"
            >
              填寫表單告訴我們您的需求，我們將在 24 小時內回覆詳細報價與檔期安排。
            </motion.p>
          </div>
        </section>

        {/* ============ Form + sidebar ============ */}
        <section className="border-t border-hairline">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-3 lg:py-28">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="border border-hairline bg-night-raised/30 p-7 md:p-10">
                <h2 className="mb-8 font-mono text-[12px] tracking-[0.35em] text-copper-bright">
                  預約表單 — BOOKING FORM
                </h2>

                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Contact basics */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>姓名（填表者／聯絡人）*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={fieldClass}
                        placeholder="您的姓名"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>EMAIL（用於寄送估價與繳費連結）*</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={fieldClass}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>聯絡電話 *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={fieldClass}
                        placeholder="0900 000 000"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>學校 / 機構</label>
                      <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        className={fieldClass}
                        placeholder="選填"
                      />
                    </div>
                  </div>

                  {/* Event info */}
                  <fieldset className="space-y-6 border-t border-hairline pt-9">
                    <legend className="mb-2 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                      演出資訊 · EVENT
                    </legend>

                    <div>
                      <label className={labelClass}>演出類型 *</label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        required
                        className={fieldClass}
                      >
                        <option value="">請選擇演出類型</option>
                        {eventTypes.map((type) => (
                          <option key={type} value={type} className="bg-night text-parchment">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>樂器 / 編制</label>
                      <input
                        type="text"
                        name="instrument"
                        value={formData.instrument}
                        onChange={handleInputChange}
                        className={fieldClass}
                        placeholder="例：鋼琴、小提琴、聲樂、弦樂四重奏"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <div>
                        <label className={labelClass}>演出日期 *</label>
                        <DatePicker
                          name="eventDate"
                          value={formData.eventDate}
                          required
                          onChange={(iso) =>
                            setFormData((prev) => ({ ...prev, eventDate: iso }))
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>演出時間 *</label>
                        <select
                          name="eventTime"
                          value={formData.eventTime}
                          onChange={handleInputChange}
                          required
                          className={fieldClass}
                        >
                          <option value="">請選擇時間</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time} className="bg-night text-parchment">
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>演出場地 *</label>
                        <input
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={handleInputChange}
                          required
                          className={fieldClass}
                          placeholder="場地名稱"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>演出時長 *</label>
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          required
                          className={fieldClass}
                        >
                          <option value="">請選擇演出時長</option>
                          {durationOptions.map((option) => (
                            <option key={option} value={option} className="bg-night text-parchment">
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>參與人數 *</label>
                        <input
                          type="text"
                          name="participants"
                          value={formData.participants}
                          onChange={handleInputChange}
                          required
                          className={fieldClass}
                          placeholder="例：1 人、四重奏 4 人"
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Services */}
                  <fieldset className="border-t border-hairline pt-9">
                    <legend className="mb-5 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                      服務內容 · SERVICES
                    </legend>
                    <div className="grid gap-3 md:grid-cols-2">
                      {serviceOptions.map((service) => (
                        <label key={service.id} className={optionClass}>
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service.id)}
                            onChange={() => handleServiceChange(service.id)}
                            className="h-4 w-4 accent-copper"
                          />
                          {service.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Student plan */}
                  <fieldset className="border-t border-hairline pt-9">
                    <legend className="mb-5 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                      學生合作方案 · STUDENT COLLABORATION
                    </legend>
                    <label className={labelClass}>是否申請學生合作方案 *</label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        { value: "yes", label: "是" },
                        { value: "no", label: "否" },
                      ].map((opt) => (
                        <label key={opt.value} className={optionClass}>
                          <input
                            type="radio"
                            name="useStudentPlan"
                            value={opt.value}
                            checked={formData.useStudentPlan === opt.value}
                            onChange={handleStudentPlanChange}
                            required
                            className="h-4 w-4 accent-copper"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>

                    {formData.useStudentPlan === "yes" && (
                      <div className="mt-4 space-y-6 border border-copper/40 bg-copper/5 p-5 md:p-6">
                        <p className="text-xs font-light leading-loose text-parchment-dim">
                          <span className="text-copper">學生作品授權合作方案</span>
                          <br />
                          {studentAuthorizationNote}
                        </p>

                        <div className="border border-copper/40 bg-copper/10 p-4">
                          <p className="font-mono text-[10px] tracking-[0.2em] text-copper-bright">
                            已套用主方案 · SELECTED PLAN
                          </p>
                          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-sm font-light text-parchment">
                              {studentContactPlan.label}
                            </p>
                            <p className="font-mono text-[11px] text-copper">
                              {studentContactPlan.price}
                            </p>
                          </div>
                          <p className="mt-2 text-xs font-light leading-relaxed text-parchment-dim">
                            學生方案已固定為單機規格，不需再選單機、雙機或三機方案；若需多機位或其他服務，請於下方選擇加購。
                          </p>
                        </div>

                        <div className="border border-hairline bg-night-raised/40 p-4">
                          <p className="font-mono text-[10px] tracking-[0.2em] text-parchment-faint">
                            表單填寫者 · APPLICANT
                          </p>
                          <p className="mt-2 text-sm font-light leading-relaxed text-parchment">
                            {formData.name || "請先在表單上方填寫真實姓名"}
                          </p>
                          <p className="mt-2 text-xs font-light leading-relaxed text-parchment-faint">
                            此姓名僅作為本次申請人與主要聯絡人；實際簽約人及授權方式將於後續書面報價與契約中確認。
                          </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <p className={labelClass}>表演者年齡 *</p>
                            <div className="space-y-3">
                              {[
                                { value: "adult", label: "已滿 18 歲" },
                                { value: "minor", label: "未滿 18 歲" },
                              ].map((option) => (
                                <label key={option.value} className={optionClass}>
                                  <input
                                    type="radio"
                                    name="studentAgeStatus"
                                    value={option.value}
                                    checked={formData.studentAgeStatus === option.value}
                                    onChange={handleStudentAuthorizationChange}
                                    required
                                    className="h-4 w-4 accent-copper"
                                  />
                                  {option.label}
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className={labelClass}>可辨識的表演者 *</p>
                            <div className="space-y-3">
                              {[
                                { value: "solo", label: "只有本人 1 人" },
                                { value: "group", label: "共有 2 人以上" },
                              ].map((option) => (
                                <label key={option.value} className={optionClass}>
                                  <input
                                    type="radio"
                                    name="studentPerformerScope"
                                    value={option.value}
                                    checked={formData.studentPerformerScope === option.value}
                                    onChange={handleStudentAuthorizationChange}
                                    required
                                    className="h-4 w-4 accent-copper"
                                  />
                                  {option.label}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {formData.studentAgeStatus === "minor" && (
                          <div className="grid gap-5 border-t border-hairline pt-5 md:grid-cols-2">
                            <div>
                              <label className={labelClass}>法定代理人姓名 *</label>
                              <input
                                type="text"
                                name="studentGuardianName"
                                value={formData.studentGuardianName}
                                onChange={handleStudentAuthorizationChange}
                                required
                                className={fieldClass}
                                placeholder="請由法定代理人填寫"
                              />
                            </div>
                            <div>
                              <label className={labelClass}>法定代理人 Email *</label>
                              <input
                                type="email"
                                name="studentGuardianEmail"
                                value={formData.studentGuardianEmail}
                                onChange={handleStudentAuthorizationChange}
                                required
                                className={fieldClass}
                                placeholder="guardian@example.com"
                              />
                            </div>
                          </div>
                        )}

                        <div
                          id="student-authorization-decision"
                          role="status"
                          className={`border p-4 ${
                            studentConsentMode === "online-checkbox"
                              ? "border-emerald-500/40 bg-emerald-500/10"
                              : studentConsentMode === "enhanced-signature-required"
                                ? "border-amber-400/40 bg-amber-400/10"
                                : "border-hairline bg-night-raised/40"
                          }`}
                        >
                          <p className="font-mono text-[10px] tracking-[0.2em] text-copper-bright">
                            後續確認方式 · NEXT STEP
                          </p>
                          <p className="mt-2 text-sm font-light leading-relaxed text-parchment">
                            {studentConsentMode === "online-checkbox"
                              ? `成年單人演出：後續可由 ${formData.name || "表單填寫者"} 以本人真實姓名，確認完整書面報價與授權內容。`
                              : studentConsentMode === "enhanced-signature-required"
                                ? formData.studentAgeStatus === "minor"
                                  ? `未成年人：後續須由法定代理人 ${formData.studentGuardianName || "（請填寫姓名）"} 完成正式電子簽署${formData.studentPerformerScope === "group" ? "，其他表演者亦須個別同意" : ""}。`
                                  : `多人演出：${formData.name || "表單填寫者"} 僅為申請人及主要聯絡人；後續每位可辨識表演者仍須個別同意或完成正式電子簽署。`
                                : "請先選擇表演者年齡與人數，系統才會顯示後續適用的確認方式。"}
                          </p>
                          <p className="mt-2 text-xs font-light leading-relaxed text-parchment-faint">
                            付費廣告或標準授權範圍外的長期商業使用，後續仍須另行取得正式電子簽署。
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={openStudentAuthorizationDialog}
                          aria-haspopup="dialog"
                          aria-controls="student-authorization-dialog"
                          className="flex w-full items-center justify-between gap-4 border border-hairline bg-night-raised/40 px-4 py-3 text-left font-mono text-[11px] tracking-[0.16em] text-copper transition-colors hover:border-copper/60 hover:bg-copper/10"
                        >
                          <span>
                            查看學生作品展示授權說明 v{STUDENT_AUTHORIZATION_VERSION}
                          </span>
                          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                        </button>

                        <dialog
                          ref={studentAuthorizationDialogRef}
                          id="student-authorization-dialog"
                          aria-labelledby="student-authorization-dialog-title"
                          aria-describedby="student-authorization-dialog-summary"
                          onCancel={(event) => {
                            event.preventDefault();
                            closeStudentAuthorizationDialog();
                          }}
                          onClick={(event) => {
                            if (event.target === event.currentTarget) {
                              closeStudentAuthorizationDialog();
                            }
                          }}
                          className="fixed inset-0 z-[70] m-auto max-h-[88vh] w-[calc(100%-2rem)] max-w-3xl overflow-hidden border border-copper/40 bg-night-raised p-0 text-parchment shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-sm"
                        >
                          <div className="max-h-[88vh] overflow-y-auto">
                            <header className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-hairline bg-night-raised/95 px-5 py-5 backdrop-blur md:px-7">
                              <div>
                                <p className="font-mono text-[10px] tracking-[0.25em] text-copper">
                                  AUTHORIZATION NOTICE · v{STUDENT_AUTHORIZATION_VERSION}
                                </p>
                                <h2
                                  id="student-authorization-dialog-title"
                                  className="mt-2 text-xl font-extralight tracking-[0.06em] text-parchment md:text-2xl"
                                >
                                  學生作品展示授權說明
                                </h2>
                              </div>
                              <button
                                type="button"
                                onClick={closeStudentAuthorizationDialog}
                                aria-label="關閉授權說明"
                                className="shrink-0 border border-hairline p-2 text-parchment-dim transition-colors hover:border-copper hover:text-copper"
                              >
                                <X className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </header>

                            <div className="space-y-6 px-5 py-6 md:px-7 md:py-8">
                              <p
                                id="student-authorization-dialog-summary"
                                className="border border-copper/30 bg-copper/5 p-4 text-xs font-light leading-loose text-parchment-dim"
                              >
                                說明更新日：{STUDENT_AUTHORIZATION_EFFECTIVE_DATE}
                                <br />
                                預計授權範圍：{studentAuthorizationScopeSummary}
                              </p>

                              {studentAuthorizationTerms.map((section) => (
                                <section key={section.title}>
                                  <h3 className="text-sm font-light tracking-[0.04em] text-parchment">
                                    {section.title}
                                  </h3>
                                  <div className="mt-2 space-y-2">
                                    {section.paragraphs.map((paragraph) => (
                                      <p
                                        key={paragraph}
                                        className="text-xs font-light leading-loose text-parchment-dim"
                                      >
                                        {paragraph}
                                      </p>
                                    ))}
                                  </div>
                                </section>
                              ))}

                              <button
                                type="button"
                                onClick={closeStudentAuthorizationDialog}
                                className="w-full border border-copper/50 px-5 py-3 text-sm font-light tracking-[0.12em] text-copper transition-colors hover:bg-copper hover:text-night"
                              >
                                閱讀完畢，關閉說明
                              </button>
                            </div>
                          </div>
                        </dialog>

                      </div>
                    )}
                  </fieldset>

                  {/* Pricing plan — the student collaboration plan is fixed above */}
                  {formData.useStudentPlan === "no" && (
                    <fieldset className="border-t border-hairline pt-9">
                      <legend className="mb-5 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                        一般方案選擇 · PLAN
                      </legend>
                      <div className="space-y-3">
                        {generalContactPlans.map((plan) => (
                          <label
                            key={plan.value}
                            className="block cursor-pointer border border-hairline bg-night-raised/40 p-4 transition-colors duration-300 hover:border-hairline-strong has-[:checked]:border-copper has-[:checked]:bg-copper/10"
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="pricingPlan"
                                value={plan.value}
                                checked={formData.pricingPlan === plan.value}
                                onChange={handleInputChange}
                                required
                                className="mt-1 h-4 w-4 accent-copper"
                              />
                              <div className="flex-1">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <span className="text-sm font-light tracking-[0.04em] text-parchment">
                                    {plan.label}
                                  </span>
                                  {plan.price && (
                                    <span className="font-mono text-[11px] text-copper">
                                      {plan.price}
                                    </span>
                                  )}
                                </div>
                                {plan.description && (
                                  <p className="mt-1.5 text-xs font-light leading-relaxed text-parchment-faint">
                                    {plan.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {/* Add-ons */}
                  {formData.useStudentPlan !== "" && (
                    <fieldset className="border-t border-hairline pt-9">
                      <legend className="mb-5 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                        {formData.useStudentPlan === "yes" ? "學生方案加購" : "加值服務"} · ADD-ONS
                      </legend>
                      <p className="mb-4 text-xs font-light leading-relaxed text-parchment-faint">
                        可複選，未勾選則依主方案內容製作。72 小時快速交付請於下一欄的交件時程選擇。
                      </p>
                      <div className="grid gap-3 md:grid-cols-2">
                        {selectableAddOns.map((addOn) => (
                          <label key={addOn.id} className={optionClass}>
                            <input
                              type="checkbox"
                              name="selectedAddOns"
                              value={addOn.id}
                              checked={formData.selectedAddOns.includes(addOn.id)}
                              onChange={() => handleAddOnChange(addOn.id)}
                              className="h-4 w-4 shrink-0 accent-copper"
                            />
                            <span className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                              <span>{addOn.name}</span>
                              <span className="font-mono text-[10px] text-copper">
                                {addOn.amount === null
                                  ? addOn.unit
                                  : `+${formatTwd(addOn.amount)}${addOn.unit ? ` ${addOn.unit}` : ""}`}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {/* Delivery time */}
                  <fieldset className="border-t border-hairline pt-9">
                    <legend className="mb-5 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                      交件時程 · DELIVERY
                    </legend>
                    <label className={labelClass}>交件時程 *</label>
                    <div className="space-y-3">
                      {[
                        { value: "standard", label: "一般交件（7~10 個工作天）" },
                        { value: "rush72", label: "72 小時交件（加購）" },
                      ].map((opt) => (
                        <label key={opt.value} className={optionClass}>
                          <input
                            type="radio"
                            name="deliveryTime"
                            value={opt.value}
                            checked={formData.deliveryTime === opt.value}
                            onChange={handleInputChange}
                            required
                            className="h-4 w-4 accent-copper"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Additional info */}
                  <div className="border-t border-hairline pt-9">
                    <label className={labelClass}>其他需求說明</label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className={fieldClass}
                      placeholder="任何想讓我們知道的細節"
                    />
                  </div>

                  <div className="space-y-3 border-t border-hairline pt-6">
                    <p
                      id="application-notice"
                      className="text-[11px] font-light leading-relaxed text-parchment-faint"
                    >
                      {APPLICATION_NOTICE_TEXT}
                    </p>
                    <label className="flex items-start gap-3 text-xs font-light leading-relaxed text-parchment-dim">
                      <input
                        type="checkbox"
                        name="applicationNoticeAccepted"
                        checked={formData.applicationNoticeAccepted}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            applicationNoticeAccepted: event.target.checked,
                          }))
                        }
                        required
                        aria-describedby="application-notice"
                        className="mt-0.5 h-4 w-4 shrink-0 accent-copper"
                      />
                      <span>
                        {formData.useStudentPlan === "yes"
                          ? STUDENT_APPLICATION_ACKNOWLEDGMENT
                          : GENERAL_APPLICATION_ACKNOWLEDGMENT}
                      </span>
                    </label>
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="border border-red-500/40 bg-red-500/10 p-4 text-sm font-light text-red-200"
                    >
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex w-full items-center justify-center gap-3 bg-copper px-9 py-4 text-base tracking-[0.14em] text-night transition-colors duration-300 hover:bg-copper-bright disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-night border-t-transparent" />
                        送出中…
                      </>
                    ) : (
                      <>
                        送出預約／報價申請
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="space-y-6"
            >
              <div className="border border-hairline bg-night-raised/30 p-7 md:p-8">
                <h3 className="mb-6 font-mono text-[12px] tracking-[0.35em] text-copper-bright">
                  聯絡資訊 — CONTACT
                </h3>
                <div className="divide-y divide-hairline">
                  {contactChannels.map((channel) => (
                    <a
                      key={channel.label}
                      href={channel.href}
                      {...(channel.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex items-baseline justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <span className="font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                        {channel.label}
                      </span>
                      <span className="text-sm font-light text-parchment transition-colors duration-300 group-hover:text-copper-bright">
                        {channel.value}
                      </span>
                    </a>
                  ))}
                  <div className="flex items-baseline justify-between gap-4 py-4 last:pb-0">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                      回覆時間
                    </span>
                    <span className="text-sm font-light text-parchment-dim">24 小時內</span>
                  </div>
                </div>
              </div>

              <div className="border border-hairline bg-night-raised/30 p-7 md:p-8">
                <h3 className="mb-6 font-mono text-[12px] tracking-[0.35em] text-copper-bright">
                  服務承諾 — PROMISE
                </h3>
                <ul className="space-y-3.5">
                  {promises.map((promise) => (
                    <li
                      key={promise}
                      className="flex items-baseline gap-3 text-sm font-light text-parchment"
                    >
                      <span className="font-mono text-[10px] text-copper">+</span>
                      {promise}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-hairline bg-night-raised/30 p-7 md:p-8">
                <h3 className="mb-3 font-mono text-[12px] tracking-[0.35em] text-copper-bright">
                  急件諮詢 — URGENT
                </h3>
                <p className="mb-6 text-sm font-light leading-loose text-parchment-dim">
                  如有急件需求或特殊情況，歡迎直接來信與我們聯絡。
                </p>
                <a
                  href="mailto:owldio.art@gmail.com"
                  className="group inline-flex w-full items-center justify-center gap-3 border border-hairline-strong px-7 py-3.5 text-sm tracking-[0.14em] text-parchment transition-colors duration-300 hover:border-copper hover:text-copper-bright"
                >
                  立即來信
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </motion.aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default ContactPage;
