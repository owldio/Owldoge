/**
 * Owldio 聯絡表單處理 - Google Apps Script
 * 處理網站表單提交，將資料寫入 Google Sheets 並發送郵件通知
 */

// 設定常數
const SPREADSHEET_ID = '1ANPpJ3tP1szF_9A1LBlck571xwXC_TiS-DR9yzt4zDI';
const SHEET_NAME = 'Form_Responses';
const NOTIFICATION_EMAIL = 'owldio.art@gmail.com';

/**
 * 處理 POST 請求的主函數
 */
function doPost(e) {
  try {
    // 解析 JSON 資料
    const data = JSON.parse(e.postData.contents);

    // 檢查請求類型
    if (data.requestType === 'simple_email') {
      // 處理簡單郵件發送
      return handleSimpleEmail(data);
    } else {
      // 處理完整表單提交
      // 記錄到 Google Sheets
      recordToSheet(data);

      // 發送郵件通知
      sendEmailNotification(data);

      // 返回成功響應
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: '表單已成功提交'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    console.error('處理表單時發生錯誤:', error);

    // 返回錯誤響應
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: '表單處理失敗: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理簡單郵件發送（從 EmailModal）
 */
function handleSimpleEmail(data) {
  try {
    const subject = data.subject || '來自 Owldio 網站的訊息';

    // 建立簡單郵件內容
    const emailBody = createSimpleEmailBody(data);

    // 發送郵件到 Owldio
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      replyTo: data.email,
      subject: `📧 ${subject}`,
      htmlBody: emailBody
    });

    console.log('簡單郵件已發送到:', NOTIFICATION_EMAIL);

    // 返回成功響應
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: '郵件已成功發送'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('發送簡單郵件時發生錯誤:', error);
    throw error;
  }
}

/**
 * 建立簡單郵件內容
 */
function createSimpleEmailBody(data) {
  const timestamp = new Date().toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; }
        .section { margin-bottom: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .info-row { display: flex; margin-bottom: 10px; }
        .label { font-weight: bold; color: #666; min-width: 100px; }
        .value { color: #333; }
        .message-box { background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; white-space: pre-wrap; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">📧 網站聯絡訊息</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">收到時間: ${timestamp}</p>
        </div>

        <div class="content">

          <div class="section">
            <div class="info-row">
              <span class="label">寄件人:</span>
              <span class="value">${data.name || '未提供'}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${data.email}" style="color: #f59e0b;">${data.email || '未提供'}</a></span>
            </div>
            <div class="info-row">
              <span class="label">主旨:</span>
              <span class="value">${data.subject || '無主旨'}</span>
            </div>
          </div>

          <div class="section">
            <h3 style="color: #f59e0b; margin-top: 0; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">訊息內容</h3>
            <div class="message-box">${data.message || '無內容'}</div>
          </div>

        </div>

        <div class="footer">
          <p style="margin: 0; font-size: 14px;">
            Owldio Studio 鴞聲音畫 |
            <a href="mailto:owldio.art@gmail.com" style="color: #fbbf24;">owldio.art@gmail.com</a>
          </p>
          <p style="margin: 8px 0 0 0; font-size: 12px; opacity: 0.8;">
            此郵件由 Owldio 網站聯絡表單自動生成
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * 將表單資料記錄到 Google Sheets
 */
function recordToSheet(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // 如果工作表不存在，則創建它
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // 設定標題行
      const headers = [
        '提交時間', '姓名', 'Email', '電話', '學校/機構',
        '演出類型', '演出日期', '演出場地', '演出時長', '參與人數',
        '服務內容', '使用學生方案', '方案選擇', '交件時程', '其他需求'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 格式化標題行
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#f0f0f0');
    }
    
    // 準備資料行
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.school || '',
      data.eventType || '',
      data.eventDate || '',
      data.venue || '',
      data.duration || '',
      data.participants || '',
      Array.isArray(data.services) ? data.services.join(', ') : '',
      data.useStudentPlan || '',
      data.pricingPlan || '',
      data.deliveryTime || '',
      data.additionalInfo || ''
    ];
    
    // 添加新行
    sheet.appendRow(rowData);
    
    console.log('資料已成功記錄到 Google Sheets');
    
  } catch (error) {
    console.error('記錄到 Google Sheets 時發生錯誤:', error);
    throw error;
  }
}

/**
 * 發送郵件通知
 */
function sendEmailNotification(data) {
  try {
    const subject = `🎵 新的預約申請 - ${data.name || '未提供姓名'}`;
    
    // 建立郵件內容
    const emailBody = createEmailBody(data);
    
    // 發送郵件
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: emailBody
    });
    
    console.log('郵件通知已發送到:', NOTIFICATION_EMAIL);
    
  } catch (error) {
    console.error('發送郵件時發生錯誤:', error);
    throw error;
  }
}

/**
 * 建立郵件內容
 */
function createEmailBody(data) {
  const timestamp = new Date().toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; }
        .section { margin-bottom: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section h3 { color: #f59e0b; margin-top: 0; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .label { font-weight: bold; color: #666; min-width: 120px; }
        .value { color: #333; }
        .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 4px; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .student-plan { background: #ecfdf5; border: 2px solid #10b981; padding: 10px; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🎵 新的預約申請</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">提交時間: ${timestamp}</p>
        </div>
        
        <div class="content">
          
          <!-- 聯絡資訊 -->
          <div class="section">
            <h3>📞 聯絡資訊</h3>
            <div class="info-row">
              <span class="label">姓名:</span>
              <span class="value highlight">${data.name || '未提供'}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${data.email}" style="color: #f59e0b;">${data.email || '未提供'}</a></span>
            </div>
            <div class="info-row">
              <span class="label">電話:</span>
              <span class="value"><a href="tel:${data.phone}" style="color: #f59e0b;">${data.phone || '未提供'}</a></span>
            </div>
            <div class="info-row">
              <span class="label">學校/機構:</span>
              <span class="value">${data.school || '未提供'}</span>
            </div>
          </div>
          
          <!-- 演出資訊 -->
          <div class="section">
            <h3>🎭 演出資訊</h3>
            <div class="info-row">
              <span class="label">演出類型:</span>
              <span class="value highlight">${data.eventType || '未提供'}</span>
            </div>
            <div class="info-row">
              <span class="label">演出日期:</span>
              <span class="value">${formatDate(data.eventDate) || '未提供'}</span>
            </div>
            <div class="info-row">
              <span class="label">演出場地:</span>
              <span class="value">${data.venue || '未提供'}</span>
            </div>
            <div class="info-row">
              <span class="label">演出時長:</span>
              <span class="value">${data.duration || '未提供'}</span>
            </div>
            <div class="info-row">
              <span class="label">參與人數:</span>
              <span class="value">${data.participants || '未提供'}</span>
            </div>
          </div>
          
          <!-- 服務需求 -->
          <div class="section">
            <h3>🎬 服務需求</h3>
            <div class="info-row">
              <span class="label">服務內容:</span>
              <span class="value">${Array.isArray(data.services) ? data.services.join(', ') : '未選擇'}</span>
            </div>
            <div class="info-row">
              <span class="label">方案選擇:</span>
              <span class="value highlight">${data.pricingPlan || '未選擇'}</span>
            </div>
            <div class="info-row">
              <span class="label">交件時程:</span>
              <span class="value">${data.deliveryTime || '未選擇'}</span>
            </div>
          </div>
          
          <!-- 學生方案 -->
          ${data.useStudentPlan === '是' ? `
          <div class="section">
            <h3>🎓 學生方案</h3>
            <div class="student-plan">
              <strong>✅ 客戶選擇使用學生方案</strong>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #065f46;">
                客戶已同意授權 Owldio 使用演出錄音錄影作為作品集展示
              </p>
            </div>
          </div>
          ` : ''}
          
          <!-- 其他需求 -->
          ${data.additionalInfo ? `
          <div class="section">
            <h3>📝 其他需求說明</h3>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
              ${data.additionalInfo.replace(/\n/g, '<br>')}
            </div>
          </div>
          ` : ''}
          
        </div>
        
        <div class="footer">
          <p style="margin: 0; font-size: 14px;">
            Owldio Studio 鴞聲音畫 | 
            <a href="mailto:owldio.art@gmail.com" style="color: #fbbf24;">owldio.art@gmail.com</a> | 
            <a href="https://instagram.com/owldio.art" style="color: #fbbf24;">@owldio.art</a>
          </p>
          <p style="margin: 8px 0 0 0; font-size: 12px; opacity: 0.8;">
            此郵件由 Owldio 網站表單自動生成
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}

/**
 * 格式化日期顯示
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * 處理 GET 請求（用於測試）
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Owldio 表單處理服務運行中',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 測試函數 - 用於在 Apps Script 編輯器中測試
 */
function testFormSubmission() {
  const testData = {
    name: "測試用戶",
    email: "test@example.com",
    phone: "0912345678",
    school: "測試大學",
    eventType: "獨奏 / 個人演出",
    eventDate: "2024-12-01T19:00",
    venue: "測試音樂廳",
    duration: "60分鐘",
    participants: "1人",
    services: ["專業錄音", "錄影服務"],
    useStudentPlan: "是",
    pricingPlan: "單機方案",
    deliveryTime: "一般交件（7~10 個工作天）",
    additionalInfo: "這是一個測試提交"
  };
  
  try {
    recordToSheet(testData);
    sendEmailNotification(testData);
    console.log('測試成功完成');
  } catch (error) {
    console.error('測試失敗:', error);
  }
}