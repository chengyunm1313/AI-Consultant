---
title: Codex Skill 與 Plugin 到底差在哪？從個人工作流到團隊交付
cover: /images/cover192.png
toc: true
categories:
  - AI自動化
tags:
  - AI工具
  - Codex
  - AI Agent
date: 2026-09-27 13:57:36
subtitle: Skill 教 Agent 怎麼做，Plugin 把一組能力整理成可安裝的套件。
description: Codex Skill 與 Plugin 差在哪？本文從工作流程、MCP 工具與套件散布拆解兩者分工，補上 2026 年 OpenAI Skills repository deprecated、skill-only plugin 與 plugin.json 格式，說明個人使用到團隊交付該如何選擇。
---

最近我在研究 Codex Skill，發現 Agent 的擴充方式正逐漸變得清楚。以前看到好用的 Skill，我會想：下載、放進 Codex，自己開始用。但如果做出一套能重複使用的工作流，想交給十位學員、五十位同事，甚至其他公司安裝，接下來就不只是「怎麼寫好一份 `SKILL.md`」了。

像是 MiniMax H3 影片提示詞整理、Slide Manifest 簡報流程、社群文章產生、課程企劃、AI 影片 Shot Manifest，或企業內部 SOP，都可能先從個人方法開始，最後變成團隊希望共用的能力。理解 Skill、Plugin 與 MCP 各自負責什麼，能幫我們用合適的結構保存這些方法。

## 先用四個概念拆開來看

| 元件 | 負責什麼 | 可以怎麼理解 |
| --- | --- | --- |
| Prompt | 告訴 AI 這一次要做什麼 | 單次任務說明 |
| Skill | 描述一類工作怎麼完成，包含步驟、判斷、範例與資源 | 可重複使用的工作流程或 SOP |
| MCP Server | 提供 Agent 可呼叫的工具、即時資料或動作 | 能操作的工具入口 |
| Plugin | 把一個或多個 Skill，以及可選的 MCP、資源等組成套件 | 能安裝與管理的能力包 |

因此，我平常會把 Skill 記成「工作方法」，把 Plugin 記成「套件包裝」。`Skill = Function`、`Plugin = Package` 可以當作方便記憶的比喻，但它不是嚴格的技術等式：Plugin 裡可以只有一個 Skill，也可以加入 MCP Server 等元件。

## Skill 是 Agent 能重複遵循的工作方法

Skill 通常是一個資料夾，核心是 `SKILL.md`，必要時再放入參考資料、範本、資產或腳本。它會交代什麼情況適用、要收集哪些輸入、如何做判斷、按什麼順序執行，以及怎樣算完成。

例如 `minimax-h3-prompt-standardizer` 這類工作流，可以教 Codex 如何分析影片需求、拆分生成單元、處理人物與場景一致性、規劃鏡頭，再整理成適合模型使用的提示詞。Skill 教的是如何做這件事；影片仍由相應的模型或工具生成。

Skill 的價值在於把個人的 Know-how 寫成可以複用、檢查和持續修正的流程。模型可以更換，成熟的工作步驟、範本與品質標準仍能留下來。若你正在整理 Skill 與 Agent 執行環境的關係，也可以參考我之前寫的[從 Skill 到 Agent Harness](/posts/skill-to-agent-harness/)。

## Plugin 是組合與交付能力的套件

Plugin 的任務是把可重複使用的能力整理成一個有名稱、版本與結構的套件。官方架構允許 Plugin 包含一個 Skill，也可以放入多個相關 Skills；需要連接外部服務時，還能搭配 MCP Server。依套件需求，也可包含資產、生命週期 hooks 或選用介面。

可以想像一個「AI Video Production Plugin」包含故事規劃、Shot Manifest、H3 Prompt、影片檢查等 Skills，再視需求連接素材庫或其他工具。使用者安裝的是一套有關聯的能力，維護者則能一起整理套件版本與分發方式。

