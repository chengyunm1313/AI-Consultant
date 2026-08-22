---
title: Skill 之後，下一個 AI 開發者一定要懂的詞：Agent Harness
cover: /images/cover137.png
toc: true
categories:
  - 生成式AI應用
tags:
  - AI Agent
  - AI工具
  - Codex
date: 2026-08-22 14:42:30
subtitle: 從教 AI 怎麼做，到設計 AI 怎麼完成工作。
description: Skill 把 SOP 交給 AI，Agent Harness 則負責讓 Agent 讀懂專案、使用工具、執行指令、處理錯誤並持續完成任務。本文用 Codex 拆解 Model、Context、Tools、Skills 與權限機制，建立 AI 開發的新架構觀。
---

最近如果你有在使用 Codex、Claude Code 或其他 AI Coding Agent，應該會一直看到一個詞：**Skill**。

我自己這陣子也花了不少時間研究 Skill，因為它解決了一個很重要的問題：怎麼把「我做事情的方法」交給 AI。

以前我們寫 Prompt，後來開始把 SOP、規則、範例與檢查標準整理成 Skill。這樣 AI 不只是知道我們想要什麼，也開始知道一件事情應該怎麼做。

但研究 Skill 到後來，我發現下一個同樣關鍵的概念已經浮現出來了：**Agent Harness**。

本文把 Agent Harness 當成一個工作架構來討論。這個詞在不同社群裡未必有完全一致的正式定義，以下採用的意思是：讓 Agent 能夠取得資訊、使用工具、執行任務、處理失敗並在權限邊界內持續工作的整套環境與機制。

## Skill 解決「怎麼做」，Harness 解決「怎麼工作」

假設今天我要一個 AI 幫我開發網站，我可以寫一個 frontend Skill，告訴它：

- UI 應該怎麼設計
- React 元件怎麼拆分
- Accessibility 怎麼檢查
- 測試怎麼執行
- 完成前要驗收哪些事情

這些內容是在教 AI：「怎麼把前端做好。」這就是 Skill。

但接下來還有一連串問題：

- AI 要怎麼讀取我的專案？
- 它要怎麼修改檔案與執行指令？
- 哪些工具可以使用？
- 執行失敗後要不要重試？
- 做到一半要怎麼保留狀態？
- 哪些事情可以自行完成，哪些事情一定要先詢問？

這些就不是單一 Skill 可以解決的問題。讓 Agent 真正「工作起來」的環境、流程與控制機制，就是 Agent Harness 所處理的範圍。

## 模型是大腦，Skill 是 SOP，Harness 是整間公司

我現在會用下面這個方式理解 AI Agent：

`Model → Harness → Skills → Tools / MCP → Product`

如果把 AI 想成一位員工：

| 元件 | 可以怎麼理解 | 主要作用 |
| --- | --- | --- |
| Model | 大腦 | 理解、推理與解決問題 |
| Harness | 工作環境與管理制度 | 提供上下文、流程、權限、狀態與錯誤處理 |
| Skills | SOP 與專業方法 | 告訴 Agent 某一類工作應該怎麼完成 |
| Tools / MCP | 工具與外部連接 | 讓 Agent 搜尋資料、操作檔案、呼叫 API 或使用服務 |
| Product | 最終工作場景 | 把前面的能力組合成使用者真正需要的產品 |

因此，Harness 決定的不是某一個專業步驟，而是這個 AI 能不能從「想」走到「做」，再從「做」走到「驗收完成」。

## 為什麼同一個模型，在不同工具裡差這麼多？

這是很多人使用 AI Coding 工具後都會遇到的疑問：明明底層可能使用能力相近的模型，為什麼放進不同 Coding Agent，體感卻可以差很多？

原因之一就在 Harness。

我們實際使用的從來不只是 Model，而是：

`Model × Context × Tools × Skills × Harness`

你怎麼把檔案提供給它、怎麼讓它搜尋程式碼、怎麼讓它執行 Shell、怎麼把錯誤回饋給它、怎麼讓它修改後重新測試，以及怎麼讓它在長任務裡維持方向，都會直接影響最後結果。

所以未來比較 AI Agent 時，可能不能只問：「它用哪一個模型？」還要開始問：「它的 Harness 怎麼設計？」

## 為什麼 Codex 值得研究？

