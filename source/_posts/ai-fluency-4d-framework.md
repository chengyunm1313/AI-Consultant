---
title: 4D Framework：比 Prompt Engineering 更完整的 AI Fluency 框架
cover: /images/cover142.png
toc: true
categories:
  - 生成式AI應用
tags:
  - AI工具
  - AI自動化
  - AI Agent
date: 2026-08-23 23:21:55
subtitle: 從委派、描述、判斷到盡責，建立跨模型、跨工具的人機協作能力。
description: 只會寫 Prompt，不代表真的懂 AI。本文用白話拆解 Dakan／Feller 發展、Anthropic 課程化的 4D Framework，理解如何分工、描述、判斷與負責，建立跨模型、跨工具的 AI Fluency。
---

很多人談 AI 素養時，第一個想到的仍然是：「Prompt 要怎麼寫才夠好？」

但 **4D Framework** 提供了一個更完整的視角：AI 能不能真正幫上忙，不只取決於你會不會下指令，也取決於你是否知道哪些工作適合交給 AI、能不能清楚描述需求、能不能判斷產出品質，以及最後是否願意對採用的結果負責。

先用一句話記住它：

> **會分工、會交代、會驗收、會負責，才是真正的 AI Fluency。**

這裡的 4D 分別是：

| 能力 | 英文 | 核心問題 |
| --- | --- | --- |
| 委派 | Delegation | 這件事該由誰做？ |
| 描述 | Description | 我要怎麼讓 AI 理解我的意圖？ |
| 判斷 | Discernment | AI 做得對不對、好不好？ |
| 盡責 | Diligence | 我能不能安全採用、發布並負責？ |

需要先釐清的是，4D Framework 並不是 Anthropic 從零發明的 Prompt 框架。依本文整理的來源，Rick Dakan 與 Joseph Feller 在 2023–2024 年發展出 AI Fluency Framework，之後 Anthropic 與兩位教授合作，把這套框架發展成 AI Fluency 課程。因此，更精確的說法是：**Dakan／Feller 發展框架，Anthropic 合作將它課程化。**

## AI Fluency 是什麼？

AI Fluency 可以簡單理解成：你能不能有效、有效率、合乎倫理，而且安全地與 AI 一起工作。

所以以下幾件事不一定代表你具備 AI 素養：

- 會使用 ChatGPT。
- 會寫一段看起來很完整的 Prompt。
- 會使用 Claude Code 或其他 AI Coding Agent。

真正的 AI Fluency 是你知道：

1. 什麼問題值得交給 AI？
2. 哪一個工具適合這個任務？
3. 人與 AI 應該如何分工？
4. 如何定義成果標準並驗收？
5. 什麼資料不能直接提供給 AI？
6. 什麼情況需要揭露 AI 的角色？

這也是 4D Framework 比單純 Prompt 教學更有價值的地方：它訓練的是人的工作能力，而不是某個模型的操作技巧。

## ① Delegation：先決定這件事該不該交給 AI

一般人打開 ChatGPT，第一句可能是：「幫我做一份課程。」

但在真正開始寫 Prompt 之前，應該先問：**這件事情有哪些部分適合交給 AI？哪些部分必須由人做決定？**

### Problem Awareness：先搞懂自己要解決什麼問題

很多人以為 AI 用不好，是因為 Prompt 寫得不夠漂亮；實際上，更常見的原因是使用者自己還沒有定義清楚問題。

比較模糊的需求是：

> 幫我做一個網站。

比較可執行的需求則是：

> 我要讓第一次進站的公司採購，在 30 秒內了解我們提供什麼水果禮盒，最後加入 LINE 詢價。

後者還沒有進入 Prompt 設計，就已經先完成了重要的問題定義：對象、情境、目標與預期行動都比較清楚。

### Platform Awareness：知道哪個工具適合哪種任務

AI Fluency 也包括理解工具的能力邊界。例如：

- 查最新新聞，需要能夠搜尋網路的工具。
- 分析大量自己的文件，可以考慮 NotebookLM 或 Claude Projects 類型的工作區。
- 寫程式，可以使用 Codex、Claude Code 或其他 Coding Agent。
- 生成圖片，應選擇適合圖像生成的模型。
- 精確計算，不能只把語言模型當成計算機使用。

重點不是「我最喜歡哪一個 AI」，而是「這個任務需要什麼能力，而哪個工具真的具備這項能力」。

### Task Delegation：把人與 AI 的工作切開

