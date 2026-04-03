---
title: 如何使用 Code 節點實作 JavaScript 訂單加總 | (EP.8) n8n 自動化新手教學
cover: /images/cover96.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
date: 2026-03-19 14:50:42
subtitle:
description: 學習在 n8n 自動化工作流中使用 Code 節點！本教學帶你了解 n8n 獨特的物件陣列結構，並運用 JavaScript (或 AI 輔助) 輕鬆完成訂單總和計算，實現高效資料處理。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/EPWgchchq_4?si=-rGN6iveUvY_mItT" 
    title="如何使用 Code 節點實作 JavaScript 訂單加總" 
    allow="fullscreen">
  </iframe>
</div>

## 為什麼要在 n8n 中引入 Code 節點？

在自動化工作流中，當我們使用節點過濾並梳理好資料後（例如成功撈取出 16 筆已預訂的訂單），往往會需要進行進階的數值計算，像是「計算所有訂單的總價值」。這時，純粹的無程式碼 (No-code) 節點可能無法滿足複雜的運算需求，我們就可以透過加入 **Code 節點** 並撰寫 JavaScript 來達成目的。


## Code 節點的兩大核心執行模式

在 n8n 中新增 Code 節點後，系統會要求你選擇執行模式。了解這兩種模式是確保資料正確處理的關鍵：

* **Run once for all items (對所有項目執行一次)：** 將所有輸入的資料作為一個群組（陣列）一次性處理。非常適合用來做「總和計算」或「跨資料比對」[00:02:06]。
* **Run once for each item (對每個項目逐一執行)：** 針對流入節點的每一筆資料單獨執行一次程式碼。適合用來做單筆資料的格式轉換或清理。

對於計算訂單總和的情境，我們必須選擇 **Run once for all items**。

## 避開陷阱：掌握 n8n 特有的資料結構

在 n8n 中處理程式碼時，最常遇到的挫折就是資料格式錯誤。

### 獨特的物件陣列 (Object Array)
n8n 節點之間傳遞資料的模式是非常特殊的「物件陣列」，它雖然長得有點像 JSON，但有其嚴格的規範。如果你在撰寫或回傳資料時沒有遵照 n8n 的 Data Structure（資料結構），系統就會直接報錯。

### 程式碼貼上技巧
為了避免不必要的錯誤，當你要貼上已經寫好的 JavaScript 程式碼時，請務必按照以下步驟操作：
1. 點擊輸入區塊。
2. **全選並刪除**所有預設的內容，確保輸入框完全乾淨。
3. 貼上你的程式碼。

```javascript
// n8n Code 節點範例：計算總和 (需符合 n8n return 格式)
let totalValue = 0;
for (const item of $input.all()) {
  totalValue += item.json.orderValue || 0;
}
return [{ json: { totalOrderValue: totalValue } }];
```

## 不會寫程式？讓 AI 成為你的得力助手！

如果你對 JavaScript 不熟悉，也不用擔心！在 AI 時代，你不需要成為工程師也能打造低程式碼 (Low-code) 工作流。你只需要將 n8n 的資料結構規範以及你的運算需求（例如：「幫我把陣列中的 book 訂單價值加總」）交給 AI (如 ChatGPT 或 Gemini)，AI 就能為你生成精確且符合 n8n 格式的程式碼。這大幅降低了從無程式碼跨越到低程式碼的門檻。

---

## 常見問答 (FAQ)

### Q：不會寫程式也能使用 Code 節點嗎？
A：絕對可以！現今可以利用 AI 工具輔助，只要清楚描述你的需求與 n8n 的資料結構，AI 就能幫你產出正確的 JavaScript 程式碼，你只需複製貼上即可。

### Q：Code 節點的執行模式該如何選擇？
A：如果你需要將所有資料加總計算（例如本教學中的計算訂單總和），請選擇「Run once for all items」；若是需要對單一項目逐一處理或格式化，則選擇「Run once for each item」。

### Q：為什麼貼上程式碼後會一直出現 Error？
A：n8n 使用獨特的物件陣列 (Object Array) 格式傳遞資料，與一般 JSON 略有不同。強烈建議在貼上程式碼前，先「全選並刪除」原本編輯器內預設的程式碼，確保輸入框乾淨後再貼上，以避免結構格式衝突。