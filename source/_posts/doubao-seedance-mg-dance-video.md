---
title: 豆包 AI 跳舞影片完整教學：從角色生圖、中文提示詞到 10 秒 K-pop 街舞＋MG 動態特效
cover: /images/cover211.png
toc: true
categories:
  - 生成式AI應用
tags:
  - 影音行銷
  - AI工具
  - Seedance
date: 2026-10-10 13:11:51
subtitle: 新手實作教學｜豆包 Doubao／Dola × Seedance × Motion Graphics｜附中英文提示詞、驗證清單與完整工作流程
description: 從角色參考圖到 10 秒 K-pop 舞蹈 MV，帶你用豆包整理 Seedance 提示詞，安排腳步、運鏡與 Motion Graphics 觸發條件。附中英提示詞、角色圖流程、生成 QA 與常見問題，並說明模型版本、入口和音樂限制。
---

想做一支 AI 跳舞影片：舞者跟著節奏快速換腳，手臂揮出去時出現追蹤線，踩下重拍時背景爆出文字與震波，最後一個動作俐落定格。真正需要設計的，不只是「請 AI 做一支很帥的影片」，還包括角色外觀、舞步順序、鏡頭、音樂和特效之間的關係。

這篇以一位成年韓系街舞女孩為範例，整理一套從角色參考圖、分鏡、提示詞到生成後檢查的流程。影片目標是 10 秒、16:9、K-pop × Hip-hop，並加入與動作有關的 Motion Graphics（MG，動態圖像）。文中的提示詞是可修改的練習稿，並非已生成影片的實測保證。

如果你想先練習基本舞步描述，可以先看[零基礎 AI 跳舞影片教學](/posts/doubao-seedance-dance-video-tutorial/)；本文聚焦在進階一點的角色參考、MG 觸發規則與分段驗收。

## 先定義這支影片要完成什麼

| 項目 | 本文示範設定 |
| --- | --- |
| 長度與比例 | 10 秒、16:9 橫式；實際可選秒數依模型與介面而異 |
| 主角 | 一位成年街舞女孩，以參考圖鎖定髮型、服裝與配件 |
| 舞蹈 | K-pop 女團主舞氣質，結合 Hip-hop 街舞 |
| 場景 | 明亮白色攝影棚；參考圖只用來描述角色時，需明確說明不要沿用原背景 |
| 音樂 | 約 125 BPM 的電子嘻哈器樂，無人聲；BPM 是創作目標，不代表模型會精準照拍 |
| 運鏡 | 正面全身鏡頭為主，輕微推近或平移，重要腳步保持可見 |
| MG | 動態文字、手臂追蹤線、衝擊環、震波與幾何分割 |
| 結尾 | 最後半秒在重拍上定格，背景只安排一次主要爆發 |

MG 是 Motion Graphics 的縮寫，指文字、線條、色塊或幾何圖形等視覺元素的動態設計。重點不是把特效塞滿畫面，而是設計觸發關係：手臂揮出時有追蹤線，腳步落地時有震波，舞者旋轉時幾何圓環才跟著轉。

| 舞者動作 | 可對應的 MG |
| --- | --- |
| 手臂快速揮出 | 沿手臂方向出現一條短暫追蹤線 |
| 腳步重踩 | 從落腳位置向外擴散圓形震波 |
| 大幅跨步 | 畫面邊框向外展開，保持雙腳完整可見 |
| 身體半圈旋轉 | 幾何圓環跟著旋轉方向短暫轉動 |
| 音樂重拍 | 背景文字與一次節奏閃動同步出現 |

先認識工具名稱也能避免把入口和模型混在一起：

| 名稱 | 在本文中的意思 |
| --- | --- |
| 豆包 Doubao | 用來討論、整理分鏡和提示詞的 AI 助理；影片入口依帳號介面而異 |
| Seedance | 字節跳動的影片生成模型系列 |
| 即夢 AI | 可提供圖像或影片創作功能的平台之一，當下可用模型依帳號與地區而異 |
| Dola | 若在其他市場或產品頁看到這個名稱，請依當地官方頁面確認其服務與入口；本文不把 Dola 視為豆包或 Seedance 的同義詞 |
| Motion Graphics | 影片裡配合動作出現的文字、線條、形狀與節奏視覺 |

