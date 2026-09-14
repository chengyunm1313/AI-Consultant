---
title: '【GPT-6 Astra 正在把 Vibe Coding，推向 Vibe World Building】'
cover: /images/cover171.png
toc: true
categories:
  - 商業策略
tags:
  - Vibe Coding
  - AI Agent
  - AI工具
date: 2026-09-14 13:54:28
subtitle: 從叫 AI 寫程式，到讓 Agent 操作專業工具、建構互動世界
description: GPT-6 Astra 的 Unreal Engine、Blender 與 Three.js 案例，讓 Vibe Coding 走向 Vibe World Building。本文拆解世界、角色與產品三個尺度，說明 Agent 越會操作專業工具，Domain Knowledge 為何越重要。
---

以前我們講 Vibe Coding，常見的想像是：「一句話，AI 幫我做網站、寫 App。」

但最近看到幾個 GPT-6 Astra 搭配 Unreal Engine、Blender 與 Three.js 的案例，我開始覺得，下一階段可能不只是 Vibe Coding，而是 **Vibe World Building**。

你不只是叫 AI 寫程式，而是讓 Agent 進入專業工具，協助建立角色、遊戲與可以互動的世界。更有意思的是：AI 越能操作專業軟體，我反而越覺得 Domain Knowledge 會變得更重要。

![Unreal Engine、Blender 與 Three.js 的案例分別呈現世界、角色與產品三種建構尺度，中心是 GPT-6 Astra Agent](/images/vibe-world-building-cases.jpg)

以下案例依照作者公開展示整理，重點是觀察工作方法，不代表每個人使用相同模型、方案與工具設定都能得到相同結果；實際能力也會隨版本、權限與專案環境變動。

## AI 開始進入專業工具，而不只生成程式碼

Vibe Coding 把「描述需求、產出程式」變得更容易；而這幾個 3D 案例再往前一步：Agent 開始操作 Unreal Engine、Blender 或 Three.js 專案，建立內容、反覆修改，並把場景、規則與互動組合在一起。

這個轉變不只是「AI 會不會 3D」，而是工作環境開始從人操作的軟體，變成 Agent 也能操作與檢查的執行環境。

## 案例一：從一個物件，走向逐街建構曼哈頓

Matt Shumer 分享 GPT-6 Astra 在 Unreal Engine 中建構曼哈頓場景的過程，並描述它花了一週逐街完成細節。這已經不是只要求 AI「放一棟房子、加幾棵樹」，而是把工作尺度拉到街道與街區。

他也展示過另一個 Unreal Engine 世界：場景裡有以 Astra 驅動的角色 Agent，並以共同生存為目標互動。這讓「建構世界」不只包含空間，也開始包含世界中的行動者與互動規則。

當場景從單一物件擴大到街區，問題自然會延伸到道路與建築的空間關係、資產管理、場景分工與驗收方式。若要進一步投入正式製作，效能、碰撞、載入策略與可維護性仍需要另外檢查；一段令人驚豔的展示，不等於所有製作環節都已完成。

