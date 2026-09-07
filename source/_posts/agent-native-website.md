---
title: '【AI 幫你做網站還不夠：下一代網站，應該讓 AI Agent 能直接操作】'
cover: /images/cover158.png
toc: true
categories:
  - AI自動化
tags:
  - AI Agent
  - AI自動化
  - Vibe Coding
date: 2026-09-07 17:15:30
subtitle: 從 AI 建站走向 Agent-native Website
description: AI 幫你做網站，不代表 AI 能操作網站。本文拆解 MCP、Service Layer、Agent-native Website 與 Self-Optimizing Website 的演進，並整理權限、人工核准與 Audit Log 的實作思路。
---

最近看到有人分享「MCP 網站」的概念。

他舉了一個很直覺的例子：

以前網站做好之後，想改一個標題、換一段服務說明，可能還得登入後台，甚至重新找工程師；但網站接上 MCP 之後，可以直接告訴 AI：

> 把首頁這段改成今年的活動內容。

AI 就能直接替你處理。

一開始我也在想：

現在 ChatGPT、Codex、Claude Code 都已經可以幫我們做網站了，那我用 AI 做出來的網站，不就算 MCP 網站嗎？

深入拆解後，我才發現這其實是兩件完全不同的事。

而且真正值得注意的，不只是 MCP。它背後其實正在浮現一種新的網站架構：

> Agent-native Website。

也就是網站不再只設計給「人」操作，同時也開始設計給「AI Agent」操作。

這可能會是 Vibe Coding 下一個很值得注意的發展方向。

## AI 幫你做網站，不等於 MCP 網站

先釐清第一個最容易混淆的地方。

假設今天我跟 ChatGPT Sites、Codex 或 Claude Code 說：

> 幫我做一個品牌官網。

AI 幫我完成：

- 首頁
- 商品頁
- 表單
- 後台
- 資料庫
- 部署

這叫做 **AI-assisted Website Development**，也就是「AI 幫我做網站」。

但網站上線之後，如果 AI 沒辦法透過標準介面去讀取、查詢、修改與操作網站，那它並不會因為是 AI 做的，就自動變成「MCP 網站」。

這兩件事情必須分開：

> AI 幫你建立網站
> ≠
> AI 可以操作網站

前者解決的是「開發」；後者解決的是「營運」。

我反而覺得，後者可能更值得關注。

## MCP 到底在網站裡扮演什麼角色？

MCP 是 Model Context Protocol 的縮寫。如果用很簡化的方式理解，可以把它想成：

> 讓 AI Agent 知道外部系統有哪些能力，並且可以使用這些能力的一套標準介面。

傳統網站通常長這樣：

~~~text
使用者
  ↓
Browser
  ↓
Frontend
  ↓
Backend / API
  ↓
Database
~~~

管理網站的人則可能走另一條路：

~~~text
管理者
  ↓
/admin
  ↓
Backend
  ↓
Database
~~~

所以網站其實一直都是：

> Human-first。

所有東西都是設計給人點的：按鈕、選單、表單、Dashboard 與 CMS。

但 MCP 加進來後，會多出另一個入口：

~~~text
AI Agent
   ↓
MCP Client
   ↓
MCP Server
   ↓
Website Services
   ↓
Database / CMS / API
~~~

這時候 AI 不需要像人一樣：

> 登入後台 → 找到文章 → 點編輯 → 修改 → 按發布。

它可能直接呼叫：

~~~text
get_pages()
update_page()
create_article()
get_products()
update_product()
get_orders()
get_analytics()
~~~

這才是 MCP 真正有意思的地方。

## MCP 不是裝在網站前台

這也是我一開始很容易誤解的地方。

既然叫「MCP 網站」，是不是代表要在網站裡面裝一個 MCP？

其實不應該這樣理解。比較好的架構應該是：

~~~text
                       ┌─ Website Frontend
                       │
Website Services ──────┼─ Admin
                       │
                       ├─ REST API
                       │
                       └─ MCP Server
                              ↑
                              │
                          AI Agent
