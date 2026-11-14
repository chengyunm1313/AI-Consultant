---
title: 不用買三台 Mac，也能打造 24×7 AI Agent 工作站！Herdr × Claude Code × Tailscale 完整實戰教學
cover: /images/cover250.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - AI工具
  - Vibe Coding
date: 2026-11-14 23:42:05
subtitle:
description: 不用一次買三台 Mac，也能用現有設備打造 24×7 AI Agent 工作站。本文拆解 Herdr、Claude Code、Tailscale、Tart 與 Remote Control，帶你完成遠端連線、工作階段管理，並規劃排程、派工、驗收與成本控管。
---

最近看到一位開發者分享自己的 AI 工作流，讓我覺得很有意思。

依照那則分享，他買了三台 Mac，使用兩個 Claude Code 高階訂閱帳號，總共執行八個 AI Agents。每個 Agent 都有自己的 Tart 虛擬機，再透過 Herdr、Tailscale 和 Claude Code Remote Control，讓整套系統可以遠端操作、長時間執行。

他的工作包含開發、寫書、製作講義、簡報、研究新技術，甚至整理郵件與 AI 新聞。這些工作逐漸從自己動手，變成由 AI Agent 負責。

而且不只是坐在電腦前操作，出差在外也能透過手機或筆電，接手原本正在執行的工作。

看到這裡，我開始思考：**我們真的需要三台 Mac、八個 Agent，才能打造自己的 24 小時 AI 團隊嗎？**

研究之後，我發現答案是不一定。真正值得學習的，是這套架構背後的設計思維。

這篇就來拆解核心技術、實際安裝方法、成本，以及如何利用現有設備，打造自己的 24×7 AI Agent 工作站。

> 閱讀範圍：開場的設備數量、訂閱數量與工作內容，是作者轉述的開發者分享；本文未取得原始分享連結，並非本文實測紀錄。以下安裝步驟供讀者實作驗證；Dispatcher 與跨設備接力流程屬於延伸設計，不是安裝工具後就會自動具備的功能。

## 一、24×7 AI Agent 和一般 AI 助手差在哪裡？

我們平常使用 ChatGPT、Claude、Gemini，大部分都是這樣：

1. 打開聊天介面。
2. 輸入問題或交代工作。
3. 等待 AI 回答。
4. 自己檢查結果。
5. 再交代下一件事。

這種模式比較像是「AI 助手」。24×7 AI Agent 則像是一個隨時待命的數位工作團隊，例如可以規劃這樣的工作日：

| 時間 | Agent | 預期工作 |
| --- | --- | --- |
| 早上六點 | 研究 Agent | 整理昨天的重要 AI 新聞 |
| 早上七點 | 教材 Agent | 根據研究結果，產生技術教學文章草稿 |
| 早上八點 | 開發 Agent | 檢查 GitHub 專案、執行測試並整理異常 |
| 下午 | 影音 Agent | 處理影片素材、字幕及剪輯工作 |
| 晚上 | 幕僚長 Agent | 彙整成果，產生每日報告 |

你不需要一直坐在電腦前面盯著它們。不過，**24×7 在線，不等於 AI 真的會自動工作。**

要做到真正的自動化，至少需要五個部分：

- 持續運作的電腦或伺服器。
- 能執行工作的 AI Agent。
- 排程或事件觸發機制。
- 任務管理與失敗重試機制。
- 遠端監控及通知機制。

少了其中幾個，可能只是讓 AI 一直開著，卻沒有真正提高工作效率。

## 二、先認識五個核心工具，各自解決什麼問題？

### 1. Claude Code：負責工作的 AI 員工

