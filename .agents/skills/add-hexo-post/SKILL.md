---
name: add-hexo-post
description: 將使用者提供的文章初稿依專案內 prompt/hexo-post.md 整理成 SEO 友善的 Hexo 文章，先提供英文 slug 候選供選擇，再以 hexo new 的原始建立時間建立文章、清除 scaffold 殘留、補充 FAQ、生成或依需求重做 1200x800 AI 封面、完成本機與正式站驗收，並在分支目的地明確確認後以繁體中文 commit 並 push 到 main。當使用者要新增、整理、發布、重做未提交文章封面或上線一篇 AI-Consultant Hexo 部落格文章時使用。
---

# 新增 Hexo 文章

## 目標與範圍

在目前專案根目錄執行一套可驗證的文章發布流程。文章內容以 `prompt/hexo-post.md` 為整理規則，專案的 `README.md`、`package.json`、`_config.yml` 與 `docs/site-maintenance-runbook.md`（若存在）為部署與驗收依據。

只處理本次文章需要的檔案。不要把 `public/`、暫存檔、未相關的工作區變更或本機工具狀態加入 commit。

## 實際專案優先與狀態分層

- 先以實際檔案、`package.json` scripts、workflow 與目前 Git 狀態為準；skill 中的指令若在本專案不存在，不要硬執行或自行新增 script。
- 缺少 `docs/site-maintenance-runbook.md`、npm script 或其他文件時，記錄為「未提供／未執行」，改用專案現有工具與等價唯讀檢查，不要把不存在的檔案或指令當成已通過。
- 分開回報「文章檔案已建立」「封面已產生」「本機 build 通過」「已 commit」「已 push」「Actions 成功」「正式 canonical URL 可讀」。其中任一狀態未完成，不得合併宣稱為已上線。
- 執行會修改檔案的步驟前先確認範圍；除非使用者明確要求，不能因後續驗證失敗自行刪除 `hexo new` 產物、封面或暫存備份。

## 不可違反的確認關卡

在以下兩個時間點停下來等待使用者明確回覆：

1. **Slug 確認**：分析初稿後列出 3–5 個全小寫英文 slug，標示精確型、行動型或簡潔型與選擇理由。使用者選定前，不要執行 `hexo new`、生成圖片或修改文章檔案。
2. **Push 確認**：本機驗收完成後，列出文章路徑、正式網址、cover 檔案、原始建立時間、目前分支、預計部署分支、驗證結果與預計 commit message。只有使用者回覆「沒問題，push 到 main」或同等明確授權後，才可 commit 與 push。

分支目的地是不可省略的確認資訊：

- 如果目前已在 `main`，摘要可說明「目前在 main，回覆『沒問題，push』即可」；但仍須先取得明確 push 授權。
- 如果目前不是 `main`，單獨的「沒問題，push」不授權切換分支、合併既有 commit，或使用 `HEAD:main` 這類 refspec 將整個目前分支推到 `main`。必須請使用者明確指定「切到 main 後 push」、「只把本次文章 commit 到 main」或其他目的地。
- Push 前若發現目前分支含有不屬於本次文章的獨有 commit，不得默默合併或一併部署；要在摘要中列出差異並等待方向。

若使用者只選了 slug，繼續建立與驗收，但仍要在 push 前再次等待確認。若使用者沒有明確同意，不要自行切換分支、合併、刪除失敗產物或推送。

## 執行前檢查

先確認目前工作區與專案邊界：

```bash
pwd
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
git remote -v
```

確認目前根目錄是本 Hexo 專案，並唯讀讀取下列檔案：

- `README.md`
- `prompt/hexo-post.md`
- `package.json`
- `_config.yml`
- `docs/site-maintenance-runbook.md`（若不存在，記錄後繼續使用 README、workflow 與實際 scripts）

讀取 `package.json` 後先列出實際可用的 scripts。後續只執行存在的 script；例如本專案目前有 `verify:post-dates`、`build`、`server`、`verify:jsonld`，但不一定有 `verify:post-metadata`、`verify:build-output` 或 `verify:jsonld:local`。缺少的檢查要改用本節的等價驗證，不要把 npm 的 `Missing script` 當成文章內容錯誤。

另外檢查 index 與工作樹的分層狀態：

```bash
git status --short --branch
git diff --cached --name-status
git diff --name-status
```

若 `git diff --cached --name-status` 已有使用者原本的 staged 變更，先停下來區分 index，不能替使用者取消 stage 或混入本次 commit。若有未提交變更，保留並在最後明確列出未納入本次交付的檔案。

