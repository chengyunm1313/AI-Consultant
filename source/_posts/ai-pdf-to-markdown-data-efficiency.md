---
title: 別存垃圾格式！用 AI 把 PDF 洗成 Markdown，資料利用率翻倍
cover: /images/cover68.png
toc: true
categories:
  - 生成式AI應用
tags:
  - Google Gemini
  - PDF轉檔
  - Markdown
  - Prompt Engineering
  - 資料清洗
date: 2025-12-11 23:47:35
subtitle:
description: PDF 難以整理利用？本文分享如何透過 Google Gemini 的 Gems 功能，建立自動化 Prompt 工作流，將 PDF 轉為結構乾淨的 Markdown，大幅提升資料在 NotebookLM 或簡報製作的利用率。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/ILaJ5lmCrZE?si=WDJbvJ2aee1du_Vt" 
    title="別存垃圾格式！用 AI 把 PDF 洗成 Markdown，資料利用率翻倍" 
    allow="fullscreen">
  </iframe>
</div>

PDF 這種檔案格式，閱讀體驗極佳，但要整理或再利用時，簡直是場災難。我們都試過直接複製貼上，或者丟給傳統轉檔工具。結果往往令人崩潰：排版跑位、亂碼橫生、段落碎成一地。

如果你的目標是把資料餵給 AI（如 NotebookLM）或是做成簡報，那你真正需要的，不是「轉檔」，而是把內容清洗成 AI 最懂的 Markdown。這不需要複雜的程式碼，只需要一個懂事的 AI 助手。

這裡的核心工具是 **Google Gemini**（特別是 Advanced 版更好）。我們要利用它的「Gems（自訂 AI 助手）」功能，把這件事變成一套固定的自動化流程。

## 建立你的專屬轉檔 Gem

別每次都重新下指令，那太沒效率。請依照以下步驟設定你的專屬工具：

1.  直接進到 Google Gemini 右側的「Gem 管理器」。
2.  點選「新增 Gem」。
3.  幫它取個直白的名字，例如「PDF 轉 Markdown 助手」。

接下來的重點在於「使用說明（Prompt）」。千萬不要只寫「幫我轉檔」，那樣你會得到一堆垃圾。你需要植入一套有邏輯的結構化指令。

## 設計 Prompt 的核心邏輯

想哥特別強調，我們要設計的是「工作流」，而不是單一指令。這套 Prompt 必須包含三個關鍵原則，缺一不可：

1.  **內容完整性**：確保 AI 不會自作聰明刪減資料。
2.  **結構化呈現**：指定使用 Markdown 語法。
3.  **分階段執行**：這點最反直覺，但最重要。不要妄想一步到位，要讓 AI 慢下來。

建議的操作順序為：**第一階段**，請 AI 先「閱讀並校對」，確認有無錯別字或識別錯誤；確認無誤後，**第二階段**才進行翻譯（若需要）並輸出繁體中文 Markdown。分兩步走，準確率會大幅提升。

## 實戰中的除錯技巧：解決引用代碼干擾

把 PDF（例如 NVIDIA 的財報）丟進去後，AI 會開始跑流程。但這裡有個 Gemini 目前的小 Bug，很搞人心態。當你直接複製生成的內容時，它會連同「引用來源代碼」一起複製。

貼到筆記軟體時，這些代碼會讓格式再次亂掉。解決方法很粗暴，但很有效。等 AI 生成完，多補一句指令：

```
去除資料來源
```

AI 會乖乖吐出一份乾淨、沒有干擾連結的 Markdown。這時候你再複製，就能得到完美的標題層級與內文。這才是我們要的純淨數據。

## Markdown 格式的後續應用槓桿

拿到這份乾淨的 Markdown 後，用途就廣了：

  * 最直接的，貼到 **NotebookLM** 進行更深度的 RAG 分析。
  * 或是利用這些結構化文字，快速轉成 **Google Slides** 或 PPT。

這個方法的精髓，在於「分段處理」與「格式清洗」。不求快，先求準，最後再把雜質濾掉。把最難搞的 PDF，變成最聽話的素材。