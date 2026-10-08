---
title: '【Adobe 全家桶替代品來了？7 套開源創作工具開始為 AI Agent 設計】'
cover: /images/cover207.png
toc: true
categories:
  - AI工具
tags:
  - AI Agent
  - AI工具
  - AI自動化
date: 2026-10-08 01:10:01
subtitle: 從 Crafting Apps 七套 Rust 工具，看 Agent-native 創作軟體的可能性
description: ArtCraft Crafting Apps 公開七套 Rust 創作工具，涵蓋修圖、剪輯、特效與排版，並把 CLI、JSON Control Channel、MCP 納入操作架構。本文整理 FilmCraft、EffectCraft、PhotoCraft 的亮點、限制與授權差異。
---

最近看到一個有點狂的專案。

ArtCraft 團隊公開了一系列叫做 **Crafting Apps** 的創作工具。它不是只做一套 Photoshop 替代品，而是把圖片、向量、影片、RAW、PDF、視覺特效和排版出版都放進同一個產品方向。

看起來像是要把「Adobe 全家桶」重新做一次。

但我研究後覺得，更值得注意的不是免費，而是這些工具從架構上就讓 **CLI、JSON Control Channel 與 MCP** 成為操作入口。換句話說，AI Agent 不只提供剪輯建議，還有機會直接呼叫創作軟體裡的功能。

以下內容以 **2026 年 10 月 8 日**查閱的官方專案頁與版本資訊為準。這些專案更新很快，功能、版本與成熟度都可能變動。

## ArtCraft Crafting Apps 有哪七套工具？

官方目前列出七個獨立的創作工具。表中的 Adobe 名稱是工作流程上的類比，並不代表功能相同、檔案完全相容，或由 Adobe 背書。

