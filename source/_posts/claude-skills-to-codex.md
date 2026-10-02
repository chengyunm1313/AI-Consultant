---
title: "Claude Skill 可以用在 Codex 嗎？Claude → Codex Agent Skills 遷移指南"
cover: /images/cover201.png
toc: true
categories:
  - 生成式AI應用
tags:
  - Claude
  - Codex
  - Vibe Coding
date: 2026-10-02 17:54:44
subtitle: 從可攜式 SKILL.md 到平台專屬功能，用卡斯柏的設計風格圖鑑整理一套可檢查、可驗證的遷移流程。
description: "看到 Claude Code 的設計 Skill 很喜歡，想搬到 Codex？本文用卡斯柏設計風格圖鑑為例，拆解可共用的 SKILL.md、必須改寫的平台設定，並整理檢查、遷移與實際驗證流程。"
---

最近看到六角學院卡斯柏整理的「Claude Code Skill 設計風格圖鑑」，我第一個念頭是：這些設計方法都包成 Claude Skill 了，如果我平常主要用 Codex，還能不能拿來用？

簡單說：**很多 Skill 的核心方法可以沿用，但不代表 Claude 與 Codex 的功能可以直接一鍵互換。**如果內容主要是設計規則、檢查清單和工作步驟，通常很容易搬；如果它仰賴特定工具權限、Hook、子代理或插件設定，就要逐項調整並實際驗證。

本文用卡斯柏的圖鑑當例子，整理如何把一份 Claude Skill 轉成 Codex 可發現、可執行，也方便持續維護的工作方法。

> 本文依 2026 年 10 月 2 日可查到的官方文件整理。Agent Skills 與 Codex 插件規格仍會演進；安裝或遷移前，請再核對當下文件與工具版本。

## 先分清楚 Skill 格式和執行平台

Agent Skill 通常是一個資料夾，核心是 `SKILL.md`，可以再附上 `references/`、`assets/` 和 `scripts/`。`SKILL.md` 描述何時使用這份 Skill，以及 Agent 要遵循的工作方法。這套目錄概念採用開放的 Agent Skills 標準，Claude Code 和 Codex 都有自己的 Skill 支援方式。

兩邊載入本機 Skill 的路徑不同。Claude Code 的專案 Skill 常放在 `.claude/skills/<skill-name>/`；Codex 則會從專案中的 `.agents/skills/` 掃描。Codex 的官方文件也說明，這個目錄適合專案內使用；若要散布給其他人，則可把 Skill 包裝成 Plugin。

所以，看到兩邊都有 `SKILL.md`，可以先把它理解成「可攜的工作方法格式」，不要直接推論裡面的每個欄位、指令或執行行為都相容。

## 只有 SKILL.md 和參考資料時，怎麼搬？

如果 Skill 的內容是設計原則、操作步驟、範例和檢查清單，通常可以先做小幅遷移：

1. 讀完 `SKILL.md`，確認它要求 Agent 做什麼、何時啟用。
2. 一併保留 Skill 用到的 `references/`、`assets/` 和 `scripts/`。
3. 複製到 Codex 專案的 `.agents/skills/<skill-name>/`。
4. 把 Claude 專屬路徑、工具名稱和呼叫方式改成 Codex 可用的寫法。
5. 在實際任務中明確呼叫一次，再檢查產出是否遵循 Skill 的規則。

例如，先確認目標資料夾不存在，再複製整個 Skill 資料夾：

```bash
mkdir -p .agents/skills
cp -R .claude/skills/<skill-name> .agents/skills/<skill-name>
```

若 Skill 原本就在個人目錄或某個插件裡，來源路徑要依實際位置調整。複製前先看過其中的腳本與外部依賴；不要只因為資料夾名稱叫 Skill，就直接執行裡面的程式。

以設計風格 Skill 為例，核心內容可能是字體層級、版面網格、留白、圖片運用、動態效果、響應式規則與反模式。這些方法通常不依賴特定模型，搬移後仍然有參考價值。

