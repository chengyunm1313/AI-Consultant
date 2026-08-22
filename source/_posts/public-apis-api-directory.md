---
title: public-apis：超過 40 萬顆星的 API 寶庫，Vibe Coding 很值得收藏
cover: /images/cover141.png
toc: true
categories:
  - 生成式AI應用
tags:
  - Vibe Coding
  - AI工具
  - API串接
date: 2026-08-23 02:23:53
subtitle: 從 API 黃頁到 Coding Agent 的外部工具箱
description: 想做天氣、匯率、電影或其他資料型 Side Project，卻不知道 API 到哪裡找？本文介紹 public-apis 如何整理大量公開 API，以及如何搭配 Coding Agent 更快完成選型與串接。
---

以前做 Side Project，最常卡住的地方不一定是寫程式。

而是：

> 「這個資料我要去哪裡拿？」

想做天氣功能，要找天氣 API。

想做匯率工具，要找匯率 API。

想做電影網站，要找電影資料。

甚至只是想做個隨機笑話、貓咪圖片、QR Code 或 IP 查詢的小功能，都得先花時間搜尋：

> **到底有沒有現成 API 可以用？**

這時候，`public-apis` 就很值得收藏。

## public-apis 是什麼？

`public-apis` 不是一個 API，而是一個整理大量 Public API 的 GitHub 專案。目前已累積超過 40 萬顆 Star，可以把它想成：

> **開發者的 API 黃頁。**

