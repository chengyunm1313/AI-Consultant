# `blog.es2idea.com` Agent-Ready Cloudflare 設定清單

這份清單對應目前 `isitagentready.com` 掃描中，內容網站真正有意義且應補齊的三項能力：

1. 首頁 `Link` response headers
2. `Accept: text/markdown` 的 Markdown negotiation
3. `robots.txt` 的 `Content-Signal`

其中 `robots.txt` 已由 repo 輸出完成；剩下兩項需要在 Cloudflare Dashboard 設定。

## 1. 啟用 Markdown for Agents

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
