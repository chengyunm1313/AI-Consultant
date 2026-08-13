# AI-Consultant 網站維護與回復手冊

本手冊是 `blog.es2idea.com` 的維運基準，描述 GitHub Pages、GitHub Actions 與 Cloudflare 之間的責任邊界。網站目前是靜態 Hexo 內容站，Cloudflare 是 DNS、Proxy 與 AEO 邊緣層，不是網站內容的主要部署來源。

## 系統邊界

```text
main 原始碼
  ↓ push / pull request
GitHub Actions（建置、驗證）
  ↓ push main 後才允許寫入
gh-pages 分支
  ↓ GitHub Pages
blog.es2idea.com ← Cloudflare DNS / Proxy / Header / AEO
```

責任分工：

- GitHub repository：文章、主題、設定、建置腳本與 workflow 的來源真相。
- GitHub Actions：Node.js 24、npm lockfile、文章 metadata、建置輸出與 JSON-LD 的自動檢查。
- `gh-pages`：可回復的靜態部署結果，不直接手動編輯。
- GitHub Pages：提供靜態檔案與自訂網域對應。
- Cloudflare：DNS、Proxy、快取、回應標頭與 Markdown for Agents；設定變更須另行驗收。

## 每次內容或程式變更

在建立 PR 或合併前，依序執行：

```bash
npm ci
npm run verify:post-dates
npm run verify:post-metadata
npm run build
npm run verify:build-output
npm run verify:workflow-actions
npm run verify:jsonld:local
git diff --check
```

注意：本機應使用 Node.js 24，可依 `.nvmrc` 切換。不要把 `public/` 產物當成原始碼提交；它是建置輸出。

## 部署後驗收

GitHub Actions 成功後，確認：

1. Actions 的 Build and verify 與 Deploy to gh-pages 皆成功。
2. GitHub Pages 的 `gh-pages` 最新提交時間與本次部署一致。
3. 首頁、服務頁、代表性文章可正常開啟。
4. 遠端 JSON-LD 驗證通過：

   ```bash
   npm run verify:jsonld -- --base=https://blog.es2idea.com
   ```

5. Cloudflare 邊緣層抽查：

   ```bash
   curl -I https://blog.es2idea.com/
   curl https://blog.es2idea.com/robots.txt
   curl https://blog.es2idea.com/llms.txt
   curl -I -H 'Accept: text/markdown' https://blog.es2idea.com/
   ```

正式站的 JSON-LD、`robots.txt`、`llms.txt` 與 sitemap 也會由 [remote-smoke.yml](../.github/workflows/remote-smoke.yml) 每週唯讀檢查；若需要立即確認，可從 GitHub Actions 手動觸發。

Cloudflare 的 Link header 與 Markdown for Agents 設定，依 [agent-ready-cloudflare-checklist.md](./agent-ready-cloudflare-checklist.md) 驗收；不要因為本機輸出正常，就推定 Cloudflare 邊緣設定已生效。

目前公開端唯讀驗收快照（2026-08-13）：Link header 與 `robots.txt` 的
`Content-Signal` 已生效；`Accept: text/markdown` 仍回傳 HTML，因此 Markdown
for Agents 尚未完成。這個差異會由每週 remote smoke workflow 以 warning 提示，
不會讓既有的靜態網站健康檢查失效。

## 回復流程

### 建置失敗

1. 不要手動修改 `gh-pages`。
2. 先看失敗步驟：metadata、build output、JSON-LD 或 WebP。
3. 修正 `main` 原始碼後重新跑 PR；確認所有檢查通過才合併。

### 部署後網站異常

1. 先確認是 GitHub Pages 原始輸出問題，還是 Cloudflare 快取／標頭問題。
2. 記錄目前 `main` 與 `gh-pages` 的提交 SHA。
3. 若是本次部署造成，優先在 GitHub 上對該 `gh-pages` 部署提交執行 Revert，保留審計紀錄。
4. 回復後重新檢查首頁、`robots.txt`、`llms.txt`、sitemap 與 JSON-LD。
5. 若只有 Cloudflare 行為異常，先暫停新增規則，回復最近一次 Cloudflare 規則版本，再清理受影響快取。

不要使用未確認目標的 `git reset --hard`、強制推送或遞迴刪除操作。需要直接回復部署分支時，先保留目前 SHA 與部署紀錄。

## 風險登錄

| 風險 | 目前控制 | 殘餘風險 | 維護方式 |
| --- | --- | --- | --- |
| PR 程式碼取得部署寫入權限 | Build job 僅 `contents: read`，Deploy job 才有 `contents: write` | Actions 仍可執行 PR 程式碼 | 只合併通過檢查、人工審查的 PR |
| 文章摘要缺失導致搜尋/AEO 品質下降 | 131 篇文章都有 metadata 驗證 | 新文章仍可能寫出過長或不精準摘要 | 發文前檢查內容與 `description` 一致 |
| 建置成功但輸出缺頁或圖片壞鏈 | `verify:build-output` 檢查核心路徑與圖片引用 | 尚未做全站外部連結檢查 | 每月抽查代表性文章與圖片 |
| JSON-LD 與實際頁面結構漂移 | CI 本機 JSON-LD 驗證、部署後可做遠端驗證 | 驗證路徑仍是代表性樣本 | 新增 Schema 類型時同步擴充 validator |
| Cloudflare 規則或快取造成邊緣差異 | 有獨立 Cloudflare checklist | Dashboard 變更未納入 repo 版本控管 | 每次改規則都記錄、驗收、可回復 |
| 相依套件或 Actions 供應鏈變更 | `package-lock.json`、Node 24、Actions 完整 SHA、workflow pin 驗證、Dependabot | 依賴更新 PR 仍需人工審查 | 每週查看 Dependabot，確認 release tag 與變更內容 |
| `main` 可被直接推送而繞過 PR 審查 | workflow 已限制建置 job 為唯讀，且部署只由 `main` push 觸發 | 分支目前未啟用保護規則 | 在 GitHub 設定 `main` 必須經 PR、要求 `Build and verify` 成功、禁止 force push 與刪除分支 |
| Actions repository policy 過度寬鬆 | workflow 內所有第三方 Actions 已固定完整 SHA | repository 的 `allowed_actions` 目前為 `all`，預設 workflow 權限未明確設為唯讀 | 在 GitHub Actions 設定限制允許的 actions、要求 SHA pin，並將預設 GITHUB_TOKEN 權限設為 read；完成後重新跑 workflow smoke |

## 維護節奏

- 每次變更：依照本手冊的本機檢查流程。
- 每次部署後：檢查 Actions、GitHub Pages、Cloudflare 代表性回應。
- 每週：查看 Dependabot PR 與 Actions 失敗紀錄。
- 每月：抽查首頁、服務頁、三篇文章、AEO 資源與 Cloudflare headers；確認仍能依部署提交回復。
- 每季或 GitHub 權限異動後：確認 `main` 分支保護、Actions repository policy 與 Cloudflare 規則仍符合本手冊。
