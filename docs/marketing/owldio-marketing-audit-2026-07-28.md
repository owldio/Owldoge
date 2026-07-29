# Owldio 行銷、定價與 SEO 審查

**日期：** 2026-07-28
**範圍：** `www.owldio.art`、目前 repository、公開競品頁面
**結論狀態：** 可開始低成本推廣，但不建議先擴大量；應先修作品證據、轉換路徑與手機速度。

## 一頁結論

Owldio 的價格不是目前最大問題。公開方案清楚、學生合作邏輯已正確表達，且相較三個可公開比價的台灣音樂會錄製服務，單機與雙機方案位於市場低位。真正限制成交的是：

1. 作品頁尚無可播放案例，低價因此可能被解讀成低信任。
2. 三個「選擇此方案」按鈕都只到 `/contact`，不會帶入已選方案。
3. 手機詢價表單有 21 個控制項、14 個必填，第一次詢問成本偏高。
4. 首頁 Lighthouse 手機單次 lab run 為 Performance 57；LCP 6.9s、TBT 590ms。
5. 搜尋基礎良好，但只有七個主要 URL，缺少可承接「畢業音樂會錄影」「音樂會錄影價格」「多機位差異」等需求的內容與案例頁。

因此建議維持目前公開價格至少 60 天，先建立作品／案例、來源追蹤與報價轉換資料，再決定是否調價。

## 證據基線

### 已通過

- 七個主要路由與 robots、sitemap 均回應 200。
- 定價頁有唯一 title、description、canonical、Open Graph 與可見價格。
- `ProfessionalService`、`WebSite` 與 `OfferCatalog` JSON-LD 已存在。
- robots 的 `User-agent: *` 允許一般搜尋與 AI crawler 存取。
- 所有主要圖片皆有 alt；桌面與 375px 手機版未見水平溢出。
- Lighthouse 單次 lab run：Accessibility 96、Best Practices 100、SEO 100。
- repository 的 10 個定價／授權／SEO static tests 全部通過；ESLint 0 errors、21 warnings（皆在獨立 `player` 區域）。
- 公開搜尋結果可找到 Owldio 定價頁並正確擷取 NT$3,300／7,800／14,800／21,200 與方案內容。

### 證據邊界

- Lighthouse 是一次受控 lab run，不是 CrUX／Search Console 真實用戶 75 分位。
- 公開搜尋結果看到定價頁，不等於 Search Console 已證明其他頁未收錄。
- 公開競品價格不是完全同規格比較；攝影師人數、機位、收音、工時、地區與交件不同。
- 未取得 GA4、Search Console、詢價、報價、成交、毛利或回購資料，因此不能宣稱現行價格已最佳化。

## 定價審查

### 目前架構

| 方案 | 起價 | 角色 | 判斷 |
|---|---:|---|---|
| 單機 | NT$7,800 | 入門／個人演出 | 明確且具吸引力，但需要案例消除低價疑慮 |
| 雙機 | NT$14,800 | MOST CHOSEN／室內樂 | 中階錨點合理；應補「為何更值得」的畫面比較 |
| 三機 | NT$21,200 | 大型演出／高階 | 價差合理，多軌與調色能支撐升級 |
| 學生授權合作 | NT$3,300 | 有條件合作價 | 不應視為一般折扣；必須產生可用作品資產 |

學生合作價相對單機方案少收 NT$4,500，約 57.7%。這不是壞事，但應設資產回收門檻：

- 只接受能取得清楚、可執行書面授權的案件。
- 每案預先確認至少可產出 1 個完整案例與 3 個短素材。
- 成品交付後 14 天內完成發布與 UTM 連結，不讓授權素材沉睡。
- 未成年人、多人演出或權利鏈不完整時，未完成正式簽署就不得公開。
- 在尚未證明授權作品能帶來詢價前，學生合作案宜限制在可用產能的 20–25% 內。

### 市場價格快照

