# 資安健康檢查報告

- **稽核日期：** 2026-10-22（Asia/Taipei）
- **稽核範圍：** `/Users/hsuhsiang/Desktop/work/AI-Consultant` 專案原始碼、鎖檔、GitHub Actions 工作流程及本機工具版本
- **模式：** 唯讀稽核；僅新增本報告。未修補程式、未建置、未部署、未探測正式網站，也未登入 Cloudflare 或讀取憑證。

## 一頁結論

- **目前沒有證據顯示正式網站正以 PHP、Node.js 或 Go 作為伺服器執行環境。** 專案是 Hexo 靜態網站；GitHub Actions 用 Node.js 建置，再把 `public` 輸出推到 `gh-pages`。`source/CNAME` 指向 `blog.es2idea.com`。Cloudflare 是否代理此網域，或帳戶內是否另有 Worker／後端，無法由本 repo 確認。
- **沒有已確認的 P0 或 P1 正式站漏洞，也沒有需要立即停站的證據。** 但 `npm audit` 在建置依賴中找到 3 個 Critical、25 個 High、10 個 Moderate、3 個 Low。這些是建置／開發相依鏈，不等於訪客可直接利用的正式站漏洞；建議在下一次正式建置前優先處理 Critical/High 依賴。
- **PHP 兩個 CVE 與 Go CVE 對本 repo 確認不適用。** Node.js CVE 與建置環境有關：本機 Node 為已修補的 `22.23.4`；CI 選用 `24` 主版本，尚未取得最近一次 Actions 執行紀錄，無法證明當次使用的 patch 版。正式輸出是靜態檔，沒有 Node.js request handler。
- **CI 工作流程有可改善的權限邊界。** `contents: write` 設在整個 workflow，包含 `pull_request` 的建置工作；GitHub 對 fork PR 預設會降為唯讀，但同 repo PR 或 repo 特別設定可能取得寫入權限。應將唯讀建置與寫入部署分成不同 job。
- **Cloudflare WAF、DNS 代理、TLS、Response Header Rules、Secrets、預覽網址及 Worker 綁定都需要登入控制台確認。** repo 沒有 Wrangler 設定或 Cloudflare Pages `_headers`。缺少 repo 設定不代表 Cloudflare 控制台沒有設定。

### 回答你最後的五個問題

1. **是否需要緊急處理？** 不需要緊急停站；沒有確認到可從正式網站外部直接利用的漏洞。建議先處理建置依賴的 Critical/High 項目，並在接受不受信任 PR 前收緊 Actions 權限。
2. **PHP／Node.js／Go 漏洞是否直接關係到網站？** PHP 與 Go 對此 repo 確認不適用。Node.js 只用於建置；本機版本已修補，CI 版本應從最近一次 Actions log 核對。三者都沒有已確認的正式網站執行路徑。
3. **優先五項：** (1) 更新 `sharp`、`hexo-renderer-marked` 及其受影響相依鏈；(2) 把 PR 建置權限降為唯讀並將部署寫入權限限縮到 deploy job；(3) 對 Markdown 原始 HTML 與 JSON-LD 做安全輸出處理；(4) 固定 Swiper 的精確版本並加 SRI 或改為自託管；(5) 修正失效／過期的 `pnpm-lock.yaml`，避免 `pnpm audit` 回報零套件造成錯誤安心。
4. **哪些更新可能讓網站故障？** Hexo 7→8、`hexo-renderer-marked` 6→7、`hexo-generator-index` 3→4、`hexo-pagination` 3→4、`hexo-util` 3→4 都跨主版本；`sharp` 0.34→0.35 可能改變原生影像依賴或輸出。需要在隔離分支建置並檢查頁面、Markdown、圖片及 WebP 輸出。
5. **哪些要登入 Cloudflare？** DNS 是否代理、SSL/TLS 模式、WAF／Rate Limiting／Bot 防護、Response Header Rules、Workers/Pages 專案與 `workers.dev`／`pages.dev` 預覽入口、環境變數／Secrets、D1/KV/R2 綁定、API Token scope、日誌與錯誤內容。

## 一、網站架構摘要

