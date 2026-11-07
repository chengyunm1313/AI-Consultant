---
title: 600 組 AI 短影音提示詞怎麼用？從 Y2K 廣告圖鑑到 Gemini Omni 1.2 Flash、Seedance 2.5 實戰教學
cover: /images/cover240.png
toc: true
categories:
  - 生成式AI應用
tags:
  - AI工具
  - 影音行銷
  - Gemini
date: 2026-11-07 16:23:10
subtitle:
description: 600 組 AI 短影音提示詞怎麼改成自己的作品？從 QuickPhoto 找靈感，拆解角色、場景、動作與時間軸，附雨夜舞蹈英文提示詞，整理 Gemini Omni 1.2 Flash、Seedance 2.5 的規格、成本與驗收方法。
---

想用 AI 拍一支 15 秒短影音，你可能也有過這種經驗：明明提示詞寫了「女生在雨夜跳舞、走到窗邊說一句話，最後微笑鞠躬」，生成的影片卻只完成一半。人物漂亮、燈光也美，但指定的動作沒出現，甚至連結尾都不見了。

問題不一定是 AI 不夠強，而是我們常把「故事、人物、運鏡、動作、時間、聲音」全部塞進同一段話，卻沒有告訴模型哪些事情絕對不能漏。

最近我注意到一個免費網站「Y2K 廣告影片提示詞圖鑑」，標榜整理了 600 組短影音提示詞。剛好 Gemini Omni 1.2 Flash 也在 2026 年 11 月 5 日登場，另一邊還有能生成較長片段的 Seedance 2.5。

這篇就帶新手從找靈感開始，學會改寫提示詞、準備角色參考圖、生成影片，再判斷哪個模型適合你的作品。

## 一、先認識 QuickPhoto：600 組提示詞，不等於 600 支現成影片

