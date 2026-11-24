---
title: "關掉電腦也能生成 AI 影片！Google Antigravity × Colab × MiniMax H3 雲端工作流"
cover: /images/cover260.png
toc: true
categories:
  - 生成式AI應用
tags:
  - AI自動化
  - AI工具
  - 影音行銷
date: 2026-11-24 18:05:10
subtitle:
description: "讓 Google Antigravity Remote Agent 調度 Colab GPU，用 MiniMax H3 生成影片，再把成果存回 Google Drive。本文整理第一支 5 秒試片的設定、200 個運算單元的預算試算，以及 Codex 跨 Agent 的製片構想。"
---

最近看到網友分享一個有意思的做法。把松音老師開發的 H3 Colab Skill 放進 Google Antigravity 的 Remote Agent，讓它調度 Google Colab GPU 生成影片，最後把成品存到 Google Drive。遠端任務送出後，本機就可以離線。

剛好我最近也升級了 Google AI Pro。如果把這套架構接上我原本的 Codex Skills、AI 網紅、短劇及自動剪輯工作流，有機會從手機交代一項製作任務，再回到雲端查看成果。以下是我依公開文件整理的導入方式與應用構想。Antigravity、Colab 與 Drive 串接的完整流程，仍需在自己的帳號做一次端到端測試。

## Google Antigravity Remote Agent 怎麼運作？

平常我用 Claude Code 或 Codex 在本機跑工作，程式、工具和檔案都由自己的電腦處理。Antigravity Remote Agent 則把工作移到 Google 管理的隔離環境，連線中斷或電腦休眠後，已送出的任務可以繼續執行。

