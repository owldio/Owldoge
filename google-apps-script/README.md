# Google Apps Script 設定指南

這個 Google Apps Script 專案用於處理 Owldio 網站的聯絡表單，將資料儲存到 Google Sheets 並發送郵件通知。

## 功能特色

- ✅ 自動將表單資料儲存到 Google Sheets
- ✅ 發送格式化的郵件通知到 owldio.art@gmail.com
- ✅ 支援 HTML 格式的美觀郵件
- ✅ 自動處理日期格式轉換
- ✅ 錯誤處理和日誌記錄

## 設定步驟

### 1. 建立 Google Apps Script 專案

1. 前往 [Google Apps Script](https://script.google.com/)
2. 點擊「新增專案」
3. 將專案命名為 "Owldio Contact Form Handler"

### 2. 複製程式碼

1. 刪除預設的 `Code.gs` 內容
2. 複製 `Code.gs` 檔案中的所有程式碼
3. 貼上到 Google Apps Script 編輯器中
4. 儲存專案 (Ctrl+S)

### 3. 設定權限

首次執行時，Google Apps Script 會要求授權：

1. 點擊「檢閱權限」
2. 選擇你的 Google 帳戶
3. 點擊「進階」→「前往 Owldio Contact Form Handler (不安全)」
4. 點擊「允許」

需要的權限：
- 查看和管理你的試算表
- 以你的身分發送電子郵件

### 4. 測試功能

在 Apps Script 編輯器中：

1. 選擇函數 `testFormSubmission`
2. 點擊「執行」按鈕
3. 檢查執行日誌確認無錯誤
4. 確認 Google Sheets 中新增了測試資料
5. 檢查 owldio.art@gmail.com 是否收到測試郵件

### 5. 部署為網頁應用程式

1. 點擊「部署」→「新增部署作業」
2. 選擇類型：「網頁應用程式」
3. 設定：
   - **說明**: "Owldio Contact Form Handler v1.0"
   - **執行身分**: "我"
   - **存取權**: "所有人"
4. 點擊「部署」
5. 複製「網頁應用程式 URL」

### 6. 更新環境變數

將新的網頁應用程式 URL 更新到：

1. **本地開發** - `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=你的新網頁應用程式URL
   ```

2. **Vercel 部署** - 環境變數設定:
   - 進入 Vercel Dashboard > Settings > Environment Variables
   - 更新 `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` 的值

3. **Netlify 部署** - 環境變數設定:
   - 進入 Site settings > Build & deploy > Environment
   - 更新 `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` 的值

## Google Sheets 設定

### 試算表資訊
- **試算表 ID**: `1ANPpJ3tP1szF_9A1LBlck571xwXC_TiS-DR9yzt4zDI`
- **工作表名稱**: `Form_Responses`
- **URL**: [開啟試算表](https://docs.google.com/spreadsheets/d/1ANPpJ3tP1szF_9A1LBlck571xwXC_TiS-DR9yzt4zDI)

### 欄位說明
| 欄位 | 說明 |
|------|------|
| 提交時間 | 自動記錄表單提交時間 |
| 姓名 | 聯絡人姓名 |
| Email | 聯絡人電子郵件 |
| 電話 | 聯絡人電話 |
| 學校/機構 | 所屬學校或機構 |
| 演出類型 | 演出類型選擇 |
| 演出日期 | 演出日期和時間 |
| 演出場地 | 演出地點 |
| 演出時長 | 演出持續時間 |
| 參與人數 | 參與演出的人數 |
| 服務內容 | 選擇的服務項目 |
| 使用學生方案 | 是否使用學生方案 |
| 方案選擇 | 選擇的價格方案 |
| 交件時程 | 交件時間選擇 |
| 其他需求 | 額外需求說明 |

## 郵件通知

### 通知對象
- 主要收件人：`owldio.art@gmail.com`

### 郵件特色
- 📧 HTML 格式的美觀郵件
- 🎨 品牌色彩配色 (琥珀色主題)
- 📱 響應式設計
- 🏷️ 重要資訊高亮顯示
- 📞 可點擊的聯絡資訊 (電話、郵件)
- 🎓 學生方案特別標示

### 郵件內容包含
- 客戶聯絡資訊
- 演出詳細資料
- 服務需求總結
- 學生方案授權狀態
- 其他特殊需求

## 故障排除

### 常見問題

**Q: 表單提交後沒有收到郵件？**
A: 
1. 檢查 Gmail 垃圾郵件資料夾
2. 確認 Google Apps Script 權限設定正確
3. 檢查 Apps Script 執行日誌是否有錯誤

**Q: Google Sheets 沒有新增資料？**
A: 
1. 確認試算表 ID 正確
2. 檢查 Google Apps Script 是否有 Sheets 存取權限
3. 確認工作表名稱為 `Form_Responses`

**Q: 收到的郵件格式不正確？**
A: 
1. 確認使用最新版本的 Apps Script 程式碼
2. 檢查日期格式是否正確
3. 確認所有必要欄位都有資料

### 檢查日誌

在 Google Apps Script 編輯器中：
1. 點擊「執行情況」
2. 查看最近的執行記錄
3. 點擊任一執行記錄查看詳細日誌

### 更新程式碼

當需要更新功能時：
1. 修改 `Code.gs` 中的程式碼
2. 儲存變更
3. 測試功能
4. 如需要，建立新的部署版本

## 安全考量

- ✅ 使用環境變數儲存敏感資訊
- ✅ 限制 CORS 存取來源
- ✅ 錯誤處理不洩露系統資訊
- ✅ 定期檢查 Apps Script 權限

## 聯絡支援

如有技術問題，請聯絡：
- 📧 owldio.art@gmail.com
- 📱 Instagram: @owldio.art