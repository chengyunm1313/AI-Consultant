---
title: n8n MCP 完整安裝教學：讓 AI 幫你自動生成 n8n 工作流 (Vibe n8n)
cover: /images/cover82.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - Vibe Coding
date: 2026-03-11 02:38:29
subtitle:
description: 想要讓 AI 直接幫你寫好 n8n 工作流嗎？本文將教你如何透過 npx 安裝與設定 n8n MCP 伺服器，擺脫手動匯入 JSON 的麻煩，輕鬆體驗 Vibe Coding 的強大自動化魅力。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/kbHjFoklTyU?si=kVFqe0nMExW9EElU" 
    title="n8n MCP 完整安裝教學：讓 AI 幫你自動生成 n8n 工作流 (Vibe n8n)" 
    allow="fullscreen">
  </iframe>
</div>

大家好，我是享哥，今天要跟大家分享 n8n 的 MCP (Model Context Protocol)。

你有沒有想過，我們在用 n8n 拉節點、建構工作流的時候，如果可以透過 Vibe Coding 的方式，直接請 AI 幫我寫好程式，甚至透過 n8n 的 MCP，直接在 n8n 伺服器上幫我建立好 Workflow，是不是更好呢？

以往我們的作法是：請 AI 幫我們寫好 Workflow 的 JSON 檔，然後手動 Import (匯入) 到 n8n Server 上去除錯 (Debug)。發生問題時，又要回到 AI 那邊修改，修完再匯入。這樣的過程其實滿困擾的。

網路上很多關於 n8n MCP 的教學通常都是使用 Cloud 服務，但常看我影片的朋友就知道，我很少用 Cloud，我大部分都是自建 (Self-hosted)。為了解決這個痛點，我研究了一段時間，發現透過 `npx` 的方式也能順利達成。今天就來帶大家實作！

## 為什麼選擇 npx 方式安裝？

官方 GitHub (czlonkowski/n8n-mcp) 的 Quick Setup 本來就主推 `npx n8n-mcp`，而且它會自動抓取最新版。這也相仿於部分 Cloud Shell 教學採用的 `npx` 當式執行方式。只要把依賴環境準備好，後續執行起來就會非常順暢。

## 前置準備：檢查 macOS 環境

因為我是使用 macOS，以下以 Mac 環境做示範（如果是 Windows 用戶，可以依據概念自行轉換）。

首先，你必須確認你的 Node.js 與 npm 版本。網路上許多測試指出，至少需要 Node.js `22.17` 以上的版本才不會有問題（我自己測試時使用的是 `22.22`，運作正常）。

打開 Terminal，執行以下指令確認版本：

```bash
node --version && npm --version
```

## 步驟一：下載並編譯 n8n-mcp 專案

確認 Node 版本沒問題後，我們要把官方 GitHub 上的專案 Clone 下來。為了配合 MCP Server 的讀取，建議將其放置在根目錄 (Root Directory)。

### 1. 下載專案

```bash
cd ~
git clone https://github.com/czlonkowski/n8n-mcp.git
```

### 2. 安裝依賴模組 (Node Modules)

下載完成後，進入資料夾並安裝依賴：

```bash
cd ~/n8n-mcp
npm install
```

### 3. 編譯專案

安裝完模組後，執行編譯：

```bash
npm run build
```

這一段是為了先把依賴與快取準備好，讓後面透過 `npx` 或直接跑編譯後的檔案時能夠更加穩定。

## 步驟二：取得 n8n API Key

接下來，我們需要一組 API Key 讓 MCP Server 能夠與你的 n8n 實體溝通。

1. 進入你的 n8n 後台。
2. 點擊左下角的 **Settings**。
3. 在選單中找到 **n8n API**。
4. 點擊 **Create an API Key**。
5. **重要提醒：** 建立後請務必立刻把這串 API Key 複製並保存起來，因為視窗關閉後就再也看不到了。

## 測試 n8n API 端點

在我們開始設定 MCP 之前，我建議大家先測試一下 n8n API 端點是否正常運作。這樣可以避免後續設定時遇到莫名其妙的問題。以下是我整理的簡單測試方法和錯誤代碼解釋：