來源：[Matt Shumer 的曼哈頓建構展示](https://x.com/mattshumer_/status/2095609734845927525)、[Astra Agent 世界展示](https://x.com/mattshumer_/status/2095596175705399482)。

## 案例二：拓撲不一致，就改用離散 Mesh 切換

角色表情常用 Blendshape 做平滑變化，但這類頂點形變通常仰賴相容的網格拓撲與頂點對應。若不同 AI 生成的表情 Mesh 拓撲不一致，就不一定能直接做傳統的平滑 Morph。

Nano 分享的 Blender 做法不是硬把所有網格變成同一種拓撲，而是換個解題方向：先把不同表情的 Mesh 對齊；切換時顯示目標表情，並把未啟用的 Mesh 縮小、藏進角色頭部，再透過 Blender Driver 控制切換。

這不是 Blendshape 的平滑融合，而是**離散表情切換**。它用明確的取捨避開拓撲限制，適合某些表情展示情境，卻不能因此宣稱能取代所有臉部動畫流程或提供連續的表情過渡。

我覺得這個案例特別值得看，不是因為 Astra 知道 Blender 哪個按鈕在哪裡，而是 Nano 知道問題來自哪裡，並知道還有哪些方法可以繞過去。

來源：[Nano 在 Blender 中切換角色表情的展示與提示詞](https://x.com/Dstudio_ai/status/2096525100518453342)。

## 案例三：一款跑酷遊戲背後，是一整套產品規則

MSB 使用 GPT-6 Astra 搭配 Three.js 分享豎屏跑酷遊戲《THE LAST GATE》。看起來是讓角色往前跑，拆開需求後卻是一組完整的遊戲系統：

- 玩家通過加減乘除算術門時，隊伍人數會即時改變。
- 撞上障礙物會造成實際隊員損失，而且畫面人數要和遊戲中的真實人數一致。
- 終點遭遇會依最後存活的隊員人數決定。
- 需求包含三條短路線、即時重試，以及帶 Seed 的輸入回放。

這已經不是「幫我做一個 Three.js Demo」，而是把玩法規則、3D 場景、互動、狀態變化與可重現測試一起交給 Agent 處理。作品是否能投入正式產品，仍要再驗收效能、操控手感與程式維護性；但需求本身已經從一句畫面描述，長成可檢查的產品規格。

來源：[MSB 的《THE LAST GATE》公開貼文](https://x.com/KeWai386772/status/2097678911882809407)。

## 三個案例，代表三種建構尺度

| 尺度 | 案例 | 真正要處理的問題 |
| --- | --- | --- |
| 世界級 | Unreal Engine 曼哈頓與 Agent 世界 | 空間關係、場景組織、資產與行動者 |
| 角色級 | Blender 離散表情切換 | 拓撲限制、替代方案與表情控制 |
| 產品級 | Three.js《THE LAST GATE》 | 遊戲規則、互動狀態、重試與回放 |

我看到的不是「GPT-6 Astra 很會 3D」而已，而是 AI 開始透過專業工具，把世界、角色與產品的不同層次串起來。

## AI 越會操作軟體，Domain Knowledge 為什麼越重要？

很多人看到 AI 越來越會用 Blender，第一個反應可能是：「那以後是不是不用學 Blender 了？」

我反而覺得，答案可能剛好相反。

真正厲害的不是 Agent 知道哪個按鈕在哪裡，而是有人知道問題為什麼發生、有哪些限制、什麼 workaround 可行，以及最後怎樣才算完成。

如果你知道 Blendshape、Topology、Mesh、Driver 是什麼，才比較可能看出表情網格不相容的原因，並想到可以改用離散切換。若連問題的語言都不熟悉，就很難把這種解法交代給 Agent，也不容易判斷結果有沒有真的做到。

所以 AI 淘汰的可能不是「懂 Blender 的人」，而是只知道 Blender 按鈕在哪裡、卻說不清楚問題與完成標準的人。

以前你懂 Blender，還得親手操作每一步；懂遊戲設計，也可能得等工程師把規則寫出來。Agent 改變的是專業知識的產能：你可以把問題、限制、不要採用的方法、可行的 workaround 與驗收標準交給 Agent，再由專業工具把它落地。

> **Domain Knowledge × Agent × Professional Tools**
>
> 專業知識負責判斷，Agent 負責執行，專業工具負責把想法變成可以檢查與迭代的成果。

如果你想延伸看「如何把領域經驗交給 AI 軟體化」，可以讀我之前寫的[把專業知識變成軟體](https://blog.es2idea.com/posts/turn-domain-expertise-into-software/)；關於 Vibe Coding 如何改變軟體價值，也可參考[專業知識與 Vibe Coding 的商業機會](https://blog.es2idea.com/posts/vibe-coding-software-economics/)。

## Vibe Coding 的下一階段，可能是 Vibe Anything

以前學 Photoshop、Blender 或 Unreal Engine，常常代表自己要親手完成大量操作。未來你或許不必逐一操作每個按鈕，但仍需要理解這個領域有哪些物件與規則、問題通常出在哪裡、有哪些解法，以及如何驗收。

Vibe Coding 可能只是第一站。接下來還會有 Vibe 3D、Vibe Game Development、Vibe Animation，甚至 Vibe Engineering 與 Vibe World Building。關鍵不是「每套軟體的按鈕都記熟了沒」，而是當 AI 已經能操作工具時，你知不知道該交代什麼、該限制什麼，又該如何判斷它做得對不對。

## 常見問答 (FAQ)

### Q1：Vibe World Building 和 Vibe Coding 有什麼不同？

Vibe Coding 通常聚焦於用自然語言描述需求、讓 AI 產生或修改程式；Vibe World Building 則把 Agent 帶進 Unreal Engine、Blender、Three.js 等專業環境，處理場景、角色、規則與互動，目標尺度從一段程式碼擴大到可探索或可玩的世界。

### Q2：為什麼 AI 越會操作 Blender，專業知識反而越重要？

專業知識能幫你定義問題、提供限制、選擇 workaround，並訂出驗收標準。Agent 可以執行很多操作，但仍需要有人判斷網格、表情或動畫是否符合實際用途。

### Q3：不同拓撲的表情 Mesh 可以直接做平滑 Blendshape 嗎？

不一定。傳統 Blendshape 的頂點形變需要相容的網格與頂點對應；若拓撲不同，可能要先整理網格，或採用像案例中的離散 Mesh 切換。離散切換不等於平滑表情融合，也不是適用所有角色動畫的通用替代方案。

### Q4：AI 做出的 3D 遊戲展示，就等於可以正式上線嗎？

不等於。除了畫面與主要玩法，仍要測試效能、操控、錯誤狀態、裝置相容性與後續維護。案例呈現的是 Agent 能協助建構與實作的範圍，正式產品仍需要明確的驗收與測試。

### Q5：想開始用 Agent 建立 3D 或遊戲專案，最先要準備什麼？

先把目標拆成可檢查的規則：有哪些物件、它們如何互動、哪些限制不能違反，以及怎樣算完成。從小範圍任務開始，讓 Agent 執行後再用專業知識檢查結果，會比只要求「做得漂亮」更容易迭代。