保留使用者原有的未提交變更。若初稿未在對話中提供，先請使用者提供初稿或檔案位置；不要自行產生主題內容。

若目前分支不是 `main`，可以先完成文章與本機驗收，但在 push 前說明：本 repo 的 GitHub Actions 只有 `main` push 會部署到 `gh-pages`。先用下列唯讀資訊判斷目前分支是否含有額外歷史：

```bash
git branch -vv
git rev-list --left-right --count origin/main...HEAD
git log --oneline --decorate --graph -8 --all
```

不要直接執行 `git push origin HEAD:main`，因為它可能把目前分支的其他 commit 一起送進正式分支。只有在使用者明確授權分支處理後，才可在沒有 tracked 工作樹衝突、且目標文章與 cover 尚未被 `main` 追蹤的前提下切到 `main`，再重新檢查狀態並只 stage 本次 deliverables。不要未經同意直接切換、合併、cherry-pick、刪除失敗產物或推送。

## 文章整理規則

### 1. 分析初稿並提供 slug

讀取 `prompt/hexo-post.md`，只採用它的輸出規格與內容整理規則，不輸出或要求模型的隱藏思考過程。保留初稿可驗證的事實、連結、程式碼與作者觀點，不捏造數據、案例、工具功能或引用來源。若初稿描述模型強項、版本或工具比較，視為作者提供的工作流示例，不要升級成永久排名；保留時加上能力會隨版本與方案變動的限制，只有使用者要求最新比較時才另外查證。

輸出 3–5 個 slug 候選，遵守：

- 僅使用小寫英文字母、數字與單一連字號。
- 以 3–6 個單字為優先，避免日期、版本號與無意義停用詞。
- 至少涵蓋一個精確型、一個 `how-to`／`guide` 行動型，以及一個簡潔型。
- 說明每個候選包含的核心關鍵字與適合的搜尋意圖。

等待使用者選擇後，再檢查 `source/_posts/<slug>.md` 是否已存在；若已存在，停止並提供替代 slug，不要覆寫舊文章。

### 2. 先建立文章，再保留 Hexo 原始時間

使用選定的 slug 執行本機 Hexo：

```bash
./node_modules/.bin/hexo new "<slug>"
```

立即讀取新檔案 front matter，保存 Hexo 產生的完整 `date` 值。這個值是文章唯一的發布時間來源。整理後內容中的日期、初稿日期或提示詞範例日期都不得覆蓋它。

`hexo new` 產生的是 scaffold，不一定是空白檔案；本專案曾出現新檔案夾帶其他文章的 iframe、標題、分類或 tags。讀取 date 後，將 scaffold 的 body 與除了 `date` 以外的預設 front matter 視為可丟棄內容，完整改寫成這次文章，不要在舊內容後面追加。寫入後先檢查檔案開頭與全文，確認沒有殘留無關的文章標題、Gamma／YouTube iframe、舊 tags 或其他文章段落，再進入封面與 build 流程。

不要只檢查 front matter；要對 scaffold 全文做殘留掃描。至少確認以下內容不屬於本篇時已清除：舊文章標題、舊 `cover`、舊 categories/tags、`<iframe>`、`gamma.app/embed`、無關品牌或工具名稱、上一份文章的段落與連結。若發現殘留，完整重寫檔案，不要在殘留內容後追加新稿。

將整理後內容寫入 `source/_posts/<slug>.md`，並確保 front matter 至少包含：

```yaml
title: SEO 友善的繁體中文標題
cover: /images/default-cover.png
toc: true
categories:
  - 一個精確分類
tags:
  - 一到三個標籤
date: <Hexo new 產生的原始 date>
subtitle:
description: 70–150 字元、準確且具點擊動機的摘要
```

遵守以下內容規則：

- `date` 必須逐字保留 `hexo new` 產生的值。production HTML／JSON-LD 可能將相同時間轉成 UTC（例如跨日顯示），不要因時區格式不同回頭覆蓋 source front matter；以 `hexo new` 讀到的原始字串為準。
- `cover` 先使用 `/images/default-cover.png`，生成新圖後再替換。
- `categories` 使用一個精確分類；`tags` 控制在 1–3 個，優先採用既有受控字典與專案慣用名稱。
- 標題階層以 `##`、`###` 為主；程式碼區塊必須標示語言。
- 可在內容自然的位置加入 1–3 個相關站內文章連結，但先搜尋既有文章確認路徑，不要編造網址。
- 若初稿提供的 Facebook 或其他外部原文連結無法抓取、需要登入或受到節流，保留使用者提供的原始連結，不要臆測不可存取的內容，也不要擅自換成未確認的網址。
- 不要把 prompt 末尾的 slug 建議區塊寫進正式文章；slug 只用來決定檔名與網址。