| 公開來源 | 單機／入門 | 雙機 | 三機／高階 | 備註 |
|---|---:|---:|---:|---|
| Owldio | 7,800 | 14,800 | 21,200 | 2 小時；三機含多軌 |
| 威米斯 | 10,000 | 20,000 | 25,000 | 二軌；多軌另加 |
| 吹鼓吹 | 12,000–14,000 | 15,000–19,000 | 18,000–24,000 | 學生／一般、地區不同 |
| 莎栗 | 14,000 | — | 18,000 起 | 學生案含多軌、工時較長 |

粗略看，Owldio 單機約比三個公開入門價中位數 NT$12,000 低 35%；雙機約比公開比較中位約 NT$18,500 低 20%。差異足以支持「學生友善／高性價比」，也足以讓沒有作品證據的訪客懷疑品質。

### 不建議現在直接漲價的原因

- 沒有報價到訂金轉換率與拒絕原因。
- 沒有每方案完整成本與毛利。
- 沒有公開作品證據，先漲價會同時放大信任問題。
- 學生合作價有授權交換邏輯，不能只用市場中位數判斷。

### 先做的價格改進

1. 保留四個價格，連續 60 天收集：來源、所選方案、報價、訂金、成交、毛利、拒絕原因。
2. 所有方案 CTA 改帶 plan 參數並預選表單。
3. 加上「攝影師／操作人數」「完整交付項目」「修改範圍」「交通費／場地限制」。
4. 72 小時急件與每 30 分鐘延長費先做成本檢查；固定低價可能無法反映人力與排程衝擊。
5. 精華剪輯定義秒數、直橫式、字幕與修改次數。
6. 60 天後只對新客測試一個變量：價格或包裝，不同時改兩者。

## 轉換與訊息審查

### 優點

- 首頁品牌記憶度強；暗色舞台、銅色、Owldio 名稱與貓頭鷹圖形形成一致識別。
- 首屏有「詢問錄製方案」「查看價目方案」雙 CTA。
- 價格頁可掃讀、方案比較與 FAQ 齊全。
- 「台上交給你，台下交給 Owldio」是可以持續使用的核心語句。
- 學生合作已避免以不實原價或限時折扣營造壓力。

### 高優先缺口

| 問題 | 影響 | 優先修法 |
|---|---|---|
| 作品頁沒有影片、iframe 或公開案例 | 訪客無法判斷聲音與畫面品質 | 先上 3 個代表案，不等完整作品庫 |
| 方案 CTA 不帶方案 | 使用者做完選擇後被迫重選 | `/contact?plan=single` 等預選 |
| 詢價表 14 個必填 | 手機流失、低意圖訪客不願開始 | 兩步式：先檔期／聯絡／類型，再收製作細節 |
| 首頁 H1 只有英文品牌句 | 品牌強，但中文搜尋主題不在主標 | 保留品牌句，同頁加入可見的中文 H1／副標結構 |
| 缺少評語與流程證據 | 只有自我宣稱 | 每案固定索取一句評語與一項可公開成果 |

## SEO 審查

### 技術與 on-page 現況

**通過：**

- metadata、canonical、Open Graph、Twitter card。
- sitemap、robots、server-rendered主要文字。
- `lang="zh-Hant"`、圖片 alt、主要頁唯一 H1。
- 公開定價可被搜尋引擎直接擷取。
- JSON-LD 以 JSON-LD 格式輸出。

**需改善：**

1. 首頁行銷動畫與前端資源造成手機 LCP 6.9s；Lighthouse 指出 89% LCP 時間為 render delay。
2. Noto Serif TC 多字重造成多個大型字型檔；整頁傳輸約 1.96MB。
3. 首頁為 client component 且動畫範圍大；可把靜態內容留在 server component，只隔離必要動畫。
4. footer 9px 法律文字對比僅 2.38:1，未達 4.5:1。
5. sitemap 每次 build 讓所有頁 lastmod 同時更新，可能無法代表真實內容更新；應用真實內容日期或省略。
6. `ProfessionalService` 只有 `areaServed: Taiwan`，缺少實體地址／明確服務區時不應硬套 LocalBusiness rich result；若有可公開地址，再補完整 `LocalBusiness` 欄位。
7. OfferCatalog 未帶公開價格與 TWD；可在定價頁補 page-level `Service`／`Offer`，但必須和可見內容一致。
8. 定價 FAQ 沒有 page-level FAQPage schema；即使新增，也不應期待一般商業站一定獲得 FAQ rich result。
9. 缺少案例、指南、場地、編制與比較型頁面；七個 URL 不足以形成搜尋主題權威。
10. `/pricing.md` 與 `/llms.txt` 目前 404。它們不是 Google AI 搜尋必要條件，但可作為非 Google AI agent 的低成本可讀入口。

