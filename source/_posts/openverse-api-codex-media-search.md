---
title: "【Openverse API 教學】用 Codex 自動搜尋影片圖片、音樂與音效"
cover: /images/cover230.png
cover_position: left center
toc: true
categories:
  - 生成式AI應用
tags:
  - 影音行銷
  - AI工具
  - AI自動化
date: 2026-10-20 05:25:08
subtitle: 從腳本拆解、素材搜尋到授權紀錄，建立可人工確認的 AI 影片素材工作流。
description: "想讓 AI 影片工作流自動找素材？本文帶你用 Codex 串接 Openverse API，搜尋開放授權圖片與音訊、整理作者與授權資訊，並在下載和剪輯前保留人工確認。"
---

用 AI 製作影片時，腳本和旁白可能很快就準備好了，接下來卻常要花時間搜尋圖片、背景音樂與環境音效。像是要剪一支 AI 發展史短片，就可能需要老電腦、科技場景和鍵盤聲等素材。

Openverse 是一個搜尋開放授權與公眾領域作品的服務，也提供 API。本文會示範如何用 Codex 建立本機搜尋工具，讓它按照影片腳本整理素材候選、預覽資訊和授權紀錄。流程會保留人工挑選：搜尋結果不等於授權已核實，也不會自動下載或剪成影片。

## Openverse、Codex 與 FFmpeg 各自負責什麼？

整套流程可以想成一條素材工作線：Codex 先把腳本拆成分鏡與搜尋詞，再透過 Openverse API 找出圖片和音訊候選；你確認內容和授權後，才下載、整理素材，最後交給 FFmpeg 或其他剪輯工具。

| 名詞 | 白話說明 |
| --- | --- |
| API | 讓程式向服務查詢資料的介面。 |
| JSON | 常見的結構化資料格式，可保存素材標題、作者、來源和授權欄位。 |
| FFmpeg | 可用指令處理、轉換及合成影音的開源工具。 |

