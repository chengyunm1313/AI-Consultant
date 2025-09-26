---
title: Vibe Coding Basics：AI 超級員工、Cloudflare 部署與 API Key 安全心法
cover: /images/cover60.png
toc: true
categories:
  - 生成式AI應用
tags:
  - Vibe Coding
date: 2025-09-27 02:27:03
subtitle:
description: 本文為 Vibe Coding 初學者指南，分享三大核心觀念：如何有效與 AI 協作、為何選擇 Cloudflare 進行低成本部署，以及保護 API Key 避免帳單爆炸的關鍵安全心法。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://gamma.app/embed/lh7cu8u1o9m99jg" 
    title="Vibe Coding 基礎心法" 
    allow="fullscreen">
  </iframe>
</div>

在 AI 時代，我們得到了一位強大的「超級員工」——AI。他可以幫你寫顧問報告、行銷企劃、甚至直接生成程式碼。但要真正用好 AI，並不是「一鍵成功」這麼簡單，而是一段需要學習與合作的旅程。

這篇文章將為初學者或剛接觸 Vibe Coding 的朋友，分享三個核心觀念：

1.  如何與 AI 合作
2.  為什麼在 Vibe Coding Basics 課程選擇 Cloudflare 部署
3.  如何正確處理 API Key，避免爆帳單與安全問題

## AI 是超級員工，但你得學會如何領導

AI 很強大，但也有「幻覺」(Hallucination) 問題。這意味著你必須學會如何引導它：

-   **提供清楚的 Context**：你必須給它足夠的上下文，否則它可能會胡言亂語。
-   **具備批判性思考**：你要學會檢查 AI 的回答是否正確，並不斷反問自己：「這是真的嗎？我要怎麼驗證？我要怎麼追問？」

這是一種全新的學習能力。在 AI 時代，最重要的技能就是判斷與學習。AI 能生成顧問報告、行銷分析，但如果我們沒有批判性思考，它就只是一個「會說話的機器」。反過來，若能善用 AI，我們就能把學習速度提升 10 倍甚至 100 倍。

## 系統開發的殘酷現實：萬物皆有成本

做任何服務，都繞不開一個現實：資訊系統都是要錢的。

-   部署到 GCP（Google Cloud）→ API 按量計價。
-   呼叫 Gemini API → 每次請求都會算錢。

不管是誰付錢，作為開發者或創業者，我們都必須學會看帳單、估算成本、計算損益。Google Cloud 的整合度很高，功能很強大，但對新手來說門檻也高：

-   **功能太多**：學習曲線陡峭。
-   **收費項目太細**：很容易在不經意間踩到收費的坑。

因此，在 Vibe Coding Basics 課程中，我不建議大家一開始就直接部署到 GCP，而是先走一條比較簡單、免費額度更多的路線：Cloudflare。

## 為何 Vibe Coding 課程選擇 Cloudflare？

Cloudflare 提供了一組對新手非常友善的工具組合，非常適合快速驗證想法：

-   **Workers (運算環境)**
    -   無伺服器 (Serverless)，上傳程式碼就能運行。
    -   適合做「API 代理」，幫前端轉發請求到 AI API，並將 API Key 安全地藏在後端。
-   **R2 (物件儲存)**
    -   用來存放圖片、檔案等靜態資源。
    -   類似 Google Cloud Storage 或 AWS S3，但提供了佛心的免費額度。
-   **D1 (SQL 資料庫)**
    -   儲存文字資料，例如聊天紀錄、使用者筆記等。
    -   與 Workers 原生整合，使用上極為方便。

為了讓大家更清楚 Cloudflare 的免費方案有多大方，這裡整理了核心服務的用量額度：

| 服務 (Service)          | 免費額度項目 (Free Tier Metric) | 免費額度 (Free Limit)          |
| ----------------------- | ------------------------------- | ------------------------------ |
| **Cloudflare Workers** | 請求 (Requests)                 | 每日 100,000 次                |
|                         | CPU 執行時間 (CPU Time)         | 每次請求 10 毫秒               |
| **Cloudflare R2** | 儲存空間 (Storage)              | 每月 10 GB                     |
|                         | A 類操作 (Writes, Lists)        | 每月 1,000,000 次              |
|                         | B 類操作 (Reads)                | 每月 10,000,000 次             |
| **Cloudflare D1** | 儲存空間 (Storage)              | 共 5 GB                        |
|                         | 讀取資料列 (Rows Read)          | 每日 5,000,000 列              |
|                         | 寫入資料列 (Rows Written)       | 每日 100,000 列                |

從上表可以看到，對於初期的專案開發、學習和測試來說，這個額度綽綽有餘，幾乎不用擔心產生費用。

Cloudflare 的主要好處在於：
-   **部署簡單**：不需要學習複雜的 VM、IAM、VPC 設定。
-   **免費起步 (Free Tier)** ：新手練習時不用擔心燒錢。
-   **快速驗證**：非常適合打造 MVP (最小可行產品)。

### 範例流程：一個 AI 筆記小工具

1.  使用者在前端介面輸入一段文字。
2.  前端將請求發送到我們的 Cloudflare Worker (後端代理)。
3.  Worker 在後端安全地帶上 `API Key`，呼叫 Google Gemini API。
4.  Gemini API 回傳摘要結果給 Worker，Worker 再將結果回傳給前端顯示。
5.  使用者的輸入與 AI 生成的結果可以存到 D1 資料庫，相關圖片則放到 R2。

👉 **結果**：一個功能完整的服務就跑起來了！你可以在免費額度內完整體驗，學到系統性思維，又不必擔心帳單爆炸。

## API Key 的終極安全心法：絕不外洩