以設計一門課程為例，合理的分工可能是：

| 工作 | 人 | AI |
| --- | --- | --- |
| 決定課程目標 | 主導 | 提供分析與建議 |
| 蒐集大量案例 | 審核方向 | 協助整理 |
| 規劃課程大綱 | 共同設計 | 共同設計 |
| 產生內容初稿 | 設定標準 | 執行產出 |
| 判斷案例是否適合學員 | 最終判斷 | 協助比較 |
| 最終教學內容 | 驗證、編輯與負責 | 不直接取代 |

Delegation 的核心不是把工作全部丟給 AI，而是先做出有意識的分工決策。

## ② Description：把意圖說清楚，不只是寫 Prompt

Description 是大家最熟悉的部分，因為它確實包含 Prompt；但 4D Framework 沒有把 Prompt Engineering 神化，而是把 Description 看成一種「把意圖清楚傳達給合作對象」的能力。

這跟以下工作其實很像：

- 寫 Brief。
- 下需求。
- 跟設計師溝通。
- 跟員工交辦工作。
- 撰寫規格書。

一個好的 Description 通常可以拆成三層。

### Product Description：你要什麼成果？

這一層是在定義產出物本身，包括 Output、Format、Audience 與 Style。

例如：

> 請製作一份 20 頁的 AI 入門簡報，對象是完全沒有 AI 經驗的中小企業老闆，使用台灣繁體中文，每頁只呈現一個核心重點，並在每個單元加入一個生活化案例。

這比「幫我做一份 AI 簡報」更容易驗收，因為成果形式、讀者、語言與內容密度都已經先定義。

### Process Description：你希望 AI 怎麼完成？

這一層描述處理流程，而不是只描述最後長什麼樣子。

例如：

> 先分析學員的常見痛點，再決定課程順序；接著為每個單元設計案例，最後才產出簡報大綱。每一步完成後，先列出判斷依據，再進入下一步。

如果只說「我要一份好簡報」，AI 可能直接跳到產出；加入 Process Description 後，才有機會看見它如何拆解問題。

### Performance Description：AI 應該怎麼跟你合作？

這一層規定的是 AI 的互動方式與工作行為，例如：

- 不要一味認同我的想法。
- 發現邏輯問題時要直接指出。
- 不確定時要明確說明不確定，不要自行補完。
- 回答保持簡潔，先處理最關鍵的問題。
- 如果缺少必要資訊，先提出澄清問題再開始。

因此，一個完整的 Description 不只是「角色＋背景＋任務＋格式＋限制」的固定模板，而是同時交代：**要做什麼、怎麼做，以及要用什麼方式與我合作。**

## ③ Discernment：判斷 AI 的成品、過程與互動

AI 最危險的地方，往往不是完全不會回答，而是能把錯誤內容講得非常像真的。

所以 Discernment 的核心問題不是：「AI 有沒有回答？」而是：

> **這個答案到底能不能用？**

### Product Discernment：成品符合需求嗎？

檢查最後拿到的成果：

- 內容正確嗎？
- 是否完整回答了問題？
- 有沒有捏造資料或引用？
- 格式與語氣符合對象嗎？
- 是否真的解決了原本的問題？

### Process Discernment：AI 的做法可靠嗎？

成果看起來漂亮，不代表產出的過程可靠。以市場研究為例，仍然要檢查：

- 樣本是否選錯？
- 是否把相關性誤當成因果關係？
- 引用資料是否過期？
- 是否漏掉重要競爭者？
- 推論是否跳得太快？

如果研究方法不可靠，最後的報告即使排版精美，也不應該直接拿去做決策。

### Performance Discernment：互動方式適合這個任務嗎？

假設你希望 AI 扮演一位批判型顧問，但它每次都只回答：「這個想法很棒！」即使內容沒有明顯錯誤，它的互動表現仍然不符合需求。

因此，驗收時也要問：AI 是否按照你要求的方式合作？它有沒有指出風險、提出反例，或在不確定時停下來？

### Description 與 Discernment 是一個循環

真正有效的人機協作，不是：

> Prompt → AI → 複製 → 貼出去

而是：

> **Description → AI 產出 → Discernment → 修改 Description → AI 產出 → 再次 Discernment**

例如第一輪請 AI「設計一門 AI 課程」，看完後發現內容太技術；第二輪補充「學員沒有程式背景，刪除不必要的技術內容」，結果又變得太淺；第三輪再要求「保留實作，但所有概念都用生活案例解釋」。

