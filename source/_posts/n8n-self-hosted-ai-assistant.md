---
title: n8n 自架版 AI Assistant：One-line setup、Sandbox 與 Zeabur 架構
cover: /images/cover145.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - n8n新手教學
date: 2026-08-26 02:43:07
subtitle: 從一行指令開始，理解 n8n-sandbox、Daytona 與 Web Search 的自架選擇
description: n8n 2.35 之後，Self-hosted AI Assistant 的安裝更簡單。本文整理 One-line setup、n8n-sandbox、Daytona、Web Search，以及 Zeabur + PostgreSQL + task-runner 的實務選型與安全邊界。
---

如果你跟我一樣是自己架 n8n，最近這個更新很值得注意。

n8n 官方社群公告指出，從 **n8n 2.35 開始，Self-hosted AI Assistant 的設定流程變得簡單許多**。以前要自己開啟相關模組、準備 Sandbox、設定模型，再視需要接上 Web Search；現在新的 Docker-based n8n instance 可以透過 One-line setup 預先建立 Sandbox、SearXNG 與 AI Assistant，最後再由你在 UI 中連接模型提供者。

不過，這次更新真正重要的地方，不只是「安裝變簡單」。

它讓 n8n 的使用方式開始從：

> 我自己拖 Node、寫 Expression、測試 Workflow。

慢慢走向：

> 我先把需求描述清楚，再讓 AI 協助我建構 Workflow。

官方目前仍將 Self-hosted AI Assistant 標示為 preview，功能與行為可能持續變動。本文因此會把版本與環境變數視為「目前文件的設定方式」，正式環境升級前仍要重新確認官方說明、備份與資料邊界。

## 先說結論：One-line setup 解決快速開始，不等於完成 Production 架構

新的 One-line setup 適合：

- 第一次在本機學習 n8n。
- 想快速測試 AI Assistant 的 Workflow Builder。
- 想做 Demo 或驗證自動化想法。
- 不想一開始就手寫完整的 Docker Compose。

它不會替你完成所有事情。Docker 仍然要先安裝並啟動，模型 API 金鑰仍然要自己準備；SQLite、HTTPS、備份、權限與 Sandbox 隔離，也要按照正式環境需求重新設計。

可以先用這張表定位自己的路線：

| 你的情境 | 先選哪一條路線 | 判斷重點 |
| --- | --- | --- |
| 新環境、本機測試或短期 Demo | One-line setup + n8n-sandbox | 先快速驗證 AI Workflow Builder。 |
| 已有 Zeabur + n8n + PostgreSQL + task-runner | 保留既有服務，Sandbox 評估 Daytona | 不必為了 AI Assistant 重建整套正式環境。 |
| 資料不能離開指定基礎設施 | 自架 n8n-sandbox，或暫不啟用 Builder | 先確認 privileged Runner、資料政策與隔離邊界。 |

如果你已經有一套正在運作的 Zeabur + n8n + PostgreSQL 架構，也不需要為了 AI Assistant 直接打掉重來。比較合理的做法是先理解既有元件的責任，再決定要把 Sandbox 放在哪裡。

## AI Assistant 不是 AI Agent Node：先分清楚兩個層次

這兩個名字很像，但負責的工作不同。

### AI Agent Node：工作流裡的一個節點

以前我們在 n8n 裡使用 AI，通常會把 AI Agent 拉進 Workflow：

```text
Webhook
   ↓
AI Agent
   ↓
OpenAI / Claude / Gemini
   ↓
Google Sheets
   ↓
LINE
```

這裡的 AI Agent 是 Workflow 裡的一個處理步驟。它可以理解輸入、呼叫工具、查詢資料，再把結果傳給下一個 Node。

### AI Assistant：幫你製作 Workflow 的助手

AI Assistant 位於另一個層次。它不是你最後交付給使用者的 Workflow，而是協助你規劃、建立與修正 Workflow 的建構助手。

你可以這樣描述需求：

> 幫我建立一個 LINE 預約系統。收到 LINE Webhook 後判斷使用者操作；如果使用者要預約，就讀取 Google Calendar 的可預約時段，再產生 LINE Flex Message；預約成功後，把資料寫進 Google Sheets。

以前你可能要自己完成：

```text
找 Node
 ↓
設定 Credential
 ↓
寫 Expression
 ↓
查 API 文件
 ↓
測試與除錯
```

AI Assistant 想協助的是：

