---
title: Custom GPT 要退場了，真正值得學的不只是 Plugin：開始打造自己的 Skill Library
cover: /images/cover199.png
cover_position: 75% center
toc: true
categories:
  - AI自動化
tags:
  - ChatGPT
  - AI Agent
  - AI工具
date: 2026-10-02 12:16:03
subtitle: 把一次性的 AI 助手，整理成能重複執行的工作方法
description: Custom GPT 預計轉向 Plugin，但遷移不會保留所有設定。本文整理 Instructions、Knowledge、Apps 與 Actions 的轉換差異，並說明如何把自己的 SOP 整理成可重用的 Skill Library。
---

最近看到《數位時代》談到 Custom GPT 遷移 Plugin，我第一個想到的不是「Custom GPT 要消失了」，而是 OpenAI 正在把工作流程、工具和可重複使用的指引放進同一套架構。

如果你也在研究 AI Agent、Codex、Claude Code、Skill 或 MCP，這次轉變值得關注。不過我認為最值得學的不是趕快做一個 Plugin，而是把平常怎麼工作的經驗整理出來，讓 AI 能在類似任務中重複使用。

以前我們常想：「我要做一隻幫我寫文章的 GPT。」現在可以多問一題：「我寫文章時有哪些步驟、判斷和檢查，值得整理成一套工作方法？」

## Custom GPT 何時退場？先看適用帳號與公告

依 OpenAI 目前的[Custom GPT 退場與遷移說明](https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq)，Custom GPT 預計在 **2026 年 12 月 11 日**退場；符合條件並取得核准延期的 Enterprise 工作區，時程可延至 **2027 年 2 月 11 日**。官方也提醒，遷移和功能開放時間可能依帳號或工作區而不同，應以自己的產品通知為準。

另一個容易混淆的日期是 **2026 年 10 月 26 日**。依目前 FAQ，這是受影響 Enterprise 工作區預計停止建立新 GPT 的日期；這項建立限制不等於所有方案都在同一天停止建立。官方公告可能調整，準備遷移前最好再看一次自己帳號收到的通知。

已遷移的 GPT 在適用的退場日前仍可使用，但會變成唯讀。也就是說，遷移不是按下按鈕後就能永遠保留原本的編輯方式；先確認重要指示已更新，再遷移和測試會比較穩妥。

## 遷移會搬什麼？哪些要另外處理？

依官方規劃的遷移流程，原本的 GPT 指示會變成 Plugin 裡的 Skill，Knowledge 檔案會複製為參考檔案，已連接的 App 則會加入 Plugin。這讓原本集中在一隻 GPT 裡的內容，開始拆成工作流程指引與外部工具兩個部分。

但遷移不會完整保留所有東西：

| Custom GPT 原有內容 | 遷移後的安排 | 需要留意的地方 |
| --- | --- | --- |
| Instructions | 變成 Skill | 檢查指示、範例與輸出要求是否正確 |
| Knowledge Files | 複製到 Plugin 的參考檔案 | 確認檔案內容與引用方式都符合原本用途 |
| 已連接的 App | 加入 Plugin 的 App | 仍要確認帳號授權、工作區權限與可用功能 |
| 指定模型 | 不會隨遷移保留 | 重新檢查替代工作流程使用的模型 |
| Custom Actions | 不會自動遷移 | 評估現有 App，或另行重建 MCP 整合並測試 |
| 對話紀錄與分享設定 | 不會搬到新 Plugin | 確認哪些人需要存取新版本，並重新安排分享 |

所以，不要把遷移想成「GPT 按一下就變成 Plugin，而且每個地方都一樣」。比較實際的做法是把 GPT 當作一份流程草稿：盤點內容、確認缺漏，再驗證新的 Skill 和工具能不能完成原本的工作。

## Plugin、Skill、App 和 MCP 怎麼分工？

可以先用這幾句話理解：

- **Skill** 說明工作應該怎麼做，例如先蒐集哪些資訊、如何判斷例外、最後用什麼格式交付。
- **App** 讓 ChatGPT 或 Codex 連接外部服務與資料，例如雲端文件或工作平台；連線仍受帳號授權和工作區權限限制。
- **MCP** 是提供模型工具、即時資料與受控動作的一種介面。MCP 服務提供「可呼叫什麼」，Skill 則可以描述「何時呼叫、依什麼順序、結果不完整時如何處理」。
- **Plugin** 可以把一個或多個 Skill、連接的 App，以及相關設定組合成可安裝與重用的工作流程套件。有些 Plugin 只有 Skill，不一定要連 App。
- **Agent** 根據任務與可用能力判斷怎麼進行，再呼叫需要的 Skill 和工具。