截至本文整理時，字節跳動 Seed 官方資料說明 Seedance 2.0 支援文字、圖片、音訊與影片參考，並列出豆包與即夢 AI 等體驗入口；Seedance 2.5 則提升了單次生成長度與可用參考素材數量。火山方舟文件也列出 API 的秒數、比例與首幀設定。這些規格不代表每個帳號、地區或產品介面都有同一組選項，實作前請以目前可見的模型和設定為準。[Seedance 2.0 發布說明](https://seed.bytedance.com/zh/blog/official-launch-of-seedance-2-0)｜[Seedance 2.5 發布說明](https://seed.bytedance.com/zh/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)｜[火山方舟影片生成教學](https://docs.volcengine.com/docs/ark/video-generation-tutorial?lang=en)

## 第一階段：先請豆包當分鏡助理

新手容易一次把「漂亮、舞很快、鏡頭很多、特效很多」全寫進提示詞，讓模型自行猜測動作順序。可以先請豆包把需求拆成時間軸，再檢查安排是否太密集。

### 提示詞 1：先規劃舞蹈 MV

~~~text
你是一位 K-pop 舞蹈 MV 導演、街舞編舞師、攝影指導與 Motion Graphics 動態設計師。

我想用影片生成模型製作一支 10 秒、16:9 橫式的 K-pop × Hip-hop 街舞 MV。主角是一位成年韓系街舞女孩，人物外觀以我提供的角色參考圖為準。場景是明亮白色攝影棚，音樂目標約 125 BPM、電子嘻哈器樂、無人聲。請把這些內容視為創作規格，不要宣稱影片已經生成或測試。

編舞條件：
- 第一秒就開始跳舞，不先站著擺姿勢。
- 動作包含肩膀重擊、手臂重擊、腳跟腳尖切換、快速換腳、交叉步、身體局部控制、側向跨步與短距離半圈旋轉。
- 每段動作要能自然銜接，保留合理重心轉移。
- 舞步期間以正面全身鏡頭為主，腳和鞋子保持完整可見。

MG 條件：
- 手臂揮出時才出現追蹤線。
- 腳步落地時才出現衝擊環或震波。
- 身體旋轉時才讓幾何圓環跟著轉。
- 可使用 MOVE、BEAT、GO 三個短字作為動態文字；文字放在人物後方，不遮臉或雙腳。
- 每個特效都要對應動作或節拍，沒有觸發動作時保持畫面乾淨。

請依序輸出：
1. 影片創作規格摘要。
2. 每兩秒一段的分鏡表，列出舞步、運鏡、MG 與音樂節奏。
3. 可直接修改的完整中文影片提示詞。
4. 由中文版本翻譯整理的英文對照稿。
5. 可能失敗的地方與具體修改方向。
6. 600 字以內的精簡中文提示詞。

請用繁體中文解釋，專業名詞第一次出現時附上白話說明。先完成規劃，不要直接生成影片。
~~~

這個提示詞把創作目標和交付格式分開，讓 AI 先交分鏡，再交影片提示詞。時間軸是編排參考，不是逐格控制保證；需要非常精準的節拍或文字時間，應安排後製。

### 提示詞 2：讓 AI 審查提示詞

第一版寫完後，不要立刻生成。先要求 AI 檢查動作密度、構圖和特效是否互相衝突：

~~~text
請擔任 Seedance 影片提示詞品質審查員，嚴格檢查上一版 10 秒舞蹈＋MG 提示詞。這是文字規劃審查，不是影片實測。

請檢查：
1. 10 秒內是否安排太多舞蹈動作，動作之間能否自然銜接？
2. 旋轉或運鏡是否可能增加人物外觀不穩定的風險？
3. 腳步動作期間是否有足夠的全身鏡頭？
4. 每個 MG 效果是否有明確的舞蹈或音樂觸發條件？
5. 文字或特效是否可能遮住臉部與雙腳？
6. 125 BPM 是否只是創作目標，提示詞有沒有誤稱為精準同步？
7. 是否有互相矛盾或難以同時完成的要求？
8. 結尾高潮是否簡潔、清楚、可執行？

請用表格列出「檢查項目、風險程度、原因、修改建議」。最後提供修正後的中文提示詞、600 字內精簡版、主要修改差異，以及生成後優先觀察的五個重點。
不要宣稱已經驗證影片成功，也不要加入原提示詞沒有的角色或場景。
~~~

## 第二階段：準備角色參考圖

先固定角色外觀，再讓角色動起來，通常比只靠文字重複描述更容易檢查一致性。本文提供兩張參考圖：第一張呈現低角度街舞姿勢與服裝；第二張整理正面、側面、背面、表情和細節。它們是角色與視覺參考，不代表影片生成結果。

![低角度街舞姿勢參考：黑色帽子、高馬尾與黑白街舞穿搭](/images/doubao-seedance-mg-dance-video-pose.jpg)

![街舞女孩角色設定參考：正面、側面、背面與服裝細節](/images/doubao-seedance-mg-dance-video-character-sheet.jpg)

如果要把角色放進白色攝影棚，提示詞要明確說「只參考人物外觀和服裝，不沿用參考圖背景」。不過參考圖仍可能影響場景；若白色背景很重要，可以先另外生成乾淨的 16:9 全身首幀，再用它製作影片。

### 提示詞 3：建立可用於圖生影片的全身角色圖

~~~text
請生成一張寫實時尚攝影風格的成年東亞女性街舞舞者全身照，作為後續圖生影片的角色參考。

人物外觀：深棕色眼睛、黑色長髮綁高馬尾、黑色運動帽、銀色圈形耳環與十字架項鍊。
服裝：黑色短版運動上衣、黑白拼色寬鬆街舞外套、黑色寬鬆工裝褲、銀色褲鏈與白色街舞運動鞋。
場景：明亮乾淨的白色舞蹈攝影棚，地面有柔和反光。
姿勢：身體微微下沉，雙腳自然錯開，膝蓋微彎，手臂保持準備發力的動態張力。
構圖：16:9 橫式、正面全身、人物置中，完整呈現頭部、雙手和雙腳，四周保留留白。
限制：人物為明確成年者，保持自然人體比例；只有一人。不要文字、Logo、浮水印、裁切鞋子或額外人物。
~~~

### 提示詞 4：生成角色設定參考圖

~~~text
請以我上傳的街舞女孩圖片作為唯一角色外觀參考，製作一張乾淨易讀的角色設定板。

保持同一張臉、髮型、身材比例、帽子、耳環、項鍊、服裝與鞋子。版面包含正面全身、右側面全身、背面全身、臉部近照、四種表情，以及服裝和配件細節。

使用統一攝影棚光線與乾淨背景，各視圖清楚分區，不要新增人物、文字、Logo 或浮水印。角色設定圖用來補充外觀參考，不保證後續影片完全不變臉，也不一定適合直接當影片首幀。
~~~

三視圖是補充資訊，不是角色一致性的保證。影片入口如果只能上傳一張圖片，優先選擇全身、鞋子清楚、姿勢適合開始舞蹈的單人圖片；多視圖上傳則先確認每張圖在介面中的用途。

## 第三階段：選擇影片生成設定

在目前帳號可用的豆包或即夢 AI 介面中，選擇影片生成入口，先確認模型名稱、時長、比例、首幀或參考圖模式、音訊選項，再貼上提示詞。API 文件和一般使用者介面的選項可能不同。

Seedance 官方資料目前分別列出 2.0 與 2.5 的參考素材能力；火山方舟文件也說明首幀圖片的角色設定及影片比例規則。若使用首幀生影片，比例可能依首幀圖片而定；若要 16:9，先準備相同比例的完整人物圖。10 秒和 125 BPM 都是本篇示範設定，請以實際介面可選值為準。[Seedance 2.0 提示詞指南](https://docs.volcengine.com/docs/ark/seedance-2-0-prompt-guide?lang=zh&redirect=1)｜[Seedance 2.5 功能文件](https://docs.volcengine.com/docs/ark/seedance-2-5?lang=zh)

### 提示詞 5：中文完整版

以下提示詞以你選定的角色參考圖為主。若介面提供素材引用標記，請按介面實際產生的名稱替換「角色參考圖」；本文中的描述不是 API 欄位語法。

~~~text
【影片目標】
製作一支 10 秒、16:9 橫式的 K-pop × Hip-hop 街舞 MV，呈現俐落舞蹈、節奏明確的電子嘻哈器樂，以及與動作同步的 Motion Graphics 動態圖像。

【人物】
使用上傳圖片作為角色外觀參考，只參考人物臉部、髮型、身材比例、帽子、耳環、項鍊、服裝與鞋子。主角是一位成年街舞女孩，黑色高馬尾、黑色運動帽、黑色短版上衣、黑白拼色外套、黑色寬鬆工裝褲、銀色褲鏈與白色球鞋。全程只有一位舞者，保持外觀和服裝一致。

【場景與風格】
明亮、乾淨的白色攝影棚，地面帶柔和反光。畫面結合高級 K-pop MV、街舞時尚攝影與現代動態圖像設計。主色為黑、白、電光青與螢光黃，少量紅色作強調。人物是視覺中心。

【攝影機】
以正面全身表演鏡頭為主，搭配輕微向前推近或左右平移。主要腳步期間完整保留雙腳和鞋子。使用穩定、連續的鏡頭，不突然換景，不大幅旋轉，不讓文字或特效遮住臉和腳。

【舞蹈】
K-pop 女團主舞結合 Hip-hop 街舞。動作包含肩膀重擊、手臂重擊、腳跟腳尖切換、快速換腳、交叉步、胸部局部控制、側向跨步和短距離半圈旋轉。動作從第一秒開始，清楚呈現重心轉移，逐漸加速，最後形成高潮。舞步之間保持連續，不瞬間跳接。

【MG 動態圖像】
使用 MOVE、BEAT、GO 三個短字，搭配手臂追蹤線、圓形衝擊環、幾何畫面分割和重拍震波。
手臂快速揮出時，沿手臂方向出現一條短暫電光青追蹤線。
腳步重踩時，從落腳位置向外擴散圓形震波。
大幅跨步時，幾何框架向外展開，但不要裁掉鞋子。
身體半圈旋轉時，圓環沿同方向短暫旋轉。
音樂重拍落下時，背景才出現動態文字與一次震波。
所有圖像效果位於人物後方或畫面周圍；沒有對應動作時保持背景乾淨。文字需保持簡短，若無法穩定生成正確字形，優先保留舞蹈和構圖。

【時間軸】
0–2 秒：第一幀立即開始舞蹈。肩膀重擊、手臂伸出、腳跟腳尖切換和快速換腳；鏡頭輕微推近，背景短暫出現 MOVE。
2–4 秒：交叉步、胸部局部控制、手臂橫向揮動、側向跨步；追蹤線跟隨手臂，BEAT 在一次明確重拍出現。
4–6 秒：自然完成半圈旋轉，接續短距離滑步與肩膀重擊；圓環跟著旋轉，腳步重踩時出現一次震波。
6–8 秒：大幅跨步、快速換腳與強力手臂重擊；GO 在人物後方放大，幾何框架短暫向外展開。
8–10 秒：最後一組快速腳步和手臂重擊；特效逐步加強，最後半秒在重拍上完成強力定格，背景只出現一次乾淨震波。

【音樂】
目標為約 125 BPM 的高能量電子嘻哈器樂，包含清晰鼓點、低音與 Hi-hat，不要人聲或對白。BPM 和卡點是音樂方向，不要求模型逐拍精準同步。

【限制】
全程單人、單一場景；保持自然人體結構、穩定角色外觀、連續舞步與完整腳部構圖。不要換裝、變臉、場景切換、隨機粒子、過度閃爍或混亂運鏡。優先確保人物、舞蹈和腳步清楚，再呈現特效。
~~~

### 英文對照提示詞

以下英文版是依上方中文提示詞翻譯整理的對照稿，不是平台官方英文模板。先用中文理解和修改，再視模型介面或個人習慣選用英文。

~~~text
Create a 10-second, 16:9 widescreen K-pop and hip-hop dance MV with crisp choreography, energetic instrumental hip-hop, and motion graphics that react to the dancer's movement.

Use the uploaded image only as a reference for the adult dancer's face, hairstyle, body proportions, cap, earrings, necklace, outfit, and shoes. The performer is one adult street dancer with a black high ponytail, black cap, black cropped top, black-and-white jacket, loose black cargo pants, a silver chain, and white sneakers. Keep the same appearance and outfit throughout.

Set the video in a bright, clean white dance studio with a softly reflective floor. Use a polished K-pop MV and fashion-editorial look. Keep the dancer as the visual focus. Use a stable frontal full-body camera, with only a gentle push-in or small lateral move. Keep both feet and shoes visible during footwork. Avoid sudden scene changes and large camera rotations.

The choreography combines K-pop performance and hip-hop: sharp shoulder hits, arm hits, heel-toe switches, quick foot changes, cross-steps, controlled torso isolations, lateral steps, and one short half-turn. Start dancing in the first second. Show clear weight shifts and connect each move smoothly while gradually building intensity.

Use the short words MOVE, BEAT, and GO with arm-tracking lines, circular impact rings, geometric splits, and beat pulses. When an arm swings, add one brief cyan trail along its direction. When a foot lands firmly, add a circular ripple from the landing point. When the dancer takes a wide step, expand a geometric frame without cropping the shoes. During the half-turn, rotate a ring briefly in the same direction. Show a short word and a pulse only on a clear beat. Keep all graphics behind or around the dancer; keep the face and feet unobstructed. If accurate text is unreliable, prioritize the dancer and composition.

0–2 seconds: Start dancing immediately with shoulder hits, an arm extension, heel-toe switches, and quick foot changes. Add a gentle push-in and a brief MOVE graphic.
2–4 seconds: Cross-step, torso isolation, a lateral arm swing, and a side step. Add an arm trail and show BEAT on one clear accent.
4–6 seconds: Complete a natural half-turn, then continue with short sliding steps and a shoulder hit. Let a ring follow the turn and add one ripple on a firm landing.
6–8 seconds: Use a wide step, quick foot changes, and a strong arm hit. Enlarge GO behind the dancer and briefly expand the geometric frame.
8–10 seconds: Finish with one short sequence of quick footwork and a strong arm hit. Build the graphics gradually, then hold a powerful final pose for the last half-second on a beat, with one clean ripple behind the dancer.

Target an instrumental electronic hip-hop track around 125 BPM, with clear drums, bass, and hi-hats, and no vocals or dialogue. Treat the BPM and beat sync as creative guidance, not frame-accurate timing.

Keep one performer and one location. Preserve natural anatomy, consistent appearance, continuous movement, and a full-body composition. Do not change the outfit, face, or scene. Avoid random particles, excessive flicker, and chaotic camera motion. Prioritize clear movement and visible footwork over extra effects.
~~~

### 提示詞 6：600 字內精簡版

~~~text
製作 10 秒、16:9 的 K-pop × Hip-hop 街舞 MV。以參考圖中的成年女孩為唯一主角，保持臉、黑色高馬尾、帽子、黑白街舞服和白鞋一致；白色攝影棚，正面全身鏡頭，腳步完整可見。

第一秒立即跳舞。0–2 秒肩膀重擊、手臂伸出、腳跟腳尖切換；2–4 秒交叉步、胸部控制、側向跨步；4–6 秒自然半圈旋轉和短滑步；6–8 秒大幅跨步、快速換腳；8–10 秒手臂重擊，最後半秒在重拍定格。

手臂揮出時出現短追蹤線，腳步重踩時出現圓形震波，旋轉時圓環跟著轉。MOVE、BEAT、GO 只在明確重拍出現，特效不遮住臉和雙腳。音樂以約 125 BPM 電子嘻哈器樂為目標，不要求逐拍精準同步。保持單人、單一場景、動作連續和自然人體比例。
~~~

## 生成後怎麼檢查？

提示詞寫得完整，不代表影片會完全照做。第一次生成後可以看三遍：先看整體節奏；第二遍靜音看動作和腳步；第三遍觀察重拍、動作和 MG 是否有關聯。把錯誤記下來，每次只先改一個主要問題。

### 提示詞生成前檢查表

- [ ] 角色外觀、髮型與服裝說明一致
- [ ] 每個時間段只安排少數主要動作
- [ ] 腳步期間有全身構圖要求
- [ ] 每項 MG 都有觸發動作或節拍
- [ ] 音樂速度是創作目標，沒有誇稱精準同步
- [ ] 沒有互相矛盾的鏡頭或場景要求
- [ ] 結尾動作與定格時間清楚

這是本文的實作檢查表，不是 Seedance 官方門檻。

### 影片 QA 評分表

每項 0–10 分，總分 70 分，用來比較自己不同版本，不是平台評分或客觀品質標準。

| 項目 | 檢查方式 |
| --- | --- |
| 人物一致性 | 臉、髮型、服裝與配件有沒有明顯變化 |
| 人體與舞蹈 | 手腳自然，重心轉移合理，動作沒有突然跳接 |
| 全身構圖 | 重要舞步時雙腳和鞋子完整可見 |
| 節奏 | 主要動作是否大致跟著音樂段落變化 |
| MG 關聯 | 追蹤線、文字和震波是否回應具體動作 |
| 運鏡 | 鏡頭不亂轉、不遮擋舞步、不過度震動 |
| 結尾 | 最後有清楚高潮和定格 |

### 提示詞 7：請 AI 分析生成結果

如果使用的平台能讀取影片，可以上傳生成結果並使用這段提示詞。若模型不能讀取音訊或逐格影片，需把無法確認的項目列出來；不要把幾張截圖的判讀說成已驗證動作流暢或音畫同步。

~~~text
我上傳了一支 10 秒的街舞＋MG 影片。請擔任 AI 影片導演與品質審查員，只根據實際可讀取的畫面和音訊分析，不要猜測看不到或聽不到的內容。

請檢查人物外觀、肢體與腳步、動作銜接、音樂拍點、MG 與舞者動作的關係、特效遮擋、運鏡和結尾高潮。請用時間軸表格列出具體秒數、觀察到的問題和影響。

最後只選出最值得先修改的三個問題，分別提供對應的中文提示詞修改句。不要重設整支影片或改變人物設定。若無法實際分析音訊或影片動態，請明確列出不能驗證的部分。
~~~

## 常見失敗時，先修改哪一句？

| 看到的問題 | 常見原因 | 優先修改方式 |
| --- | --- | --- |
| 舞者動作偏慢 | 只有「跟著節奏跳」，缺少明確腳步 | 指出快速換腳、腳跟腳尖切換和發生的時間段 |
| 手腳變形或動作跳接 | 一段中同時要求太多動作，旋轉也太複雜 | 減少動作數，先移除連續旋轉，再補清楚重心轉移 |
| 特效漂亮但沒有跟動作 | 只列出特效種類，沒有寫觸發條件 | 改成「手臂伸出時出現追蹤線；腳步落地時從落點出現震波」 |
| MG 遮住人物 | 沒有指定人物優先或效果位置 | 指定圖形放在人物後方，臉和雙腳保持清晰 |
| 畫面一直切換 | 同時要求推進、平移、旋轉與多景別 | 保留正面全身鏡頭，只加入一種輕微移動 |
| 人物外觀變化 | 參考圖用途不明，轉身與遮擋太多 | 說明圖片只參考角色外觀，減少大幅轉身與長時間遮擋 |
| 結尾沒有重點 | 最後兩秒安排太多事件 | 尾段只保留一個主要重拍、一個定格和一次震波 |
| 文字拼錯或變形 | 影片模型生成文字不穩定 | 先生成乾淨舞蹈畫面，再用剪輯軟體加入正確文字 |

### 提示詞 8：局部微調，不要整篇重寫

~~~text
請只協助微調上一版舞蹈 MV 提示詞中的一個問題。

問題：2–8 秒的腳步不夠快。
希望改善：加入清楚的快速換腳、腳跟腳尖切換與短距離滑步，讓雙腳保持可見。

必須保持不變：角色臉部與服裝、10 秒長度、16:9 比例、白色攝影棚、MG 配色和最後一秒高潮。

請先指出要替換的原提示詞段落，再提供新段落和整合後的完整版本。不要增加無關內容，也不要重設角色或場景。
~~~

## 進階：參考舞蹈影片或音樂

如果當前模型和帳號支援多模態參考，可以分別提供角色圖片、舞蹈參考影片和音訊。提示詞要說清楚每份素材只負責什麼：圖片鎖定外觀，影片參考節奏或動作風格，音訊提供音樂方向。不要讓參考影片的人物或場景覆蓋自己的角色設定。

~~~text
請製作一支 10 秒、16:9 的 K-pop 街舞＋MG 影片。

角色圖片：只參考人物外觀、髮型、服裝與配件。
舞蹈影片：只參考動作節奏、身體控制、腳步速度與動作銜接，不複製其中的人物、衣服或場景。
音訊：只作為音樂節奏與情緒參考；不保證每個舞步都會精準對拍。

場景使用白色攝影棚。舞者從第一秒開始表演，以正面全身構圖為主，完整呈現雙腳。動作包含肩膀重擊、手臂重擊、快速換腳、腳跟腳尖切換、短距離滑步與自然半圈旋轉。

手臂揮出時加短追蹤線，腳步重踩時加圓形震波，旋轉時讓幾何圓環短暫跟轉。MOVE、BEAT、GO 只在對應重拍出現，不能遮住臉和腳。最後半秒完成定格。
~~~

「角色圖片、舞蹈影片、音訊」是素材用途示意。實際引用標記和可上傳數量要以平台顯示為準；Seedance 2.0 與 2.5 的參考能力和限制並不完全相同。

## 進一步提高控制度：把舞蹈和 MG 分開做

一次生成可以快速試方向，但如果文字、震波、節奏和畫面位置都要精準，分段製作比較容易修改：

1. 先讓模型產生角色穩定、腳步清楚的純舞蹈影片。
2. 取得可用舞蹈版本後，標記重拍、手臂揮動和落腳時間。
3. 在剪輯或動態圖形工具加入文字、追蹤線、震波和畫面分割。
4. 檢查文字是否正確、特效有沒有蓋住臉和腳，再輸出 16:9 或另製 9:16 版本。

初學時可以先不加特效，確認人物和動作成立，再加入 MOVE、BEAT、GO，最後才試追蹤線和震波。這樣比較容易判斷哪個修改真正改善了結果。

## 今天可以做的三個練習

| 練習 | 內容 | 觀察重點 |
| --- | --- | --- |
| A：純舞蹈 | 單人、固定鏡頭、白色攝影棚，不加 MG | 人物一致、腳步完整、動作順序清楚 |
| B：動態文字 | 保留舞蹈，只加入 MOVE、BEAT、GO | 文字出現是否和重拍大致相關，是否遮擋人物 |
| C：完整舞蹈＋MG | 加入追蹤線、震波、幾何分割與結尾定格 | 每項效果是否有動作觸發條件 |

保留每次的提示詞、角色圖片、影片和 QA 分數。每次只改一項，例如先改腳步速度，再改 MG 同步，最後才調運鏡和結尾。

## 開始前記住五件事

- 先讓豆包幫你規劃分鏡，再把分鏡整理成影片提示詞。
- 先準備清楚的全身角色圖，影片期間仍要檢查人物是否穩定。
- 舞步要有先後順序與重心移動，不要只堆舞蹈名詞。
- MG 要有對應動作，並把人物和雙腳的可見度放在前面。
- 生成後逐項驗收；提示詞審查不能代替實際影片檢查。

這套流程的價值不在於提示詞越長越好，而是把角色、舞蹈、鏡頭、音樂與特效拆開，讓你知道生成失敗時先改哪一段。

## 常見問答 (FAQ)

### Q1：豆包可以直接選 Seedance 2.0 或 2.5 嗎？

要看所在地、帳號、方案與當下介面。官方曾說明 Seedance 2.0 和 2.5 陸續提供於豆包、即夢 AI 等入口，但不同入口的模型版本和功能可能不同；請以目前帳號實際顯示為準。

### Q2：10 秒、16:9 和 125 BPM 一定會被模型精準遵守嗎？

不一定。時長與比例要看模型和入口提供哪些選項；BPM 和時間軸則是創作指引，不等於逐格或逐拍控制。需要精確節奏時，生成後仍要檢查並在後製調整。

### Q3：角色三視圖能保證影片不變臉嗎？

不能。多視角圖片能補充角色外觀資訊，但結果仍受模型、參考圖品質、鏡頭角度和動作影響。請在生成後檢查臉部、髮型、服裝和配件。

### Q4：影片模型可以正確生成 MOVE、BEAT、GO 嗎？

文字可能出現拼寫或字形錯誤。若需要確保字詞正確、位置固定或精準卡點，建議先生成舞蹈，再用剪輯或動態圖形工具疊加文字。

### Q5：可以用任何歌曲或別人的舞蹈影片當參考嗎？

請先確認自己有使用音樂、影片和人物素材的權利，並遵守平台規則。想公開或商用時，優先使用已授權素材或自行創作的音訊與動作參考。

## 官方與原始參考資料

- [字節跳動 Seed：Seedance 2.0 正式發布](https://seed.bytedance.com/zh/blog/official-launch-of-seedance-2-0)
- [字節跳動 Seed：Seedance 2.5 正式發布](https://seed.bytedance.com/zh/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)
- [火山方舟：影片生成教學](https://docs.volcengine.com/docs/ark/video-generation-tutorial?lang=en)
- [火山方舟：Seedance 2.0 系列提示詞指南](https://docs.volcengine.com/docs/ark/seedance-2-0-prompt-guide?lang=zh&redirect=1)
- [火山方舟：Seedance 2.5 功能說明](https://docs.volcengine.com/docs/ark/seedance-2-5?lang=zh)
- [豆包官方網站](https://www.doubao.com/)
- [即夢 AI 官方網站](https://jimeng.jianying.com/)
