---
title: "我把 ChatGPT 接上自己的開發台 MCP，AI Coding 開始變成一條「軟體開發流水線」"
cover: /images/cover172.png
toc: true
categories:
  - AI自動化
tags:
  - AI Agent
  - ChatGPT
  - Codex
date: 2026-09-14 15:10:03
subtitle: 把需求分析、開票、實作與 Review 分工，讓 AI Coding 從單一對話走向可驗收的開發流程。
description: 把 ChatGPT 接上開發台 MCP 後，可以由它負責討論、規劃與 Review，再開 Ticket 交給 Codex 實作。本文拆解 ChatGPT、MCP、Codex 與 Agent Harness 如何分工，以及如何用結構化 Ticket 和驗收條件組成可重複的 AI Coding 流程。
---

最近我開始把 ChatGPT 接進原本提供給 Codex、Claude 使用的開發台 MCP。最有意思的地方，不是讓 ChatGPT 跟 Codex 搶著寫程式，而是把需求討論、工作規劃、程式實作與 Review 拆成不同角色。

我可以先讓 ChatGPT 查看開發台允許提供的專案脈絡，協助分析問題、整理風險與驗收條件，再透過 MCP 建立 Ticket，交給 Codex 接手。完成後，再把差異與測試結果交回來 Review。

以這個工作方式來看，分析和由 ChatGPT 發起的 MCP 操作使用 ChatGPT 端的可用額度，Codex 的工程執行則在 Codex 的工作環境中進行。乍看之下，好像終於能把 ChatGPT 每月訂閱用得更完整了 😂。但額度和費用會依方案、整合方式與工具呼叫而變化，這不是接上 MCP 就一定省錢的保證。

真正值得注意的，是 AI Coding 開始從「一個 Agent 包辦所有事」，走向「一組 Agent 按照分工接力完成工作」。

## ChatGPT 不一定要寫程式，也能參與開發

使用 Codex 時，我們常把需求理解、讀取 Context、規劃、修改、測試、Review 和下一步討論，全塞在同一個 Agent 裡。專案越大，耗費的時間和額度往往不只來自寫程式，也包括理解專案、追蹤進度、檢查結果和重新安排工作。

如果有一套開發台 MCP 能提供必要的專案狀態、Session 摘要或 Ticket 操作，ChatGPT 就可以先負責需要大量溝通和判斷的工作：釐清需求、找出風險、拆出可執行的工作，再把任務交給 Codex。

以一次長時間的工作樹合併任務為例，當 Codex 已經執行很久，我不一定要繼續在同一個 Agent 裡討論下一步。我可以請 ChatGPT 根據開發台提供的狀態，檢查目前結果、列出可改善處與潛在風險，再整理成一張 Codex 能接手的票。

這樣一來，ChatGPT 的價值不在於「代替 Codex 寫另一份程式」，而在於把模糊的討論轉成清楚、有優先順序、可以驗收的工作。

## 把不同角色接成一條開發流程

如果把工作拆開來看，分工可以是：

- **ChatGPT：需求分析與 Review。** 協助釐清問題、檢查現況、拆解任務、補充驗收條件，並Review Codex 回報的結果。
- **開發台 MCP：提供連接與操作能力。** 依照開發台實際設計，讀取被允許的 Context、建立或更新 Ticket、傳遞執行結果與工作狀態。
- **Codex：工程實作與驗證。** 根據 Ticket 修改程式、執行測試，並回報差異、失敗項目和未解風險。
- **人：決定優先順序與重要操作。** 確認需求、核准高影響變更，決定是否 Commit、Merge 或關閉 Ticket。

整體流程就會像這樣：

```text
人提出需求
  ↓
ChatGPT 取得允許使用的專案脈絡並分析
  ↓
MCP 建立 Ticket，記錄工作範圍與驗收條件
  ↓
Codex 實作並執行測試
  ↓
開發台回報差異、測試結果與阻礙
  ↓
ChatGPT Review，整理下一步
  ↓
人確認是否 Commit、Merge 或關票
```

