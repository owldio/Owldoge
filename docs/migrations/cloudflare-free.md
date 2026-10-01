# Cloudflare 免費架構分段遷移

日期：2026-10-01（台灣時間）。目前階段：第二段雲端預覽已部署並登入；Google 隔離腳本與試算表已建立，等待測試端點的存取設定確認。

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

### 前置檢查紀錄

- 已即時核對 GitHub `origin/main`：仍為 `7d363bfceea5f9401b9a7e310330aff6092445d6`。
- Wrangler OAuth 登入 `eric0891230@gmail.com`，帳戶 ID `c074dc9e4d1951adf720762c729aea22`。
- 這個登入可列出四個 Pages 專案：`freentitycard`、`freentity`、`the-seventh-address`、
  `owldio-quotation-gateway`；本次未修改其中任何專案。
- API 查詢 `owldio.art` zone 回傳空陣列；帳戶 subscriptions API 回傳 403。
  因此尚未確認網域帳戶、Workers 付費／免費方案或帳戶共用用量。
  不能只憑 CLI 可登入就判定帳戶正確或部署不會有費用。
- 上述 Eric 帳戶是最初的 CLI 登入，不是這次官網部署帳戶；後續已登入正確 Owldio 帳戶（見下）。
- 已準備 `.cloudflare-build/preview-site`，在候選產物副本加入全站 `X-Robots-Tag: noindex, nofollow`
  及 `robots.txt` 的 `Disallow: /`。禁止索引不等於存取保護；後續另行配置 Access。
- 補充本機手機檢查：學生方案 query 仍正確預選，實際 390px viewport 的 document/scroll width
  均為 390px，未見橫向溢出。這不是雲端或完整手機流程驗收。
- 前置檢查時未建立／上傳專案；實際部署紀錄如下。

### 雲端部署紀錄

- 使用者已登入並明確同意 Wrangler 授權。CLI 目前帳戶是 `owldio.art@gmail.com`，
  account ID `94a3e3ebbda98d19f33c4d9e56d0a43f`。
- 授權限於 user/account/zone read、pages write、workers_tail read 和 offline access。
  Wrangler 對缺少其他 scopes 的警告不代表本次 Pages 需要那些權限；未擴大授權。
- Zone `owldio.art` 為 active，zone ID `049c3581d3737f8dc8fbb19b03822081`。
  儀表板訂閱：Workers Free、網域 Free Plan、Teams Free Base；既有 R2 Paid 仍保留，官網候選版不使用 R2。
  檢查時每日 Worker requests 為 0/100,000，本期用量費用 $0（不保證未來用量）。
- 獨立 direct-upload Pages 專案 `owldio-site`，production branch `main`，無 Git connection／custom domain。
  不覆寫 `owldio-player`、`owldio-menu`、`owl-accounting`、`ledgerleaf-acc2` 或其他帳戶的報價專案。
- 上傳前已 Restrict previews，Access application `731bab1f-d86a-4599-a909-4dc82048fc76`，
  規則為 Include Emails `owldio.art@gmail.com`，目的地 `*.owldio-site.pages.dev`。
- 部署 branch `migration-preview`，候選 commit `0b3337e`，compatibility date `2026-10-01`。
  499 個 assets 加上 Worker／路由／headers 上傳成功；Pages API 階段狀態需與登入後互動驗收分開。
  固定部署 URL `https://2e005555.owldio-site.pages.dev`，別名 `https://migration-preview.owldio-site.pages.dev`。
- 未登入的固定／別名 URL 均 HTTP 302 到 Access；base `https://owldio-site.pages.dev` HTTP 404，未部署 production。
- 原官網 `https://www.owldio.art` 和播放器 HTTP 200，報價仍 HTTP 302 到其原有 Access。
  本次未改 DNS、推 Git、升級方案或送正式表單測試。
- Access 已透過使用者提供的驗證碼登入。七個主要公開頁面 HTTP 200，未知頁面 HTTP 404；
  六個子頁 canonical 保留正式 `www.owldio.art`，回應帶有 `noindex, nofollow`。
