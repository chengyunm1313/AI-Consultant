---
title: 'GSAP AI Skills 教學：我把官方 Skills 裝進 Codex，讓 Vibe Coding 網站動起來'
cover: /images/cover200.png
toc: true
categories:
  - 軟體開發
tags:
  - Vibe Coding
  - GSAP
  - AI Agent
date: 2026-10-02 15:03:03
subtitle: 先規劃、再實作、最後 Review，讓 AI 做出有節奏又顧及手機體驗的網站動畫。
description: 用 GSAP 官方 AI Skills 協助 Codex 規劃 Vibe Coding 網站動畫，從 Timeline 與 ScrollTrigger 實作到手機版、效能和 prefers-reduced-motion 檢查，讓網站動得更有節奏。
---

最近看到 GSAP 官方推出一組 AI Agent Skills，我第一個反應不是「又多一個 AI 工具」，而是：這很適合放進 Vibe Coding 工作流。

現在用 Codex、Claude Code 或 Cursor 做網站，AI 通常很快就能生出 Landing Page。但開始要求它加上文字進場、卡片依序出現或 Scroll 動畫時，會動不代表動得好：動畫可能搶走閱讀焦點、手機版跑出畫面，或因為缺少清理而影響效能。

我想研究 GSAP，正是因為網站互動不只要「有動」，還要知道什麼時候動、怎麼安排節奏，以及怎麼照顧不同裝置的使用者。

## GSAP 是控制網頁即時動畫的 JavaScript 函式庫

如果你不是專門做前端動畫的，可以先把 GSAP 想成一套用來安排網頁元素動作的工具。它控制的是使用者瀏覽網站時，瀏覽器即時呈現的動畫；它不是 AI 影片生成器，也不負責把動畫輸出成 MP4。

像是標題逐行出現、圖片滑進畫面、卡片依序浮現、數字往上遞增、SVG 路徑動畫、按鈕微互動，或畫面隨著使用者捲動而演出，都是 GSAP 常見的使用情境。

