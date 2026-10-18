---
title: "Codex × Concat 實測：打造 AI 短影音自動剪輯工作流"
cover: /images/cover226.png
cover_position: 75% center
toc: true
categories:
  - 生成式AI應用
tags:
  - Codex
  - MCP
  - 影音行銷
date: 2026-10-18 16:22:47
subtitle: 從 MCP Bridge、30 秒招生短片，到可重複執行的剪輯 Skill
description: 以 Concat 0.2.7 的本機實測，示範 Codex 如何透過自建 MCP Bridge 操作剪輯軟體，完成 30 秒短影音、封裝 Skill，並整理時間軸、匯出與驗收限制。
---

以前要做一支短影音，得自己找素材、排時間軸、剪接、上字幕、配樂，再匯出影片。AI 即使幫忙寫好文案，接下來仍要打開剪輯軟體，一段一段手動調整。

最近我改用開源剪輯軟體 Concat 做了一次實驗：讓 Codex 透過本機 MCP Bridge 呼叫 Concat 的 API，先輸出短測試片，再完成一支 30 秒招生短影音。接著，我把反覆驗證過的操作方式整理成專案內的 concat-video-editor Skill，讓剪輯流程可以再次使用。

這次經驗最有意思的地方，不是「講一句話就能剪出完美影片」，而是把一套剪輯流程拆成 Codex 能執行、檢查和重複操作的步驟。

