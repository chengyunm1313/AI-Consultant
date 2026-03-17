---
title: n8n 教學：從零開始的 Level 1 官方課程與基礎工作流實戰
cover: /images/cover90.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - AI工具
  - n8n
date: 2026-03-18 00:42:55
subtitle:
description: 想學習 n8n 自動化工作流嗎？跟著享哥一起進入 n8n Level 1 官方入門課程！本篇教學將帶你認識編輯器介面，並實戰建立第一個擷取 Hacker News 文章的自動化工作流。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/WYhNVEqdNA8?si=MTYhqcJYgIaHfWjj" 
    title="n8n 教學：從零開始的 Level 1 官方課程與基礎工作流實戰" 
    allow="fullscreen">
  </iframe>
</div>

歡迎回到課程，我是享哥，一個熱愛 AI 自動化的男人。

如果你已經完成了 n8n 的基礎建置（例如透過 Zeabur 部署），接下來我們就要開始進行實戰練習。在練習的過程中，我們會大量使用到 n8n 官方提供的 **Level 1** 入門課程。

👉 官方課程入口：  
https://docs.n8n.io/courses/level-one/

本篇教學將帶你了解 n8n 節點的基本應用，並實作一個自動化擷取新聞的工作流。

## n8n Level 1 課程介紹與前置準備

n8n Level 1 是官方推出的初階認證路線入門課程。透過這個課程，你可以了解 n8n 的基礎節點結構、如何設定參數，以及如何把資料串接起來完成實際案例。

### 語言翻譯建議
因為官方課程全為英文，若你打算自學，強烈建議安裝「沉浸式翻譯」這類的瀏覽器擴充功能：

👉 工具連結：  
https://immersivetranslate.com/zh-TW/

安裝後只需點選「翻譯為繁體中文」，就能輕鬆閱讀官方教材，大幅降低學習門檻。

### 課程註冊與憑證獲取
在開始官方的實作前，你必須先取得課程專屬的憑證：
1. 準備好你的 n8n 伺服器（自建或使用 n8n Cloud 皆可）。
2. 在官方課程頁面完成註冊。
3. 註冊後，你會收到一封包含認證資訊的信件，裡面會有 `Unique ID`、`Webhook URL` 以及 `Header Auth name / value`。
4. 這些憑證（類似 API Key 的概念）將用於後續課程的作業驗證，請務必妥善保存。

完成這份約兩小時的課程並通過最終測驗後，你就能獲得 n8n 官方頒發的 Level 1 徽章與頭像！

## 認識 n8n 編輯器介面 (Editor UI)

要熟練操作 n8n，首先必須認識它的使用者介面。n8n 的介面設計非常直覺，主要分為以下幾個區塊：

### 1. 左側面板 (Left-side Panel)
左側選單收納了工作流的核心功能與設定：
* **Workflows**：管理所有工作流
* **Templates**：官方與社群範本
* **Credentials**：API 憑證管理
* **Variables / Insights**：進階設定與洞察

### 2. 頂部工具列 (Top Bar)
* 工作流名稱：可重新命名
* 標籤 (Tags)：建議加上 `Level 1`
* 版本紀錄 (History)：可還原歷史
* 發佈 (Publish)：啟用工作流
* 進階選項：JSON 匯出 / 匯入

### 3. 中央畫布 (Canvas)
* 縮放：Cmd + 滾輪
* `Zoom to Fit`：置中
* `Tidy Up`：自動整理
* `Execute workflow`：執行測試

## 實戰演練：建立第一個 n8n 工作流

目標：**擷取 Hacker News 最新 10 篇 automation 文章**

### 步驟 1：新增 Manual Trigger
1. 點擊 `+`
2. 選擇 `Trigger manually`

### 步驟 2：設定 Hacker News 節點
* Operation：All  
* Limit：10  
* Keyword：
```text
automation
````

**Notes：**

> 獲取最新 10 篇文章

### 步驟 3：測試

* 點擊 `Execute step`
* 成功會出現綠勾
* 建議切 JSON 檢視除錯

### 步驟 4：儲存與備份

* 命名：`Hacker News workflow 01`
* 匯出 JSON 備份

---

## 常見問答 FAQ

### Q1：n8n Level 1 值得學嗎？

非常值得。這是官方設計的入門路線，能幫你快速建立「節點思維」與「資料流串接能力」，是後續進階自動化的基礎。

### Q2：一定要自架 n8n 嗎？

不一定，你可以：

* 用 n8n Cloud（最快）
* 自架（Zeabur / Docker / VPS）

👉 建議：新手先 Cloud，熟了再自架

### Q3：為什麼要用 Hacker News 範例？

因為它：

* 不需要 API Key
* 結構簡單
* 很適合練習資料流

### Q4：JSON 檢視為什麼重要？

因為 n8n 本質是「資料流工具」，你必須理解：

* 每個節點輸出的資料結構
* 欄位名稱
* 如何傳遞到下一個節點

這是所有自動化的核心能力。

### Q5：沉浸式翻譯真的有用嗎？

超級有用，尤其對官方文件：

* 一鍵中英對照
* 保留原文
* 不會破壞排版

👉 幾乎是學英文技術文件的神器

---

恭喜你！你已經完成第一個 n8n 工作流。


