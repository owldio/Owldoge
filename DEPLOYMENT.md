# 官網部署

## GitHub 與 Cloudflare Pages

官網程式碼位於 `owldio/Owldoge`。Git 連動專案為 `owldio-site-git`，正式分支為 `main`；正式網域接回此專案前，必須先確認該分支的雲端建置成功。

推送到 `main` 後，Cloudflare 會從 GitHub 取出該提交、執行檢查與建置，成功才更新網站。建置失敗時，保留先前成功的正式部署。分支預覽部署目前停用；不將正式表單設定複製到公開預覽。

Cloudflare 設定：

| 設定 | 值 |
| --- | --- |
| Repository | `owldio/Owldoge` |
| Production branch | `main` |
| Root directory | 留空（倉庫根目錄） |
| Build image | v3 |
| Build command | `pnpm install --frozen-lockfile && pnpm test && pnpm exec tsc --noEmit --incremental false && pnpm lint && pnpm run build:cloudflare` |
| Build output directory | `.cloudflare-build/site` |
| `NODE_VERSION` | `24.15.0` |
| `PNPM_VERSION` | `10.33.2` |
| `SKIP_DEPENDENCY_INSTALL` | `1` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| Worker compatibility date | `2026-10-01` |

建置產物是 Next.js 靜態網站、不同尺寸的 WebP 圖片及只處理 `/api` 路徑的 Pages Worker。請使用 `build:cloudflare`，一般的 `pnpm build` 不是 Pages 上傳產物。

## 表單設定

`GOOGLE_SCRIPT_URL` 必須以 Cloudflare Production 的 **Secret** 儲存，只由 Worker 使用；不得加上 `NEXT_PUBLIC_`、寫入前端、部署說明或 Git。Git 連動沿用原本的正式 Apps Script，不重新部署 Apps Script 或更動通知收件者。

本機需要表單時，將 `.env.example` 複製成被 Git 忽略的 `.env.local`，填入測試環境的 `GOOGLE_SCRIPT_URL`。Pages 本機預覽使用被忽略的 `.cloudflare-build/.dev.vars`，另見 `docs/migrations/cloudflare-free.md`。

排版測試使用本機模擬成功回應，不對正式表單送出測試資料。寄信與預約的既有使用者驗證，不等於每次部署重新送出真實申請。

## 更新與驗證

1. 修改程式碼，依 `AGENTS.md` 檢查受影響的排版與禁止孤字規則。
2. 執行 `pnpm test`、`pnpm exec tsc --noEmit --incremental false`、`pnpm lint`、`pnpm run build:cloudflare`。
3. 檢查差異，只提交預期的程式與文件；不得加入 `.env*`、`.dev.vars`、`.cloudflare-build`、客戶資料或未確認的 `output/`。
4. 推送到 GitHub `main`，在 Cloudflare Deployments 確認來源為 GitHub、提交 SHA 相同，建置與部署都成功。
5. 檢查正式官網、圖片、SEO 檔案、404、表單的無副作用驗證，以及 `player` 和 `quotation` 的既有狀態。

## 網域與回復

正式網域為 `www.owldio.art`，`owldio.art` 的一般頁面以 308 轉向 www 並保留路徑與查詢參數。Git 專案建置成功後，僅移轉 apex/www 的 Pages 綁定與 CNAME；保留郵件與其他子網域記錄。

Cloudflare 的 `OWLDIO apex to www` 轉向條件為 `(http.host eq "owldio.art") and not starts_with(http.request.uri.path, "/.well-known/")`。SSL 網域驗證路徑必須留在原網域，否則可能停在 Pending Validation；不可取消這個例外。此設定依 [Cloudflare DCV 說明](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/troubleshooting/) 執行。

原本 Direct Upload 專案 `owldio-site` 保留作回復。需要回復時，先確認原專案的 Pages URL 仍正常，再將 apex/www 重新綁回原專案並更新其 CNAME；依 Cloudflare 自訂網域流程完成驗證，不能只改 DNS 而漏掉 Pages 網域綁定。原 Vercel 固定部署的歷史回復紀錄見 `docs/migrations/cloudflare-free.md`。

Cloudflare 不支援把 Direct Upload 專案直接改成內建 Git 整合，因此 Git 專案與原回復專案分開保留。