官方提供網頁、應用程式與 CLI 入口。遠端專案可附加 GitHub repo、Google Drive 檔案和上傳的素材。Remote Agents 逐步開放給符合資格、使用個人 Google 帳號的 Google AI Pro 與 Ultra 訂閱者，先確認帳號看得到功能。從終端機可這樣啟動。 [入口](https://antigravity.google.com) · [Remote Agents 官方文件](https://antigravity.google/docs/remote-agents)

```bash
agy --remote-agent
```

## H3 Colab Skill 可以生成什麼？

這套 Skill 由 DSLab 夢想空間實驗室的松音老師開發。Agent 依需求編寫提示詞和工作清單，腳本透過 Google Colab CLI 申請 GPU、安裝 ComfyUI 與節點、準備模型、上傳素材、回收產物並管理 GPU 工作階段。 [H3 Colab Skill](https://github.com/dseditor/h3-colab-skill) · [Google Colab CLI](https://pypi.org/project/google-colab-cli/)

| 能力 | 可以怎麼用 |
|---|---|
| 圖片生成與編輯 | 角色設計、場景、換裝、分鏡參考 |
| 文生影片、參考生成 | 氣氛鏡頭、指定角色和場景、人物對話 |
| 首尾幀、影片延伸 | 控制鏡頭起訖，或接續前一段畫面 |
| 音訊驅動、文字轉語音（TTS） | 用錄音驅動表演，或生成旁白和台詞 |
| 批次生成 | 用一份工作清單處理多段素材 |

生圖可選擇另外準備模型。音訊驅動可以沿用原錄音，嘴型和畫面仍要人工檢查。想先用 Colab 筆記本熟悉模型，可以參考 [MiniMax H3 Colab 專案](https://github.com/dseditor/minimax-h3-colab) 和 [站內的 H3 手動生成與 Codex 自動化比較](/posts/minimax-h3-colab-codex-guide/)。

## 從手機下任務，讓 Colab GPU 負責生成

```text
手機／平板／電腦瀏覽器
    ↓
Antigravity Remote Agent（接任務、準備清單、監看）
    ↓
H3 Colab Skill → Google Colab CLI
    ↓
Colab GPU（ComfyUI + MiniMax H3）
    ↓
遠端工作資料夾 → Google Drive（另設歸檔步驟）
```

原本我會讓本機 Agent 送工作給 Colab，產物下載回自己的工作資料夾。這套做法把 Agent 移到遠端環境，再補上 Drive 歸檔。對我來說，這也是 AI Agent 工作流值得掌握的一點。把規劃、運算與儲存交給合適的服務，就能沿用既有工具，用同一套工作清單串起來。

## Google AI Pro 的 200 個 Colab 運算單元能做多少事？

Google One 繁中說明列出符合資格的 Google AI Pro 會員可享 200 個 Colab 運算單元（CCU），並有年齡、家庭方案及試用資格等適用條件。H3 Colab Skill 的 README 列出約 400 點，和官方說明有落差。下方採 200 點試算，執行前以自己帳號的可用額度為準。Flow 的 AI Credits 另有額度。 [Google One 福利說明](https://support.google.com/googleone/answer/14534406?hl=zh-Hant) · [H3 Colab Skill README](https://github.com/dseditor/h3-colab-skill)

| GPU | 專案估計每小時消耗 | 200 點換算 |
|---|---:|---:|
| NVIDIA L4 | 約 1.5 點 | 約 133 小時 |
| NVIDIA G4 | 約 11 點 | 約 18 小時 |

### 一批測試花多久？

松音老師在 2026 年 11 月 4 日用 L4 測了一次混合批次。從開機到關機約 10.1 分鐘，其中 2K 參考圖編輯 112 秒、5 秒 480P 參考影片 160 秒、6 秒配音 17 秒。該次含生圖模型的下載和啟動約 3.5 分鐘。作者估計每次開機會下載約 50～60 GB 的模型，批次處理可以攤提這段準備時間。 [H3 Colab Skill 實測紀錄](https://github.com/dseditor/h3-colab-skill)

### 假設每批做 10 段影片

以每批初始化 5 分鐘、每批 10 段、完整批次無條件捨去計算。公式是「可用 GPU 分鐘 ÷（5 分鐘＋10 × 單段生成時間）」取整數，再乘以 10。

| GPU | 假設單段耗時 | 200 點理論段數 |
|---|---:|---:|
| L4 | 3 分鐘 | 2,280 |
| L4 | 5 分鐘 | 1,450 |
| L4 | 10 分鐘 | 760 |
| G4 | 1 分鐘 | 720 |
| G4 | 2 分鐘 | 430 |
| G4 | 3 分鐘 | 310 |

表格以單次生成的短片段為單位。G4 的耗時是假設，同規格的 L4 與 G4 表現仍需實測。重試、閒置、素材傳輸和其他 Colab 工作都會壓低實際產量。我的做法會是先用 L4 批次試拍，再依試片品質和實測消耗決定是否改用 G4 定稿。Gemini 或 NotebookLM 可以用於腳本研究，Flow 可作為另一條影片生成管道。

## 如何跑第一支 5 秒試片？

### 1. 建立遠端專案

在 Antigravity 建立遠端專案，例如 `H3 Cloud Video Studio`。用一張測試用角色圖或場景圖起步，先確認遠端 Agent 能讀取指定素材，並確認預計使用的 Drive 編輯或上傳方式能寫入測試資料夾。

### 2. 請 Agent 規劃安裝

以下提示詞可以交給遠端 Agent，先對齊工具版本、預算及測試範圍。

```text
請規劃在目前的 Antigravity Remote Agent 安裝 H3 Colab Skill。
來源：https://github.com/dseditor/h3-colab-skill

先閱讀 INSTALL_FOR_AGENTS.md、Skill 文件和 Linux 安裝腳本。
請列出來源版本、實際指令、寫入路徑、下載內容與所需權限，
確認 Python、uv、Colab CLI 版本和遠端 Skills 路徑。
說明 Colab OAuth 在沙箱內如何保存及跨工作階段使用。

第一批請用 L4、480P、5 秒，只做一段影片，先不下載生圖模型。
送出前查看 Colab 剩餘點數，列出預估消耗和執行時間上限，
以 200 個運算單元當作月預算基準，不啟用額外付費服務。
確認可行的 Drive 寫入方式，保留生成參數、耗時與耗用點數。
跑完或失敗後檢查 GPU 是否已釋放。

請先提供計畫，等我同意後再安裝和執行試片。
```

原專案的 Linux 安裝腳本可能將 Skill 複製到它找到的多個 Agent 目錄。遠端部署前先確認要用的目錄，並讓安裝指令保留人工審核。 [H3 Colab Skill 安裝指南](https://github.com/dseditor/h3-colab-skill/blob/main/INSTALL_FOR_AGENTS.md)

### 3. 完成 Colab 授權並確認額度

在 Skill 目錄用安裝指南指定的 Python 環境執行下列指令，取得登入網址，以持有 Colab 額度的帳號完成授權。依安裝指南完成授權碼交換後，再執行額度檢查。Colab CLI 的登入與 Drive 整合是兩項授權，跨工作階段是否需要重新登入也要實測。 [H3 Colab Skill 安裝指南](https://github.com/dseditor/h3-colab-skill/blob/main/INSTALL_FOR_AGENTS.md)

```bash
python scripts/colab_login.py url
# 完成授權碼交換後
python scripts/h3run.py check
```

### 4. 送出工作並釋放 GPU

依 Skill 的工作清單格式建立 `h3job/manifest.json`，指定一段 5 秒 480P 影片，確認批次內容與預估消耗後執行。

```bash
python scripts/h3run.py run h3job/manifest.json --gpu L4 --stop-after
```

`--stop-after` 是一次性工作要求結束後釋放 GPU 的開關。產物先回到遠端工作資料夾。測完可以檢查 Colab 是否還有殘留工作階段。沙箱若突然終止，仍須另外測試 Colab 是否有機器繼續運作。 [H3 Colab Skill 操作文件](https://github.com/dseditor/h3-colab-skill/blob/main/h3-multimodal-colab/SKILL.md)

### 5. 把成品存到 Google Drive

用具備指定資料夾寫入權限的 Drive 整合或 API，上傳 MP4、工作清單與生成紀錄。上傳完比對檔名和檔案大小，再打開成品抽看畫面和聲音。上傳失敗時保留工作檔和錯誤紀錄，方便單獨重試歸檔。

## 我會怎麼用這套架構？

- **AI 網紅短影音。** 先在 Drive 整理角色設定、形象照、服裝和場景。Agent 依主題完成劇本、分鏡與鏡頭生成，再把剪輯素材交給我審看。
- **AI 武俠與科幻短劇。** 用同一個分鏡，比較客製化工作流的 `off`、`low`、`mid`、`high` 動作設定及不同種子值，再用 Blender 預演或首尾幀控制比較接點和角色一致性。
- **AI 音樂 MV。** 將 Suno 或 Mureka 歌曲按樂句切成最多 15 秒一段，以原曲片段驅動角色表演，最後用 FFmpeg 或 Concat 剪接。每段要驗對嘴，整首要驗節奏與接點。 [H3 Colab Skill 操作文件](https://github.com/dseditor/h3-colab-skill/blob/main/h3-multimodal-colab/SKILL.md)
- **蝦皮聯盟帶貨影片。** 依商品清單做腳本、配音與字幕，為同一件商品產出不同開場做 A/B 測試。發布前由人工核對商品外觀、規格及廣告描述。
- **影片模型測試。** 固定角色和分鏡，比較官方與客製化模型、提示詞、種子值、480P／720P，以及 L4／G4 的耗時和成本，將結果回填到自己的影片導演 Skill。

## 讓 Codex 和 Antigravity 分階段交接

我已經累積不少 Codex Skills，會先保留 Codex 處理前期與後製。Codex 規劃劇本、分鏡和提示詞，將工作清單與素材放到 GitHub 或 Google Drive。Antigravity 讀取清單並調度 Colab，成果與參數存回 Drive，再由 Codex 檢查品質、剪輯、上字幕與混音。先統一檔名、工作清單格式和交付規格，兩個 Agent 就可以分階段工作。如果希望前期與後製也能在本機關機時執行，還要為這兩個階段安排雲端環境。

等小批次跑穩後，我想把製片管理整理成 `h3-cloud-studio` Skill，沿用松音老師的 Skill 生成影音，再加上任務佇列、預算控制、失敗鏡頭補拍、FFmpeg 剪輯與通知。角色、場景、音訊、劇本、分鏡、任務清單、生成素材、成品與日誌，可以各自在 Drive 維持固定目錄。每次搭配提示詞、模型、種子值、耗時與點數，之後才有資料可比較和重製。

| 200 點的試行分配 | 點數 |
|---|---:|
| AI 網紅及商品影片 | 80 |
| AI 短劇及動作影片 | 40 |
| AI 音樂 MV | 30 |
| 模型與提示詞研究 | 30 |
| 重試與備用 | 20 |

## 從試片走到批次製作，還要驗證什麼？

1. 遠端沙箱能否跨工作階段保留 Skill、設定及 Colab 登入狀態。
2. Drive 是否能可靠接收大型 MP4，以及上傳中斷後如何重試。
3. Remote Agent 的執行時間與使用額度能否支援批次。
4. 沙箱意外停止後，Colab runtime 是否仍在耗點。
5. 能否只重做失敗的分鏡，並在每批設好時間和預算上限。
6. MiniMax H3、各組模型權重與 LoRA 的授權，是否符合自己的商業使用情境。

我會用第一支 5 秒試片量出從送出工作到成品入庫的時間，再用實際點數與失敗率規劃批次。現有的 Google AI Pro 訂閱能不能支撐這套製作方式，也可以用這些紀錄來判斷。感謝分享 Remote Agent 經驗的網友，也感謝松音老師公開 H3 Colab Skill。

## 常見問答 (FAQ)

### Q1：關掉電腦後，AI 影片還會繼續生成嗎？

已送出的 Antigravity 遠端任務可以在本機離線後繼續執行。影片是否生成並成功保存，取決於遠端工作階段、Colab runtime 和 Drive 歸檔是否都順利完成。第一次可以用 5 秒影片，從送出任務一路驗到 Drive。 [Remote Agents 官方文件](https://antigravity.google/docs/remote-agents)

### Q2：第一次試拍要選哪張 Colab GPU？

可從 L4、480P、5 秒開始，記下實際耗時、消耗點數及成品品質。需要提高解析度或縮短處理時間時，再取同一個分鏡在 G4 上比較。 [H3 Colab Skill 操作文件](https://github.com/dseditor/h3-colab-skill/blob/main/h3-multimodal-colab/SKILL.md)

### Q3：連結 Google Drive 後，H3 會自動把影片存進去嗎？

H3 Colab Skill 預設把成品下載到執行端的工作資料夾。遠端版要另接具備寫入權限的 Drive 工具或 API，並檢查上傳結果。 [H3 Colab Skill 操作文件](https://github.com/dseditor/h3-colab-skill/blob/main/h3-multimodal-colab/SKILL.md)