Openverse 目前直接搜尋圖片與音訊；影片素材會由外部來源提供，因此不能把它當成可直接搜尋、下載 MP4 的影片庫。[Openverse 官方介紹](https://openverse.org/zh-tw/about)

## 開始前要準備哪些工具？

本文以 macOS 為例，會用到：

1. Codex CLI 或 Claude Code，擇一即可。本文的提示詞以 Codex 專案工作流為主。
2. Python 3，用來執行本機搜尋工具。
3. FFmpeg，等素材確認後再用來處理影片。
4. 網路連線，用來查詢 Openverse API。

如果已安裝 Homebrew，可在終端機安裝 Python 和 FFmpeg：

```bash
brew install python ffmpeg
```

確認工具可用：

```bash
python3 --version
ffmpeg -version
```

Openverse API 可以匿名查詢，初步試用不必先申請 API 金鑰；不過匿名與註冊使用者都有速率及資料瀏覽限制。若要提高呼叫量，再依官方 API 文件註冊應用程式並遵守服務條款。[Openverse API 文件](https://api.openverse.org/v1/)

## 先用 curl 試搜圖片與音訊

先確認電腦能收到搜尋結果，再請 Codex 建工具。圖片查詢範例：

```bash
curl -G "https://api.openverse.org/v1/images/" \
  --data-urlencode "q=technology" \
  --data-urlencode "page_size=3"
```

其中 `q` 是搜尋詞，`page_size` 是每頁回傳的結果數。搜尋音訊可以改用 `/v1/audio/`，例如查找雨聲：

```bash
curl -G "https://api.openverse.org/v1/audio/" \
  --data-urlencode "q=rain" \
  --data-urlencode "page_size=3"
```

回應是 JSON，可能包含標題、作者、授權名稱與版本、原始作品頁面、媒體網址及縮圖等欄位。實際欄位會依素材和 API 版本不同；請以當下 API 文件與回應為準。若收到 `429 Too Many Requests`，代表碰到速率限制，應減少請求並稍後再試，不要用大量翻頁或反覆重試來抓取整個目錄。Openverse 條款禁止以 API 爬取資料集。

## 讓 Codex 建立本機素材搜尋工具

建立專案資料夾並啟動 Codex：

```bash
mkdir -p ~/Projects/openverse-video
cd ~/Projects/openverse-video
codex
```

接著貼上這段提示詞。它要求 Codex 先做搜尋與預覽，不自行下載素材，也不安裝額外套件：

```text
請在目前專案建立一個 Openverse 圖片與音訊搜尋工具，供影片分鏡挑選素材使用。

實作要求：
1. 使用 Python 標準函式庫呼叫 https://api.openverse.org/v1/images/ 與 /v1/audio/。
2. 提供簡單的命令列介面，可指定 images 或 audio、搜尋詞、每頁筆數和授權篩選。
3. 將結果整理成 JSON，保留 id、title、creator、creator_url、license、license_version、license_url、foreign_landing_url、url、thumbnail 等 API 有提供的欄位；另記錄搜尋詞和查詢時間。
4. 產生可在本機開啟的候選預覽頁，清楚顯示縮圖、標題、作者、授權和原作品頁連結。輸出外部文字時要做 HTML escaping。
5. 429 或網路錯誤時顯示清楚訊息；不要無限重試或大量翻頁。
6. 只搜尋及產生預覽，不下載媒體、不合成影片、不把結果宣稱為已完成授權確認。
7. 不安裝套件、不讀取或建立 API 金鑰、不修改專案以外的檔案。若你認為需要新增依賴，先說明原因並等我同意。

建議目錄：
openverse-video/
├── main.py
├── README.md
├── assets/
│   ├── images/
│   └── audio/
├── metadata/
│   └── attribution.json
└── previews/
    └── index.html

請先檢查目前專案，再列出預計建立的檔案與查詢流程；確認後再實作。完成時提供一組只會搜尋少量結果的本機操作範例。
```

API 結果可用來做候選清單，但不代表媒體網址一定可下載，也不代表欄位中的授權一定正確。預覽頁應保留原作品頁，方便回到來源核對。

## 用影片腳本產生分鏡與素材候選

假設要製作一支 60 秒的直式短片，主題是「AI 如何改變我們的工作方式？」可以先把腳本拆成五段，再替每段產生數個英文搜尋詞：

| 時間 | 畫面方向 | 搜尋詞範例 |
| --- | --- | --- |
| 0–10 秒 | 傳統辦公室與紙本文件 | `old office`, `paperwork` |
| 10–20 秒 | 電腦與科技發展 | `computer technology`, `early computer` |
| 20–35 秒 | AI、自動化與機器人 | `artificial intelligence`, `robotics` |
| 35–50 秒 | 人們使用電腦工作 | `people working with computers` |
| 50–60 秒 | 未來城市與科技 | `futuristic city`, `technology` |

可以把腳本貼給 Codex，再給它以下指令：

```text
我要製作一支 60 秒、9:16 直式的知識型短影音，主題是「AI 如何改變我們的工作方式？」

請先把腳本拆成 5 個分鏡段落，每段列出畫面描述、2–4 個英文搜尋詞、建議素材類型與畫面停留時間。接著使用目前專案的 Openverse 搜尋工具：
1. 每段搜尋最多 5 張圖片候選。
2. 另外搜尋最多 3 個適合的音樂或音效候選。
3. 只把授權欄位符合我指定條件的結果列為候選；缺少授權資料的結果標示「待確認」，不要自行補值。
4. 建立 storyboard.json 和本機素材預覽頁，列出作者、來源頁、授權名稱與版本。
5. 不要下載素材、不合成影片。先讓我檢查畫面和授權，再等我選擇。
```

搜尋詞可以由 AI 根據腳本翻譯或延伸；候選內容則要由人檢查是否切題、解析度是否足夠、來源頁是否仍有效，以及授權是否符合影片用途。

## 先確認授權，再下載與整理素材

Openverse 聚合了不同來源的作品，也會呈現授權與署名資訊；但 Openverse 不會逐一核實每件作品的授權是否準確或署名是否完整。使用前要點回原作品頁，查看當前授權、作者名稱及來源資訊。[Openverse 授權說明](https://openverse.org/zh-tw/about)

常見 Creative Commons 標示可以先這樣理解：

- `BY`：使用時須依條件標示作者。
- `NC`：限非商業用途；若影片有營利或商業推廣情境，要特別檢查。
- `ND`：不得散布改作版本；若要裁切、混音或整合進影片，先確認這種使用是否允許。
- `SA`：散布改作作品時，須遵守相同或相容的授權條件。
- `CC0`：作者以公眾領域貢獻方式放棄權利，但仍建議留下來源紀錄。

Creative Commons 授權也不一定涵蓋肖像、商標、隱私或其他第三方權利。詳細條件依作品使用的授權版本與來源頁為準。[Creative Commons 授權說明](https://creativecommons.org/share-your-work/cclicenses/?utm_source=chatgpt.com)

確認要使用的作品後，再下載到專案資料夾。建議每筆素材至少保留：

```json
{
  "title": "作品標題",
  "creator": "作者名稱",
  "creator_url": "作者頁網址",
  "license": "授權名稱",
  "license_version": "授權版本",
  "license_url": "授權網址",
  "foreign_landing_url": "原作品頁網址",
  "media_url": "下載的媒體網址",
  "search_query": "使用的搜尋詞",
  "retrieved_at": "查詢或下載日期時間",
  "local_file": "assets/images/檔名.jpg"
}
```

實際欄位可依 API 回應調整；請保留當時取得的原始資訊，並記錄你選用了哪個檔案。這樣日後替換素材或檢查署名時，能追溯到作品來源。

## 把已確認素材交給 FFmpeg 剪輯

素材經過挑選、下載及授權核對後，才進入剪輯。FFmpeg 適合做基本合成與批次處理；需要細緻調色、混音或逐格調整時，也可以改用 DaVinci Resolve、Remotion 等工作方式。各工具的安裝與操作方式會依電腦環境而不同。

給 Codex 的剪輯指令可以寫成：

```text
請只使用 storyboard.json 中標記為「已確認」且已下載的本機素材，先整理剪輯計畫，包含素材順序、各段秒數、Ken Burns 推近或平移效果、轉場、旁白和背景音量。

目標規格：
- 長度：60 秒
- 畫面：1080 × 1920、9:16
- 輸出：MP4、H.264、30 FPS
- 依 storyboard.json 排列素材，避免人物或重要物件被裁切。
- 若沒有旁白音檔，輸出無旁白版本；不要假裝已產生配音。
- 使用已確認授權的音樂與音效，並整理 credits.md。
- 輸出影片與檢查報告到 outputs/。

請先顯示剪輯計畫，等我確認後再開始渲染。若素材、檔案或授權狀態不清楚，先提出問題，不要自行替換。
```

不要只看 FFmpeg 是否回報成功；輸出後仍要檢查影片長度、解析度、聲音、字幕與畫面裁切，並實際播放確認結果。

## 把重複流程整理成 Codex Skill

如果每次都要重新說明搜尋和授權規則，可以把確認過的流程整理成專案內的 Skill，例如：

```text
.agents/skills/openverse-media/
├── SKILL.md
├── scripts/
│   ├── search_media.py
│   ├── download_media.py
│   └── check_license.py
└── references/
    ├── api.md
    └── license-policy.md
```

往後可以用一句話啟動，例如：「請依影片腳本整理 Openverse 圖片與音訊候選，保留授權紀錄並等我確認。」Skill 應清楚說明它能搜尋哪些媒體、把檔案存在哪裡、如何保存署名，以及哪些動作必須等使用者確認。不要讓自動化跳過授權核對或擅自使用付費服務。

## 從 V1 開始，逐步擴充剪輯工作流

可以分三階段建置：

1. **V1 素材搜尋助理：** 依分鏡搜尋候選、預覽並整理授權資訊；先驗證搜尋與紀錄流程。
2. **V2 剪輯助理：** 在人選定並核對素材後，加入旁白、字幕、音樂、轉場與 FFmpeg 輸出。
3. **V3 素材庫：** 整合其他授權來源、素材去重、快取與重複使用紀錄；再次使用素材時仍要保留原授權條件。

第一次先把 V1 做穩，比一開始就要求 AI 自動完成整支影片更容易檢查和修正。

延伸閱讀：[AI 影片製片 SOP：從分鏡到粗剪](https://blog.es2idea.com/posts/ai-film-production-sop/)、[從 Prompt 到專家 Skill 的 AI 影片工作流](https://blog.es2idea.com/posts/ai-video-production-workflow/)。

## 常見問答 (FAQ)

### Q1：使用 Openverse API 需要申請金鑰嗎？

基本搜尋可先用匿名請求，不必一開始申請 API 金鑰；但匿名使用也有速率和資料瀏覽限制。若應用需要較高呼叫量，再查看官方註冊與授權方式。

### Q2：Openverse API 可以搜尋影片嗎？

Openverse 目前直接搜尋圖片和音訊；影片搜尋由外部來源提供。本文的工作流以圖片、音樂和音效候選為主，不會直接從 Openverse 搜尋 MP4 影片檔。

### Q3：Openverse 找到的素材都能商用嗎？

不能一概而論。每筆作品有不同授權，而且 Openverse 不保證作品授權或署名資料完全正確。要回到原作品頁核對授權條件、作者與其他可能涉及的權利。

### Q4：可以讓 Codex 找到素材後直接下載和剪片嗎？

可以請 Codex 建立搜尋、下載和 FFmpeg 處理工具；但建議先預覽候選並人工確認素材內容與授權，再允許下載或渲染，避免把錯誤的授權資訊一路帶進成品。

### Q5：第一次應該先做哪一部分？

先完成素材搜尋、候選預覽和署名紀錄。確認這些步驟可靠後，再增加自動下載、分鏡排列、字幕與影片渲染。

## 相關資源

- [Openverse 繁體中文網站](https://openverse.org/zh-tw?utm_source=chatgpt.com)
- [Openverse API](https://api.openverse.org/v1/?utm_source=chatgpt.com)
- [Openverse GitHub 專案](https://github.com/WordPress/openverse?utm_source=chatgpt.com)
- [Openverse 開發文件](https://docs.openverse.org/?utm_source=chatgpt.com)
- [Creative Commons 授權說明](https://creativecommons.org/share-your-work/cclicenses/?utm_source=chatgpt.com)
