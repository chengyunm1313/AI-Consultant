---
title: '當 ChatGPT 可以接上 Pi：AI Agent 正在走向「模型與 Harness 分離」'
cover: /images/cover195.png
toc: true
categories:
  - AI自動化
tags:
  - AI Agent
  - ChatGPT
  - AI工具
date: 2026-09-30 18:25:12
subtitle: 模型持續更新，Skills、Tools 與 Workflow 才是可累積的工作系統
description: ChatGPT、Pi 與 Agent Harness 的整合，讓模型和執行環境可以分開選。本文拆解 Model、Harness、Skills、Tools、Workflow 五層架構，並說明 ChatGPT 方案授權與開源 Harness 的檢查邊界。
---

最近看到 OpenAI 推出 Sign in with ChatGPT，並開始讓符合資格的開源工具串接 ChatGPT 方案用量。官方目前列出的開源工具範例包含 Pi by Earendil。

一開始我也以為，這只是「Pi 現在可以更方便使用 GPT」。但把 OpenAI 的整合說明和 Pi 的登入方式放在一起看，我更在意的其實是另一件事：我們過去常綁在一起看的模型與 Agent Harness，正在變成可以分開選擇的兩層。

這可能改變我們挑選 AI Agent 工具的方式。

## 為什麼我開始把模型與 Agent 分開看？

這兩年挑 AI Coding 或 Agent 工具時，我們很容易先從模型開始想：想用 Claude，就想到 Claude Code；想用 OpenAI，就想到 Codex；想用 Gemini，就去找 Google 生態系裡的工具。

久了容易覺得模型就是 Agent。其實模型比較像負責理解、推理、規劃與生成的大腦。要讓它讀檔、改程式、執行 Shell、呼叫 MCP、操作瀏覽器、載入 Skill，還需要一套把模型接到電腦、工具和工作流程上的系統。

這一層通常稱為 Agent Harness。

## Harness 負責把模型接到工作現場

假設我們請 Agent 檢查專案、找出 Bug、修改程式碼、執行測試，再整理報告。真正完成任務時，除了模型本身，背後還有許多部分一起運作：

- 上下文管理與檔案系統
- Shell、Terminal 與工具呼叫
- MCP、Skills、Browser 或 Computer Use
- 權限控制、錯誤處理與 Agent Loop
- 工作狀態保存、模型切換與記憶機制

這些能力如何串接，會影響模型能看見什麼、可以採取哪些行動，以及出錯後能不能修正並繼續。Harness 不只是聊天介面，而是模型的執行環境和工作規則。

## 同一個 GPT，換一套 Harness 也會有不同體驗

假設兩套 Agent 使用能力相近的 GPT 模型。A Harness 可能會先搜尋專案、整理計畫、修改程式碼、自動執行測試，發現錯誤後再回頭修正與驗證；B Harness 可能只讀幾個檔案、修改一次就回報完成。

最後使用者感受到的「AI 好不好用」，不一定全是模型能力的差異，也可能是 Harness 怎麼安排模型工作的結果。

## Pi × ChatGPT 值得注意的是什麼？

OpenAI 的 Sign in with ChatGPT 把兩種權限分開處理：使用者可以用 ChatGPT 身分登入，也可以另外選擇是否讓符合資格的應用程式使用方案內的 AI 用量。使用 ChatGPT 方案用量需要獨立授權；目前官方說明限定 Plus 與 Pro 等符合資格的方案，而且這不會把 ChatGPT 對話或 API Key 交給應用程式。[OpenAI 使用說明](https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites) 也列出 Pi by Earendil 作為開源工具範例。

這不只是第三方工具自己接上一個模型 API。OpenAI 已提供讓開源工具使用者以 ChatGPT 帳號登入，並在同意後使用方案用量的整合方式；[開發者文件](https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt)也說明，登入身分與使用方案用量是不同能力，後者是可選權限。