### 3. 補充 FAQ 與 AEO 結構

在文章最後加入 3–5 組確實能由文章回答的 FAQ，不要用空泛問題灌水。使用主題的可解析格式：

```markdown
## 常見問答 (FAQ)

### Q1：讀者最可能提出的問題？

直接、完整且可獨立引用的回答。

### Q2：另一個具體問題？

直接、完整且可獨立引用的回答。
```

問題要涵蓋讀者的搜尋意圖，例如適用情境、操作限制、成本／前置條件、常見錯誤或選型差異。答案必須與文章內容一致；需要外部即時資料才能回答時，先標記並詢問使用者，不要猜測。

FAQ 標題必須包含 `FAQ`、`常見問答`、`常見問題` 或 `疑難雜症`，並至少保留兩組有效問答，讓主題能產生 FAQPage JSON-LD。

## 封面圖流程

### 1. 選擇下一個編號

先檢查目前封面並以數字排序，不能只依檔案列出順序判斷。使用輔助腳本取得最大編號之後的第一個可用檔名：

```bash
node .agents/skills/add-hexo-post/scripts/cover-guard.js next themes/hexschool/source/images
```

若輸出為 `cover132.png`，就使用該檔名；若該檔案在流程中途出現，重新執行檢查並改用下一個可用編號。預設絕不覆寫既有 cover，只有下方「未追蹤當次 cover 的明確重做」例外流程可替換。

`cover-guard normalize` 會刻意拒絕把輸出直接寫到已存在的檔名。若只是本次流程剛產生、尚未被 Git 追蹤的 cover，且使用者在 push 前明確要求重做封面，可以採安全替換流程：先把原檔複製到 `mktemp -d` 建立的暫存備份，將新圖 normalize 到另一個暫存檔並完成 `view_image`／尺寸檢查，最後才以新檔替換當次未提交 cover，再重新 verify。若 cover 已被 Git 追蹤或已發布，不能覆寫，必須重新取得下一個可用編號並同步更新文章 front matter。

重做既有未提交 cover 時，先用 `view_image` 看原圖，再以 `referenced_image_paths` 讓 imagegen 參考它；prompt 要寫明哪些區域是不可變的。輸出後要對照原圖檢查右側主視覺、比例、色彩與重要符號仍在；若模型把整張圖不必要地重新構圖，視為新版本重新審查，不要只因文字變漂亮就直接替換。

### 2. 生成符合現有風格的圖片

生成前先用 `view_image` 檢查至少一張最新 cover，延續目前高對比、科技感、適合文章列表縮圖的視覺方向；若使用者提供圖片，也要先檢查該圖片，再決定直接使用或作為參考。使用內建 `image_gen` 工具；遵循 `imagegen` skill 的保存與檢查規則，最後一定要把專案使用的檔案放進 `themes/hexschool/source/images/`。

內建 imagegen 通常會把檔案放在 workspace 之外的 generated-images 目錄；若工具回傳 `output_hint`，使用其中的本機檔案路徑作為 normalize 輸入，先用 `view_image` 檢查，再複製／正規化到專案。不要把巨大 base64 回應當成檔案內容，也不要只把 cover 留在 generated-images 目錄。

呼叫 imagegen 後只擷取工具結果中的 `output_hint` 或本機路徑，不要把完整工具回應／base64 印回對話或當成檔案內容；有些結果只在文字訊息中回傳路徑、沒有結構化 `output_hint`，此時只取可確認的第一個本機圖片路徑，再用 `view_image` 確認。

#### 封面參考圖與文案鎖定

