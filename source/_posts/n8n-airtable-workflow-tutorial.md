---
title: 如何使用 n8n 串接 Airtable？自動化資料匯入完整教學
cover: /images/cover93.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
date: 2026-03-19 14:08:45
subtitle:
description: 想要將 API 獲取的數據自動存入資料庫嗎？本篇教學帶你一步步使用 n8n 工作流串接 Airtable，從建立資料表、設定 API Token 到批次匯入資料，輕鬆實現無程式碼自動化資料處理！
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/iGEkKO0lvGU?si=rN7Ol5zbgVuBP_Ck" 
    title="如何使用 n8n 串接 Airtable？自動化資料匯入完整教學" 
    allow="fullscreen">
  </iframe>
</div>

在上一堂課中，我們已經成功透過 n8n 的 `HTTP Request` 節點取得了 API 資料。接下來的關鍵步驟，是將這些獲取到的資料（例如：30 筆訂單資訊）自動儲存到雲端資料庫中。

雖然常見的選擇有 Google Sheets 或 Notion，但在本篇教學中，我們將使用強大的關聯式資料庫 **Airtable** 進行示範。透過 n8n 與 Airtable 的完美串接，你將能夠建立更高效的自動化資料處理流程。

## 如何在 Airtable 建立專屬資料表？

要將資料順利寫入 Airtable，我們必須先建立一個接收資料的「容器」。請依照以下步驟完成基礎設定：

### 1. 註冊帳號與建立 Base
首先，前往 Airtable 註冊帳號，並在你的工作區 (Workspace) 中建立一個新的 Base（例如命名為「初學者課程」）。

### 2. 設定資料表欄位與格式
進入 Base 後，系統會預設提供一個 Table。我們需要將原本的預設欄位刪除，並依照即將匯入的資料結構，精準建立以下五個欄位。

> **⚠️ 專家提醒：** 欄位的「資料類型 (Field Type)」必須與你 API 獲取的資料格式完全吻合，否則寫入時會發生錯誤！

請將資料表名稱更改為 `orders`，並設定以下欄位：

| 欄位名稱 (Field Name) | 欄位類型 (Field Type) | 說明 |
| :--- | :--- | :--- |
| `orderID` | Number (編號) | 訂單專屬 ID |
| `customerID` | Number (編號) | 客戶 ID |
| `employeeName` | Single line text (單行文字) | 處理員工姓名 |
| `orderPrice` | Number (編號) | 訂單金額 |
| `orderStatus` | Single line text (單行文字) | 訂單處理狀態 |

*註：設定 `employeeName` 時，若遇到欄位名稱重複衝突，可加上數字區別（例如：`employeeName2`），設定完成後記得將多餘的預設欄位刪除，保持表格整潔。*

## n8n 節點設定：如何安全連接 Airtable？

回到 n8n 編輯器介面，我們要在原本的 `HTTP Request` 節點後方，新增一個 Airtable 節點來接收資料。

### 1. 新增 Airtable 節點與動作
在畫布上點擊新增節點，搜尋 `Airtable`。因為我們的目標是「新增資料」，請在動作清單中選擇 **Create a record**。

### 2. 建立存取憑證 (Credential & Token)
為了讓 n8n 擁有修改 Airtable 的權限，我們需要建立一組 Personal Access Token (PAT)：
1. 在 n8n 的 Credential 設定中選擇 **Create new credential**。
2. 前往 Airtable 的 Developer Hub 頁面，點擊 **Create Token**。
3. 為你的 Token 命名（例如：`n8n-try`）。
4. **開放權限 (Scopes) 必須包含以下三項**：
   - `data.records:read` (讀取記錄)
   - `data.records:write` (寫入記錄)
   - `schema.bases:read` (讀取資料庫架構)
5. **開放工作區 (Access)**：選擇 `All workspaces`（為方便測試，可選擇全部工作區）。
6. 點擊建立後，**務必立刻複製該組 Token**（它只會顯示一次），並將其貼回 n8n 的 Access Token 欄位中進行儲存。看到 `Connection tested successfully` 即代表連線成功！

## 批次寫入資料：完成欄位映射與自動化測試

連線成功後，最後一步就是告訴 n8n 要將資料丟到哪張表，以及如何對應欄位。

### 1. 設定目標資料庫與映射
在 n8n 的 Airtable 節點設定中，依照以下參數進行配置：
- **Resource:** `Record`
- **Operation:** `Create`
- **Base:** 從下拉選單選擇你剛剛建立的 Base（例如 `n8n_level_one`）。
- **Table:** 選擇剛剛設定好欄位的表格 `orders`。
- **Mapping Column Mode:** 選擇 `Map Automatically`（自動映射）。

> **💡 節點版本除錯技巧：**
> 如果你在下拉選單中找不到你的 Base，可能是 n8n 節點版本的問題（例如 n8n 已更新至 2.0+ 系統，但節點仍為舊版）。解決方式是直接從 n8n 官方教學文件中，複製最新的 Airtable 節點，並在你的畫布上按下 `Ctrl+V / Cmd+V` 貼上替換即可。

### 2. 執行工作流 (Execute Workflow)
一切就緒後，點擊 **Execute Step**。此時 n8n 會將 `HTTP Request` 抓取到的 30 筆 JSON 資料，批次送往 Airtable。

回到 Airtable 介面，你會看到 30 筆訂單資料（包含金額、姓名、處理狀態等）已經自動、整齊地匯入至表格中了！完成這項串接後，未來所有的資料拋轉都能依賴這個工作流全自動化處理。

---

## 常見問答 (FAQ)

### Q：為什麼執行 Airtable 節點時，顯示資料格式錯誤無法寫入？
A：這通常是因為「Airtable 欄位類型」與「API 傳入的資料型態」不匹配。例如 API 傳送的是純數字 (Number)，但 Airtable 欄位卻設為單行文字 (Single line text)；或反之亦然。請務必仔細檢查 `orderID`、`orderPrice` 等欄位是否已正確設定為 `Number`。

### Q：在 n8n 設定憑證時，為什麼一直跳出權限不足 (Unauthorized) 的錯誤？
A：請回到 Airtable 重新檢查你的 Personal Access Token (PAT) 設定。確保你勾選了必要的 Scopes 權限：`data.records:read`、`data.records:write`，以及非常重要的 `schema.bases:read`，並確認 Access 有授權給對應的工作區。

### Q：為什麼我在 n8n 的 Base 下拉選單中，完全找不到我在 Airtable 建立的資料庫？
A：這通常是因為節點版本過舊導致 API 抓取失敗。建議將舊版的 Airtable 節點刪除，並從 n8n 官方文檔複製最新的節點貼上至畫布中；同時，也請確保你的 Token 具有 `schema.bases:read` 權限，系統才能讀取到你的 Base 清單。
