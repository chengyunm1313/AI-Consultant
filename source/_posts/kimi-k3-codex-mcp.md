---
title: "每月免費 30 美金，我打算把 Kimi K3 接進 Codex 當第二大腦"
cover: /images/cover179.png
toc: true
categories:
  - AI自動化
tags:
  - AI Agent
  - Codex
  - AI工具
date: 2026-09-17 15:39:42
subtitle: "把 Modal 的 Compute 額度變成 Codex 可以呼叫、又有預算上限的 Kimi K3 外部顧問。"
description: "Modal Starter 每月 US$30 免費 Compute，能不能變成 Codex 裡的 Kimi K3 第二大腦？本文整理 Codex、MCP、Modal 與 Budget Guard 的整合構想，並說明如何在預算內進行多模型協作。"
---

最近看到 Modal 的方案，有一件事讓我很有興趣。

它的 Starter 免費方案，不是只有註冊時送一次試用金，而是每個月都有 US$30 的免費 Compute 額度。方案名稱、額度與計費條件可能會調整，所以下面先把這個數字當成我目前想驗證的實驗前提；真正使用前，還是要以當下的官方方案與帳務規則為準。

我第一個想到的不是拿來生圖。

而是：**能不能把這 30 美金，變成 Codex 裡面的另一顆大腦？**

我最近想測的就是 Kimi K3。

依我目前看到的介紹，Kimi K3 是 Moonshot AI 推出的 MoE 模型，總參數規模達 2.8T，每次推論約啟動 104B 參數，支援 1M context，能力方向也明顯朝 Coding、Reasoning、Knowledge Work 與長時間 Agent 任務發展。這些模型規模、能力與部署條件會隨版本和方案變動，本文把它視為一次工作流實驗，不把它寫成永久的模型排名。

問題是，這種規模的模型根本不是「租一張 GPU 自己架起來」那麼簡單。

剛好 Modal 已經提供 Kimi K3 的部署方式，所以我現在想做一個實驗：

```text
Codex → MCP → Modal → Kimi K3
```

平常還是在 Codex 工作。但是當我遇到比較複雜的架構問題、想做第二模型 Code Review，或想知道另一個強模型會怎麼解這個問題時，我不需要離開 Codex。

我只要直接跟 Codex 說：

> 這個問題再叫 Kimi K3 看一次。

Codex 就透過我自己做的 MCP，把問題送到 Modal 上的 Kimi K3，再把結果帶回目前的工作流程。

等於是：

> Codex 是主腦，Kimi K3 是外部顧問。

而且這個顧問每個月還有一筆免費的 GPU 額度可以使用。

## 為什麼我想在 Codex 裡叫另一個模型？

現在遇到複雜問題時，我們通常會在不同聊天網站之間切換：開一個模型問架構，再把內容複製到另一個模型做 Review，最後把結論帶回正在工作的 Agent。

這個流程不是做不到，只是中間一直需要人負責搬運 Context。

如果 Kimi K3 可以透過 MCP 變成 Codex 的一項工具，工作方式就會變成：

```text
我在 Codex 描述問題
        ↓
Codex 判斷是否需要第二模型
        ↓
MCP Server 檢查權限、用量與預算
        ↓
Modal 啟動 Kimi K3
        ↓
結果回到 Codex，繼續規劃、實作或驗證
```

這裡的重點不是「Kimi K3 一定比 Codex 強」，也不是要讓兩個模型搶著寫同一份程式。

我比較想測的是：**當另一個模型變成可以被主 Agent 呼叫的外部顧問，第二個觀點能不能更自然地進入原本的工作流？**

它可以用在幾個情境：

- 複雜架構決策：請另一個模型獨立整理取捨、風險與替代方案。
- 第二模型 Code Review：把必要的 diff 與背景送出去，找出可能忽略的問題。
- 長 Context 分析：把較長的規格、文件或程式脈絡交給適合的模型處理。
- 結果交叉比對：讓兩個模型分別分析，再由 Codex 整理差異與下一步。

最後要不要採用，仍然要回到測試結果、專案脈絡與人的判斷，不是多叫一個模型就會自動得到正確答案。