- 若使用者提供的是直式人物海報、資訊圖或含大量小字的圖片，預設把它當作視覺／人物參考，不要直接裁切成橫式 cover；以 `referenced_image_paths` 讓 imagegen 重新構圖。只有使用者明確要求原圖直接作封面時，才採用直接正規化流程。
- 若要保留人物、品牌主視覺或重要符號，先在 prompt 明確寫出不可變區域（人物身份、服裝、主色、位置、比例與重要符號），並要求不要複製原始海報的小字與版面；輸出後要對照參考圖檢查主視覺是否仍在。
- 呼叫 imagegen 前先建立「文案鎖定」：逐字列出 kicker／小標、主標、hook；最多三層，主標最大、hook 次之、小標最小，禁止模型自行增加工具名稱、網址、FAQ、按鈕或其他小字。中文文案越短越好，優先使用 1 句痛點／轉變 hook，避免把完整文章標題塞進圖片。
- 若主題沒有必要的人物或產品，不要為了填版面加入人物、品牌 logo 或無關圖示；視覺符號應服務文章能力與流程，例如文件、圖片、影片、波形、剪刀、圖層、程式碼括號與 workflow 節點。

根據文章主題寫具體 prompt，至少包含：

- 1200 × 800、3:2 橫式文章封面構圖。
- 深色科技背景，搭配藍、紫、青、橘或黃色高對比光效；不要照抄單一既有 cover。
- 2–5 個與文章主題有關的 AI 視覺符號，例如 AI 大腦、聊天泡泡、workflow 節點、程式碼括號、資料流、automation spark；不要無關地塞入品牌 logo。
- 一句根據文章內容產生的短 hook 文案，放在左側或上方的大字區；文案要有點擊動機但不能誇大或捏造成果。若主題需要更強的縮圖訊息或使用者要求更吸引人，可改成最多三層文字：小標／kicker、主標、hook；每層都要提供精確逐字文案，主標最大、hook 次之，小標最小，不要塞入完整標題或 FAQ。
- 人物、產品畫面或工具 logo 只有在文章確實涉及時才加入。
- 不要水印、不要額外小字、不要無法辨識的假按鈕、不要與文章無關的品牌標誌。

對 imagegen 產出的結果做三層視覺驗收：先以 `view_image` 檢查原尺寸的構圖與人物／主視覺，再以縮小預覽檢查左側文字層級、對比與列表縮圖可讀性，最後才做尺寸／格式驗證。逐字核對 kicker、主標與 hook 是否與文案鎖定完全一致；若有錯字、變形、裁切、文字過小、對比不足、主視覺消失或只剩泛泛口號，針對文案與版面重新生成。若兩次以上仍不穩定，先向使用者回報，不要把明顯錯字或不可辨識的封面提交上線。

將結果正規化為 PNG、1200 × 800；保持比例，必要時以中央裁切，不要直接拉伸變形：

```bash
node .agents/skills/add-hexo-post/scripts/cover-guard.js normalize <imagegen-output> themes/hexschool/source/images/cover<N>.png
node .agents/skills/add-hexo-post/scripts/cover-guard.js verify themes/hexschool/source/images/cover<N>.png
```

確認輸出檔名不存在後，將文章 front matter 的 `cover` 改為：

```yaml
cover: /images/cover<N>.png
```

### 3. Cover prompt 的內容原則

從文章標題、讀者痛點與核心成果萃取 hook。優先使用「痛點＋轉變」、「別再……」、「從……到……」等結構；保持短、清楚、可在縮圖閱讀。不要在圖片中放完整文章標題、FAQ、網址或未經證實的數字。

## 本機驗收

完成文章與 cover 後，依序執行：

```bash
npm run verify:post-dates
npm run build
node tools/validate-jsonld.js --mode=local --paths=/posts/<slug>/ --public-dir=public
git diff --check
```

先以 `npm run` 確認 script 是否存在。`verify:post-metadata`、`verify:build-output`、`verify:jsonld:local` 若不存在，不要自行修改 `package.json` 來補別名；改做以下等價檢查並在交付摘要標明「等價驗證」：

- **metadata**：讀取 `source/_posts/<slug>.md` front matter，確認 `title`、`cover`、`toc: true`、恰好一個 category、1–3 個 tags、非空 `date`、70–150 字元 `description`、FAQ 區塊與至少 3 組有效問答。
- **build output**：確認 `public/posts/<slug>/index.html`、`public/images/cover<N>.webp` 與 source 的 `cover<N>.png` 存在；production HTML 包含文章標題、`cover<N>.webp`、`FAQPage` 與至少 3 個 `Question`。
- **JSON-LD local**：本專案的 `tools/validate-jsonld.js` 以 `--mode=local` 參數切換本地檢查，正確呼叫是 `node tools/validate-jsonld.js --mode=local --paths=/posts/<slug>/ --public-dir=public`，不要假設有 `verify:jsonld:local` npm alias。