Plugin 不等於「把所有能力塞在一起」。官方建議從符合使用情境的最小結構開始；工作流程只需要說明和既有工具時，Skill-only Plugin 已經足夠。

## 2026 年 9 月的重要更新：官方明確支援 Skill-only Plugin

截至 2026 年 9 月，我特別留意到 OpenAI 舊的 [`openai/skills` repository](https://github.com/openai/skills/blob/main/README.md?utm_source=chatgpt.com) 已標示 deprecated，並把目前的 Codex Skill 與 Plugin 範例導向新的 [`openai/plugins` repository](https://github.com/openai/plugins?utm_source=chatgpt.com) 與 Plugins 文件。官方文件也明確寫出，Plugin 可以只包含 Skills，不需要 MCP Server。

這不代表 Skill 失去獨立價值。Skill 仍是工作流程本身；改變的是，當我們需要依照新的 Plugin 格式整理、安裝或交付 Skills 時，可以直接用 skill-only plugin 作為套件結構。概念從 Skill 開始思考，交付時再判斷是否包成 Plugin，會是實用的路徑。

新版文件中的 portable Plugin 以根目錄 `plugin.json` 作為 manifest，Skills 放在 `skills/`，需要時再加入 `mcp.json` 與資產等內容。`.codex-plugin/plugin.json` 仍是相容格式；OpenAI 的 Plugin Creator 也能產生相容布局。開始建立套件前，請依目前目標平台與官方文件選擇格式，不要把舊範例路徑當成唯一結構。

一個最小的 Skill-only Plugin 可以概念化為：

```text
my-first-plugin/
├── plugin.json
└── skills/
    └── hello/
        └── SKILL.md
```

這份套件可以只有說明、範本和其他工作資源，沒有 MCP、API、資料庫或 Connected App。它仍然是一個 Plugin，因為 Plugin 的核心價值是以可辨識的結構組合與交付能力，而不是一定要連外部服務。

## MCP 與 Skill 的分工：一個教流程，一個提供工具

如果希望 Agent 讀取 Google Drive、查詢 CRM、建立文件或更新 Notion，Skill 可以說明何時呼叫工具、如何判讀結果，以及怎樣完成後續步驟；MCP Server 則提供 Agent 實際可呼叫的工具與資料連線。

簡單來說：

```text
Skill = 說明怎麼完成工作
MCP   = 提供可呼叫的工具與即時資料
Plugin = 將 Skill 與需要的工具配置等包在一起
```

技能文件不會自動帶來外部帳號權限，也不會讓沒有連接的服務突然可用。實際能做什麼，仍取決於已安裝的工具、使用者授權、服務端權限，以及執行環境。

## 什麼時候用 Skill，什麼時候包成 Plugin？

| 使用情境 | 建議起點 | 判斷方式 |
| --- | --- | --- |
| 個人想固定文章、研究或簡報流程 | Skill | 流程清楚，現有工具已足夠 |
| 想讓一套成熟流程方便安裝與更新 | Skill-only Plugin | 交付與版本管理比額外工具更重要 |
| 多個緊密相關的 Skills 要一起使用 | Plugin | 使用者需要安裝一組有共同目的的工作流 |
| 流程還要讀寫外部服務 | Plugin 加 MCP Server | Skill 描述判斷步驟，MCP 提供受控工具 |

不需要等到 Skill 累積到某個固定數量才開始考慮 Plugin。只要一個成熟的 Skill 已經需要被標準化交付，skill-only plugin 就可能有用；反過來說，很多互不相關的 Skills 也未必適合硬包成一個 Plugin。關鍵是安裝、更新與使用情境是否一致。

## 從個人 Know-how 走到團隊工作流

以公司 Sales Plugin 為例，可以先整理會議準備、客戶研究、會議摘要與 Follow-up Email 等工作方法，再確認哪些步驟需要 Gmail、Calendar、CRM 或 Drive 工具支援。Skill 寫清楚流程與判斷，MCP 讓 Agent 呼叫服務，Plugin 則把相關能力整理成團隊可管理的套件。

實際導入時，還要分別處理登入、資料範圍、使用者授權與企業政策。安裝套件不等同於取得 CRM 或公司雲端資料的存取權；這些存取能力必須由服務整合與管理設定明確提供。

這也提供一條較自然的發展路徑：先自己完成一項工作，記錄穩定的 SOP，整理成 Skill 並反覆使用；當流程需要工具時再連接 MCP 或 App；當能力需要成套維護與交付時，再包裝成 Plugin。先把真實工作做好，之後再依重複模式模組化，能避免一開始就替尚未驗證的需求建造太大的架構。

## 知識產品也可能從「教你做」變成「依方法幫你做」

書、課程、影片、PDF 和範本通常傳遞的是知識，使用者還需要自己把它轉成行動。Skill 能把部分 Know-how 寫成 Agent 可遵循的工作流程；Plugin 則能進一步把相關流程、工具配置與資源組成一套交付物。

這讓課程設計也有新的方向：除了教 Prompt、圖像或影片工具，還可以教學員分析工作、建立 Skill、判斷何時需要 MCP，再把成熟且有共同目的的 Skills 包成 Plugin。交付的內容不只是「知道怎麼做」，也可以是讓 Agent 依照方法完成工作的起點。

## 結語：先設計 Skill，再依交付需求決定 Plugin

我目前會這樣記：Prompt 交代這一次的需求；Skill 保存一類工作的 Know-how；MCP 或 App 提供 Agent 可使用的能力；Plugin 將一個或多個 Skills，以及需要的工具與資源整理成套件。

所以，個人工作流可以先從 Skill 開始。當它需要版本化、團隊共用、搭配多個相關工作流或連接工具時，再考慮用 Plugin 交付。OpenAI 在 2026 年 9 月明確提供 skill-only plugin 路徑，也讓「先設計 Skill，交付時採 Plugin 結構」成為值得採用的預設思路。

## 常見問答 (FAQ)

### Q1：Codex Skill 和 Plugin 最大的差異是什麼？

Skill 描述 Agent 如何完成一類工作，通常包含指示、判斷步驟與支援資源；Plugin 是安裝與交付套件，可以包含一個或多個 Skills，並可選擇加入 MCP Server、資產等元件。

### Q2：Skill-only Plugin 需要 MCP Server 嗎？

不需要。OpenAI 官方 Plugin 架構支援只包含 Skills 的 Plugin。當工作流程仰賴外部服務資料或動作時，才需要再評估 MCP Server 或其他可用的工具連線。

### Q3：要分享 Skill，就一定得包成 Plugin 嗎？

不一定。個人使用或簡單分享可以先維持 Skill 的形式；若需要標準化安裝、一起管理版本，或與相關 Skills 和工具配置成套交付，就可以改用 Plugin。選擇應配合使用者與維護方式。

### Q4：安裝 Plugin 後，Agent 就能操作我的 Google Drive 或 CRM 嗎？

不一定。Plugin 需要包含或連接相應工具，服務端也要有適當的登入、授權與資料權限。Skill 說明工作流程，本身不會授予外部帳號的存取權。

## 官方參考資料

- [OpenAI Plugins 官方文件](https://developers.openai.com/plugins?utm_source=chatgpt.com)
- [OpenAI Plugins GitHub](https://github.com/openai/plugins?utm_source=chatgpt.com)
- [OpenAI Skills 說明](https://developers.openai.com/plugins/concepts/skills?utm_source=chatgpt.com)
- [舊版 OpenAI Skills repository deprecated 公告](https://github.com/openai/skills/blob/main/README.md?utm_source=chatgpt.com)
- [Plugin 架構](https://developers.openai.com/plugins/concepts/plugins)
- [Plugin 封裝格式](https://developers.openai.com/plugins/build/plugins)
