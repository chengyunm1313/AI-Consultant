---
title: 20 萬 Stars 的 DeepSeek Harness：Vibe Coding 下一場戰爭可能換戰場了
cover: /images/cover147.png
toc: true
categories:
  - AI自動化
tags:
  - AI Agent
  - AI工具
  - Vibe Coding
date: 2026-08-29 00:16:31
subtitle: 從 Model 競爭走向 Agent Runtime 競爭，理解 DSH 如何用 Plugin、Workflow 與 Agent Teams 組出可工作的 AI 團隊。
description: DeepSeek Harness（DSH）把 Model、Tools、Skills 與 Agent Loop 組成可插拔 Runtime，支援 Dynamic Workflow、Agent Teams 與 Trajectory。本文解析 Vibe Coding 為何從比模型走向比 Harness。
---

過去一年玩 Vibe Coding，大家最常討論的問題幾乎都是：GPT、Claude、Gemini、DeepSeek，到底誰寫程式最強？哪個模型 Benchmark 比較高？哪個模型 Context 比較大？哪個模型比較不容易把專案改爛？

但最近我越來越覺得，Vibe Coding 的下一場戰爭，可能已經不只是 Model，而是誰能替模型造出一套更強的「Agent 身體」。

最近 DeepSeek 開源了一個非常值得研究的專案：**DeepSeek Harness（DSH）**。GitHub 已經突破 20 萬 Stars，更有意思的是，它現在甚至還只是 Developer Preview。

官方給了一個我很認同的公式：

> **Agent = Model + Harness**

模型是大腦；Harness 則是身體。