- 雲端首頁實際觀察到 WebP 圖片、字型、JS/CSS 200/304；手機 contact 390px 無橫向溢出、
  學生 query 正確預選，觀察期間瀏覽器 error/warn 為空。截圖在 ignored `.cloudflare-build/evidence/`。
- `llms.txt`、`pricing.md`、robots/sitemaps 的瀏覽器直接導覽曾被 client inspector 阻擋。
  2026-10-02 改用支援的瀏覽器檔案下載功能，五個檔案均成功取回，SHA-256 全部與上傳產物一致。
  預覽 robots 為 `Disallow: /`，sitemap 維持正式網域；證據 `cloud-text-verified.json`。
- Google 已登入且建立獨立測試腳本與試算表；一般／學生真實收件、通知、五個雲端拒絕路徑、
  影片播放與一筆真實 Function CPU 測量已完成，細節如下。正式切換尚未開始。

### 隔離 Apps Script 準備

```powershell
node tooling/cloudflare/prepare-sandbox.mjs
node --test tests/cloudflare-sandbox.test.mjs
```

產物 `.cloudflare-build/google-sandbox/Code.gs` 從現有 Apps Script 產生，移除正式 spreadsheet ID 與固定通知信箱。
必須貼到**新建的獨立 Apps Script 專案**，不可覆寫正式腳本。
執行 `setupSandbox` 建立新的 `OWLDIO CF Migration Sandbox 2026-10-01` 試算表，通知僅送腳本擁有者。
重跑 setup 不重建試算表；來源腳本變動造成 anchor 不符時生成器拒絕產生。

在新專案 Script Properties 取得 `SANDBOX_TOKEN`，以測試 web-app URL 加上
`?sandboxToken=<token>` 作為 Pages **preview** 的 server-only `GOOGLE_SCRIPT_URL` secret。
不要把 token 放到 Git、公開前端、截圖或日誌。
所有 POST 必須具備 token；試算表／郵件函式另檢查 sandbox marker、script ID、擁有者與指定試算表名稱。
缺少設定、錯誤 token、錯誤 script／owner 都拒絕執行副作用。

生成器隔離測試 7/7、全體測試 30/30、修改檔案 ESLint 與獨立 Standards／Spec 審查通過。
包含成功 setup／跨執行重跑、成功 mock 寫入與擁有者通知、錯誤試算表名稱、token／script／owner 拒絕路徑。
Google 雲端腳本已建立並儲存；`setupSandbox` 執行成功且重跑確認沿用同一份新建試算表。
腳本／试算表連結存放 ignored `.cloudflare-build/sandbox-resources.json`，不覆寫正式表單專案。
Google 登入後舊密碼提交分頁未回應，但新 Apps Script 分頁已確認帳戶登入成功。
測試 Web App 設定已準備：以擁有者執行、「所有人」存取、POST 另驗證 server-only token。
使用者已完成部署；管理部署介面核對為第 1 版、以 `owldio.art@gmail.com` 執行、「所有人」存取。
隔離端點已綁定 Pages preview 的 `GOOGLE_SCRIPT_URL` Secret；production 設定未出現此綁定。
API 設定嘗試被主機政策阻擋且未執行，暫存密鑰檔已清除；改由 Cloudflare preview 設定介面完成。
重新部署 `migration-preview` 成功，固定 URL `https://b0c786a2.owldio-site.pages.dev`，來源 commit `05761fb`。

一般方案真實瀏覽器測試已通過：虛構聯絡人「CF遷移隔離測試 20261001」、
`migration-test@example.com`、測試場地、2026-10-15 14:00、單機方案。
Pages API HTTP 200，頁面顯示申請已送出；隔離試算表第 2 列於 2026-10-01 23:57:13 寫入對應紀錄。
Gmail 已核對擁有者收到同名通知，包含測試場地與虛構資料註記。
沒有向正式表單試算表寫入資料，也沒有向測試聯絡人寄信。
證據存於 ignored `.cloudflare-build/evidence/`：`cloud-form-success.jpg`、
`sandbox-sheet-received.jpg`、`sandbox-notification-received.jpg`、`preview-secret-saved.jpg`。

