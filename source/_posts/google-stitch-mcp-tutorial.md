---
title: Google Stitch MCP 教學：如何結合 AI 自動化快速生成 Next.js 網站 UI
cover: /images/cover102.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - AI工具
  - Vibe Coding
description: 探索 Google 最新 UI 生成神器 Stitch！本篇教學完整示範如何透過 MCP 協定與 Stitch Skills 擴充，讓 AI 自動規劃 SDD 流程並完美產出零誤差的 Next.js 網站介面。
date: 2026-03-24 21:40:04
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/uUXeh-ZyEiI?si=EEB6-DdWTbF4oriI" 
    title="Google Stitch MCP 教學：如何結合 AI 自動化快速生成 Next.js 網站 UI" 
    allow="fullscreen">
  </iframe>
</div>

Google 近期推出的 **Stitch** 在開發者社群中引起了廣大迴響，其強大的 UI 生成能力令人驚豔。透過結合 MCP (Model Context Protocol) 協定，我們可以讓 AI Agent 自動化處理繁瑣的前端切版工作。

本文將以一個「美甲美容預約系統」的 Next.js 網站為例，帶你一步步拆解如何從零開始，利用 Google Stitch MCP 快速產出具備高質感的網頁 UI。

## 先收藏 3 個官方入口

如果你想快速上手，建議先把下面 3 個官方資源打開，後續安裝與操作時會用得到：