~~~

- Frontend 是給消費者使用。
- Admin 是給管理者使用。
- API 是給其他程式使用。
- MCP 則是提供給 AI Agent。

所以我反而比較喜歡一個更精準的名稱：

> MCP-enabled Website。

因為 MCP 並不是「網站本身」，而是網站額外提供的一個 Agent Interface。

## MCP 跟 API 到底差在哪裡？

這也是另一個很常見的問題。

既然網站本來就有 API：

~~~text
GET /api/products
POST /api/articles
PATCH /api/pages/123
~~~

為什麼還需要 MCP？

因為 API 主要是設計給：

> 程式使用。

MCP 則更進一步讓：

> AI Agent 理解這個系統有哪些能力，以及什麼時候該使用它。

例如原本網站有：

~~~text
GET /api/orders
~~~

可以再包裝成 Agent 容易理解的工具：

~~~javascript
get_orders({
  date,
  status
})
~~~

並且描述：

> 取得指定日期與狀態的網站訂單。

Agent 就比較容易知道：「當使用者問我昨天有哪些訂單時，我應該使用 get_orders。」

因此底層甚至可以完全共用同一套 Service，差別主要在於介面服務的對象不同：

~~~text
API
 ↓
Program Interface

MCP
 ↓
Agent Interface
~~~

## 真正重要的其實是 Service Layer

這是我研究完後，覺得 Vibe Coding 特別應該注意的一件事情。

很多人用 AI 做網站，很容易把所有商業邏輯直接寫進 UI：

~~~text
Button
  ↓
onClick()
  ↓
Database
~~~

網站當然還是可以跑。

但以後想串 API、手機 App、Agent 或 MCP，就會變得很麻煩。

所以如果現在重新設計我的 Vibe Coding 網站 SOP，我會要求 Codex 或 Claude Code：

> 所有核心商業功能不得只存在於 UI Event Handler，必須抽象成可重複呼叫的 Service Layer，為未來 REST API、MCP Server 與 AI Agent 操作預留介面。

例如：

~~~javascript
getProducts()
getOrders()
getCustomers()
createArticle()
updateArticle()
updateProduct()
getAnalytics()
updateHomepage()
~~~

最後變成：

~~~text
Frontend
                    ↓
                ┌────────┐
Admin ─────────→│ Service│←──────── REST API
                │ Layer  │
                └────┬───┘
                     ↑
                     │
                    MCP
                     ↑
                     │
                  AI Agent
~~~

這樣即使今天沒有 MCP，網站本身也已經 Agent Ready。未來要增加 MCP，就不需要把整個網站重新打掉。

如果你正在設計自己的 AI Coding 工作流，也可以延伸閱讀[Skill 之後，下一個 AI 開發者一定要懂的詞：Agent Harness](/posts/skill-to-agent-harness/)；它能幫助你理解 Model、Context、Tools、Skills 與權限如何組成一個可持續工作的 Agent 系統。

## 從 AI Website 到 Agent-native Website：五個階段

我現在會把這件事情分成五個 Level。

### Level 1：AI 幫你做網站

~~~text
人
 ↓
ChatGPT Sites / Codex / Claude Code
 ↓
Website
~~~

AI 是開發工具，網站本身仍然是傳統網站。

### Level 2：AI 幫你修改網站

例如：

~~~text
你
 ↓
Codex
 ↓
GitHub
 ↓
修改程式碼
 ↓
Commit
 ↓
Cloudflare / Vercel
~~~

這已經很好用了，但仍然比較接近 **AI Software Engineering**，而不是 Agent-native Website。

### Level 3：MCP-enabled Website

開始讓 AI Agent 直接使用網站能力：

~~~text
你
 ↓
AI Agent
 ↓
MCP
 ↓
Website Services
~~~

例如：

> 把首頁的活動改成櫻桃季。

Agent 不一定需要修改程式碼，而是直接呼叫：