```text
理解需求
 ↓
規劃 Workflow
 ↓
產生 Workflow 程式碼
 ↓
在 Sandbox 中編譯與測試
 ↓
修正錯誤
 ↓
產生有效的 Workflow JSON
 ↓
儲存到 n8n
```

所以 n8n 的學習重點，會逐漸從「我知道每個 Node 在哪裡」延伸到「我能不能把需求、資料結構與限制描述清楚」。

如果你想先理解 LLM 與 AI Agent Node 的選擇差異，也可以延伸閱讀 [何時該用 LLM？何時該派 AI Agent 上場？](/posts/n8n-llm-vs-ai-agent/)。

## Self-hosted AI Assistant 其實由三個部分組成

可以先用這個架構理解：

```text
                     ┌─ OpenAI
                     ├─ Anthropic
你 → n8n AI Assistant ─ OpenRouter
                     └─ OpenAI-compatible API
          │
          ├──────── Web Search
          │          ├─ Brave Search
          │          └─ SearXNG
          │
          └──────── Sandbox
                     ├─ n8n-sandbox
                     └─ Daytona
```

### 1. Model Provider：AI 的大腦

你仍然要自行選擇模型提供者並準備 API Key，例如：

- Anthropic。
- OpenAI。
- OpenRouter。
- 其他 OpenAI-compatible API。

n8n 不會附送模型，也不會替你支付模型使用費。One-line setup 做的是準備 AI Assistant 所需的執行環境；模型連線與費用仍然由你的模型提供者決定。

### 2. Sandbox：AI 的隔離工作區

AI Assistant 的 Workflow Builder 不是只回傳一段文字。它可能需要建立檔案、寫入 TypeScript、執行編譯器、安裝套件、執行程式，再根據錯誤反覆修正。

這些工作不應直接在正式 n8n Host 上執行，因此需要一個專用 Sandbox：

```text
AI Assistant
     ↓
寫入 workflow.ts
     ↓
TypeScript type-check
     ↓
執行並產生 Workflow JSON
     ↓
驗證成功後才交回 n8n
```

如果沒有可用的 Sandbox，Workflow Builder 的能力就無法完整使用。要注意的是，Sandbox 提供的是程式碼執行隔離，不等於自動完成權限控管、資料遮罩或人工作業確認。

### 3. Web Search：讓 AI 查得到最新資料

如果你要求 AI 協助串接最新 API，它可能需要查詢官方文件、Endpoint、Authentication 或 Request Format。Web Search 就是提供這一層能力。

依照 n8n 目前的 Instance AI 設定文件，搜尋提供者的優先順序是：

```text
Brave API Key
      ↓ 沒有
SearXNG URL
      ↓ 都沒有
Web Search disabled
```

沒有 Search Provider 時，`fetch-url` 仍可能可以使用，但 AI Assistant 不會具備主動 Web Search 能力。若希望搜尋也留在自己的基礎設施，可以考慮在同一個網路環境部署 SearXNG；若追求較少維護元件，則可評估 Brave Search。

## 新環境：One-line setup 會幫你準備什麼？

### 執行前先準備 Docker

One-line setup 不會替你安裝 Docker。先確認 Docker Engine 或 Docker Desktop 已啟動，而且 Docker Compose v2 可以使用：

```bash
docker compose version
```

Windows 使用者若要依照 POSIX shell 流程執行，建議使用 Docker Desktop 搭配 WSL2，並在 WSL Terminal 中操作。不同平台與 Docker 版本仍應以官方文件的當期說明為準。

### 官方快速指令

在準備好的目錄執行：

```bash
curl -fsSL https://get.n8n.io | sh
```

它不是「免安裝 Docker」，而是把原本要自己撰寫與組合的 Docker Compose 設定、資料卷、Sandbox 與 Web Search 服務整理成較容易開始的流程。完成後通常可以從以下位置開啟 n8n：

```text
http://localhost:5678
```

### One-line setup 背後的服務

官方 Docker Compose 文件中的主要元件包括：

```text
n8n
├── sandbox-certs
├── sandbox-api
├── sandbox-runner-1
└── searxng
```

- `n8n`：Workflow Editor 與主要應用程式。
- `sandbox-certs`：產生 Sandbox 服務需要的 TLS 憑證。
- `sandbox-api`：n8n 與 Sandbox 溝通的控制層。
- `sandbox-runner-1`：建立與執行 Sandbox 的 Runner。
- `searxng`：AI Assistant 的 Web Search 後端。