## Codex、MCP、Modal 與 Kimi K3 各自負責什麼？

這條工作流裡，四個元件的責任其實不一樣：

| 元件 | 角色 | 主要責任 |
| --- | --- | --- |
| Codex | 主 Agent／主腦 | 理解任務、決定何時呼叫外部顧問、整合結果並繼續執行 |
| MCP Server | 連接層與守門員 | 定義工具、整理輸入輸出、檢查權限、用量與預算 |
| Modal | Serverless GPU 執行環境 | 有任務時啟動模型所需的運算資源，完成後停止或回收 |
| Kimi K3 | 外部模型顧問 | 提供第二個分析、Review 或長 Context 處理結果 |

所以 MCP 並不是「把 Kimi K3 變強」的魔法，也不是另一個模型本身。它比較像是把外部能力包裝成主 Agent 可以理解、可以呼叫、也可以限制的工具介面。

如果你想先釐清 MCP、Skill 與 CLI 的分工，可以參考[AI 工具名詞全解析：一次搞懂 MCP、Skill 與 CLI 的差異與應用場景](/posts/ai-agent-tools-mcp-skill-cli/)。如果想看另一種 ChatGPT、MCP 與 Codex 的分工方式，也可以延伸閱讀[我把 ChatGPT 接上自己的開發台 MCP，AI Coding 開始變成一條「軟體開發流水線」](/posts/chatgpt-codex-ticket-workflow/)。

## 為什麼 Modal 適合拿來做這種實驗？

如果只是偶爾需要 Kimi K3，我不太想為了它維護一台長時間開著的 GPU Server。

理想中的使用方式是：

```text
有任務 → 啟動 Modal GPU
        ↓
載入 Kimi K3 並執行推論
        ↓
回傳結果給 MCP
        ↓
任務完成 → 停止或回收運算資源
```

這種 Serverless GPU 模式，把「我想試一個大模型」和「我必須長期養一台 GPU 主機」拆開了。沒有任務時，不需要讓 GPU 持續閒置；有任務時，才依實際 Compute 使用量產生費用。

不過，這不代表成本只看推論本身。冷啟動、模型載入、儲存、網路傳輸、閒置時間、並行任務與平台計費規則，都可能影響最後的帳單。Modal 的 US$30 免費額度也不是永久不變的承諾，實驗前要重新確認當下條款。

這和我之前思考的雲端 GPU 租用很像：重點不只是單價，而是「我租到一個服務，還是一台可以自己控制的遠端工作環境？」可以參考[MiniMax H3 第三條路：先租 GPU，還是該買 RTX 5090？](/posts/minimax-h3-gpu-rental/)裡對控制權、環境管理與使用成本的拆解。

## Budget Guard：免費額度也要自己設安全線

Modal Starter 每月提供 US$30 Compute，不代表我希望它跑到 30 美金之後還繼續刷下去 😂

所以 MCP 中間不能只有一個「呼叫 Kimi K3」工具，還要有一個 Budget Guard。

我目前想先用這組設定：

| 項目 | 設定 | 用意 |
| --- | ---: | --- |
| 每月預算上限 | US$29 | 不把免費額度用到最後一美元，保留緩衝 |
| 安全警告線 | US$27 | 接近上限時提醒，避免無感消耗 |
| Modal 免費額度 | US$30 | 目前實驗假設，實際依當下方案為準 |

每次 Codex 要呼叫 Kimi K3 前，MCP 可以先做幾件事：

1. 查詢本月已使用的 Compute 金額。
2. 讀取尚未完成任務的預估成本。
3. 加上這一次任務的成本估算，計算預計總額。
4. 還沒碰到警告線，就正常執行。
5. 接近 US$27，回傳警告，但仍可依設定執行。
6. 達到 US$29，直接拒絕新的 Kimi K3 任務。

概念上可能會像這樣：

