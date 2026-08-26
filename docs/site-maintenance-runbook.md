# Hexo 發布與正式站驗收 Runbook

適用於本專案的文章、封面與 GitHub Pages 發布。這份文件把「本機完成」「Git 完成」「部署完成」與「訪客看到最新內容」拆成獨立證據，不因其中一層成功就代稱全部完成。

## 1. 這次復盤留下的硬規則

2026-08-26 的 n8n 文章發布實際遇到：

- 新封面第一版雖然有 terminal 與 AI 字樣，但使用者指出「沒有 n8n 的感覺」；第二版改成可辨識的 workflow node、Webhook、AI、Sandbox 與人物，並補上 `Docker × AI Assistant × Sandbox`、`一行把自架環境準備好` 這類直接說明轉變的 hook。
- GitHub Actions 的 run 先排隊，`gh run watch` 中途因 GitHub API 連線逾時退出；改用同一個 run ID 的 `gh run view`，確認 `headSha`、job 與每個部署 step 後，才判定成功。不能因 watch 中斷就重送 push。
- `gh-pages` API／raw 已有文章與封面，但自訂網域的文章頁與封面曾先回 404；之後唯一 query 的文章與封面回 200。文章裸網址先恢復 200，封面裸網址仍被 Cloudflare `cf-cache-status: HIT` 快取舊 404。這代表部署成功、封面 CDN 尚未更新，不是缺少 commit，也不是要再提交同一份內容。
- 本次只提交文章與新版封面；`.agents/`、其他文章、舊封面、`.playwright-cli/`、`output/` 等工作區檔案均保留，沒有使用 `git add .`。

由此固定以下判讀：

1. 產品／工具型封面要先回答「這是什麼」，再談科技感。若使用者指出「沒有某產品的感覺」，重新定義視覺命題與產品語意，不只增加光效或 icon。
2. 新模式、新功能或一行安裝文章的 hook，至少要說清楚「一次準備了什麼」或「讀者會從哪裡到哪裡」；每一行文字先列白名單，縮圖仍須可讀。
3. 參考封面只萃取版型語法與閱讀順序；超大主標、粗描邊／偏移陰影、強烈兩色與底部箭頭 hook 都是可選效果，不能整套當成固定模板。
4. 主標尺寸先由短文案、1200×800 安全區與實際列表卡片共同決定；若需要跨安全區、堆更重字效或把 hook 貼到邊緣才能成立，代表版面尚未通過。
5. Actions、`gh-pages`、canonical HTML、canonical media 是四個不同 gate；cache-busting URL 只用來診斷，不取代裸網址驗收。
6. GitHub API／CDN 出現網路逾時或排隊時，先查同一個 run／commit 的狀態，不要另開 run、重複 push 或把 transport error 當成內容失敗。

### 1.1 封面主標排版復盤 gate

主標的任務是讓讀者在文章列表縮圖先讀到「這篇文章要解決什麼」，不是把參考圖的所有效果同時打開。參考 `.agents/skills/add-hexo-post/assets/02-YT封面範例01.png` 或其他封面時，只借鑑層級、動線與字效語法，不複製原始文案、品牌、圖示或固定比例。

| 排版元素 | 這次暴露的問題 | Runbook 放行條件 |
| --- | --- | --- |
| 超大主標 | 為了吸睛把完整標題塞進圖，造成貼邊、背景被壓扁，或列表卡片裁掉字 | 先縮短成核心主標，再在 1200×800 內預留左右至少 72px、上下至少 56px；桌面與手機卡片都能讀完，不靠放大掩蓋文案過長 |
| 粗描邊／陰影 | 描邊吃掉中文字內孔，多重重影讓主標變髒，字效反而搶走內容 | 以單層描邊或單一方向偏移陰影為主；若兩者並用要降低其中一者，不再疊發光、3D bevel、多重陰影；縮圖仍看得見字內留白 |
| 強烈兩色層級 | 兩行同樣大、同樣飽和，變成兩個平行主標，顏色也和文章無關 | 一個主色承擔主要訊息，強調色只標示一個關鍵詞或一行；主次仍靠尺寸、位置、留白與字重建立，移除顏色後仍讀得出層級 |
| 底部箭頭 hook | 箭頭像貼紙／CTA，貼底後在 `object-fit: cover` 卡片中消失，或變成第三個主標 | 只在文章有流程、轉變或結果方向時使用；一句短文案加一個箭頭，位於底部安全區且小於主標，不貼邊、不做按鈕、不重複標題；沒有功能就刪除 |

