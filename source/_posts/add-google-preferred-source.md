---
title: Google 偏好來源怎麼用？網站主新增 Preferred Sources 按鈕搶 AI 搜尋流量
cover: /images/cover143.png
toc: true
categories:
  - 網路行銷
tags:
  - SEO
  - AEO
  - 內容行銷
date: 2026-08-24 20:45:21
subtitle: Google Preferred Sources 讓讀者主動選擇你的網站，成為搜尋與 AI 搜尋中的偏好來源
description: Google Preferred Sources 讓讀者把你的網站設為偏好來源，內容有機會出現在 Top Stories、AI Overviews 與 AI Mode；本文整理官方按鈕、Deeplink 與 CTA 實作。
---

如果你有經營部落格、媒體網站、品牌內容網站，最近 Google Search Central 對 **Preferred Sources（偏好來源）** 的更新，很值得直接放進網站經營清單。

Google 在 2026 年 8 月 20 日更新官方說明，現在網站經營者可以在頁面中加入 Google 提供的 **「Add to Preferred Sources」** 按鈕。讀者按下後，就能把你的網站設定成自己在 Google Search 裡的偏好來源。

這不只是多一顆按鈕，而是讓讀者主動告訴 Google：

> 「我希望在搜尋相關主題時，優先看到這個網站的內容。」

## Google Preferred Sources 是什麼？

當使用者把你的網站選為偏好來源後，你發布的內容在符合搜尋主題時，可能更容易出現在 Google Search 的特定內容版位，並以 **Preferred** 標示呈現。官方目前說明的場景包括：

- Google Search 的 Top Stories
- AI Overviews
- AI Mode

這裡要先釐清一件事：Preferred Sources 不是「安裝後就保證排名」的 SEO 外掛，也不是每篇文章都會自動出現在上述版位。它比較像是一個由使用者主動建立的偏好訊號，讓 Google 知道某位使用者希望優先接收哪些來源。

Google Search Central 也特別提醒，Preferred Sources 的來源對象是**網域或子網域**。例如 `example.com` 與 `code.example.com` 可以作為來源，但 `example.com/blog` 這種子目錄不能在工具中被當成獨立來源設定。這對把內容放在子目錄的網站來說，是導入前需要先確認的限制。

## 為什麼網站經營者應該關注這個入口？

過去做 SEO，常見的問題是：

> 「怎麼讓 Google 覺得我的網站值得排前面？」

現在又多了一個問題：

> 「怎麼讓讀者主動告訴 Google，他想優先看到我？」

兩者的出發點不一樣。前者是搜尋系統評估內容，後者則是讀者對來源的主動選擇。對固定產出專業內容的部落格、媒體、產業網站與個人品牌來說，這等於多了一個可以長期累積的讀者關係訊號。

Google 在另一篇官方文章中提到，讀者把網站標記為 Preferred Source 後，點進該網站的機率約是原本的兩倍。這是 Google 對整體功能的觀察，不代表每個網站或每篇文章都會得到相同幅度的結果，但它至少說明了一件事：**讀者主動選擇的來源，可能比一次性的搜尋曝光更容易形成回訪。**

這也代表網站經營的流量布局，除了 SEO、AEO、電子報與社群追蹤之外，可能還會多一個新的 CTA：

> 把我們加入 Google 偏好來源。

延伸閱讀：[網站如何被 AI 看見？免費 AEO 實作工具與微調全攻略](/posts/aeo-implementation-tools-optimization-guide/)

## 如何加入 Google 官方 Preferred Sources 按鈕？

Google 官方推薦的標準 JavaScript 實作只需要兩段 HTML：一段載入 Preferred Sources 函式庫，另一段放置按鈕容器。

```html
<!-- 建議放在網站的 <head> 裡 -->
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>

<!-- 放在想顯示按鈕的位置，例如文章結尾或作者介紹旁 -->
<div google-add-preferred-source-btn></div>
```

這個標準按鈕會依使用者的裝置與語言環境自動處理顯示，網站不需要自行複製一個 Google 介面。官方也提供 `data-theme` 設定，可以指定 `light` 或 `dark` 主題：

```html
<div google-add-preferred-source-btn data-theme="light"></div>
```

如果想指定按鈕語言，則可以使用 `data-lang`，但正式使用前要先對照 Google 官方提供的支援語言代碼，避免填入不支援的值。

### 不能執行 JavaScript 怎麼辦？

如果你的 CMS 不允許加入 JavaScript，或你只想先用最簡單的方式測試，也可以使用 Deeplink，把讀者帶到 Google 的來源偏好設定工具：

```text
https://www.google.com/preferences/source?q=example.com
```

把 `example.com` 替換成自己的網域，就能做成一般文字連結、圖片按鈕，也可以放進社群貼文、電子報或活動頁面。

以本網站為例，可以先使用這種文字 CTA：