### 90 天 SEO 優先序

**P0 — 技術與證據**

- 壓低首頁 LCP：減少字重、限制首屏動畫、拆 client component。
- 修 footer 對比。
- 建立 Google Search Console 與 Bing Webmaster Tools，提交 sitemap。
- 補 Google Business Profile；只填真實可公開的服務區與聯絡方式。
- 上線 3 個案例頁，每頁有演出情境、配置、困難、做法、交付與經授權的影音。

**P1 — 高意圖內容**

- `/graduation-recital-recording`：畢業／學位音樂會錄影錄音。
- `/concert-recording-pricing-guide`：音樂會錄影價格由什麼決定。
- `/single-vs-multi-camera-concert`：單機、雙機、三機差異。
- `/stereo-vs-multitrack-recording`：立體聲與多軌怎麼選。
- `/concert-recording-checklist`：演出前場地、曲目、授權與時間清單。

先做五個真正有第一手經驗的頁面，不做大量城市／關鍵字薄頁。

**P2 — AEO／AI 可讀性**

- 每頁先用 40–80 字直接回答核心問題，再展開案例。
- 用比較表、步驟、FAQ 與明確日期。
- 加作者／審閱者與第一手製作經驗。
- 建立 `/llms.txt` 與 `/pricing.md`，每次價格變更一起測試。
- 每月人工檢查 10 個核心查詢在 Google、ChatGPT、Perplexity 的提及與引用。

Google 官方仍將 AI 搜尋基礎定義為傳統 SEO、可靠內容與人類可用的頁面；不要為 AI 生成大量同義薄頁。

## 低成本獲客策略

### 三個大押注

1. **作品證據引擎：** 每個學生合作案都必須轉成可搜尋案例、短影音與老師／演出者評語。
2. **校園節點分發：** 不買廣泛曝光，先和系辦、教師、琴房、場館、社團幹部、畢音籌備群建立可轉介關係。
3. **高意圖搜尋 + 快速詢價：** 用五個高意圖內容頁承接需求，再用兩步詢價與方案預選縮短成交。

### 建議月預算

| 階段 | 現金預算 | 用途 |
|---|---:|---|
| 0–60 天 | NT$0–3,000／月 | 網站、免費分析、少量素材／交通；不投廣泛廣告 |
| 有 20+ 合格詢價且可追來源後 | NT$3,000–6,000／月測試 | Google Search exact/phrase 高意圖字；每週停損 |
| 單一付費渠道連續 2 個月毛利回收成立 | 不超過上月已實現毛利 10–15% | 擴量，不按營收目標硬燒 |

不建議現在買 Meta 廣泛曝光、KOL 套餐、展覽攤位、新聞稿保證刊登或大型 SEO 月費。

## 量測

**北極星：** 每月「已付訂金的合格錄製案」及其貢獻毛利。

| 漏斗 | 必記事件 |
|---|---|
| Acquisition | landing_view、source／UTM、portfolio_play、pricing_view |
| Activation | quote_start、plan_selected、quote_submit、LINE click |
| Revenue | quote_sent、deposit_paid、final_paid、gross_margin |
| Retention | second_booking、semester_contract |
| Referral | referral_source、review_received、referral_paid |

每週看數量與流失點；每月看來源到訂金、方案 mix、毛利與拒絕原因；每季才做價格決策。

## 來源

- [Owldio 定價頁](https://www.owldio.art/pricing)
- [威米斯服務價格](https://www.wemix-music.com/product)
- [吹鼓吹工作室公開方案](https://sites.google.com/view/studiosuona/)
- [莎栗音樂會影音紀錄](https://www.saliart.com.tw/service.html)
- [Google Search：LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google Search：AI features optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [web.dev：Largest Contentful Paint](https://web.dev/articles/lcp)
