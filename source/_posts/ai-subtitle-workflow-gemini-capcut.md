---
title: AI 影片字幕工作流：結合 Gemini 與剪映的極速上字幕教學
cover: /images/cover67.png
toc: true
categories:
  - 生成式AI應用
tags:
  - Google AI Studio
  - Gemini 3 Pro
  - 剪映 CapCut
date: 2025-12-09 17:08:34
subtitle:
description: 解決字幕製作痛點！本教學分享如何利用 Gemini 3 Pro 進行精準聽寫與潤飾，並搭配剪映「文稿匹配」功能，實現高準確率、閱讀體驗優化且極速同步的 AI 字幕工作流。
---
<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/AMBlGOiViUQ?si=Yp_bCx0dop70PP8i" 
    title="AI 影片字幕工作流：結合 Gemini 與剪映的極速上字幕教學" 
    allow="fullscreen">
  </iframe>
</div>


這套流程解決了影片創作者在製作字幕時的三個核心問題：

1.  **專業術語準確率**：確保 GenAI、LLM、Python 等詞彙不被聽錯。
2.  **閱讀體驗優化**：自動加中英空格、去除口語贅詞（然後、那個）、符合人眼閱讀的斷句。
3.  **極速同步**：利用「文稿匹配」功能，免去手動對時間軸的繁瑣過程。

## 🛠️ 準備工具

* **剪映 / CapCut 電腦版**
* **Google AI Studio** (網頁版，建議使用 Gemini 3 Pro 模型，免費且 Token 上限極高)

## 步驟一：音頻導出

在剪映/CapCut 完成剪輯後，先不要上字幕，執行以下操作：

1.  點選 **導出**。
2.  僅勾選 **「音頻導出」** (格式選 MP3 或 AAC 即可)。

> **💡 優化點：** 處理長影片（超過 30 分鐘）時，建議每 15-20 分鐘切一段導出，避免剪映免費版「文稿匹配」的字數限制。

## 步驟二：AI 聽寫與校正

這是最關鍵的一步。我們不只是要「轉錄」，更是要讓 AI 幫我們「潤飾」。

1.  前往 **Google AI Studio**。
2.  模型選擇 **Gemini 3 Pro**。
3.  將導出的 MP3 檔案拖入對話框。
4.  輸入下方的 **【提示詞】**：

[AI 影片字幕提示詞](https://docs.google.com/document/d/15PQ3iqzbv9ET38X1BqDVOzW7xCuNTiXZJCrHTGSrc9o/edit?usp=sharing)

### 為什麼這樣設計？

  * **Step 1 術語確認**：把 "Notion" 聽成 "Nation" 是不專業的。先讓 AI 問你，只需 30 秒確認，就能保證後面 100% 正確。
  * **斷句控制（優化點）**：手機直式影片（Reels/Shorts）字幕不宜過長，提示詞中已加入控制，確保閱讀體驗。

### 💡 使用小撇步

  * **遇到極短音頻（\< 3分鐘）**：Gemini 通常會很有自信，它會直接跳過 Step 1 給您全文，達到「秒出」的效果。
  * **遇到新專案/新主題**：如果你這支影片是講一個全新的工具（例如突然要講 "Cursor" 編輯器），您在貼上 Prompt 之後，可以順手在 `# Context & Vocabulary` 那邊補上 "Cursor" 這個字，這樣一次就會準。
  * **關於「文稿匹配」**：複製 AI 輸出的文字後，在剪映中選擇「文稿匹配」時，記得檢查一下**第一句是否對齊**。只要第一句對了，後面通常 99% 都是準的。

您可以現在就拿一段最近錄製的音檔（或上面那支 YouTube 影片的音頻）去 Google AI Studio 試跑一次，看看效果是否符合您的期待！

## 步驟三：極速匹配

拿到 AI 生成的完美文本後：

1.  複製 AI 輸出的全部文字。
2.  回到 **剪映 / CapCut**。
3.  點擊 **「文本」** -\> **「智能文本」** -\> **「文稿匹配」**。
4.  貼上文字，點擊「開始匹配」。

**實測結果：** 99% 準確的字幕會自動對齊音軌。

## 🌟 進階場景分流

根據您不同的產出需求，這裡提供兩個分支技巧：

### 場景 A：製作「雙語字幕」短影音

如果您想做像國外科技博主那種中英雙語字幕：

1.  **AI 生成 SRT**：在 Google AI Studio 完成中文稿後，多加一道指令：
    > 「請將上述內容翻譯成英文，並將兩者合併為 SRT 格式（第一行為中文，第二行為英文）。」
2.  **導入剪映**：將 AI 生成的代碼存為 `.srt` 檔，直接拖入剪映。

### 場景 B：超長課程影片 (\>30min)

剪映的「文稿匹配」有時對長文本不穩定。

1.  **分段處理**：如筆記所述，將音頻切成 10-15 分鐘一段。
2.  **SRT 暴力解法**：如果不想分段，直接請 Gemini 輸出「帶時間軸的 SRT 格式」。
    > **Prompt 補充指令**：「請直接輸出 SRT 字幕格式，不需要與我確認術語。」

雖然 Gemini 的時間軸不如專門軟體（如 Whisper）精準到毫秒，但對於說話清晰的教學影片通常夠用，導入後只需微調。

參考文章：
- [AI 字幕工作流完整教學／提示詞](https://raymondhouch.notion.site/ai-subtitle)
- [秒殺剪映的AI字幕工作流！准確率高達99%，完全免費！](https://fizaghzgugc.feishu.cn/wiki/GAfSwoA6BiayfukXPlPcXYAXn4e)
