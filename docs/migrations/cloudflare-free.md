# Cloudflare 免費架構分段遷移

日期：2026-10-01（台灣時間）。目前階段：第一段，本機候選版與驗證。

## 範圍與基準

- 正式網站目前在 Vercel；apex A `76.76.21.21`，`www` CNAME `cname.vercel-dns.com`。
- 註冊商 Porkbun；Cloudflare nameservers `brenna.ns.cloudflare.com` / `sonny.ns.cloudflare.com`。
- 本機起點 `15de703`，比本機記錄的 `origin/main`（`7d363bf`）多兩個品牌定位提交。
  正式切換前必須核對遠端最新版本並決定內容基準；預覽候選版不是目前 production 的逐位元副本。
- 工作分支 `codex/cloudflare-free-stage1`。原有未追蹤 `output/` 品牌素材保留。

## 架構

Next.js 匯出靜態 HTML/JS/CSS，只有 `/api/*` 呼叫輕量 Pages Function。
Cloudflare 候選建置在 `.cloudflare-build/staging` 的來源副本完成，排除 Next API route，
將 `llms.txt`、`pricing.md` 的 GET 回應在建置時匯出。原本 `pnpm build` 仍是 Vercel 建置。

圖片在建置時產生 14 個寬度、quality 78 的 WebP，不使用 Cloudflare Images 線上轉換。
原始圖片和 SVG 保留，圖片排版與來源不變；壓縮品質固定，需在預覽比對畫面。
內容、價格與機器可讀檔案更新須重新部署，不再依靠伺服器每 24 小時 revalidate。

表單的框架無關驗證位於 `src/lib/submit-contact.ts`，由 Vercel route 和 Cloudflare Worker 共用。
兩邊都保留一般／學生申請的版本、資格、加購與非締約紀錄驗證及上游錯誤回應。
Cloudflare 使用 `CF-Connecting-IP` 保存申請 IP，忽略訪客傳入的 forwarded IP。
`GOOGLE_SCRIPT_URL` 只在伺服器環境綁定；不放入靜態建置、公開檔案或 git。

## 第一段：本機候選版

```powershell
pnpm install --frozen-lockfile
pnpm test
pnpm run build:cloudflare
pnpm run preview:cloudflare
```

預覽僅綁定 `127.0.0.1:8091`，Wrangler 預設使用本機 workerd。
預覽使用專用 `.cloudflare-build/.dev.vars`，不載入原始 checkout 的 `.env.local`。
未設定 `GOOGLE_SCRIPT_URL` 時有效表單回傳 500，這表示缺少伺服器綁定，並非可收件狀態。
不要用真實 Apps Script 測試，除非已核准寫入測試資料及寄出通知；使用可丟棄的測試上游。
測試程式使用 mock 上游，不會寫入 Google Sheets 或寄信。

產物：`.cloudflare-build/site`；摘要：`.cloudflare-build/build-report.json`。
`_routes.json` 只包含 `/api`、`/api/*`，讓靜態頁面不消耗 Function 請求額度。
輸出檢查 Pages Free 的單檔 25 MiB、總檔案 20,000 限制。

本機確認不代表雲端相容性、10 ms CPU 限制內、真實收件、DNS 或 production 部署已通過。

### 第一段驗證紀錄

2026-10-01 已確認：

- `pnpm test`：23/23 通過（包含 mock 上游的一般、預約、未成年多人學生申請及錯誤路徑）。
- `pnpm run build:cloudflare`：靜態匯出成功，502 檔案、392 WebP 圖片版本，最大 WebP 187,302 bytes。
- CF 建置後重跑 `pnpm build`：原本 Vercel 建置成功，仍包含動態 `/api/submit-contact`。
- TypeScript 與本次修改檔案 ESLint 通過；獨立標準／需求與 TypeScript 檢查無未解決發現。
- Wrangler 本機 workerd：13 個頁面／內容／影片 URL 回應 200，未知頁面回應 404；66 個圖片 URL 回應 WebP 200。
- 本機 API：GET 405、壞 JSON／不完整申請 400；缺少上游綁定的 contact 500（預期結果，未送真實資料）。
- 瀏覽器首頁可顯示，學生方案 query 正確預選；觀察期間未記錄瀏覽器 error／warn。
- 沒有推送 Git、部署雲端、啟用付費服務、改 DNS 或向正式表單上游送出資料。

本機預覽採固定 compatibility date `2026-10-01`；Cloudflare 候選版使用 Webpack 建置，
避免 Next.js 15 Windows Turbopack 的 custom image loader 問題。Vercel 建置仍使用原本 Turbopack。

## 第二段：Cloudflare 雲端預覽

先核對 Cloudflare 帳戶、既有 Pages 專案、免費方案、帳戶共用 Function 用量與 Git 連結。
新增獨立預覽專案，build command `pnpm run build:cloudflare`，output `.cloudflare-build/site`。
不要覆寫播放器或報價系統的專案。
預覽用隔離測試 Apps Script 環境，驗證資料與通知完整送達；不要在正式收件環境產生測試紀錄。
預覽應限制索引及存取，避免搜尋引擎收錄重複官網；雲端階段再設定對應規則。

驗收：所有公開路由、頁面跳轉、方案預選、一般／學生表單、手機版、圖片、影片、
404、sitemap、robots、canonical、llms、pricing.md、錯誤路徑與真實 Function CPU 指標。
免費架構是否足夠依雲端測量決定；不預設升級 Workers、Images、R2 或其他付費方案。

## 第三段：正式切換

雲端預覽通過後保存 Cloudflare 原始 DNS 紀錄、TTL、Vercel deployment ID 和可回復版本。
核准正式切換後只改官網 apex / www 記錄；nameservers、MX、Email Routing、player、quotation 保留。
保留 `https://www.owldio.art` canonical 與 apex 到 www 的導向，完成憑證與同網域表單檢查。
Vercel 保留至少一週，切換後監測 HTTP、錯誤與表單收件；完成後才另行處理舊部署。

回復：恢復實際保存的 apex / www DNS 紀錄，重新確認官網與表單；DNS 快取可能延遲回復。

## 官方參考

- [Next.js 靜態匯出](https://nextjs.org/docs/app/guides/static-exports)
- [Pages advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/)
- [Pages Function 路由](https://developers.cloudflare.com/pages/functions/routing/)
- [Workers 免費限制](https://developers.cloudflare.com/workers/platform/limits/)
- [Pages Function 費用](https://developers.cloudflare.com/pages/functions/pricing/)