~~~text
get_campaign()
update_campaign()
update_homepage()
~~~

這時網站才真正開始「AI 可操作」。

### Level 4：Agent-native Website

這一層就更有意思了。

網站從設計第一天就同時考慮兩種使用者：

> Human + AI Agent。

架構可能變成：

~~~text
┌──────────────────────────┐
│     Human Interface      │
│                          │
│ Frontend       /admin    │
└─────────────┬────────────┘
              │
       Website Services
              │
     ┌────────┼────────┐
     ↓        ↓        ↓
 Database    API      MCP
                       ↑
                       │
                   AI Agents
~~~

這時候網站已經不只是一堆網頁，而是一組：

> 可以被人使用，也可以被 Agent 呼叫的商業能力。

### Level 5：Self-Optimizing Website

再往前一步，Agent 不只操作網站，還可以持續監測、分析、提出修改建議，並在人工核准後執行優化。

這時網站開始具備一個新的循環：

~~~text
監測
  ↓
分析
  ↓
提出建議
  ↓
人工核准
  ↓
修改網站
  ↓
重新驗證
  ↓
持續追蹤
~~~

這條演進路線，也可以和我先前整理的 [MCP、Skill 與 CLI 差異](/posts/ai-agent-tools-mcp-skill-cli/)一起閱讀：前者偏向網站如何成為 Agent 可操作的系統，後者則整理 AI 工具各自扮演的角色。

## Brand Agent：網站營運者不一定是人

拿「鮮生小姐」來想，就會非常具體。

例如我自己的實驗專案「鮮生小姐」，未來如果把網站 Agent 化，可以提供：

~~~text
get_products
update_product
get_campaigns
create_campaign
get_articles
create_article
get_homepage
update_homepage
get_customer_inquiries
get_site_analytics
~~~

於是我不一定要登入網站後台，而是直接告訴自己的 Brand Agent：

> 櫻桃季快到了，幫我檢查網站有哪些內容應該更新。

Agent 可以先查詢：

~~~text
get_products
get_campaigns
get_homepage
get_articles
~~~

然後告訴我：

- 首頁還在主推上一檔活動。
- 櫻桃商品頁的產季資訊需要更新。
- 今年還沒有建立送禮相關內容。

我再說：

> 幫我準備新版，但先不要發布。

Agent 建立 Draft。

我確認：

> OK，發布。

Agent 再透過 MCP 更新。

這時候 AI 已經不是「網站製作工具」，而是開始變成：

> 網站營運者。

甚至，鮮生小姐的擬人化 AI 代言人 Cherry，也可以不只是品牌角色，而是 Brand Agent。

她可以同時理解：

- 網站資料
- 訂單
- 商品
- 內容
- Analytics
- SEO、AEO 與 GEO

接著回答：

> 最近櫻桃禮盒頁面的流量上升，但轉換率下降，我建議調整首頁 CTA，另外建立一篇今年櫻桃送禮指南。

這時候 IP 就開始從「虛擬代言人」進化成「可以工作的 AI 員工」。

## SEO、AEO、GEO、AXO 與 MCP 如何串起來？

我最近本來就在研究另一件事情：網站到底要怎麼讓 AI 更容易找到、理解、引用？

傳統網站第一層還是 SEO，例如 Title、Meta、H1-H3、Schema、內部連結與網站效能等。

接著進入 AEO／GEO，要思考的不只是排名，而是：

> AI 能不能理解並引用我的內容？

所以內容開始需要注意：

- 是否直接回答問題。
- 是否有明確定義。
- 是否標示來源、作者與更新日期。
- 段落能不能獨立理解。
- 是否有問題式標題。
- 是否提供比較與步驟。
- 是否有真正的原創經驗與案例。

再下一層則是 AXO：

> AI Agent 能不能理解這個網站？

最後再往下一層：

> AI Agent 能不能操作這個網站？

這時候 MCP 就出現了。

我開始把整套網站優化流程重新理解成：

~~~text
Website
  ↓
