---
title: 如何透過 HTTP Request API 從資料倉儲取得資料 | (EP.4) n8n 自動化新手教學
cover: /images/cover92.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - n8n新手教學
date: 2026-03-19 02:27:49
subtitle:
description: 真實商業場景為例，學習如何使用 n8n 打造自動化工作流。本文將帶你了解自動化報表的設計流程，並手把手教學如何設定 HTTP Request 節點，透過 API 串接舊有資料倉儲抓取銷售數據。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/9JYORANFjQs?si=aG1oODMB0f3o9OSH" 
    title="n8n 自動化實戰：如何透過 HTTP Request API 從資料倉儲取得資料" 
    allow="fullscreen">
  </iframe>
</div>

## 真實世界場景：Nathan 的報表自動化挑戰

在日常工作中，許多重複且令人麻木的任務往往佔據了我們大量的時間。讓我們透過一個真實的商業場景，來了解如何運用自動化工具解決這些痛點。

認識一下 Nathan，他是 ABCorp 的擔任分析經理。他的主要工作是協助團隊進行報告和分析，同時也需要處理多項專案計畫。然而，Nathan 面臨著一個每週最令他頭痛的問題：**每週銷售報告**。

過去，他必須手動執行以下繁瑣步驟：
1. 從公司舊有的資料倉儲中收集銷售資料。
2. 整理主要的業務流程資料（如銷售或生產狀態，分為「處理中」或「已預訂」）。
3. 計算所有「已預訂」訂單的總額。
4. 每週一在公司的 Discord 群組上公佈數據。
5. 建立一份所有正在處理中銷售的 Airtable 試算表，讓銷售經理可以檢視並確認是否需要跟進客戶。

這種手動工作不僅耗時，且需要高度專注於細節，一旦打錯數字或漏掉訂單，就會導致報表失準。幸運的是，雖然舊有的資料倉儲無法直接匯出 CSV，但近期新增了 **API 端點 (API Endpoints)** 來暴露這些資料。這意味著我們可以使用 n8n 來建立自動化工作流程，徹底解放他的雙手。

---

## 設計自動化工作流程 (Designing the Workflow)

在開始動手實作前，我們需要先拆解這項自動化任務，釐清需要執行哪些步驟來實現目標。Nathan 的工作流程可以拆分為以下八個核心步驟：

1. **從資料倉儲取得資料**：透過 API 撈取訂單 ID、狀態、價值與員工姓名等資訊。
2. **將資料插入 Airtable**：建立追蹤表單。
3. **過濾訂單順序**：區分處理中或已預訂狀態。
4. **設定訂單處理的值**。
5. **計算已預訂訂單總價值**。
6. **通知團隊**：將資訊發送至 Discord。
7. **工作流程排程**：設定每週一早上執行。
8. **發佈與檢視工作流程**。

在本篇教學中，我們將專注於最基礎也最重要的一步：**如何透過 HTTP Request 節點取得資料**。

---

## 步驟一：從資料倉儲取得資料

並非所有的應用程式都有專屬的 n8n 節點。當我們遇到內部系統或較舊的資料庫時，只要對方提供 API，我們就能使用通用的 `HTTP Request` 節點來呼叫資料。

### 1. 建立新的工作流程

首先，進入 n8n 介面，建立一個新的工作流程：
1. 點擊左側選單進入工作流程，選擇新增。
2. 將這個新工作流程命名為 `Nathan's workflow`（為了方便辨識，您可以依照自己的進度命名，例如加上序號 `02`）。

### 2. 新增 HTTP Request 節點

接下來，我們要在畫布上加入節點來啟動流程：
1. 點擊畫面上的 `+` 新增節點，先加入一個 **Schedule Trigger** 或 **Manual Trigger**（手動觸發）作為起點。
2. 接著新增第二個節點，在搜尋框輸入 `HTTP`，選擇 **HTTP Request** 節點。

### 3. 設定 HTTP Request 參數

開啟 HTTP Request 節點的設定面板，我們需要依照 API 文件的要求填入對應的參數：

*   **Method (方法)**：選擇 `GET`，因為我們要從伺服器讀取資料。
*   **URL (網址)**：填入資料提供方給予的 Dataset URL。
    ```text
    http://learn.app.n8n.cloud/webhook/custom-erp
    ```