[將 blog.es2idea.com 加入 Google 偏好來源](https://www.google.com/preferences/source?q=blog.es2idea.com)

## CTA 應該放在哪裡？

按鈕的重點不是放得越多越好，而是在讀者已經感受到內容價值的時候提出邀請。比較適合測試的位置包括：

1. **文章結尾**：讀者完成閱讀後，邀請他把網站加入偏好來源。
2. **作者介紹旁**：適合個人品牌、專業顧問與固定產出內容的作者。
3. **電子報訂閱區附近**：把「訂閱電子報」與「在 Google 優先看到新內容」放成兩種不同的回訪選項。
4. **網站首頁或分類頁**：讓第一次認識品牌、但還沒有準備訂閱的讀者先留下偏好。
5. **高價值常青文章**：例如教學、產業整理、工具評測與研究型內容。

文案最好直接說明讀者得到什麼，不要只寫「請支持我們」。例如：

> 喜歡這類 AI、SEO 與數位轉型內容嗎？把本站加入 Google 偏好來源，未來搜尋相關主題時，更容易看到我們的新文章。

這種 CTA 的語氣比較像邀請，而不是要求讀者替網站完成一個不透明的操作，也更符合 Preferred Sources 本身「由使用者選擇來源」的設計。

## Preferred Sources 會取代 SEO 或 AEO 嗎？

不會。Preferred Sources 的訊號來自已經選擇你的讀者，SEO 與 AEO 則仍然負責讓內容被搜尋系統發現、理解與評估。三者可以分工：

| 方法 | 主要作用 | 適合累積的資產 |
| --- | --- | --- |
| SEO | 讓內容在搜尋需求出現時被發現 | 網站結構、主題權威與自然流量 |
| AEO | 讓內容更容易被 AI 搜尋理解與引用 | 清楚答案、結構化內容與可信來源 |
| Preferred Sources | 讓讀者主動選擇希望優先看到的來源 | 讀者偏好與回訪機會 |

因此，網站不應該只因為有了按鈕，就降低內容品質或停止做基本 SEO。更合理的做法是先持續產出值得被追蹤的內容，再在適當位置提醒讀者：如果這個網站對你有幫助，可以把它加入 Google 偏好來源。

如果你想延伸整理網站的 AI 搜尋能見度，也可以參考：[AI 內容餵養手冊：如何讓你的文章被 ChatGPT 引用與訓練？](/posts/chatgpt-seo-content-strategy/)

## 網站經營者現在可以做的 4 件事

1. 先到 Google 的來源偏好工具搜尋自己的網域，確認網站是否可以被找到。
2. 能執行 JavaScript 的網站，優先測試官方標準按鈕；不能執行 JavaScript 的網站，先放 Deeplink。
3. 把 CTA 放在文章結尾、作者介紹或電子報附近，觀察哪個位置最自然。
4. 用既有的網站分析與轉換事件，觀察導入後的回訪、閱讀深度與訂閱行為，不要只看單篇文章的排名變化。

Google 正在把一部分「我想看誰的內容」的決定權交回使用者。對網站經營者來說，這不是要放棄 SEO，而是多一個機會，把一次性的搜尋曝光轉化成讀者主動選擇的來源關係。

如果你有自己的網站，我會建議先把官方按鈕或 Deeplink 裝起來，再用一段清楚的 CTA 告訴讀者它的用途。這個入口現在還早，越早測試，越容易累積自己的使用經驗。

## 官方說明

- [Google Search Central：Preferred Sources 官方技術說明](https://developers.google.com/search/docs/appearance/preferred-sources?hl=en)
- [Google Blog：Preferred Sources 擴展至所有語言](https://blog.google/products-and-platforms/products/search/preferred-sources-language-expansion/)

## 常見問答 (FAQ)

### Q1：Google Preferred Sources 是什麼？

Google Preferred Sources 是一項來源偏好功能，讓使用者選擇希望在 Google Search 的 Top Stories，以及可用的 AI Overviews、AI Mode 中更常看到哪些網站內容，並可能看到 Preferred 標示。

### Q2：加入 Preferred Sources 按鈕後，網站一定會排名更高嗎？

不一定。按鈕只是協助讀者完成來源選擇，不能保證網站排名、曝光位置或每篇文章都會出現；網站仍需要持續做好內容品質、SEO、索引與 AEO 基礎。

### Q3：網站如何加入 Google 官方按鈕？

網站需要在頁面載入 Google Preferred Sources 的 JavaScript 函式庫，並在想顯示按鈕的位置加入 `google-add-preferred-source-btn` 容器，官方標準實作就是這兩段 HTML。

### Q4：網站放在子目錄可以設定 Preferred Sources 嗎？

Google 官方目前以網域與子網域作為可設定的來源，例如 `example.com` 或 `code.example.com`；`example.com/blog` 這類子目錄不能在來源偏好工具中被當成獨立來源。

### Q5：如果網站不能執行 JavaScript，還能加入 Preferred Sources 嗎？

可以。網站可以使用 Deeplink，例如 `https://www.google.com/preferences/source?q=example.com`，把讀者帶到 Google 的來源偏好設定頁，也能將它做成文字連結或圖片按鈕放在網站、社群與電子報中。
