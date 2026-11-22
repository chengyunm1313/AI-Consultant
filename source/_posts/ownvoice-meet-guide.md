---
title: "OwnVoice Meet 教學｜國際研討會即時翻譯、錄音逐字稿與英文提詞"
cover: /images/cover257.png
toc: true
categories:
  - 生成式AI應用
tags:
  - AI工具
  - 職場溝通
date: 2026-11-22 16:16:40
subtitle: 用 Windows 筆電看雙語字幕、準備英文發問，並按議程留下錄音和逐字稿。
description: 參加國際研討會時，如何跟上英文演講、開口發問，又能留下完整筆記？這篇 OwnVoice Meet 教學介紹 Windows 的雙語字幕、英文回覆提詞與分場錄音，並整理語音辨識選項、API 費用估算與資料隱私的差異。
---

參加國際研討會，一邊聽英文、一邊記筆記，很容易漏掉講者的重點。到了問答時間，明明知道要問什麼，卻來不及把問題組成英文。台灣獨立開發者 Zaious 開源的 **OwnVoice Meet**，把這兩件事放進同一套 Windows 工具。你可以在會中看中英字幕、把想問的問題轉成口語英文，再把錄音和逐字稿留到會後整理。

本文以 **OwnVoice Meet v0.2.3** 為操作基準，依公開文件與開發者測試紀錄整理。官方有 Windows 10、11 的安裝版和免安裝版。程式可免費使用，雲端語音辨識與翻譯仍依各服務商計費。[官方專案](https://github.com/Zaious/ownvoice-meet)｜[v0.2.3 發行頁](https://github.com/Zaious/ownvoice-meet/releases/tag/v0.2.3)

<!-- more -->

## OwnVoice Meet 怎麼幫你參與英文會議？

| 視窗 | 會中怎麼用 |
| --- | --- |
| 字幕 | 看英文原文與繁體中文翻譯，也能切換為只看中文。使用支援串流的辨識方式時，長句可先出部分翻譯，說完後再更新。 |
| 回覆 | 輸入想說的中文，按 Enter 生成口語英文短句，由你自己朗讀。視窗可以放在鏡頭旁，用 `Ctrl + Shift + Space` 叫出來。 |
| 講稿 | 事先整理簡報、備忘和 Q&A，用「補對照」補上另一種語言。翻譯和回覆會參考講稿及術語，讓人名、產品名和專有名詞更一致。 |

例如你想知道某項技術能不能用在台灣中小企業，可以在回覆窗輸入「這項技術能幫助台灣中小企業做數位轉型嗎？」再照著畫面上的英文朗讀。

> Could this technology help small businesses in Taiwan with digital transformation?

事先準備的講稿也可以用 Markdown 撰寫。`#` 用來切換分頁，`>` 提供上一行的對照翻譯，`!` 留給上台時要看的提示。

```markdown
# 開場介紹

Good morning, everyone.
> 各位早安。

! 切換到第二張投影片

# Q&A

Q: What are the biggest challenges for small businesses?
```

## 第一次使用，從下載與 Demo 開始

### 下載 Windows 版本

- **安裝版** `OwnVoice.Meet_0.2.3_x64-setup.exe`，適合固定使用，可在設定裡檢查更新。
- **免安裝版** `OwnVoice.Meet_0.2.3_x64_portable.zip`，解壓縮後執行 `OwnVoice Meet.exe`，更新時重新下載。

v0.2.3 的 Windows 執行檔尚未提供 Windows 程式碼簽章，可能出現 SmartScreen 提示。請從專案發行頁下載並核對版本。若在 Windows 10 無法啟動，可先依手冊確認是否有 Microsoft Edge WebView2 Runtime。[v0.2.3 下載頁](https://github.com/Zaious/ownvoice-meet/releases/tag/v0.2.3)｜[官方使用手冊](https://github.com/Zaious/ownvoice-meet/blob/main/docs/MANUAL.md)

第一次開啟可以直接按 **Demo**，看看字幕、回覆與講稿三個視窗。Demo 播放預先寫好的內容，無需麥克風或 API 金鑰。

### 分別設定「聽」和「翻」

在設定的「聽：語音辨識」選擇收音後要用的辨識引擎。Windows 11 22H2 以上可以試用實驗性的即時輔助字幕整合，先在 Windows 下載英文語音套件。有自架環境可選本機 Whisper。雲端選項則包括 OpenAI 的 `gpt-4o-mini-transcribe`、`gpt-live-transcribe`，以及 Gemini 3.5 Transcribe Live。

在「翻：翻譯與回覆」選擇 Claude、OpenAI、Gemini 或本機相容服務。Windows 即時輔助字幕在本機辨識，若翻譯選了雲端模型，文字仍會交由該服務處理並依用量計費。聊天產品的訂閱和開發者 API 帳務要分別確認。[Windows 即時輔助字幕說明](https://support.microsoft.com/zh-tw/accessibility/windows/use-live-captions-to-better-understand-audio)｜[官方使用手冊](https://github.com/Zaious/ownvoice-meet/blob/v0.2.3/docs/MANUAL.md)

## 線上會議和實體研討會怎麼收音？

### Zoom、Teams、Google Meet 用系統音訊

1. 將會議軟體的喇叭設為 Windows 預設輸出裝置。
2. 在 OwnVoice Meet 選擇系統音訊，按「聆聽」，確認音量指示有反應。
3. 看字幕跟上討論，輪到你時在回覆窗輸入中文，再用自己的聲音說出英文。
4. 結束時按「停止」。

系統音訊擷取的是電腦播放的聲音，你自己的麥克風通常不在這個來源裡。若換了藍牙耳機後沒出現字幕，先核對會議軟體和 Windows 的輸出裝置。

### 實體研討會用麥克風，按場次分段

1. 先確認主辦單位的錄音規定，進入「設定 → 收音與存檔」，選「麥克風（現場演講、研討會會場）」。
2. 選定實際使用的麥克風，在會場做一次「麥克風檢查（6 秒）」。音量偏低時可調整增益或移近講者、音箱。
3. 在「議程」每行輸入一個場次名稱，按「聆聽」開始。
4. 換場時按「新段落」或 `Ctrl + Shift + F9`。結束後按「停止」，開啟存檔資料夾。

每個場次會有一份 WAV 和一份 Markdown 逐字稿，另有整場的 `transcript.md`。逐字稿列出時間、英文和中文。錄音為 16 kHz 單聲道 WAV，手冊估算每小時約 115 MB。

```text
研討會存檔資料夾/
├── 01-Keynote.wav
├── 01-Keynote.md
├── 02-Panel-Discussion.wav
├── 02-Panel-Discussion.md
└── transcript.md
```

錄音與雲端辨識各自運行，會場網路中斷時可以繼續本機錄音。連線恢復後字幕可接續，斷線時漏掉的內容需要靠錄音回查。若網路持續不穩，可以選「只錄音，不辨識」。聆聽期間程式會防止系統和螢幕自動休眠。

開發者已公開系統音訊錄音、分段及逐字稿的測試結果，同一份紀錄仍把實體麥克風的完整流程列為待驗證。第一次帶去正式會場前，先用實際設備試錄並回放。[使用手冊的會場操作](https://github.com/Zaious/ownvoice-meet/blob/v0.2.3/docs/MANUAL.md#在會場聽演講麥克風錄音分段)｜[開發者測試紀錄](https://github.com/Zaious/ownvoice-meet/blob/v0.2.3/docs/ARCHITECTURE.md)

## AI 翻譯與逐字稿每小時要花多少錢？

下表是 v0.2.3 手冊以 Claude Haiku 5.5 等入門翻譯模型搭配不同語音辨識引擎的估算。模型版本、用量、提示快取及供應商費率都會影響帳單。

| 語音辨識 | 每小時含翻譯費估算 | 適合情境 |
| --- | ---: | --- |
| Windows 即時輔助字幕 | US$0.03 | Windows 11，想先試用本機辨識 |
| 本機 Whisper | US$0.03 | 已有可運行 Whisper 的設備 |
| OpenAI `gpt-4o-mini-transcribe` | US$0.21 | 可以等一句話說完再出字幕 |
| Gemini 3.5 Transcribe Live | US$0.57 | 希望在講者說話途中看到字幕 |

開發者分享，他在 JCDL 2026 的線上發表用自架 Whisper 搭配 Claude Haiku 5.5。一個半小時多的場次，翻譯帳單約 **US$0.11**。該數字是開發者案例，只計雲端翻譯。講稿在多次請求中透過提示快取（Prompt Caching）重複使用，有助降低成本。[專案使用案例](https://github.com/Zaious/ownvoice-meet/tree/v0.2.3#起源)｜[手冊的費用估算](https://github.com/Zaious/ownvoice-meet/blob/v0.2.3/docs/MANUAL.md#6-省錢)

串流辨識可能連安靜時段也計費。手冊記載，程式預設在約 3 分鐘沒有新字幕後暫停辨識，有聲音時恢復。閒置約 20 分鐘會結束這次聆聽，這兩個時間都能在「收音與存檔」調整。場次間要持續錄音時，先確認自動結束時間符合議程安排。

## 從 Tauri、Rust 到本機模型，工程上值得看什麼？

OwnVoice Meet 採 **Tauri 2、Rust 與 TypeScript**。Rust 處理音訊擷取、模型串接和會議狀態，前端把字幕、回覆和講稿放到不同視窗。語音辨識與翻譯可分開換模型，例如用本機 Whisper 處理聲音，再讓雲端模型做翻譯。長句提前翻譯、取消已過時的翻譯請求，都是為了讓字幕跟得上會議。[技術架構說明](https://github.com/Zaious/ownvoice-meet/blob/main/docs/ARCHITECTURE.md)

專案附有 faster-whisper 的最小伺服器。已準備好 Python 與 NVIDIA GPU 環境時，可參考官方範例。

```bash
pip install faster-whisper
python scripts/local_whisper_server.py --model large-v3 --device cuda --port 8790
```

接著把 `http://127.0.0.1:8790/v1` 填入「本機 Whisper」設定並測試連線。沒有 NVIDIA GPU 可改用 `--device cpu --compute-type int8`。翻譯也可改接 Ollama 或 vLLM 的相容 API，先用幾句有專有名詞的內容試試繁體中文品質。[本機 Whisper 與 LLM 部署教學](https://github.com/Zaious/ownvoice-meet/blob/main/docs/LOCAL.md)

## 錄音在本機，哪些資料會進雲端？

依官方手冊，API 金鑰存放於 Windows 認證管理員，錄音和逐字稿存在本機。選用雲端語音辨識時，音訊會送到所選服務商。選用雲端翻譯時，辨識後的文字、相關語境與講稿可能送往翻譯服務商。涉及保密內容時，應先確認錄音規定、供應商條款及授權範圍，再評估本機辨識與本機翻譯。Gemini API 免費層與付費層的資料處理也有差異。[官方使用手冊](https://github.com/Zaious/ownvoice-meet/blob/main/docs/MANUAL.md)｜[Gemini API 價格與資料使用說明](https://ai.google.dev/gemini-api/docs/pricing)

另外，正式筆記仍需回聽核對人名、縮寫、關鍵數字及多人交錯的發言。會場有回音或距離過遠時，先改善收音位置，再比較辨識模型的差異。

## 會後怎麼把逐字稿變成研究筆記？

v0.2.3 的公開文件主要涵蓋字幕、錄音、逐字稿及英文提詞。要做摘要，可以取已獲授權處理的 `transcript.md`，交由合適的語言模型整理。

> 你是一位國際研討會紀錄助理。請將這份中英雙語逐字稿整理成繁體中文報告，包含核心結論、五項重要觀點、技術與應用案例、對台灣企業或教育現場的啟發，以及值得追問的問題和後續行動。重要觀點附上逐字稿時間。對人名、數字或術語無法確認的地方標註「待核對」，不要補寫逐字稿沒有的資訊。

若這套工具未來加入即時摘要，我會先試每五分鐘整理一次新增逐字稿，場次結束再統整。這樣可以控制 API 呼叫量，並保留字幕主要工作流的更新速度。下一步還可以把摘要變成中英對照的追問建議，供聽眾挑選。

帶進 AI 課堂時，我會安排三個練習。先播放英文演講觀察字幕延遲，再讓學員用中文寫一個問題並練習用英文開口，最後用獲授權的錄音練習分段與摘要。OwnVoice Meet 值得拆解的地方，正是把「聽懂、開口、留下紀錄」各自做成能在會議中派上用場的功能。

## 參考資料與下載

- [OwnVoice Meet 官方網站](https://ownvoice.chroniclecore.com/)
- [GitHub 原始碼](https://github.com/Zaious/ownvoice-meet)
- [GitHub 最新發行版](https://github.com/Zaious/ownvoice-meet/releases/latest)

本文於 2026 年 11 月 22 日依公開資料核對，操作說明未經本文作者獨立在 Windows 上端到端實測。

## 常見問答 (FAQ)

### Q1：OwnVoice Meet 可以在 macOS 或網頁上直接使用嗎？

v0.2.3 提供 Windows 10、11 的桌面安裝版與免安裝版。官方網站提供介紹與下載，macOS 版仍在規劃中。

### Q2：沒有 API 金鑰能試用嗎？本機辨識也會收費嗎？

可先用 Demo 體驗三個視窗，無需 API 金鑰。Windows 11 的即時輔助字幕與自架 Whisper 可以在本機辨識。若後續選擇雲端翻譯或回覆，該服務仍會依用量計費。

### Q3：在研討會現場斷網，還能保留錄音和逐字稿嗎？

啟用本機錄音後，網路中斷時錄音可繼續，已產生的逐字稿會保留。使用雲端辨識時，斷線期間的字幕可能缺漏，可在會後從 WAV 回查或重新辨識。網路很不穩時也可以先用「只錄音，不辨識」。