因為 401 代表「API 存在，但你沒有授權」，這其實正是我們測 API endpoint 時想看到的結果。

換句話說：

401 Unauthorized
= 伺服器存在
= API route 存在
= 只是缺少 API Key

所以代表 URL 是正確的，API 有開啟。

### n8n API 正常流程

例如你直接打：

https://你的-n8n-網址/api/v1/workflows

但沒有帶 API Key。

伺服器會回：

401 Unauthorized

意思是：

我知道 /api/v1/workflows
但你沒有權限。

這代表：
	•	n8n server 正常
	•	/api/v1 route 正常
	•	reverse proxy 沒擋
	•	API 功能有開

### 如果 API 有問題會出現什麼

❌ 404

404 Not Found

代表：
	•	URL 錯
	•	proxy 沒轉 /api
	•	path 不存在

例如：

https://你的-n8n-網址/workflows

（少了 /api/v1）

❌ 502 / 503

代表：
	•	n8n server 沒啟動
	•	reverse proxy 壞掉
	•	docker container 掛了

❌ 403

403 Forbidden

代表：
	•	被 WAF / Cloudflare 擋
	•	IP 被限制

### 正常 API 呼叫會是什麼

如果帶 API Key：

```bash
curl -H "X-N8N-API-KEY: your-api-key" \
https://你的-n8n-網址/api/v1/workflows
```

回：

```json
{
  "data": [
    { "id": "1", "name": "workflow1" }
  ]
}
```

### 為什麼很多人用 401 當健康檢查

因為這個測試可以一次確認：
	•	server 存在
	•	API route 存在
	•	proxy 沒壞
	•	API 功能開啟

但 不需要 API key。

所以很多 automation / agent setup 都用這招。

### 快速判斷表

| 回應 | 代表 |
|------|------|
| 401 | API 正常，只是沒登入 |
| 404 | API path 錯 |
| 502 | server 掛 |
| 403 | 被防火牆擋 |

在實作中，我發現很多人會忽略這個測試，但它真的很重要。測試通過後，我們就可以放心進入下一步驟了。

## 步驟三：設定 MCP Server 配置文件 (JSON)

接下來要將 n8n MCP 加入到你的 AI 助手 (如 Claude Desktop, Cursor 等) 中。我們需要編輯 MCP 的 JSON 設定檔。

請將以下的 JSON 格式複製起來，並替換成你自己的參數：

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["-y", "n8n-mcp@latest"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://你的-n8n-網址",
        "N8N_API_KEY": "你的_API_KEY"
      }
    }
  }
}
```

**參數設定重點：**
*   `N8N_API_URL`: 請填入你正在使用的 n8n API 網址。如果你是本地端測試，就填 `http://localhost:5678`。如果是自建的伺服器，就填寫你的獨立網域。
*   `N8N_API_KEY`: 貼上剛剛在步驟二取得的 API Key。

## 步驟四：在 AI 工具中啟用 MCP

以支援 MCP 的 AI 工具為例：
1. 開啟工具的 MCP 設定選項 (通常在右上角或設定選單中的 `MCP Servers`)。
2. 點擊 `Manage MCP Servers`，選擇編輯原始設定 (`View raw config`)。
3. 將上述修改好的 JSON 貼上去。如果你原本就已經有其他的 MCP Server，只需將 `"n8n-mcp"` 這個區塊加入即可。
4. 點擊 **Refresh** (重新整理)。

重新整理後，你就會看到 `n8n-mcp` 的服務被成功啟用 (Enabled)！

此時展開功能列表，你會發現多了非常多控制 n8n 的方法，例如 `get_node`、`search_nodes` 等等。其中最關鍵的一個功能是：**`n8n_create_workflow`**。有了它，AI 就能直接幫我們在伺服器上建立工作流。

## 實戰測試：讓 AI 自動生成「AI 新聞摘要」工作流

設定完成後，我們實際來測試一下。我給 AI 下了這樣一段 Prompt (提示詞)：