你可以直接到[ public-apis GitHub 專案](https://github.com/public-apis/public-apis)依照需求尋找資料來源，不必每次都從搜尋引擎開始，重新猜測關鍵字、比較文章，或在十幾個分頁之間來回切換。

## 裡面有哪些 API？

專案整理了超過 50 個分類，涵蓋很多 Side Project 常見的資料來源，例如：

- 天氣
- 金融與匯率
- 新聞
- 電影
- 音樂
- 遊戲
- 地圖
- 交通
- 機器學習
- 圖片
- 動物
- 政府開放資料
- 資安
- 購物
- 區塊鏈

有些資料類型可能是你平常不會特別搜尋的，但當你開始做一個小工具、展示型網站或資料視覺化專案時，就可能突然派上用場。

每個 API 通常也會標示幾個重要資訊：

- 是否需要 API Key
- 是否使用 OAuth
- 是否支援 HTTPS
- API 的功能說明
- 官方網站或文件連結

這些欄位可以幫助你先做第一輪篩選，再回到官方文件確認實際用法。

## 免費整理清單，不代表每個 API 都免費

這是使用 `public-apis` 時最需要注意的地方。

GitHub 專案本身可以免費瀏覽、fork，也能拿來尋找 API，但不代表清單裡每一個 API 都完全免費。

實際情況可能包括：

- 需要先註冊 API Key
- 提供有限的免費額度
- 超過額度後需要付費
- 免費方案限制請求次數或功能
- 服務方案可能隨時間調整

所以，只要要把 API 放進正式產品，就不能只看清單上的標示。最後仍然要回到 API 官方網站，確認以下資訊：

1. 價格與免費額度
2. Rate Limit 與每日或每月請求上限
3. API Key、OAuth 或其他驗證方式
4. 商業使用、資料再散布與授權條款
5. 服務穩定性、文件完整度與維護狀態

`public-apis` 適合用來縮短「找資料來源」的時間，不應該取代正式的技術與商業審查。

## 為什麼 Vibe Coding 時代更適合使用它？

以前看到這種清單，我們通常會這樣使用：

1. 打開 README
2. 使用 `Ctrl + F` 搜尋 `Weather`、`Currency` 或其他關鍵字
3. 一個一個點進去看
4. 自己整理文件、限制與串接方式

現在有了 Codex、Claude Code、Cursor 這類 Coding Agent 之後，使用方式可以更進一步。

你可以直接描述想做的產品與選型條件，例如：

```text
我要做一個旅遊網站，需要天氣、匯率與國家資訊 API。
請從 public-apis 裡面找幾個適合的方案，優先考慮免信用卡、有免費額度、
支援 HTTPS、文件完整，而且適合 Side Project 使用的 API。
請整理成比較表，列出驗證方式、Rate Limit、免費方案限制、官方文件與風險。
```

接下來可以讓 AI 協助完成幾個步驟：

- 從清單中找出符合需求的候選 API
- 讀取官方文件並整理必要參數
- 比較 API Key、OAuth 與匿名使用的差異
- 檢查免費額度、Rate Limit 與資料授權
- 產生串接範例與環境變數設定
- 把選定的 API 接進目前的專案
- 用測試資料驗證錯誤處理與異常情境

這也是我覺得 `public-apis` 在 Vibe Coding 時代真正有意思的地方：它不只是「我不知道去哪裡找 API」，而是逐漸變成 Coding Agent 的外部工具箱。

## 讓 AI 幫忙找 API 時，還是要保留人的判斷

Coding Agent 可以加快搜尋、閱讀文件與產生程式碼，但不能把所有選型責任交出去。尤其是以下幾件事，最好由人最後確認：

| 檢查項目 | 為什麼重要？ |
| --- | --- |
| 資料來源 | 確認資料是否可靠、合法且符合產品需求 |
| 使用條款 | 確認能否商用、儲存或再散布資料 |
| 方案限制 | 避免測試時免費，上線後卻突然產生費用 |
| Rate Limit | 預估流量增加時是否會被限流 |
| API 穩定性 | 確認文件、版本與服務是否有持續維護 |
| 金鑰安全 | 不把 API Key 直接寫進前端或提交到 Git |

特別是 API Key 安全。AI 產生串接程式碼時，必須提醒它使用環境變數，並確認金鑰只在後端或受控的 Serverless 函式中使用。這樣才能避免一個看似簡單的 Side Project，最後變成意外洩漏金鑰或產生額外帳單的事故。

如果想延伸閱讀如何用 AI 開始寫程式，可以參考[從零開始用 AI 寫程式的 Vibe Coding 指南](/posts/ai-vibe-coding-for-non-coders/)；如果想研究如何站在成熟開源專案上組裝產品，也可以看看[AI 時代不用從零開始！20 個必看的 GitHub 開源 AI Business OS 專案](/posts/open-source-ai-native-tools/)。另外，針對 AI API 的選型，也可以延伸閱讀[免費 AI API 怎麼選？Gemini、Ollama、OpenRouter 實測比較](/posts/free-ai-api-guide-gemini-ollama-openrouter/)。

## 結語：把時間留給產品，而不是重複找資料

以前收藏 `public-apis`，是因為怕以後找不到 API。

現在收藏它，是因為它可以直接變成 Coding Agent 的**外部工具箱**。

下次做 Side Project，不知道資料從哪裡來時，可以先叫 AI 到這裡翻翻看，再一起回到官方文件做驗證。很多原本以為要自己開發的功能，可能只需要幾分鐘就能找到合適的起點。

但真正的完成標準，不是 AI 找到一個看起來能用的 API，而是你確認它的資料、限制、授權與成本都適合目前的產品。

## 常見問答 (FAQ)

### Q1：public-apis 本身是一個可以直接呼叫的 API 嗎？

不是。`public-apis` 是整理大量公開 API 的 GitHub 專案，使用者仍然要從清單中選擇 API，並依照各服務的官方文件完成註冊、驗證與串接。

### Q2：public-apis 裡面的 API 都可以免費使用嗎？

不一定。清單本身可以免費瀏覽與使用，但其中的 API 可能需要 API Key、提供有限免費額度，或在超過 Rate Limit 後收費。正式使用前要回到官方網站確認價格與條款。

### Q3：Coding Agent 可以直接幫我選好並串接 API 嗎？

Coding Agent 可以協助搜尋候選 API、讀取文件、整理比較表與產生串接程式碼，但仍需要人確認資料品質、使用授權、免費方案、Rate Limit 與金鑰安全，再決定是否放入正式產品。

### Q4：用 API 做正式產品前，最少要檢查哪些事情？

至少要檢查 API 的官方文件、驗證方式、Rate Limit、價格與免費額度、商業使用條款、資料授權、錯誤回應，以及服務是否有持續維護。

### Q5：API Key 應該放在哪裡？

API Key 不應直接寫在前端程式碼或提交到 Git。一般應使用環境變數，並讓後端或受控的 Serverless 函式代為呼叫 API；同時要設定必要的權限、額度與監控。

最後附上專案連結：[public-apis GitHub repository](https://github.com/public-apis/public-apis)。