[Claude Code](https://code.claude.com/docs/en/overview) 是 Anthropic 推出的 AI Coding Agent。雖然名字裡有 Code，但它不只能寫程式。

只要工作能透過檔案、指令、API 或其他支援的工具完成，就有機會交給它處理，例如：

- 開發網站與應用程式、修改 GitHub 專案。
- 撰寫 Markdown 教材、整理研究資料及產生簡報內容。
- 執行 Python 程式、批次處理文件。
- 操作已設定且支援的外部工具。

與一般聊天式 AI 最大的差別，是 Claude Code 可以直接在工作環境中執行操作。例如你交代：

> 幫我檢查這個網站專案，把錯誤修好，測試通過後整理修改報告。

它可以讀取程式碼、修改檔案、執行測試，再回報結果；前提是你已提供適當的工作環境、工具與權限。

### 2. Herdr：集中管理整隊 Agent 的工作階段

如果你同時開啟好幾個 Claude Code、Codex 或 OpenCode，可能會遇到這種情況：一個視窗正在寫程式、另一個跑測試、第三個等待回答，第四個則不知道什麼時候已經失敗。最後，你花很多時間切換視窗、檢查進度。

[Herdr](https://herdr.dev) 就是想改善這類問題。它能集中管理多個 Agent 的終端機工作階段；但必須先分清楚目前官方的兩條產品路線：

- **Herdr TUI**：終端機介面，使用自己的背景 server；本文的 `herdr` 指令與 [herdrdev/herdr](https://github.com/herdrdev/herdr) repo 屬於這條路線。
- **Herdr App、手機 App 與 Herdr Core**：另一套以 Core 管理工作階段的架構，須依對應文件設定。官方首頁說明，TUI 與 App 不共用 Agent，不能假設 TUI 開出的工作階段會直接出現在 App。

Herdr TUI 的主要能力包括：

| 能力 | 實際意義 |
| --- | --- |
| 工作階段持續存在 | 終端機關閉或 SSH 中斷後，背景 server 可維持窗格內的程序；主機關機仍會中斷工作 |
| 跨電腦管理 | 透過 SSH 連接其他設備上的工作階段，仍須具備連線與驗證條件 |
| Agent 狀態監控 | 在支援的整合與狀態回報機制下，辨識工作中、閒置或等待輸入等狀態 |
| 程式化操作 | 提供 CLI 與 Socket API，讓其他程式管理窗格及工作階段 |

這些介面讓另一個 AI Agent 有機會參與協調工作。不過，Herdr 的工作階段管理不能直接取代完整的任務排程、持久化佇列、重試、權限審核與成果驗收。

功能與指令請以安裝版本的 [TUI 文件](https://herdr.dev/docs/)及 [Socket API 文件](https://herdr.dev/docs/socket-api/)為準。

### 3. Tailscale：讓不同電腦建立私人連線

假設你有家裡的 Mac、辦公室的 Windows，以及 Oracle Cloud 上的 Linux VM。這三台設備可能位於不同網路。

傳統做法可能需要處理固定 IP、Port Forwarding、防火牆與 VPN。[Tailscale](https://tailscale.com) 利用 WireGuard 技術簡化私人加密網路的建立。設備加入同一個 Tailnet，並符合存取權限設定後，就能透過私人網路連線。

你可以人在外面用筆電連回家裡的 Mac，或讓雲端 Linux 連接辦公室的 Windows。不過，Tailscale 負責的是網路連線，Agent 的啟動與派工仍要另外設定。

### 4. Tart：在有需要時提供獨立虛擬機

[Tart](https://tart.run) 是針對 Apple Silicon 設計的虛擬機管理工具，可以執行 macOS 與 Linux VM；原始碼位於 [cirruslabs/tart](https://github.com/cirruslabs/tart)。

開場分享採用的方式，是讓不同 Agent 在各自的 Tart VM 工作。這能減少環境衝突，例如 Agent A 安裝 Node.js 套件、Agent B 修改 Python 環境、Agent C 更新系統設定時，不必全部共用同一套作業系統環境。

但虛擬機需要額外 CPU、記憶體與磁碟空間。如果 Mac 只有 16GB RAM，我不建議一開始就替每個 Agent 建立一台 VM。

比較實際的方式，是先用不同工作目錄搭配 Git Worktree；確實需要隔離作業系統或相依套件時，再考慮 Tart。使用前也應確認所選版本的授權與使用條件，不把「可查看原始碼」直接當成所有用途都免費或無限制。

### 5. Claude Code Remote Control：人在外面也能接手

假設 Claude Code 正在家裡的 Mac 工作，而你已經出門。當它需要確認下一步時，可以透過 [Remote Control](https://code.claude.com/docs/en/remote-control)，從支援的 Claude 網頁或手機介面接續本機工作階段。

在 Claude Code 裡可以輸入：

```text
/remote-control
```

實際執行的仍是原本的電腦，電腦必須保持開機、Claude 程序持續運作且能連網。休眠或網路中斷時會影響可用性，恢復後的重新連線行為也要實測。

可用性受到訂閱、登入方式、組織政策與版本影響；目前官方文件說明 API key 不支援 Remote Control，使用前應查看最新需求。它與透過 Tailscale 建立 SSH 連線是兩條不同的遠端操作路徑，啟用 Remote Control 本身不要求先安裝 Tailscale。

## 三、如何把五個工具整合成工作系統？

我會把延伸架構分成五層：

| 層級 | 角色或工具 | 負責事項 |
| --- | --- | --- |
| 第一層：使用者 | 手機、筆電、聊天介面 | 交代工作、審核成果 |
| 第二層：AI 幕僚長 | Dot、Grok Bot 或自建 Dispatcher | 分析工作、判斷所需資料與權限；能否串接須另外確認 |
| 第三層：任務管理 | 任務佇列、排程器、資料庫 | 保存任務、依賴關係、狀態與重試紀錄 |
| 第四層：執行環境 | Herdr、Tailscale、必要時使用 Tart | 管理工作階段、連線與環境隔離 |
| 第五層：實際執行 | Claude Code、Codex、OpenCode 等 | 執行任務並回報成果 |

例如任務管理層可以記錄：Task-001 研究 AI 新聞、Task-002 撰寫教學文章、Task-003 更新課程網站、Task-004 執行 GitHub 測試。

完整流程是：

```text
使用者交代工作 → AI 幕僚長分析 → 建立任務 → 指派 Agent
→ 執行工作 → 驗收成果 → 通知使用者
```

這才是一套比較完整的 AI Agent 工作系統。以下先建立能遠端管理的基礎環境，再說明派工設計。

## 四、實戰第一步：安裝 Tailscale 並確認設備連線

這裡假設你有一台 Mac、一台 Windows，以及一台 Linux 雲端 VM。沒有三台設備也沒關係，只用 Mac 就可以先測試本機工作階段；跨設備連線則需要另一台已加入網路的設備。

### Step 1：下載並登入同一個 Tailnet

前往 [Tailscale 下載頁](https://tailscale.com/download)，依照作業系統安裝。Mac 與 Windows 都有圖形介面版本；安裝完成後，登入同一個帳號或受邀加入組織的 Tailnet。

### Step 2：檢查設備狀態與 IP

在已安裝且可使用 Tailscale CLI 的 Mac 終端機輸入：

```bash
tailscale status
tailscale ip -4
```

Tailscale IPv4 通常位於 `100.64.0.0/10` 範圍。再確認另一台設備：

```bash
tailscale ping <另一台設備名稱或IP>
```

若要使用 SSH 遠端操作，還需要在目標設備啟用 SSH 服務、設定帳號驗證及存取權限。**Tailscale 連線成功，不代表 SSH 已開啟。**

## 五、實戰第二步：安裝 Herdr TUI 並測試工作階段恢復

本文這一步安裝的是 **Herdr TUI**。官方提供的一行安裝方式是：

```bash
curl -fsSL https://herdr.dev/install.sh | sh
```

這會直接下載並執行遠端腳本。實作時，我建議先下載、閱讀內容，再決定是否安裝：

```bash
curl -fsSL https://herdr.dev/install.sh -o herdr-install.sh
less herdr-install.sh
```

確認來源、腳本內容、下載項目、寫入路徑與權限需求，並接受安裝行為後，再執行已檢查的本機檔案：

```bash
sh herdr-install.sh
```

以上是文章教學指令；安裝方式可能隨版本調整，請對照 [Herdr 官方安裝說明](https://herdr.dev/docs/install/)。安裝完成後，在工作目錄啟動：

```bash
herdr
```

先建立少量窗格或工作區，例如 Claude Code 開發、Codex 文件整理與 OpenCode 研究工作，觀察狀態回報是否符合實際情況。

可先依官方方式按 `Ctrl+B`，再按 `Q`，脫離 TUI；重新執行 `herdr` 接回。確認後，再以低風險測試任務檢查終端機關閉、SSH 中斷與重新連線的結果。

依 [Herdr 持續運作與遠端連線文件](https://herdr.dev/docs/persistence-remote/)，背景 server 是工作階段得以持續的關鍵。關閉 client、停止 server、主機重開機是不同情況；恢復版面也不代表原本程序完整恢復。

如果目標是手機管理 Herdr，請改查 App／Core 的安裝與手機連線文件；**TUI 工作階段不會自動出現在 Herdr App**。

## 六、實戰第三步：設定 Claude Code 遠端操作

先依 [Claude Code 安裝說明](https://code.claude.com/docs/en/setup)完成安裝與登入。進入你的專案：

```bash
cd ~/projects/my-project
claude
```

在 Claude Code 工作階段中輸入：

```text
/remote-control
```

依畫面指示完成設定，也可以查看 `/config` 中是否提供預設啟用的選項。接著從支援的 Claude 網頁或手機介面連接原本的工作階段。

建議驗證三件事：

1. 電腦保持喚醒時，能否從手機接續操作？
2. 網路短暫中斷後，能否重新連線？
3. Claude Code 等待使用者確認時，能否在遠端完成確認？

這些測試比單純看到連線成功更重要。測試請使用不涉及正式部署或刪除資料的任務。

## 七、如何讓 Agent 長時間執行？分開處理三個問題

很多人以為只要開著 Claude Code，就等於有一個 24 小時 Agent。其實電腦休眠、程序結束、卡在權限確認，都可能讓工作中斷或停滯。

### 1. 讓電腦保持運作

MacBook 長時間工作時，需要妥善設定電源管理。可以使用 macOS 的 `caffeinate`，在特定工作期間避免系統閒置休眠：

```bash
caffeinate -i claude
```

這個例子適用於直接啟動 `claude` 的情境；如果 Agent 由 Herdr 等背景服務啟動，應另確認該服務存續期間的電源設定。

這也不能保證 MacBook 合蓋後仍持續執行。真正長期運作時，桌上型電腦或雲端伺服器通常更合適。

### 2. 讓工作階段持續存在

可以使用 Herdr、tmux 等工具。以已安裝 tmux 的 Linux 為例：

```bash
tmux new -s ai-agent
```

在工作階段內執行：

```bash
claude
```

按 `Ctrl+B`，再按 `D`，可脫離 tmux 而不主動終止工作階段。重新連線後接回：

```bash
tmux attach -t ai-agent
```

tmux 能保護工作階段，但主機關機仍會終止執行程序。

### 3. 加入排程與自動恢復

每天固定執行任務，可以依設備選擇：

| 環境 | 可用的排程方式 |
| --- | --- |
| macOS | launchd |
| Linux | systemd timer、cron |
| Windows | Task Scheduler（工作排程器） |
| 雲端 | 排程服務、工作佇列 |

Claude Code 也有排程能力，但不同模式的持續性與執行環境不同。本機 `/loop` 適合工作階段內的循環任務；即使某些版本可恢復排程，也不能直接把它視為獨立、永久的背景服務。詳細限制見 [Claude Code 排程文件](https://code.claude.com/docs/en/scheduled-tasks)。

真正長期執行的工作，我更建議由外部排程器或適合的雲端排程服務啟動 Agent。無人值守時還要設計非互動輸入、最低必要權限、逾時與結果回收，避免停在確認畫面。

## 八、進階設計：建立自己的 AI 幕僚長與接力流程

前面的設定主要解決「讓 AI Agent 可以遠端執行」。接下來，才是讓 AI 分配工作的延伸設計。

假設有四個 Agent：

| Agent | 主要任務 | 執行設備 |
| --- | --- | --- |
| Research | AI 新聞、GitHub 研究 | Linux VM |
| Developer | 網站開發、程式測試 | Mac |
| Writer | 教材、文章、講義 | Mac |
| Media | 影片、字幕、轉檔 | Windows |

再建立 Dispatcher 負責派工。例如你交代：

> 研究最近一週值得教學的 AI Agent 開源專案，選出三個，產生教學文章，最後更新課程網站。

Dispatcher 可以拆成三個有依賴關係的任務：

1. **任務 A：研究。** 交給 Research Agent，產出 `research.md`。
2. **任務 B：撰寫教材。**等待 A 通過檢查後，交給 Writer Agent，產出 `tutorial.md`。
3. **任務 C：更新網站。**等待 B 完成後，交給 Developer Agent 修改專案並執行測試；正式部署仍依權限與審核流程處理。

這就是多 Agent 接力工作流。但要做到這件事，還需要真正的任務管理系統，可以使用 SQLite、PostgreSQL、Redis 或適合的持久化佇列方案。

最基本的任務資料可以長這樣：

```json
{
  "task_id": "TASK-001",
  "title": "研究 AI Agent 開源專案",
  "agent": "research",
  "status": "pending",
  "input": {
    "topic": "AI Agent",
    "days": 7
  },
  "retry_count": 0,
  "max_retries": 3,
  "requires_approval": false
}
```

這筆 JSON 不會自己執行工作。還需要 Dispatcher 讀取任務、選擇可用 Agent、透過已驗證的介面啟動工作，並接收結果。範例中的 `requires_approval` 只是任務欄位，不能取代工具或執行環境的權限控管。

Herdr CLI 或 Socket API 可以是其中一種整合方式，但指令、權限、認證與連線方式必須對照實際版本。跨設備還要安排成果傳遞，例如受控的 Git repo、檔案傳輸或共用儲存；只有 `research.md` 這個檔名，Writer 不一定就能取得內容。

Dot、Grok Bot 能否直接觸發，也要看支援哪些工具、Webhook 或外部整合。不能因為 Herdr 有 API，就認為所有雲端 Agent 都能直接操作它。

## 九、為什麼不建議一開始就跑八個 Agent？

因為 Agent 數量不等於生產力。

假設同時啟動八個 Agent，其中三個等待權限確認、兩個修改相同檔案、一個測試失敗，另外兩個完成卻沒有回報。最後你可能比自己做還累。

真正重要的，是任務有沒有被管理。我建議先建立以下狀態：

| 狀態 | 意義 |
| --- | --- |
| Pending | 等待執行 |
| Running | 正在執行 |
| Blocked | 等待人工處理 |
| Done | 完成並通過驗收 |
| Failed | 執行失敗 |
| Retrying | 重新執行中 |

每個任務都應留下執行紀錄、成果位置與錯誤資訊，再依工作類型設計驗收：

- **程式開發：** 自動化測試與程式碼審查。
- **教材製作：** 文件完整性、範例能否執行、來源連結與內容是否正確。
- **影音工作：** 長度、解析度、音軌及輸出格式，另保留必要的觀看與聆聽審核。

這些驗收機制，比多開幾個 Agent 更有價值。

## 十、硬體怎麼選？一定要買 Mac 嗎？

不一定。Claude Code、Codex 或其他 CLI Agent 的許多工作，可以在支援的 Linux 或 Windows 環境完成；安裝方式仍要對照各工具的系統需求。

Mac 的優勢在 macOS 開發工具、生態系，以及只能在 macOS 執行的工作。Tart 適合需要 Apple Silicon 上 macOS／Linux VM 的情況，但一般網站開發、Python 自動化與文件處理，未必需要每個 Agent 都有 macOS VM。

以一台 16GB RAM 的 MacBook 為例，我會依序考慮：

| 方案 | 適合情境 | 限制與取捨 |
| --- | --- | --- |
| A：多個工作階段 | 不同 Agent 處理不同專案 | 設定簡單，但仍共用主機環境 |
| B：Git Worktree | 同一 repo 的功能、修錯與測試分工 | 工作目錄分開，但不是作業系統或權限隔離；整合仍可能衝突 |
| C：Docker | 隔離 Linux 相依套件 | 容器與完整 VM 的隔離程度不同 |
| D：Tart | 獨立 macOS／Linux VM | 隔離較完整，硬體需求也較高 |

我的建議是先從 A、B 開始。真的遇到環境衝突，再考慮 C、D。Worktree 的使用方式可參考 [Git 官方文件](https://git-scm.com/docs/git-worktree)。

## 十一、成本怎麼算？別把訂閱當成無限額度

先不計算原本已購買的 AI 訂閱。如果已經有設備，第一階段可以用較低的新增成本開始，但仍須確認服務資格與用途限制。

| 工具 | 成本考量 |
| --- | --- |
| Herdr | 官方提供 Apache 2.0 開源專案，可先使用開源版本 |
| Tailscale | 個人非商業用途可評估免費 Personal 方案；工作與商業用途須確認適用方案 |
| Tart | 需要硬體資源，並應確認所用版本的授權及使用條件 |
| Claude Code | 依訂閱或適用計費方式與額度；Remote Control 另有登入及方案要求 |
| Codex | 依訂閱、計費方式與使用限制 |
| Oracle Cloud | 符合 Always Free 資源與資格時可降低成本，仍須確認容量及回收政策 |
| 任務管理 | SQLite 等可自行架設，另計主機、儲存、維運與備份成本 |

Tailscale 的用途區分請查 [官方方案頁](https://tailscale.com/pricing)；雲端免費資源請查 [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)。

即使是高階 AI 訂閱，仍可能受到使用額度、公平使用政策或其他服務限制影響。

開場分享還提到，每月 200 美元訂閱可以使用相當於 1 萬美元 API 的工作量。這應視為分享者的個人估算，本文未取得原始計算方法，也不是官方固定換算比例。訂閱與 API 的條款、額度算法不同，不能直接相除就當成實際節省金額。

真正需要衡量的是：每月完成多少工作、每件平均成本、人工介入次數、失敗重試耗用額度，以及產出是否符合需求。

## 十二、從兩個 Agent 開始，分三階段擴充

### 第一階段：建立遠端 AI 工作站

先完成這五件事：

1. Mac 與 Windows 安裝 Tailscale，確認連線與存取權限。
2. 安裝適合需求的 Herdr TUI 或 App／Core 路線。
3. 設定 Claude Code 與 Codex。
4. 測試 Claude Code Remote Control。
5. 驗證遠端連線與工作階段恢復。

這個階段不需要複雜的多 Agent 系統。人在外面也能掌握家裡或辦公室的 AI 工作階段，就已經很實用。

### 第二階段：加入自動派工

建立簡單 Dispatcher，先管理兩個 Agent：Research 負責研究，Writer 負責撰寫。

每天固定時間蒐集新技術，研究成果通過檢查後交給 Writer 產生文章草稿，最後通知你審核。這是一個適合練習的接力流程，也能逐步驗證成果交接與失敗處理。

### 第三階段：擴充成完整 AI 團隊

等前兩個 Agent 穩定後，再增加 Developer 維護網站、Media 處理多媒體、Supervisor 負責監控、驗收與異常通知。

此時再深入考慮工作佇列、跨設備派工、資源分配及成本管理，比一開始就堆滿 Agent 更容易找到瓶頸。

## 十三、上線前還有哪些實務問題？

### 1. 不要讓所有 Agent 共用最高權限

Agent 可以執行 Shell、存取檔案與連接內部系統時，需要做好權限分離。研究 Agent 不需要修改正式網站，教材 Agent 不需要存取公司財務資料。

刪除資料、部署正式環境、寄送對外郵件等操作，建議保留人工確認；研究、修改、驗收與發布也應有清楚邊界。

### 2. 避免多個 Agent 同時修改同一份檔案

透過 Git Worktree、不同工作目錄及任務鎖定降低衝突。程式碼整合時，再以 Pull Request 與測試驗收。

### 3. 每個 Agent 都必須有停止條件

無限制重試可能浪費大量額度。每個任務都應設定：

- 最長執行時間。
- 最大重試次數。
- Token 或費用預算。
- 失敗通知。
- 人工介入條件。

真正可靠的自動化，是知道什麼時候應該停止。

## 十四、未來如何從使用 AI，走向管理 AI 團隊？

以前使用 AI，是一個問題、一個回答；後來 Coding Agent 可以連續完成多個步驟。現在更進一步，我們開始讓不同 Agent 分工：研究、開發、寫教材、檢查成果。

人的角色也逐漸轉為規劃、決策與驗收。我認為，這才是 24×7 AI Agent 真正值得研究的地方。

把八個 Claude Code 開著，還需要加上工作分配、追蹤、驗收、恢復與通知，才能形成能持續產生成果的團隊。

AI Agent 的下一個階段，是讓 AI 能夠持續把事情做好。

如果手上已經有 Mac 或 Windows 電腦，不妨先從 Herdr、Tailscale 和 Claude Code 開始。先讓兩個 Agent 穩定合作、遠端管理、自動回報，再逐步擴充，比一次投入大量硬體與訂閱費，更容易建立能長期使用的工作系統。

## 參考資料與工具連結

- [Herdr 官方網站](https://herdr.dev)
- [Herdr TUI GitHub](https://github.com/herdrdev/herdr)
- [Herdr TUI 快速入門](https://herdr.dev/docs/quick-start/)
- [Herdr TUI 持續運作與遠端連線](https://herdr.dev/docs/persistence-remote/)
- [Tailscale](https://tailscale.com)
- [Tailscale 下載](https://tailscale.com/download)
- [Tailscale 方案與用途限制](https://tailscale.com/pricing)
- [Tart](https://tart.run)
- [Tart GitHub](https://github.com/cirruslabs/tart)
- [Claude Code 官方文件](https://code.claude.com/docs/en/overview)
- [Claude Code 安裝說明](https://code.claude.com/docs/en/setup)
- [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control)
- [Claude Code 排程說明](https://code.claude.com/docs/en/scheduled-tasks)
- [Git Worktree](https://git-scm.com/docs/git-worktree)
- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)

本文根據開發者分享的工作流進行技術拆解，並提出適合一般使用者的實作架構。各項工具功能、授權、訂閱限制及安裝方式可能隨版本更新，實際操作請以官方文件為準。

## 常見問答 (FAQ)

### Q1：打造 24×7 AI Agent 工作站，一定要買多台 Mac 嗎？

不需要。可以先用現有 Mac、Windows 或 Linux 設備，建立少量 Agent 工作階段，搭配不同工作目錄與 Git Worktree 分工。需要 macOS 專屬工具或完整環境隔離時，再評估 Apple Silicon 與 Tart VM；電腦持續供電、避免休眠及服務可恢復，比先增加設備更重要。

### Q2：Herdr、Tailscale 與 Claude Code Remote Control 有什麼差別？

Herdr 管理 Agent 的終端機與工作階段，Tailscale 提供設備之間的私人網路連線，Remote Control 則讓支援的 Claude 網頁或手機介面接續本機 Claude Code。三者的功能互補，但 Remote Control 本身不要求 Tailscale；另外，Herdr TUI 與 App／Core 不共用工作階段，手機管理須選對產品路線。

### Q3：安裝這些工具後，AI 就能每天自動完成工作嗎？

還不能。遠端連線與持續存在的工作階段只是基礎，仍須設定排程或事件觸發、Dispatcher、任務狀態、成果交接、驗收、重試上限及通知。建議先讓研究與寫作兩個 Agent 完成小型接力流程，產出草稿後交由人工審核，再逐步擴充。