儲存 Secret 時工具狀態回傳意外包含 sandbox token，已提醒使用者更換。
使用者後續表示目前設定可以；即時檢查確認 token 仍為原本已儲存值，未宣稱已更換，依其選擇繼續隔離測試。
不將 token 寫入本文件、Git 或公開前端；正式端點與正式憑證不受此次測試影響。

2026-10-02 後續雲端驗證：

- 成年單人學生方案：API HTTP 200、成功頁、試算表與擁有者 Gmail 通知均確認。
  虛構申請人「CF學生隔離測試 20261002」，沒有向填表者寄信。
  驗證既有 Apps Script 記錄的學生方案選擇與申請性質；不宣稱它會儲存所有學生 metadata。
- Wrangler 即時 trace：該學生申請 CPU `2 ms`、wall time `4010 ms`、outcome `ok`、HTTP 200、零 exception。
  這是一筆測量，不代表壓力測試或所有請求上限；網路等待不計入 CPU。
  Workers Free 官方每次 HTTP 請求 CPU 上限 `10 ms`，目前樣本未顯示需要升級。
- `percussion.mp4` 在預覽實際解碼與播放，720×404、48.788 秒、readyState 4、error 為空，
  觀察播放進度從 9.32 到 21.47 秒。該舊影片元件目前沒有公開頁面引用，這項為資源播放測試。
- 受 Access 保護的臨時檢查頁：GET API 405，壞 JSON／非物件 JSON／不完整一般／學生申請皆 400，
  五筆回應訊息及 `Cache-Control: no-store` 都正確。未登入同一檢查頁 HTTP 302 到 Access。
  上游斷線／錯誤的代理處理由既有本機測試驗證，雲端未刻意製造 Google 上游故障。
- 臨時檢查頁獨立 Standards／Spec 審查均零發現，reviewer 亦驗證五筆請求不會聯絡上游。
  完成文字資源下載後已從最新預覽產物移除並重新部署；別名該路徑加上新驗證 query 後確認 HTTP 404。
  舊固定臨時部署仍保留於同一個 Access 保護下，不宣稱已永久刪除。
- 正式官網／播放器 HTTP 200；公開 DNS 仍為 apex `76.76.21.21`、www `cname.vercel-dns.com`，TTL 300。

第二段預覽的上述驗收已完成。最終預覽為 `https://649d0541.owldio-site.pages.dev`，
別名仍為 `https://migration-preview.owldio-site.pages.dev`，來源 commit `83826bf`。
正式 DNS／Vercel 回復資料已保存，第三段具體切換範圍如下。
正式網域、正式表單綁定與 production 部署仍需切換階段處理，不把預覽驗收等同正式遷移完成。

先核對 Cloudflare 帳戶、既有 Pages 專案、免費方案、帳戶共用 Function 用量與 Git 連結。
新增獨立預覽專案，build command `pnpm run build:cloudflare`，output `.cloudflare-build/site`。
不要覆寫播放器或報價系統的專案。
預覽用隔離測試 Apps Script 環境，驗證資料與通知完整送達；不要在正式收件環境產生測試紀錄。
預覽應限制索引及存取，避免搜尋引擎收錄重複官網；雲端階段再設定對應規則。

驗收：所有公開路由、頁面跳轉、方案預選、一般／學生表單、手機版、圖片、影片、
404、sitemap、robots、canonical、llms、pricing.md、錯誤路徑與真實 Function CPU 指標。
免費架構是否足夠依雲端測量決定；不預設升級 Workers、Images、R2 或其他付費方案。

## 第三段：正式切換

### 已完成的切換準備（尚未執行正式切換）

