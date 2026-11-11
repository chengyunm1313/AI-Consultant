---
title: 不用再開一堆 AI 視窗！Grok Bot + Herdr 跨電腦 AI Agent 團隊教學
cover: /images/cover246.png
cover_position: center top
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - AI Agent
  - Vibe Coding
date: 2026-11-12 00:36:01
subtitle: 讓 Claude Code 與 Codex 接力工作的派工架構、安裝與驗收指南
description: 不用再開一堆 AI 視窗！了解如何用 Herdr 串接 Mac 與 Windows，讓 Grok Bot 透過派工橋接服務協調 Claude Code、Codex，從安裝、SSH 連線到事件驅動、任務驗收與成本管理，規劃可追蹤的 AI 團隊接力工作流。
---

以前使用 AI，我們習慣打開 ChatGPT、Claude、Codex，然後自己決定每個任務要交給誰。

寫程式找 Codex、規劃架構找 Claude Code、整理資料找另一個 AI。

工具越來越多，能力越來越強，但問題也跟著出現：

**明明已經有這麼多 AI 助手，為什麼還是要我自己當專案經理？**

最近我研究了一個很有趣的開源工具：**Herdr**。

它可以把不同電腦上的 AI Coding Agent 串接起來，讓它們互相傳遞任務、查詢執行狀態，甚至協助完成跨電腦的工作。

如果再搭配 Grok Bot 當作 AI 幕僚長，就有機會建立一套「只要交代工作，AI 就會自己找其他 AI 完成」的系統。

這篇文章就來拆解 Herdr 的技術架構、安裝方式、跨電腦派工流程，以及如何整合 Grok Bot、Claude Code 和 Codex。

本文將 Grok Bot 視為具備工具呼叫能力的聊天派工入口；實際接法取決於你使用的 Bot 實作。以下安裝與 CLI 範例依官方文件整理，跨電腦接力與網站案例則是建議的實作流程，並非本文已完成的端到端實測。Claude Code 與 Codex 的分工也是工作流示例，能力與適用情境會隨版本、方案及專案而變動。

---

## 為什麼需要跨電腦的 AI Agent 團隊？

先想像一個情境。

假設我現在有三個 AI 助手：

- Mac 上的 Claude Code：負責規劃系統架構。
- Mac 上的 Codex：負責寫程式、測試與修正。
- Windows 上的 Claude Code：負責 Windows 環境的工作。

傳統做法是什麼？

我先開 Claude Code，請它分析需求。

等它完成，再把規格複製到 Codex，請 Codex 實作。

如果需要 Windows 電腦上的工具，我還得切換電腦，重新交代任務。

等到所有工作完成，再自己檢查結果。

這其實不是 AI 自動化，而是「人類負責管理一群 AI」。

我想要的方式不太一樣。

我只要跟 Grok Bot 說：

> 幫我做一個課程網站。先分析需求，再完成網站開發，最後檢查程式碼，完成後通知我。

接下來：

1. Grok Bot 把工作拆成不同任務。
2. Claude Code 負責規劃架構。
3. Codex 根據規格開發網站。
4. 另一個 Claude Code 負責程式碼審查。
5. Grok Bot 彙整結果，通知我驗收。

整個過程，我只需要在必要時做決策。

**從「我操作 AI」變成「我管理 AI 團隊」。**

這就是 Multi-Agent Orchestration（多代理協調）的概念。

## Herdr 是什麼？先分清楚 App、TUI 與 herdr-core

Herdr 是一套以 Rust 開發的開源工具，主要用來管理終端機中的 AI Coding Agent。

它不只是一般的終端機管理器，更重要的是提供了讓不同 Agent 互相協作的能力。

在研究 Herdr 時，有一個地方需要特別注意。

Herdr 有不同的實作架構，包括原本的 TUI 終端機版本，以及新版 Herdr App 搭配 herdr-core 的架構。

這兩套系統不能直接當成同一個東西。

如果目標是跨電腦派工，我會優先研究新版的 herdr-core。

### Herdr 的核心元件