```typescript
const MONTHLY_CAP_USD = 29;
const WARNING_LINE_USD = 27;
const FREE_CREDIT_USD = 30;

async function checkBudget(estimatedCostUsd: number) {
  const usage = await getModalUsageThisMonth();
  const pending = await getPendingReservations();
  const projectedUsd =
    usage.computeUsd + pending.computeUsd + estimatedCostUsd;

  if (projectedUsd >= MONTHLY_CAP_USD) {
    return {
      allowed: false,
      reason: "本月預估用量已達到 Budget Guard 上限",
      projectedUsd,
    };
  }

  return {
    allowed: true,
    warning: projectedUsd >= WARNING_LINE_USD,
    projectedUsd,
    freeCreditUsd: FREE_CREDIT_USD,
  };
}
```

這段只是 Budget Guard 的設計示意，不假設 Modal 已經提供名為 `getModalUsageThisMonth` 或 `getPendingReservations` 的現成 API。實際要查哪一種帳務資料、資料多久更新一次，以及 Compute 金額如何換算，都要依 Modal 當下提供的介面實作。

### 為什麼一定要計算「尚未入帳」的任務？

這是我覺得最容易被忽略的地方。

假設目前帳面只用了 US$26.80，還沒超過 US$27。此時 Codex 同時送出三個任務，而 Modal 的帳務資料還沒反映這三個任務的成本。三個請求可能都在檢查時得到「可以執行」，最後卻一起把預算撞破。

所以 Budget Guard 不能只讀已完成帳務，還要把已送出但尚未結算的工作加入暫時預約：

```text
目前已入帳用量
      ＋
進行中任務的預估用量
      ＋
這次請求的預估用量
      ＝
預計本月用量
```

此外，預約動作本身也要有鎖定或原子更新，避免多個並行請求同時讀到同一個舊數字。任務完成後，再用實際用量結算預約；任務失敗或取消時，則依實際狀態釋放或調整預約。

Budget Guard 不是精準預言帳單的工具，而是一個讓「不小心超支」變得比較難發生的防線。

## 我會先做哪幾個 MCP 工具？

第一版不需要把所有功能一次做完，我想先放這幾個工具：

| MCP 工具 | 用途 | 第一版的限制 |
| --- | --- | --- |
| `ask_kimi_k3` | 詢問 Kimi K3 一般問題 | 只回傳分析結果，不直接修改專案 |
| `review_code` | 請 Kimi K3 Review 程式碼或 diff | 只傳必要內容，先遮罩 secrets |
| `analyze_architecture` | 分析架構、取捨與潛在風險 | 輸出建議，不自動採用決策 |
| `get_modal_usage` | 查詢本月 Compute 用量 | 清楚標示資料時間與可能的帳務延遲 |
| `check_budget` | 檢查剩餘預算與進行中預約 | 在前面三個工具執行前先呼叫 |

其中前三個是模型能力，後兩個是控制能力。真正讓這條工作流可以放心使用的，可能不是「能不能問到 Kimi K3」，而是 MCP 是否能把權限、成本、逾時、錯誤與資料邊界一起管理好。

## 這個實驗真正難的，不是把模型叫起來

把請求送到 Modal、得到一段回覆，可能只是第一個可見的成功條件。要變成每天可以使用的工具，還需要處理幾個問題：

- **冷啟動與模型載入時間：** 每次啟動都要重新載入多少內容？是否需要保留 warm instance？
- **輸入資料範圍：** Code Review 是否會把 API key、客戶資料或私有程式碼送到外部模型？
- **輸出格式：** 回覆要不要固定成摘要、問題清單、嚴重程度與建議修正，讓 Codex 能繼續使用？
- **失敗與逾時：** Modal 啟動失敗、模型載入超時或網路中斷時，Codex 要收到什麼訊息？
- **重試策略：** 重試是否會重複計算費用？哪些錯誤可以重試，哪些應該直接停止？
- **並行控制：** 多個任務同時啟動時，預算預約和實際資源是否仍然一致？
- **權限界線：** Kimi K3 的工具只能讀取資料，還是可以觸發檔案修改、部署或其他高影響操作？

這也是為什麼我不會把「接上 MCP」直接等同於「完成多模型 Agent」。MCP 解決的是連接與工具介面，資料政策、授權、記錄、成本與驗證仍然要由整個 Agent Harness 負責。

## 從「我要訂閱哪一個 AI」變成「我的 Agent 需要哪些能力」

