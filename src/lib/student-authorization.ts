export const STUDENT_AUTHORIZATION_VERSION = "1.1";
export const STUDENT_AUTHORIZATION_EFFECTIVE_DATE = "2026-07-17";
export const STUDENT_AUTHORIZATION_TERM_YEARS = 10;
export const STUDENT_AUTHORIZATION_TERM_LABEL = `十年（${STUDENT_AUTHORIZATION_TERM_YEARS} 年）`;

export type StudentAgeStatus = "" | "adult" | "minor";
export type StudentPerformerScope = "" | "solo" | "group";
export type StudentConsentMode =
  | "incomplete"
  | "online-checkbox"
  | "enhanced-signature-required";

export const studentAuthorizationSummary =
  "NT$ 3,300 為作品展示授權合作價。成年且為單人演出者，可由表單填寫者以真實姓名作為授權人及簽約人，閱讀契約後勾選同意；多人演出或未成年人須另補個別同意或法定代理人正式電子簽署。本授權僅限 Owldio 自有作品集與官方社群，不含付費廣告或契約範圍外的長期商業使用。";

export const studentAuthorizationScopeSummary =
  `Owldio 自有網站、官方作品集與官方社群之非付費成果展示，自成品交付日起${STUDENT_AUTHORIZATION_TERM_LABEL}；不含付費廣告、轉授權、商品化、AI 訓練或其他契約範圍外的長期商業使用。`;

export const studentAuthorizationTerms = [
  {
    title: "一、契約當事人與簽約人",
    paragraphs: [
      "本條款由鴞賦創造工作室（Owldio）與授權人共同成立。成年單人演出時，預約表單「姓名」欄位所填寫之真實姓名，即為本授權的授權人及簽約人。",
      "多人演出時，填表者僅就本人有權授權的部分作成同意，並作為主要聯絡人；其他可辨識表演者仍須個別同意。未成年人則須由法定代理人作為簽約人並完成正式電子簽署。",
    ],
  },
  {
    title: "二、授權標的",
    paragraphs: [
      "授權標的包括本次服務所製作的成品、合理長度之片段與截圖，以及其中可辨識的授權人姓名（如有提供）、肖像、聲音及表演內容。",
    ],
  },
  {
    title: "三、允許的使用方式",
    paragraphs: [
      "授權為非專屬授權。Owldio 僅得為作品集展示及介紹服務成果之目的，於 Owldio 官方網站、官方 Instagram、Facebook、YouTube，以及 Owldio 自有電子作品集或服務提案中使用。",
      "Owldio 得依版面與平台需要進行片段剪輯、尺寸調整、字幕、色彩及音量處理，但不得以歪曲、貶損或足以影響表演者名譽的方式使用。",
    ],
  },
  {
    title: "四、不包含的使用",
    paragraphs: [
      "本次勾選不包含付費廣告投放、出售、轉授權、提供第三方商業使用、商品化、人工智慧模型訓練，或超過本條款期間的長期商業使用。Owldio 如有上述需求，須另行取得相關表演者的個別同意或正式電子簽署。",
    ],
  },
  {
    title: "五、授權期間與地域",
    paragraphs: [
      `授權期間自成品交付日起${STUDENT_AUTHORIZATION_TERM_LABEL}。因網路平台可跨境瀏覽，授權地域為全球網路範圍。期間屆滿後，Owldio 不再新增使用。`,
      "授權人如因安全、身分、升學或職涯等合理原因要求下架，Owldio 將於收到通知後三十日內，移除其可控制管道內的內容。",
    ],
  },
  {
    title: "六、合作價格與撤回",
    paragraphs: [
      "NT$ 3,300 為本授權合作的專案價格。授權人如於成品交付前撤回或拒絕完成必要授權，方案將改按一般單機方案價格計算；成品交付後依前條提出合理下架要求者，不追補方案差價。",
    ],
  },
  {
    title: "七、權利保留與第三方內容",
    paragraphs: [
      "本條款不構成著作權讓與。授權人及其他權利人仍保有原有權利，Owldio 僅取得本條款列明範圍內的使用權。",
      "本授權不會自動取得歌曲、詞曲、伴奏或其他第三方著作的權利。若曲目不是原創、公共領域或已取得必要授權，Owldio 得決定不予公開。",
    ],
  },
  {
    title: "八、同意紀錄",
    paragraphs: [
      `為保存本次同意紀錄，系統將保存填表姓名、聯絡資料、資格選項、條款版本 ${STUDENT_AUTHORIZATION_VERSION}、提交時間，以及提交請求的網路位址與瀏覽器資訊，僅用於預約處理、授權確認與爭議處理。`,
    ],
  },
] as const;

export function getStudentConsentMode(
  ageStatus: StudentAgeStatus,
  performerScope: StudentPerformerScope,
): StudentConsentMode {
  if (!ageStatus || !performerScope) {
    return "incomplete";
  }

  if (ageStatus === "adult" && performerScope === "solo") {
    return "online-checkbox";
  }

  return "enhanced-signature-required";
}