執行順序固定為：**分析標題與內文 → 鎖定 kicker／主標／hook 逐字文案 → 決定斷行與文字盒 → 選風格與字效 → 產生無文字背景 → 以 deterministic overlay 放入文字 → 檢查原圖、480px 縮圖、桌面卡片與手機卡片**。若文字盒放不進安全區，先改寫或減字，不要用更粗描邊、更重陰影、更大字或貼邊 hook 修補。

任何一項出現以下狀況即退回重排：主標需跨出安全區、描邊填死中文筆畫、兩色沒有語意主次、箭頭 hook 沒有轉變功能、縮圖先看到人物／icon／hook，或原圖正確但實際列表卡片裁掉關鍵字。詳細生成與視覺評分規則見 [`add-hexo-post` skill](../.agents/skills/add-hexo-post/SKILL.md)。

## 2. 發布前：確認邊界與提交範圍

在專案根目錄執行：

```bash
pwd
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
git diff --cached --name-status
git diff --name-status
```

若 index 已有使用者 staged 變更，先停下來區分它們；不要取消 stage，也不要混入本次交付。記錄未納入的 `.agents/`、`assets/`、舊 cover、暫存輸出與其他文章。

文章／封面發布只用明確路徑：

```bash
git add -- source/_posts/<slug>.md themes/hexschool/source/images/<cover-file>
git diff --cached --check
git diff --cached --name-status
git diff --cached --stat
```

文件或 skill 復盤則只加入明確的文件與 skill 路徑，例如：

```bash
git add -- README.md docs/site-maintenance-runbook.md .agents/skills/add-hexo-post/SKILL.md
```

`public/`、`.playwright-cli/`、`output/`、generated-images、未相關文章與封面不屬於一般文章 commit。

## 3. 本機驗收：用實際專案 scripts，再做等價檢查

先看 scripts，不要猜不存在的 alias：

```bash
npm run
npm run verify:post-dates
npm run build
node tools/validate-jsonld.js --mode=local --paths=/posts/<slug>/ --public-dir=public
git diff --check
```

若專案沒有 metadata／build-output 專用 script，等價檢查至少包含：

- front matter 的 `title`、`cover`、`toc: true`、`categories` 恰好一項、`tags` 1–3 項、非空 `date`、70–150 字元 `description`
- FAQ 標題與至少 3 組有效 `Question`
- source cover 為 1200×800 PNG；production `public/` 有同名 WebP
- `public/posts/<slug>/index.html` 含標題、WebP、FAQPage 與文章內容

注意 front matter 使用的是 `categories` 複數欄位與 YAML 清單；驗證器應解析欄位語意，不要假設是 `category` 單數或 inline array。若自行寫檢查器失敗，先確認是文章錯誤還是檢查器的格式假設錯誤。

再用本機伺服器驗證實際頁面與 source PNG：

```bash
npm run server -- --port 4000
```

確認 `http://localhost:4000/posts/<slug>/` 回 200，含標題、封面、FAQ、標題階層與程式碼區塊；完成後只停止自己啟動的 server。

## 4. Commit、push 與 Actions

正常發布入口是 `main` push，不是 `hexo deploy`：

```bash
git branch --show-current
git commit -m "新增文章：<title>"
git push origin main
```

push 後先以本次 commit SHA 找 run：

```bash
gh run list --branch main --limit 8 --json databaseId,status,conclusion,workflowName,headSha,url
gh run watch <run-id> --exit-status
```

只接受 `headSha` 等於本次 commit 的 run。若 `gh run watch` 遇到 API／網路 timeout：

```bash
gh run view <run-id> --json status,conclusion,headSha,jobs,url
```