這個快速架構預設沒有另外建立 PostgreSQL 服務，測試環境通常會使用 SQLite。若要長期承載團隊或企業工作流，資料庫、備份與復原策略要另外規劃。

### 遠端腳本不要盲目直接執行

`curl ... | sh` 很方便，但它也代表把遠端下載的內容直接交給 shell。即使來源是官方，重要主機仍可先下載、閱讀，再執行：

```bash
curl -fsSL https://get.n8n.io -o get-n8n.sh
less get-n8n.sh
sh get-n8n.sh
```

正式環境還要確認目前目錄、資料卷、備份與更新策略，不要把測試環境的指令直接套到含有重要資料的主機。

## 既有 n8n：不要為了 AI Assistant 直接重建整套環境

如果你已經使用 Docker 或 Zeabur 部署 n8n，建議採取漸進式流程：

```text
備份 Workflow、Credentials 與資料庫
        ↓
確認目前 n8n 版本與升級相容性
        ↓
升級到支援 AI Assistant 的版本
        ↓
確認原有 Workflow 正常
        ↓
設定 Model Provider
        ↓
選擇 Sandbox Provider
        ↓
選擇 Brave Search 或 SearXNG
        ↓
用測試 Workflow 驗證 AI Assistant
```

官方公告將 n8n 2.35 或更新版本列為 Self-hosted AI Assistant 的前提之一，但版本與設定仍會更新。不要只因為看到一個新的功能，就直接替換正在服務中的 n8n；先確認資料庫、Encryption Key、Webhook、Credentials 與現有 Workflow 都能復原。

## Sandbox 有兩種路線：n8n-sandbox 或 Daytona

這是整篇最容易被忽略、但最值得先做決策的部分。

### 方案一：n8n-sandbox

n8n-sandbox 是由你自己管理的 Sandbox 服務。以 Docker Compose 部署時，n8n、Sandbox API、Runner 與 SearXNG 可以放在同一套基礎設施中：

```text
自己的 VPS 或 Docker Host
│
├── n8n
├── PostgreSQL
├── SearXNG
├── sandbox-api
└── sandbox-runner-1
```

它的優點是控制權高，資料與執行環境可以盡量留在自己的 Infrastructure，適合：

- 本機開發。
- 課程 Demo。
- 測試 AI Workflow Builder。
- 有能力維護 Docker-in-Docker 的自架環境。
- 公司政策要求資料不能離開指定基礎設施。

但要注意，官方 Compose 中的 `sandbox-runner-1` 使用 `privileged: true`，而且透過 Docker-in-Docker 建立與執行其他 Sandbox Container。這不是一般的 PostgreSQL 或 n8n Container；官方文件也提醒不要把 Runner 的連接埠暴露到 Internet，並應將它視為高權限元件。

官方文件目前以至少 4 GB RAM、2 vCPU 作為這套 Compose Sandbox 的起始資源參考。實際需求仍會受到同時執行的 Workflow、模型與 Sandbox 工作量影響，不能把它當成所有 Production 環境的保證規格。

### 方案二：Daytona

Daytona 是另一個 Sandbox Provider。架構會變成：

```text
你的 n8n Host
│
├── n8n
├── PostgreSQL
└── Web Search
        │
        │ API
        ↓
      Daytona
        │
        └── AI Sandbox Container
```

n8n 透過 Daytona API 建立或管理隔離的 Sandbox，AI Assistant 在其中寫檔案、執行 TypeScript、檢查錯誤，再把通過驗證的 Workflow 交回 n8n。這樣 AI 建構程式碼的執行環境就不必與正式 n8n Host 共用同一個 Docker-in-Docker Runner。

Daytona 的代價是增加第三方服務依賴、API Key、使用量與費用。更重要的是，AI Assistant 建構過程所需的檔案與資料可能進入外部 Sandbox；如果你的流程包含高度機敏企業資料、金融資料或特殊個資，必須先做資料邊界與供應商政策審查。

### 兩種 Sandbox 怎麼選？

| 使用情境 | 建議與理由 |
| --- | --- |
| 個人電腦測試、課程或短期 Demo | 選 n8n-sandbox，先用 Docker Compose 快速重現環境。 |
| 完全 Self-hosted、資料希望留在自己的基礎設施 | 選 n8n-sandbox，但要接受 privileged Docker-in-Docker Runner 的維運與安全責任。 |
| 已有正式 n8n、希望降低維運 | 評估 Daytona，避免自行維護高權限 Sandbox Runner。 |
| Zeabur 上的既有 n8n | 保留 n8n、PostgreSQL 與 task-runner，Sandbox 優先評估 Daytona。 |
| 資料不得離開指定環境 | 先以資料政策與隔離要求為前提，評估自架 n8n-sandbox 或暫不啟用 Builder。 |