## 哪些 Claude 設定不能直接照搬？

實際要花心力的地方，往往是 `SKILL.md` 的前置資料，以及文字背後預設的產品行為。

- **`allowed-tools` 不等於 Codex 的權限設定。** Agent Skills 標準將這個欄位列為實驗性項目，各家支援程度可能不同。Codex 的遷移參考也提醒，工具清單可以轉成文字指引，但不會因此成為嚴格的權限邊界。真正的權限要在執行環境或平台設定中處理。
- **`model`、`effort`、`context`、`user-invocable` 和 `disable-model-invocation` 等欄位，可能是 Claude 專屬或語意不同的設定。**逐項查清楚它們在來源平台控制什麼，再決定要刪除、改寫為一般指引，或放到 Codex 支援的設定中。
- **Hooks、子代理與指令需要分開檢查。**例如，Claude 的 Slash Command 可以轉成 Skill 的概念，但參數代換、工具呼叫和執行時機未必相同；Hook 的事件種類與行為也不保證一對一對應。
- **MCP 設定不是 Skill 內容本身。**Skill 可以說明如何使用工具，但伺服器設定、認證與工具權限要在 Codex 支援的整合方式中另外處理。

若原本的 Claude Skill 帶有 `hooks`、`agents`、`.mcp.json`、`commands/` 或 `plugin.json`，先列清楚每一項功能，再決定要手動改寫、用 MCP／Plugin 重建，或保留為人工處理事項。不要只移動資料夾就宣稱遷移完成。

## 官方遷移工具可以參考，但要先檢查新舊版本