確認 `status=completed`、`conclusion=success`，並檢查實際 job／step，例如 `Verify post dates`、`Build`、`Deploy to gh-pages`。watch 的 transport error 不是 workflow 失敗；不要重複 push。

## 5. gh-pages 與正式網域：分層驗收

先不要使用會吞掉 404 的 `curl --fail`。文章和封面分開請求，避免 zsh 的特殊變數 `status`：

```bash
page_body_path=/tmp/<slug>-production.html
page_http_code=$(curl -sS -L -o "$page_body_path" -w '%{http_code}' \
  https://blog.es2idea.com/posts/<slug>/)
cover_http_code=$(curl -sS -L -o /dev/null -w '%{http_code}' \
  https://blog.es2idea.com/images/<cover-webp>)
```

若任一裸網址是 404，立即查部署分支；`?ref=gh-pages` 要加引號：

```bash
gh api 'repos/<owner>/<repo>/contents/posts/<slug>/index.html?ref=gh-pages' \
  --jq '{name,size,sha,download_url}'
gh api 'repos/<owner>/<repo>/contents/images/<cover-webp>?ref=gh-pages' \
  --jq '{name,size,sha,download_url}'
```

必要時直接請求 API 回傳的 raw URL，確認不是空檔。若 `gh-pages` 有檔案，使用每次不同的唯一 query suffix 做診斷：

```bash
curl -sS -L -H 'Cache-Control: no-cache' \
  'https://blog.es2idea.com/posts/<slug>/?v=<commit-sha>-verify-1'
curl -sS -L -H 'Cache-Control: no-cache' \
  'https://blog.es2idea.com/images/<cover-webp>?v=<commit-sha>-verify-1'
```

若同一 query 仍是舊 404，改用 `verify-2`，不要把一個 query key 的快取結果當成部署結果。`Cache-Control: no-cache` 是診斷請求，不是 Cloudflare purge。

文章裸網址恢復 2xx 後，再做遠端 JSON-LD 驗證；它只驗證文章結構，不代替封面 HTTP 檢查：

```bash
npm run verify:jsonld -- --base=https://blog.es2idea.com --paths=/posts/<slug>/
```

## 6. 狀態標籤與回報格式

| 狀態 | 必要證據 | 可以說什麼 | 不能說什麼 |
| --- | --- | --- | --- |
| `local_pass` | 日期、build、local JSON-LD、localhost | 本機驗收通過 | 已部署、訪客已看到 |
| `pushed` | commit SHA、`git push` 成功 | 已推送 main | Actions 成功 |
| `ci_success` | 同 SHA 的 Actions success | CI build/deploy step 成功 | canonical 已刷新 |
| `deployed_artifact` | `gh-pages` API／raw 有 HTML 與 WebP | 部署產物已寫入 gh-pages | CDN 已更新 |
| `canonical_page_ok` | 裸文章頁 2xx 且內容正確 | canonical 文章頁已更新 | 封面一定可讀 |
| `cover_cdn_pending` | 裸封面 404／舊 HIT，但唯一 query 封面 200 | 部署成功、等待封面 CDN | 完整正式站驗收完成 |
| `release_complete` | 文章與封面裸網址皆 2xx，內容／JSON-LD 正確 | 正式站驗收完成 | — |

文章頁 200、HTML 已引用新版 WebP，但裸封面仍 404 時，維持 `cover_cdn_pending`；不要為了繞過快取重複提交同一內容。若沒有可用的授權 purge，等待 TTL 後再做裸網址驗收。

## 7. 安全邊界

- 不使用 `git add .`、`git add -A`、force push 或直接推送 `gh-pages`。
- 不把 `public/`、暫存檔、Playwright／輸出資料夾或其他使用者變更帶進 commit。
- 不讀取或輸出 `.env`、token、SSH key 或 GitHub secrets。
- 不因 CDN stale 自行修改 workflow、重複 commit、重複 push 或猜測 purge token。
- 手動 `npm run deploy` 只在明確授權的復原情境使用，且仍要補做上述部署與正式站分層驗收。