以前我們會想：

> ChatGPT、Claude、Kimi、Gemini，我到底要選哪一個？

但 MCP、API 與 Agent 架構越成熟之後，我越來越不覺得一定要用訂閱方案做單選題。

未來比較像是：

```text
一個主要工作的 Agent
        ＋
幾個可以被它呼叫的外部模型與服務
        ＋
清楚的權限、成本與驗證規則
```

Codex 負責主要開發，需要超長上下文分析時叫 Kimi K3；需要另一個模型做 Code Review，也叫 Kimi K3；碰到架構決策，讓兩個模型分別分析，再由 Codex 整理差異。

模型開始從「我要打開哪一個聊天網站」，變成 Agent 工具箱裡的一個 Tool。

這種分工也和我之前整理的 Agent Harness 觀念接得上：模型只是其中一個元件，真正影響工作能不能穩定完成的，還包括 Context、Tools、Memory、Test、權限與 Review Loop。

## 我打算怎麼把這個 Kimi K3 MCP 做出來？

我的實驗順序會先從小範圍開始：

1. 在 Modal 上確認 Kimi K3 可以穩定完成一次推論，記錄啟動、載入與執行成本。
2. 先做最小版本的 `ask_kimi_k3`，把輸入、輸出、錯誤與逾時格式固定下來。
3. 加入 `review_code` 與 `analyze_architecture`，測試不同 Context 長度和任務類型。
4. 實作 `get_modal_usage`、`check_budget` 與進行中任務的預算預約。
5. 測試並行請求、帳務延遲、任務取消、模型啟動失敗與重試情境。
6. 最後才把它接進 Codex，觀察什麼時候真的值得叫第二個模型。

如果最後真的能穩定使用，我等於不是多訂閱了一個 AI，而是把 Modal 每個月提供的 US$30 Compute，變成 Codex 裡面一位有使用額度上限的 Kimi K3 顧問。

這也是我最近對 MCP 越來越有感的一個地方。

MCP 真正有意思的地方，可能不只是「讓 AI 可以操作工具」。而是：**你可以開始自己決定，一個 AI 到底要擁有哪些外部能力。**

甚至連「另一個 AI」，都可以只是它的一個工具。

## 常見問答 (FAQ)

### Q1：Modal Starter 每月 US$30 免費 Compute，代表可以無限制使用 Kimi K3 嗎？

不代表。US$30 是本文目前實驗所採用的方案假設，實際額度、適用資源、計費方式與超額規則都可能變動，也不一定涵蓋儲存、網路或其他費用。開始部署前應重新確認 Modal 當下的官方方案與帳務頁面。

### Q2：Kimi K3 可以直接在自己的電腦或一張 GPU 上執行嗎？

不能只看「每次推論約啟動 104B 參數」就判斷硬體需求。模型總規模、精度、量化方式、模型載入、記憶體、推論框架與實際部署設定都會影響需求；Modal 的部署方式是抽象化基礎設施，不代表任何個人電腦都能直接執行。

### Q3：為什麼每月免費額度是 US$30，Budget Guard 卻只設定 US$29？

US$29 是刻意保留的安全緩衝，用來應對帳務延遲、成本估算誤差、並行中的任務，以及可能不在 Compute 主額度內的費用。它可以降低超支風險，但不是保證帳單永遠不會超過 US$30。

### Q4：接上 MCP 後，Codex 就會自動知道什麼時候該呼叫 Kimi K3 嗎？

不會自動完成。仍然需要建立 MCP Server、定義工具與輸入輸出格式、設定權限與錯誤處理，並在 Codex 中正確註冊。至於何時呼叫第二模型，也要透過工具說明、工作規則或人工指示建立清楚的判斷邊界。

### Q5：把程式碼送到 Modal 上的 Kimi K3 Review，有哪些資料安全問題？

應只傳送完成任務所需的最小 Context，先遮罩 API key、Token、個人資料、客戶資料與其他 secrets，並確認資料會被誰保存、保存多久及如何刪除。Code Review 能不能外送，不是模型能力問題，而是專案的資料政策與權限決策。