| 工具 | 大致用途 | 工作流程類比 |
| --- | --- | --- |
| [PhotoCraft](https://github.com/storytold/photocraft) | 圖層、遮色片、修圖與 PSD／PSB | Photoshop |
| [VectorCraft](https://github.com/storytold/vectorcraft) | 向量插畫與繪圖 | Illustrator |
| [FilmCraft](https://github.com/storytold/filmcraft) | 影片剪輯、調色與音訊 | Premiere Pro |
| [LightCraft](https://github.com/storytold/lightcraft) | 照片管理與 RAW 開發 | Lightroom |
| [PrintCraft](https://github.com/storytold/printcraft) | PDF 閱讀、整理與保護 | Acrobat |
| [EffectCraft](https://github.com/storytold/effectcraft) | Motion Graphics 與視覺特效 | After Effects |
| [DesignCraft](https://github.com/storytold/designcraft) | 頁面排版與出版 | InDesign |

這些不是把網頁包成 Electron 桌面程式的產品。官方將它們描述為以 Rust 從頭打造的原生創作工具，各工具 repo 也公開程式碼。支援平台與瀏覽器版本則要看個別工具：例如 PhotoCraft 與 EffectCraft 已有 WebAssembly／瀏覽器方向，FilmCraft 的引擎可編譯到 WebAssembly，但官方目前仍把瀏覽器前端列為下一步。

所以比較準確的說法是：這是一組正在發展中的原生創作軟體，不是已經完成、可以整批取代 Adobe 的產品套裝。

## 為什麼我覺得 Agent-ready 比「免費」更有意思？

傳統創作軟體的主要操作方式，是人用滑鼠和鍵盤操作 GUI：

```text
人 → GUI → 創作軟體
```

Crafting Apps 想加入另一條路：

```text
AI Agent → CLI／JSON Control Channel／MCP → 創作軟體
```

以 FilmCraft 為例，官方說明 GUI、CLI、JSON 控制通道和 MCP Server 會呼叫同一組命令。也就是說，剪輯、修剪、調色、混音和輸出等操作，不只存在於按鈕後面，也能用結構化方式觸發。官方 repo 也附有 [.mcp.json 設定](https://github.com/storytold/filmcraft/blob/main/.mcp.json)；CLI 文件中的 MCP 啟動方式則是：

```bash
filmcraft-cli mcp
```

這表示 Agent 有機會直接操作軟體提供的命令。它不代表 AI 自動理解素材、每次都能剪出好作品，也不代表整套流程已經穩定到可以無人審核。素材規劃、操作權限、結果檢查和人工 Review 仍然重要。

我之前也寫過 [Agent-native Website 的概念](/posts/agent-native-website/)；這次有趣的地方，是類似的想法開始進到專業桌面創作軟體。

## 目前最值得先看的是 FilmCraft

FilmCraft 是目前較容易直接開始嘗試的一套。官方 [v0.2.1 release](https://github.com/storytold/filmcraft/releases/tag/v0.2.1) 提供 macOS Universal DMG，也有 Windows 與 Linux 的發行檔。

它已經具備多軌 Timeline、Source／Program Monitor、剪輯與 Trim、Keyframe、色彩調整、音訊 Mixer、字幕和轉場等專業剪輯架構；輸出可用 H.264 與 ProRes。這些功能讓它看起來不只是簡單的影片剪輯器。

但有個容易誤讀的地方：依官方目前的格式表，**HEVC 可解碼，尚不能輸出**；H.264 是可輸出格式，ProRes 也支援輸出。官方說明還列出大型素材效能、外掛與不同平台實測等限制，因此不宜把它的格式能力直接寫成「H.264／HEVC／ProRes 都能輸出」。

官方目前也用兩種不同指標描述成熟度：功能清單約完成 87%，但對「能否取代 Premiere 用於真實專案」的自我估計約為 50–60%。這是開發團隊的估計，不是獨立測試分數；不過它清楚提醒我們，功能項目存在，不等於工作流程已經全面成熟。

我最想嘗試的工作流會是：

```text
Codex
  ↓
MCP
  ↓
FilmCraft
  ↓
匯入素材、整理時間軸、調色與字幕
  ↓
人 Review 後輸出
```

這是我想驗證的方向，不是我已經跑通的完整自動剪輯流程。

## EffectCraft 讓 Motion Graphics 也能程式化

如果 FilmCraft 對應影片剪輯，EffectCraft 就是往 After Effects 的 Motion Graphics 與合成工作流程走。

官方目前列出 Composition、Layer、Keyframe、Graph Editor、Expression、3D Camera、Light 和 Render Queue 等能力，並表示已有 **306 種效果**。這個數字會隨開發改變，實際功能與成熟度仍要看最新版本。

EffectCraft 同樣有 CLI、JSON 控制通道與 MCP。官方文件提到可以在 Headless 模式操作專案、設定屬性並進行 Render。換句話說，未來確實有機會把這類工作串成：

```text
設計規範＋Motion Skill＋AI Agent＋EffectCraft
```

再由人確認結果。

不過官方也明確說它仍然很年輕，行為不一定與 After Effects 相同，.aep／.aepx 專案和 After Effects 外掛目前也不能直接沿用。因此我會把它當成值得追蹤的 Agent-native Motion Graphics 實驗，而不是現成的 After Effects 替代品。

## PhotoCraft 的 PSD 數字要怎麼看？

PhotoCraft 對標 Photoshop，已經涵蓋圖層、遮色片、調整圖層、Smart Object、筆刷、色彩管理，以及 PSD／PSB 開啟與儲存。

關於 PSD 相容測試，要分清楚「重新存檔後渲染一致」與「檔案逐位元相同」。[PhotoCraft 官方 repo](https://github.com/storytold/photocraft) 目前列出：PSD 文件重新開啟與儲存後，渲染結果在 psd-tools 測試集的 307／309 份、另一組混合測試集的 169／170 份相符。這些數字是官方特定測試資料集的結果，**不等於整份 PSD 檔案都能 byte-for-byte 原樣往返**。官方把逐位元相同的說法限定在較底層的 PSD 解析／寫入 crate 和可解析的測試檔案。

這類數據很容易被一句「PSD 完全相容」過度簡化。正式工作前，仍要用自己的 PSD、字型、效果和色彩設定實際檢查。

如果未來這些操作介面與批次處理能力成熟，我會想到一種「AI 社群圖卡工廠」：讀活動資料、替換標題和照片、套用尺寸，再輸出多個平台版本。這是從目前 Agent 操作架構延伸出的想像，還不是官方承諾的現成自動化功能。

## 免費、開源與授權不能混為一談

不同 repo 的授權條款要逐一查看。例如 [PhotoCraft](https://github.com/storytold/photocraft) 與 [EffectCraft](https://github.com/storytold/effectcraft) 的程式碼採 MIT 或 Apache-2.0 雙授權；但 [ArtCraft 主專案](https://github.com/storytold/artcraft/blob/main/LICENSE.md) 是另一個獨立產品，其 repo 目前標示為 **Fair Source**，並在授權說明中列出商業銷售與開發競品等限制。

因此，不能只因它們都屬於 ArtCraft 生態，就把整個生態的授權概括成同一種「毫無限制的開源」。若你要把程式碼納入商業產品、重新散布或建立服務，應直接查閱對應 repo 的 license、NOTICE 與品牌使用條款。

## 我看到的是 Agent-native 創作軟體的雛形

這系列工具最值得觀察的方向，是軟體的使用者不再只假設為人類。除了按鈕、選單、滑鼠與快捷鍵，產品也開始提供 CLI、MCP、JSON 控制介面、可讀的專案格式與 Headless 執行方式。

我不會現在就把 Adobe 刪掉。FilmCraft、EffectCraft 和 PhotoCraft 都還在快速發展，與成熟工作流程之間仍有差距。但它們帶來一個值得問的問題：

> 我們挑選創作軟體時，除了問「人用起來順不順」，是不是也該問「AI Agent 能不能安全、穩定地操作」？

我最想先驗證的，還是 **Codex → MCP → FilmCraft → 剪出一支影片**。等這種流程跑順，創作軟體的設計方式可能真的會改變。

想釐清 CLI、Skill 和 MCP 的分工，也可以接著讀這篇：[AI 工具名詞全解析：一次搞懂 MCP、Skill 與 CLI](/posts/ai-agent-tools-mcp-skill-cli/)。

## 常見問答 (FAQ)

### Q1：ArtCraft Crafting Apps 現在可以完整取代 Adobe 嗎？

目前不適合這樣期待。FilmCraft、PhotoCraft 和 EffectCraft 的官方頁面都提到仍有成熟度或相容性限制；適合先下載試用、觀察工作流程，不建議直接把它們當成已完成的專業替代品。

### Q2：Codex 可以透過 MCP 操作 FilmCraft 嗎？

FilmCraft 官方提供 MCP Server，repo 也附有 MCP 設定範例；具體仍需安裝相容版本、設定本機 CLI，並依官方文件連接。MCP 提供的是操作入口，不會保證 Agent 自動做出符合創作意圖的結果。

### Q3：FilmCraft 目前能輸出 HEVC 嗎？

依查閱時的官方格式表，HEVC 支援解碼，尚未支援輸出；H.264 和 ProRes 則列有輸出支援。版本更新可能改變這項狀態，使用前應再查看最新 release 與格式文件。

### Q4：PhotoCraft 的 PSD 往返測試代表檔案完全相容嗎？

不代表。官方目前列出的是測試集中的渲染結果，以及較底層解析／寫入元件的 byte-for-byte 測試；兩者不是「任意 PSD 都能與 Photoshop 完全互換」的保證。

### Q5：Crafting Apps 和 ArtCraft 主專案使用同一種授權嗎？

不一定。個別創作工具與 ArtCraft 主專案是不同 repo，必須分別查看 license 和相關聲明；例如主專案目前使用 Fair Source 授權說明，不應直接套用 PhotoCraft 或 EffectCraft 的授權印象。

---