這條流程不代表每個 MCP 都有 Session、Ticket 或 Git 管理功能。MCP 規格提供的是連接模型應用與外部能力的通用介面；例如伺服器可以依實作提供可呼叫的 Tools、可讀取的 Resources 和 Prompts。開發台是否保存狀態、能不能開票或執行 Git 操作，仍要看實際 MCP Server 和周邊系統怎麼設計。[MCP 官方規格：Server Features](https://modelcontextprotocol.io/specification/draft/server/index)

因此我會把 MCP 想成這條流程的「連接層」，而不是整套開發管理系統本身。Session 保存、Ticket 欄位、權限控管、測試流程與工作狀態，都是 Harness 和開發台需要另外規劃的部分。

## Agent Harness 讓模型有地方工作

這個分工也呼應我最近一直在研究的觀念：**Agent = Model + Harness**。

大家常比較 GPT、Claude、Gemini 或 Codex 的模型能力。模型當然重要，但如果整條流程、專案脈絡和驗收方式都綁在單一模型裡，每次換模型都可能得重新建立工作方式。

如果自己的開發 Harness 已經整理好 Context、Tools、Ticket、Memory、Test、Git 和 Review Loop，模型就比較像其中一個可以調度的元件。今天可以 ChatGPT 規劃、Codex 執行；明天也可以換成另一個模型負責分析或 Review，再由適合的 Agent 實作。

這種可替換性不是插上另一個模型就會自動發生。不同模型可用的工具、輸入輸出格式和權限都可能不同，還是要有穩定的工作契約：任務怎麼交接、結果怎麼回報、測試如何判斷通過、失敗時誰要處理。

如果你想延伸理解 Harness 在 AI 開發流程中的位置，也可以閱讀[從 Skill 到 Agent Harness：讓 AI 從知道怎麼做，走到真正完成工作](/posts/skill-to-agent-harness/)；MCP、Skill 與 CLI 的分工則可參考[AI 工具名詞全解析](/posts/ai-agent-tools-mcp-skill-cli/)。

## 把 Ticket 寫成 Agent 能接手的工作

Ticket 是這條流程能不能穩定運作的關鍵。若只有一句「幫我改善這段程式」，接手的 Agent 仍要猜背景、範圍和完成標準。每張票可以固定包含：

```yaml
ticket_id: 自動產生

title: 清楚描述要交付的結果
background: 相關的專案脈絡
problem: 目前遇到的問題
priority: 優先級
affected_files: 已知的相關檔案
dependencies: 前置工作或相依項目
acceptance_criteria:
  - 可明確驗收的條件
test_requirements:
  - 完成前必須執行的檢查
review_notes: 已知風險、限制或 Review 重點
```

其中 `affected_files` 可以列出已知範圍，但不應阻止 Codex 在檢查專案後指出還有其他必要檔案。真正重要的是 `problem` 說得清楚，`acceptance_criteria` 可以驗收，`test_requirements` 也符合專案實際狀況。

當 Ticket 結構固定，ChatGPT 就比較能把分析結果轉成工程任務；Codex 也能根據明確的交付條件回報完成、未完成與阻礙，而不是只回一句「已處理」。

## 下一場競爭可能是誰的 Harness 更完整

當多個 Agent 開始分工，真正需要設計的就不只 Prompt，還包括它們共同使用的工作環境：

- Agent 能讀到哪些 Context，哪些資料不能取用？
- 誰能建立 Ticket、修改程式或執行 Git 操作？
- 測試失敗時，系統如何保留輸出並回報阻礙？
- 每個階段的完成條件是什麼，由誰 Review？
- Agent 交接時，下一位能否知道前一位做過什麼、為什麼這樣做？

當 MCP 工具可以建立或改變外部資料時，也要設計清楚的權限與人工確認邊界。不要只因為模型「做得到」，就讓所有操作都自動執行。

這些環節加起來，才是 Agent Harness 真正提供的工作條件。若系統有持續的 Context、明確的 Ticket、可執行的測試與可靠的回報方式，就能讓模型專注在任務，而不是每一輪都重新猜專案發生了什麼事。

## 從一張結構化 Ticket 開始

如果你也想嘗試這種 AI Coding 工作方式，可以先挑一個範圍小、容易驗收的任務，整理出背景、問題、優先順序、驗收條件和測試要求，再觀察 ChatGPT 與 Codex 分工後有哪些地方仍需要人工補充。

接著再逐步加入專案 Context、Ticket 狀態、工具權限與 Review 流程。先讓交接清楚、失敗能回報，再決定哪些步驟適合自動化。

AI Coding 正從「我跟一個 AI 一直聊天，直到網站做完」，走向「我在管理一條由多個 AI Agent 組成的軟體開發流程」。ChatGPT 不一定要負責寫程式，Codex 也不必負責想完所有事情；把規劃、執行、測試和 Review 拆開，再讓 Harness 接得住每次交接，才會真正累積成自己的 AI 開發台。

## 常見問答 (FAQ)

### Q1：在這種 AI Coding 流程裡，ChatGPT 和 Codex 怎麼分工？

ChatGPT 可以負責需求討論、專案分析、Ticket 規劃與結果 Review；Codex 可以接手明確定義的實作與測試工作。實際分工仍取決於各自可讀取的 Context、可用工具和權限。

### Q2：MCP 會自動替我保存 Session 或建立 Ticket 嗎？

不會。MCP 提供模型應用與外部 Tools、Resources、Prompts 溝通的介面；Session 保存、Ticket 系統與 Git 操作必須由實際 MCP Server 或周邊開發台提供。

### Q3：把規劃交給 ChatGPT，能保證省下 Codex 額度嗎？

不能保證。不同產品方案、帳戶額度、工具呼叫方式和任務執行環境都會影響使用量。這種分工可以把分析與工程執行分開觀察，但是否省錢要依自己的實際方案和用量判斷。

### Q4：想開始使用多個 AI Agent 協作，第一步該做什麼？

先挑一個小型、可驗收的任務，寫清楚背景、問題、完成條件與測試要求，再讓不同 Agent 接力執行。確認工作交接和失敗回報可靠後，再逐步擴充工具權限、Ticket 狀態與自動化程度。
