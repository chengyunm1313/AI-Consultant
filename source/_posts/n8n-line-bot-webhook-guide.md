---
title: n8n 串接 LINE 官方帳號教學：Webhook 與 API 設定全攻略
cover: /images/cover101.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - API串接
description: 想要用 n8n 打造自動化 LINE Bot 嗎？本文完整教學如何透過 Webhook 接收訊息、HTTP Request 呼叫 LINE API，並解析簽章驗證與常見踩坑指南，讓你輕鬆完成高效串接！
date: 2026-03-23 14:55:50
subtitle:
---

<!-- <div class="iframe-wrapper">
  <iframe 
    src="https://gamma.app/embed/186lv1khymfupy5" 
    title="使用 Suno 創作音樂的著作權須知" 
    allow="fullscreen">
  </iframe>
</div> -->

使用 **n8n 串接 LINE 官方帳號**，最彈性且穩定的做法並非依賴專用的第三方節點，而是回歸本質，直接使用基礎的網路傳輸節點：

1. 透過 **Webhook 節點** 接收來自 LINE 的 Webhook 事件。
2. 透過 **HTTP Request 節點** 呼叫 LINE Messaging API 來回覆或推送訊息。

這種「不依賴特定模組」的架構，不僅能支援 LINE 最新的 API 功能，在未來擴充與維護上也最為自由。

## n8n 串接 LINE 的核心運作架構為何？

要建立流暢的自動化回覆，整個資訊流的方向如下：

1. **使用者觸發：** 使用者傳送訊息給 LINE 官方帳號。
2. **事件推送：** LINE 伺服器將該事件（Event）打包成 JSON，以 POST 方式傳送至你設定的 **n8n Webhook URL**。
3. **資料解析：** n8n 接收後，過濾並解析使用者的訊息內容。
4. **執行回應：** n8n 透過 HTTP Request 節點，帶著身分驗證（Token）呼叫 LINE Reply API 或 Push API，將回覆傳送給使用者。

> **💡 專家提示：** LINE 官方文件明確指出，當使用者與官方帳號互動時，LINE 會發送 Webhook Event。而 n8n 的 Webhook 與 HTTP Request 節點完美對應了「接收」與「發送」這兩個必要動作。

## 開始前，你需要準備哪些開發環境？

在建立工作流程前，請確保你已準備好以下兩端的設定：

### 1. LINE Developers 端
請登入 LINE Developers Console，建立並設定你的 Messaging API Channel：
* 取得 **Channel access token**（用於 API 呼叫身分驗證）。
* 取得 **Channel secret**（用於後續的安全性簽章驗證）。
* 準備好填寫 **Webhook URL** 的位置（稍後從 n8n 取得）。

### 2. n8n 端
你需要一個 **可從外網透過 HTTPS 存取** 的 n8n 伺服器：
* LINE 的 Webhook 嚴格要求必須是公開的 HTTPS 網址。
* 請務必使用 n8n Webhook 節點提供的 **Production URL（正式網址）**，Test URL 僅供編輯器內手動測試使用。
* 若你的 n8n 架設在 Reverse Proxy（如 Nginx、Cloudflare Tunnel）後方，請確保系統環境變數的 Webhook Base URL 設定正確。

---

## 實戰教學：3 步驟完成 n8n 與 LINE Webhook 設定

### 步驟 1：建立 n8n Webhook 節點 (接收入口)

在 n8n 中新增一個 Webhook 節點，這是整個自動化的起點：
* **HTTP Method**: `POST`
* **Path**: 自訂路徑，例如 `line-webhook`
* **Respond**: 設為 `Immediately` 或 `Using Respond to Webhook Node`（建議盡速回應 200 OK）。

設定完成後，複製節點上的 **Production URL**（例如：`https://your-domain.com/webhook/line-webhook`）。將此網址貼回 LINE Developers Console 的 Webhook URL 欄位並啟用，同時點擊 Verify 測試連線。

### 步驟 2：加入資料分流與判斷 (IF / Switch)

LINE 送來的事件很多種（加入好友、封鎖、文字訊息、圖片等）。透過 IF 或 Switch 節點，過濾出你想處理的事件，例如僅處理文字訊息：
* 條件設定：`{{ $json.body.events[0].type }} === "message"`
* 條件設定：`{{ $json.body.events[0].message.type }} === "text"`

### 步驟 3：設定 HTTP Request 節點 (回覆訊息)

過濾出文字後，使用 HTTP Request 節點呼叫 LINE Reply API：
* **Method**: `POST`
* **URL**: `https://api.line.me/v2/bot/message/reply`
* **Authentication**: 可使用 Header Auth 或直接在 Headers 手動加入。
* **Headers**:
  * `Authorization: Bearer {{你的_CHANNEL_ACCESS_TOKEN}}`
  * `Content-Type: application/json`