> 「請創建一個 n8n 工作流，主題是 AI 新聞摘要。每天都收集最新的 AI 新聞，透過 LLM 整理摘要並加入專家的切角，最後寄信到我的 Gmail 給我。」

按下送出後，AI 思考了幾秒鐘，便開始自動調用 `n8n-mcp` 的各項 Tools：
1. 它先去搜尋 `Schedule Trigger` (每天定時執行)、`RSS Read` (抓取新聞)、`OpenAI` (整理摘要) 以及 `Gmail` (寄信) 相關的節點架構。
2. 接著，AI 擬定好了一個實作計畫，包含這五個節點的連線邏輯。
3. 驗證 JSON 語法無誤後，AI 直接調用 `n8n_create_workflow` 指令。

**結果：AI 成功幫我部署上去了！** 它還直接回傳了建立成功後的 Workflow ID 給我。

此時我回到我的 n8n 後台查看，真的出現了一個名為「每日 AI 新聞摘要與專家分析」的工作流！打開一看，從排程、RSS 抓取、合併資料、OpenAI 處理到寄送 Gmail，所有的節點跟連線都已經拉好。

這意味著什麼？**完全不需要手動 Import JSON 了！** 我們現在可以直接在 AI 聊天室下達指令，讓 AI 幫我們把 n8n 工作流建置在伺服器上，我們只需要進去微調憑證 (Credentials) 或修改部分參數，就可以立刻啟用 (Active)。

## 常見問答

### Q1：一定要先 `git clone` 並 `npm install` 嗎？不是直接用 `npx n8n-mcp@latest` 就可以了嗎？

理論上直接用 `npx` 就可以執行，但如果你是第一次安裝，或遇到套件抓取、編譯相依套件、快取異常等問題，先手動下載專案並完成 `npm install`、`npm run build`，通常會比較穩定。尤其是本地自建環境，先把依賴準備好，後面除錯會省很多時間。

### Q2：如果 AI 工具裡看不到 `n8n-mcp`，該先檢查什麼？

先檢查三件事：

1. JSON 設定格式是否正確，特別是逗號、括號與雙引號。
2. `N8N_API_URL`、`N8N_API_KEY` 是否真的有填對。
3. AI 工具是否已經重新整理 MCP Servers，或重新啟動應用程式。

很多時候不是 n8n-mcp 壞掉，而是設定檔少一個字元，或 API Key 貼錯位置。

### Q3：我用的是本機自建 n8n，也能這樣設定嗎？

可以。如果你的 n8n 跑在本機，通常可設定成：

```json
"N8N_API_URL": "http://localhost:5678"
```

但要注意一件事：你的 AI 工具必須能夠連到這個本機位址。如果 AI 工具本身是裝在同一台電腦上，通常沒問題；如果是遠端環境或沙盒環境，就要另外確認網路可達性。

### Q4：把 `N8N_API_KEY` 放進 MCP 設定檔，會不會有安全風險？

會，所以你要把它當成正式憑證管理。建議至少做到以下幾點：

1. 不要把含有 API Key 的設定檔上傳到 GitHub。
2. 不要截圖公開自己的完整設定內容。
3. 如果懷疑金鑰外洩，立刻回到 n8n 後台重新產生新的 API Key。

只要拿到這把金鑰，理論上就可能透過 MCP 對你的 n8n 做操作，因此一定要小心保存。

## 搭配 n8n-skills 讓操作更順暢

為了讓 n8n-mcp 的操作更加順暢，建議搭配 [n8n-skills](https://github.com/haunchen/n8n-skills) 這個專案。它提供了額外的技能和工具，可以增強 AI 助手在處理 n8n 工作流時的能力。

## 結語

這完美解決了我們以往使用 n8n 時，手動搬運與除錯的痛點。相信以上分享的內容，會對大家在使用 n8n 時有極大的幫助。

希望大家的 n8n Vibe Coding 體驗能夠越來越好，跟我一樣輕鬆用嘴巴 (下指令) 就能完成自動化工作流！如果你有任何問題，歡迎在下方討論；如果你想了解更多 AI 自動化與相關應用的內容，請記得關注與訂閱，我會持續跟大家分享更多實用的技巧。謝謝大家！