Self-hosted 不代表「所有東西都一定要塞在同一台 Server」。比較成熟的判斷方式是：哪些核心資料與自動化服務值得自己管理，哪些短生命週期的 AI 執行環境可以交給專門的 Sandbox Provider。

## Zeabur + n8n + PostgreSQL + task-runner：我會怎麼選？

如果你的現有架構是：

```text
Zeabur Project
│
├── PostgreSQL
├── task-runner
└── n8n
```

我會先保留這套核心環境，讓 AI Assistant 的 Sandbox 走 Daytona：

```text
Zeabur
│
├── PostgreSQL
├── task-runner
├── n8n
└── SearXNG（可選）
        │
        └──────── API ──────── Daytona
                                  │
                                  └── AI Sandbox
```

原因不是 Daytona 一定比較安全或一定比較便宜，而是這個選擇與 Zeabur 的部署方式比較相容。

### task-runner 不等於 AI Assistant Sandbox

這裡非常容易混淆。

官方 task runners 文件把 task runner 定位為執行 Code Node 中 JavaScript 與 Python 程式碼的機制；它可以作為 n8n 的外部 Runner，隔離一般 Workflow 執行時的使用者程式碼。

AI Assistant Sandbox 則負責另一個流程：

```text
AI Assistant
     ↓
建立 workflow.ts
     ↓
執行 TypeScript 編譯與測試
     ↓
修正錯誤
     ↓
產生有效 Workflow JSON
```

因此：

```text
task-runner ≠ AI Assistant Sandbox
```

即使 Zeabur 裡已經有 `task-runner`，也不代表 AI Assistant 的 Workflow Builder 已經具備可用的 Sandbox。兩者可以同時存在，角色也不互相取代。

### 為什麼不直接把 n8n-sandbox 塞進 Zeabur？

Zeabur 官方目前說明，不能直接從 Docker Compose YAML 部署服務；可以改用 Dockerfile、Docker Image 或轉成 Zeabur Template YAML 等方式組合服務。

而 n8n 官方 Sandbox Compose 還包含 `sandbox-api`、`sandbox-runner-1`、TLS 憑證，以及 `privileged: true` 的 Docker-in-Docker Runner。這代表它不是把一個普通 Docker Image 加進專案就結束。

如果你真的想在 Zeabur 部署自架 Sandbox，需要逐項確認：

- 目前使用的 Server 或 Plan 是否支援所需的高權限容器能力。
- Sandbox API 與 Runner 能否以 Zeabur 支援的 Template 或服務方式部署。
- 內部網路、TLS、Runner 註冊與持久化資料如何配置。
- Runner 是否會被錯誤暴露到公開網路。
- 發生 Sandbox 失敗時，n8n 與 PostgreSQL 是否仍然可用。

如果只是想在既有 Zeabur n8n 上加入 AI Assistant，我不會把這些基礎設施風險當成第一個實驗步驟。

### Zeabur + Daytona 的取捨

```text
正式自動化平台
Zeabur
├── n8n
├── PostgreSQL
├── task-runner
└── SearXNG（可選）

AI 建構工作區
Daytona
└── Sandbox
```

優點：

- 不用先改動目前正常運作的 n8n、PostgreSQL 與 task-runner。
- 不必在 Zeabur 內維護 Docker-in-Docker privileged Runner。
- 正式 n8n 與 AI 建構程式碼的執行環境分開。
- Daytona 發生問題時，主要影響 AI Workflow Builder，不一定等於既有 Workflow Runtime 全部停止。

缺點：

- 多一個外部服務、帳號、API Key、費用與供應商依賴。
- AI Assistant 的 Sandbox 資訊可能進入第三方環境，需要檢查資料政策。
- Daytona 的 API、方案、計費與支援範圍會變動，不能把本文的選擇當成永久答案。

所以我的判斷會是：

> n8n、PostgreSQL、task-runner 與搜尋服務自己控制；AI Assistant 的臨時執行環境交給 Daytona。

