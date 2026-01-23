---
title: Remotion × AI Agent：用 React 與 AI 程式化製作影片的完整實戰教學
cover: /images/cover72.png
toc: true
categories:
  - 生成式AI應用
tags:
  - Remotion
  - React
  - AI Agent
date: 2026-01-23 22:47:40
subtitle:
description: 傳統影片剪輯耗時又費力，本文將揭示如何透過 Remotion 結合 AI Agent，用寫 React 程式碼的方式自動化產出影片。從環境建置到 AI 指令實戰，掌握這套「程式化影片」的高效工作流，讓 AI 幫你完成 60% 的繁瑣苦工。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/H2Sa1b2YD4E?si=QvZcqNAV4vrqVvHC" 
    title="Remotion × AI Agent：用 React 與 AI 程式化製作影片的完整實戰教學" 
    allow="fullscreen">
  </iframe>
</div>

做影片很累，傳統剪輯軟體又貴又花時間。你可能以為想做出好影片，非得精通 Premiere 或 Final Cut 不可。其實不用，現在的趨勢是「用程式碼做影片」。

Remotion 這個工具，讓你可以用寫 React 的方式「編譯」出 MP4。加上最新的 AI Agent 技術，甚至連程式碼都不用自己寫。只要一句話，系統自動幫你把影片「算」出來。

## 用程式寫影片的底層邏輯

Remotion 的核心理念叫做「Make videos programmatically」。這聽起來很硬核，但邏輯其實很性感。它把影片的每一幀，都變成了可控的程式碼參數。

以前你需要用滑鼠在時間軸上拉來拉去，還要對齊到崩潰。現在透過 API，你可以精準控制像素的運動。這不僅是工具的轉換，更是生產力的槓桿。

關鍵在於它最近推出的 Agent Skills 功能。這讓 Claude 或 GPT-4 這樣的 AI 模型，能夠讀懂 Remotion 的操作手冊。AI 不再只是瞎猜，而是拿著說明書在幫你蓋房子。

## 環境建置的關鍵細節

開始之前，先在桌面建個資料夾，打開終端機。輸入以下指令初始化專案：

```bash
npx create-video@latest

```

這一步很簡單，但接下來的選項決定成敗。系統會問你一連串設定：

1. **Template:** 選 `Blank`
2. **TailwindCSS:** 建議選 `Yes`
3. **Add Agent Skills:** **請務必、絕對要選 `Yes**`

這不是選配，這是讓 AI 能夠自動寫作的靈魂。選了它，專案裡才會下載給 AI 看的文檔與技能樹。沒選這個，AI 寫出來的程式碼大概率跑不動。

## 讓 AI 接手繁瑣工作

安裝完依賴套件並啟動開發伺服器後，你會看到瀏覽器跳出預覽畫面。這時，請打開支援 AI 的編輯器（如 Antigravity 或 Cursor）。我們準備開始下指令。

直接在對話框輸入你的需求，模型建議選擇邏輯較強的 Claude 4.5 Sonnet：

> 「幫我做一支 10 秒介紹 n8n 的短影片，內容要酷炫。」

AI 會先讀取專案裡的 `SKILL.md`，理解它能做什麼。接著它會規劃場景、設計動畫，然後直接修改 `Root.tsx`。它會自己寫 Component，自己加 Fade in/out 效果，甚至自己除錯。

## 反直覺的效率優勢

你可能覺得寫程式做影片很反直覺。但當你想要微調字體大小，或是想統一所有轉場的速度時，改一行程式碼，比在傳統軟體軌道上一個個點開調整快太多了。

這就是「可程式化」的降維打擊。範例中，AI 自動生成了包含 Logo 動畫與卡片介紹的 9 秒影片。如果不滿意，只要動動嘴（Prompt）或動動手指（Code）微調即可。

確認無誤後，輸入渲染指令：

```bash
npx remotion render

```

AI 通常連這行指令都會幫你準備好。按下 Enter，一個真實的 MP4 檔案就會出現在輸出資料夾。

## 60/40 的人機協作法則

別指望 AI 一次給你 100% 的完美成品，那是不切實際的幻想。聰明的做法是讓 AI 搞定 **60% 的苦工**。讓它完成架構搭建、基礎動畫邏輯與素材佔位。

剩下的 **40%**，靠你的人類美感去微調程式碼。這種工作流比從零開始剪輯快，又比全靠 AI 抽卡精準。這才是 Remotion 結合 Agent 的真正威力。

