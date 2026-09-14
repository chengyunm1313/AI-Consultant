---
title: "【Google Flow 的 /orbit 到底是什麼？從 Veo 到 Omni Flash，一次搞懂 AI 影片的運鏡指令】"
cover: /images/cover173-1.png
toc: true
categories:
  - 生成式AI應用
tags:
  - 影音行銷
  - AI工具
  - Gemini
date: 2026-09-14 18:57:08
subtitle: 從攝影快捷詞到時間軸腳本，學會用攝影語言描述 AI 影片運鏡。
description: Google Flow 的 /orbit 是官方指令嗎？本文拆解 Veo 與 Gemini Omni Flash 的運鏡提示詞，從攝影快捷寫法、五個控制維度到時間軸腳本，帶你把想法寫成可執行的 AI 影片 Prompt。
---

最近我看到一個有趣的 Google Flow 用法：生成影片時，只輸入 `/orbit`，畫面就像替主體加上環繞運鏡。其他人也會整理 `/dollyin`、`/tracking`、`/lowangle`、`/macro`、`/goldenhour`、`/ugcunboxing` 等斜線寫法，看起來很像產品裡藏了一套秘密指令。

研究後我更想弄清楚的，不是還有幾百個指令，而是這些詞背後共通的攝影語言。理解鏡頭怎麼移動、如何構圖、光線如何呈現，才能把這些概念帶到 Veo、Gemini Omni Flash，或其他能以自然語言生成影片的模型。

## `/orbit` 是 Google Flow 的官方指令嗎？

