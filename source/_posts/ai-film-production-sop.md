---
title: "【別再一鏡一鏡抽卡：我整理出一套真正能拍完整故事的 AI 短片製片 SOP】"
cover: /images/cover205.png
cover_position: left center
toc: true
categories:
  - 生成式AI應用
tags:
  - 影音行銷
  - AI工具
  - AI Agent
date: 2026-10-04 17:02:32
subtitle: 從 Shot List、角色與空間設定，到 Risk Shot、粗剪和 V2 修正，建立可反覆執行的 AI 短片製片流程。
description: AI 短片的難題不只是哪個模型最好，而是如何讓角色、空間與故事在多個鏡頭間保持一致。本文整理從 Shot List、Character Bible、Risk Shot 到 V2 修正的製片 SOP，並串起 AI Agent 與剪輯工作流。
---

最近我一直在研究 AI 影片。研究到後來，我發現真正困難的，早就不是「哪個模型生成的影片最好看？」而是：怎麼把十幾個 AI 生成鏡頭，變成一支角色一致、空間合理、故事看得懂，而且可以持續修改的影片？

最近看到漢森建築整理的 [Kling AI 母女短片製作案例：從 12 格分鏡到 V2](https://www.hansunarchitects.com/zh-TW/knowledge/kling-ai-mother-daughter-short-film-workflow)。再加上我前陣子研究的多人同場戲、平面圖與空間一致性、Blender 灰模、角色一致性、Risk Shot、AI 影片逐鏡生成、DaVinci Resolve MCP 和 AI Agent 自動粗剪，我開始把它們接成一套完整的 AI Film Pipeline。

以下是我整理給自己反覆使用的「享哥 AI 短片製片 SOP」。它不是綁定某個模型的提示詞大全，而是把故事、鏡頭、參考資料、版本和驗收接起來的製片流程。

## 先把故事拆成 Shot List，再開影片模型

很多人做 AI 影片時，會直接對模型說：「一個媽媽看著多年沒回家的女兒，感動流淚，電影感。」生成不滿意就再抽一次。這樣很容易把時間和生成額度花在還沒定義清楚的故事上。

比較穩定的起點是先寫劇本，再拆成 Shot List。以兩分鐘短片為例，可以先列出 Shot 01 到 Shot 12，再為每一鏡定義：

- 時間與地點
- 出場人物、景別與鏡頭位置
- 人物在畫面中的位置、動作和視線
- 台詞、情緒，以及鏡頭結束時的狀態

例如 Shot 08 可以寫成：「地點是客廳；女兒站在玄關右側，母親坐在沙發左側。女兒停下腳步，轉頭看向母親，保持眼神接觸並說：『媽，我回來了。』母親不說話，停頓兩秒，眼眶開始泛淚。」

「母親不說話」和「停頓兩秒」都是製片規格的一部分。若不寫清楚，模型可能自行加上台詞或動作。Shot List 的目的不是寫得更像小說，而是讓每一鏡都有能執行、能驗收的條件。

## 建立 Character Bible，先穩住角色

角色一致性是多鏡頭影片最容易失控的地方。主要角色可以先建立 Character Bible，整理正面、左右 3/4 側面、半身與全身參考，以及年齡、髮型、服裝、身高比例和表情特徵。

角色跨越不同年齡時，分開整理，例如 `Mother_Young`、`Mother_MiddleAge`、`Mother_Old`，以及 `Daughter_Child`、`Daughter_Teen`、`Daughter_Adult`。每次生成只提供當下鏡頭需要的角色參考，避免把所有版本都塞進同一個 Context，讓模型多做不必要的判斷。

## 用 Location Bible 和 Spatial Map 固定空間

單張圖漂亮，不代表剪在一起會像同一個地方。沙發、窗戶、門和主要光源若在不同鏡頭裡反覆換位置，觀眾會感覺空間跳掉。

重要場景可以建立 Location Bible，列出大門、沙發、電視、窗戶、餐桌、光源和人物活動區域，並畫一張 Top View 平面圖。多人同場戲再加 Spatial Map，固定人物 A、B、C 的站坐位置、彼此視線、前後景、攝影機位置，以及換機位後不能改變的相對關係。

三個人以上、走位、遮擋或多機位的場景，可以先在 Blender 做灰模 Blocking。放入房間、家具、人物方塊和 Camera，確認人物會不會被擋、構圖是否合理、攝影機高度是否適合，再截圖作為 Composition Reference。這一步的重點不是做出漂亮模型，而是先把空間和機位講清楚。

## Storyboard 是 Keyframe，不只是分格漫畫

規格和空間建立後，再為每個 Shot 製作 Keyframe，例如 `shot_01_keyframe.png`、`shot_02_keyframe.png`。需要控制重要動作時，可以再補 Start Frame、Middle Frame 和 End Frame。

這些圖像參考要一起沿用 Character Bible、Location Bible、Spatial Map 和需要的 Blender Blocking，讓生圖模型有明確的構圖與人物依據。此時目標不是讓模型自由改編，而是先建立剪接時能接得起來的畫面。

## 先測 Risk Shot，別按順序一路生成

12 個鏡頭不一定要從 Shot 01 開始做。先找出最可能失敗的 Risk Shot，例如多人互看、擁抱、手碰臉、擦眼淚、嘴型、快速走位，或鏡頭和人物同時移動。

假設 Shot 03、08、12 最難，就先做這三鏡的測試。若最難的鏡頭目前拍不出來，趁早改劇本、鏡位或表演設計；不要等前面十一鏡都完成，才發現結尾無法成立。順序應該是：

**Storyboard → Risk Shot Test → Production**

## 把 Prompt 寫成可以驗收的動作序列

「電影感、溫暖、感人、細膩」可以描述氣氛，但很難用來判斷生成結果哪裡出錯。更可控的寫法，是把鏡頭拆成連續動作：

1. 女兒停下腳步。
2. 慢慢轉頭看向母親。
3. 維持眼神接觸，再開口說：「媽，我回來了。」
4. 說完自然閉口，保持視線，不再說話。

每個鏡頭的 Prompt 可以依序整理成：

**Subject + Position + Camera + Action Sequence + Eye Contact + Dialogue Timing + Emotion + End State**

這樣比較容易判斷問題出在轉頭、視線、嘴型，還是結尾多出不需要的動作。模型版本和功能會變，鏡頭規格與驗收邏輯則可以保留下來。

## 逐鏡生成並管理版本

Risk Shot 通過後，再逐鏡進入正式 Production。Kling、Google Flow、Veo、MiniMax 等可以是不同階段的候選工具；具體能力、開放狀態和方案限制會隨版本變動，選擇時要以當下實際可用的功能為準。

每個 Shot 都保留規格、參考圖、Prompt、模型、版本和狀態，例如：

```text
shot_08_v01.mp4  人物正確，視線錯
shot_08_v02.mp4  視線正確，嘴型錯
shot_08_v03.mp4  Pass
shot_08_final.mp4
```

記下每次失敗的具體原因，之後才知道要改提示詞、參考圖、運鏡還是表演，而不是讓整支影片反覆重生。

## 先完成 Rough Cut V1，再修單鏡

第一輪素材不用每鏡都做到滿分。先把 Shot 01 到 Shot 12 放進 Timeline，完成 Rough Cut V1，再從整支影片檢查節奏。剪在一起後，可能發現 Shot 03 太長、Shot 06 可以刪掉、Shot 08 情緒不足，或 Shot 11 和 Shot 12 應該交換。

先看整體，再修局部。單看一鏡覺得漂亮，不代表它適合整支影片的節奏和情緒。

## 讓 AI Agent 和剪輯工具協助管理素材

當每一鏡都整理成結構化資料，AI Agent 才有條件協助管理影片。例如為每個 Shot 記錄：

```text
shot_id, duration, character, location, prompt, model,
version, status, issue, selected_version
```

Agent 可以依 Shot List 檢視時長、黑畫面、重複畫面、音訊斷裂、字幕缺漏和對白 Timing，也可以協助標記待人工確認的角色或畫面問題。這些檢查結果是 review 線索，不能直接當成最終判斷。

若手上已有可用的 DaVinci Resolve MCP 或其他剪輯操作介面，可以把 Shot Metadata、素材搜尋、`selected_version`、時間軸排列、字幕和 Rough Cut 輸出接成一條流程。工具串接方式會依實際環境而異；每次操作仍應保留人工檢查和可回復的版本。

## V1 之後只修有問題的 Shot

Review 時逐鏡記錄問題，例如 Shot 03、04 通過，Shot 05 嘴型不準、Shot 07 手部異常、Shot 08 節奏太慢。接著只處理需要修的鏡頭：嘴型問題可評估 Audio Fix 或 Lip Sync，手部問題可重生 Shot 07，節奏問題則可 Trim、調速或重生 Shot 08。

替換後輸出 Rough Cut V2，再重新檢查前後鏡的銜接。保留其他已通過的鏡頭，才能把修改成本集中在真正出問題的地方。

## Technical QA 通過後，仍要 Human Final Review

影片輸出後，先做 Technical QA：解析度、FPS、Codec、Bitrate、Duration、音訊取樣率、字幕數量、黑畫面、靜音與完整解碼。這些檢查能確認檔案是否符合技術條件。

Technical QA Pass 不等於影片好看。最後還是要從頭看到尾，確認角色有沒有變臉、視線和空間方向是否合理、嘴型自然不自然、情緒有沒有中斷、音樂音量是否合適，以及故事是否看得懂。

## 把流程接成一套 AI Film Production System

整套流程可以整理成：

```text
Idea
 ↓
Script → Shot List
 ↓
Character Bible → Location Bible → Spatial Map
 ↓
Blender Blocking（複雜鏡頭需要時）
 ↓
Storyboard / Keyframe
 ↓
Risk Shot Test
 ↓
逐鏡生成 → Version Management
 ↓
Rough Cut V1 → AI Agent Review → 剪輯工作流
 ↓
局部修正／重生 → Rough Cut V2
 ↓
字幕／BGM／混音 → Technical QA
 ↓
Human Final Review → Master Export
```

研究到這裡，我反而覺得「AI 導演」比「AI 生影片」更值得學。模型會換，提示詞寫法也會變；但怎麼說故事、拆 Shot、控制角色和空間、安排鏡位、驗收素材與管理版本，仍然是製片能力。

我想把 Shot List、Character Bible、Prompt、Reference、Version、Issue、Status 和 Selected Clip 都整理成結構化資料，再讓 AI Agent 協助管理。理想分工是：人負責導演和決策，Agent 協助製片管理，生成模型提供鏡頭素材，剪輯工具完成後期。這不是按一下就能完成整部片，而是一套能持續修正的 AI 影片工作流。

想先從故事本身開始，可以接著讀[AI 影片新手最容易學錯的：把「高級感」當成影片能力](/posts/ai-video-storytelling/)；想把鏡頭描述得更清楚，也可以看[AI 攝影語言與 Google Flow 運鏡提示詞](/posts/ai-cinematography-prompts/)。

## 常見問答 (FAQ)

### Q1：製作 AI 短片前，應該先生成影片嗎？

建議先寫劇本和 Shot List，為每鏡定義人物、位置、動作、視線、台詞與結束狀態，再建立角色和場景參考。這能讓影片生成有明確規格，也方便判斷結果要修哪裡。

### Q2：什麼是 AI 短片的 Risk Shot？

Risk Shot 是整支影片中最可能失敗的鏡頭，例如多人互看、擁抱、手部接觸、嘴型或複雜走位。先測這些鏡頭，可以在大量生成前調整劇本、鏡位或表演。

### Q3：Blender 灰模是 AI 影片製作的必要步驟嗎？

不是。單人鏡頭或簡單對話通常可用平面圖和空間參考處理；多人、遮擋、走位或多機位等複雜場景，才值得用 Blender 灰模預演人物位置與構圖。

### Q4：AI Agent 可以直接決定哪些鏡頭要保留嗎？

Agent 可以整理 Shot Metadata、標記技術問題或提供 review 線索，但角色一致性、情緒、空間連戲和故事可讀性仍需要人工從頭檢視，不能把自動檢查結果當成最終通過。

### Q5：Rough Cut V1 之後，要整支影片重新生成嗎？

通常先定位有問題的鏡頭，再局部修正或重生並輸出 V2。保留已通過的版本，能避免把修改成本擴大到整支影片。

---