OpenAI 的舊版 [Skills Catalog for Codex](https://github.com/openai/skills) 曾提供 `migrate-to-codex` Skill。它設計的流程包含掃描來源、產生計畫、檢查風險、Dry Run、執行遷移，再驗證目標檔案。

**時效提醒：截至本文查核日，該 GitHub 專案首頁已標示 deprecated；其中的遷移 Skill 仍可查閱，但不應把它當成保證持續更新的安裝或遷移入口。**它的差異參考文件也標註最後檢查日期為 2026 年 4 月。若要用這份工具，先確認目前版本、命令選項和 Codex 官方文件，再檢查 Dry Run 的檔案清單；不要未審查就執行會寫入或刪除檔案的步驟。

目前 OpenAI 的文件說明 Codex 可從 `.agents/skills/` 載入本機 Skill；若要跨專案散布或搭配連接器，則可依現行 Plugin 文件打包。OpenAI 也提供 Claude Code Plugin 遷移指引，逐項說明哪些 `skills/`、`commands/`、Hook 和設定需要保留、改寫或另外處理。這些文件比沿用舊版範例更適合當下的檢查起點。

## 我會採用的遷移工作流

把 Skill 當成程式一樣檢查，比「搬過去應該就能跑」可靠：

```text
盤點來源
  ↓
確認 Codex 支援範圍
  ↓
複製 Skill 和必要資源
  ↓
改寫平台專屬欄位與呼叫方式
  ↓
檢查腳本、路徑和權限假設
  ↓
用一個真實任務驗證
```

只有單一 `SKILL.md` 的情況，可以手動遷移並逐段檢查；如果整個 Claude Plugin 還包含 MCP、Hook、Subagent 和 Marketplace 設定，就先分拆成不同能力處理。每完成一類設定，都要確認它在 Codex 端的實際替代方式，並檢查遷移後的 Skill 能否找到原本依賴的檔案。

完成檔案搬移後，不要只看資料夾出現就算過關。先確認 Codex 能發現這個 Skill，再用明確的提示詞呼叫它；觀察它是否真的套用設計規則、遵循限制並找到參考資料。遇到結果不符時，修正 Skill 後再跑一次相同任務。

## `npx skills add` 是社群工具，不是 OpenAI 官方指令

另一種常見做法是使用 Vercel Labs 維護的 Skills CLI：

```bash
npx skills add OWNER/REPO
```

它可以協助從 GitHub 等來源安裝 Skill，不過這是第三方工具，不是 OpenAI Codex 的官方指令。使用前先確認來源 Repo、版本、Skill 實際內容、會執行的腳本、權限和檔案寫入位置。若只是移轉單一 Skill，手動檢視及複製往往更容易知道哪些內容真的進入 Codex。

## 把設計風格圖鑑變成自己的 Design Skill Library

我覺得卡斯柏圖鑑最值得帶走的，不是收集一大堆別人的 Skill，而是拆解它們背後的設計方法。看到喜歡的網站時，可以問：它怎麼使用字體、留白、網格、層次、圖片、動態、互動與響應式版面？哪些反模式值得寫進檢查清單？

再把反覆會用到的方法整理成小而清楚的 Skill，例如：

```text
.agents/skills/
├── editorial-web-design/
├── landing-page-design/
├── dashboard-design/
├── motion-design/
└── design-review/
```

開始設計頁面時，按需求組合相關 Skills，再請 Agent 依 `design-review` 檢查層級、留白、手機版與動畫。這種模組化方式比較容易逐項維護，也比把 UI、UX、SEO、動畫、框架、文案和部署全塞進一個超大型 Skill 更清楚。

Skill 累積的是可重複執行的工作方法，不是某個模型的永久能力保證。模型和產品功能會改版，Skill 的路徑、工具與規則也要跟著實際環境檢查；能跨平台重用的部分，才是真正留下來的專業方法。

如果你也在整理 Codex 和 Claude 的工作流程，可以延伸閱讀[我把 ChatGPT 接上開發台 MCP，讓 Codex 接手實作的流程](/posts/chatgpt-codex-ticket-workflow/)。

## 常見問答 (FAQ)

### Q1：Claude 的 `SKILL.md` 可以直接放進 Codex 嗎？

若內容主要是一般文字指令、範例與參考檔案，通常可以先複製到專案的 `.agents/skills/<skill-name>/` 再測試；但 Claude 專屬的 frontmatter、Hook、工具權限與呼叫方式需要檢查，不能假設完全相容。

### Q2：Codex 專案 Skill 應該放在哪個資料夾？

Codex 官方文件列出的專案 Skill 位置是 `.agents/skills/`。每個 Skill 資料夾至少要有含 `name` 與 `description` 的 `SKILL.md`；參考資料、腳本和資產可依需要放在同一個資料夾。

### Q3：Claude Plugin 的 Hooks、MCP 和 Subagents 也會一起搬過去嗎？

不一定。這些功能和 Skill 指令使用不同的執行方式，要依 Codex 支援的 Hook、MCP、Plugin 或 Agent 設定分別檢查；有些行為沒有直接對應，需要人工重寫或保留為手動步驟。

### Q4：`npx skills add` 是 Codex 官方安裝工具嗎？

不是。它是 Vercel Labs 維護的跨 Agent Skills CLI。它可以安裝 Skill，但使用前仍要檢查來源與內容；Codex 本身也有官方文件描述本機 Skill 的位置和 Plugin 發佈方式。

## 參考資料

- [卡斯柏｜Claude Code Skill 設計風格圖鑑](https://www.casper.tw/claude-skill-design-gallery/)
- [Anthropic｜Claude Code Skills](https://code.claude.com/docs/en/skills)
- [OpenAI｜Build skills for ChatGPT and Codex](https://developers.openai.com/codex/skills)
- [OpenAI｜Skills Plugin concept](https://developers.openai.com/plugins/concepts/skills)
- [OpenAI｜Submit your Claude Code plugin](https://developers.openai.com/plugins/guides/submit-claude-plugin)
- [Agent Skills｜Open Standard](https://agentskills.io/specification)
- [OpenAI｜舊 Skills Catalog 與 migrate-to-codex 資料](https://github.com/openai/skills/tree/main/skills/.curated/migrate-to-codex)（查閱時請留意該 Repository 的 deprecated 標示）
- [Vercel Labs｜Skills CLI](https://github.com/vercel-labs/skills)