SEO
讓搜尋引擎找到
  ↓
AEO / GEO
讓 AI 理解、引用
  ↓
AXO
讓 Agent 理解網站與能力
  ↓
Agent Ready
整理 Service / API / 權限
  ↓
MCP-enabled
讓 Agent 可以操作
  ↓
Agent Automation
讓 Agent 可以持續工作
~~~

這可能會變成我以後做網站時的新 SOP。

如果想先理解 AXO 與 WebMCP 的差異，可以閱讀[SEO、AEO 之後的 AXO：讓 AI Agent 真正完成網站任務](/posts/agent-experience-optimization-axo/)。那篇文章偏向 Agent Experience 與任務完成；本文則進一步把焦點拉到網站內部的 Service、MCP 與營運治理。

## Self-Optimizing Website：網站自己優化自己

我原本就在規劃 AI 搜尋能見度健檢工具。

不是只給一個「GEO 72 分」，而是實際測量品牌是否被 AI 提及、是否被列為推薦選項、引用哪個頁面，以及競品出現頻率。

以前做到這裡，下一步通常是：

~~~text
發現問題
  ↓
產生報告
  ↓
交給人修改
~~~

如果加入 Agent + MCP，流程就可能變成：

~~~text
SEO / AEO / GEO Agent
        ↓
掃描網站
        ↓
發現問題
        ↓
提出修改方案
        ↓
Human Approval
        ↓
MCP
        ↓
修改 Website
        ↓
重新檢測
        ↓
記錄結果
        ↓
持續追蹤
~~~

例如 AI 發現「櫻桃送禮推薦」這個頁面被 AI 引用率偏低，就可以分析原因，建議增加：

- 比較表
- FAQ
- 作者資訊
- 原創資料
- 更明確的答案段落

人工核准後，Agent 再修改網站，重新測試 ChatGPT、Gemini 或 Claude 等 AI 能見度，一個月後比較變化。

這時候網站就不只是「做好 → 上線 → 放著」，而是：

> 監測 → 分析 → 建議 → 修改 → 驗證 → 再優化。

MCP 很可能就是這個循環中缺少的最後一塊：

> Execution Layer。

## Agent 權限不能全部開放

當 AI 可以直接操作網站後，問題也跟著出現。

例如：

~~~text
delete_customer
refund_order
change_price
publish_page
delete_product
~~~

如果全部交給 Agent 自由操作，風險太高。

所以我認為 Agent-native Website 至少應該把權限拆成四層：

| 權限層級 | 可以做什麼 | 建議治理方式 |
| --- | --- | --- |
| Read | 查詢文章、商品、訂單與流量 | 可讓 Agent 自動處理 |
| Draft | 建立文章草稿、活動草稿與 SEO 修改建議 | 可自動建立，但不直接發布 |
| Write | 修改商品、內容與首頁 | 視情況授權，必要時要求確認 |
| Critical | 刪除資料、退款、修改權限與重要交易 | 必須 Human Approval |

而且所有 Agent 操作都應該留下 Audit Log：

~~~text
Agent: SEO-Agent
Action: update_page
Page: /cherry-gift
Reason: AEO Optimization
Approved by: Sean
Time: 2026/09/07 08:30
~~~

這才會是一個真正能進企業環境的 Agent 架構。

## 網站後台可能會被重新定義

以前 CMS 解決的是：

> 不會寫程式的人，怎麼修改網站？

所以我們做出了 WordPress、網站後台與 Page Builder。

但 Agent 時代開始出現另一個問題：

> 如果我根本不用自己操作後台呢？

我只需要說：

- 把今年所有過期活動整理出來。
- 先幫我更新成 2026 版本。
- 發布之前給我看。
- 這三頁 OK，其他先不要動。

AI 自己完成剩下的工作。

這不代表 /admin 會消失。後台仍然很重要，因為需要：

- 人工檢視
- 權限管理
- Audit Log
- 緊急操作
- 資料校正

但 /admin 可能會從：