不過「列在支援範例」不等於每種登入方式對所有使用者都已順利可用。Pi 既有的文件也列出 ChatGPT Plus／Pro（Codex）訂閱登入；此外，Pi 專案在 2026 年 9 月 29 日有使用者回報，新版 Sign in with ChatGPT 的 Pi 登入出現 invalid_client，而舊的 Codex 訂閱登入仍可用。這是一則使用者回報，不能推論成所有帳號都遇到相同問題；但它提醒我們，整合方式和實際可用狀態可能還在演進。[Pi 登入文件](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/providers.md) · [Pi issue #10184](https://github.com/earendil-works/pi/issues/10184)

## 模型與 Harness 可以分開組合

過去模型、帳號、額度和 Agent 工具常被包成一套產品。現在可以想像不同的組合：ChatGPT 方案連上 Pi，Pi 再接 Skills、MCP、CLI 或 Browser，最後串成自己的 Workflow。

我也可能在某些工作使用 Claude Code，在另一些工作使用 Codex；需要自訂流程時，再選 Pi、OpenClaw 或 Hermes 等其他 Harness。這些工具的能力和整合方式會隨版本變動，但「模型與執行環境可以分開思考」是更值得留下的觀念。

因此，選 AI Agent 時只問「要用哪一個 AI？」可能不夠。還可以接著問：

- 你使用什麼 Model？
- 你使用什麼 Harness？
- 你裝了哪些 Skills、接了哪些 Tools？
- 這些元件最後如何組成 Workflow？

## Harness 也是一條重要的信任邊界

Agent 不只回答問題。依照授權，它可能讀寫檔案、執行指令、連接服務、操作瀏覽器、使用憑證或呼叫 MCP。因此除了問「這顆 LLM 安不安全？」，也要了解「這套 Harness 在我的電腦上能做什麼？」

Harness 決定模型可用的工具和權限，也要負責把操作結果與錯誤交回模型。選擇工具時，可以檢查它會讀取哪些資料、哪些地方會執行 Shell、網路請求送往哪裡、憑證如何保存，以及 MCP 或擴充套件擁有哪些權限。

## 開源代表多了一個檢查入口，不代表自動安全

Pi、OpenClaw、Hermes 這類開源 Harness 有一個優點：原始碼可以檢查。開源不等於安全，專案仍可能有漏洞，第三方 Skill、Plugin 或 MCP 也可能帶來風險。

但我們可以把「完全不知道它在做什麼」往前推一步，改成檢查它的資料流、Token 儲存、Shell 執行點、網路請求、遙測、相依套件與敏感檔案存取。也能請 Codex 或 Claude Code 協助做安全檢視，再由人確認重要結果。這不能保證百分之百安全，卻增加了理解和審查的機會。

## Skill Library 比 Prompt 收藏更容易累積工作方法

我最近整理 Agent Skill 時，越來越不想只收藏「一百個超強 Prompt」。Prompt 容易散落各處；比較有價值的，是把自己的工作方法整理成可重複使用的能力。

例如簡報、文章、社群內容、研究、影片分鏡、資料整理、Vibe Coding 或課程設計 Skill，都可以說明 Agent 遇到這類工作時，先做什麼、要遵守哪些規則、參考哪些資料、輸出成什麼格式，以及如何驗收成果。

每個 Skill 不只是放一句提示詞，而是逐步累積判斷方式與 SOP。這也延伸了我在[整理自己的 AI 工作能力庫](/posts/from-prompt-to-skill-library/)時的想法：把工作方法留下來，才能在模型更新時繼續使用。

## 用五層架構理解 AI Agent

剛開始研究 Agent 時，可以先用五層架構來看：

1. **Model**：GPT、Claude、Gemini 等模型，負責理解與推理。
2. **Harness**：Pi、Codex、Claude Code、OpenClaw、Hermes 等工具，負責讓模型在環境中工作。
3. **Skills**：把專業知識、規則與 SOP 包成可重複使用的能力。
4. **Tools**：MCP、CLI、Browser、Computer Use、API 等，讓 Agent 接觸外部工具和資料。
5. **Workflow**：把前面各層組合起來，完成一項真正的工作。

最後產生價值的，通常不是單獨某一顆 LLM，而是 Model、Harness、Skills、Tools 與 Workflow 的組合。

## 哪些人值得研究 Pi 這類開源 Harness？

如果平常只是偶爾問 ChatGPT 問題，不需要因為一則整合消息就立刻更換工具。但如果已經開始做 AI Coding、MCP、Skills、自動化、長時間任務或多工具工作流，Pi 這類開源 Harness 值得研究。

重點不是把所有工作搬到同一個工具，而是理解模型、執行環境與工作方法可以分開評估，再依任務組合。

## Agent 下一戰也許是工作系統

GPT、Claude、Gemini 都會持續更新，模型排行榜也會一直變。我現在更在意的是：工作流程有沒有留下來？Skill 能不能重複使用？工具能不能替換模型？資料能不能掌握？Harness 能不能檢查？Agent 能不能真正完成工作？

以前我會想「選一個最強的 AI，把工作交給它」。現在更傾向先建立自己的 AI 工作系統，再選合適的模型進來工作。

模型會換，Harness 也會進化；更值得自己留下來的，是 Skills、Tools、Workflow，以及累積下來的工作方法。也許以後大家討論 AI Agent，不只問「你用 GPT 還是 Claude？」，還會問「你現在用哪個 Harness？你的 Skill Library 裡有什麼？」

## 參考資料

- [OpenAI：Using your ChatGPT plan in other apps and sites](https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites)
- [OpenAI：Integrating Sign in with ChatGPT in your Open Source App](https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt)
- [Pi：Provider Authentication](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/providers.md)
- [Pi issue #10184：Sign in with ChatGPT 登入回報](https://github.com/earendil-works/pi/issues/10184)

## 常見問答 (FAQ)

### Q1：Agent Harness 是什麼？

Agent Harness 是讓模型在電腦與工具環境中執行任務的系統，通常包含上下文管理、檔案與 Shell 工具、權限控制、Agent Loop、錯誤處理及工作狀態等部分。

### Q2：使用 Pi 連接 ChatGPT 方案一定要準備 API Key 嗎？

Sign in with ChatGPT 的開源整合可讓符合資格的使用者登入，並在另外授權後使用方案內的 AI 用量，不需要自行建立或提供 OpenAI API Key。是否能使用仍取決於方案資格、工具整合與當下登入狀態。

### Q3：Sign in with ChatGPT 會把我的 ChatGPT 對話交給 Pi 嗎？

不會因登入或使用方案用量就取得 ChatGPT 對話或 API Key。登入身分與方案用量授權是不同權限；使用者仍應逐項檢查應用程式要求的權限及其資料處理方式。

### Q4：開源 Agent Harness 就代表安全嗎？

不代表。開源讓人有機會檢查原始碼，但不能保證沒有漏洞，也不能替第三方 Skills、Plugins 或 MCP 背書。使用前仍要檢查程式行為、資料流、工具權限與相依套件。