網站：[QuickPhoto：Y2K 廣告影片提示詞圖鑑](https://quickphoto.shop/)

QuickPhoto 是**提示詞參考庫**，不是直接生成影片的工具。網站標榜有 20 個分類、共 600 組範例，包含：

- 穿搭 OOTD、時尚街拍
- 美妝保養、居家療癒
- 咖啡日常、城市漫步
- 旅遊寫真、夜景氛圍
- 舞蹈挑戰、健身運動
- 泳池度假、甜美劇情

**怎麼使用？**

1. 開啟網站，先選一個符合你想拍內容的分類。
2. 使用搜尋或隨機功能尋找範例。部分搜尋偏向英文關鍵字，例如 *coffee*、*rainy*、*dance*。
3. 點開喜歡的範例，觀察人物設定、服裝、場景、攝影、音訊、對白及分鏡時間安排。
4. 將提示詞當作素材，修改成自己的角色與故事，再貼到可使用的影片生成工具。

網站雖以「Y2K」命名，內容其實不全是千禧年復古廣告；不少是生活 Vlog、UGC（使用者原創內容）感的短影音。

這正好適合經營 AI 網紅：我們不是要照抄某個漂亮女生，而是學會設計「觀眾覺得真實、想繼續看」的情境。

## 二、一段好的 AI 影片提示詞，要拆成七個部分

我會把素材庫中的提示詞拆成七個模組：

| 模組 | 要交代什麼 | 範例 |
|---|---|---|
| 角色 | 是誰、固定哪些外貌特徵 | 使用已上傳的 AI 網紅定裝照，保留五官與髮型 |
| 場景 | 地點、時間、環境 | 雨夜的玻璃舞蹈教室，窗外霓虹倒影 |
| 服裝 | 款式、布料、配件 | 藍綠色裹身洋裝、低跟舞鞋 |
| 動作 | 具體、可看見的行為 | 轉身、停步、手掌貼住玻璃 |
| 運鏡與打光 | 景別、移動、光源 | 中景緩慢推近、暖色側光、窗邊逆光 |
| 音訊 | 環境聲、音樂、台詞 | 雨聲、低音量倫巴節奏、一句中文台詞 |
| 時間軸 | 哪幾秒做什麼、何者不能省 | 0–3 秒開場，最後 3 秒完成微笑致意 |

最重要的是區分**固定條件**和**可變條件**。

經營同一位 AI 網紅時，臉型、五官、膚色、髮型和辨識度應盡量固定；場景、服裝、故事、攝影風格才是每次可以改變的部分。

請記住：單靠「保持同一張臉」這句咒語，不能保證角色一致。比較可靠的做法仍是提供清楚的角色母圖、正面與側面參考，必要時搭配分鏡首幀。

## 三、新手實作：把雨夜舞蹈改成自己的 15 秒短影音

依使用者提供的初稿轉述，小茉莉在[雨夜倫巴比較文章](https://omnipd.cloud/post/19134)中，選用 QuickPhoto 的 **Rainy Window Rumba（雨窗倫巴）**，拿同一段提示詞比較 Omni 1.2 Flash 和 Seedance 2.5。本文整理時無法讀取該實測頁面，也未重新生成或播放比較影片；以下實測描述保留為初稿轉述，並非本文獨立驗證的結果。

原構想包含雨窗、倫巴、中文台詞、貼玻璃與結尾鞠躬。

以下不是原網站提示詞的照錄，而是我重新整理、適合 AI 網紅使用的範例。

請先準備一張你擁有使用權的角色定裝照，再使用這段英文提示詞：

```text
Create a 15-second vertical 9:16 photorealistic lifestyle video.

CHARACTER AND IDENTITY
Use the uploaded character reference image as the sole identity reference.
Preserve the same facial structure, eyes, nose, lips, skin tone, hairstyle,
and recognizable appearance throughout the video. She is an adult.

SCENE AND WARDROBE
A cozy dance studio in Taipei on a rainy evening. Large glass windows,
soft reflections of city lights and raindrops sliding down the glass.
The character wears an elegant teal wrap dress and comfortable dance shoes.
Natural skin texture, realistic fabric movement, gentle cinematic lighting.

TIMELINE
0-3s: Medium-wide shot. She stands beside the rain-covered window,
hears the music, and turns toward the camera with a subtle smile.

3-7s: She performs a few relaxed, believable rumba steps.
The camera moves slowly closer, keeping her face clearly visible.

7-11s: She pauses, places one open palm FLAT against the glass,
and softly says in natural Taiwan Mandarin:
「今晚的雨聲，剛好幫我打拍子。」

11-15s: She lowers her hand, smiles warmly, gives a small graceful bow,
and holds the ending pose for one second.

AUDIO
Soft rain ambience, gentle original instrumental rhythm,
clear dialogue, synchronized natural lip movement.

MUST-HAVE EVENTS
1. The palm must visibly touch the glass.
2. The Mandarin sentence must finish before the final bow.
3. The final smile and bow must not be omitted.

AVOID
Face changes, extra fingers, morphing garments, unnatural dancing,
unrequested camera cuts, subtitles baked into the picture.
```

這段提示詞有三個刻意設計：

**第一，把台詞縮短。**

15 秒不適合又跳長舞、又講一大段話。台詞最好短到角色可以自然地說完。

**第二，把關鍵動作寫成可驗收事件。**

手掌不是「靠近」玻璃，而是要清楚「貼住」玻璃。動作越具體，後續才越容易判斷有沒有完成。

**第三，替結尾保留時間。**

最後一秒要有完整停頓，方便剪輯，也避免影片戛然而止。

提醒一下：影片模型不一定會精準服從每個秒數。時間軸是導演指令，不是保證執行的程式碼。

如果四個段落仍然太複雜，請拆成兩支短片生成，再進剪輯軟體組合。

## 四、Gemini Omni 1.2 Flash 與 Seedance 2.5 怎麼選？

先看官方公告與文件中的規格，再把創作建議和實際測試分開。

依 [Google 於 2026 年 11 月 5 日發布的官方公告](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/)，Gemini Omni 1.2 Flash 主要有五個值得關注的升級：

1. 原生影片最長從 10 秒增加到 15 秒。
2. 支援多輪對話修改影片。
3. 改善角色、服裝、物件的參考一致性。
4. 可先以 360p 或 720p 製作草稿，再將選定作品放大到 1080p 或 4K。
5. 720p API 價格降至每秒約 US$0.07。

要注意，**放大到 4K 不等於原生 4K 生成**。

依 [BytePlus 官方模型教學](https://docs.byteplus.com/zh-CN/docs/modelark/seedance-2-5)，Seedance 2.5 支援單次最長 30 秒，以及多種參考素材輸入。

[BytePlus 官方提示詞指南](https://docs.byteplus.com/en/docs/modelark/seedance-2-5-prompt-guide)列出：

- 最多 30 張圖片
- 最多 10 段影片
- 最多 10 段音訊
- 總計最多 50 個參考素材

影片與音訊參考各自還有合計不超過 30 秒的限制；數量上限不代表任意長度的素材都能直接上傳。

素材越多並不代表結果一定越好。仍應清楚標記哪一張是人物、哪一段是動作，避免參考互相衝突。

### 兩款 AI 影片模型比較

| 比較項目 | Omni 1.2 Flash | Seedance 2.5 |
|---|---|---|
| 單次影片 | 3–15 秒 | 4–30 秒 |
| 720p API 參考成本 | US$0.07／秒 | 約 US$0.231／秒 |
| 15 秒粗估 | 約 US$1.05 | 約 US$3.47（示意換算） |
| 適合優先嘗試 | 日常 Vlog、產品小廣告、短台詞與多輪修改 | 較長表演、複雜運鏡、多素材動作參考 |

價格表中的 Seedance 數字，來自 [BytePlus 官方定價頁](https://docs.byteplus.com/en/docs/modelark/model-pricing)的「無輸入影片、720p、16:9、輸出 5 秒」範例：每支 US$1.156，換算每秒約 US$0.231。15 秒約 US$3.47 是沿用該每秒數字的示意乘算，並非官方對本文 9:16 提示詞的報價。

實際費用會依解析度、輸入素材、Token 消耗及平台方案而變動。上表不是所有情境的最終帳單，也不包含反覆修改、放大和剪輯成本。

### 免費用戶還有一個好消息

[Google Vids 官方公告](https://blog.google/products-and-platforms/products/workspace/omni-1-2-flash-google-vids/)說明，一般 Google 帳號或 Google Workspace 訂閱使用者，**每月最多可免費生成三支 15 秒影片**。

如果帳號介面已開放，這是新手低成本試作的好入口。

但 Gemini App、Google Vids、Flow 與 API 是不同的使用管道，不要把各平台的免費額度與功能權限混為一談。

## 五、為什麼同一段提示詞，兩個模型拍出來完全不一樣？

依初稿對[小茉莉文章](https://omnipd.cloud/post/19134)的轉述，這次案例是兩個模型各生成一次 15 秒雨夜倫巴。此處不將單次觀察視為模型能力排名。

初稿轉述的觀察如下：

**Gemini Omni 1.2 Flash**

- 服裝比較符合原始要求。
- 中文台詞正確。
- 有完成微笑與結尾鞠躬。
- 整體較明亮，像精緻的商業廣告。

**Seedance 2.5**

- 逆光剪影更有戲劇張力。
- 手掌貼玻璃的畫面更有感覺。
- 運鏡接近一鏡到底。
- 但漏掉最後的鞠躬動作。

然而，這次測試有個容易忽略的地方：

原本要求的是六個鏡頭，實際上 Omni 主要只做出一次明顯切換，Seedance 更接近一鏡到底。

因此，這個案例真正說明的是：

**畫面漂亮，不等於指定事件全部完成；有完成動作，也不代表完全遵守剪輯分鏡。**

而且兩個模型各測一次，不能推論哪個模型一定比較強。

如果想做有意義的比較，我會建議：

1. 使用相同的角色參考圖。
2. 使用同一條中性提示詞。
3. 設定相同的影片長度與比例。
4. 每個模型至少生成三次。
5. 依照相同標準比較結果。

例如：

- 角色臉部、髮型、服裝有沒有漂移？
- 三個不可省略的事件完成幾個？
- 中文台詞是否清楚、時間與嘴型是否正確？
- 運鏡、表情、身體動作自然嗎？
- 總共重做幾次，才產出一支能上架的影片？

真正影響創作者成本的，往往不是「每秒報價」，而是**每支可用成品的總成本**。

## 六、進階技巧：用多輪修改降低重拍次數

依 Google 公告支援的多輪修改功能，我會優先測試以下工作流。這是製作建議，並非本文已完成的實測。

先用低解析度草稿確認角色、動作和台詞；錯一個地方就只要求修改一件事；確定可用後才放大與剪輯。

例如原片已經拍好，只是背景太亮，可以接著輸入：

```text
Edit the existing clip.

Change only the background lighting to a darker,
warmer rainy-night mood.

Preserve the character's face, hairstyle,
wardrobe, dance timing, spoken dialogue,
hand touching the window, camera framing,
and final bow.

Do not add new actions.
```

這裡的重點是：

**「改什麼」與「保留什麼」，要同時寫清楚。**

例如：

- 改背景，不要換人物。
- 改燈光，不要改動作。
- 改服裝，不要變臉。
- 改攝影風格，不要刪掉結尾。

不過，多輪修改也可能重新運算影片，不能把它理解成必然免費、零損失，或每次都能 100% 只動指定區域。

若使用 Seedance 2.5，則可以考慮將「角色定裝照」、「參考舞步短片」、「場景圖」分開上傳，明確指出每個素材的用途。

當動作難以靠文字描述時，這種方式特別值得測試。

## 七、影片生成成功，不代表可以直接上架

成品最好再做四項檢查。

**1. 畫面品質**

手指、臉部、服裝、道具是否突然變形？

**2. 劇情完整度**

最後的台詞、笑點、品牌資訊或結尾動作是否真的出現？

**3. 聲音表現**

中文發音、音量、環境聲與配樂是否自然？

**4. 社群版位**

9:16 影片的標題與字幕不要太靠近上下邊緣，避免遭到 Reels 或 Shorts 的介面遮住。

接著可以用熟悉的剪輯工具，例如 DaVinci Resolve、Concat 或其他編輯器，剪掉失敗片段、補字幕、統一音量，再輸出社群平台需要的格式。

延伸閱讀：需要先準備角色與服裝參考時，可參考[Open Pose & Costume 使用教學](/posts/open-pose-costume-guide/)。

## 八、我的建議：先選內容，再選 AI 工具

如果你是第一次做 AI 網紅，我建議先用 QuickPhoto 找一個日常情境，準備固定角色圖，用 15 秒、三到四個事件的簡單故事開始。

**重點不是一次生成超複雜的六鏡頭廣告，而是確保觀眾看得懂人物在做什麼。**

想大量製作生活 Vlog、帶貨素材、人物口播，先試試 Omni 1.2 Flash 的修改流程。

想要長一點的舞蹈表演或需要很多參考素材，再測試 Seedance 2.5。

對 AI 網紅來說，角色一致性、劇情完成度、可重複使用的流程，比單支影片的華麗程度更重要。

未來如果要把這些步驟變成 Codex Skill，還能再往前一步：

- 建立角色資料卡
- 整理提示詞模組庫
- 自動產生分鏡
- 輸出影片生成任務清單
- 建立影片驗收表

每次只要說「用 Rei 拍一支 15 秒雨夜 Vlog」，就能得到一套可執行、可檢查、可持續改進的製作方案。

**600 組提示詞最有價值的地方，是幫你學會拆解情境、設計事件與驗收結果，建立能反覆使用的短影音製作流程。**

## 常見問答 (FAQ)

### Q1：QuickPhoto 的 600 組提示詞可以直接生成影片嗎？

QuickPhoto 是提示詞參考庫。你需要先選擇情境、改寫人物與故事，再把提示詞及有使用權的角色參考圖交給支援的影片生成工具。網站列出的秒數是範例設計，實際片長仍取決於生成工具。

### Q2：15 秒影片為什麼常漏掉台詞或結尾動作？

當舞蹈、運鏡、台詞與多次切鏡同時擠在短片裡，模型可能無法完成所有事件。可縮短台詞、減少動作、明列不可省略事件，並預留結尾停頓；仍不完整時，拆成兩段生成再剪輯。時間軸指令不能保證模型逐秒執行。

### Q3：Omni 1.2 Flash 和 Seedance 2.5 該怎麼選？

想測試 15 秒短片與多輪修改，可先試 Omni 1.2 Flash；需要較長片段或多種參考素材，可測試 Seedance 2.5。使用相同角色、提示詞、長度與比例反覆比較，依角色一致性、事件完成率與每支可用成品的總成本選擇，不能用單次結果判斷永久優劣。

---

### 參考資料

- [Y2K 廣告影片提示詞圖鑑：QuickPhoto](https://quickphoto.shop/)
- [小茉莉：Gemini Omni 1.2 Flash 與 Seedance 2.5 雨夜倫巴實測](https://omnipd.cloud/post/19134)
- [原始比較影片：欣欣的 AI 無限世界](https://youtu.be/7RtesmULbLY)
- [Google 官方：Gemini Omni 1.2 Flash 新功能](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/)
- [Google 官方：Google Vids 免費生成額度](https://blog.google/products-and-platforms/products/workspace/omni-1-2-flash-google-vids/)
- [BytePlus 官方：Seedance 2.5 模型規格](https://docs.byteplus.com/zh-CN/docs/modelark/seedance-2-5)
- [BytePlus 官方：Seedance 2.5 提示詞指南](https://docs.byteplus.com/en/docs/modelark/seedance-2-5-prompt-guide)
- [BytePlus 官方：ModelArk 定價](https://docs.byteplus.com/en/docs/modelark/model-pricing)
- [Artificial Analysis：文生影片排行榜](https://artificialanalysis.ai/video/leaderboard/text-to-video)

*資料查核日期：2026 年 11 月 7 日。產品規格、可用地區、免費額度與 API 定價可能調整；請以帳號介面及官方最新文件為準。雨夜倫巴比較來自使用者初稿轉述，原實測頁與比較影片未能於本次整理中獨立核對；本文未重新執行模型生成測試，也未以排行榜判定優劣。*