| 元件 | 功能 |
|---|---|
| Herdr App | 檢視與管理 AI Agent |
| herdr-core | 負責執行環境與 Agent 通訊 |
| hc CLI | 透過命令列控制 Agent |
| SSH | 遠端連線不同電腦 |
| Tailscale | 建立跨網路的私人連線 |
| OSC 7501 | 傳遞 Agent 執行狀態 |

其中最值得注意的是 `hc` CLI。

因為有了命令列介面，我們就不需要人工操作 Herdr 的圖形介面。

Grok Bot 接上工具呼叫或橋接服務後，可以透過程式呼叫 `hc`，啟動 Agent、傳送指令、等待執行結果。

這也是整套自動派工系統的技術基礎。

官方資源：

- [Herdr](https://herdr.dev/)
- [herdr-core](https://herdr.dev/core/)
- [GitHub](https://github.com/herdrdev/herdr)
- [herdr-core GitHub](https://github.com/herdrdev/herdr-core)

## 如何讓 Grok Bot 當 AI 幕僚長？先建立派工架構

整套系統可以分成四個層次。

**第一層：使用者**

只負責交代工作、確認方向與驗收成果。

**第二層：Grok Bot**

負責理解需求、拆解任務、決定派給哪個 Agent，以及彙整工作結果。

**第三層：Herdr**

負責連接各台電腦，啟動 Agent、傳遞工作指令及取得執行狀態。

**第四層：實際執行的 AI Agent**

包含 Claude Code、Codex，以及未來其他支援的命令列工具。

概念架構如下：

```text
             使用者
               │
          自然語言交辦
               │
               ▼
           Grok Bot
          AI 幕僚長
               │
        拆解任務、派工
               │
               ▼
       herdr-dispatcher
          派工橋接層
               │
               ▼
         Herdr / hc
               │
       ┌───────┼───────┐
       │       │       │
       ▼       ▼       ▼
      Mac     Mac    Windows
       │       │       │
     Claude  Codex   Claude
      Code            Code
       │       │       │
       └───────┼───────┘
               │
          執行結果回報
               │
               ▼
           Grok Bot
               │
          通知使用者
```

這裡有個重要觀念：

**Herdr 負責 Agent 的執行與通訊，不代表它會自動替我們完成所有專案管理工作。**

例如：

- 任務應該派給誰？
- 哪個任務必須先完成？
- 失敗時應該重試幾次？
- 哪些操作需要使用者批准？
- 如何判斷工作是否真正完成？

這些還需要 Grok Bot 或額外的派工系統處理。

因此，我建議在 Grok Bot 和 Herdr 之間增加一個 `herdr-dispatcher`。

這是我們自己規劃的橋接元件，不是 Herdr 內建的官方產品。

它的工作很單純：把 AI 幕僚長的指令轉換成安全、可追蹤的 Herdr 操作。

## 如何安裝 herdr-core 並測試本機 Agent？

接下來進入實作。

假設目前有兩台電腦：

- Mac：安裝 Claude Code 與 Codex。
- Windows：安裝 Claude Code。

目標是讓兩台電腦都能接受遠端派工。

### Step 1：Mac 安裝 herdr-core

官方提供 Shell 安裝腳本。建議先下載、檢視，再決定是否執行：

```bash
curl -fsSL https://releases.herdr.dev/core/install.sh -o herdr-install.sh
less herdr-install.sh
```

確認腳本來源、下載位置與會修改的路徑後，再於另一個步驟執行：

```bash
sh herdr-install.sh
```

安裝完成後，可以檢查 CLI：

```bash
hc --help
```

也可以查看 Herdr 提供的 Agent 操作說明：

```bash
hc --skill
```

實際支援的參數，請以目前安裝版本的說明為準。

### Step 2：Windows 安裝 herdr-core

在 PowerShell 先下載並檢視官方腳本：

```powershell
Invoke-WebRequest https://releases.herdr.dev/core/install.ps1 -OutFile herdr-install.ps1
Get-Content .\herdr-install.ps1
```

確認內容與執行範圍後，再執行：

```powershell
& .\herdr-install.ps1
```

若執行原則阻擋腳本，先確認所在組織的規範，不要直接停用防護。

安裝後檢查：

```powershell
hc --help
```

如果找不到指令，先重新開啟 PowerShell，確認安裝路徑是否已加入 PATH。Windows 上若要使用 Herdr 的 templates 或引號包住的 Shell 指令，官方 README 另提醒 PATH 需有 `sh`，例如 Git for Windows 提供的環境。

另外，兩台電腦都必須先安裝各自要執行的 AI CLI，並完成登入或 API 設定。

Herdr 不會自動提供 Claude Code 或 Codex 的模型使用額度。

### Step 3：測試本機 Agent

先在 Mac 上測試能不能啟動 Codex。

```bash
hc run --bg --name review codex "Review this project"
```

這個指令的概念是：

- `--bg`：背景執行。
- `--name review`：將工作命名為 review。
- `codex`：指定執行的工具。
- 後面的文字：交給 Agent 的任務。

接著查詢目前的 Agent：

```bash
hc ls
```

如果想追加工作：

```bash
hc send review "Also check the tests"
```

等待工作完成：

```bash
hc wait review
```

讀取最近 60 行輸出：

```bash
hc read --lines 60 review
```

這些指令展示了 Herdr 最有價值的地方。

我們不需要自己操作 Codex 視窗，就能透過程式控制工作流程。

不過要注意，`hc wait` 的等待結果不代表程式碼已經通過測試。若回傳仍在執行或需要介入，應保留任務識別資訊再讀取狀態；正式系統仍然需要獨立驗收。

以上基本指令可對照 [Herdr Core 官方說明](https://herdr.dev/core/)。

## Mac 如何透過 SSH 派工給 Windows？

本機執行成功後，下一步就是跨電腦。

Herdr 可以搭配 SSH 連接遠端電腦。

如果兩台電腦不在同一個區域網路，也可以考慮使用 Tailscale。

Tailscale 的好處是可以建立私人網路，減少直接暴露 SSH 服務到公開網際網路的需求。

但 Tailscale 只是網路連線層，仍然需要正確設定 SSH 驗證與存取權限。

### Step 1：確認 SSH 可以連線

先確認 Windows 已安裝並啟用 OpenSSH Server，設定允許連線的使用者。

在 Mac 上測試：

```bash
ssh username@windows-host
```

其中 `username` 和 `windows-host` 必須替換成實際使用者與主機名稱。

建議使用 SSH 金鑰驗證，不要把密碼寫進 AI Agent 的提示詞。

### Step 2：加入遠端機器

依照 Herdr CLI 的遠端機器管理功能，加入電腦：

```bash
hc machine add username@windows-host --name windows-host
```

完成後，可以檢查機器與 Agent 狀態。

```bash
hc ls
```

如果遠端機器名稱為 `windows-host`，可以嘗試指定遠端機器執行 Claude：

```bash
hc run --on windows-host --bg claude
```

這裡的遠端機器名稱、CLI 參數與支援方式，應先使用 `hc --help` 和 `hc --skill` 核對。

Windows 的 SSH Shell、工作目錄、PATH 與 Claude Code 登入狀態，也可能影響遠端執行結果。遠端工作與檔案仍留在目標電腦，SSH 串接不會自動同步專案；相關限制可對照 [herdr-core 官方 README](https://github.com/herdrdev/herdr-core)。

### Step 3：驗證跨電腦派工

建議第一個測試不要太複雜。

可以讓 Windows 上的 Claude Code：

1. 讀取指定測試專案。
2. 分析 README。
3. 產出一份簡短摘要。
4. 將結果寫入指定檔案。

接著由 Mac 端取得執行結果。

如果能順利完成，代表基本的跨電腦派工通道已經建立。

## 如何透過 herdr-dispatcher 讓 Grok Bot 接管派工？

接下來才是整套架構最有趣的部分。

我們不希望每次都要手動輸入：

```bash
hc run ...
```

而是希望直接跟 Grok Bot 說：

> 請 Windows 的 Claude 幫我分析這個專案，完成後再交給 Mac 的 Codex 做程式碼審查。

要做到這件事，我建議建立一個派工橋接服務。

### herdr-dispatcher 的五個基本功能

| 功能 | 說明 |
|---|---|
| create_task | 建立工單 |
| assign_task | 指定 Agent 與電腦 |
| get_status | 查詢工作進度 |
| get_result | 讀取工作成果 |
| cancel_task | 取消執行中的任務 |

這五個是建議設計的 API，不是 Herdr 原生 API 名稱。

例如 Grok Bot 建立一張工單：

```json
{
  "task_id": "TASK-001",
  "title": "分析網站專案",
  "agent": "claude",
  "machine": "windows-host",
  "status": "pending"
}
```

派工服務收到後：

1. 驗證 Grok Bot 的請求。
2. 檢查目標機器是否允許執行任務。
3. 呼叫 Herdr CLI。
4. 儲存工單與執行識別資訊。
5. 持續取得 Agent 狀態。
6. 完成後回報 Grok Bot。

這樣就能把聊天介面與實際執行環境分開。

而且未來想更換 AI 幕僚長，也不用重新設計底層 Agent 系統。

### 建議增加的任務狀態

不要只用「進行中」與「完成」兩種狀態。

至少應該有：

```text
pending
   │
   ▼
assigned
   │
   ▼
running
   │
   ├──► waiting_approval
   │
   ├──► failed
   │
   ▼
completed
```

如果任務失敗，應該記錄失敗原因、執行次數與是否允許重試。

另外，對於刪除檔案、部署正式網站、推送 GitHub 主分支等操作，最好保留人工批准機制。

這樣才能讓 AI 自動化長時間運作，而不是出問題時完全不知道發生什麼事。

## 情境示例：AI 團隊如何接力開發網站？

假設今天我要建立一個新的 AI 課程網站。

我只需要跟 Grok Bot 說：

> 幫我建立一個 AI Agent 教學網站。先規劃網站架構，再完成前端開發，最後檢查程式碼並部署測試版本。

Grok Bot 可以拆成四張工單。

**工單一：規劃網站**

交給 Mac 上的 Claude Code。

工作內容包含：

- 分析需求。
- 設計網站架構。
- 規劃頁面與功能。
- 產出技術規格。

**工單二：網站開發**

交給 Mac 上的 Codex。

工作內容包含：

- 根據規格撰寫程式碼。
- 建立前端元件。
- 加入互動功能。
- 執行測試。

**工單三：程式碼審查**

交給另一個 Claude Code 工作階段。

工作內容包含：

- 檢查程式碼結構。
- 檢查安全性問題。
- 找出潛在 Bug。
- 提出修正建議。

**工單四：彙整與驗收**

由 Grok Bot 負責。

確認測試結果、彙整 GitHub Commit 與網站預覽網址，最後通知我：

「網站測試版本完成，請確認是否部署正式環境。」

這才是我期待的 AI Agent 工作模式。

不是讓一個 AI 從頭做到尾，而是讓不同 AI 依照專長分工。

不過，多 Agent 不一定比單一 Agent 更有效率。

如果只是修改一個按鈕顏色，交給 Codex 直接完成就好。

只有當任務可以拆分、需要不同環境，或獨立審查能帶來明顯價值時，多 Agent 協作才值得使用。

## 如何用事件驅動減少 AI Agent 的無效檢查？

這也是實作時很容易忽略的問題。

假設你有七個 Agent，每個都設定每小時醒來一次，檢查有沒有工作。

如果全天候執行，一週會產生：

7 × 24 × 7 = 1,176 次檢查。

即使完全沒有工作，也會一直執行檢查。不過，這是排程次數；是否消耗模型額度，取決於每次檢查有沒有實際呼叫模型。

我比較推薦使用**事件驅動（Event-Driven）架構**。

只保留一個主要派工入口。

當有新工單時，才通知對應的 Agent。

當 Agent 完成後，再觸發下一張工單。

例如：

```text
Grok Bot 建立工單
        │
        ▼
Claude Code 規劃
        │
     完成事件
        │
        ▼
Codex 開發
        │
     完成事件
        │
        ▼
Claude Code 審查
        │
     完成事件
        │
        ▼
Grok Bot 通知
```

這種做法可以減少無意義的輪詢。

但事件驅動不代表完全不需要狀態檢查。

實務上還是建議有低頻率的健康檢查，處理 Agent 當機、網路中斷或任務遺失的情況。

## 跨電腦協作時，GitHub 與 Google Drive 如何分工？

跨電腦協作還有一個重要問題：

**不同電腦上的 AI，怎麼取得同一份工作資料？**

我不建議所有檔案都透過聊天訊息傳來傳去。

可以依照檔案類型分工。

| 工具 | 建議用途 |
|---|---|
| GitHub | 程式碼、規格、版本控制 |
| Google Drive | 圖片、影片、報告、教材 |
| SQLite / PostgreSQL | 工單與執行狀態 |
| Herdr | Agent 執行與通訊 |
| Grok Bot | 派工與使用者互動 |

例如 AI 條漫專案：

Claude Code 完成劇本後，將 Markdown 規格提交到 GitHub。

Codex 取得規格，建立條漫網站。

大型圖片與影片素材則放在 Google Drive。

最後 Grok Bot 只需要回報：

- 劇本版本。
- GitHub Commit。
- 網站預覽網址。
- 待審核事項。

這樣比讓 Agent 不斷複製大量內容更容易管理。

如果多個 Agent 會修改同一個專案，也應該使用獨立 Git Branch 或 Git Worktree，避免互相覆蓋程式碼。

## 建立 AI Agent 團隊需要哪些成本？

Herdr 的開源版本本身不需要另外支付軟體授權費。

但整套系統並不是完全零成本。

主要成本包括：

**AI 模型費用**

Claude Code、Codex、Grok Bot 等工具，仍然依照各自的訂閱方案、API 費率及使用限制計算。

**電腦與運算資源**

如果直接使用既有 Mac 與 Windows，通常不需要另外購買硬體。

如果要全天候執行，則可能需要常駐主機。

**網路與儲存**

SSH 可以直接使用既有網路。

Tailscale 的實際費用依使用方案而定。

GitHub、Google Drive 也可能因儲存量或團隊需求產生額外費用。

**維護成本**

這是最容易被忽略的部分。

跨電腦 Agent 系統需要處理權限、網路中斷、版本更新、工單失敗、重試及執行紀錄。

所以我不建議一開始就部署十幾個 Agent。

先用兩台電腦、三個 Agent，完成一個真實工作流程，會比較容易驗證投資報酬。

## 跨電腦派工最需要注意的五個問題

### 1. Agent 完成不等於任務成功

AI 回報完成後，還是要檢查實際產出。

例如程式碼是否通過測試、檔案是否存在、網站是否能正常開啟。

### 2. 遠端執行必須限制權限

不要讓聊天介面可以直接執行任意 Shell 指令。

建議透過派工橋接服務建立允許清單，限制可執行的工具、工作目錄與操作範圍。

### 3. 任務必須可以追蹤

每張工單都應該有唯一 ID、負責 Agent、建立時間、開始時間、完成時間、輸出位置及錯誤紀錄。

### 4. 電腦重新啟動後如何恢復？

Herdr 能維持終端工作，但這不等於具備完整的持久化任務佇列。

如果電腦重新開機或執行環境停止，必須另外設計恢復機制。

### 5. 多 Agent 需要避免衝突

同一個專案如果有兩個 Agent 同時修改相同檔案，很容易發生覆蓋或合併衝突。

可以使用 Git Worktree、工作鎖定與明確的任務邊界處理。

## 如何分三階段建立最小可行的 AI 團隊？

如果你也想建立自己的 AI Agent 團隊，我建議分三個階段。

### 第一階段：跨電腦連線

先完成：

- Mac 安裝 herdr-core。
- Windows 安裝 herdr-core。
- 建立 SSH 或 Tailscale 連線。
- 成功從一台電腦啟動另一台電腦的 Agent。
- 成功取得遠端 Agent 的執行結果。

這個階段先不要整合 Grok Bot。

目標只有一個：確認跨電腦 Agent 可以正常運作。

### 第二階段：自動派工

建立 `herdr-dispatcher`。

讓 Grok Bot 可以：

- 建立工單。
- 指派 Agent。
- 查詢狀態。
- 取得結果。
- 回報異常。

這個階段完成後，就能從聊天視窗管理 AI 團隊。

### 第三階段：完整工作流

最後才加入：

- 任務相依關係。
- 自動接力。
- GitHub 整合。
- Google Drive 整合。
- 失敗重試。
- 人工審核。
- 定期任務。
- 成本與額度監控。

做到這裡，才算真正建立一套可以持續運作的 AI Agent 工作系統。

---

## 結語：未來不是你會用多少 AI，而是你能管理多少 AI

過去一年，我們一直在學怎麼使用 AI 工具。

從 ChatGPT、Claude、Codex，到各種 AI Agent。

但我覺得下一個值得研究的方向，是讓這些 AI 不再各自獨立工作。

以前，我們需要自己打開每個 AI 視窗，交代任務、複製資料、檢查結果。

現在，透過 Grok Bot、Herdr 與適當的派工架構，我們可以嘗試把這些工作交給 AI 自己協調。

**人類負責決策，AI 幕僚長負責管理，AI Agent 負責執行。**

當然，這不代表所有事情都能完全無人化。

真正重要的，是建立清楚的任務分工、驗收標準、權限管理與錯誤處理。

我的目標也不是讓電腦上同時跑最多 AI。

而是有一天，我只需要打開一個聊天視窗，說出今天要完成的工作。

剩下的事情，就交給我的 AI 小團隊。

完成後，再回來跟我報告。

這才是我真正期待的 AI Agent 自動化。

如果你也有一整隊 AI 助手，你最想先把哪件麻煩事交出去？

---

## 常見問答 (FAQ)

### Q1：安裝 Herdr 後，Grok Bot 就會自動指揮 Claude Code 和 Codex 嗎？

不會。Herdr 提供終端執行與通訊能力；Grok Bot 仍須接上工具呼叫或自建的派工橋接服務，才能把聊天需求轉成 `hc` 操作。本文的 `herdr-dispatcher` 與工單 API 是建議設計，並非官方內建整合。

### Q2：Mac 與 Windows 不在同一個網路，也能跨電腦派工嗎？

可以規劃透過 SSH 連線，必要時搭配 Tailscale 建立私人網路。前提是遠端 SSH、帳號權限、herdr-core、AI CLI 登入與工作目錄都已設定；應先完成一個小型遠端任務，再接上多階段工作流。

### Q3：Herdr 免費，就能免費執行整個 AI 團隊嗎？

不能這樣推論。開源軟體授權與模型使用費用是不同項目；Claude Code、Codex 與 Grok Bot 相關的訂閱或 API、常駐電腦、網路儲存及維護都可能產生成本。建議以少量 Agent 與真實工單測試，再評估是否擴大。

延伸閱讀：[學會管理 AI 員工](/posts/ai-team-management-guide/)、[AI 幕僚長與私人 LINE 管理](/posts/ai-agent-line-management/)。

## 參考資源

- [Herdr 官方網站](https://herdr.dev/)
- [Herdr Core](https://herdr.dev/core/)
- [Herdr Guide](https://herdr.dev/guide/)
- [Herdr GitHub](https://github.com/herdrdev/herdr)
- [herdr-core GitHub](https://github.com/herdrdev/herdr-core)
- [Tailscale](https://tailscale.com/)
- [Claude Code](https://code.claude.com/docs/)
- [OpenAI Codex](https://developers.openai.com/codex/)

*本文的 Herdr CLI 範例以所研究的官方文件為基礎，實際安裝與參數請依使用版本確認。Grok Bot 派工橋接服務、工單 API 與多階段自動化流程屬於建議實作架構，不代表 Herdr 已內建所有功能。*
