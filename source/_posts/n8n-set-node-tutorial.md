---
title: 如何使用 Set 節點精確篩選與處理訂單資料 | (EP.7) n8n 自動化新手教學
cover: /images/cover95.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - 資料處理
date: 2026-03-19 14:42:45
subtitle:
description: 本教學將帶領你掌握 n8n 中的 Set 節點（Edit Fields），學習如何從繁雜的原始訂單中精確篩選出所需欄位，並自動同步至 Airtable，大幅提升資料處理效率。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/QTp2tByFC3c?si=LKRJbPlbftJbFMdG" 
    title="如何使用 Set 節點精確篩選與處理訂單資料" 
    allow="fullscreen">
  </iframe>
</div>

## 為什麼你需要學會資料篩選？

在自動化流程中，我們時常會從前一個節點（如 Webhook 或資料庫）接收到大量的原始資訊。然而，並非所有資訊都是後續流程所需要的。例如，你可能只需要「訂單編號」與「員工姓名」，而不需要價格、狀態等雜訊。

若不進行篩選，直接將所有資料塞入後端表格，會導致資料庫臃腫且難以維護。透過 **n8n 的 Set 節點**，我們可以像過濾器一樣，只留下真正有價值的數據。


## 如何使用 Set (Edit Fields) 節點？

### 1. 新增並設定 Set 節點
在流程中點擊 `+` 號，搜尋並加入 `Edit Fields (Set)` 節點。

### 2. 切換至手動映射 (Manual Mapping)
進入節點設定後，你會看到兩種模式：`JS` 與 `Manual Map`。請選擇 **Manual Map**，這能讓你直觀地透過拖放來選擇欄位。

### 3. 挑選關鍵欄位
從左側的輸入預覽中，將你需要的欄位（例如 `orderID`、`employeeName`）拉動至右側的輸出設定中。

### 4. 關閉「包含其他欄位」 (Include Other Fields)
這是最關鍵的一步！請確保將 **Include Other Fields** 選項設為 **False (關閉)**。
- **開啟時：** 會保留所有原始欄位並新增你設定的欄位。
- **關閉時：** 輸出的資料將**僅包含**你剛剛手動挑選的那幾個欄位。

```javascript
// Set 節點處理後的資料結構範例
[
  {
    "orderID": "10248",
    "employeeName": "Vinsset"
  }
]
```

## 將優化後的資料同步至 Airtable

完成資料篩選後，你需要調整輸出的目的地：
1. **建立新表：** 在 Airtable 中建立一個新的工作表（例如 `processed_orders`）。
2. **定義欄位：** 根據你在 Set 節點篩選的欄位，在 Airtable 建立對應的欄位名稱（如 `orderID` 設為數字類型，`name` 設為單行文字）。
3. **連接流程：** 將 Set 節點的輸出連接至 Airtable 節點，並選擇剛才建立的新表。

執行流程後，你會發現原本混亂的 14 筆訂單，現在以最精簡、清晰的格式呈現在你的資料庫中。

## 常見問答 (FAQ)

### Q：為什麼我用了 Set 節點，輸出的資料還是有一堆用不到的欄位？
A：請檢查節點內的 `Include Other Fields` 開關。若此選項開啟，n8n 會預設傳遞所有原始欄位。請將其關閉，才能達到精確篩選的效果。

### Q：Set 節點可以修改欄位的名稱嗎？
A：可以。在 Manual Map 模式下，你可以自定義輸出的 Key 名稱，並將左側的原始資料對應進去，這對於整合不同格式的系統非常有用。

### Q：如果我想對篩選後的數字進行計算（如加總訂單額）該怎麼辦？
A：Set 節點主要用於「定義」與「過濾」欄位。若需要進行複雜運算，建議在 Set 節點之後接續一個 `Code` 節點（使用 JavaScript）來處理計算邏輯。