這就是 **Description–Discernment Loop**：Prompt 不是一次性的神奇指令，而是人與 AI 對話中的控制迴路。

## ④ Diligence：使用 AI，最後仍然由人負責

Diligence 可以翻成「盡責」。它的重點不是要求 AI 自己負責，而是提醒使用者：**你選擇採用 AI，就要對最後採用的成果負責。**

如果你請 AI 寫客戶提案，AI 把數字寫錯，而你沒有檢查就寄給客戶，不能把責任推回「是 Claude 寫的」。

### Creation Diligence：選對工具並安全使用

在建立內容或執行任務前，先確認：

- 公司機密是否適合貼進免費 AI？
- 客戶個資是否可以直接上傳？
- 這個模型是否適合處理目前的任務？
- 是否需要限制工具權限、資料範圍或可執行的動作？

這些都不是「寫得更長的 Prompt」可以取代的判斷。

### Transparency Diligence：適時揭露 AI 的角色

不同情境對 AI 揭露的要求不一樣。研究論文、學生作業、客戶報告與媒體內容，都可能需要不同程度的說明。

Anthropic 的 AI Fluency 課程本身就是一個具體示範：官方課程頁揭露 Claude 協助了課程架構、練習設計、草稿、評論、編輯與改寫，但最終內容仍由人類作者驗證、編輯並負責。

這提醒我們，透明不是把所有工作都推給 AI，而是讓讀者知道 AI 在流程中扮演什麼角色，以及人類做了哪些驗證。

### Deployment Diligence：在發布前問自己能不能背書

在按下以下按鈕之前：

- 發布
- 寄出
- 部署
- 交件

最後問自己：

> 如果明天有人問我「這個資料是真的嗎？」，我能不能負責？

如果唯一的回答是「AI 告訴我的」，那代表 Diligence 還沒有完成。

## 4D 不是瀑布流程，而是兩個互相連動的 Loop

4D 很容易被誤解成「委派 → 描述 → 判斷 → 盡責」的單向清單，但實際上它不是嚴格的瀑布流程。

最明顯的循環是：

- **Description ↔ Discernment Loop**：根據驗收結果，不斷修正需求描述與合作方式。
- **Delegation ↔ Diligence Loop**：根據風險、權限與任務結果，重新調整哪些工作交給 AI，以及哪些工作必須保留人工核准。

而且 Diligence 也不是最後才做。從選工具、提供資料、查看中間結果，到最後發布，責任與風險意識都應該一路存在。

## 4D 與三種人機合作模式

完整的 AI Fluency Framework 不只有 4D，還包含三種人機合作模式：Automation、Augmentation 與 Agency。

### Automation：AI 幫我做

人先定義規則，AI 執行明確任務。例如：

> 幫我把這 100 筆資料依照指定欄位分類。

這類任務的重點是規則清楚、輸出容易檢查，並且要確認資料權限與錯誤處理方式。

### Augmentation：AI 跟我一起做

人與 AI 互相提供輸入，再由人持續做判斷。例如：

> 跟我一起想這堂課怎麼設計，先提出三種課程方向，再指出每種方向可能的風險。

目前許多 ChatGPT、Claude 的日常使用都屬於這種協作方式。AI 提供草稿、選項與反饋，人則負責選擇、修正與決定。

### Agency：AI 代表我持續做

這種模式更接近 Agent、Skills、Workflow 與 MCP：

> 每天讀信、分類、查 CRM、草擬回覆，符合條件時建立任務，遇到高風險情況就通知我核准。

當 AI 的自主程度提高，4D 反而更重要。因為 Agent 如果每天自動執行大量錯誤操作，問題就不再只是一次 Prompt 寫錯，而可能擴大成資料、權限、成本與客戶影響的治理問題。

## 為什麼 4D 比單純 Prompt Engineering 更適合教 AI 素養？

工具會一直改變。今天可能是 ChatGPT、Claude、Gemini，明天可能是 Agent、Skills、MCP 或 Computer Use。

但以下四種能力不會因為工具更換就失效：

| 能力 | 你真正要學會的事 |
| --- | --- |
| Delegation | 盤點問題，決定誰做、誰核准 |
| Description | 把成果、流程與合作方式說清楚 |
| Discernment | 驗收成品，也檢查方法與互動 |
| Diligence | 管理資料、風險、透明度與責任 |

Prompt 是 Description 的一部分，但不是全部。只把 Prompt 寫得更長，並不會自動解決工具選擇錯誤、成果驗收不足、敏感資料外洩或責任歸屬不清等問題。

