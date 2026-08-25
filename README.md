# AI-Consultant（Hexo）

此專案為個人網站 `https://blog.es2idea.com` 的 Hexo 原始碼，主題為 `hexschool`。

## 專案簡介

- Repo：`chengyunm1313/AI-Consultant`
- 網站網域：`blog.es2idea.com`
- 發佈分支：`gh-pages`
- 主要分支：`main`

## 環境需求

- Node.js 24（與 GitHub Actions 的 `setup-node` 設定一致）
- npm（使用與 Node.js 24 相容的版本）

## 本機開發

### 1) 安裝相依套件

```bash
npm install
```

### 2) 啟動本機開發伺服器

```bash
npm run server
```

### 3) 建置靜態檔（含 WebP 後處理）

```bash
npm run build
```

### 4) 清理快取與輸出目錄

```bash
npm run clean
```

### 5) 檢查文章日期欄位（CI 同步檢查）

```bash
npm run verify:post-dates
```

說明：

- `source/_posts` 下每篇文章的 front matter 必填 `date`
- 若缺少 `date` 或為空值，指令會直接失敗，避免排序在不同環境漂移

## 部署策略（CI/CD 主流程）

本專案已改為 GitHub Actions 自動部署：

- 觸發條件：
  - `push` 到 `main`
  - `pull_request` 到 `main`
  - 手動觸發 `workflow_dispatch`
- `PR` 行為：
  - 僅執行建置
  - 上傳 `public/` 為 artifact（不部署）
- `push main` 行為：
  - 先執行 `npm run verify:post-dates`（文章日期防呆）
  - 建置後將 `public/` 覆蓋部署到 `gh-pages`
  - 每次強制寫入 `CNAME=blog.es2idea.com`
  - 建立 `.nojekyll`
  - 若無內容差異則跳過 deploy commit

Workflow 檔案位置：

- [deploy.yml](.github/workflows/deploy.yml)
- [Hexo 發布與正式站驗收 Runbook](docs/site-maintenance-runbook.md)

## GitHub Pages 一次性設定

到 GitHub Repo 的 `Settings -> Pages`，設定：

1. Source：`Deploy from a branch`
2. Branch：`gh-pages`
3. Folder：`/ (root)`

完成後，網站會由 `gh-pages` 內容發佈，且保留自訂網域 `blog.es2idea.com`。

## 手動部署備援（非一般發布路徑）

一般發布只應由 `main` 的 push 觸發 GitHub Actions。`npm run deploy` 會直接呼叫 `hexo deploy` 寫入 `gh-pages`，會繞過本 repo 的 main commit、Actions run 與部署證據鏈；只有在已明確授權的緊急復原情境才使用：

```bash
npm run deploy
```

對應內容（`package.json`）：

- `hexo clean`
- `hexo generate`
- `node toWebp`
- `hexo deploy`（直接寫入 `gh-pages`）

注意：不要把 `npm run deploy` 與 `push main` 混用，也不要用它取代正常發布流程。完整的提交範圍、Actions、`gh-pages`、canonical 頁面與封面快取驗收，請依 [Runbook](docs/site-maintenance-runbook.md) 執行。

## JSON-LD 驗證指令

### 本地驗證（建議）

```bash
npm run verify:jsonld -- --mode=local
```

### 遠端驗證（部署後）

```bash
npm run verify:jsonld
```

若要指定網域或路徑：

```bash
npm run verify:jsonld -- --base=https://blog.es2idea.com
npm run verify:jsonld -- --paths=/,/service/,/posts/aeo-implementation-tools-optimization-guide/
```

## 常見排錯

### 1) Actions 無法部署到 `gh-pages`

- 檢查 workflow 是否含 `permissions: contents: write`
- 檢查 repo 是否允許 GitHub Actions 寫入內容

### 2) `gh-pages` 分支不存在

- workflow 已內建 `orphan` 建立邏輯
- 首次 `push main` 後應自動建立 `gh-pages`

### 3) 自訂網域遺失或被重置

- workflow 每次部署都會寫入 `CNAME`
- 請確認 `Settings -> Pages` 的 Custom domain 仍為 `blog.es2idea.com`

### 4) 更新後網站沒立即生效

- 先以本次 commit 的 `headSha` 篩選 Actions run，不要只看 main 最新一筆
- Actions 成功後，再用 GitHub API／raw 檢查 `gh-pages` 是否真的有文章 HTML 與封面 WebP
- 文章頁與封面 URL 必須分開請求；文章 200 不代表封面已更新
- `?v=<commit-sha>-verify-1` 之類的 query 只是假設診斷，不是 canonical 新鮮度證明；若 query 200、裸網址仍是 `cf-cache-status: HIT` 舊內容或 404，標記為 CDN pending，不要重複提交相同內容
- 完整判讀方式請看 [Hexo 發布與正式站驗收 Runbook](docs/site-maintenance-runbook.md)

### 5) 新文章排序異常（本機與線上順序不同）

- 先執行 `npm run verify:post-dates`
- 確認 `source/_posts` 內該篇文章 front matter 有填 `date`

## 參考文件

- [Hexo 官方文件](https://hexo.io/zh-tw/docs/)
- [GitHub Actions Workflow](.github/workflows/deploy.yml)