目前查閱 Google Flow 的[官方影片建立說明](https://support.google.com/flow/answer/16353334?hl=en)，流程是用提示詞描述場景，再選擇模型、比例與片長；我沒有在這份說明中找到 `/orbit` 或名為 `Google Flow Slash Command API` 的公開指令定義。因此，較穩妥的理解是：這些斜線詞是創作者整理的 **Prompt Shorthand（提示詞快捷寫法）**，不是已確認的官方 API。

這不代表輸入 `/orbit` 一定沒有作用，而是不能假設斜線會觸發一個保證存在的程式指令。實際生成可能受 `orbit` 這個詞、上下文與各模型的語意理解影響；想讓需求更清楚，可以把它改寫成完整句子：

```text
The camera smoothly orbits around the subject.
```

`orbit` 本身就是常見的攝影運鏡概念。類似地，`dolly in` 是攝影機向主體推進，`tracking shot` 是跟著人物或物件移動，`low-angle shot` 是低角度拍攝，`macro shot` 是微距特寫，而 `golden hour` 描述的是接近日出或日落的暖色光線。

## 真正值得記住的是可跨模型使用的攝影語言

如果只記 `/orbit`，介面改版或另一個模型不認得斜線寫法時，這個捷徑就可能失效。若記住 **Orbit Shot＝環繞運鏡**，你就能再補上方向、幅度、速度與主體位置，把同一個想法展開成不同細節層級的提示詞。

在 Google Flow 裡，影片模型與支援功能會因選用的模型而不同；官方也建議生成前確認目前的模型與設定。[Gemini Omni Flash 官方提示指南](https://ai.google.dev/gemini-api/docs/omni)則明確提到場景、鏡頭運動、光線與情緒等描述方式。這些資料支持「攝影語言可以用自然語言表達」的做法，但不代表所有模型都會以相同方式遵循提示詞。

## 把 AI 影片提示詞拆成五個層級

以 Orbit 為例，可以從一個簡短概念逐步增加控制資訊：

### Level 1：先給運鏡名稱

```text
/orbit
```

這是最精簡的快捷寫法，只表達「希望鏡頭環繞主體」。

### Level 2：回到標準攝影語言

```text
Orbit around the subject.
```

拿掉斜線後，仍然保留同一個運鏡概念。

### Level 3：加入方向與速度

```text
The camera slowly orbits clockwise around the subject.
```

現在提示詞多了慢速與順時針兩個條件。

### Level 4：補上角度、距離與主體位置

```text
The camera performs a slow 180-degree clockwise orbit around the subject, maintaining a constant distance and keeping the subject centered.
```

除了環繞方向與速度，也交代移動幅度、攝影機距離和主體在畫面中的位置。

### Level 5：寫成一段有時間節奏的導演腳本

```text
Single continuous shot. No cuts.
[0-2s] Static medium shot.
[2-7s] Slow 180-degree clockwise orbit around the subject. Maintain a constant camera distance and keep the subject centered.
[7-10s] Lower the camera and settle into a low-angle hero shot.
Warm golden-hour rim lighting. Keep the subject visually consistent. No dialogue.
```

到這一層，提示詞已經交代鏡頭何時開始移動、移動多久、最後停在哪裡。時間標記可以幫模型理解節奏與順序，但它仍是生成提示，不是逐格精準的剪輯時間軸；實際結果要看模型、版本與生成設定。

## 一個運鏡有五個可調整的控制維度

`/orbit` 只說出運鏡名稱。若想減少生成結果像抽卡，可以把它拆成五個方向來描述：

| 控制維度 | 可以描述的內容 |
| --- | --- |
| 方向 | 順時針、逆時針、由左向右、由右向左 |
| 幅度 | 45 度、90 度、180 度或完整 360 度 |
| 速度 | 非常慢、緩慢、快速或急速 |
| 距離 | 貼近主體、遠距環繞、維持固定距離 |
| 結束畫面 | 特寫、低角度英雄鏡頭、主體背後或正面 |

例如，`A slow 180-degree clockwise orbit, maintaining a constant distance, ending in a low-angle close-up hero shot.` 就比單獨輸入 `/orbit` 多交代了可供模型參考的畫面條件。提示詞不一定要很長，重點是把真正重要的控制維度說清楚。

## Veo 的攝影積木與 Omni Flash 的時間軸寫法

教學時，我會用「攝影積木」介紹 Veo：主體、動作、景別、運鏡、光線與聲音，再依需要組合。到了 Gemini Omni Flash，我會多練習用時間軸描述一段連續鏡頭，明確寫出每一段的畫面變化。

這是方便理解提示詞的教學方式，不代表 Veo 只能用積木、Omni Flash 才能用時間碼。Gemini Omni Flash 的官方指南說明，模型預設可能嘗試生成多個鏡頭；若需要單一連續畫面，可以寫明 `In a single continuous shot` 或 `No scene cuts`，並以時間標記交代事件發生順序。不同模型與 Flow 功能的支援狀況仍可能不同，使用前應確認當下選取的模型與設定。

以 10 秒商品廣告為例，可以這樣寫：

```text
Single continuous shot. No cuts.
[0-3s] Close-up product shot. A bottle sits on a reflective black surface.
[3-7s] The camera slowly orbits clockwise around the bottle while gently pushing in.
[7-10s] The camera settles into a low-angle hero shot.
Warm golden-hour rim lighting. Keep the product label consistent. No dialogue.
```

這段提示詞不只說「環繞」，也說明何時開始、同時搭配什麼動作、最後停在哪個景別。若你想先把多個鏡頭的順序規劃好，也可以延伸閱讀[用 AI 快速生成短影音？九宮格分鏡技巧解決人物變形](/posts/ai-video-storyboard-9-square-grid/)。

## 把 Slash Commands 當成攝影積木，而不是終點

這些斜線寫法仍然很好用，尤其適合初學者快速記住攝影概念。可以先整理成自己的攝影積木：

- **運鏡：** `/orbit`、`/dollyin`、`/dollyout`、`/tracking`、`/handheld`、`/fpv`
- **景別與角度：** `/closeup`、`/macro`、`/lowangle`、`/highangle`、`/pov`
- **光線：** `/goldenhour`、`/backlight`、`/rimlight`、`/neonlight`
- **商品畫面：** `/productreveal`、`/productspin`、`/ugcunboxing`
- **特效：** `/smokereveal`、`/liquid`、`/disintegrate`

新手可以先用 `/orbit`，再加上 `/lowangle` 或 `/goldenhour`。需要更明確的控制時，就把積木展開成自然語言：

```text
Single continuous cinematic shot. The camera slowly orbits 180 degrees clockwise around the subject while maintaining a constant distance. Use a low camera angle with warm golden-hour backlighting. Keep the subject centered and visually consistent. No cuts.
```

斜線詞是入口；一旦寫清楚畫面條件，這些攝影概念便不綁定某個介面或模型。

## Prompt 正在變成一種導演介面

以前我們可能只寫「一個男人走在東京街頭，電影感」，再看看模型會給什麼。現在可以把想法拆成鏡頭腳本：

- 0–2 秒先保持固定中景。
- 2–7 秒開始順時針環繞 180 度，人物留在畫面中央。
- 7 秒後降低機位，停在低角度英雄鏡頭。
- 整段不要切鏡，並維持人物的外觀與服裝。

這不只是描述「我要什麼畫面」，而是把運鏡、景別、速度、方向、距離、光線、動作和時間順序，組合成模型看得懂的執行腳本。當你學會的是這套攝影語言，換 Veo、Gemini Omni Flash 或其他自然語言影片模型時，就有一組可以重新測試與調整的基礎。

## 官方文件參考

- [Google Flow：建立影片](https://support.google.com/flow/answer/16353334?hl=en)
- [Google Flow：模型與支援功能](https://support.google.com/flow/answer/16352836?hl=en)
- [Google AI for Developers：Gemini Omni Flash 影片生成與提示指南](https://ai.google.dev/gemini-api/docs/omni)

## 常見問答 (FAQ)

### Q1：`/orbit` 是 Google Flow 的官方指令嗎？

目前查閱的 Google Flow 官方說明沒有把 `/orbit` 定義為公開指令或 Slash Command API。把它當成創作者的提示詞快捷寫法較穩妥，若需要明確表達環繞鏡頭，可直接寫 `The camera orbits around the subject.`。

### Q2：`/orbit` 這種寫法可以直接用在 Gemini Omni Flash 嗎？

Orbit 的運鏡概念可以用在 Gemini Omni Flash，但不要假設斜線語法一定通用。可改寫成自然語言，例如 `The camera slowly orbits clockwise around the subject.`，再依輸出結果調整方向、速度與幅度。

### Q3：怎麼讓 AI 影片的運鏡方向和幅度更明確？

在提示詞中直接寫出順時針或逆時針、移動 90 度或 180 度，以及運鏡速度、與主體的距離和結束景別。條件越具體，模型越能以這些資訊作為生成參考，但結果仍可能因模型與設定而不同。

### Q4：AI 影片可以依照秒數執行運鏡嗎？

可以用 `[0-3s]`、`[3-7s]` 這類時間標記描述事件順序與節奏。Gemini Omni Flash 官方提示指南有時間碼範例；時間標記仍屬自然語言提示，不保證逐秒或逐格精準執行。

### Q5：一套運鏡快捷詞能套用在所有 AI 影片模型嗎？

運鏡、景別與光線等攝影概念可以跨模型重用，但各模型的功能、版本與語意遵循程度不同。保留攝影概念，再把快捷詞展開成清楚的自然語言，並依實際輸出測試調整。