> 本文記錄的是 2026 年 10 月 18 日，以 Concat 0.2.7 進行的本機實測。Concat 仍在持續開發，功能與 API 可能更新。官方 MCP 文件當日仍標示內建 MCP 尚未發布；同日的 [Issue #337](https://github.com/jub0t/Concat/issues/337) 則宣布官方開始投入內建 MCP 傳輸的開發。若要照本文操作，請先查看官方最新版本與文件。

## Concat、MCP Bridge 和 Skill 各自負責什麼？

Concat 是一套本機影片剪輯軟體，提供多軌時間軸、動態文字、配樂等剪輯能力，也有可供程式呼叫的 JSON-RPC API。這次實測使用的是 Concat 0.2.7。

串接時有三個容易混淆的部分：

| 元件 | 工作 | 這次實作 |
| --- | --- | --- |
| Concat API | 讓外部程式呼叫剪輯功能 | 使用 Concat 提供的本機 JSON-RPC API |
| MCP Bridge | 把 AI 工具的 MCP 呼叫轉成 Concat API 指令 | 自行建立的本機 Python Bridge |
| Skill | 告訴 Codex 如何依照 SOP 規劃剪輯、操作和驗收 | 專案內的 concat-video-editor Skill |

可把整體流程想成：

~~~text
剪輯需求 → Codex → concat-video-editor Skill
                         ↓
                  MCP Bridge
                         ↓
                Concat JSON-RPC API
                         ↓
             時間軸、影片與剪輯專案
                         ↓
                 輸出與驗收
~~~

Bridge 解決「怎麼連上工具」；Skill 解決「連上之後怎麼按照規則完成工作」。只有 Skill、沒有可用的 MCP 連線，Codex 就不能呼叫 Concat；只有 Bridge、沒有剪輯 SOP，也不代表每次操作都會排出正確時間軸。

### 先看清楚 Concat 的 MCP 狀態

這篇的實測版本是 0.2.7。官方開發者文件在 2026 年 10 月 18 日標示：Concat 的 API 與 JSON-RPC 傳輸已存在，但正式隨產品發布的 MCP Server 尚未到位；官方提供的當下作法，是以一個 MCP Server 包裝 JSON-RPC socket。官方同日也在 Issue #337 宣布開始開發內建的 MCP 傳輸。因此，本文的 Bridge 是我當時實際建立與測試的方案，不能直接推論為目前所有版本都需要自建 Bridge。

## 建立本機 Bridge：先連線，再操作剪輯

這次使用 Apple Silicon MacBook Pro M2。Bridge 以 Python FastMCP 建立，共提供 22 個 MCP 工具，涵蓋專案管理、媒體匯入、片段編輯、文字、預覽影格、匯出及工作狀態查詢。這是我自行實作的工具數量，不代表 Concat 官方 MCP Server 的工具清單。

Concat Remote API 在本機監聽，例如 127.0.0.1:7420，並使用 Token 驗證。我的 Bridge 將 Token 放在本機環境檔，限制檔案權限，不把憑證寫進程式碼或公開文章。實際設定時也應把專案與輸出限制在指定工作資料夾，並先用全新的測試專案驗證。

在修改 Codex 的 MCP 設定前，我先備份原設定，再請 Codex 依實際位置填入 Bridge 執行檔與程式路徑。這次的 Bridge 另外加入了 macOS 自動啟動：連線被拒絕時，嘗試執行 /usr/bin/open -g -b app.concat.editor，最多等 15 秒讓 Remote API 就緒。這是我自行加入的 Bridge 功能，不是每一套串接都會自動啟動 Concat；一般情況仍要先開啟軟體。

Codex 的 MCP 設定會指向本機 Python 執行環境與 Bridge 程式，概念如下；路徑要換成自己的實際位置：

~~~toml
[mcp_servers.concat]
command = "/你的工作目錄/.venv/bin/python"
args = ["-u", "/你的工作目錄/concat_mcp.py"]
startup_timeout_sec = 20
tool_timeout_sec = 90
~~~

註冊後重新載入 MCP，再先做唯讀連線檢查：

~~~text
請呼叫 concat_version，回報 Concat 版本、API 版本、
apiCompatible、可用能力與目前 MCP 工具。
不要建立、修改或刪除任何專案。
~~~

我當時讀到的結果是 Concat 0.2.7、API 0.2、apiCompatible: true，能力包含 events 與 json-rpc。這只表示 Bridge 能連上相容的 API，還沒有證明影片可以順利匯出；因此下一步應用新測試專案完成端到端驗證。

### 先輸出一支 2.5 秒測試片

我先使用簡單測試影片與繁體中文標題「Codex 連線測試」，輸出約 2.5 秒的 H.264 MP4。測試同時檢查：

- 匯出工作是否收到 export.done。
- 解析度、影格率、片長是否符合預期。
- 影片與音訊能否完整解碼。
- 指定時間點的預覽影格是否正確。
- Concat 原生專案能否儲存與重新開啟。
- 原始測試素材是否保持不變。

匯出工具回傳「已啟動」不等於檔案已完成。Concat 的匯出工作是非同步的，必須追蹤 job 並等待完成事件；若連線在等待期間中斷，也先確認舊工作與輸出狀態，再決定是否重跑，避免重複輸出。

### 再完成 30 秒招生短影音

小測試通過後，我才交給 Codex 三段素材與一段已授權的配樂，製作「AI 新時代」招生短影音。需求是：

- 9:16 直式，輸出 1080 × 1920。
- 整理操作畫面精華，加入大字文案與簡單動態文字。
- 不加旁白，搭配背景音樂。
- 片尾安排課程名稱與「立即洽詢課程」CTA。
- 保留原始素材和 Concat 專案，輸出新版本，不上傳、不發布。

最後輸出 AI新時代-30秒招生短影音-v02.mp4，並檢查片長、影像與音訊。這次成果證明的是：在這批素材與這套工作流程下，Codex 能透過 Concat 完成一支 30 秒影片；它不能代表任何素材、長度或畫幅都會有同樣結果。

## 把成功流程封裝成 concat-video-editor Skill

第一次剪成功後，我把如何讀取素材、挑選片段、安排軌道、加文字和配樂、等待匯出、檢查結果等操作，整理成專案內的 concat-video-editor Skill。它保留在專案裡，不修改全域 Skill，也不包含 MCP Bridge、Python 虛擬環境或 Token。使用 Skill 前，Bridge 必須已經能正常連線。

固定規格的影片可以再寫成 manifest.json，例如設定畫幅、片長、幀率、片尾長度、文字與素材路徑：

~~~json
{
  "ratio": "9:16",
  "duration": 30,
  "fps": 30,
  "cta_duration": 5,
  "title": "AI 新時代",
  "cta": "立即洽詢課程",
  "sources": [
    {
      "path": "/完整路徑/A.mp4",
      "headline": "把 AI 變成你的工作助力"
    },
    {
      "path": "/完整路徑/B.mp4",
      "headline": "課堂現場直接動手實作"
    }
  ]
}
~~~

若沒有指定來源入點，這次的腳本會依素材順序分配片長並擷取中央區域；也能為素材指定 source_start 和 duration。但設定時間碼不等於 AI 已理解影片內容。若要挑出講師最精彩的一句話或最有感染力的畫面，仍要另外進行語音、影格或語意分析。

使用者不一定要自己撰寫 JSON。可以先請 Codex 根據需求整理 manifest，再用 --plan-only 預覽剪輯計畫，確認素材、時間與輸出規格後才執行。正式操作要在正確專案目錄進行，並避免覆蓋來源影片與既有版本。

為了保留可回復的成果，這次 Skill 也讓每次輸出使用遞增版本，例如 v001、v002、v003，不覆蓋先前影片；整合測試還比對舊版本的雜湊，確認它沒有被重跑流程改寫。

## 四輪整合測試與實際遇到的問題

為了確認 Skill 不只對單一招生影片有效，我另外製作了三種解析度與影格率的合成測試影片，以及一段 WAV 配樂：

- 橫式 960 × 540、30 fps。
- 直式 540 × 960、25 fps。
- 方形 720 × 720、24 fps。
- 30 秒 WAV 音樂。

四輪測試各輸出 30 秒、30 fps、900 影格的影片，涵蓋建立專案、匯入素材、多軌剪輯、文字與 CTA、配樂混音、H.264／AAC 匯出、影格與音訊檢查，以及儲存、重開、修改、還原專案。測試也比對來源素材雜湊，確認原檔沒有變動，並檢查新版本不會覆蓋舊檔。

機器驗收全數通過，Codex 也檢視輸出影片的關鍵影格與文字效果。不過，完整播放、人耳聽感與 GUI 操作體驗仍需要人工檢查。規格檢查通過，不等於影片節奏、文案與音樂一定適合觀眾。

| 遇到的狀況 | 原因與修正方式 |
| --- | --- |
| 片段位置沒有落在預期時間 | 不同欄位要用對應的 API 命令。這次以 trimClip、moveClips 處理裁切與移動，操作後重新讀取時間軸確認位置。 |
| 標題被排到影片後面 | 同一軌道的片段可能互相推移。影片、標題、補充文字、品牌字樣與 CTA 視需要分軌，新增後再檢查時間軸。 |
| 時間軸有文字，輸出畫面卻看不到 | 文字本身的垂直位移和動畫位移疊加，可能把文字推到畫面外。要從實際輸出的 MP4 擷取影格確認。 |
| 裁切後片段短到不合理 | 裁切順序受相鄰片段影響。先移到沒有相鄰片段干擾的位置裁切，確認來源入點與片長後再移回時間軸。 |
| 有 AAC 音軌但聽起來太小聲 | 有音訊軌不代表混音合適。除了檢查峰值與訊號，也要實際聆聽人聲和配樂的平衡。 |

這些修正最後都寫回 Skill，讓下一輪可以重用檢查步驟，而不是只記得「上次成功了」。

## 這套工作流目前做得到與做不到的事

### MCP 操作不等於語意剪輯

腳本可以照固定規則安排素材，也能透過 MCP 呼叫剪輯功能；要讓 AI 真正理解人物說了什麼、哪個鏡頭最有感染力，再依敘事挑選片段，還需要額外的轉錄或影像分析流程。不能把依序平均分配片長說成 AI 已完成精彩片段判斷。

### 本機 API 不會讓 Codex Cloud 直接連到你的 Mac

127.0.0.1 指的是目前執行程式的那台電腦。Codex Cloud 裡的 127.0.0.1 是雲端執行環境，不是使用者的 Mac。本文這套 Bridge 因此以本機 Codex App 或 CLI 為使用情境。

### GUI 正在開啟的專案有使用限制

在 0.2.7 實測中，Remote API 不能同時操作 GUI 正在持有的同一個專案。工作時要讓 MCP 操作未被 GUI 開啟的專案，完成後儲存、關閉，再由 GUI 重新打開檢查。官方 [Issue #337](https://github.com/jub0t/Concat/issues/337) 正在討論即時操作開啟中專案與 MCP 傳輸；此項限制應以實際使用的 Concat 版本為準。

### 語音、字幕功能要看介面和 Bridge 有沒有串接

Concat GUI 有文字轉語音與自動字幕功能，但我這次的 Bridge 沒有把這些功能包裝成 MCP 工具。測試完成的是文字標題、動態大字與 CTA；若要自動產生中文旁白或逐字字幕，還需要額外整合 TTS 或語音辨識，不能只因 GUI 有功能就宣稱 Bridge 已經支援。

若只是想先試 Concat 內建中文旁白，可以在 GUI 的語音設定下載 Kokoro compact 模型；官方教學列出的檔案大小約 132 MB。這是軟體介面裡的功能，和這次 MCP Bridge 有沒有提供 TTS 工具是兩回事。

### 三種畫幅測試不代表長片或 4K 保證可用

這次測過 9:16、16:9、1:1，仍要針對每種畫幅重新檢查人物位置、文字換行與安全區。短影音成功也不代表一小時影片或 4K 專案有相同速度；素材數量、編碼、特效、記憶體與長度都會影響結果。初次練習可從 15～30 秒、1080p 開始。

費用也要拆開看：Concat 本身是免費開源軟體；Codex 的模型使用則取決於方案或 API 計費，電腦運算與儲存空間、外部 TTS 或音樂服務也可能有成本。

## 新手可以照五個階段練習

1. **先會用 Concat**：匯入影片、放到時間軸、加入標題並輸出 MP4。
2. **再連上 Codex**：建立 Bridge、設定 Token，唯讀呼叫版本資訊確認 API 相容。
3. **完成最小測試**：用新專案輸出 2～3 秒影片，檢查影片、音訊和匯出完成事件。
4. **試做 30 秒短片**：加入多段素材、動態文案、配樂和片尾 CTA，保留素材與專案。
5. **最後封裝 Skill**：把成功步驟、錯誤修正、驗收方式整理成可重複使用的工作流程，再用不同素材和畫幅測試。

如果你也在整理 AI 影片流程，可以延伸閱讀[從 Shot List 到粗剪的 AI 短片製片 SOP](/posts/ai-film-production-sop/)。本篇則聚焦在另一個環節：讓 AI Agent 透過 API 實際操作剪輯軟體。

## 結語：把剪輯判斷整理成可以重複執行的規則

這次我從第一次不知道該下載哪個語音模型，到建立本機 Bridge、匯出 2.5 秒測試片、完成 30 秒招生短影音，再把流程封裝成 Skill。過程中遇到時間軸跑位、片段裁太短、文字消失和音樂太小聲，逐一找出原因後再把修正方法寫進 SOP。

AI Agent 的價值不在於保證一句話就剪出神片，而是讓一次成功的工作經驗成為下一次可以檢查、修改和重複執行的能力。剪輯判斷仍然重要：你要知道什麼畫面好看、節奏是否合理，再把這些標準講清楚，才能讓 AI 照著做並協助驗收。

## 常見問答 (FAQ)

### Q1：讓 Codex 操作 Concat，需要準備哪些東西？

需要可使用的 Concat 本機 API、一個相容的 MCP Bridge，以及 Codex 的 MCP 設定。若還希望 Codex 按照固定剪輯 SOP 工作，再加上 Skill。Token 應保存在本機的安全設定中，不要放進程式碼或公開內容。

### Q2：Concat 0.2.7 已經內建 MCP Server 了嗎？

依 2026 年 10 月 18 日的官方開發者文件，內建 MCP Server 當時尚未隨產品發布，文件提供以 MCP 包裝 JSON-RPC 的 Bridge 作法。官方同日宣布開始開發內建 MCP 傳輸；請在實際操作前確認最新 release 與文件。

### Q3：這個 Skill 能自動找出影片中最精彩的片段嗎？

不能只靠固定剪輯腳本做到。腳本可以依素材順序、入點和片長安排時間軸；要根據講話內容或畫面情緒挑選精彩片段，還需要語音轉錄或影像理解等分析步驟。

### Q4：為什麼 Codex Cloud 不能直接操作我 Mac 上的 Concat？

Bridge 連到的是本機 127.0.0.1。在雲端執行時，這個位址指向雲端環境本身，不會自動連回使用者的 Mac。因此本文流程使用本機 Codex App 或 CLI。

### Q5：Concat 有配音和自動字幕，為什麼 Bridge 沒有？

軟體 GUI 有某項功能，不代表 MCP Bridge 已經把它做成可呼叫的工具。這次的 22 個自製工具沒有直接包裝 TTS 或語音辨識；若要納入自動流程，需要另外接好相應工具並驗證輸出。

## 官方資源與本次實測參考

- [Concat GitHub 專案](https://github.com/jub0t/Concat)
- [Concat 官方下載與版本](https://github.com/jub0t/Concat/releases)
- [Concat MCP 開發者文件](https://concatenate.pages.dev/docs/transports/mcp/)
- [Concat JSON-RPC 文件](https://concatenate.pages.dev/docs/transports/json-rpc/)
- [Concat API 方法](https://concatenate.pages.dev/docs/api/methods/)
- [Concat 文字轉語音教學](https://concatenate.pages.dev/guides/text-to-speech/)
- [Codex MCP 設定說明](https://developers.openai.com/codex/mcp)
- 本次實測資料：Concat MCP Bridge README、Concat MCP 測試報告（2026/10/18）、concat-video-editor Skill v001、Skill 四輪整合測試報告。

本文依據 2026 年 10 月 18 日的本機實測與當時官方文件整理。Concat 仍在持續開發，未來的功能、介面與 MCP 支援方式可能不同。
