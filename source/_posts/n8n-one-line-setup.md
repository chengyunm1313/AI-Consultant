---
title: n8n 自架新手指南：One-line setup 一行指令建立 Docker Compose、AI Assistant 與 Sandbox
cover: /images/cover144-1.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - n8n新手教學
date: 2026-08-26 02:15:42
subtitle: 先把 n8n 跑起來，再理解 Docker、AI 模型與 Production 架構的分工
description: n8n 官方 One-line setup 用一行指令建立 Docker Compose、SQLite、AI Assistant 支援服務與 Sandbox；本文整理安裝前提、常用指令、資料風險與 Production 架構選擇。
---

如果你以前自己架過 n8n，應該很清楚第一次安裝時會遇到多少名詞：Docker、Docker Compose、Volume、環境變數、Secret，還有 AI Assistant 需要的模型與搜尋服務。

現在 n8n 官方提供了 **One-line setup**。準備好 Docker 並確認它正在執行後，只要在 Terminal 貼上一行指令，就能建立一套全新的 n8n 本機環境：

```bash
curl -fsSL https://get.n8n.io | sh
```

這不代表 Docker 被「免安裝」了，而是 n8n 把原本要自己撰寫與組合的 Docker Compose 設定、資料卷、Secret，以及 AI Assistant 的支援服務，整理成一個較容易開始的安裝流程。

