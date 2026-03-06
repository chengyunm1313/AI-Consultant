好，資訊夠了：你現在的 deploy 其實做了 4 件事：
	1.	hexo clean
	2.	hexo generate
	3.	node toWebp（你自己的後處理）
	4.	hexo deploy（把 public/ 推到 gh-pages）

要改成 CI/CD，最穩、最少改動的做法是：
GitHub Actions 不跑 hexo deploy（避免 deployer-git 在 CI 裡搞認證），而是 自己把 public/ 推到 gh-pages，並且每次都寫入 CNAME=blog.es2idea.com。

下面是可直接用的 workflow。

⸻

1) 新增 .github/workflows/deploy.yml

name: Hexo Build & Deploy

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: hexo-deploy
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      # PR 只 build，不部署
      - name: Upload public artifact (PR only)
        if: github.event_name == 'pull_request'
        uses: actions/upload-artifact@v4
        with:
          name: public
          path: public

      # push main 才部署到 gh-pages
      - name: Deploy to gh-pages
        if: github.event_name == 'push'
        env:
          CNAME_DOMAIN: blog.es2idea.com
        run: |
          set -e

          # 準備一個乾淨的 deploy 目錄
          rm -rf .deploy
          mkdir .deploy
          cp -R public/. .deploy/

          # 確保 CNAME 一定存在（避免 custom domain 掉掉）
          echo "$CNAME_DOMAIN" > .deploy/CNAME

          # 設定 git 身分
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          # 切到（或建立）gh-pages 分支
          git fetch origin gh-pages || true
          if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
            git checkout gh-pages
          else
            git checkout --orphan gh-pages
            git rm -rf . || true
          fi

          # 用最新 build 覆蓋整個分支內容
          git rm -rf . || true
          cp -R .deploy/. .
          touch .nojekyll

          git add -A

          # 沒變更就不要硬推
          if git diff --cached --quiet; then
            echo "No changes to deploy."
            exit 0
          fi

          git commit -m "chore: deploy $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
          git push origin gh-pages


⸻

2) GitHub Repo 設定（只要做一次）

到：Settings → Pages
	•	Source：選 Deploy from a branch
	•	Branch：選 gh-pages / (root)

（你已經有 CNAME，workflow 也會每次寫入，所以 custom domain 不會掉。）

⸻

3) 你本機要改什麼？

不用改 _config.yml（deploy 區塊可以留著，當備援）。
但你之後其實只需要：
	•	平常：npm run server / npm run build 做本機確認
	•	上線：push main 就會自動部署

⸻

4) 給 AI 的「coding 提示詞」（你要叫它改流程就貼這段）

（你之後想讓 AI 幫你自動改 repo，可以用這段直接丟給它）

請把我的 Hexo 專案改成 GitHub Actions 自動部署（push main 部署、PR 只 build）。

已知：
- package.json scripts:
  build: "hexo generate && node toWebp"
  deploy: "hexo clean && hexo generate && node toWebp && hexo deploy"
- _config.yml deploy:
  type: git
  repo: https://github.com/chengyunm1313/AI-Consultant
  branch: gh-pages
- custom domain CNAME: blog.es2idea.com

要求：
- workflow 用 npm ci + cache
- Node 20
- PR：只 build（可上傳 public artifact）
- push main：把 public/ 推到 gh-pages，並確保每次都寫入 CNAME=blog.es2idea.com
- 不要用 hexo deploy（避免 CI 認證問題）
- 輸出：.github/workflows/deploy.yml 完整內容 + Repo Pages 設定步驟


⸻

如果你 repo 的預設分支不是 main（是 master），把 workflow 裡的 branches: ["main"] 全部改成 master 就好。