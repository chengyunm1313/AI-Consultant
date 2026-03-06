---
title: 顛覆 WordPress 開發模式！免費開源外掛 Novamira 讓 AI 直接修改網站程式碼
cover: /images/cover73.png
toc: true
categories:
  - 生成式AI應用
tags:
  - Vibe Coding
  - AI工具
date: 2026-03-02 00:30:06
subtitle:
description: WordPress 開發迎來重大革新！全新開源外掛 Novamira 透過 MCP 協定，讓 Cursor、VS Code 等 AI 工具直接讀寫伺服器 PHP 程式碼。本文將實測這款能自動生成主題與外掛的神器，帶你體驗零隔閡的 AI 協作開發模式。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/bNOLWZuPx3g?si=VdfnA97wbpETbUOh" 
    title="顛覆 WordPress 開發模式！免費開源外掛 Novamira 讓 AI 直接修改網站程式碼" 
    allow="fullscreen">
  </iframe>
</div>

各位同學大家新年快樂，我是享哥！

今天要跟大家分享近期在 Threads 上面非常火紅的一款 WordPress 全新開源外掛——**Novamira**。這款在二月份剛開源的外掛，看過介紹後讓我非常好奇，因為它號稱能夠徹底顛覆現有的 AI 協作模式。經過實際測試後，接下來我將完整分享我的使用心得與操作教學。

## Novamira 是什麼？為什麼能顛覆 AI 協作模式？

Novamira 的核心價值在於徹底打通了 WordPress 與 AI 開發工具（如 Cursor、VS Code、Claude Desktop 等）之間的隔閡。

過去我們在開發或修改 WordPress 主題與外掛時，必須先看懂 PHP 程式碼，遇到問題還要將整段程式碼複製丟給 AI，等 AI 產出解答後再手動貼回伺服器。而 Novamira 透過 MCP (Model Context Protocol) 協定，賦予 AI 直接讀取、寫入、編輯現有檔案，甚至刪除伺服器上 PHP 程式碼的能力。

## 如何安裝與設定 Novamira？完整圖文步驟

要讓 AI 與你的 WordPress 網站順利連線，請跟著以下步驟進行設定：

### 步驟一：下載與安裝外掛

1. 前往 Novamira 官網，直接點擊 `Download for free` 下載外掛壓縮檔。
2. 開啟你的 WordPress 後台（建議先準備一個全空的測試環境）。
3. 進入外掛選單，點擊「上傳檔案」，將剛剛下載的壓縮檔上傳並啟用。

### 步驟二：產生並配置 MCP 伺服器金鑰

安裝完成後，我們需要建立一組讓 AI 工具存取網站的授權密碼：

1. 在外掛設定頁面，點擊 `Create New Application Password`。
2. 系統會自動產生一組專屬密碼（請注意：**此密碼只會出現一次**，務必妥善複製並保存）。
3. 頁面下方非常貼心地準備好了對應的設定檔語法。無論你是使用 `Claude Code`、`Claude Desktop`、`Cursor` 或 `VS Code`，只需複製畫面上提供的 JSON 內容。
4. 將複製的內容，貼到你常用的 AI 工具的 `mcp.json` 設定檔中。

```json
// 示意範例：請將外掛產生的設定完整貼入你的 MCP Servers 區塊中
"mcpServers": {
  "novamira": {
    "command": "...",
    "args": ["..."],
    "env": {
      "WP_APP_PASSWORD": "你的專屬密碼"
    }
  }
}
```
*(設定完成後，記得使用 `Ctrl + S` 或 `Command + S` 儲存設定檔，並在 AI 工具的 MCP 介面點擊 `Refresh` 重新整理。)*

### 步驟三：開啟 WordPress 端的 AI 權限

為了確保連線成功，最後一個關鍵步驟是回到 WordPress 進行授權：

1. 進入 WordPress 的 `Setting` (設定) 頁面。
2. 找到並勾選 `Enable AI Ability` 選項。
3. 點擊 `Save` 儲存設定。

完成以上三步後，你可以在 AI 聊天視窗中輸入：「我已經連上了，你可以幫我確認一下目前 WordPress 網站的基本資訊嗎？」如果 AI 能順利回報你的網站目錄與結構，就代表連線大功告成了！

## Novamira 的資安防護：核心檔案無法竄改

開放 AI 直接存取伺服器聽起來有些危險？不用擔心，Novamira 在安全機制上做了嚴格的限制。

它**不允許** AI 修改 WordPress 的核心底層檔案，例如：
*   `wp-admin`
*   `wp-includes`

AI 能夠讀取與修改的範圍，僅限於我們日常開發最常接觸的 `wp-content` 目錄（包含主題與外掛）。這種沙盒式 (Sandbox) 的限制，大幅降低了網站因 AI 誤改而崩潰的資安風險。

## 實測應用：讓 AI 直接在伺服器寫出一個聯絡表單外掛

為了測試它的極限，我準備了一份由 ChatGPT 簡單生成的「Mini Contact Form (迷你聯絡表單)」PRD (產品需求文件)，並直接丟給透過 MCP 連接的 AI 助理（我使用的是 Google 的 Antigravity 搭配免費額度）。

[Mini Contact Form.md](https://drive.google.com/file/d/1jt0tCJ6FCXjAdLJdEM8ef-3nJh-XFjE0/view?usp=sharing)

**神奇的事情發生了：**
1. AI 首先讀取了我提供的需求文件。
2. 它自動擬定了一份實作計畫 (Plan) 與任務清單 (Task)。
3. 接著，AI **直接在我的 WordPress 伺服器內部**開始撰寫程式碼。

我打開 WordPress 的外掛目錄檢查，發現 AI 真的已經在伺服器端建好了這個外掛的檔案夾與程式碼，而不是在我的本機檔案總管裡產生文件！這意味著我們可以一邊讓 AI 開發，一邊直接在 WordPress 後台重整看結果，開發效率呈現倍數成長。

## 結語：WordPress 接案開發的未來趨勢

Novamira 打通了 WordPress 與 AI 之間的最後一哩路。對於以 WordPress 接案為主的開發者來說，未來遇到需要客製化功能、增強現有外掛時，不再需要繁瑣地查閱原始碼或在編輯器間來回複製貼上。透過 MCP 協定，AI 將成為你最得力的伺服器端駐點工程師。

如果你想了解更多關於 AI 自動化以及相關的開發應用，歡迎持續關注並訂閱享哥，我們下次見！