這些概念有關聯，但不該直接畫上等號。OpenAI 的[Plugin 說明](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt)指出，Plugin 可以包含 Skills、連接的 Apps 和其他設定；[Skills 開發文件](https://developers.openai.com/plugins/concepts/skills)則說明，Skill 能為 MCP 工具提供可重複使用的流程指引。Skill 也可以在不連接 MCP 的情況下工作。

在支援 Skills 的 ChatGPT 帳號中，已安裝的 Skill 可能在適合時由 ChatGPT 自動使用；功能開放仍依產品、方案與工作區設定而異，也不代表每次對話都會呼叫同一個 Skill。[官方 Skills 說明](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)有列出目前的開放條件與使用方式。

舉例來說，一個客戶預約 Skill 可以寫下：先判讀需求、查看客戶紀錄、列出可選時段、等使用者確認後才建立預約。查詢行事曆或寫入 CRM 則需要相應的 App 或工具；流程指引本身不會憑空取得服務權限。

## Skill 不只是把 Prompt 存成檔案

Prompt 通常是在描述「這一次要做什麼」。SOP 把反覆工作的步驟和檢查條件整理下來。Skill 則可以把流程、判斷方式、範例和參考資源包成一份，讓 AI 在遇到相似任務時能重複使用。

以部落格寫作為例，單次 Prompt 可能只說「幫我寫一篇文章」。成熟的工作方法還會包含：

- 文章要給誰看，解決什麼問題？
- 如何確認事實、保留來源與區分推論？
- 標題、段落和 FAQ 要符合什麼格式？
- 哪些語氣或說法要避免？
- 交稿前要檢查哪些欄位與連結？

這些規則如果每次都要重新貼上，就還是一次性的指令。把它們整理為可呼叫、可維護的流程後，才開始接近 Skill。

我會把這段演進理解成：

```text
Prompt → SOP → Skill → Skill Library → Plugin
```

需要操作外部服務時，再接上 App 或 MCP。這不是每個人都必須照著走的產品安裝順序，而是把個人經驗整理成可重用能力的一種方法。我先前也寫過[如何從 Prompt 整理出自己的 Skill Library](/posts/from-prompt-to-skill-library/)，這篇則聚焦在 Custom GPT 遷移後，這些工作方法要如何拆開與驗證。

## 為什麼我開始整理自己的 Skill Library？

我前陣子算了一下自己的環境，Skill 加 Plugin 指令已經裝超過一百個。工具多了，不代表 AI 就更懂我；如果沒有自己的流程與判斷準則，裝再多別人的 Skill，也只是多了一堆尚未融入工作的選項。

真正值得留下來的，常常是每天會用到的方法：我怎麼研究工具、準備課程、規劃簡報、整理客戶需求、寫文章，還有哪些容易出錯的地方。這些經驗可以逐步整理成一個自己的 Skill Library，例如：

```text
享哥 Skill Library
├── Writing
│   ├── blog-writing
│   ├── facebook-post
│   └── course-copywriting
├── Teaching
│   ├── course-outline
│   ├── slide-manifest
│   └── hands-on-lab
├── Research
│   ├── fact-check
│   └── tool-research
├── Video
│   ├── short-video-script
│   └── storyboard
└── Coding
    ├── vibe-coding
    └── deployment-check
```

這是一份可以逐步發展的示意清單，不必一開始就把所有工作分類完成。先找出一件高頻、步驟穩定、自己常要重新解釋的工作，寫清楚輸入、判斷、例外與輸出，再用實際任務修正。

將來真正有價值的，可能不是一份幾千字的 Prompt，而是把多年工作經驗整理成 AI 可以理解、重複使用，也能檢查結果的工作流程。房仲可以整理房源分析與客戶跟進；會計師可以整理財報閱讀與文件檢查；講師可以整理課程規劃與實作設計。這些例子都要從自己的實際流程開始，不能只套用別人的模板。

## Custom GPT 遷移前，先做這五件事

### 1. 盤點自己建立或依賴的 GPT

列出 GPT 的用途、使用頻率、維護者和需要使用它的人。幾乎沒在用的，可以先不遷移；只是一段簡單 Prompt 的，可以先保存指示；每天工作都會用到、含有穩定流程的，才值得花時間測試替代方案。

### 2. 拆出流程、資料與工具

把 Instructions 中的步驟、判斷、例外和輸出規格整理出來，再分別核對 Knowledge 檔案、App 連線與 Custom Actions。尤其有 Custom Actions 時，要先確認新的 App 或 MCP 整合是否具備需要的功能，不要假設舊 API 串接會自動保留。

### 3. 在遷移前完成必要編輯

官方說明指出，遷移會使用 GPT 最新的已發布版本；未發布的草稿修改不會直接搬過去。需要保留的規則和檔案，先整理並確認版本，再開始遷移。

### 4. 用熟悉任務和困難案例測試

先用平常最常做的任務檢查替代 Plugin 是否選對 Skill、引用到預期的參考檔案、產出正確格式，再拿一個較難的案例測試例外處理。若有連接 App，也要另外檢查授權、可讀寫範圍和動作確認設定。

### 5. 重新確認分享與權限

遷移不會自動把原本 GPT 的分享設定帶到 Plugin。個人 Plugin 預設為私人，讓同事或客戶使用前，要確認他們能安裝、連線並取得需要的權限。

## 新手不用一次學完 Plugin、MCP 和 Agent

如果這些名詞讓人覺得太多，我會建議按照自己的工作慢慢累積：先把需求寫清楚，再把常做的工作整理成 SOP；SOP 穩定之後，挑一段做成 Skill。當工作需要讀寫外部資料時，再評估 App 或 MCP；需要把多項流程組合、分享或提供安裝時，才考慮 Plugin。

至於 Agent，則是協調模型、Skills 與工具完成任務的執行方式。可以先從一個可重複驗證的小流程開始，不必為了跟上名詞而把每一層都裝齊。

## 真正值得累積的是可執行的經驗

Custom GPT 的遷移提醒我們：一個好用的 AI 助手，不只有幾句 Instructions。它可能還包含參考資料、工具連線、權限設定，以及人們多年累積的判斷方式。

Plugin 是把工作能力組合與分享的容器；Skill 承載可重複使用的流程；App 和 MCP 提供連接資料與操作工具的能力。對我來說，最值得先做的仍是把「自己怎麼工作」整理清楚。Prompt 可以告訴 AI 這一次做什麼，而一套經過檢查、持續修正的 Skill，才能把經驗帶到下一次相似的工作裡。

## 常見問答 (FAQ)

### Q1：Custom GPT 什麼時候會停止使用？

OpenAI 目前規劃 Custom GPT 於 2026 年 12 月 11 日退場；符合資格並取得核准延期的 Enterprise 工作區，規劃日期為 2027 年 2 月 11 日。時程可能依帳號與工作區公告調整，請以自己的產品通知為準。

### Q2：遷移到 Plugin 後，原本的 GPT 內容會全部保留嗎？

不會。依目前遷移說明，Instructions 會成為 Skill、Knowledge Files 會成為參考檔案、已連接的 Apps 會加入 Plugin；指定模型不會保留，Custom Actions、對話紀錄與分享設定也不會完整遷移。

### Q3：遷移後的 Plugin 會和原本 GPT 完全一樣嗎？

不能假設兩者完全相同。官方建議使用熟悉的任務和較困難的案例測試 Skill 選擇、參考資料、輸出格式與工具整合，確認行為符合需求後再依賴新版本。

### Q4：Skill 一定要連接 App 或 MCP 才能使用嗎？

不一定。Skill 可以只提供流程指引、範例和參考資源；只有需要查詢外部資料或執行服務動作時，才需要適當的 App、MCP Server 或其他工具，而且仍受帳號與工作區權限限制。

### Q5：如果我的 GPT 使用 Custom Actions，遷移前要做什麼？

先列出每個 Action 使用的服務、輸入資料與必要動作，再確認是否有合適的 App；若需重建 MCP 整合，要分開設計並測試。Custom Actions 不會自動遷移，因此在替代方案完成驗證前，不要假設原本的 API 流程已經可用。

## 延伸閱讀

- [OpenAI：Custom GPT 退場與遷移 FAQ](https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq)
- [OpenAI：ChatGPT 中的 Skills](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)
- [OpenAI：ChatGPT 中的 Plugins](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt)
- [從 Prompt 到 Skill Library：如何打造自己的 AI 工作能力庫](/posts/from-prompt-to-skill-library/)
