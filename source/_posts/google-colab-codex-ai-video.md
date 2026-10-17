---
title: "不用買高階顯示卡，也能用 AI 做影片！Google Colab × Codex 零基礎實戰教學"
cover: /images/cover225.png
toc: true
categories:
  - AI工具
tags:
  - 影音行銷
  - Codex
  - Google Colab
date: 2026-10-18 02:49:37
subtitle: 先熟悉免費 Notebook，再查運算額度、GPU 地區和模型授權
description: 沒有 NVIDIA 顯示卡，也想試做 AI 影片？本文用 Google Colab、Codex 與山獅霸開源工作流，帶你從首次執行 Notebook、檢查環境，到評估雲端 GPU 費用、地區與模型授權。
---

一台普通 MacBook，能不能搭配雲端 GPU，開始做 AI 影片？

可以先從 Google Colab 的免費 Notebook 體驗雲端運算，再讓 Codex 協助閱讀開源專案、檢查環境與規劃工作流程。但「能用雲端 GPU」不代表每個帳號都能取得同一種 GPU，也不代表模型授權一定允許在分配到的機房執行。

本文以 MacBook 為例，帶你從零開始認識 Colab、Google Colab CLI 與 AI Agent 工作流。先做不會啟動 GPU 的練習；等你看懂費用、執行環境與模型授權，再決定是否繼續。

> **先看這個重要限制：** 上游專案回報，它測試到的 Colab G4 執行階段位於美國或歐盟；MiniMax H3 開放權重授權目前排除美國、歐盟、英國與南韓。不要因為成功分配到 GPU，就直接下載或執行 H3。先確認最新授權、實際執行地區與你的使用方式；有疑問就停下來詢問權利人或改用條款適用的替代方案。

本文的 Colab 配額與模型授權資訊會隨方案及條款變動。Colab GPU 型號、使用限制與供應狀況也可能改變；本文不保證你能取得 G4，也不把上游作者的測試值當成每個人的預期成本。

## Google Colab 是什麼？為什麼能用一般 MacBook 做運算？

Google Colab 是 Google 提供的雲端 Jupyter Notebook 服務。你可以在瀏覽器裡執行 Python 程式，運算工作由遠端執行階段處理；自己的電腦則負責操作、管理專案與下載成果。

可以先把它想成：

- **MacBook：** 你操作的工作桌，負責編輯、管理素材與發出指令。
- **Colab 執行階段：** 暫時租用的遠端電腦，依帳號方案與當時供應情況提供 CPU、GPU 或 TPU。
- **Codex：** 可以讀取你開啟的專案，協助理解程式、規劃步驟與整理檔案的 AI 助手。
- **GPU：** 適合大量平行運算的硬體，可用於部分 AI 圖像與影片模型。

Colab 的免費層可以用來練習 Notebook；但資源有使用限制，GPU 種類與可用性會變動。付費方案也不等於保證取得指定 GPU。Google 官方建議把 GPU 可用性視為依帳號與當下資源供應變動的服務。

### 先認識幾個常見名詞

| 名詞 | 入門理解 |
|---|---|
| Google Colab | Google 提供的雲端 Notebook 服務 |
| GPU | 執行部分 AI 模型時使用的平行運算硬體 |
| CCU | Colab 運算單元；依方案和使用情況扣抵 |
| GitHub Repo | 放置程式碼、文件與設定檔的專案資料夾 |
| CLI | 用文字指令操作服務的命令列介面 |
| AI Agent | 能讀取任務、使用工具並協助完成多步驟工作的 AI 助手 |

本文提到的 Google Colab CLI 是 Google 維護的命令列工具，可以建立與停止 Colab 執行階段、執行程式及傳送檔案。它會連接你的 Colab 帳號，因此登入授權碼要由你自己操作，不要貼到 Codex 對話或公開分享。

## 開始前要準備什麼？

這篇教學的練習環境是 MacBook。即使電腦沒有 NVIDIA 顯示卡，也可以先完成 Colab 的基本 Notebook 體驗；真正能否使用特定雲端 GPU，則要以帳號裡的實際選項為準。

| 工具或帳號 | 用途 | 需要注意的事 |
|---|---|---|
| MacBook | 操作終端機、Codex 與專案檔案 | 本文指令以 macOS 為例 |
| Google 帳號 | 登入 Colab | 確認登入的是有 Colab 權益的帳號 |
| Google Colab | 練習 Notebook 與租用雲端執行階段 | GPU、限制與價格依當下方案而變 |
| Git | 下載公開專案 | 下載前先閱讀專案文件與授權 |
| uv、Python 3.12 | 安裝 Colab CLI，執行專案提供的 Python 指令 | 以專案 README 與工具最新說明為準 |
| Codex App | 開啟本機資料夾，協助閱讀專案 | 使用者仍要審查命令與執行結果 |
| Colab 運算單元 | 使用部分付費 GPU 資源 | 先看帳號餘額及當下費率，不要把測試數字視為保證 |