另行確認：

- `public/posts/<slug>/index.html` 存在。
- 文章頁 HTML 含文章標題、`cover<N>.webp` 引用與 FAQPage JSON-LD；FAQ 至少有 3 組 `Question`。
- `public/posts/<slug>/index.html` 沒有引用不存在的圖片。
- `cover<N>.png` 仍是 source 目錄中的 1200 × 800 原始資產；`public/` 只是產物，不要加入 Git。

驗證新文章本身時，避免把整個 repo 的既有警告誤判為本次失敗；報告檢查範圍與結果，並只修正本次文章或 cover 造成的問題。

檢查圖片引用時要區分建置階段：`npm run build` 會由 `toWebp` 產生並改寫 production HTML 的 `cover<N>.webp`；Hexo 開發伺服器直接讀 source 時，頁面可能仍引用 `cover<N>.png`。因此 production 檢查 `public/` 的 WebP，local server 則確認 source PNG 能以 HTTP 200 讀取，不要因副檔名不同誤判。

若需要自行檢查 HTML 的本地 `href`／`src`，先對 URL path 執行 `decodeURIComponent` 再映射檔案路徑；中文分類與 tags 常以 `%E...` 編碼，未解碼的檢查器會把實際存在的頁面誤報為 missing。優先使用專案既有 validator，不要用未處理 URL encoding 的簡易 regex 取代它。

`git diff --check` 只會檢查 tracked diff；新文章與新 cover 在 stage 前可能完全不會被它掃到。對尚未 stage 的新 Markdown 另外執行尾端空白檢查，例如：

```bash
if rg -n '[[:blank:]]+$' source/_posts/<slug>.md; then exit 1; fi
```

啟動本機伺服器完成實際頁面檢查：

```bash
npm run server -- --port 4000
```

等待 `http://localhost:4000/posts/<slug>/` 可讀取後，確認文章標題、封面、標題階層、FAQ 與程式碼區塊正常。只停止自己啟動的伺服器程序，不要使用廣泛的 `pkill` 或殺掉使用者既有的服務。

若任一檢查失敗，先修正並重跑相關檢查。若 `hexo new` 已建立文章但後續失敗，不要自行刪除；回報已建立的檔案與失敗原因，等使用者決定是否清理。

## Commit、Push 與正式站驗收

本 repo 的正常部署入口是 `main` push 觸發 GitHub Actions，不能把 `hexo deploy` 當成一般發布路徑。部署流程會將建置結果寫入 `gh-pages`。

在 push 確認前，提供以下摘要：

```text
文章：<title>
Slug：<slug>
文章檔案：source/_posts/<slug>.md
Hexo 原始建立時間：<date>
封面：themes/hexschool/source/images/cover<N>.png（1200 × 800）
正式網址：https://blog.es2idea.com/posts/<slug>/
驗收：列出每個通過的檢查
```

使用者明確確認後，重新檢查 branch 與狀態，只加入本次 deliverables：

```bash
git branch --show-current
git status --short --branch
git add -- source/_posts/<slug>.md themes/hexschool/source/images/cover<N>.png
git diff --cached --check
git diff --cached --stat
git diff --cached --name-status
```

只有在目前分支已明確確認為部署目的地，且 staged name-status 只包含本次文章與 cover 時才可繼續。若工作區原本已有 staged 變更，不要替使用者取消 stage 或混入本次 commit；先停下來區分 index 狀態。

確認 staged diff 沒有不相關檔案後，使用詳細繁體中文 commit message，包含文章、原始建立時間、FAQ、cover 尺寸與部署驗收意圖，例如：

```text
新增文章：<文章標題>

- 依 Hexo new 保留原始建立時間：<date>
- 整理 SEO metadata、FAQ 與文章結構
- 新增 1200x800 AI 封面：cover<N>.png
- 由 main push 觸發 GitHub Actions 部署
```

接著執行：

```bash
test "$(git branch --show-current)" = main
git push origin main
```

不要 force push，不要推送 `gh-pages`，不要直接修改 `gh-pages`，也不要使用 `git add .`。

Push 後使用本次 commit SHA 對應的 GitHub Actions 檢查方式觀察本次 workflow，不要只看 branch 最新一筆可能屬於其他 commit 的 run：

```bash
gh run list --branch main --limit 8 --json databaseId,status,conclusion,workflowName,headSha,url
gh run watch <run-id> --exit-status
```