如果你正在做 Landing Page、產品官網、活動網站、作品集或一頁式銷售頁，GSAP 可以幫你更精準地控制動畫的順序、時間與互動方式。它的 [官方文件](https://gsap.com/docs/v3/) 也整理了 Core、Timeline、ScrollTrigger 與各類 Plugins 的使用方式。

## GSAP 官方 AI Skills 把動畫實務帶進 Coding Agent

以前請 AI 用 GSAP 做動畫，通常得自己描述需求，再期待模型能正確找出文件、安排程式結構並處理框架細節。現在 GSAP 官方把常見用法整理成 [AI Agent Skills](https://github.com/greensock/gsap-skills)，可透過 `npx skills add https://github.com/greensock/gsap-skills` 安裝到 Codex 等支援的 Agent。

官方 repository 將 Skills 分成幾個方向：

- **GSAP Core**：`gsap.to()`、`from()`、緩動、stagger 等核心 API。
- **Timeline**：管理多段動畫的先後、標籤與時間軸。
- **ScrollTrigger**：處理捲動觸發、pin、scrub、refresh 與清理。
- **Plugins**：說明各種 GSAP 外掛的使用方式。
- **React**：涵蓋 `useGSAP()`、scope、cleanup 與 SSR 注意事項。
- **Frameworks**：介紹 Vue、Svelte 等框架的生命週期與清理。
- **Performance**：優先使用 transform，減少不必要的版面計算。
- **Utils**：提供 clamp、mapRange、interpolate 等工具函式。

這件事值得注意的地方，不只是多了一套動畫函式庫，而是可以把官方累積的使用方式與常見注意事項，交給 AI Agent 在工作時參照。Skill 提供的是工作指引，不代表生成結果自然就正確；仍要看實際畫面、程式碼與裝置表現。

## 第一步：先請 AI 規劃，不要一開始就叫它加特效

我會先把 AI 當成「動態設計顧問」，請它分析目前網站哪裡值得動。這一步能避免 Hero、卡片、按鈕和背景全部同時飛進來，讓動畫反而打斷閱讀。

可以先這樣下指令：

```text
分析目前網站，找出 3 個最適合加入 GSAP 動畫的位置。
不要為了動畫而動畫，先不要修改程式碼。

優先評估：
1. Hero 首屏進場
2. 使用者 Scroll 時的內容節奏
3. CTA 與卡片微互動

請說明每個建議想改善的體驗、觸發時機、動畫順序與可能風險。
同時考慮手機版、避免 layout shift、動畫效能與 prefers-reduced-motion。
```

## 第二步：依照規劃實作並照顧不同裝置

確認動畫規劃後，再請 Agent 按範圍實作。多段動作用 Timeline 管理，Scroll 動畫交給 ScrollTrigger，並要求它把清理與無障礙需求一起納入：

```text
按照剛才確認的動畫規劃開始實作，參照 GSAP 官方 Skills 的建議。

- 多段動畫使用 Timeline 管理，不要用大量 delay 硬接。
- Scroll 動畫使用 ScrollTrigger，版面改變後確認是否需要 refresh。
- 優先使用 transform 與 opacity，避免不必要的 layout reflow。
- 確認手機版不會爆版或遮住重要內容。
- 支援 prefers-reduced-motion，讓偏好減少動態效果的使用者能正常閱讀。
- 若使用 React，處理好動畫 scope 與 component cleanup。

完成後檢查 console error、ScrollTrigger refresh、動畫清理和效能問題。
```

[`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) 是需要明確考慮的使用者偏好。可以請 AI 為減少動態效果的情境提供較安靜的呈現方式，也可以直接讓內容以靜態狀態呈現；重點是不能讓動畫成為閱讀內容的門檻。

## 第三步：請 AI 用 Performance Skill 再 Review 一輪

程式寫完還不算結束。AI 很容易把「做動畫」解讀成讓更多東西動起來，所以我會再開一輪 Review，要求它只找問題，不增加特效：

```text
現在不要增加任何新動畫。
請參照 GSAP Performance Skill 與相關官方建議，Review 目前所有動畫。

檢查：
- 手機效能與不必要的 layout reflow
- ScrollTrigger 的使用與 refresh
- Timeline 管理方式
- 事件監聽器與 React cleanup
- prefers-reduced-motion 的處理
- 動畫是否干擾 CTA、內容閱讀或操作

只修正發現的問題，不增加新特效；完成後列出修改處與仍需人工確認的項目。
```

好的網站動畫不是動得越多越好，而是出現得恰到好處。多一輪 Review，可以讓動畫重新回到它該服務的目標：引導視線、補足回饋，或讓內容更容易理解。

## Vibe Coding 下一步，是讓 AI 做出更好的互動體驗

Vibe Coding 一開始常從「AI 幫我把網站做出來」開始，接著是「AI 幫我把 UI 做漂亮」，現在也可以往前一步，請 AI 一起規劃和實作互動體驗。

我會把三者想成這樣：LLM 負責理解需求與撰寫程式；GSAP 提供動畫工具；Skill 則把專業做法、Coding Standard 和檢查步驟整理成 Agent 能參考的工作方式。把能力裝進工作流後，AI 不只知道「可以怎麼寫」，也多了一套更有方向的實作參考。

如果你已經在用 Codex、Claude Code 或 Cursor 做網站，可以從一個做好的頁面開始，依序跑過「動畫規劃 → Hero 或卡片實作 → ScrollTrigger → 手機與效能檢查 → AI Review」。先從一兩個真正能改善體驗的位置開始，通常就能看出差異。

若你也在整理 Agent 的工作方式，可以延伸閱讀[從 Skill 到 Agent Harness](/posts/skill-to-agent-harness/)與[Codex Skill 與 Plugin 的差異](/posts/codex-skills-vs-plugins/)。

### 延伸閱讀

- [GSAP 官方 AI Skills](https://github.com/greensock/gsap-skills)
- [GSAP 官方 GitHub](https://github.com/greensock/GSAP)
- [GSAP 官方文件](https://gsap.com/docs/v3/)

## 常見問答 (FAQ)

### Q1：使用 GSAP AI Skills 前，需要先學會 GSAP 嗎？

不必先把 GSAP 全部學完才開始。你可以先讓 Agent 根據網站提出動畫規劃，再從它產生的 Timeline、ScrollTrigger 或 React 實作反向學習。不過仍建議閱讀重要程式碼、確認執行結果，逐步建立判斷能力。

### Q2：GSAP AI Skills 會自動替網站加入動畫嗎？

Skill 是提供給 AI Agent 參照的說明與實務指引，本身不會替網站修改程式碼。你仍要提出需求並確認修改範圍；安裝後的生成結果也要經過程式碼與畫面檢查。

### Q3：怎麼避免 Scroll 動畫在手機上卡頓或影響閱讀？

先減少動畫數量，優先選擇能改善資訊節奏的區塊，並檢查手機上的捲動、效能與內容可讀性。也要考慮 `prefers-reduced-motion`，並在框架元件卸載時清理動畫與事件監聽器。

---
