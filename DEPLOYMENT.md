# 部署說明

## 環境變量設置

本項目需要以下環境變量才能正常運行：

### `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`

**用途**: Google Apps Script 網頁應用程式 URL，用於接收表單提交數據並寫入 Google Sheets

**值**:
```
https://script.google.com/macros/s/AKfycbzRlWuldXufWVlJxydZDyLQBBowVE50XtASvPx2OLQkzCtER8XKvhC27ZyRyqdt7mjS/exec
```

## Vercel 部署步驟

1. 將代碼推送到 GitHub
   ```bash
   git add .
   git commit -m "Update contact form with Google Sheets integration"
   git push origin main
   ```

2. 在 Vercel Dashboard 設置環境變量
   - 進入項目設置: https://vercel.com/[your-username]/[your-project]/settings/environment-variables
   - 添加環境變量:
     - Name: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
     - Value: (上面的 URL)
     - Environment: 全選 (Production, Preview, Development)

3. 重新部署
   - Vercel 會自動部署，或手動觸發重新部署

## Netlify 部署步驟

1. 將代碼推送到 GitHub (同上)

2. 在 Netlify 設置環境變量
   - 進入 Site settings > Build & deploy > Environment
   - 點擊 "Edit variables"
   - 添加:
     - Key: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
     - Value: (上面的 URL)

3. 觸發重新部署
   - Deploys > Trigger deploy > Deploy site

## 本地開發

1. 創建 `.env.local` 文件（已自動生成）
2. 內容已包含所需的環境變量
3. 運行 `npm run dev`

## 注意事項

⚠️ **重要**: `.env.local` 文件已被 `.gitignore` 排除，不會被推送到 GitHub。這是為了保護敏感信息。

⚠️ 如果更改了 Google Apps Script URL，需要同時更新：
- 本地的 `.env.local` 文件
- Vercel/Netlify 的環境變量設置

## Google Sheets 設置

表單數據會自動寫入以下試算表：
- 試算表 ID: `1ANPpJ3tP1szF_9A1LBlck571xwXC_TiS-DR9yzt4zDI`
- 工作表名稱: `Form_Responses`
- URL: https://docs.google.com/spreadsheets/d/1ANPpJ3tP1szF_9A1LBlck571xwXC_TiS-DR9yzt4zDI

## 測試

部署後測試表單功能：
1. 訪問 `/contact` 頁面
2. 填寫並提交表單
3. 檢查 Google Sheets 是否收到數據
