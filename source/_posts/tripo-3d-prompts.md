---
title: '【342 個免費 3D Prompt，我看到的不是提示詞資料庫，而是 3D Vibe Coding 正在成形】'
cover: /images/cover163.png
toc: true
categories:
  - AI工具
tags:
  - Vibe Coding
  - AI工具
  - AI Agent
date: 2026-09-10 12:10:30
subtitle: 不只收藏 Prompt，更要累積可重複使用的 3D 架構、互動模式與視覺驗收流程。
description: Tripo 3D Prompts 收錄超過 300 個免費案例，涵蓋 Three.js、Blender、WebGPU 與瀏覽器遊戲。從需求拆解、Racing Game Pattern 到 AI 視覺驗收，看懂 3D Vibe Coding 如何從提示詞走向可互動的世界。
---

最近發現一個滿值得收藏的網站：[Tripo 3D Prompts](https://www.tripo3d.ai/3d-prompts)。

它整理了超過 300 個免費的 AI 3D Prompt 與實際案例，內容涵蓋 Three.js、Blender、WebGPU、Browser Game、角色建模、3D 世界與各種互動效果。

> 資料註記：2026 年 9 月 10 日查閱時，官方頁面顯示 342 個案例，數量會持續更新。網站會區分作者公開的原始 Prompt，以及依公開作品整理的任務描述；使用時可以先查看個別案例的來源標示。

如果只是把它當成「Prompt 大全」，其實有點可惜。

因為我看了一輪之後，真正讓我感興趣的不是這 300 多條 Prompt，而是：

**3D Vibe Coding 的方法論，好像已經慢慢成形了。**

## 以前 Vibe Coding 做網站，現在開始「做世界」

這一兩年大家講 Vibe Coding，最常看到的還是：

- 「幫我做一個官網。」
- 「幫我做一個管理後台。」
- 「幫我做一個 SaaS。」
- 「幫我做一個小工具。」

本質上，大部分還是 2D Web UI。

但 Tripo 3D Prompts 裡面，已經開始出現很多完全不同的東西。

例如 Three.js 3D 遊戲、卡丁車競速、飛行模擬器、第三人稱射擊遊戲、3D 解謎、互動式中國庭院、梵谷畫作 3D 世界、WebGPU Soft Body、Blender 建模與動畫……

甚至可以拿一張圖片或一段影片當參考，要求 AI 重建成可以互動的 Three.js 3D 場景。官方就收錄了[依參考影片重建 Three.js 場景的案例](https://www.tripo3d.ai/3d-prompts/gpt-6-astra-2097588270171660321)，呈現這種從視覺參考出發的需求描述。

這件事代表一個很有意思的變化。

以前我們 Vibe Coding 是：

**Prompt → 網頁**

現在開始變成：

**Prompt → 場景 → 物件 → 物理 → 互動 → 世界**

我會把它叫做：**3D Vibe Coding**。

## 這個網站真正值得學的，不是 Copy Prompt

看到 300 多個 Prompt，第一個直覺一定是：「太好了，以後直接複製貼上。」

但我反而覺得，這是最可惜的使用方式。

因為真正值得研究的是：**這些厲害的 3D Prompt，到底是怎麼描述需求的？**

我整理之後發現，好的 3D Vibe Coding Prompt，大致可以拆成類似的結構：

**Reference → World → Assets → Mechanics → Interaction → Camera → UI → Feedback Loop → Acceptance Criteria**

這是我從案例整理出的需求拆解方式，不是網站規定的唯一格式。換成比較好理解的問題，就是：

| 需求層次 | 要描述清楚的事情 |
| --- | --- |
| Reference：參考資料 | 參考哪張圖片、哪段影片或哪個作品？ |
| World：世界 | 場景長什麼樣？空間與路線怎麼安排？ |
| Assets：素材 | 需要哪些角色、車輛、建築與道具？ |
| Mechanics：機制 | 移動、物理、碰撞與遊戲規則如何運作？ |
| Interaction：互動 | 玩家可以做什麼？怎麼控制？ |
| Camera：鏡頭 | 鏡頭要跟隨、環繞，還是自由移動？ |
| UI：介面 | 操作提示、狀態與 HUD 要顯示什麼？ |
| Feedback Loop：回饋迴圈 | 怎麼執行、觀察結果，再修改？ |
| Acceptance Criteria：驗收標準 | 哪些條件成立，才算完成？ |

這跟我們平常說「幫我做一個 3D 賽車遊戲」，差非常多。

例如今天我要做卡丁車。與其只描述「我要一款賽車遊戲」，不如拆成：

- 世界長什麼樣？賽道怎麼設計？
- 車子如何控制？有沒有甩尾？
- 碰撞怎麼處理？鏡頭怎麼跟車？
- 怎麼計算圈數？有沒有 Checkpoint？
- AI 對手怎麼跑？HUD 顯示什麼？
- 什麼情況算完成遊戲？

當這些東西被描述清楚之後，AI 面對的就不再是一句模糊的願望，而是**一份可以執行的規格**。

## 不要 Copy Prompt，要 Copy Architecture

這也是我現在看這類 Prompt Library 最大的心得。

Prompt 本身很快就會過時。

今天 GPT-6 Astra 很強，明天可能又有新的模型。今天某一條 Prompt 很厲害，幾個月後模型能力提升，也許一句話就做得到。模型的表現也會隨版本、方案與任務改變，不需要把當下的選擇當成永久排名。

但是，**Architecture 不容易過時**。

例如你找到一個很棒的 Kart Racing 案例，真正應該留下來的是：

```text
賽道系統
→ 車輛控制
→ Vehicle Physics（車輛物理）
→ Drift（甩尾）
→ Checkpoint（檢查點）
→ Lap System（圈數系統）
→ AI Opponent（AI 對手）
→ Follow Camera（跟隨鏡頭）
→ HUD（遊戲資訊介面）
→ Win Condition（獲勝條件）
```

這整組就是一個 **Racing Game Pattern**。

下一次根本不需要重新想。

你可以把 Roblox 風格換成科幻城市，也可以換成台灣夜市，甚至可以變成「享哥 AI 賽車學院」。

美術全部換掉，但是底層 Pattern 保留下來。

這才是我認為 AI 時代真正值得累積的東西。

## 更大的變化，是 AI 開始自己「看結果」

還有一個地方，我覺得比 3D 本身更值得注意。

以前我們使用 AI Coding 的流程通常是：

**下 Prompt → AI 寫程式碼 → 執行 → 人類看結果 → 告訴 AI 哪裡不對 → AI 修改**

問題是，中間那個「看結果的人」一直都是我們。

但現在開始不一樣。

當工作環境具備執行、截圖與視覺理解能力，新的工作流可以變成：

```text
Prompt
↓
AI 建構
↓
執行
↓
Screenshot
↓
AI 自己看畫面
↓
跟 Reference 比較
↓
找出差異
↓
修改
↓
重新執行
```

這個差異非常大。

因為 AI 不再只是 Coding Agent，它開始變成 **Visual QA Agent**。

以前我們叫 AI：「幫我寫 Three.js。」

未來比較可能變成：「這是我要的參考畫面，你自己做到像為止。」

當然，「畫面像」還不是全部驗收。卡丁車能不能控制、圈數有沒有算對、碰撞是否正常，仍要搭配實際操作與功能測試；截圖主要幫助檢查視覺差異。

這也呼應我之前整理的 [Agent Harness 觀念](/posts/skill-to-agent-harness/)：除了模型會不會寫程式，讓它能執行、觀察、修正的工作環境，同樣關鍵。

## Tripo 在這裡扮演什麼角色？

這也是我一開始容易搞混的地方。

Tripo 3D Prompts 本身比較像 **3D Vibe Coding 靈感與 Pattern Library**。

真正需要 3D 模型時，則可以再透過 [Tripo Studio](https://studio.tripo3d.ai/) 之類的 AI 3D 工具，從文字或圖片產生角色、車輛、建築、道具等 3D Assets。[Tripo 官方功能介紹](https://www.tripo3d.ai/)也將文字與圖片生成 3D 模型列為核心能力。

於是整條 Workflow 就變得很有意思。如果由我來串接，會是：

```text
Tripo Prompts 找案例
→ 找到接近的 Pattern
→ Codex 分析案例
→ 產生 PRD（產品需求文件）
→ 建立 Three.js Prototype
→ AI 產生 3D Assets
→ 匯入場景
→ 執行測試
→ Screenshot
→ AI 視覺檢查
→ 自動修改
```

這已經不是以前那種「AI 幫我產一個 3D 模型」，而是一條逐漸完整的 **AI 3D Production Pipeline**。

這裡描述的是把不同工具接起來的工作流程構想；免費 Prompt Library 與模型生成服務是不同環節，實際生成的可用功能與額度，仍以各工具當下的方案為準。

## 如果是我，我甚至不會只收藏 342 個 Prompt

我反而會再做下一步：把這 300 多個案例重新分類。

例如：

- Three.js Interactive Pattern
- Racing Game Pattern
- Third Person Game Pattern
- 3D World Pattern
- Blender Modeling Pattern
- Physics Simulation Pattern
- WebGPU Interaction Pattern
- Product Visualization Pattern

然後把它們做成自己的 **3D Vibe Coding Skill**。

以後我只需要跟 Codex 說：「幫我做一款 3D 卡丁車遊戲。」

Skill 自己判斷：

**Game → Racing → Third Person → Vehicle Physics**

接著載入對應的 Pattern，然後自己：

**Plan → Build → Run → Screenshot → Compare → Fix**

這是我希望進一步做出的 Skill 設計方向。要讓它實際運作，還需要把分類規則、範例、工具操作與驗收條件整理好。

如果你還不熟悉 Skill、MCP 與 CLI 的分工，可以先看[這篇工具名詞整理](/posts/ai-agent-tools-mcp-skill-cli/)。

到了這時候，「342 個 Prompt」就不再只是收藏在瀏覽器書籤裡面的資料，而是變成 **AI 可以重複使用的能力**。

## 我覺得 3D Vibe Coding 會是下一個很好玩的方向

前幾天我才在想：現在用 Three.js + Vibe Coding，到底能不能做一款類似卡丁車的瀏覽器遊戲？

看完這批案例之後，我的答案已經不是「能不能」，而是：

**我們接下來可以做到多複雜？**

因為當 Coding Agent、Three.js、Blender、AI 3D Model、Browser Automation、Computer Use、Visual QA 這些能力開始接起來之後，門檻正在快速下降。

以前做一個 3D 世界，你可能要會建模、材質、Lighting、動畫、Three.js、物理引擎、Game Logic、UI、程式設計……

現在慢慢變成：

**你負責描述世界，AI 負責把世界建構出來。**

所以 Tripo 3D Prompts 最值得收藏的，可能不是那 342 個 Prompt，而是它讓我們提前看到了一件事情：

Vibe Coding 的下一站，可能不只是做網站。

而是開始做遊戲、做空間、做互動、做模擬，甚至直接做一個可以走進去的世界。

而我們現在，可能才剛走到 **3D Vibe Coding 的第一章**。

## 常見問答 (FAQ)

### Q1：Tripo 3D Prompts 是什麼？可以免費使用嗎？

Tripo 3D Prompts 是免費瀏覽的 AI 3D 提示詞與案例資料庫，涵蓋 Three.js、Blender、瀏覽器遊戲與互動場景。2026 年 9 月 10 日查閱時顯示 342 個案例；部分是作者原始 Prompt，部分是依公開作品整理的任務描述。免費瀏覽案例，不代表搭配使用的模型生成或程式開發工具都沒有費用。

### Q2：3D Vibe Coding 與一般 Vibe Coding 有什麼不同？

本文用 3D Vibe Coding 描述透過 AI 建構 3D 場景與互動體驗的做法。相較於常見的 2D 網頁介面，它還需要把世界、物件、物理、操作、鏡頭與遊戲規則描述清楚，讓需求從一句願望變成可以執行及驗收的規格。

### Q3：為什麼要 Copy Architecture，而不只複製 Prompt？

Prompt 的效果容易隨模型與任務改變，但架構與互動模式可以重複使用。例如賽車遊戲的車輛控制、甩尾、檢查點、圈數、對手、跟隨鏡頭與獲勝條件，都可以整理成 Racing Game Pattern，再換成不同場景與美術風格。

### Q4：AI 可以只靠 Screenshot 完成 3D 遊戲驗收嗎？

不行。Screenshot 適合協助比較構圖、材質、光線與介面等視覺差異；車輛操作、碰撞、圈數與獲勝條件，仍需要實際操作與功能測試。完整回饋迴圈應包含建構、執行、截圖、比較、修改，以及相關功能的再次驗證。

### Q5：如何把 Tripo 案例整理成自己的 3D Vibe Coding Skill？

可以先按賽車、第三人稱遊戲、3D 世界、Blender 建模、物理模擬或產品展示分類，再把各類案例的需求結構、操作方式、參考素材與驗收條件整理成 Pattern。最後將選擇 Pattern 的規則與 Plan、Build、Run、Screenshot、Compare、Fix 流程寫入 Skill，並接上實際可用的工具。