OpenAI 的 [Codex GitHub repository](https://github.com/openai/codex) 是一個值得研究的 Coding Agent 實作樣本。

如果只把它看成「一個 AI Coding CLI」，可能會錯過更值得觀察的部分：一個模型是如何被組織成可以在專案裡工作的 Agent。

可以從以下幾個方向閱讀它的設計：

- Agent 的執行流程
- Context 如何取得與整理
- 工具呼叫與結果回傳
- Shell 與檔案系統操作
- Sandbox、權限與 Approval
- MCP 與 Skills 的整合
- 長任務中的狀態與錯誤處理

這些能力加在一起，才構成一個真正可以工作的 Agent。模型本身很重要，但它只是整個系統中的一層。

## Agent Harness 不只適合寫程式

Agent Harness 的思維不一定只能拿來做 Coding Agent。只要一項工作需要多步驟執行、外部工具、領域規則與可驗收的結果，就可以思考如何組裝自己的工作環境。

| 應用方向 | Harness 組合方式 | 可能的產品形態 |
| --- | --- | --- |
| SEO Agent | Agent Harness＋SEO Skill＋Search Console／GA4 工具＋網站資料 | SEO 分析與優化助手 |
| Google Ads Agent | Agent Harness＋投放策略 Skill＋廣告工具＋公司 SOP | AI 投放助理 |
| 標案 Agent | Agent Harness＋標案 Skill＋政府規範＋PDF／Excel／Drive 工具 | 企業內部標案助手 |

這時候我們做的就不只是聊天機器人，而是在替不同工作組裝不同的 AI 員工。

## Skill 其實只是其中一層

一開始很容易以為：「只要把 Skill 寫好，AI 就會變專業。」這句話只說對了一半。

Skill 解決的是：

> AI 知不知道這件事情應該怎麼做？

Harness 解決的則是：

> AI 有沒有能力沿著這套方法一路做到完成？

一個 Skill 即使寫得很完整，如果 Agent 沒有讀取檔案的能力、沒有適合的工具、沒有錯誤回饋、沒有驗收流程，最後仍可能只能產生一段看起來合理的回答，而不是完成一項工作。

反過來說，Harness 也不能取代 Skill。沒有專業方法與檢查標準，Agent 可能很會操作工具，卻不知道什麼才是好的結果。

## AI 產品的競爭正在改變

前幾年的 AI 產品，很多競爭集中在 Prompt：誰的 Prompt 寫得好，誰的結果看起來比較漂亮。

後來大家開始做 RAG、Knowledge Base 與 Tools，接著又出現 Skills、MCP 與 Agent。下一階段的競爭，很可能會落在如何把這些元件組成一套穩定工作的系統：

`Model + Harness + Skills + Tools + Domain Knowledge + Product UX`

模型會持續變強，工具協定也會逐漸標準化，Skill 甚至可能大量開源。最後真正拉開差距的，反而可能是你怎麼替 AI 設計工作方式，以及能不能把結果穩定交付給使用者。

## 開始研究 Agent Harness，可以先問這五個問題

如果你想開始設計自己的 Agent Harness，可以先從這五個問題開始：

1. Agent 需要哪些專案資料與 Context？
2. 它需要讀寫哪些檔案、資料庫或外部服務？
3. 哪些工具可以自動使用，哪些操作需要 Approval？
4. 指令失敗、工具回傳錯誤或結果不完整時，應該如何處理？
5. 任務完成的驗收條件是什麼，誰負責最後確認？

這些問題會把討論從「我要一個會聊天的 AI」推進到「我要一個可以完成工作的系統」。

## 結語：從教 AI 回答，到設計 AI 完成工作

如果你最近才剛開始研究 Skill，下一個關鍵字可以直接記起來：**Agent Harness**。

我們正在從「教 AI 怎麼回答問題」，進入「設計 AI 怎麼完成工作」的階段。

當大家都能取得差不多的模型、MCP，甚至差不多的 Skill 時，真正重要的就會變成：誰能替 AI 設計出更好的工作方式，讓它在清楚的邊界裡持續執行、修正與交付結果。

延伸閱讀：

- [從提示詞到 Skill：5 個實務做法打造高效率 AI 自動化工作流](/posts/ai-prompt-to-skill-workflow/)
- [AI 工具名詞全解析：一次搞懂 MCP、Skill 與 CLI 的差異與應用場景](/posts/ai-agent-tools-mcp-skill-cli/)
- [GPT-5-Codex Prompting 完全指南：從新手入門到情境實戰](/posts/gpt5-codex-complete-prompting-guide/)

## 常見問答 (FAQ)

### Q1：Agent Harness 是什麼？

Agent Harness 是讓 AI Agent 能在真實環境中工作的整套環境與機制，通常包含 Context 管理、工具呼叫、檔案與 Shell 操作、狀態保存、錯誤處理、權限與 Approval，以及任務驗收流程。

### Q2：Skill 和 Agent Harness 有什麼差別？

Skill 教 Agent 某一類工作應該怎麼做，像是 SOP 或專業方法；Agent Harness 則負責讓 Agent 取得資料、使用工具、執行步驟、處理失敗並在權限邊界內持續完成任務。

### Q3：為什麼同一個模型放在不同 AI Agent 裡，效果可能不同？

因為最後結果不只由模型決定，也受到 Context、Tools、Skills 與 Harness 影響。檔案怎麼提供、工具怎麼呼叫、錯誤怎麼回饋、權限怎麼控制，都可能改變 Agent 的工作品質。

### Q4：設計 Agent Harness 時，最先要處理什麼？

最先要定義任務邊界、可使用的資料與工具、需要人工核准的操作，以及明確的完成與驗收條件。這些規則確定後，再決定要加入哪些 Skills 與模型能力。

### Q5：Agent Harness 只能用來開發網站或程式嗎？

不只能。SEO 分析、廣告投放、標案整理等工作，只要具備多步驟流程、外部工具、領域規則與可驗收結果，都可以用 Agent Harness 加上對應的 Skill 與資料來源來設計。