> 主要工作介面

慢慢變成：

> 管理、監督與治理介面。

真正每天工作的入口，反而可能是 AI Agent。

## Vibe Coding 的下一階段，也許不是更快做網站

過去兩年大家在比：

> 誰能更快用 AI 做出網站？

從幾天做到幾小時，再做到一句 Prompt 就能建立。

但當「建立網站」越來越便宜之後，下一個問題自然會變成：

> 網站做好之後，誰來經營它？

所以 Vibe Coding 下一階段可能不是：

> AI 幫你做網站。

而是：

> AI 幫你經營網站。

再下一階段甚至是：

> AI Agent 成為網站的一級使用者。

所以我現在會把這幾個概念清楚分開：

| 階段 | 核心能力 |
| --- | --- |
| AI Website | AI 幫你建立網站 |
| AI-maintained Website | AI 幫你修改網站 |
| MCP-enabled Website | AI 可以操作網站能力 |
| Agent-native Website | 網站從架構開始同時為 Human 與 Agent 設計 |
| Self-Optimizing Website | Agent 可以監測、分析、改善並驗證網站 |

這條演進路線，我覺得才是 MCP 對網站真正有趣的地方。

未來做網站，我可能不會再只問：

- 手機版做好了嗎？
- SEO 做好了嗎？
- AEO／GEO 做好了嗎？

還會多問兩個問題：

> 這個網站 Agent Ready 了嗎？

以及：

> 我的 AI Agent，可以安全地替我操作這個網站了嗎？

當答案是 Yes 的時候，這個網站才真正從一個「網頁集合」，開始變成一個：

> 可以被 AI 理解、呼叫、操作，甚至持續改善的數位商業系統。

## 結語：下一代網站要問的是 Agent 能不能使用我？

以前我們做網站，會問：

> Google 搜不搜尋得到我？

後來我們開始問：

> ChatGPT 會不會理解並推薦我？

接下來真正重要的問題可能是：

> 當 AI Agent 選擇了我，它能不能順利使用我？

這就是：

> SEO → AEO → AXO。

從被搜尋，到被理解，再到被執行。

MCP 值得注意的地方，也不只是多了一個網站 API，而是它讓我們看見一種可能：Web 正在開始為 AI Agent 重新設計。

未來網站的競爭力，不只在於誰的介面漂亮、SEO 做得好或內容寫得完整，也可能取決於：

> 你的網站，準備好被 Agent 使用了嗎？

## 常見問答 (FAQ)

### Q1：AI 幫我做網站，就代表這是 MCP 網站嗎？

不代表。AI 幫你建立網站屬於 AI-assisted Website Development；只有當網站提供可供 AI Agent 理解、查詢與操作的標準化介面時，才更接近 MCP-enabled Website。

### Q2：MCP 和一般 API 有什麼差別？

API 主要提供程式呼叫的介面；MCP 則進一步描述系統有哪些能力、工具何時適用、需要哪些參數，以及操作結果如何回傳，讓 AI Agent 更容易選擇並使用。

### Q3：為什麼網站需要 Service Layer？

Service Layer 能把核心商業邏輯從前端按鈕與 UI Event Handler 抽離，讓同一套能力可以被 Frontend、Admin、REST API 與 MCP 共用，降低未來擴充 Agent 操作的成本。

### Q4：Agent-native Website 可以讓 AI 自由修改所有資料嗎？

不建議。網站應至少區分 Read、Draft、Write 與 Critical 權限；查詢與建立草稿可以較高程度自動化，修改、發布、退款、刪除資料或變更權限等高風險操作則應保留人工核准與 Audit Log。

### Q5：網站要如何開始準備 Agent-native 架構？

可以先盤點使用者最常想完成的任務，再把商品、服務與限制條件整理成一致且可理解的資料，接著抽離可重複呼叫的 Service Layer，設計 API、工具描述、權限、確認與錯誤回應，最後用完整任務測試 Agent 是否真的能完成流程。