許多新手會犯一個致命錯誤：直接把 API Key 寫死在前端程式碼中。

⚠️ **錯誤示範：**
```javascript
fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaxxxxx...", {
  // ...
})
```

這樣做，任何人只要打開瀏覽器的開發者工具，就能輕鬆複製你的 API Key，然後用你的額度去濫用，最終帳單還是算在你頭上。

### 正確做法：使用 Worker 作為後端代理

1.  **將金鑰儲存在 Cloudflare Secrets**
    在你的專案目錄下執行指令，將金鑰存為環境變數。

    ```bash
    npx wrangler secret put GEMINI_API_KEY
    ```

2.  **在 Worker 程式碼中讀取金鑰**
    Worker 可以從環境變數 `env` 中讀取你剛剛設定的金鑰，並在後端發起請求。

    ```typescript
    export interface Env {
      GEMINI_API_KEY: string;
    }

    export default {
      async fetch(req: Request, env: Env): Promise<Response> {
        const body = await req.json<{ prompt: string }>();

        const baseUrl = [
          "https://generativelanguage.googleapis.com/v1beta/models/",
          "gemini-pro:generateContent?key="
        ].join("");
        
        const resp = await fetch(
          baseUrl + env.GEMINI_API_KEY,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: body.prompt }] }],
            }),
          }
        );

        return new Response(await resp.text(), {
          headers: { "Content-Type": "application/json" },
        });
      },
    };
    ```

3.  **前端只呼叫自己的 Worker 端點**
    前端現在不再需要知道 API Key，只需呼叫我們部署在 Cloudflare 上的 Worker 即可。

    ```javascript
    await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userInput }),
    });
    ```

👉 透過這種方式，`API Key` 從頭到尾都只存在於安全的後端環境，完全不會暴露在前端。

### 再進一步的安全守則

  - **來源限制 (CORS)** ：只允許你的網站網域呼叫 API，不要設定為 `*` (允許所有來源)。
  - **短效 Token (JWT)** ：對於需要登入的服務，由伺服器簽發有時效性的 Token，並由 Worker 進行驗證。
  - **速率限制與配額**：設定 API 呼叫頻率上限，避免服務被惡意請求刷爆。
  - **觀測與告警**：在雲端後台設定帳單警戒線，當金額超過時自動通知或停用服務。
  - **金鑰輪替 (Rotation)** ：定期更新 API 金鑰，且永遠不要將金鑰寫死在程式碼中。

**永遠不要做的三件事：**

  - ❌ 把金鑰 `commit` 到 GitHub 或任何公開的程式碼倉庫。
  - ❌ 試圖把金鑰混淆或加密後放在前端（這沒有用）。
  - ❌ 在錯誤訊息中回傳任何與金鑰相關的資訊。

## 學習的本質：從踩坑到成長

學習 AI 應用開發，就像帶領一位新進的超級員工：一開始難免會踩坑，可能會遇到 API key 洩漏、帳單超支、CORS 跨域問題等。但每踩一次坑，你就學會了一項關鍵技能，無論是成本控制、系統安全還是架構思維。

這也是為什麼在 Vibe Coding Basics 裡，會建議大家：

1.  **先用 Cloudflare**：讓你專注於享受 AI 帶來的創造力，快速打造產品。
2.  **之後再進 GCP**：在有了基礎後，再深入學習更完整的生產環境部署與成本管理。

## 常見問答 (FAQ)

### Q1: AI 回答的內容我可以直接相信並使用嗎？

**絕對不行。** 請永遠將 AI 生成的內容視為「草稿」而非「最終答案」。你**必須**親自驗證其正確性，特別是對於事實、數據、程式碼或任何關鍵資訊。學會對 AI 的產出進行批判性思考與驗證，是比學會提問更重要的技能。

### Q2: Cloudflare 的免費額度用完了會怎麼樣？會不會突然收到天價帳單？

**不會。** Cloudflare 的免費方案在用量達到上限時，服務可能會暫停運作或回傳錯誤，直到下一個計費週期開始，但**不會自動升級並向你收費**。你需要手動綁定付款資訊並升級到付費方案，用量超出免費額度的部分才會開始計費。因此，新手可以放心練習，不會有意外的帳單。

### Q3: 我的專案很小，只有自己用，API Key 放前端應該沒關係吧？

**不行，這是最危險的壞習慣。** 無論專案規模大小，都不能將 API Key 暴露在前端。網路上的惡意爬蟲會持續掃描 GitHub 等公開平台或網站原始碼，一旦金鑰洩漏，可能在幾分鐘內就被盜用並產生高額費用。請從一開始就養成透過後端代理來保護金鑰的正確觀念。

### Q4: 我可以直接學 GCP/AWS 嗎？為什麼推薦先從 Cloudflare 開始？

當然可以直接學習 GCP/AWS，它們是功能更強大的商業級平台。但它們的學習曲線也更陡峭，功能和計費方式非常複雜，新手很容易迷失方向或踩到費用陷阱。Cloudflare 提供了一個更簡潔、整合度高的「新手村」，讓你用最低的門檻和成本，快速體驗一個完整應用的開發與部署流程，先建立起核心概念與信心。

## 總結：你的 AI 開發第一步

  - **AI 是強大的員工**，但你需要學會如何領導與判斷。
  - **Cloudflare 是新手的練功場**：透過 Workers + R2 + D1 的組合，讓你用極低成本啟動你的服務。
  - **API Key 必須藏在後端**：這是絕對不能妥協的安全鐵則。
  - **擁抱錯誤**：學習的過程就是不斷踩坑、檢討、然後變得更強。

在 AI 時代，最重要的能力不是寫出多厲害的程式，而是快速學習、準確判斷、以及有效管理成本的能力。