- 從正確 Cloudflare zone 的 DNS 表格保存 17 筆紀錄到 ignored
  `.cloudflare-build/evidence/dns-before-cutover.json`；這是 UI 紀錄快照，不宣稱已完成 BIND 匯出。
  apex 為 A `76.76.21.21`，www 為 CNAME `cname.vercel-dns.com`，兩者均 DNS only、TTL Auto。
  公開解析觀察到 TTL 300；還原時應使用原介面的 Auto 設定。
- 正確 Vercel 團隊的 `owldoge` Production 為 Ready；UI deployment ID
  `9z5cSN1hB92B3nrHqxhu2JzxdJjw`，commit `7d363bfceea5f9401b9a7e310330aff6092445d6`。
  固定部署 URL `https://owldoge-bnllejnhb-owldios-projects.vercel.app`，
  回復資訊保存到 ignored `.cloudflare-build/evidence/vercel-rollback.json`。
  已確認既有 `GOOGLE_SCRIPT_URL` 存在，未揭露或記錄其值。
- apex 到 www 的 Single Redirect 表單已準備但未儲存或部署：
  條件 `(http.host eq "owldio.art")`，目標
  `concat("https://www.owldio.art", http.request.uri.path)`，308、保留 query string。
  308 保留 HTTP method；規則只匹配 apex，涵蓋 HTTP／HTTPS。
- 具體變更與順序保存在 ignored `.cloudflare-build/evidence/cutover-proposal.json`。
  production 發布、自訂網域關聯、DNS 與正式表單測試均等待明確核准。

### 核准後的執行順序與驗收

1. 將既有 Vercel production 的 `GOOGLE_SCRIPT_URL` 複製為 Cloudflare `owldio-site`
   production 的 server Secret；preview 繼續使用隔離 sandbox，不記錄密鑰值。
2. 發布 `.cloudflare-build/site` 到 production branch `main`，不可誤用 `preview-site`。
   確認 robots 允許索引、沒有全站預覽 noindex、canonical／sitemap 維持正式 www 網域；
   base URL 頁面與資源正常，無效 API 請求不會觸及正式上游。
3. 先從 Pages Custom domains 關聯 `www.owldio.art`，再由支援的設定流程改其 CNAME
   指向 `owldio-site.pages.dev`。確認 Active、有效 TLS、頁面／圖片／contact 正常後才繼續。
4. 同樣從 Pages Custom domains 關聯 `owldio.art`，由該流程將原 A 紀錄改為 Pages CNAME。
   不可在關聯前單獨改 CNAME，官方文件說明這會造成 522。確認 apex Active／TLS 正常。
5. 啟用上面準備的 exact-host 308 規則，核對 HTTP／HTTPS、路徑／query 保留與 www canonical。
6. 執行另經明確核准的一筆「CF正式切換測試」，使用虛構聯絡人與場地；
   寫入既有正式收件試算表、通知僅送 `owldio.art@gmail.com`，核對實際收件與通知。
   表單、憑證、公開頁面、資源與索引檢查成功後才宣告正式切換完成。

只改保存的 apex／www 兩筆 DNS；其餘 15 筆、nameservers、MX、Email Routing、TXT、
player、quotation、menu、acc、acc2、split 保留。不得升級付費方案。
Vercel 保留至少一週；若需要持續背景監測，另依使用者授權設定，不把本次互動檢查當成常駐監控。

回復：若網域啟用或驗收失敗，停用本次新增的 apex redirect（若已啟用），
恢復已改動的 apex／www 原 DNS only、Auto TTL 紀錄，確認 Vercel 官網與表單；DNS 快取可能延遲回復。

## 官方參考

- [Next.js 靜態匯出](https://nextjs.org/docs/app/guides/static-exports)
- [Pages advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/)
- [Pages Function 路由](https://developers.cloudflare.com/pages/functions/routing/)
- [Workers 免費限制](https://developers.cloudflare.com/workers/platform/limits/)
- [Pages Function 費用](https://developers.cloudflare.com/pages/functions/pricing/)
- [Pages 自訂網域與 DNS 關聯要求](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Single Redirect 設定](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/)