*   **Send Headers (發送標頭)**：將此選項切換為 `true`。
    *   在 `Specify Headers` 設定中，Name 輸入 `unique_id`。
    *   Value 輸入您專屬的 ID 數值。
*   **Authentication (授權認證)**：由於資料具有機密性，我們需要設定 API 憑證。
    *   選擇 `Generic Credential Type`。
    *   Generic Auth Type 選擇 `Header Auth`。
    *   在 Credential for Header Auth 下拉選單中，點選 **Create new credential**。

**建立新的 API 憑證 (Credentials)：**
1. 將此憑證命名為易於辨識的名稱，例如 `api_key` 或 `Level one auth`。
2. Name 欄位填入：`api_key`。
3. Value 欄位填入：您取得的專屬 API Key 數值。
4. 點擊 **Save** 儲存憑證。

### 4. 取得並驗證資料 (Get the Data)

所有參數設定完成後，就可以測試 API 呼叫是否成功。

點擊節點右上角的 **Execute step (執行步驟)**。如果設定正確，右側的 Output 面板將會回傳 JSON 格式的數據。您可以檢查是否成功撈取到了 Nathan 所需要的五個關鍵欄位：

*   `orderId`: 訂單的唯一編號。
*   `customerId`: 客戶的唯一編號。
*   `employeeName`: 負責該訂單的員工姓名 (如 Nathan 的同事)。
*   `orderPrice`: 訂單總價。
*   `orderStatus`: 訂單目前的狀態 (Processing 處理中 或 Booked 已預訂)。

成功看到這些資料，就代表您已經成功利用 HTTP Request 節點完成自動化流程的第一關！接下來，我們就能將這些資料往後傳遞，進行後續的過濾、計算與跨平台傳送。

---

## 常見問答 (FAQ)

**Q1：如果 API 回傳錯誤或沒有資料，應該怎麼排查？**

A：首先確認以下幾個常見原因：
- **URL 是否正確**：複製貼上時注意有無多餘的空格或換行。
- **Headers 是否設定正確**：`unique_id` 的名稱和數值必須與 API 文件一致。
- **API Key 是否有效**：憑證建立後，確認 `api_key` 的 Value 欄位填入的是正確的金鑰，無多餘空白。
- **網路連線**：確認 n8n 伺服器可以對外連線，若是自架版本請檢查防火牆設定。

---

**Q2：`Generic Credential Type` 和其他授權方式有什麼差別？**

A：n8n 提供多種授權方式：
- **Generic Credential Type（通用）**：適合大多數自訂 API，可選擇 Header Auth、Query Auth、Bearer Token 等。
- **OAuth2**：適合 Google、GitHub 等支援 OAuth 的服務。
- **Basic Auth**：以帳號密碼方式認證，較舊的系統常用。

本場景中資料倉儲使用 API Key 放在 Header 中，因此選擇 `Header Auth` 是最適合的做法。

---

**Q3：這個工作流程可以支援多少筆資料？**

A：n8n 的 HTTP Request 節點本身沒有資料筆數限制，但實際取得的資料量取決於 API 端點的設計。若 API 有分頁（Pagination）機制，你可以在 HTTP Request 節點的進階設定中啟用 **Pagination** 功能，讓 n8n 自動循環請求直到取完所有資料。

---

**Q4：我沒有現成的 API，只有資料庫，可以用 n8n 直接連嗎？**

A：可以！n8n 提供多種資料庫節點，例如：
- **PostgreSQL**、**MySQL**、**MariaDB**
- **MongoDB**
- **SQLite**

若你有直接存取資料庫的權限，可以使用對應節點替代 HTTP Request，不需要額外建立 API 端點。

---

**Q5：Credentials（憑證）儲存在哪裡？安全嗎？**

A：n8n 將憑證加密後儲存在資料庫中（預設使用 AES-256 加密），不會以明文方式保存。若是使用 n8n Cloud 版本，憑證由 n8n 官方的安全環境托管；若是自架版本，加密金鑰由你自行管理，請務必妥善保存 `N8N_ENCRYPTION_KEY` 環境變數，避免洩漏。

