---
title: 長會議錄音檔 AI 處理全攻略：突破 100MB 限制的終極解法
cover: /images/cover65.png
toc: true
categories:
  - 生成式AI應用
tags:
  - Google AI Studio
  - 會議記錄
  - 逐字稿
date: 2025-12-05 22:11:27
subtitle:
description: 錄音檔太長導致 AI 處理卡關？本文解析 Google Gemini、NotebookLM 與 AI Studio 的檔案限制，並提供突破 100MB 限制的完整攻略，教你如何利用 Google AI Studio 輕鬆處理數小時的會議錄音與逐字稿。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/Az03D7LJxoA?si=6fYW9oBp_Xwvqw8D" 
    title="長會議錄音檔 AI 處理全攻略：突破 100MB 限制的終極解法" 
    allow="fullscreen">
  </iframe>
</div>

錄音檔一長，處理起來就是災難。想要丟進 AI 偷個懶，結果系統第一步就卡關，告訴你檔案太大，請你另請高明。

這時候你需要的不是放棄，而是搞清楚你手上的工具，到底哪一把才切得動這塊肉。

## 各大 Google AI 工具的真實門檻

面對 MP3 這類音訊檔案，你得先看清楚檔案大小，再決定用哪把刀。別拿水果刀去砍大樹。

### 1. Google Gemini 網頁版
這是大家最常用的工具，但限制最嚴格。
* **單一檔案上限：** 100 MB。
* **實測結果：** 182MB 直接報錯，84MB 才能過關。
* **解法：** 如果堅持要用這個介面，唯一的解法就是手動轉檔。把 Bitrate 降到 16kbps，用音質換體積。

### 2. NotebookLM
進階一點的選項，寬容度稍微大一點。
* **單一檔案上限：** 200 MB。
* **適用場景：** 中型檔案。丟進去，直接問答，或者生成摘要。
* **優勢：** 介面友善，還會自動幫你整理筆記，算是不錯的中繼站。

### 3. Google AI Studio (終極解法)
如果你面對的是真正的巨獸，例如好幾個小時的馬拉松會議，前面這兩個工具可能都會吃鱉。這時候，請直上 Google AI Studio。
* **單一檔案上限：** 2 GB。
* **建議模型：** Gemini 3 Pro Preview 或同級模型（支援超長 Context Window）。
* **實測能力：** 影片示範裡，3 小時、182MB 的音檔，它吃得輕輕鬆鬆。

## 處理超大音檔的標準作業流程

當你的錄音檔超過 200MB，或是會議長達數小時，請放棄網頁版對話框。這才是最穩定的路徑。

**第一步：前往 Google AI Studio**
直接前往 Google AI Studio。別走錯棚，這裡才是開發者的後花園，也是一般用戶的強力外掛。

**第二步：切換模型**
在右側或上方選單，確認版本。選 Gemini 2.5 Pro 或最新的 3 Pro Preview，Token 夠大才跑得動。

**第三步：上傳檔案**
點擊那個顯眼的加號，選擇 `Upload File`。MP3 等主流格式通通支援。

> **注意：** 系統會把檔案暫存到你的 Google Drive。如果上傳失敗，先別罵 AI，去檢查一下你的雲端硬碟是不是爆了。

**第四步：下達指令**
等檔案讀取條跑完，直接在對話框輸入需求。

```text
幫我生成逐字稿
```

或者：

```text
總結會議重點與待辦事項
```

**第五步：執行**
按下 `Run`。讓 AI 去跑，你喝口水。分析結果隨後就到。

## 魔鬼藏在細節裡

使用 AI Studio 雖然爽快，但它吃的其實是你的 Google Drive 空間。免費用戶那 15GB 如果滿了，這招一樣行不通。

關於 Token 的消耗量，不用太擔心。

  * 3 小時的音檔大約消耗 **36 萬 Tokens**。
  * 目前的模型都支援到 **100 萬甚至 200 萬**。

這意味著，處理半天甚至全天的會議紀錄，這容量是綽綽有餘的。

最後，如果你真的不想切換到開發者介面，還有一個最原始的物理外掛：**壓縮音質**。對於語音辨識來說，高音質其實是浪費。


> **轉檔建議**
> 把 MP3 降到 32kbps 甚至 16kbps


AI 照樣聽得懂，但檔案大小會顯著縮水。有時候，暴力解法也是一種解法。

-----

**參考連結：**

  * [Google Gemini 說明](https://support.google.com/gemini/answer/14903178?hl=zh-Hant&co=GENIE.Platform%3DDesktop)
  * [Google AI Studio 格式與限制說明](https://www.datastudios.org/post/google-ai-studio-file-upload-and-reading-formats-limits-structured-output-and-long-context-wor)