**Codex 的方案額度與 Colab 的 GPU 費用是分開的。** 使用 Codex 不會自動附送 Colab 運算單元。

符合資格的 Google AI 訂閱可能包含 Colab 權益，但實際內容依方案、地區與帳號而不同。不要依照舊文章中的固定 CCU 數量或價格購買；先到 Colab 帳號設定與付款頁，確認目前方案、餘額、費率與有效期限。

## 第一步：先免費體驗 Colab，不用安裝模型

先打開 [Google Colab](https://colab.research.google.com/) 並登入 Google 帳號。

1. 新增一個 Notebook。
2. 在程式碼儲存格輸入：

~~~python
print("我的第一個 Google Colab 程式成功了！")
~~~

3. 按儲存格左側的播放按鈕，或按 `Shift + Enter`。
4. 看見輸出文字後，就完成了第一次雲端 Python 練習。

這一步不需要高階 GPU，也不需要下載影片模型。

如果只是熟悉介面，可以先使用一般 CPU 執行階段。上方「執行階段」選單裡的硬體選項會依帳號與時間不同；先查看有哪些選項即可，不用急著啟用 GPU。

工作完成後，從「執行階段」選單中停止或刪除執行階段。Colab 執行階段是暫時環境，重要檔案要下載回自己的電腦或另存到你信任的位置。

## 第二步：先看懂山獅霸開源專案

本文使用的範例是 [山獅霸 AI 影片工作流 Colab 版](https://github.com/mathruffian-dot/shanshiba-workflow-colab)。它把劇本、角色圖片、影片生成、配音、配樂、字幕與剪輯拆成多個階段，並提供給 AI Agent 閱讀的文件。

下載之前，先認識幾個重要檔案：

| 檔案或資料夾 | 用途 |
|---|---|
| `README.md` | 專案介紹、硬體版本與快速開始方式 |
| `AGENT_SETUP.md` | 提供 AI Agent 的專案閱讀與環境檢查指引 |
| `cloud/README.md` | Colab 操作、雲端費用、授權與機房注意事項 |
| `THIRD_PARTY_NOTICES.md` | 第三方程式與模型授權資訊 |
| `docs/hardware.md` | 各硬體版本與執行條件 |
| `cloud/` | 連接 Colab 與執行雲端流程的程式 |
| `pipeline/template_local/` | 建立新影片時可參考的範本流程 |

這是公開原始碼專案，但「開源」不等於每個模型都能自由商用，也不表示所有程式都適合直接執行。下載後先閱讀 README、安裝文件、授權與第三方告示；要執行任何安裝或雲端操作腳本前，請先讓 Codex 列出它會讀寫哪些檔案、下載什麼模型、連線到哪些服務、是否會啟動付費執行階段，再由你檢查。

上游專案的流程涵蓋角色定妝、場景與首幀、配音、H3 影片、配樂、字幕和剪輯。原始專案也提醒，部分模型只供非商業用途；若要製作商用影片，必須逐一核對模型、素材、音訊與輸出的授權，不要只看整個 GitHub Repo 的授權名稱。

## 第三步：在 Mac 安裝基本工具

開始前先確認專案文件與程式碼。以下是上游文件提供的 Mac 操作方向；執行前仍應核對該專案與 Colab CLI 的最新安裝說明。

### 1. 確認 Git

打開「終端機」，輸入：

~~~bash
git --version
~~~

若系統提示安裝 Command Line Developer Tools，依照 macOS 顯示的官方提示操作。

### 2. 安裝 uv 與 Python 3.12

已安裝 Homebrew 的 Mac 可以用：

~~~bash
brew install uv
~~~

也可以參考 [uv 官方安裝文件](https://docs.astral.sh/uv/getting-started/installation/)選擇適合自己的方式。

確認 uv 可用後，安裝 Python 3.12：

~~~bash
uv --version
uv python install 3.12
~~~

### 3. 安裝 Google Colab CLI

Google 官方 CLI 文件目前提供 uv 安裝方式：

~~~bash
uv tool install google-colab-cli
colab version
~~~

如果系統找不到 `colab` 指令，可以依 uv 文件更新 shell 路徑，然後重新開啟終端機再確認。

Google Colab CLI 官方目前支援 macOS 與 Linux；Windows 尚未列為支援平台。不要直接把網路上找到的 Windows patch 套用到其他版本；先確認專案作者提供的修補方式、修改內容與備份方法，再決定是否使用。

### 4. 登入 Google 帳號

輸入：

~~~bash
colab usage
~~~

第一次使用時，CLI 可能會要求你在瀏覽器登入並完成授權。請由你本人在自己的終端機操作。

**不要把 Google 顯示的授權碼貼到 Codex 對話、聊天室或程式碼檔案中。** 授權碼與帳號登入資訊一樣，需要妥善保管。登入後，`colab usage` 可以查看帳號運算單元的使用率與餘額。

## 第四步：下載專案，讓 Codex 先做唯讀檢查

先在終端機建立工作資料夾，再下載公開 Repo：

~~~bash
mkdir -p ~/AI-Video-Test
cd ~/AI-Video-Test
git clone https://github.com/mathruffian-dot/shanshiba-workflow-colab.git
cd shanshiba-workflow-colab
~~~

下載 Repo 不代表已經下載所有模型。模型可能很大；上游 Colab 版本會在遠端執行階段準備所需環境，Mac 的硬碟仍需保留專案檔案與下載成果的空間。

如果你使用 Codex App，可以開啟這個本機資料夾，讓 Codex 先閱讀 README、`AGENT_SETUP.md`、`cloud/README.md`、`docs/hardware.md` 和 `THIRD_PARTY_NOTICES.md`。初次檢查時，不要讓 Agent 自動安裝套件、啟動 GPU、下載模型或執行影片任務。

### 給 Codex 的環境檢查提示詞

~~~text
你是我的 Google Colab 與 AI 影片工作流助教。

我第一次使用 Google Colab，也第一次操作這個 GitHub 專案。
我的設備是 MacBook，沒有 NVIDIA CUDA 顯示卡。

請先唯讀閱讀：
1. README.md
2. AGENT_SETUP.md
3. cloud/README.md
4. docs/hardware.md
5. THIRD_PARTY_NOTICES.md

請整理以下資訊：
1. Mac 本機需要哪些工具與版本。
2. 哪些命令只會讀取資訊，哪些命令會安裝套件、修改檔案或連線到外部服務。
3. 哪些命令會建立 Colab 執行階段、可能消耗 CCU 或產生費用。
4. 專案中各模型、素材與輸出的授權限制。
5. 使用 MiniMax H3 時，執行地區與目前授權是否相容；若無法確認，請明確標為未知。
6. 完成範例影片所需的本機空間、下載內容與預估步驟。

這一輪只做閱讀和檢查：
不要執行安裝指令、不要修改檔案、不要登入帳號、
不要啟動 GPU、不要下載模型，也不要開始影片生成。
先列出檢查結果與仍需我確認的項目。
~~~

這樣可以先取得操作清單，再由你決定是否繼續。AI Agent 的建議仍需要人工檢查，尤其是任何會執行外部程式、寫入檔案、傳送素材或啟動付費資源的步驟。

### 先做帳號與專案檢查

在專案目錄中，上游提供的檢查指令是：

~~~bash
uv run --no-project --python 3.12 cloud/colab_h3.py check
~~~

執行前先確認這支程式的內容與目前文件一致。依上游文件，`check` 用來檢查 CLI 與帳號用量；它不應替你啟動 GPU。若實際程式行為與文件不符，先停止並查明原因。

## 第五步：看清額度與 H3 授權，再考慮 GPU

第一次操作不必急著購買 CCU 或啟動 GPU。若要使用付費方案，先打開 Colab 當下的方案頁，核對價格、帳號權益、額度到期規則與硬體供應情況。

有餘額也不代表一定拿得到 G4。建立 GPU 執行階段前，先了解 Colab 可能分配的地區與硬體，再確認該執行環境是否符合模型授權。

### MiniMax H3 的地區限制是重要停步點

MiniMax H3 開放權重的授權文件目前將美國、歐盟、英國與南韓列為排除地區。上游專案表示，它測試到的 Colab G4 執行階段位於美國或歐盟；因此「成功取得 G4」不代表「可以在這個執行階段使用 H3」。

實際條款可能更新，且授權文件未必能回答每種跨境雲端情況。請直接閱讀[目前的 MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE)與上游[Colab 機房說明](https://github.com/mathruffian-dot/shanshiba-workflow-colab/blob/main/cloud/README.md)。如果地區或適用方式不清楚，不要下載或執行 H3 權重；先向權利人確認，或選擇授權明確適用的模型與雲端環境。

上游文件提到可用 IP 地理位置服務作為線索，但 IP 顯示的城市不等於法律上的機房位置證明；向第三方地理位置服務查詢也會把執行階段的公開出口 IP 傳給該服務。不要把這種查詢結果當成授權確認。

### 若已確認可以測試，再單獨檢查 GPU

只有在你已了解可能費用，並確認所在地與模型授權條件後，才考慮建立 GPU 執行階段。上游文件範例為：

~~~bash
colab new -s h3 --gpu G4
~~~

這會嘗試建立名為 `h3` 的 G4 執行階段。建立前先確認帳號餘額與當下費率；建立後，運算單元可能隨執行時間扣抵。

若不確定授權或費用，停在這裡即可。不要為了測試能否開機，就先建立 GPU 再說。

若你已確認條件並建立了執行階段，可以用 CLI 查看狀態，並依官方命令將簡單檢查傳到遠端：

~~~bash
colab status -s h3
echo 'import subprocess; print(subprocess.getoutput("nvidia-smi"))' | colab exec -s h3
~~~

`nvidia-smi` 可以顯示遠端 GPU 資訊，但只能確認硬體狀態，不能證明模型授權、商用權利或 GPU 後續仍可取得。

### 檢查完就停止執行階段

完成硬體檢查後，若不打算繼續，立即停止：

~~~bash
colab stop -s h3
colab sessions
colab usage
~~~

第一行停止名為 `h3` 的執行階段；後兩行可再次檢查目前連線與帳號用量。

關閉 Codex、終端機或瀏覽器分頁，不等於遠端執行階段已停止。每次使用後，都要親自確認 Colab session 已停止。

## 第六步：在授權允許的環境執行範例工作流

只有在 H3 授權與執行地區已確認相容、費用可接受，而且你已檢查上游腳本之後，才進入這一節。

上游專案的完整流程指令包括：

~~~bash
uv run --no-project --python 3.12 cloud/colab_h3.py start
uv run --no-project --python 3.12 cloud/colab_h3.py smoke
uv run --no-project --python 3.12 cloud/colab_h3.py film pipeline/template_local chars masters frames
uv run --no-project --python 3.12 cloud/colab_h3.py film pipeline/template_local voices h3 amb edl music ending cut review
uv run --no-project --python 3.12 cloud/colab_h3.py stop
~~~

這些不是單純查看資訊的命令：

- `start` 會建立雲端工作環境、安裝或準備多項依賴與模型。
- `smoke` 會執行多個功能檢查。
- `film ... chars masters frames` 會產生角色、場景和鏡頭首幀。
- `film ... voices h3 ... review` 會生成配音、影片與其他素材，並執行後製檢查。
- `stop` 會停止雲端執行階段；仍應用 `colab sessions` 確認停止狀態。

先檢查每個命令會下載什麼、寫入哪個資料夾、連線哪些模型服務，以及哪些階段可能消耗 CCU。不要把整段流程一次交給 Agent 自動執行；分階段審核輸出，必要時手動停止。

### 先驗收角色與首幀，再決定是否繼續

在授權與費用條件都通過後，先產生範例角色和首幀，再人工檢查角色外觀、服裝、場景與構圖。若第一張圖就偏離劇本，先修正設定，不要直接進入大量影片生成。

上游範例會把部分結果同步到專案資料夾。請核對目前版本的文件，確認實際輸出路徑與生成內容後再繼續；目錄名稱可能隨上游版本調整。

影片生成、配音、下載或 GPU 連線失敗時，可能需要排錯或重跑。失敗重跑也可能增加運算時間與額度消耗，因此不保證第一次就能完成，也不應把作者某一次測試的耗時當成你的預估值。

## 第一次測試要準備多少 CCU？

可以先參考上游作者在 **2026 年 10 月 10 日**公開的測試紀錄，但它只代表該專案版本與該次執行情況，不是 Google 的固定價目或每支影片的保證成本。

| 上游測試項目 | 作者記錄值 |
|---|---:|
| G4 測試耗用 | 約 8.90 CCU／小時 |
| 完整環境安裝 | 約 1.5 CCU |
| 單獨生成 30 鏡 H3 影片 | 約 3 CCU |
| 安裝、測試並完成 38.5 秒範例 | 合計約 8 CCU |
| 以 8.90 CCU／小時換算，100 CCU 理論值 | 約 11.2 小時 |

作者的「30 鏡影片約 3 CCU」只計算 H3 生成部分，不含所有配音、生圖、配樂與剪輯；「38.5 秒範例約 8 CCU」也不代表其他長度或不同設定會有相同消耗。

購買或啟動前，請直接查看 Colab 帳號目前的方案、費率與餘額。可以先訂一個自己願意承擔的測試上限，逐階段檢查 `colab usage`；但這只是人工預算目標，不代表 Colab 已替你設定自動硬性上限。

## 確認範例可用後，如何改成自己的影片？

上游專案以 `pipeline/template_local/film.json` 管理範例影片設定。它包含影片名稱、人物、場景、分鏡、台詞與剪輯等資料。

不要直接覆蓋原始範例。先複製成自己的工作資料夾，確認新資料夾沒有帶入舊的生成快取，再讓 Codex 協助整理設定。每次生成前，先審核劇本、角色、鏡頭、輸出比例、素材來源、預計消耗與使用授權。

### 給 Codex 的原創短劇規劃提示詞

~~~text
我已閱讀並理解這個專案的工作流。
我想製作一支自己的原創 AI 短劇，請先協助規劃，不要執行生成。

片名：《當 AI 助理請假》
影片長度：20～30 秒
比例：先依目前範例設定
風格：台灣職場喜劇
人物：一位老闆、一位 AI 助理
故事：老闆什麼都依賴 AI，結果 AI 突然宣布今天休假。

請先協助：
1. 寫出完整劇本。
2. 設計角色外觀與個性。
3. 規劃 4～6 個鏡頭。
4. 列出各鏡的角色、動作、台詞與預期畫面。
5. 說明需要修改或新增哪些檔案，以及是否會影響原始範例。

這一輪只整理提案，不要複製檔案、修改 film.json、
啟動 GPU、下載模型或產生素材。
等我確認劇本、費用與授權後，再列下一階段計畫。
~~~

讓 AI Agent 先整理可檢查的提案，等你確認後再進入會寫檔、連線或花費的操作。

如果你對「先租雲端 GPU 還是購買設備」也想比較，可以延伸閱讀[先租 GPU，還是該買 RTX 5090？](/posts/minimax-h3-gpu-rental/)；想了解 Codex 如何串起影片工作的各階段，可以接著看[用 Codex 打造 AI 影片工廠](/posts/codex-ai-video-factory/)。

## 常見問題

### Q1：MacBook M2 沒有 NVIDIA 顯示卡，也能做 AI 影片嗎？

可以用 MacBook 操作 Colab、管理專案並下載成果；需要大量 GPU 的階段則要看雲端資源是否可用，以及模型授權是否允許在該執行環境使用。這不表示所有模型都能在 Mac 本機執行，也不保證 Colab 一定提供指定 GPU。

### Q2：第一次使用 Google Colab 一定要購買 CCU 嗎？

不一定。你可以先用免費 Notebook 練習 Python 與 Colab 介面。若要取得付費方案或特定加速器，先確認帳號目前的方案與供應情況；付費也不保證分配到 G4。

### Q3：取得 Colab G4 後，就能直接執行 MiniMax H3 嗎？

不能只憑取得 GPU 就判定可以。MiniMax H3 開放權重授權目前排除美國、歐盟、英國與南韓，而上游專案回報它測試到的 Colab G4 位於美國或歐盟。執行前要確認最新授權和雲端執行環境；不確定時先停止並向權利人確認。

### Q4：關閉 Codex 或終端機，Colab GPU 會自動停止嗎？

不要這樣假設。請使用 `colab stop -s <session>` 停止遠端執行階段，再用 `colab sessions` 確認 session 已結束，並查看 `colab usage` 檢查用量。

### Q5：這套專案產出的影片可以商業使用嗎？

不能直接假設整套工作流都能商用。要逐一確認 H3、圖像與語音模型、音樂、角色素材、訓練或參考資料及輸出內容的授權；專案作者也標示部分模型僅供非商業用途。商用前請閱讀各模型與素材的現行條款。

## 參考資料與延伸閱讀

- [山獅霸 AI 影片工作流 Colab 版 GitHub](https://github.com/mathruffian-dot/shanshiba-workflow-colab)
- [山獅霸的多重宇宙｜YouTube 原始影片](https://youtu.be/rtqk8M1K85c)
- [Google Colab](https://colab.research.google.com/)
- [Google Colab 官方常見問題](https://research.google.com/colaboratory/faq.html)
- [Google Colab CLI 官方 GitHub](https://github.com/googlecolab/google-colab-cli)
- [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE)
- [uv 官方安裝文件](https://docs.astral.sh/uv/getting-started/installation/)
- [OpenAI Codex App 文件](https://developers.openai.com/codex/app)

本文依上游專案文件與官方說明整理，最後檢視日期為 2026 年 10 月 18 日。Colab 方案、GPU 供應、運算單元費率、CLI 功能與模型授權都可能更新；操作前請查看各官方頁面及專案目前版本。
