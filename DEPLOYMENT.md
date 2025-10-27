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

## Google Apps Script 設置

### 問題解決：郵件通知功能

之前的設定只將表單資料儲存到 Google Sheets，但**沒有發送郵件通知**到 owldio.art@gmail.com。

### 🚨 重要：需要更新 Google Apps Script

1. **前往 Google Apps Script**:
   - 網址: https://script.google.com/
   - 找到現有的專案或建立新專案

2. **複製新的程式碼**:
   - 從 `google-apps-script/Code.gs` 複製完整程式碼
   - 貼上到 Google Apps Script 編輯器中
   - 儲存專案

3. **測試功能**:
   - 在編輯器中執行 `testFormSubmission` 函數
   - 檢查是否收到測試郵件

4. **重新部署**:
   - 點擊「部署」→「新增部署作業」
   - 選擇「網頁應用程式」
   - 複製新的 URL

5. **更新環境變數**:
   - 將新的 URL 更新到 `.env.local` 和 Vercel/Netlify

### 新功能特色

✅ **自動郵件通知**: 每當有新表單提交時，自動發送格式化郵件到 owldio.art@gmail.com
✅ **美觀的 HTML 郵件**: 包含品牌色彩和完整的客戶資訊
✅ **可點擊聯絡資訊**: 郵件中的電話和 Email 可直接點擊
✅ **學生方案標示**: 特別標記使用學生方案的客戶
✅ **錯誤處理**: 完整的錯誤日誌和處理機制

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
4. **檢查 owldio.art@gmail.com 是否收到郵件通知**
5. 確認郵件格式正確且包含所有必要資訊

### 故障排除

如果沒有收到郵件：
1. 檢查 Gmail 垃圾郵件資料夾
2. 確認 Google Apps Script 權限設定正確
3. 查看 Apps Script 執行日誌是否有錯誤
4. 測試 `testFormSubmission` 函數