但如果企業資料政策不允許資料離開指定 Infrastructure，就應該改評估自架 n8n-sandbox，或先不要啟用 AI Workflow Builder。

## Web Search：Brave Search 還是 SearXNG？

這個選擇可以獨立於 Sandbox Provider。

### 選 Brave Search

適合希望減少自行維護服務的人：

```text
Zeabur
└── n8n
     ├── Model Provider
     ├── Daytona Sandbox
     └── Brave Search API
```

需要管理 API Key 與使用量，也要確認資料是否符合公司的第三方服務政策。

### 選 SearXNG

適合希望把搜尋服務放在自己控制的網路環境的人：

```text
Zeabur
├── n8n
└── SearXNG
        │
        └── 內部網路
```

SearXNG 是一般服務，與需要 privileged Docker-in-Docker 的 Sandbox Runner 不同。這也是為什麼在 Zeabur 架 SearXNG，通常比直接照搬整套 n8n-sandbox Compose 更容易拆分與管理。

## 設定時可以參考哪些環境變數？

以下只展示名稱與結構，不要把真實 API Key 寫進公開文章、Git Repository 或截圖：

```dotenv
N8N_INSTANCE_AI_SANDBOX_ENABLED=true
N8N_INSTANCE_AI_SANDBOX_PROVIDER=daytona
DAYTONA_API_URL=https://app.daytona.io/api
DAYTONA_API_KEY=請填入自己的金鑰
```

如果採用 n8n-sandbox，則要依目前版本的官方設定文件提供 Sandbox Service URL 與必要的認證資訊。以目前設定文件的概念，可以先理解成：

```dotenv
N8N_INSTANCE_AI_SANDBOX_ENABLED=true
N8N_INSTANCE_AI_SANDBOX_PROVIDER=n8n-sandbox
N8N_SANDBOX_SERVICE_URL=http://sandbox-api:8080
N8N_SANDBOX_SERVICE_API_KEY=請填入自己的 Sandbox 金鑰
```

不同 n8n 版本的 Compose 範例與環境變數名稱可能調整，不要直接複製舊文章中的設定到 Production；部署前應以當期官方文件與 UI 中的 Sandbox connection 為準。

Web Search 的設定概念則是：

```dotenv
# Brave 有設定時優先使用 Brave
INSTANCE_AI_BRAVE_SEARCH_API_KEY=請填入自己的金鑰

# 或使用自架 SearXNG
N8N_INSTANCE_AI_SEARXNG_URL=http://searxng:8080
```

實際欄位可在 n8n UI 的 Instance AI 設定中管理；如果同時設定兩者，依目前官方 configuration 文件，Brave 會優先於 SearXNG。

## 我會用這五個能力迎接 Vibe Automation

這個更新不代表以後不用學 n8n。相反地，以下五個能力會更重要：

### 1. 需求描述

不要只說「我想自動化」，而要說清楚：

> 當 A 發生時，取得 B 資料，判斷 C 條件，再執行 D；如果失敗，要通知誰、留下什麼紀錄？

### 2. 流程設計

AI 可以產生 Workflow，但你仍然要判斷流程是否合理：

```text
Trigger
  ↓
驗證輸入
  ↓
讀取資料
  ↓
判斷條件
  ├── 成功路徑
  └── 例外路徑
  ↓
通知與紀錄
```

### 3. 資料結構

你至少要看得懂輸入與輸出的 JSON，才能判斷 AI 是否接錯欄位：

```json
{
  "customer": {
    "name": "王小明",
    "phone": "09xxxxxxxx"
  },
  "appointment": {
    "date": "2026-09-01",
    "time": "14:00"
  }
}
```

### 4. 系統整合

Workflow 的價值不在於 Node 越多，而在於它能否穩定串接 Webhook、資料庫、API、LINE、Google Calendar 與通知服務。

### 5. 判斷 AI 做得對不對

AI 產生的 Workflow 仍然需要測試：

```text
正常輸入
 ↓
邊界條件
 ↓
Credential 失效
 ↓
API timeout
 ↓
重複事件
 ↓
資料是否正確寫入
```

「可以產生」與「可以安全交付」是兩件不同的事。

## 我的建議：先保留現在的 n8n，再逐步接上 AI Assistant

如果你的 n8n 已經架在 Zeabur，而且 PostgreSQL、task-runner、Webhook 與既有 Workflow 都正常，我會採用以下順序：