> 本文依照 [n8n 官方 One-line setup 文件](https://docs.n8n.io/deploy/host-n8n/install-options/one-line-setup) 整理。安裝指令、版本政策與支援的模型提供者都可能更新，實際執行前仍應以官方文件為準。

## One-line setup 適合什麼情境？

官方把這套流程定位為 **全新 n8n instance 的快速安裝方式**。它特別適合以下情境：

- 第一次在本機學習 n8n。
- 想快速做 Demo 或測試 AI Assistant。
- 不想一開始就手寫完整的 Docker Compose 檔案。
- 想先把環境跑起來，再逐步理解 Docker、Volume 與環境變數。

如果你已經使用自己的 Docker Compose 架構自架 n8n，不需要為了 One-line setup 重新安裝。它不是既有環境的強制遷移工具；正在使用 npm 安裝的既有 instance，目前也不會因為這個腳本出現就立刻失效。

## 執行前需要準備什麼？

### 先安裝並啟動 Docker

One-line setup 不會替你安裝 Docker。你需要先安裝 [Docker](https://docs.docker.com/get-docker/)，並讓 Docker daemon 在背景執行。

這套流程特別需要 **Docker Compose v2 plugin**，也就是下面這個指令可以使用：

```bash
docker compose version
```

不要把它和舊版的獨立指令混淆：

```bash
docker-compose
```

官方文件要求的是 `docker compose`，不是舊式的 `docker-compose`。如果你使用 Podman、Colima 或其他相容引擎，也需要準備好帶有 Compose plugin 的 Docker CLI，並正確指向它的 socket。

### macOS、Linux 與 Windows 的差異

在 macOS 或 Linux 上，通常是安裝 Docker Desktop 或 Docker Engine，確認服務啟動後直接從 Terminal 執行指令。

Windows 的 PowerShell 與 Command Prompt 不能直接按照 POSIX shell script 的方式執行這套安裝流程。官方建議使用：

```text
Docker Desktop
＋ WSL2
＋ Docker Desktop 的 WSL2 integration
＋ WSL Terminal
```

Git Bash 理論上可以執行 shell script，但官方文件表示尚未完成端到端驗證；Windows 使用者優先採用 WSL 會比較穩妥。

## 一行指令會幫你建立什麼？

在你想放置 n8n 的目錄開啟 Terminal，執行：

```bash
curl -fsSL https://get.n8n.io | sh
```

腳本會依序檢查 Docker 是否存在、Docker daemon 是否正在執行，以及 Docker Compose v2 是否可用。接著在目前目錄建立 `n8n/` 資料夾，並準備相關設定：

```text
n8n/
├── compose.yml
├── .env
└── searxng-settings.yml
```

第一次執行時，它還會下載需要的 Docker image、建立資料卷並啟動服務。正常完成後，可以開啟：

```text
http://localhost:5678
```

官方範例輸出也會顯示資料儲存在 `./n8n`，並使用名為 `n8n-data` 的 Docker volume。若同一個資料夾已經完成設定，再次執行通常只會提示目前已經存在，不會任意覆蓋既有環境。

## 內建的服務包含哪些？

One-line setup 的價值不只是把 n8n 主程式啟動，它也會準備 AI Assistant 需要的基礎服務。

### 1. n8n Workflow Editor

n8n 本身是視覺化的 Workflow Editor，可以用節點串接 Trigger、Webhook、API、Google Sheets、Gmail、LINE 與 AI Agent 等服務。

如果你還不熟悉 n8n，可以先閱讀站內的 [n8n 自動化工具介紹與 AI 輔助安裝教學](/posts/n8n-automation-ai-installation/)，先建立工作流與節點的基本概念。

### 2. 內建資料庫：SQLite

這套快速安裝預設使用 SQLite。它是一個直接存在檔案中的輕量資料庫，不需要另外架設資料庫伺服器，適合個人學習、測試與 Demo。

SQLite 會保存工作流、憑證與執行紀錄，因此「只是刪除容器」和「刪除 volume」是完全不同的操作。後面會專門說明資料風險。

### 3. AI Assistant 的 Sandbox

當 AI Assistant 協助產生或執行程式碼時，One-line setup 會一併啟動 n8n 提供的 bundled sandbox。可以把它理解成一個與 n8n 主程式分開的執行環境，讓 AI 產生的程式碼有獨立的執行位置。

這對本機測試很方便，但「有 Sandbox」不等於完成企業級的安全架構。正式環境仍要評估權限、網路隔離、資源限制與 Sandbox provider。

### 4. 網頁搜尋支援服務

安裝器會產生 `searxng-settings.yml`，並啟動 AI Assistant 使用的 bundled search tool。官方文件將它描述為預設的搜尋支援服務，讓 AI Assistant 可以在需要時查找網頁資料。

如果你想改用 Brave Search，也可以在 `./n8n/.env` 設定 `INSTANCE_AI_BRAVE_SEARCH_API_KEY`。這不是啟用 n8n 的必要條件，而是替換搜尋提供者的選項。

## AI 模型仍然要自己準備

這裡是最容易誤會的地方：**One-line setup 不會附送 AI 模型，也不會替你支付模型 API 費用。**

它準備的是 AI Assistant 的執行環境；你仍然要在 n8n 介面中加入自己的模型提供者與 API key。官方文件提供兩種做法：

1. n8n 啟動後，進入 instance 的 AI 設定介面加入模型 API key。
2. 在登入前直接編輯 `./n8n/.env`，填入 `N8N_INSTANCE_AI_MODEL_API_KEY`。

例如環境變數名稱會長這樣：

```dotenv
N8N_INSTANCE_AI_MODEL_API_KEY=
```

填入自己的 key 後，重新啟動 n8n：

```bash
docker compose -f ./n8n/compose.yml up -d
```

模型提供者與可用設定會隨 n8n 版本及方案變動，請以官方的 [Set up the AI Assistant 文件](https://docs.n8n.io/deploy/host-n8n/configure-n8n/set-up-ai-assistant/) 為準。API key 不要寫進公開文章、Git repository 或截圖中。

## AI Assistant 和 AI Agent Node 不一樣

這兩個名稱很像，但負責的事情不同。

### AI Agent Node：工作流裡的 AI

AI Agent Node 是你拖進工作流的節點。例如：

```text
LINE
↓
AI Agent
↓
Google Calendar
↓
回覆 LINE
```

它是工作流中的一個處理步驟，負責依照你的設定理解輸入、呼叫工具，再把結果傳給下一個節點。

### AI Assistant：幫你製作工作流的助手

AI Assistant 比較像工作流建構階段的協作者。你可以描述需求，例如：

> 收到 Gmail 後，自動判斷是不是客戶詢價信；如果是，就寫入 Google Sheets。

它的目標是協助你規劃或建立工作流，而不是取代工作流中的 AI Agent Node。

如果你想深入理解 LLM 和 AI Agent 的選擇差異，可以延伸閱讀 [何時該用 LLM？何時該派 AI Agent 上場？](/posts/n8n-llm-vs-ai-agent/)。

## 安裝後最常用的 Docker 指令

One-line setup 降低了第一次安裝的門檻，但基本的啟停指令仍然值得記住。

### 停止 n8n

```bash
docker compose -f ./n8n/compose.yml down
```

這會停止服務，通常不會主動刪除資料卷。

### 重新啟動 n8n

```bash
docker compose -f ./n8n/compose.yml up -d
```

### 升級到較新的版本

```bash
curl -fsSL https://get.n8n.io | sh -s -- --upgrade
```

官方腳本也提供版本控制參數。若要指定版本，請依官方文件當下支援的格式執行，例如：

```bash
curl -fsSL https://get.n8n.io | sh -s -- --version 2.31.4
```

版本號只是範例，升級前要先確認相容性、備份資料與官方的版本說明。

### 只產生設定、不立即啟動

如果你想先檢查設定檔，再決定何時啟動，可以使用：

```bash
curl -fsSL https://get.n8n.io | sh -s -- --no-start
```

想查看腳本可用的選項，則可以使用：

```bash
curl -fsSL https://get.n8n.io | sh -s -- --help
```

## 執行遠端腳本前，先檢查內容

`curl ... | sh` 很方便，但它代表你把遠端下載的內容直接交給 shell 執行。即使來源是官方，也建議對公司環境或重要主機採用「先下載、先閱讀、再執行」的方式：

```bash
curl -fsSL https://get.n8n.io -o get-n8n.sh
less get-n8n.sh
sh get-n8n.sh
```

檢查腳本時，可以特別留意它會連線到哪些服務、會建立或修改哪些檔案，以及目前版本是否符合你的部署計畫。不要把未知來源的安裝指令直接套用到含有重要資料的主機上。

## `down` 和 `down -v` 的資料風險

下面兩個指令看起來只差一個參數，後果卻完全不同：

```bash
docker compose -f ./n8n/compose.yml down
```

```bash
docker compose -f ./n8n/compose.yml down -v
```

`down` 主要是停止並移除容器；`down -v` 會連同 Docker volume 一起刪除。官方卸載流程還會接著刪除 `./n8n` 資料夾，因此工作流、憑證與執行紀錄都有可能一起消失。

> 只想暫停 n8n 時，不要把 `-v` 當成習慣性參數。真的要移除環境前，先確認備份、資料保留需求與目前所在的目錄。

## One-line setup 可以直接拿來跑 Production 嗎？

**可以啟動，不代表已經完成 Production 架構。**

One-line setup 的預設值非常適合「快速開始」：SQLite 不需要額外資料庫、bundled sandbox 不需要先設計 provider、服務也只需要從本機的 `localhost:5678` 開始使用。

但如果要把 n8n 放進團隊或公司的正式自動化環境，還要另外處理：

- PostgreSQL 或其他正式資料庫架構。
- Domain、HTTPS 與 Reverse Proxy。
- Workflow、Credential 與執行資料的備份及還原。
- Sandbox 的隔離方式、權限與資源限制。
- Webhook 對外開放後的驗證、監控與告警。
- 更新、回滾與版本相容性。

官方目前建議團隊或 Production 環境評估 PostgreSQL；Sandbox 則建議另外研究 Daytona 等正式 provider。這也是為什麼我會把 One-line setup 定位成「學習版與快速驗證的起點」，而不是企業部署的完整答案。

## 我會怎麼分三個階段使用？

### Level 1：本機學習版

```text
Docker Desktop
＋ One-line setup
＋ SQLite
```

適合第一次接觸 n8n、課程教學、測試 AI Assistant 與驗證工作流想法。

### Level 2：個人長期使用版

```text
VPS
＋ Docker Compose
＋ Domain
＋ HTTPS
＋ 備份
```

適合個人自動化、LINE Bot、Webhook 與需要 24 小時執行的流程。這個階段要開始理解資料卷、反向代理、更新與復原。

### Level 3：企業 Production

```text
Docker 或 Kubernetes
＋ PostgreSQL
＋ Reverse Proxy
＋ Backup
＋ Monitoring
＋ 隔離的 Sandbox
＋ 權限管理
```

這才是需要系統性評估可用性、安全性、權限、備份與維運成本的正式架構。

## n8n 正在往 Docker-first 方向前進

官方 One-line setup 文件目前寫明，預計在 **2026 年 10 月推出 n8n 3.0** 後，新的 n8n 安裝將不再採用以前的：

```bash
npm install n8n
npx n8n
```

而是以 Docker 為主要發佈方式。這項時程與安裝政策仍可能隨官方版本調整，不能把文章中的日期當成永久不變的承諾；但方向已經很清楚：未來學習 n8n 自架，Docker Compose 會越來越接近基本功。

有趣的是，你不一定要在第一天就完全學會 Docker，才能開始使用 Docker。One-line setup 把「理解容器架構」與「先把服務跑起來」拆成兩個階段，讓新手可以先完成第一次成功啟動，再逐步補上 Compose、Volume、網路與安全性的知識。

## 結論：它解決的是快速開始，不是架構設計

如果你以前看到「自架 n8n」就因為 Docker Compose 而放棄，現在確實值得重新試一次：先安裝並啟動 Docker，再用一行指令建立 n8n、SQLite、AI Assistant 支援服務與 Sandbox。

但也要記得三件事：

1. Docker 仍然要自己安裝，One-line setup 只是簡化 n8n 的 Compose 設定。
2. AI 模型與 API key 仍然要自己準備，快速安裝不等於附送模型。
3. 本機 Demo 與企業 Production 是兩種不同的架構問題，PostgreSQL、HTTPS、備份與安全隔離不能省略。

真正重要的改變，是把新手的起點從「我要先讀完所有 Docker 文件」變成「我先把 n8n 跑起來，再理解它怎麼運作」。自動化的入口，確實又降低了一階。

## 參考文件

- [n8n One-line setup 官方文件](https://docs.n8n.io/deploy/host-n8n/install-options/one-line-setup)
- [n8n Set up the AI Assistant 官方文件](https://docs.n8n.io/deploy/host-n8n/configure-n8n/set-up-ai-assistant/)
- [Docker 安裝文件](https://docs.docker.com/get-docker/)

## 常見問答 (FAQ)

### Q1：One-line setup 會自動安裝 Docker 嗎？

不會。你必須先安裝並啟動 Docker，而且需要可以使用 `docker compose` 的 Docker Compose v2 plugin；One-line setup 主要負責建立 n8n 的 Compose 設定與啟動相關服務。

### Q2：One-line setup 有附送 AI 模型或 API key 嗎？

沒有。它會準備 AI Assistant 使用的 Sandbox 與搜尋支援服務，但你仍然需要在 n8n 的 AI 設定介面或 `./n8n/.env` 中加入自己的模型提供者 API key。

### Q3：`docker compose down` 和 `docker compose down -v` 有什麼不同？

`docker compose down` 主要停止並移除容器；`docker compose down -v` 會連同 Docker volume 一起刪除，可能造成工作流、憑證與執行紀錄遺失，因此不能把 `-v` 當成一般停機指令。

### Q4：One-line setup 適合直接部署公司的 Production n8n 嗎？

它適合快速學習、測試與 Demo；公司的 Production 環境通常還需要 PostgreSQL、HTTPS、Reverse Proxy、備份、監控、權限控管，以及更完整的 Sandbox 隔離設計。

### Q5：AI Assistant 和 AI Agent Node 是同一個功能嗎？

不是。AI Agent Node 是工作流裡負責理解輸入、使用工具或產生結果的節點；AI Assistant 則是協助你規劃或建立 n8n 工作流的建構助手。
