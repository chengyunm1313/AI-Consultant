---
title: "我以為 Modal 每月免費 30 美金，可以養一個 Kimi K3；結果一句話都還沒問，就先燒了 34 美金"
cover: /images/cover179.png
toc: true
categories:
  - AI自動化
tags:
  - AI Agent
  - Codex
  - AI工具
date: 2026-09-17 15:39:42
subtitle: "一次 Kimi K3 Dedicated Endpoint 實測：8×B300、載入超過 22 分鐘，連第一個 Prompt 都還沒送就產生 US$34.16 成本。"
description: "我原本想用 Modal Starter 的 US$30 免費 Compute 把 Kimi K3 接進 Codex，實測 Dedicated Endpoint 卻因 8×B300 與長時間載入產生 US$34.16 成本；本文整理 Shared Endpoint、Budget Guard 與 MCP 模型路由的踩坑。"
---

前幾天看到 [Modal](https://modal.com/) 的 Starter 方案，我注意到一件很有意思的事：

每個月都有 US$30 的免費 Compute 額度。

不是註冊時送一次，而是每個月都有。Modal 目前的[官方定價頁](https://modal.com/pricing)也把 Starter 的 Included compute 列為 US$30／月，同時把 Included token usage 列為 0。

我第一個想到的不是拿來生圖，也不是跑 Whisper。

而是：

**能不能把這 30 美金，變成 Codex 裡面的另一顆大腦？**

我最近剛好想測 Kimi K3。

依我這次看到的 [Kimi K3 Model Library](https://modal.com/library/moonshot/kimi-k3) 與部署設定，Kimi K3 是 Moonshot AI 推出的 MoE 模型，總參數規模 2.8T，每次推論約啟動 104B 參數，支援 1M context，Coding、Reasoning、Knowledge Work 與長時間 Agent 任務都是它主打的方向。

所以我原本想做的架構很簡單：

Codex → MCP → Modal → Kimi K3

平常我還是在 Codex 裡工作。

遇到複雜的架構問題，我就跟 Codex 說：

> 這個問題再叫 Kimi K3 看一次。

需要第二模型 Code Review：

> 把這次修改交給 Kimi K3 Review。

需要長上下文分析：

> 請 Kimi K3 從另一個角度分析。

這樣 Codex 是主腦，Kimi K3 是外部顧問，而 MCP 就負責在兩個模型之間傳遞任務。

聽起來很漂亮。

於是我真的下去做了。

結果第一個坑馬上就來了。

這篇不是 Modal 的官方計費說明，而是我在 2026 年 9 月 17 日這次帳號與部署紀錄上的實測。方案名稱、價格、模型版本、硬體配置與計費規則都可能更新；真正部署前，仍然要以當下的官方文件與帳務頁面為準。

## 我原本搞錯了 Modal 的「免費 30 美金」是什麼

Modal Starter 每月提供的 US$30，正確來說是：

**Compute Credits。**

它可以拿來支付 GPU、CPU、Memory、Container、Function，以及 Dedicated Endpoint 這類實際運算資源。

但 Modal 還有另一種產品叫：

**Shared Endpoint。**

Shared Endpoint 是 Modal 已經把模型架好了，你直接按 token 使用。Modal 的[官方 Shared Endpoints 文件](https://modal.com/docs/guide/shared-endpoints#pricing)明確寫著：Shared Endpoint 由 Modal 管理硬體與自動擴縮，使用量按 token 計費，而且方案內的 credits 不能用來抵扣 Shared Endpoint 使用量。

這代表 Modal 的計費要拆成兩個錢包：

| 類型 | 計費方式 | Starter 每月 US$30 Compute 可抵嗎？ |
| --- | --- | --- |
| Dedicated Endpoint、Functions、Containers | GPU、CPU、Memory 等運算資源 | 可以，依適用規則計算 |
| Shared Endpoint | Prompt、Cached Prompt、Completion tokens | 不可以，另按 token 計費 |

所以我一開始腦中的想像：

「每月送我 30 美金，然後慢慢拿來問 Kimi K3。」

其實不成立。

這 30 美金不是 Modal 帳戶裡可以任意使用的通用餘額，而是一張限定用途的雲端運算抵用券。

## 那我就自己架 Kimi K3 好了？

既然 Shared Endpoint 不能吃免費額度，那我就走另一條：

**Dedicated Endpoint。**

這樣 GPU Compute 理論上可以扣每月 US$30。

Modal 也真的支援 moonshotai／Kimi-K3，所以我想：

有工作才開機，跑完 scale down。

這不正是 Serverless GPU 最適合的場景嗎？

於是我建立 Kimi K3 Dedicated Endpoint，然後開始 provisioning。

一分鐘。

五分鐘。

十分鐘。

二十分鐘。

最後：

**29 分 22 秒，Endpoint Failed。**

原因不是模型掛掉，也不是第一個 Prompt 回答錯誤。

而是：

**我的 US$30 額度不夠了。**

更精確一點，畫面一度顯示 workspace 已經使用 107%，用量是 US$31.97；後來把 Billing Report 拆開，最後看到的數字是：

| 帳務項目 | 金額 |
| --- | ---: |
| Metered Cost | US$34.16 |
| Credits | -US$30.00 |
| Billed Cost | US$4.16 |

最精彩的是：

**我連第一個 Prompt 都還沒送。**

Kimi K3 一句話都還沒回答我，US$34.16 的 Metered Cost 已經產生了。😂

## 錢到底燒去哪裡？

這次 Billing Report 裡的主要成本是：

| 資源 | 主要成本 |
| --- | ---: |
| B300 GPU | 約 US$27.61 |
| Memory | 約 US$3.98 |
| CPU | 約 US$0.37 |

這是主要項目，不是完整帳務明細；但已經足夠看出問題：**我以為自己是在問一個模型，實際上是在付一整套大模型推論環境的啟動與運行成本。**

看到 B300，我一開始也懷疑：

「是不是 Modal 幫我選太貴的 GPU？如果換便宜一點的不就好了？」

但繼續挖 Log 後，答案比「換卡」複雜很多。

## Kimi K3 真的用了 8 張 B300

Log 裡可以看到：

CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7

SGLang 的啟動參數也直接寫著：

--tp 8

Tensor Parallel 等於 8。

更進一步的 Log 還寫著：

Kimi-K3 ... on B300／GB300
world_size=8

所以不是我猜測它用了 8 張 B300。

**這次部署真的就是一套 8 × B300 的 Kimi K3 推論環境。**

更誇張的是，這 8 張 GPU 有很長一段時間都還在載入模型。

從開始 Load weight 到完成，大約是：

**1352 秒，也就是 22 分 32 秒。**

而且每張 GPU 載入模型後，記憶體使用量大約都在 190GB 左右。

這也回答了我原本另一個想法：

「那換便宜一點的 GPU 不就好了？」

不能只看每張 GPU 的單價，還要看模型權重怎麼切、每個 Tensor Parallel Rank 需要多少記憶體，以及總 GPU 數量會不會因此增加。

GPU 單價比較便宜，不代表整個模型推論比較便宜。

## Modal 預設把 K3 火力全開

我繼續看啟動參數，才發現 Modal 幫我架的不是什麼「個人測試版 Kimi K3」。

這套部署直接準備了：

- 1M context
- context-length 1048576
- FP8 KV Cache
- DFLASH speculative decoding
- Multimodal
- CUDA Graph
- 最高 48 個 running requests
- 各種 FlashInfer、TensorRT 與 Blackwell 最佳化
- 另外載入 Kimi-K3-DFlash Draft Model

換句話說，它幫我準備的是一套可以提供大量 API 流量的高效能 Kimi K3 Server。

而我真正需要的是：

「偶爾叫 Kimi K3 幫 Codex 看一下程式碼。」

這是完全不同的需求。

我想要的是低頻率、可控成本的外部顧問；Dedicated Endpoint 給我的卻是需要先付出高額啟動成本、再等待模型載入的大型服務環境。

## Spend limit = 0，也不該被當成唯一硬控

因為我一開始就怕爆預算，所以很認真地把 Modal 設定成：

- Usage limit：US$30
- Spend limit：US$0

我原本的理解是：

「免費額度 US$30 用完，就停止；一毛錢都不付。」

但實際結果是，這次最後仍然出現 US$4.16 的 Billed Cost。

這裡要把兩件事分開看。

Modal 目前的[預算文件](https://modal.com/docs/guide/budgets)把 Workspace budget 定義成整個 Workspace 的用量上限，把 spend limit 定義成套用 credits 後的自付費用上限。官方也說，達到 spend limit 後，會停止還會產生額外自付費用的工作負載。

但這種平台層級的 Budget，不等於 MCP 在送出任務前的即時交易鎖。

如果 GPU workload 已經啟動，帳務資料、超額偵測與停止工作之間存在時間差；而 Kimi K3 是 8 張 B300 同時燒，幾分鐘的延遲就可能不是幾分錢。

所以我現在的結論不是「Spend limit 完全沒用」，而是：

**不能只把平台上的 Spend limit 當成唯一防線。**

平台 Budget 負責最後一層；MCP Budget Guard 要在任務送出前先攔一次。

## 我還踩到一個認證坑：Shared Endpoint 需要 Proxy Token

在測試 Endpoint 時，Modal 曾經直接顯示：

> Create a proxy token to require authentication for this Endpoint, or create the Endpoint with unauthenticated access.

這不是單純的錯誤訊息，而是提醒我：Endpoint 的「可以呼叫」和「應該公開」是兩件事。

依照 Modal 的[Endpoints 文件](https://modal.com/docs/guide/endpoints)，Shared Endpoint 一律需要 Proxy Token，Dedicated Endpoint 預設也需要 Proxy Token；只有在建立 Dedicated Endpoint 時，才可以選擇 unauthenticated。

如果之後要把它接進 Codex 或 MCP，正確的方向應該是：

1. 建立權限範圍清楚的 Proxy Token。
2. Token 只放在 MCP Server 的環境變數或 Secret 管理裡。
3. 不把完整 Token 貼進 Codex 對話、文章、Log 或 Git。
4. MCP 只把模型結果回傳給 Codex，不把平台憑證暴露給工具使用者。
5. 若是 Shared Endpoint，還要處理並行限制、逾時、重試與 429 回應。

Modal 官方也提供給 Codex 的 Endpoint 整合方式，會以 OpenAI-compatible API 與 Proxy Token 呼叫 Endpoint。這表示真正要做的不是把 Token 寫死在某個腳本裡，而是把認證、成本與資料邊界一起放進 MCP 的設計。

## Shared Endpoint 反而才是我原本需求的正確模式

Dedicated Endpoint 走不通，不代表 Kimi K3 不適合接進 Codex。

答案其實就在 Modal 自己的另一個選項：

**Shared Endpoint。**

Modal 已經幫大家養好那套昂貴的 GPU infrastructure，我只需要按 token 付費，不用自己啟動 8 張 B300。

這次 Kimi K3 Shared Endpoint 在我的帳號畫面上看到的價格是：

| 用量 | 價格 |
| --- | ---: |
| Prompt | US$3／1M tokens |
| Cached Prompt | US$0.30／1M tokens |
| Completion | US$15／1M tokens |

這些價格和模型可用性可能調整，實際使用前應以[Kimi K3 Model Library](https://modal.com/library/moonshot/kimi-k3)與 Endpoint 的 Usage view 為準。

假設一次 Codex Code Review：

- 輸入：50,000 tokens
- 輸出：5,000 tokens

輸入成本：

50K × US$3／1M = US$0.15

輸出成本：

5K × US$15／1M = US$0.075

合計約：

**US$0.225。**

這個經濟模型反而很合理。

不用付模型開機費，不用等 22 分鐘 Load weight，也不用為了問一個問題，先花 US$30 把模型叫醒。

但要注意：Shared Endpoint 不能用 Starter 的 US$30 Compute Credits 抵扣，所以它需要另一個「Token Budget」，不能和免費 Compute 共用同一個錢包。

## 三種模式，現在要分清楚

| 模式 | 主要計費 | 能用 Modal 每月 US$30 Compute 嗎？ | 適合情境 |
| --- | --- | --- | --- |
| Kimi K3 Dedicated | GPU、CPU、Memory 運算資源 | 可以依適用規則抵扣 | 大量流量、隔離容量、可控 autoscaling |
| Kimi K3 Shared | Prompt、Cached Prompt、Completion tokens | 不可以 | 偶爾從 Codex 呼叫 K3 |
| 小型／中型模型 Dedicated | GPU、CPU、Memory 運算資源 | 可以依適用規則抵扣 | 把 Starter Compute 額度真正用在低頻實驗 |

所以我會把 Modal 每月 US$30 的用途重新定義成：

Codex
  ↓
MCP
  ↓
Modal
  ↓
Qwen、GLM 或其他小型／中型開源模型

這種才有機會真的把免費 GPU 額度玩出價值。

至於 Kimi K3，則走另一條：

Codex
  ↓
AI Consultant MCP
  ↓
Kimi K3 Shared Endpoint
  ↓
按 token 計費
  ↓
結果回 Codex

## MCP Budget Guard 要改成兩個錢包

我原本只設計 Compute Budget Guard，因為我以為所有成本都會從每月 US$30 裡扣。

現在看來，MCP 至少要分成兩個預算池：

| 預算池 | 控制內容 | 範例 |
| --- | --- | --- |
| Compute Budget | Dedicated Endpoint、Function、Container 的 GPU／CPU／Memory 成本 | US$27 警告、US$29 停止 |
| Token Budget | Shared Endpoint 的 Prompt、Cached Prompt、Completion 成本 | 另設每月 token 預算與單次上限 |

Compute Budget 的設定可以先維持：

| 項目 | 設定 | 用意 |
| --- | ---: | --- |
| 每月預算上限 | US$29 | 不把免費 Compute 用到最後一美元 |
| 安全警告線 | US$27 | 接近上限時提醒 |
| Modal 免費 Compute | US$30 | 目前方案假設，依官方頁面更新 |

每次 Codex 要呼叫外部模型前，MCP 可以先做：

1. 判斷這次要走 Shared 還是 Dedicated。
2. 讀取對應預算池的本月已使用量。
3. 讀取尚未完成任務的預估成本。
4. 加上這一次請求的預估成本。
5. 先做原子化的預算預約，再送出任務。
6. 接近警告線時提醒；達到上限時拒絕新的請求。
7. 任務完成後，用實際 token 或 Compute 成本結算預約。

如果目前帳面只用了 US$26.80，還沒超過 US$27，此時 Codex 同時送出三個任務，而 Modal 的帳務資料還沒反映這三個任務，三個請求可能都會得到「可以執行」。

所以 Budget Guard 不能只讀已完成帳務，還要把已送出但尚未結算的工作加入暫時預約：

目前已入帳用量
      ＋
進行中任務的預估用量
      ＋
這次請求的預估用量
      ＝
預計本月用量

此外，預約動作本身也要有鎖定或原子更新，避免多個並行請求同時讀到同一個舊數字。

Budget Guard 不是精準預言帳單的工具，而是一個讓「不小心超支」變得比較難發生的防線。

## 這次之後，我想做的已經不只是 Kimi K3 MCP

繞了一大圈之後，我反而更確定原本的方向沒有錯。

只是 Backend 選錯了。

我想做的其實不是：

「在 Modal 免費跑 Kimi K3。」

而是：

「讓 Codex 能在需要的時候，呼叫另一個 AI。」

第一版 MCP 可以先放：

| MCP 工具 | 用途 | 第一版限制 |
| --- | --- | --- |
| ask_kimi_k3 | 詢問 Kimi K3 一般問題 | 只回傳分析結果，不直接修改專案 |
| review_code | 請模型 Review 程式碼或 diff | 只傳必要內容，先遮罩 secrets |
| analyze_architecture | 分析架構、取捨與潛在風險 | 輸出建議，不自動採用決策 |
| get_modal_usage | 查詢本月 Compute 或 Token 用量 | 清楚標示資料時間與帳務延遲 |
| check_budget | 檢查對應預算池與進行中預約 | 在其他模型工具前先呼叫 |

但 MCP 不一定只接 Kimi K3。

未來更有趣的架構可能是：

Codex
  │
  └─ AI Consultant MCP
        │
        ├─ Kimi K3：高難度、長上下文
        ├─ Qwen：Coding 與一般分析
        ├─ GLM：Agent 與工具使用
        └─ DeepSeek Flash：便宜任務
        │
        └─ Modal Shared Endpoints

不同問題叫不同模型，便宜的工作交給便宜模型，真正困難的工作才叫 Kimi K3。

然後 MCP 統一處理：

- Token 統計
- 成本計算
- 月預算
- 模型 Routing
- Proxy Token
- Code Review
- 結果回傳
- 逾時與重試

這比只做一個 Kimi K3 MCP 有趣很多。

## 這次真正讓我有感的，不是 Kimi K3

而是我開始越來越確定一件事。

以前我們都在想：

> ChatGPT、Claude、Kimi、Gemini，我到底要選哪一個？

但 Agent、MCP、API 越成熟後，這個問題可能會慢慢變成：

> 我的主 Agent，需要哪些外部能力？

Codex 可以是主要工作的 Agent。

Kimi K3 不一定要取代它。Kimi 甚至不用是一個我每天打開的聊天網站。

它只需要是：

**Codex 工具箱裡的一個 Tool。**

需要它時才叫它，不需要就完全不用。

這才是我覺得 MCP 真正開始有意思的地方。

它不只是讓 AI 可以操作更多工具，而是你開始可以自己組裝一個 AI 的能力邊界。

搜尋是一個 Tool。

資料庫是一個 Tool。

瀏覽器是一個 Tool。

你的公司系統是一個 Tool。

甚至：

**另一個更強的 AI，也可以只是一個 Tool。**

至於 Modal 每個月那 US$30？

**Kimi K3 我是不敢再拿它養了。😂**

下個月我準備換一個小一點的模型，把這 30 美金真的榨乾。

## 我接下來會怎麼做？

這次實驗讓我的順序重新排過：

1. 先確認模型的 serving mode，是 Shared 還是 Dedicated。
2. 先看清楚 Compute Credits 與 Token Usage 是否使用同一套額度。
3. 先設定平台層級的 Workspace budget 與 spend limit。
4. 在 MCP 裡再加一層預算池、單次上限與進行中任務預約。
5. 先用小型／中型模型驗證 Modal 免費 Compute 的實際用途。
6. Kimi K3 改用 Shared Endpoint，先做低成本的單次請求測試。
7. 最後才把它接進 Codex，觀察什麼時候真的值得叫第二個模型。

真正好的多模型工作流，不是把所有模型都開起來，而是知道什麼任務該叫誰、要花多少錢、哪些資料可以送出去，以及什麼時候應該停止。

## 常見問答 (FAQ)

### Q1：Modal Starter 每月 US$30 免費 Compute，可以拿來使用 Kimi K3 Shared Endpoint 嗎？

不可以直接這樣理解。Modal 官方文件明確區分 Shared Endpoint 的 token 計費與方案內的 Compute Credits；Included Compute 不能拿來抵 Shared Endpoint 使用量。Shared Endpoint 應該另外設定 Token Budget，並以當下 Endpoint Usage 顯示的價格為準。

### Q2：為什麼我沒有送出 Prompt，還是產生了 US$34.16？

因為這次走的是 Dedicated Endpoint。8 張 B300 在 provisioning、載入模型、初始化推論環境的期間，就可能產生 GPU、Memory、CPU 與其他運算成本；模型還沒回答第一個 Prompt，不代表完全沒有使用計費資源。

### Q3：Spend limit 設成 US$0，為什麼還可能看到自付費用？

平台層級的 spend limit 是重要防線，但不是送出任務前的 MCP 交易鎖。正在執行的工作、帳務資料更新與停止動作可能存在時間差，因此還是要在 MCP 送出請求前做預算檢查、預約與拒絕新任務的控制。

### Q4：Shared Endpoint 一定要建立 Proxy Token 嗎？

Modal 目前的官方 Endpoints 文件說，Shared Endpoint 一律需要 Proxy Token，Dedicated Endpoint 預設也需要。Proxy Token 應留在 MCP Server 的 Secret 或環境變數中，不要放進文章、Git、Codex 對話或公開前端。

### Q5：偶爾從 Codex 呼叫 Kimi K3，應該選 Shared 還是 Dedicated？

以這次需求來看，Shared Endpoint 比較合理，因為 Modal 管理硬體與自動擴縮，你按 token 使用；Dedicated Endpoint 比較適合需要隔離容量、可控 autoscaling 或大量流量的服務。最後仍要以實際價格、延遲、並行限制與資料政策決定。

### Q6：那 Modal 每月 US$30 Compute 最適合拿來做什麼？

比較適合小型／中型 LLM、Whisper、Embedding、Reranker、OCR／Vision、TTS、FLUX／SDXL、Agent Sandbox、Batch GPU 工作，以及其他有工作才啟動的 GPU Function。重點是先估算模型載入與執行時間，不要只看「免費」兩個字。

## 參考資料

- [Modal Pricing](https://modal.com/pricing)
- [Kimi K3 Model Library](https://modal.com/library/moonshot/kimi-k3)
- [Modal Shared Endpoints 官方文件](https://modal.com/docs/guide/shared-endpoints#pricing)
- [Modal Endpoints 與 Proxy Token 文件](https://modal.com/docs/guide/endpoints)
- [Modal Budgets 文件](https://modal.com/docs/guide/budgets)

如果想先釐清 MCP、Skill 與 CLI 的分工，可以參考[AI 工具名詞全解析：一次搞懂 MCP、Skill 與 CLI 的差異與應用場景](/posts/ai-agent-tools-mcp-skill-cli/)。如果想看另一種 ChatGPT、MCP 與 Codex 的分工方式，也可以延伸閱讀[我把 ChatGPT 接上自己的開發台 MCP，AI Coding 開始變成一條「軟體開發流水線」](/posts/chatgpt-codex-ticket-workflow/)。