- [Stitch 官網](https://stitch.withgoogle.com/)：先了解 Stitch 的整體能力，包含從提示詞生成 UI、調整版型與匯出成果的核心流程。
- [Stitch MCP 官方安裝文件](https://stitch.withgoogle.com/docs/mcp/setup)：用來設定 MCP Server、完成 API Key 綁定，這是讓 AI Agent 真正能呼叫 Stitch 的關鍵步驟。
- [stitch-skills GitHub 倉庫](https://github.com/google-labs-code/stitch-skills)：Google Labs 提供的 Agent Skills 集合，能讓 Cursor、Claude Code、Gemini CLI 等工具更有效率地配合 Stitch 工作。

## 如何快速完成 Stitch MCP 環境部署？

要讓 AI 能夠直接呼叫 Stitch 的生成能力，我們需要先完成 MCP 伺服器的安裝與 API 金鑰設定。

1. **安裝 Stitch MCP 伺服器**
   在您的 AI 代理開發環境（例如 Cursor、Antigravity 等支援 MCP 的工具）中，開啟 MCP Servers 管理介面，搜尋 `stitch` 並點擊安裝 (Install)。這一步將會自動化載入所需的環境設定。若想對照完整流程，可以直接參考 [Stitch MCP 官方安裝文件](https://stitch.withgoogle.com/docs/mcp/setup)。
2. **獲取 API 金鑰 (API Key)**
   安裝過程中，系統會引導您前往 Stitch 的官方網頁設定。請在設定頁面中點擊「建立金鑰」，生成專屬的 API 金鑰，並將其貼回您的 MCP 設定中妥善儲存以完成身分驗證。

## 擴充 AI 開發火力：安裝 Stitch Skills

光有基礎 MCP 還不夠，為了讓 AI 具備更專業的前端工程師思維，我們需要導入 `stitch-skills`。

這是一個專為 Stitch MCP 伺服器設計的 Agent 技能函式庫，相容於 Gemini CLI、Claude Code 與 Cursor。透過安裝 GitHub 上的 [`stitch-skills`](https://github.com/google-labs-code/stitch-skills) 擴充套件，AI 就能夠遵循更嚴謹的開發標準進行作業，大幅減少生成過程中的邏輯錯誤。

根據該 GitHub 倉庫說明，`stitch-skills` 內建多種實用能力，例如：

- `stitch-design`：負責 Stitch 設計工作流的統一入口。
- `stitch-loop`：可從單一提示詞延伸成完整多頁網站流程。
- `design-md`：協助整理設計系統與 `DESIGN.md` 文件。
- `react:components`：將 Stitch 畫面轉成 React 元件系統，並維持設計 Token 一致性。

如果你平常就是用 AI 編輯器協作開發，這一層 skills 幾乎就是把 Stitch 從「會生成畫面」升級成「更懂前端交付流程」。

## 實戰演練：從需求規劃到自動生成 Next.js 網站

環境建置完畢後，我們就可以開始向 AI 下達開發指令 (Prompt)。以下為本次美甲預約網站的標準化生成流程：

### 1. 啟動 SDD (軟體設計文件) 開發流程
不要讓 AI 直接寫程式碼，而是要求它先執行 **SDD (Software Design Document)** 流程。
AI 會依序產出結構化的規格文件（Spec）、開發計畫（Plan）與任務清單（Task）。這能確保 AI 清楚理解版面規劃，包含：導覽列 (Navbar)、Hero 區塊、服務項目、作品集與顧客評價等區塊。

```
我想做一個美容美甲的預約系統，使用next.j做，先做首頁就好 ，執行 SDD 開發流程，依序產出結構化的 spec、plan 與 task 等規劃文件
```

### 2. 制定設計規範 (Design Tokens)
在產出程式碼前，AI 會依據主題（如：柔和女性化、優雅高質感）自動建立設計系統。例如設定主色為「玫瑰粉 (#D4A5A5)」、背景色為「奶油米」，並指定字型（Playfair Display 與 Inter）。這些 Tokens 將成為後續 UI 生成的核心基準。

### 3. 呼叫 `create_project` 執行 UI 生成
當規劃完成後，AI 會調用 Stitch MCP 的 `create_project` 方法。系統會自動下載所需套件（如 Tailwind CSS）、處理字型與圖標，並開始生成首頁的設計稿與原始碼。

## 完美還原設計稿：如何解決排版誤差？

在初步生成後，您可能會發現瀏覽器渲染的畫面（`localhost:3000`）與 Stitch 原始設計稿有些微出入。這時不需要手動調整 CSS，只需遵循以下步驟：

1. **反饋錯誤訊息：** 將終端機或畫面上的報錯資訊直接貼給 AI 進行初步修復。
2. **要求零誤差校正：** 明確指示 AI：「網頁呈現與 Stitch 原始設計稿不太一樣，請幫我確認並修正」。
3. **自動重構：** AI 會重新比對 Tailwind `tailwind.config.ts` 中的顏色設定、全域 CSS 屬性與各個 Component（如 Navbar、Hero Section）的 HTML 結構，確保最終輸出的 Next.js 程式碼與設計稿達到 **100% 零誤差轉換**。

> **開發者反思：** 當 AI 已經能包辦 UI 介面設計與繁瑣的切版工作時，未來的軟體工程師應將重心轉移至「架構設計」、「需求分析」與「商業邏輯整合」，這才是人類開發者無可取代的價值。

---

## 常見問答 (FAQ)

### Q：Google Stitch 的使用額度限制是什麼？
A：目前系統每日提供 400 個額度 (Credits)。根據實測，透過 AI 完整生成一個包含豐富區塊（Hero、作品集、評價等）的高質感首頁，大約就會消耗掉 4 個額度。

### Q：Stitch MCP 支援哪些 AI 開發工具？
A：只要是支援 MCP (Model Context Protocol) 協定的開發工具皆可使用，主流工具包含 Cursor、Gemini CLI、Claude Code 以及 Antigravity 等。

### Q：AI 生成的網頁設計如果不滿意可以修改嗎？
A：可以的。您可以透過對話框下達新的提示詞 (Prompt)，例如「請將按鈕顏色改為深色」或「調整作品集區塊的排版」，AI 會自動調用相關程式碼進行局部更新。

---

## 相關連結

- [Stitch 官網](https://stitch.withgoogle.com/)
- [Stitch MCP 官方安裝文件](https://stitch.withgoogle.com/docs/mcp/setup)
- [stitch-skills GitHub 倉庫](https://github.com/google-labs-code/stitch-skills)
