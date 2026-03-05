# AI-Consultant（Hexo）

此專案為個人網站 `https://blog.es2idea.com` 的 Hexo 原始碼，主題為 `hexschool`。

## 專案簡介

- Repo：`chengyunm1313/AI-Consultant`
- 網站網域：`blog.es2idea.com`
- 發佈分支：`gh-pages`
- 主要分支：`main`

## 環境需求

- Node.js 20（建議與 GitHub Actions 一致）
- npm 9+（或隨 Node 20 版本）

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
  - 建置後將 `public/` 覆蓋部署到 `gh-pages`
  - 每次強制寫入 `CNAME=blog.es2idea.com`
  - 建立 `.nojekyll`
  - 若無內容差異則跳過 deploy commit

Workflow 檔案位置：

- [deploy.yml](.github/workflows/deploy.yml)

## GitHub Pages 一次性設定

到 GitHub Repo 的 `Settings -> Pages`，設定：

1. Source：`Deploy from a branch`
2. Branch：`gh-pages`
3. Folder：`/ (root)`

完成後，網站會由 `gh-pages` 內容發佈，且保留自訂網域 `blog.es2idea.com`。

## 備援手動部署（保留）

雖然 CI/CD 為主，仍保留本機手動部署指令作為備援：

```bash
npm run deploy
```

對應內容（`package.json`）：

- `hexo clean`
- `hexo generate`
- `node toWebp`
- `hexo deploy`

注意：一般情況建議以 `push main` 觸發自動部署，不要長期混用兩種流程。

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

- 先確認 Actions Job 是否成功
- GitHub Pages/CDN 可能有短暫快取延遲，稍等幾分鐘後再重整

## 參考文件

- [Hexo 官方文件](https://hexo.io/zh-tw/docs/)
- [GitHub Actions Workflow](.github/workflows/deploy.yml)