```text
① 備份目前 n8n、PostgreSQL 與 Credentials
        ↓
② 確認目前版本與官方 AI Assistant 相容性
        ↓
③ 升級 n8n，先驗證原有 Workflow
        ↓
④ 在 n8n 設定 OpenAI / Anthropic / OpenRouter 等模型
        ↓
⑤ Sandbox 選 Daytona，或依資料政策自架 n8n-sandbox
        ↓
⑥ Web Search 選 Brave，或在 Zeabur 部署 SearXNG
        ↓
⑦ 用測試 Workflow 驗證建構、修正與儲存流程
```

不要因為想玩一個新功能，就先把正常環境打掉重來。

Self-hosted 真正重要的能力，不是「什麼東西都自己架」，而是：

> 哪些東西值得自己管理，哪些東西交給專門服務反而更合理？

對 Zeabur + n8n 來說，我目前會把界線畫在：

```text
核心自動化平台與資料
        ↓
由 Zeabur 控制

AI Assistant 的短生命週期執行環境
        ↓
交給 Daytona，或依資料政策自架 Sandbox
```

這樣既保留 Self-hosted n8n 的控制力，也不必為了 AI Assistant 把所有基礎設施一次複雜化。

## 參考文件

- [n8n Community：AI Assistant on self-hosted n8n: easier setup in 2.35](https://community.n8n.io/t/ai-assistant-on-self-hosted-n8n-easier-setup-in-2-35/308257)
- [n8n 官方 One-line setup 文件](https://docs.n8n.io/deploy/host-n8n/install-options/one-line-setup/)
- [n8n 官方 Docker Compose 安裝文件](https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose/)
- [n8n Instance AI configuration](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/instance-ai/docs/configuration.md)
- [n8n Instance AI sandboxing](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/instance-ai/docs/sandboxing.md)
- [n8n task runners 文件](https://docs.n8n.io/deploy/host-n8n/configure-n8n/set-up-task-runners/)
- [Zeabur：Deploying with Dockerfile](https://zeabur.com/docs/en-US/deploy/methods/dockerfile)

## 常見問答 (FAQ)

### Q1：One-line setup 會自動安裝 Docker 嗎？

不會。你必須先安裝並啟動 Docker，且 `docker compose version` 可以正常執行；One-line setup 主要負責建立 n8n、Sandbox、SearXNG 與相關 Docker Compose 設定。

### Q2：n8n 的 task-runner 和 AI Assistant Sandbox 是同一個東西嗎？

不是。task-runner 主要負責執行 Workflow 中 Code Node 的 JavaScript 或 Python 程式碼；AI Assistant Sandbox 則提供 Workflow Builder 建立檔案、編譯 TypeScript、執行測試與產生 Workflow JSON 的隔離工作區。

### Q3：n8n-sandbox 和 Daytona 該怎麼選？

n8n-sandbox 適合本機開發、測試與希望所有資料留在自己 Infrastructure 的環境；Daytona 適合希望把 AI 產生程式碼的執行環境與正式 n8n Host 分開、降低自維護 Docker-in-Docker 複雜度的 Production 情境。若資料不得離開指定環境，應優先評估自架 Sandbox 或暫不啟用 Workflow Builder。

### Q4：如果我已經在 Zeabur 使用 n8n 和 task-runner，還需要 Sandbox 嗎？

需要。task-runner 不會自動提供 AI Assistant Workflow Builder 所需的 Sandbox；兩者用途不同，可以同時存在。你仍然要另外設定 n8n-sandbox 或 Daytona 作為 Sandbox Provider。

### Q5：Daytona 會帶來哪些風險或成本？

Daytona 會增加第三方服務依賴、API Key、使用量與費用，而且 AI Assistant 建構過程的檔案與資料可能進入外部 Sandbox。使用前應檢查企業資料政策、供應商條款、敏感資料遮罩與可接受的服務中斷範圍。

### Q6：沒有 Web Search Provider 時，AI Assistant 還能使用嗎？

可以使用部分功能，但主動 Web Search 會被停用；依目前 n8n 設定文件，`fetch-url` 仍可能可用。若需要查詢最新 API 文件，應設定 Brave Search 或 SearXNG，並確認搜尋資料的合規要求。

### Q7：One-line setup 適合直接拿來跑企業 Production 嗎？

它適合快速學習、測試與 Demo，但不等於完整的企業 Production 架構。正式環境仍要評估 PostgreSQL、HTTPS、備份與復原、權限、監控、更新回滾、Sandbox 隔離與資料邊界。
