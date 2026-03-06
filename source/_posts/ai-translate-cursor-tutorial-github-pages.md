---
title: 用 AI 暴力中文化 Cursor 教學網站，並用 GitHub Pages 免費部署
cover: /images/cover71.png
toc: true
categories:
  - 生成式AI應用
tags:
  - AI自動化
  - Cursor
date: 2026-01-10 12:09:46
subtitle:
description: 想將英文教學網站快速繁體中文化？本文詳解如何利用 AI Prompt Engineering 進行自動化翻譯，並結合 GitHub Pages 免費部署 Next.js 專案，打造個人專屬知識庫。
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/A8UE7K01VTA?si=eohbw3H9DY06UykS" 
    title="用 AI 暴力中文化 Cursor 教學網站，並用 GitHub Pages 免費部署" 
    allow="fullscreen">
  </iframe>
</div>

想把一個高品質的英文開源教學站變成繁體中文，以前你要怎麼做？逐行複製程式碼到 Google 翻譯？還是看著螢幕一句句打字？太慢了，這根本是燃燒生命的無效勞動。

目標很明確：把 Cursor for Product Manager 的英文教學站「搬」回來。全站繁體中文化，並且利用 GitHub Pages 免費部署，不用付任何伺服器費用。

核心工具就這幾樣：GitHub、Terminal、AI 模型（GPT-4/Claude/Google 皆可）與編輯器。文末附上原版與繁中版對照連結，不想看過程的可以直接拉到最後。

## 前置作業：Fork 與 Clone 專案

第一步不是翻譯，是把原始碼弄到手。去原始專案的 GitHub 頁面，點擊 **Fork**。這一步是為了把專案複製到你自己的帳號下，確保你有完全的修改權。

接著把 Fork 後的網址複製下來。打開 Terminal，輸入 `git clone` 指令把它抓到本地端。用 Cursor 或 VS Code 開啟資料夾，準備開工。

```bash
git clone [https://github.com/你的帳號/repo-name.git](https://github.com/你的帳號/repo-name.git)
cd repo-name

```

## AI 翻譯策略：Prompt 文件化技巧

很多人用 AI 改 Code 的習慣不好。直接把程式碼貼到對話視窗，效率極低且容易出錯。這裡建議採用 **Prompt 文件化** 的高階打法。

在專案根目錄建一個 `docs` 資料夾，或直接新增一個 `prompt.md`。你要在這個檔案裡，把 AI 當成一個剛入職的資深翻譯。寫清楚角色設定：你是專業 PM、資深譯者。

定義目標受眾是台灣或香港的 PM 與工程師。強調語氣必須是「繁體中文」且「去中國化」。

* 例如：看到「視頻」要翻成「影片」。
* 例如：看到「激活」要翻成「啟用」。

## 執行邏輯：Context 管理與指令下達

接著把這個 `prompt.md` 拖進 AI 的對話視窗（Context）。下達指令：「執行文件內的翻譯任務，將 `src/app` 下的網站內容中文化」。這樣做的優點是 Context 穩定，不會翻到一半 AI 突然忘記自己是誰。

這裡有個關鍵技巧：**指令要兇，權限要給足。**

告訴 AI：「請自動完成以下工作，不需要中途確認。」若要處理多個檔案，直接下令「批次翻譯剩餘檔案，不要停下來」。

## 實戰除錯：應對 AI 幻覺與遺漏

當然，AI 目前還不是神，它比較像個會偷懶的實習生。實作過程通常不會一鍵完成，你會遇到幾種狀況。

1. **AI 偷懶：** 翻一半就停下來問你「要繼續嗎？」。
* **解法：** 指令要強硬：「不要問我，直接完成所有工作。」


2. **內容遺漏：** 特別是側邊欄（Sidebar）這種結構複雜的地方。
* **解法：** 不要用文字描述，直接截圖貼給 AI，讓它自己去對應程式碼位置。


3. **破壞性修改：** 有時 AI 翻得太嗨，會把程式碼邏輯也刪了。
* **解法：** 你需要保持警覺，如果發現檔案變小太多，通常就是出事了，請務必 Review diff。



## 部署流程：Next.js 到 GitHub Pages

原專案通常是 Next.js 架構，官方推薦用 Vercel 部署。但為了極致的免費，我們改用 **GitHub Pages**。直接問 AI：「這是一個 Next.js 專案，教我怎麼部署到 GitHub Pages。」

AI 通常會叫你改 `next.config.mjs`。加入 `output: 'export'`，讓 Next.js 吐出靜態檔案（Static HTML）。

```javascript
// next.config.mjs
const nextConfig = {
  output: 'export',
  // 其他設定...
};
```

**注意：** 圖片優化元件 `<Image>` 在靜態匯出時可能會報錯，這部分需視情況調整。

接著請 AI 生成 GitHub Actions 的 workflow 檔案。路徑通常在 `.github/workflows/pages.yml`。流程不外乎：Checkout code → Setup Node → Build → Upload → Deploy。

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: website/package-lock.json

      - run: npm ci
      - run: npm run build
      - run: touch out/.nojekyll

      - uses: actions/upload-pages-artifact@v3
        with:
          path: website/out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 收尾與上線：Git 流程與自動化驗收

最後就是標準的 Git 流程。

```bash
git add .
git commit -m "feat: 完成全站繁體中文化與部署設定"
git push origin main
```

Git push 上去後，到 GitHub Repo 的 "Actions" 分頁看戲。只要燈號全綠，GitHub 就會給你一個網址。原本全英文的介面，現在變成了你專屬的繁體中文版。這不只是翻譯，這是建立了自己的知識庫。

## 資源傳送門：原版與繁中版對照

光看不練沒有用，這裡把資源都整理好了。原版適合練英文，享哥的繁中版適合直接學觀念。想自己動手改的，Repo 連結也都在這，Fork 下去就是你的。

* **原始教材網站：** [Cursor for PMs](https://www.cursorforpms.com/)
* **原始 GitHub：** [carlvellotti/cursor-pm-course](https://github.com/carlvellotti/cursor-pm-course)
* **享哥繁中版網站：** [Cursor for PMs (繁中版)](https://chengyunm1313.github.io/cursor-pm-course/)
* **享哥繁中 GitHub：** [chengyunm1313/cursor-pm-course](https://github.com/chengyunm1313/cursor-pm-course)
