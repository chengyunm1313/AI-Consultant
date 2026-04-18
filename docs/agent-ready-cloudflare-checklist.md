# `blog.es2idea.com` Agent-Ready Cloudflare 設定清單

這份清單對應目前 `isitagentready.com` 掃描中，內容網站真正有意義且應補齊的三項能力：

1. 首頁 `Link` response headers
2. `Accept: text/markdown` 的 Markdown negotiation
3. `robots.txt` 的 `Content-Signal`

其中 `robots.txt` 已由 repo 輸出完成；剩下兩項需要在 Cloudflare Dashboard 設定。

## 1. 啟用 Markdown for Agents (付費專案才支援，免費版本目前沒看到)

目標：

- 讓 `Accept: text/markdown` 請求可拿到 markdown
- 一般瀏覽器仍維持 HTML

建議設定：

1. 進入 Cloudflare Dashboard
2. 選擇 `blog.es2idea.com` 所在 zone
3. 找到 `Markdown for Agents`
4. 啟用功能
5. 套用到整個 hostname 或至少所有 HTML 路徑

驗證指令：

```bash
curl -i -H 'Accept: text/markdown' https://blog.es2idea.com/
```

驗收重點：

- `Content-Type: text/markdown`
- 內容不是原始 HTML
- 若 Cloudflare 有提供，回應會帶 `x-markdown-tokens`

## 2. 新增首頁 Link response headers

目標：

- 在首頁 `/` 宣告這個內容站已提供給 agent 看的機器可讀資源

建議做法：

- 使用 Cloudflare `Transform Rules`
- 或用等效的 response header 規則

建議加在首頁 `/` 的 headers：

```text
Link: </llms.txt>; rel="describedby"; type="text/plain"
Link: </robots.txt>; rel="describedby"; type="text/plain"
Link: </sitemap.xml>; rel="describedby"; type="application/xml"
```

補充：

- 不要在這一輪宣告 `api-catalog`
- 也不要加 `service-desc` 或 `service-doc`
- 目前站點沒有真實 API，避免誤導 agent

驗證指令：

```bash
curl -I https://blog.es2idea.com/
```

驗收重點：

- 回應中可看到至少一組 `Link` header
- `Link` 指向現有可用資源
- `rel` 使用 `describedby`

---

根據剛才實作的踩坑經驗與 Cloudflare 介面的邏輯，我為你優化了這份說明文字。這次優化重點在於精確化操作路徑、防呆設定（避免跑錯去 Page Rules），以及提供一鍵複製的合併字串。

2. 新增首頁 Link Response Headers
目標
在首頁 / 宣告機器可讀資源（Machine-readable resources），引導 AI Agents（如 GPT, Claude, Perplexity 等）優先讀取網站說明文件。
建議做法：Cloudflare 轉換規則
請勿使用「網頁規則 (Page Rules)」，該功能不支援新增 Header。請使用 「轉換規則 (Transform Rules)」 中的 「回應標頭轉換規則 (Modify Response Header)」。
路徑： Cloudflare 控制面板 > 規則 (Rules) > 轉換規則 (Transform Rules) > 建立規則 > 回應標頭轉換規則
詳細設定內容
1. 匹配條件 (Matching Rules)
確保標頭僅在首頁觸發，避免影響其他靜態資源。
•	欄位：主機名稱 (Hostname) — 等於 — blog.es2idea.com
•	且 (And)
•	欄位：URI 路徑 (URI Path) — 等於 — /
2. 修改回應標頭 (Modify Response Header)
•	動作：設定靜態 (Set static)
•	標頭名稱：Link
•	值 (Value)：（建議直接複製下方合併字串，單一 Header 即可宣告多個資源）
</llms.txt>; rel="describedby"; type="text/plain", </robots.txt>; rel="describedby"; type="text/plain", </sitemap.xml>; rel="describedby"; type="application/xml"

補充說明
•	精簡宣告：本階段僅宣告基礎資源。請勿加入 api-catalog、service-desc 或 service-doc，因為目前站點尚無對外開放的真實 API，避免誤導 Agent 進行無效請求。
•	合併標頭：在 HTTP 協議中，多個 Link 關係可以用逗號分隔合併在同一個 Header 中，這對 Cloudflare 設定與 Agent 讀取最為友善。
驗證與驗收
驗證指令：
curl -I https://blog.es2idea.com/

驗收重點：
	1.	狀態碼：回應應為 HTTP 200。
	2.	標頭存在：回應中必須包含 link: 欄位。
	3.	內容檢查：link 內容需包含指向 /llms.txt 的路徑，且 rel 屬性正確使用 describedby。
這樣寫不僅流程清晰，連最細微的介面名稱都對齊了，之後無論是自己複查還是交給團隊執行都會非常順手！

## 3. robots.txt Content-Signal

這項已經由 repo 產出，設定如下：

```text
User-agent: *
Allow: /
Content-Signal: ai-train=no, search=yes, ai-input=no
```

驗證指令：

```bash
curl https://blog.es2idea.com/robots.txt
```

## 4. 預期結果

完成 Cloudflare 端設定後，重新跑 `isitagentready.com`，這三項應該改善：

- `Link headers`: pass
- `Markdown for Agents`: pass
- `Content Signals`: pass

以下項目預期仍不通過，且目前是刻意不做：

- API Catalog
- OAuth discovery
- OAuth Protected Resource Metadata
- MCP Server Card
- Agent Skills index
- WebMCP

原因是 `blog.es2idea.com` 目前是內容網站，不對外提供真實 API、受保護資源、MCP server 或 agent 工具。
