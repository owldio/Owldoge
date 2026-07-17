import { studentAuthorizationSummary } from "@/lib/student-authorization";

export const formatTwd = (amount: number) => `NT$ ${amount.toLocaleString("en-US")}`;

export const baseDurationNote =
  "各錄製方案以每場 2 小時內為基準；超過方案時長後，每 30 分鐘加收延長錄製費。";

export const standardPlans = [
  {
    id: "single",
    contactValue: "single",
    no: "01",
    name: "單機方案",
    en: "SINGLE CAM",
    price: 7800,
    bestFor: "個人演出",
    features: [
      "單機 4K 錄影",
      "立體聲錄音",
      "2 小時內錄製",
      "基礎剪輯",
      "雲端 / YouTube 交付",
      "一次小幅修改",
    ],
    popular: false,
  },
  {
    id: "duo",
    contactValue: "double",
    no: "02",
    name: "雙機套餐",
    en: "DUAL CAM",
    price: 14800,
    bestFor: "小型室內樂",
    features: [
      "雙機位 4K 拍攝",
      "進階立體聲錄音",
      "2 小時內錄製",
      "專業剪輯與多角度切換",
      "雲端 / YouTube 交付",
      "一次小幅修改",
    ],
    popular: true,
  },
  {
    id: "pro",
    contactValue: "triple",
    no: "03",
    name: "三機旗艦",
    en: "PROFESSIONAL",
    price: 21200,
    bestFor: "大型演出",
    features: [
      "三機位 4K 拍攝",
      "多軌錄音與混音",
      "2 小時內錄製",
      "多視角剪輯",
      "進階色彩校正",
      "雲端 / YouTube 交付",
      "一次小幅修改",
    ],
    popular: false,
  },
] as const;

export const addOns = [
  { id: "overtime", name: "延長錄製", amount: 1200, unit: "/ 30 分鐘" },
  { id: "camera-upgrade", name: "多機位升級", amount: null, unit: "依需求報價" },
  { id: "rush", name: "72 小時快速交付", amount: 2000, unit: "起" },
  { id: "highlight", name: "精華剪輯", amount: 1800, unit: "" },
  { id: "multitrack", name: "多軌錄音升級", amount: 2500, unit: "起" },
  { id: "usb", name: "實體隨身碟", amount: 300, unit: "/ 個" },
  { id: "custom", name: "特殊需求", amount: null, unit: "可詳談" },
] as const;

const studentAddonIds = new Set<string>([
  "overtime",
  "camera-upgrade",
  "rush",
  "usb",
  "custom",
]);

export const studentCollaborationPlan = {
  id: "student-collaboration",
  contactValue: "student-collaboration",
  name: "學生作品授權合作方案",
  en: "STUDENT COLLABORATION",
  price: 3300,
  referencePlanId: "single",
  included: [
    "單機 4K 錄影",
    "立體聲錄音",
    "2 小時內錄製",
    "基礎剪輯後製",
    "雲端交付（30 天）",
    "一次小幅修改",
  ],
  addons: addOns.filter((addon) => studentAddonIds.has(addon.id)),
} as const;

export const studentAuthorizationNote =
  studentAuthorizationSummary;

export const serviceCatalog = [
  {
    id: "video",
    no: "01",
    title: "音樂會錄影",
    en: "CONCERT VIDEO",
    description: "4K 錄影，依方案選擇單機或多機位，完整捕捉舞台全景、演奏細節與現場氛圍。",
    features: ["4K Ultra HD 畫質", "單機方案起，可升級多機位", "專業剪輯", "如期交付"],
    price: standardPlans[0].price,
  },
  {
    id: "audio",
    no: "02",
    title: "專業錄音",
    en: "AUDIO RECORDING",
    description: "依編制與空間配置收音，立體聲方案起，可依需求升級多軌錄音。",
    features: ["24bit / 48kHz", "立體聲收音", "基礎混音", "多軌錄音可加購"],
    price: 3300,
  },
  {
    id: "live",
    no: "03",
    title: "現場直播",
    en: "LIVE STREAMING",
    description: "依機位、直播平台與場地網路條件配置，讓無法到場的觀眾也能即時參與。",
    features: ["單機位直播方案起", "直播平台與導播配置", "場地網路條件評估", "錄影存檔"],
    price: 18800,
  },
  {
    id: "post-production",
    no: "04",
    title: "客供素材後製",
    en: "POST PRODUCTION",
    description: "依客供素材量、成片長度與製作需求報價，完成適合上傳、投件與留存的成品。",
    features: ["影片剪輯", "音頻混音", "字幕製作", "特效合成"],
    price: 10800,
  },
] as const;