| 層次 | 本次觀察 | 證據與邊界 |
|---|---|---|
| 前端／產生器 | Hexo 靜態網站；不是 Next.js、React SSR、Astro server 或 Vue SPA | `package.json` 的 build script 執行 `hexo generate`，見 `package.json:5-11` |
| 本機開發 | Node.js `v22.23.4`、npm `10.9.9`；本機有安裝相依套件；全域 Wrangler `4.76.0`、pnpm `10.32.1` | CLI 版本唯讀查詢；未執行建置或 `wrangler` 帳戶命令 |
| PHP／Go 本機工具 | PHP、Go 均未安裝 | `command -v` 檢查；repo 也沒有 `composer.json`、`go.mod`、`go.sum` |
| 建置／CI | GitHub Actions `ubuntu-latest`；`actions/setup-node@v4` 使用 Node `24`；`npm ci` 後執行日期檢查與 Hexo build | `.github/workflows/deploy.yml:20-47`。設定只指定主版本，未在 repo 中鎖定精確 patch；本次未讀遠端 Actions logs |
| 正式輸出 | 建置結果推送至 `gh-pages`，並寫入 `CNAME` `blog.es2idea.com` | `.github/workflows/deploy.yml:49-84`、`source/CNAME:1`。這證明 repo 的部署工作流程，不證明目前 DNS／TLS／Cloudflare 代理狀態 |
| Cloudflare runtime | 沒有 `wrangler.toml/json/jsonc`、`compatibility_date`、`compatibility_flags`、Worker entrypoint 或 `_headers` | 未發現 Cloudflare Workers／Pages Functions 設定；Cloudflare 可能僅作 DNS/CDN，需控制台確認。Cloudflare Workers 的執行環境是 `workerd`，不是 CI 的標準 Node 二進位檔，參考 [Wrangler 官方說明](https://developers.cloudflare.com/workers/wrangler/install-and-update/) |
| 後端／資料 | 未發現本專案 API routes、登入、Cookie session、Webhook、SQL/D1、KV、R2 或外部資料庫連線程式 | 作品集及文章內的 `workers.dev`／`pages.dev` 網址是連結或示範，不是本 repo 的部署設定；未對其進行掃描 |
| 第三方前端資源 | Google Fonts、jsDelivr、Google Analytics、Portaly／社群嵌入等 | 例如 `themes/hexschool/layout/layout.ejs:17-25`、`themes/hexschool/layout/_partial/head.ejs:74-89`。不代表它們是本 repo 的後端 |

## 二、近期 CVE 影響判定

PHP 官方於 2026-10-21 說明 PHP 8.5.12、8.4.27、8.3.36、8.2.35 修補 CVE-2026-109618 與 CVE-2026-109619，並建議所有提供 Web request 的 PHP runtime 立即更新；參考 [PHP 官方公告](https://www.php.net/archive/2026.php#2026-10-21-5)。Node.js 2026-10-21 security release 修補 Brotli、TLS、DNS、HTTP 及 Permission Model 問題；參考 [Node.js 22.23.4 release](https://nodejs.org/pt-br/blog/release/v22.23.4)、[Node.js 安全發布公告](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) 及 [版本列表](https://nodejs.org/en/blog/release)。Go 官方資料列出 CVE-2026-111943 影響 `crypto/x509`，修補版為 Go 1.26.10、1.27.3；參考 [Go Vulnerability Database](https://pkg.go.dev/vuln/GO-2026-6809) 與 [Go Release History](https://go.dev/doc/devel/release)。

| 漏洞／元件 | 判定 | 專案版本與執行階段 | 外部可達路徑／Cloudflare 責任 |
|---|---|---|---|
| PHP `CVE-2026-109618`、`CVE-2026-109619` | **確認不適用**於 repo 與可見部署流程 | 未找到 PHP 原始碼、Composer lock 或 PHP 主機設定；本機也沒有 PHP。修補版為 8.5.12、8.4.27、8.3.36、8.2.35 | 靜態產物沒有 PHP handler。若另有未納入 repo 的 PHP origin，該服務版本仍屬**證據不足**，需在主機商或 Cloudflare origin/backend 清單確認；Cloudflare 不會替該外部 PHP 主機安裝修補版 |
| Node `CVE-2026-111497` Brotli；同批 TLS/DNS/Permission Model 問題 | **可能受影響**於 CI 的 Node 24 patch 證據；正式靜態站沒有 Node request runtime | 本機 `node -v` 為 `22.23.4`，是修補版。CI 設 `node-version: "24"`（`.github/workflows/deploy.yml:27-34`）；官方修補版為 22.23.4、24.22.1、26.12.1。最近一次 Actions 的實際 `node --version` 未取得 | 沒有公開 Node API/server。僅 PR／提交內容進入 build 時可能接觸 CI Node；若惡意輸入能觸發該元件才有建置期路徑。Node build runtime 由 GitHub Actions／Node release 負責，不是 Cloudflare。Cloudflare CDN 不會替 GitHub Actions 更新 Node |
| Go `CVE-2026-111943` (`crypto/x509`) | **確認不適用**於 repo 與可見部署流程 | 無 Go module／Go 程式，本機也沒有 Go。修補版為 1.26.10、1.27.3 | 沒有 Go TLS／憑證驗證程式路徑；若另有未納入 repo 的 Go backend，則該服務為**證據不足**。Cloudflare 只維護其服務端執行環境，不負責外部 Go host |

**Node 同批問題**：Node 官方 `22.23.4` 發布紀錄列出 `CVE-2026-106069`、`CVE-2026-106072`（TLS IP 正規化）、`CVE-2026-105482`（DNS null byte）、`CVE-2026-111497`（Brotli）、`CVE-2026-105481`（HTTP）、`CVE-2026-106074`（crypto）及 `CVE-2026-106073`（Permission Model）；其他 Node 分支可能另含 `CVE-2026-105483`、`CVE-2026-106070`。各分支以自己的修補版為準。本機 `22.23.4` 已達 22 分支公告修補版；CI 選用 Node 24 主版本，但本次沒有遠端 run log 證實 patch。`26.12.1` 是官方 Current 分支修補版；本專案並未指定 Node 26。

## 三、套件與執行環境版本檢查

### npm audit

以 `package-lock.json` 執行唯讀 `npm audit --json`（停用 scripts，未執行 `npm audit fix`）：

| NPM audit 嚴重度 | 數量 |
|---|---:|
| Critical | 3 |
| High | 25 |
| Moderate | 10 |
| Low | 3 |
| **合計** | **41** |

這是 npm 對鎖定相依樹的套件漏洞彙總數，不代表 41 個正式站可遠端利用的漏洞。npm 將 root `dependencies` 歸類為 `prod`，但本專案的 Hexo、Marked renderer、Sharp 都只在建置時執行；正式輸出是 HTML/CSS/JS/圖片。`hexo-server` 只有使用 `npm run server` 時才提供本機預覽服務，沒有被部署到 `gh-pages`。

主要受影響鎖定版本：

| 套件與版本 | audit 結果／影響 | 路徑及處置 |
|---|---|---|
| `hexo-renderer-marked@6.3.0`、`jsdom@20.0.3` | Critical；renderer 的 `dompurify`／`jsdom` 相依鏈 | 用於建置 Markdown。若建置輸入是惡意文章內容，可能影響 CI 或生成不安全 HTML；目前沒有公開文章投稿 API。npm audit 未提供直接自動修補方案。`package.json:27`、`package-lock.json:1807,2166` |
| `form-data@4.0.2` | Critical（[GHSA-fjxv-7rqg-78g4](https://github.com/advisories/GHSA-fjxv-7rqg-78g4)、[GHSA-hmw2-7cc7-3qxx](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx)） | `jsdom` 間接相依。只有程式路徑使用到該 multipart 行為才可利用；目前沒有正式 Node API。`package-lock.json:1232` |
| `sharp@0.34.2` | High；包含 libvips、libheif、librsvg 相依漏洞（[GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj)、[GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c)、[GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w)） | 本機／CI 轉 WebP 時處理 repo 圖片，不在正式站執行。Registry 最新修補線為 `0.35.5`；目前 `package.json:32` 的 `^0.34.2` 不會接受 `0.35.x`。升級需改版本範圍與鎖檔。`package-lock.json:2804` |
| `js-yaml@4.1.0`、`minimatch@3.1.2/5.1.6`、`ws@8.18.1`、`compression@1.8.0`、`braces@3.0.3` 等 | High；含 YAML／glob ReDoS 及本機預覽 server DoS | 皆為 build/development 相依；`compression`／`ws` 等 server 類問題的攻擊面限於開啟並暴露 Hexo 預覽 server。`package-lock.json:2144,3211` 等 |

已確認的維護狀況：以 npm registry 查詢 16 個鎖定的直接依賴，沒有套件標記為 deprecated。部分套件已有新主版本，例如 Hexo `8.1.2`、`hexo-renderer-marked` `7.0.1`、`sharp` `0.35.5`；這表示應安排更新，不代表可直接升級而不測試。`hexo-deployer-git`、`hexo-generator-sitemap`、`hexo-renderer-ejs`、`hexo-server` 等目前 registry 最新版與鎖定版相同。全域 Wrangler `4.76.0` 明顯落後於本次查到的 `4.151.1`；但 Wrangler 不在 `package.json`、CI 或 repo 設定中，**不影響此網站目前的正式執行**。參考 [Cloudflare Wrangler 安裝說明](https://developers.cloudflare.com/workers/wrangler/install-and-update/) 與 [npm Wrangler 套件頁](https://www.npmjs.com/package/wrangler)。

### Lockfile 與安裝腳本

- GitHub Actions 用 `npm ci`，且 `npm ls --depth=0` 沒有 missing／invalid／extraneous 項目；目前 `package-lock.json` 與實際安裝的直接 npm 套件一致。
- repo 同時有 `pnpm-lock.yaml`，但它是舊版 `lockfileVersion: 5.4` 格式，列出的 `hexo`、`hexo-renderer-marked` 版本分別為 7.1.1、6.2.0，且沒有 `hexo-deployer-git`、`sharp`。本次 `pnpm audit --json` 以 exit code 0 回報 **0 dependencies**，不能視為無漏洞；CI 使用 npm，故 npm lock 才是實際建置依據。建議團隊選定單一套件管理器並修正另一份鎖檔，避免本機稽核出現假陰性。
- `package.json` 沒有 root `preinstall`／`postinstall`。鎖檔中的 `hexo-util` postinstall 會在套件目錄產生 highlight alias JSON；`sharp` install script 檢查 libvips，必要時才走 native build；`fsevents` 是選用的原生建置套件。本次只閱讀腳本，未執行。沒有在這些已檢查腳本中看到上傳憑證或向外傳送專案資料的程式碼。
- 未發現被 Git 追蹤的 `.env`、`.env.*` 或 `.dev.vars`，根目錄也沒有這些檔案；但 `.gitignore:1-8` 沒有忽略這些名稱，屬預防性改善，不是目前已外洩的證據。

## 四、Cloudflare 設定安全檢查

| 項目 | repo 可確認結果 | 狀態／後續 |
|---|---|---|
| Workers／Pages Functions、`compatibility_date`、flags、Bindings | 無 Wrangler config、Worker entrypoint 或 bindings | 對此 repo 不適用；若控制台另有專案，需人工盤點 |
| `nodejs_compat` | 無 Worker config，因此沒有可核對的 flag/date | 不應把 CI Node 24 認成 Worker Node runtime。Cloudflare 的 Node API 相容層是 Workers runtime 功能，不能以 repo 的 Node patch 更新處理 |
| Vars／Secrets／Cloudflare API Token | repo 未配置 Cloudflare secrets；未讀本機 Cloudflare 認證或要求擴權 | Token scope 與控制台 Secrets 無法由 repo 判定 |
| D1／KV／R2 | repo 無 Cloudflare binding／storage 程式 | 目前 codebase 不使用；帳戶內孤立資源不在 repo 證據範圍 |
| WAF／Rate Limiting／Bot 防護 | 無 IaC 或部署設定 | 控制台確認；網站未發現登入/API，因此這些屬 edge 防護狀態而非已確認漏洞。Rate limiting 可按流量與濫用風險評估 |
| DNS／`workers.dev`／`pages.dev` 旁路 | repo 部署至 `gh-pages`，但未讀 DNS 記錄或控制台部署清單 | 需確認 `blog.es2idea.com` 是否橘雲代理，並盤點任何同內容的直連 hostname／Preview deployment；本次沒有對網域或示範站做探測 |
| Security Headers | repo 沒有 `_headers` 或 Response Header Transform 設定；也未讀正式回應標頭 | **不能因此判定正式回應缺少標頭**；Cloudflare 可由 Response Header Transform Rules 設定。參考 [Cloudflare CSP 說明](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/) 與 [Response Header Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/) |
| 錯誤訊息／日誌 | 沒有本專案伺服器日誌；Actions 日誌與 Cloudflare logs 未讀取 | Cloudflare 控制台及 GitHub Actions log 留存與遮罩需人工確認；不要把 token 或個資貼入公開 log |

**控制台檢查路徑（僅供授權帳戶管理者操作）：**

1. **DNS → Records**：確認 `blog.es2idea.com` 的 A/CNAME 記錄、Proxy status、origin 對應；再與 GitHub Pages custom domain 設定核對，判斷是否存在可繞過 Cloudflare 的直接入口。
2. **SSL/TLS → Overview／Edge Certificates**：檢查 origin 憑證模式、Always Use HTTPS、HSTS 及憑證狀態；啟用 `includeSubDomains` 前先確認所有子網域均支援 HTTPS。
3. **Security → Security rules／WAF**：查看 Managed Rules、Rate limiting rules、Bot 設定與事件記錄。Cloudflare 官方 rate limit 設定路徑見[文件](https://developers.cloudflare.com/waf/rate-limiting-rules/create-zone-dashboard/)。
4. **Rules → Transform Rules → Response Header Transform Rules**：確認 `Strict-Transport-Security`、`X-Content-Type-Options`、`Referrer-Policy`、CSP 等回應標頭。此站有 inline script、Google Analytics 及 jsDelivr 資源，CSP 應先盤點來源並在 staging／Report-Only 驗證，避免直接套用造成功能故障。
5. **Workers & Pages**：查詢本網域 Routes、已部署 Workers／Pages、Preview URL、`workers.dev`／`pages.dev` Hostname、環境 Variables／Secrets 及 D1/KV/R2 bindings。若沒有相應專案，才可把本 repo 的 Cloudflare runtime 標為不適用。
6. **GitHub repo → Settings → Actions → General**：確認 workflow token 預設權限、是否允許 PR write token、fork PR policy；再查 `gh-pages` branch protection。此項不在 Cloudflare 控制台。

## 五、程式碼漏洞與改善清單

目前沒有 SQL、D1 query、CSRF、SSRF、IDOR/BOLA、租戶隔離、付款回呼、檔案上傳 API 或 session 的程式路徑，因此這些項目標為不適用，而不是未檢查的 API 漏洞。

### SEC-01｜建置相依鏈包含 Critical／High 漏洞 — P2

- **位置：** `package.json:27,32`；`package-lock.json:1232,1807,2166,2804` 等。
- **原因：** `hexo-renderer-marked@6.3.0`／`jsdom@20.0.3`／`form-data@4.0.2` 被 npm audit 列為 Critical；`sharp@0.34.2`、`js-yaml@4.1.0`、`minimatch`、`ws` 等被列為 High。
- **影響與條件：** 這些依賴由 CI／本機 build 使用，沒有正式 Node service。要影響 CI，需有可利用輸入進入相應 parser／圖片工具，或依賴本身被惡意替換；要影響訪客則還需生成並發布不安全 HTML。不能從 npm severity 直接推論正式站可遠端利用。
- **安全驗證：** `npm audit --json` 是可重現的靜態相依稽核；修補後以隔離分支執行 audit 和 build，檢查產物，不要用真實使用者圖片或攻擊 payload 做測試。
- **建議修補：** 優先將 `sharp` 更新到已修補線 `0.35.5`，並升級 `hexo-renderer-marked`／DOMPurify／jsdom 與受影響 transitive packages；人工檢視差異，不要直接使用強制升級。
- **官方參考：** 上表 GitHub Advisories 及 npm registry package advisory；PHP／Node／Go CVE 不包含在 npm audit 範圍。
- **需重新部署：** 修補後若有新 build 產物，需經 GitHub Pages 流程發布；不需要 Cloudflare Worker runtime 更新。

### SEC-02｜PR build 與 deploy 共用 `contents: write` 權限 — P2

- **位置：** `.github/workflows/deploy.yml:6-11,33-50,76-84`；Actions 使用 tag 而非固定 commit SHA：`:25,28,44`。
- **原因：** PR 和 push main 共用 `build` job；workflow 層級授予 `contents: write`，同 job 也執行 PR 可控制的 `npm ci`／`npm run build`。GitHub 對 fork PR 預設使用唯讀 token，但 repo 設定可改變 fork token 政策；同 repo PR 也需以實際權限確認。
- **影響與條件：** 若不受信任 PR 程式碼可拿到寫入 token，理論上可能更改 repository branch 或部署分支。可利用性取決於 PR 來源、repo Actions 設定及 `gh-pages` 保護；本次沒有證據確認外部 PR 已取得 write token。
- **安全驗證：** 檢查 GitHub Actions → General 的 workflow permissions 與 fork PR policy；在 workflow YAML 靜態核對每個 job 的 `permissions`，不要嘗試外傳 token。
- **建議修補：** `build` job 設 `contents: read`；拆出只在 main push 執行的 deploy job，僅該 job 授予 `contents: write`；將 `actions/checkout`、`setup-node`、`upload-artifact` 釘選到已核實的 full-length commit SHA。
- **官方參考：** [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)、[fork PR token 權限](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)。
- **需重新部署：** workflow 變更需由 GitHub Actions 執行以驗證；不必更動 Worker 或 Cloudflare runtime。若 main push 同時觸發 deploy job，靜態站會再發布一次。

### SEC-03｜Markdown 與 JSON-LD 使用未跳脫輸出 — P2（需跨越內容信任邊界才可利用）

- **位置：** `themes/hexschool/layout/_partial/article.ejs:15,22`、`themes/hexschool/layout/post.ejs:31`、`themes/hexschool/layout/_partial/structured-data.ejs:635,657,768`。
- **原因：** EJS `<%- ... %>` 會輸出未 HTML-escape 內容；文章內容保留 renderer 產生的 HTML。JSON-LD 以 `JSON.stringify(...)` 直接插入 `<script>`，但未將 `<` 編碼，若來源欄位帶有 `</script>`，HTML parser 仍可能結束 script element。
- **影響與條件：** 文章 front matter／Markdown 目前由 repo 編輯者控制；沒有公開投稿 API。若未審核的外部貢獻、內容匯入或被竄改的來源能進入發布流程，訪客可能遇到同源 stored XSS。現在沒有證據顯示存在該外部內容入口。
- **安全驗證：** 在隔離副本以不執行程式的字串 `</script><b>SECURITY-QA</b>` 測試產物結構，檢查該字串是否能離開 JSON-LD script／是否以原始 HTML 呈現；不要在正式站插入可執行 payload。
- **建議修補：** 對 JSON-LD 將 `<` 編碼為 `\u003c` 後再輸出；對內容建立允許的 HTML tag／attribute policy，或關閉不需要的 raw HTML；明確限制文章來源及 PR review 權限。
- **官方參考：** [EJS escaping](https://ejs.co/#docs) 與 [HTML script parsing 規則](https://html.spec.whatwg.org/multipage/parsing.html#script-data-state)；此項由 repo 靜態輸出位置證實，利用條件仍依賴內容來源信任邊界。
- **需重新部署：** 需要重新產生靜態 HTML 並更新 GitHub Pages。

### SEC-04｜Swiper 使用浮動 CDN 版本，未設 SRI — P2

- **位置：** `themes/hexschool/layout/layout.ejs:17`；CSS 另見 `themes/hexschool/layout/_partial/head.ejs:80-84`。
- **原因：** `swiper@11` 會隨 CDN 上該主版本更新；script 沒有 SRI。Bootstrap script 有 SRI，可作為同一專案已使用完整性校驗的對照。
- **影響與條件：** 若 CDN 帳號、發布來源、傳輸供應鏈或資源回應遭竄改，外部 script 可在網站 origin 權限下執行。沒有證據顯示目前 jsDelivr 資源已遭竄改。
- **安全驗證：** 在 staging 的瀏覽器 DevTools 檢查實際 script URL 與回應 hash；對固定版本檢查本地計算的 SRI 與 HTML 的 integrity 值一致。
- **建議修補：** 改成精確 patch URL 並加入 SRI，或將已審核版本自託管；第三方 script 最小化並搭配逐步導入的 CSP。
- **官方參考：** [W3C Subresource Integrity 規範](https://www.w3.org/TR/SRI/)；來源位置見上述 repo 檔案。
- **需重新部署：** 需要重新產生及發布靜態 HTML。

### SEC-05｜`pnpm-lock.yaml` 過期，`pnpm audit` 回報零套件 — P2

- **位置：** `pnpm-lock.yaml:1-26`；`package.json:16-32`；CI 的 `npm ci` 在 `.github/workflows/deploy.yml:33-34`。
- **原因：** pnpm lock 版本與目前 pnpm 輸出格式不一致，依賴清單比 manifest 少 `hexo-deployer-git`、`sharp`，且鎖定版本與 npm lock 不同；本次 pnpm audit metadata 顯示 0 dependencies。
- **影響與條件：** CI 仍依 npm lock 建置，所以此刻不影響正式產物；使用 pnpm 的開發者可能得到不完整／不同依賴樹，也可能誤把空稽核結果當作安全。
- **安全驗證：** 比對 manifest、兩份鎖檔及 CI 安裝命令；修正後確認 `pnpm audit` 的 dependency count 非 0 並能以 frozen lock 安裝。
- **建議修補：** 指定唯一套件管理器；若保留 pnpm，於核准的依賴更新變更中重新產生 lockfile，並把 CI 安裝方式明確統一。此報告沒有執行安裝或重建鎖檔。
- **需重新部署：** 單獨修正未被 CI 使用的 pnpm lock 不需網站重部署；若轉換 CI package manager 則需 pipeline 驗證。

### SEC-06｜環境檔未加入 `.gitignore` — P3

- **位置：** `.gitignore:1-8`。
- **原因：** 忽略清單沒有 `.env`、`.env.*`、`.dev.vars`。本次檔名檢查沒有找到 repo 已追蹤或根目錄已存在的這些檔案。
- **影響與條件：** 目前沒有證據顯示憑證已提交；風險是日後本機新增環境檔時容易誤加入 Git。
- **安全驗證：** 更新忽略規則後以 `git check-ignore` 驗證路徑；只檢查檔名和追蹤狀態，不印出檔案內容。
- **建議修補：** 加入專案適用的 `.env*` 與 `.dev.vars` 規則，必要時保留 `.env.example` 樣板。
- **需重新部署：** 不需要網站重部署；需檢查版本控制狀態。

### SEC-07｜Widget 接收訊息時未核對來源 — P3（低影響）

- **位置：** `source/avatar/widget.html:569-577`；host side 有檢查 `event.origin`，見 `source/avatar/embed.js:80-85`。
- **原因與影響：** iframe 接收 `say`／`open` 訊息沒有確認 `event.origin` 或 `event.source`；目前動作只會朗讀文字或調整 widget，沒有登入、資料寫入或權限操作。任意可嵌入頁面可能造成語音干擾，未發現可藉此讀取資料或執行程式碼的路徑。
- **安全驗證：** 以本機或 staging 測試頁傳送非執行文字訊息，確認只有預期 origin 能控制 widget；不對第三方頁面測試。
- **建議修補：** 若 widget 只供自家頁面使用，核對允許的 parent origin；如需公開跨站嵌入，加入明確嵌入來源政策並保留最小訊息能力。
- **需重新部署：** 若修改 widget JS/HTML，需要重建並發布靜態檔。

## 六、需要人工確認的項目

1. 最近一次 GitHub Actions run 的 Node `--version` 是否為 `24.22.1` 或更新的 24.x patch；確認 `setup-node` 實際下載版本與 workflow token permissions。
2. Cloudflare 是否代理 `blog.es2idea.com`，以及 GitHub Pages 自訂網域是否存在可直連的 origin／`github.io` hostname。
3. Cloudflare 是否還有同網站的 Workers／Pages Functions、`workers.dev`／`pages.dev` 預覽部署、Cron、Secrets、API routes 或 D1／KV／R2 bindings。若有，這些資源不在目前 repo 稽核範圍，需另行核對程式與權限。
4. Cloudflare SSL/TLS、WAF managed rules、Rate Limiting、Bot 防護、Response Header Rules、HSTS、CSP、日誌和錯誤頁是否已設定。
5. Cloudflare API Token 權限、GitHub Actions 允許 PR 的 token 設定，以及 `gh-pages` branch protection。不要將 token 值貼到報告或終端輸出。
6. 任何未納入此 repo 的外部 PHP／Go／Node backend、第三方服務或正式資料庫；本次沒有探測正式網站或其外部示範連結。

## 七、建議修補順序

| 順序 | 項目 | 時機 |
|---:|---|---|
| 1 | 更新 `sharp`、`hexo-renderer-marked`、`jsdom`／`form-data` 及 npm audit 指出的 transitive 依賴；先在隔離分支做相容性建置 | 下一次正式發布前優先 |
| 2 | 將 PR build 限制為 `contents: read`，另設只有 main push 可執行的 write-enabled deploy job；pin Actions SHA | 接受外部／低信任 PR 前優先 |
| 3 | 修正 Markdown raw HTML 和 JSON-LD 的 HTML context escaping | 下次內容模板發布前 |
| 4 | Swiper 固定版本並加 SRI／自託管；規劃 CSP 時先 staging Report-Only | 後續前端安全強化 |
| 5 | 統一 npm／pnpm lockfile，忽略 `.env*`／`.dev.vars` | 同一批維護 PR，可晚於 P2 執行 |
| 6 | 人工檢查 Cloudflare DNS、TLS、headers、WAF、預覽部署及 GitHub Pages 旁路 | 取得帳戶管理員既有權限後確認；本報告未請求擴權 |

## 八、修補後測試與回復計畫

本次未執行 build、測試、攻擊 payload、正式網址探測、Migration、Cloudflare 設定變更或部署。修補後建議在獨立分支完成以下驗證，再依既有發布流程推送：

1. `npm ci` 後核對 `npm ls --depth=0`、`npm audit` 與 Node patch；不要執行自動強制更新。
2. 執行 `npm run verify:post-dates` 與 `npm run build`，比較生成 HTML、JSON-LD、文章頁、圖片與 WebP；確認舊文章／嵌入內容沒有意外變形。
3. 對 XSS 輸出使用 inert canary（不含可執行程式碼）檢查 JSON-LD 和文章輸出；在 staging 驗證 SRI、CSP Report-Only 及安全標頭。
4. GitHub Pages 發布後只驗證有授權的正式／staging hostname，分別核對 Actions run、`gh-pages` commit、回應標頭及 Cloudflare cache；不要把一次成功的 build 當成 edge 設定驗收。
5. 回復時 revert 對應的依賴／模板／workflow commit，再由原有 GitHub Pages pipeline 發布上一個已知正常版本。Cloudflare Rule 若日後有變更，先保存原設定，依該 Rule 的既有版本或紀錄回復；此次沒有變更 Cloudflare 設定。

## 九、修補紀錄（2026-10-22；尚未部署）

| 項目 | 修補狀態 |
|---|---|
| Node 建置版本 | GitHub Actions 固定至 Node `24.22.1`。 |
| Hexo／建置依賴 | `hexo` 更新至 `8.1.2`、`hexo-renderer-marked` 更新至 `7.0.1`、`hexo-util` 更新至 `4.0.0`、`sharp` 更新至 `0.35.5`；npm lock 已更新，pnpm lock 由 npm lock 重新匯入。 |
| GitHub Actions 權限 | Build job 僅有 `contents: read` 並關閉 checkout credential 持久化；僅 main push 的 deploy job 有 `contents: write`。Actions 改為完整 commit SHA。產物下載至 runner 暫存目錄，避免在切換 `gh-pages` 後把 `public/` 子目錄一併部署。 |
| JSON-LD | 所有結構化資料序列化時將 `<` 編碼為 `\\u003c`，防止內容提早結束 script element。 |
| Swiper CDN | CSS／JS 固定至 `11.2.10` 並加上 SRI。 |
| Avatar iframe | 接收訊息時同時核對來源視窗與同源 origin。 |
| 環境檔 | `.gitignore` 加入 `.env*` 與 `.dev.vars*` 忽略規則，保留 `.env.example`。 |

修補後唯讀 `npm audit` 為 **0 Critical、9 High、2 Moderate**；`pnpm audit` 為 **1 High、1 Moderate**。剩餘 npm 項目位於 Hexo CLI／部署器／sitemap 的舊版傳遞依賴（如 `hexo-fs`、`chokidar`、`nunjucks`、`braces`、`sprintf-js`）。npm 沒有提供符合目前版本範圍的自動修補方案；`--force` 會建議降回 Hexo `3.9.0`、部署器 `0.3.1` 等舊版，因此未採用。

Markdown 原始 HTML 維持現況：目前文章來源是 repo 內的 Markdown，未發現公開投稿 API；但 GitHub branch protection／PR 審核設定未確認，不能假設內容只會由受信任維護者提交。大量文章使用 iframe，另有少數第三方嵌入 script；全站啟用 DOMPurify 可能改變這些內容。此條件式風險仍需另行設計允許清單並做產物回歸檢查。Cloudflare 控制台項目仍未確認。

修補後驗證（2026-10-22）：審查 `npm ci` 會執行的套件腳本後，以 `npm ci --no-audit --no-fund` 安裝成功；`npm run verify:post-dates` 通過（231 篇文章）；`npm run build` 通過，並產生本機 `public/`。`npm run verify:jsonld -- --mode=local` 抽查 6 個路徑全部通過。第一次檢查發現 AEO 文章明明有 5 題 FAQ，驗證器卻預期沒有 FAQ；已將 `tools/validate-jsonld.js` 的該筆預期改為有 FAQ，重跑後 6/6 通過。另以 inert canary 確認 JSON-LD 序列化會把 `<` 編碼，且解析後還原原字串。`npm audit` 為 0 Critical、9 High、2 Moderate。`npm ls --depth=0` 顯示 `@img/sharp-wasm32` 與 `@emnapi/runtime` 兩個 optional 套件為 extraneous；本機 Sharp 已在 build 中完成圖片轉 WebP。未檢查瀏覽器視覺結果，未掃描正式站，也未提交、推送或部署；Cloudflare 控制台設定仍未確認。

## 參考來源

- [PHP 官方 2026-10-21 安全公告](https://www.php.net/archive/2026.php#2026-10-21-5)
- [Node.js 22.23.4 release](https://nodejs.org/pt-br/blog/release/v22.23.4)、[Node.js download page](https://nodejs.org/en/download)（列出 24.22.1／26.12.1）、[Node.js October 2026 security releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
- [Go Vulnerability Database GO-2026-6809](https://pkg.go.dev/vuln/GO-2026-6809)、[Go release history](https://go.dev/doc/devel/release)
- [Cloudflare Workers／Wrangler 說明](https://developers.cloudflare.com/workers/wrangler/install-and-update/)、[Cloudflare CSP 說明](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/)
- [GitHub Actions 安全使用指引](https://docs.github.com/en/actions/reference/security/secure-use)、[GitHub fork PR token 權限](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