## 每天使用 AI 前，可以先問自己的 6 個問題

如果你想把 4D Framework 變成日常工作習慣，可以在開始任務前後快速檢查：

1. **問題是什麼？** 我是否能用一句話說明要解決的問題與成功標準？
2. **工具適合嗎？** 這個任務需要搜尋、文件分析、程式執行、圖片生成或精確計算嗎？
3. **怎麼分工？** 哪些步驟由 AI 做，哪些決策保留給人？
4. **怎麼描述？** 我是否說清楚成果、處理流程與合作方式？
5. **怎麼驗收？** 我會檢查成品、方法與 AI 的互動表現嗎？
6. **敢不敢負責？** 資料、權限、揭露與最後發布是否都在可接受的風險範圍內？

這 6 個問題，比背一套固定 Prompt 模板更能幫你把 AI 用在正確的地方。

## 結語：真正的 AI Fluency，主要是在訓練人

4D Framework 最值得學的地方，是它把「AI 工具教學」往上一層提升成「AI 工作能力」。

AI 素養不是「會不會下 Prompt」，而是你有沒有能力決定：

- **誰來做？** Delegation
- **怎麼做？** Description
- **做得好不好？** Discernment
- **敢不敢負責？** Diligence

如果要把它濃縮成一句話，就是：

> **真正的 AI Fluency，不是訓練 AI 取代人的判斷，而是訓練人更有意識地分工、溝通、驗收與負責。**

如果你想延伸閱讀，可以先看本站的〈[Claude Academy 學習路徑完整指南：22 門免費課程與 289 項資源怎麼選？](/posts/claude-academy-learning-paths/)〉，再搭配〈[從提示詞到 Skill：5 個實務做法打造高效率 AI 自動化工作流](/posts/ai-prompt-to-skill-workflow/)〉理解如何把協作方法封裝成可重複使用的工作模組；若想進一步理解自主型 AI，則可參考〈[AI Chatbot 跟 AI Agent 到底差在哪？一篇文講到你懂，還教你怎麼用！](/posts/ai-chatbot-vs-agent-difference-and-how-to-use/)〉。

## 常見問答 (FAQ)

### Q1：4D Framework 跟 Prompt Engineering 一樣嗎？

不一樣。Prompt Engineering 主要處理如何描述任務，是 4D Framework 中的 Description；4D 還包括任務委派、成果判斷，以及資料安全、透明揭露與最終責任。

### Q2：4D Framework 是誰提出的？

依本文整理的正式來源，Rick Dakan 與 Joseph Feller 發展了 AI Fluency Framework，後來 Anthropic 與兩位教授合作，將框架發展成 AI Fluency 課程。因此不宜簡化成「Anthropic 發明 4D」。

### Q3：Automation、Augmentation 與 Agency 有什麼差別？

Automation 是 AI 依規則替人執行，Augmentation 是人與 AI 一起完成任務，Agency 則是 AI 代表人持續執行工作流程。AI 越自主，越需要明確的權限、驗收與人工核准邊界。

### Q4：為什麼使用 AI 後，最後仍然是人負責？

因為人決定了任務是否交給 AI、提供了哪些資料，也決定是否採用與發布結果。AI 可以協助產出，但不能替人承擔資料錯誤、個資外洩、著作權、客戶影響或決策失誤的責任。

### Q5：剛開始學 4D Framework，最簡單的做法是什麼？

先在每次使用 AI 前問六件事：問題是什麼、工具適合嗎、如何分工、如何描述、如何驗收，以及最後敢不敢負責。這能把 4D 從抽象框架轉成日常工作檢查表。

## 參考來源

- [AI Fluency Framework 官方網站](https://aifluencyframework.org/?utm_source=chatgpt.com)
- [Anthropic：AI Fluency Framework & Foundations](https://www.anthropic.com/ai-fluency/overview?utm_source=chatgpt.com)
- [Claude Academy：AI Fluency for Small Businesses](https://academy.claude.com/courses/ai-fluency-for-small-businesses?utm_source=chatgpt.com)
- [Anthropic Skilljar：AI Fluency Framework & Foundations](https://anthropic.skilljar.com/ai-fluency-framework-foundations?wtime=3280s&utm_source=chatgpt.com)
- [HEA：Dakan & Feller AI Fluency Framework 正式文件](https://eprints.teachingandlearning.ie/id/eprint/6805/?utm_source=chatgpt.com)