優先使用已登入的 `gh run list`／`gh run watch` 或 GitHub 介面，並以 `headSha` 等於本次 commit SHA 為篩選條件。不要預設 workflow 一定有名為 `Build and verify` 與 `Deploy to gh-pages` 的兩個 job；有些版本是單一 `build` job 裡依序執行 `Build` 與 `Deploy to gh-pages` steps。以實際 `gh run watch` 顯示的 job／step 名稱回報，確認 build 與 deploy 實際成功即可。Actions 的成功結論與 Node.js deprecation 等 warning 要分開回報；warning 不等於部署失敗，但不能省略。

```bash
curl --fail --silent --show-error --location --retry 5 --retry-delay 5 \
  https://blog.es2idea.com/posts/<slug>/
```

正式站至少確認 HTTP 2xx、文章標題、`cover<N>.webp`、FAQPage JSON-LD 與文章內容存在，並另外請求 cover URL 確認圖片 HTTP 200。第一次探測 canonical 或 cover 時不要使用會吞掉 404 的 `curl --fail` helper；先保存 response 與 HTTP code，再決定是否重試。zsh 的 `status` 是唯讀特殊變數，HTTP 檢查請使用 `page_http_code`、`cover_http_code` 等名稱；若用 Node 解析保存的 HTML，不要直接引用未 export 的 shell 區域變數，讓 shell 負責判斷 HTTP code、Node 只負責讀檔案內容。

若 canonical URL 初次回傳 404，不要先讓「只接受 2xx 的 retry helper」重試到丟出例外而跳過後續判斷；要保留 404 response，立即區分部署內容與邊緣快取：

1. 用 `gh api repos/<owner>/<repo>/contents/posts/<slug>/index.html?ref=gh-pages` 確認 `gh-pages` 是否已有該檔案。
2. 必要時讀取該檔案的 `raw` URL，確認部署產物不是空缺。
3. 對正式 URL 加上 commit SHA 的 query string，並使用 `Cache-Control: no-cache` 重試；例如 `https://blog.es2idea.com/posts/<slug>/?v=<commit-sha>`。若同一 query key 仍命中舊 404，但 `gh-pages` raw 已 200，改用新的唯一 suffix（例如 `?v=<commit-sha>-verify-1`）再測，不要把單一 query key 的快取結果當成部署結果。
4. 封面也要用實際 production URL（通常是 `cover<N>.webp`）做 cache-busting HTTP 檢查，不要只檢查文章 HTML。
5. 若 `gh-pages` 已有檔案、cache-busting URL 與封面已 200，但無 query 的 canonical URL 暫時仍 404，狀態應回報為「部署成功、等待快取更新」，持續重試但不要把暫時 404 宣稱為永久失敗。

若 Actions 尚未完成，回報「已 push、等待部署」；若 Actions 成功但上述正式站驗收尚未通過，回報「部署成功、等待快取更新／正式站驗收未完成」，不要宣稱已完成。

Push 後最後再執行 `git status --short --branch`。若仍有使用者原本的 `.agents/`、`prompt/hexo-post.md` 或其他未相關變更，不要稱為 clean tree；清楚列出它們未被本次 commit 納入即可。

## 失敗與安全邊界

- 不讀取或輸出 `.env`、token、SSH key、私人資料或設定檔中的秘密值。
- 不安裝第三方 plugin、skill 或外部 CLI；缺少必要工具時先回報並等待指示。
- 不覆寫既有文章或 cover；slug、日期與圖片編號都要先驗證。
- `cover-guard normalize` 拒絕覆寫是預期的安全行為；只有本次尚未追蹤且使用者明確要求重做的 cover，才可依「暫存備份→暫存 normalize→視覺檢查→替換→verify」例外流程處理。
- 不因 `npm run` 缺少 skill 文件中舊有的 alias 就自行改 package 或宣稱驗證失敗；改用專案現有 validator 與等價唯讀檢查，清楚記錄缺少項目。
- 不因 build 成功就跳過實際文章頁、圖片、FAQ JSON-LD 與正式網址檢查。
- 不把「本機 build 通過」、「push 成功」、「Actions 成功」、「正式網址可讀」混為同一個狀態。
- Actions workflow 的 job／step 名稱以實際 run 為準；不要因名稱與 skill 範例不同而誤判部署失敗。

## 輔助資源

- `scripts/cover-guard.js`：取得下一個 cover 編號、將 imagegen 輸出裁切正規化為 1200 × 800 PNG，並驗證檔案尺寸與格式。