* **Body (JSON)**:
```json
{
  "replyToken": "={{$json.body.events[0].replyToken}}",
  "messages":[
    {
      "type": "text",
      "text": "你剛剛說的是：{{$json.body.events[0].message.text}}"
    }
  ]
}
```

> **⚠️ 絕對不能省的 `Content-Type` 設定：**
> 雖然你已經設定了 `Bearer Auth` 來驗證身分，但 **務必手動加上 `Content-Type: application/json`**。Authorization 管的是「你是誰」，而 Content-Type 是告訴 LINE「你送的資料格式」。如果漏掉這行，LINE API 非常容易直接回傳 `400 Bad Request` 錯誤。

---

## 資訊安全必備：如何在 n8n 實作 LINE 簽章驗證？

為了防止惡意攻擊者偽造 LINE 的請求打爆你的 Webhook，LINE 官方強烈建議驗證請求標頭中的 `x-line-signature`。

**在 n8n 的實作步驟：**
1. **開啟原始內容：** 在 Webhook 節點設定中開啟 **Raw Body** 選項，因為簽章驗證必須使用「完全未經解析的原始 Request Body」，若經過 JSON Parser 重整，計算出的雜湊值就會出錯。
2. **加密運算：** 加入 **Crypto 節點**，選擇 `HMAC-SHA256` 演算法。
3. **設定密鑰：** 將 LINE 的 **Channel secret** 作為加密 Key，對 Raw Body 進行加密。
4. **編碼與比對：** 將加密結果轉為 Base64 格式，並使用 IF 節點比對是否與 Header 中的 `x-line-signature` 完全一致。

---

## 進階實用情境：圖片處理與主動推播

當你的基礎文字 echo bot 跑起來後，可以嘗試擴充以下業務邏輯：

### 1. 接收與處理圖片 (Image Handling)
* 事件觸發後取得 `message.id`。
* 透過 HTTP Request 發送 `GET /v2/bot/message/{messageId}/content` 取得圖片。
* 將下載的圖片串接後續節點（如上傳至 Google Drive、S3，或丟給 AI Vision 進行影像分析）。

### 2. 主動推播通知 (Push Messages)
不需等待使用者講話，只要你有對方的 `userId`，就能利用 **Push API** 主動發送訊息。
非常適合用於：電商訂單狀態更新、報名成功通知、定時提醒或 AI 每日摘要推播。

---

## 邁向企業級：如何規劃高擴充性的 n8n 自動化架構？

如果你打算打造正式商業用的 LINE 自動化系統，建議將 n8n 工作流拆分為**「兩層式架構」**：

1. **入口層 (Gateway Workflow)：**
   專門負責 Webhook 接收、簽章驗證、回覆 HTTP 200 OK 給 LINE（避免超時），並將事件標準化後，透過子工作流 (Execute Workflow node) 傳遞下去。
2. **業務層 (Business Workflows)：**
   根據事件類型觸發不同的業務邏輯。例如：FAQ 智能客服 (串接 OpenAI)、會員資料寫入 (串接 Google Sheets / CRM)、預約系統建立 (串接 Notion / Airtable)。

這樣拆分的好處是：不僅能大幅降低 LINE Reply Token 逾時的風險，未來擴充任何 AI 工具或資料庫都會變得異常輕鬆。

---

## 常見問答 (FAQ)

### Q：HTTP Request 節點已經設定了 Bearer Auth，還需要手動加上 Content-Type 嗎？
A：**需要，強烈建議手動加上！** `Authorization: Bearer xxx` 僅負責身分驗證，而 `Content-Type: application/json` 是告訴 LINE 伺服器你傳送的資料格式。雖然某些 n8n 版本在 Body Type 選擇 JSON 時會自動補上，但為了避免難以除錯的 `400 Bad Request` 錯誤，手動在 Header 加上 Content-Type 是最穩妥的最佳實務。

### Q：為什麼我在 LINE Developers 後台點擊 Verify Webhook，一直測試失敗？
A：最常見的原因有兩個：第一，你在 n8n 提供的是 **Test URL**（僅限編輯模式有效），請務必改用 **Production URL** 並啟用 (Activate) 該工作流。第二，若你的 n8n 架設在反向代理伺服器（如 Nginx、Cloudflare）後方，請檢查 `WEBHOOK_URL` 系統環境變數是否有正確設定為對外公開的 HTTPS 網域名稱。

### Q：LINE 的 Reply Token 有時效限制，如果我的流程需要很長的運算時間（例如呼叫 AI 整理資料）該怎麼辦？
A：LINE 規定 Webhook 必須盡快給予 200 OK 回應，且 Reply Token 的有效時間非常短。實務上的做法是：Webhook 接收後立刻回傳「已收到您的訊息，處理中...」，接著將耗時任務（如 AI 分析）往後丟給非同步流程處理。當資料處理完畢後，改用 **Push API** 主動推播最終結果給該使用者的 `userId`。
