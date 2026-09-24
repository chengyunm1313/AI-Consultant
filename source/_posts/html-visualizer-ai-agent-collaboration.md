---
title: "【AI Agent 也需要漂亮的協作介面：我開始把「看懂」當成 Vibe Coding 的一部分】"
cover: /images/cover187.png
toc: true
categories:
  - AI自動化
tags:
  - AI Agent
  - Vibe Coding
  - AI工具
date: 2026-09-25 04:20:23
subtitle: 讓 Agent 把長篇分析轉成可以檢視、回應與拍板的頁面
description: AI Agent 能完成更多 Coding 任務，卻也帶來更長的分析與決策內容。本文介紹 html-visualizer 如何把架構、流程、方案比較與原型整理成互動式 HTML，讓人更容易看懂、留下意見，並在正式 Coding 前完成 Review。
---

最近讀到 Jackle 的[〈好設計，反饋優質上下文〉](https://jackle.pro/articles/design-ai-quality-feedback)，他分享一個我覺得很值得注意的 Skill：[html-visualizer](https://github.com/chenjackle45/html-visualizer)。

一開始我以為，它只是把 AI 的文字回答排版成漂亮的 HTML。研究後我反而覺得，它碰到的是一個更重要的問題：

**AI Agent 越來越會做事，但我們跟 AI 協作的介面，還停留在聊天室和終端機。**

這可能會成為下一階段 Vibe Coding 很重要的一塊。

## AI Agent 越會做事，協作介面也得跟上

我現在越來越常用 Codex、Claude Code 這類 AI Agent 寫程式。以前比較像是我問一句、AI 回一句，再由我下一個指令；現在一個任務可能先拆需求、開 GitHub Issue、分析架構、查程式碼、提出方案、跑測試，再交給另一個模型 Review。

Agent 一次可能回傳幾千字。它寫得完整，不代表我真的有看完。

尤其做到半夜，Agent 列出 A、B、C 三種做法，後面還有架構差異、資料流、相容性、Migration、Trade-off 和 Edge Cases，最後問我：「請選擇你希望採用的方案。」

人最容易回什麼？

> 「照你的建議。」
> 「OK。」
> 「繼續。」

看起來 Human in the Loop 還在，但有時候那個 Human 只是累到不想再讀。這不一定是人不負責任，而是確認事情本身太費力。

## html-visualizer 把長篇回答變成可互動的頁面

`html-visualizer` 的想法不只是「幫我排版漂亮一點」，而是讓 Agent 依內容選擇更適合閱讀與回應的 HTML 呈現方式。需要看關係時可以畫流程或架構，需要做選擇時可以把方案並排，需要討論 UI 時則可以直接把幾種畫面做出來比較。

Jackle 的示範裡，像是比較手機和桌面版的「縮小」按鈕：把不同做法放在畫面上之後，使用者能直接看出哪個位置不明顯，或哪種安排可能讓人誤按。這類想法光看文字不一定會出現；看到原型，意見才會具體。

頁面也可以承接回饋。你能選方案、填補充意見，或反白某段文字留下評論；接著按一下複製彙整結果，再貼回 Agent。這一步目前仍是複製貼上，不是頁面自動把決策送進 Agent，但它已經替人省下重新整理答案與描述上下文的力氣。[作者的介紹文章](https://jackle.pro/articles/design-ai-quality-feedback)有完整示範。

流程因此可以從：

需求 → AI 分析 → **視覺化協作頁面** → 人類 Review → 結構化 Feedback → AI 開始實作。

這不只是「看」的介面，也是一種讓回饋更容易回到工作流程裡的方法。

## 三種時候，先請 Agent「畫給我看」

### 看架構或流程時

如果 Agent 開始用大量文字說明系統架構、模組關係、資料流或 User Flow，可以請它把現況、修改後的樣子和受影響範圍放在一頁。圖上呈現全貌，細節再透過說明或互動補充，比一邊讀一邊在腦中拼圖容易。

### 要比較方案或 UI 時

A、B、C 不要只停留在文字描述。把方案優缺點並排，或直接做出畫面給我看。我看到實際配置後，可能會發現某顆按鈕容易誤按、某段流程讓人困惑，這些 Feedback 往往不是讀文字時就想得到的。

### 意見需要回到 Agent 時

選項、補充欄位和段落評論能保留決策的上下文。複製出彙整結果貼回對話後，Agent 比較容易知道我選了哪個方案、補了什麼條件，以及評論指向哪一段內容。

## 正式 Coding 前，先加一關 Visualization Review

我最近很喜歡把大型 Coding 任務拆成 GitHub Issues，也會讓不同模型互相 Review：

需求 → 拆 Issue → Sub Issues → 模型 A Review → 模型 B 反駁 → 修正 Spec → 再交給 Coding Agent。

現在中間可以再加一關：**Visualization Review**。在正式開工前，請 Agent 讀目前 Repo、整理問題，先產出一份可供人檢視的 Review Page，內容可以包含：

- 現況架構與修改後架構
- User Flow、Data Flow 和 Database 影響
- 功能範圍與可行方案比較
- Edge Cases
- 需要我決定的問題與 Agent 的建議

例如可以這樣交代：

> 先不要修改程式碼。讀完目前 Repo 後，使用 html-visualizer 建立 Review Page，整理現況架構、修改後架構、User Flow、Data Flow、Database 影響、三種可行方案、Edge Cases、需要我決定的問題和你的建議。等我 Review 完再開始實作。

這一步不能保證每個決策都正確，但它讓我有機會在程式改動前看清楚方向。大型任務最怕的情況之一，是第一個方向就偏了，Agent 還很認真地往下做了好幾個小時。

## 新手可以怎麼開始？

不用一開始就研究 Skill 的每個功能。可以先把 [html-visualizer 的 GitHub Repo](https://github.com/chenjackle45/html-visualizer)交給支援 Skill 的 Coding Agent，請它先讀 README 和安裝說明，再說明會安裝到哪裡、是否需要執行腳本，確認清楚後再依專案說明安裝。這樣也能避免還沒弄懂來源與安裝範圍，就直接執行不熟悉的指令。

裝好之後，照平常說話就行，例如：

> 不要用一大堆文字解釋，使用 html-visualizer 把目前系統架構做成網頁給我看。

> 我看不懂你剛剛提出的三個方案，使用 html-visualizer 做成比較頁面。

> 先不要 Coding，讀完目前 Repo 後，做一份包含流程、資料庫影響、方案、Edge Cases 和待決問題的 Review Page，等我看完再開始實作。

新手可以先從三種情境練習：

1. **看不懂時：** Agent 開始講一堆架構、流程或資料庫，就請它畫出來。
2. **要做選擇時：** 不只比較文字，請它把方案或畫面並排給我看。
3. **正式 Coding 前：** 大型功能先做 Review Page，確認方向後再開工。

## 好的 AI 工作流，也要讓人更容易思考

我覺得 `html-visualizer` 最有意思的地方甚至不只是 HTML，而是背後的觀念：

**好的 AI 工作流，不只是讓 AI 更容易做事，也要讓人更容易看懂、判斷和回應。**

以前談 Human in the Loop，我們常想到「重要決策要讓人確認」。現在我還會多問一句：**確認這件事，有沒有被設計得夠簡單？**

如果要讀五千字才知道該確認什麼，那個 Human in the Loop 很可能變成 Human Skip the Loop。😂

AI Agent 接下來一定會越來越自主，所以我也開始在意它要怎麼把事情呈現給我看。我的 Vibe Coding 工作流可能會慢慢變成：

Planning Skill → Research Skill → Visualization Review → Human Review → Coding Agent → Testing → Code Review。

AI 負責大量執行；人類保留看懂、判斷與拍板的位置。**不要只讓 AI 變得更聰明，也要讓我們更容易跟聰明的 AI 一起工作。**

## 常見問答 (FAQ)

### Q1：html-visualizer 是什麼？

`html-visualizer` 是一組供支援 Skill 的 AI 工具使用的工作指引，目標是把長篇回答依內容整理成較容易閱讀的 HTML，例如流程圖、方案比較、原型或互動式決策頁面。

### Q2：互動頁面裡選完方案，Agent 會自動收到嗎？

依作者示範的流程，使用者在頁面選擇、補充或評論後，先複製彙整結果，再貼回 Agent 對話；目前不要把它理解成自動把決策傳回 Agent 的整合。

### Q3：什麼時候適合在 Coding 前做 Visualization Review？

當任務涉及多個模組、資料流、資料庫變更、不同方案或不容易用文字描述的 UI 時，可以先請 Agent 做 Review Page，讓人確認問題範圍與方向，再開始實作。

### Q4：裝了 html-visualizer 後，每次回答都會變成網頁嗎？

不一定。呈現方式會依工具規則和任務內容而定；如果希望某次回答直接做成網頁，可以明確要求 Agent 使用 html-visualizer，或直接說「做成網頁給我看」。實際行為仍以目前 Repo 的說明為準。

## 延伸閱讀

- [好設計，反饋優質上下文｜Jackle Chen](https://jackle.pro/articles/design-ai-quality-feedback)
- [html-visualizer｜GitHub](https://github.com/chenjackle45/html-visualizer)
- [AI Agent 也能直接操作網站：Agent-native Website](https://blog.es2idea.com/posts/agent-native-website/)