> 本文沿用初稿提供的「20 萬 Stars」與 Developer Preview 觀察。GitHub Stars、功能與架構都可能快速變動，實際使用時仍應以 [DeepSeek Harness 官方 Repo](https://github.com/deepseek-ai/deepseek-harness) 的最新內容為準。

## 過去我們在比 Model，接下來可能開始比 Harness

模型很重要，但模型能力不等於 Agent 能力。

Model 決定的是：

- 會不會推理。
- 會不會寫程式。
- 能不能理解需求。
- 能不能在上下文中形成合理判斷。

Harness 決定的卻是另一組問題：

- Agent 可以看到什麼？
- 可以使用哪些 Tools？
- 要怎麼操作電腦與開發環境？
- Context 要怎麼管理？
- Skills 要怎麼呼叫？
- 複雜任務要怎麼拆解？
- 要不要叫其他 Subagent 幫忙？
- Session 要怎麼保存？
- 出錯後能不能知道剛剛到底發生什麼事？

所以同一顆模型，放進不同 Harness，最後可能就是完全不同等級的 Coding Agent。

這也是為什麼我現在開始覺得：**模型能力只是 Agent 戰爭的一半，另一半是模型被放進什麼工作環境裡。**

## 模型很聰明，不代表 Agent 很會工作

我們很容易把「模型能力」跟「Agent 能力」混在一起，但其實這是兩件事情。

可以用一個工作團隊來理解：Model 像大腦，負責理解與推理；Harness 像工作環境與管理制度，負責提供工具、規則、流程、狀態與回饋；Skills 則像 SOP，告訴 Agent 某一類工作應該怎麼完成。

| 元件 | 可以怎麼理解 | 主要作用 |
| --- | --- | --- |
| Model | 大腦 | 理解、推理與產生回應 |
| Harness | 身體、工作環境與管理制度 | 提供 Context、Tools、流程、權限、狀態與錯誤處理 |
| Skills | SOP 與專業方法 | 告訴 Agent 某一類工作應該如何完成 |
| Tools | 工具與外部連接 | 讓 Agent 讀寫檔案、執行指令、呼叫 API 或操作服務 |
| Subagents | 可以被委派的專業成員 | 分擔任務、平行處理並回傳結果 |

換句話說，Model 可能很會回答問題，但如果它看不到正確的檔案、沒有合適的工具、不能保留 Session，也沒有驗證與錯誤恢復機制，它就不一定能把工作完成。

## DeepSeek Harness 最核心的概念：Everything is a Plugin

DSH 最吸引我的地方，是它把整個 Agent 拆開了。官方的核心設計就是：

> **Everything is a Plugin.**

Model 是 Plugin。

Tools 是 Plugin。

Skills 是 Plugin。

Session 是 Plugin。

Sandbox 是 Plugin。

Storage 是 Plugin。

Agent Loop 是 Plugin。

連 UI 都可以是 Plugin。

也就是說，你不是只能接受官方幫你做好的 Coding Agent，而是可以開始像組積木一樣，自己組一個 Agent。

這件事情的重要性在於：未來 Coding Agent 的競爭，可能會慢慢從「哪一個 AI 比較聰明？」變成「你怎麼組織這些 AI 工作？」

當 Model、Context、Tools、Skills、Runtime、Session 與 UI 都能被拆開、替換與組合，Agent 就不再只是某家模型公司的單一產品，而會更接近一個可設計的工作平台。

## 1. Dynamic Workflow：Agent 開始自己組專案團隊

假設今天要 Review 一個大型專案。以前可能是一個 Agent 從頭做到尾：讀程式碼、看架構、找漏洞、看測試，最後寫報告。

DSH 可以換一種玩法。

主 Agent 可以動態寫 JavaScript Workflow，再建立多個 Subagents，讓它們平行執行：

- **Architecture Agent**：專門看整體架構與模組邊界。
- **Security Agent**：專門尋找資安風險與可能的漏洞。
- **Testing Agent**：專門檢查測試覆蓋與失敗案例。
- **Code Quality Agent**：專門檢查程式碼品質與可維護性。

Security Agent 負責找漏洞，Testing Agent 負責檢查測試，Architecture Agent 負責看全局架構，Code Quality Agent 則負責程式碼品質。最後，主 Agent 再把每個 Agent 的 Structured Output 收回來統整。

注意這件事情的差異：

- 以前是：**Agent 自己工作。**
- 現在開始變成：**Agent 寫程式管理其他 Agent 工作。**

它已經開始有點像 AI Tech Lead：不只自己解題，也會判斷要找誰、怎麼分工、哪些工作可以平行，以及最後如何合併結果。

## 2. Agent Teams：不是 Subagent，而是真的 AI Team

Dynamic Workflow 比較像「這個任務臨時找四個 AI 過來幫忙」。但 DSH 還往前走了一步：**Agent Teams**。

它可以建立一個持續存在的 AI Team，裡面有：

- **Lead**：負責理解目標、分派任務與統整結果。
- **Teammates**：各自負責不同領域的工作。
- **Mailbox**：讓 Agent 之間可以互相傳遞訊息。
- **Shared Task DAG**：管理任務依賴與執行順序。

Agent 之間甚至可以互相傳訊息。Task DAG 則負責管理任務之間的依賴：誰先做？誰可以平行？誰必須等另一個 Agent 完成？

這時候你操作的東西，其實已經不像 Chatbot 了，而比較像一間 AI 軟體公司的組織架構。

它把「一次請模型幫忙」改成「設計一組能持續協作的工作角色」。對大型專案而言，這可能比單純增加一次對話的 Context 更接近真實工程團隊的工作方式。

## 3. Trajectory：Agent 終於不再是一個黑箱

這是我在 DSH 裡面非常喜歡的一個設計。

現在很多 Coding Agent 有一個很大的問題：你丟一個任務給它，它跑了十幾分鐘，改了二十個檔案，用了幾萬 Token，最後只告訴你：「Done。」

但你真正想知道的是：**它剛才到底做了什麼？**

DSH 會把整個 Agent 執行過程記錄下來，包含：

- System Prompt
- Reasoning
- Tool Call / Result
- Context
- Subagent
- Token
- 執行時間
- Session

甚至可以 Restore、Fork、Retrieve、Replay。

所以當 Agent 出問題，你可以往回追：

- 它在哪一步開始判斷錯誤？
- 哪個 Tool 出錯？
- 哪個 Subagent 做錯？
- Context 從哪裡開始污染？

我覺得可以把這東西理解成：**Chrome DevTools for AI Agent。**

未來 Agent 如果真的要進企業 Production，Observability 幾乎一定會變成標配。企業不只需要知道最後有沒有產出，也需要知道產出是怎麼來的、哪一個環節可以重現，以及出錯後能不能快速定位。

## 4. Creator Mode：Agent 開始替自己組裝能力

DSH 還有一個很有意思的 Creator Mode。

Agent 可以檢查自己現在有哪些能力，發現缺少什麼，就 Mount Plugin；接著測試 Plugin，最後甚至可以建立自己的 Agent Preset。

這件事情真正有意思的地方是：

- 以前：工程師替 Agent 寫功能。
- 接下來可能變成：人描述需要什麼能力，Agent 開始替自己組裝能力。

如果這條路繼續走下去，未來我們甚至可能不再「建立 Agent」，而是讓 Agent 自己建立 Agent。

這也會讓「Agent 設計」從一次性的程式開發，逐漸變成一種能力配置與治理問題：哪些 Plugin 可以掛載？如何測試？權限如何限制？產生的新 Agent 是否需要經過人工審核？

## 5. 更有趣的是，它甚至可以找 Codex、Claude Code 當外援

這點我覺得非常有想像空間。

依照初稿所整理的 DSH 官方架構，它已經提供 **Codex Subagent** 與 **Claude Code Subagent** 的整合方向。

未來完全可以出現這種工作流：

1. DeepSeek 當 Lead Agent。
2. 某個功能先交給 Codex 實作。
3. 架構完成之後，再請 Claude Code Review。
4. 測試交給另外一個 Agent 執行。
5. 最後由 DeepSeek 把所有結果收回來統整。

這時候我們一直爭「Claude 跟 GPT 到底誰比較強？」可能突然變得沒那麼重要。

真正重要的問題反而是：**誰最會指揮它們？**

要注意的是，這裡談的是 DSH 的架構與 Subagent 工作流方向，不代表每個版本、每種部署方式都已經提供相同的整合程度。由於 DSH 仍在 Developer Preview，實際支援的 Agent、設定方式與限制，應以官方 Repo 的最新文件為準。

## 這才是 DeepSeek Harness 真正值得看的地方

如果只把 DSH 看成「DeepSeek 也做了一個 Claude Code」，我覺得反而低估它了。

它真正有意思的地方，是把 Agent 最重要的那一層直接攤開：

> **Model × Context × Tools × Skills × Runtime × Subagents × Session / Memory × Observability**

Model 只是其中一層。

真正讓這些東西開始一起工作的，才是 Harness。

這個觀點也提醒我們：一個 Agent 的能力，不應該只用模型排行榜衡量。它是否能讀取正確脈絡、是否有安全的工具權限、是否會使用適合的 Skill、是否能平行分工、是否能追蹤與恢復，才是它能不能穩定工作的關鍵。

## Vibe Coding 上半場比 Model，下半場開始比 Harness

過去一年，我們一直追新的模型：Claude 更新，測一次；GPT 更新，再測一次；Gemini 更新，又測一次；DeepSeek 出新模型，繼續測。

但當模型之間的能力逐漸逼近，我覺得下一個真正值得研究的問題已經開始浮現：**如何把模型組織成真正會工作的 Agent？**

模型是大腦。

Harness 才是讓這顆大腦擁有眼睛、手、工具、記憶、工作流程，以及團隊協作能力的身體。

所以接下來玩 Vibe Coding，我覺得除了研究「哪個 Model 最強？」，還要開始研究另一個問題：

> **這個 Agent，到底是怎麼被 Harness 起來的？**

DeepSeek Harness 現在還只是 Developer Preview，功能與架構一定還會快速變化。但 GitHub Stars 快速累積，本身就透露了一件很有意思的事情：開發者開始把注意力，從 Model 往 Agent Runtime 移動了。

Vibe Coding 上半場在比 Model。

下半場，可能開始比 Harness。

而再下一場戰爭，也許是：**誰能打造出最會管理一整群 AI 的 Agent Runtime。**

## 結語：真正的競爭可能是 AI 的組織能力

DeepSeek Harness 值得看的，不只是它能不能成為另一個 Coding Agent，而是它把「Agent 如何被組裝、協作、追蹤與恢復」這件事攤在開發者面前。

當所有東西都能變成 Plugin，Model 就不再是唯一的主角。未來的開發者可能需要同時具備三種能力：選擇合適的模型、設計可靠的 Harness，以及把一群 Agent 組織成可驗收的工作流程。

如果你身邊有人正在玩 Claude Code、Codex、Vibe Coding 或 Multi-Agent，這篇文章可以分享給他。因為下一波 AI Coding 的競爭，可能真的要換戰場了。

DeepSeek Harness 官方 Repo：[github.com/deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)

## 延伸閱讀

- [Skill 之後，下一個 AI 開發者一定要懂的詞：Agent Harness](/posts/skill-to-agent-harness/)
- [AI 工具名詞全解析：一次搞懂 MCP、Skill 與 CLI 的差異與應用場景](/posts/ai-agent-tools-mcp-skill-cli/)
- [何時該用 LLM？何時該派 AI Agent 上場？](/posts/n8n-llm-vs-ai-agent/)

## 常見問答 (FAQ)

### Q1：DeepSeek Harness 是什麼？

DeepSeek Harness（DSH）是一套用來組裝與運行 AI Agent 的 Harness。它把 Model、Tools、Skills、Session、Sandbox、Storage、Agent Loop 與 UI 等能力拆成可組合的 Plugin，讓開發者能設計不同的 Agent 工作環境。

### Q2：Model 與 Harness 的差別是什麼？

Model 負責理解、推理與產生回應，像是 Agent 的大腦；Harness 負責提供 Context、Tools、流程、權限、Session、錯誤處理與協作機制，像是讓大腦真正能工作的身體與工作環境。

### Q3：Dynamic Workflow 與 Agent Teams 有什麼不同？

Dynamic Workflow 是主 Agent 針對單次任務動態建立多個 Subagents 並平行執行；Agent Teams 則是由 Lead、Teammates、Mailbox 與 Shared Task DAG 組成的持續性團隊，能管理訊息傳遞與任務依賴。

### Q4：Trajectory 為什麼對 Coding Agent 重要？

Trajectory 會記錄 Agent 的 Prompt、Reasoning、Tool Call、Context、Subagent、Token、執行時間與 Session，並支援 Restore、Fork、Retrieve、Replay。這讓開發者能追蹤 Agent 從哪一步開始出錯，而不必只依賴最後一句「Done」。

### Q5：DeepSeek Harness 現在適合直接用於企業 Production 嗎？

本文整理的 DSH 仍是 Developer Preview，功能、介面、整合方式與限制都可能快速變化。若要導入企業 Production，應先依官方 Repo 的最新文件確認部署方式、權限、Plugin、Subagent 與 Observability 能力，再進行小範圍測試與人工驗收。
