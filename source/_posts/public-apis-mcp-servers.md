---
title: 'Public APIs 開始收錄 MCP Server：48 萬 Star 的工具清單怎麼用？'
cover: /images/cover197.png
toc: true
categories:
  - AI工具
tags:
  - AI工具
  - AI Agent
  - MCP
date: 2026-10-01 23:28:40
subtitle: 先從需求找能力，再決定使用 MCP、API，或 Skill。
description: 'Public APIs 除了整理免費 API，也新增 MCP Server 清單。本文整理 MCP Registry、Glama、Smithery 的搜尋方式，並用 MCP Scout 流程評估工具、安全權限與 API、MCP、Skill 的選擇。'
---

最近整理 Skill Library 時，我發現自己收藏了不少 MCP，真正要做事時卻還是得重新搜尋：「有沒有 Gmail MCP？」「哪個 MCP 能查 YouTube？」接著逐一看 README、確認維護狀況、安裝方式和需要的權限。

這讓我重新注意到 GitHub 上的 [`public-apis/public-apis`](https://github.com/public-apis/public-apis) 專案。它原本以公開 API 分類清單聞名，現在也加上 **MCP Servers** 區塊。我查閱時，GitHub 顯示約 48.5 萬顆 Star；電腦王阿達在 2026 年 9 月 5 日的介紹則記錄當時已超過 47 萬顆。Star 數會變動，這裡的數字只是查閱時的快照。

比起多收藏一個目錄，我更想建立一個流程：先說清楚工作需要什麼能力，再讓 Agent 找候選工具、比較限制，最後才決定要不要安裝 MCP。

## Public APIs 的 MCP 清單有什麼不同？

Public APIs 原本把公開 API 依用途分類，例如 Weather、Finance、Email、Geocoding、Government、Video 等。清單除了名稱與說明，也會列出驗證方式、HTTPS 和 CORS 等資訊，方便開發者先篩選資料來源。

README 現在另有 **MCP Servers** 表格，欄位包含名稱、用途、驗證方式、Transport 和安裝入口。查閱時可看到 OpenSwissData、IPstack MCP、GitHub、Filesystem 等項目。這些資料讓讀者先比較需要什麼驗證、支援哪種傳輸方式，再前往專案或安裝目錄查看細節。

它的特色不是 MCP 數量最多，而是從「我需要天氣、金融或檔案能力」這類需求出發，再找可能的 API 或 MCP。要做天氣網站，直接呼叫 API 也許就夠；若 Agent 要在多次任務中反覆查詢或執行操作，MCP 才可能比較合適。

另外，清單名稱裡的「免費 API」不代表每個服務都能無限制免費使用。實際費率、免費額度、API Key 和使用條款都要再到服務官方文件確認。

## API、MCP 和 Skill 各自負責什麼？

這三者不是互相取代的工具，而是處理不同層次的問題：

| 元件 | 負責的事情 | 常見用法 |
| --- | --- | --- |
| API | 服務提供的資料或操作介面 | 網站或程式依服務文件發送請求、處理回應 |
| MCP Server | 依 MCP 協定，把工具或其他上下文能力提供給相容的 Agent | 讓 Agent 透過標準介面呼叫搜尋、檔案或服務工具 |
| Skill | 說明 Agent 怎麼完成一類工作 | 把需求拆解、檢查步驟和交付格式整理成可重複使用的 SOP |

MCP Server 有時會在背後呼叫 API，但 MCP 並不是 API 的另一個名稱；有些 API 也沒有對應 MCP。Skill 則可以教 Agent 如何呼叫已設定的 MCP，也可以規定何時直接用 API。

若你還想釐清 MCP、Skill 與 CLI 的分工，可以接著看[一次搞懂 MCP、Skill 與 CLI 的差異](/posts/ai-agent-tools-mcp-skill-cli/)。Skill 與 Plugin 的組合方式則整理在[從個人工作流到團隊交付](/posts/codex-skills-vs-plugins/)。

## 找 MCP 時可以先看哪幾個地方？

我會依照需求和想確認的資訊，從以下入口開始找。它們的定位不同，搜尋結果也不等於品質或安全保證。

### 1. Official MCP Registry：查官方登錄資料

[Official MCP Registry](https://registry.modelcontextprotocol.io/) 是 MCP 專案提供的公開 Server 目錄，可以搜尋 Server 名稱與版本，並查看其 metadata。它適合用來確認某個項目是否有公開登錄，以及對應的專案或套件資訊。

不過，「出現在 Registry」不等於「經過完整安全審核」。Registry 的資料由 Server 維護者發布，使用者仍要核對來源、版本和權限；官方說明也提到社群可檢舉違規項目，由維護者處理。

### 2. Public APIs：從需要的能力開始找

如果你還不確定該找 API 還是 MCP，可以先按資料類型或用途查 Public APIs。MCP 區塊的清單目前較精簡，優點是會把 MCP 放在原有 API 資源旁邊，讓你比較是直接呼叫 API，還是透過 Agent 使用 MCP。

### 3. Glama：用搜尋與篩選比較大量候選

[Glama MCP Servers](https://glama.ai/mcp/servers) 提供伺服器索引與搜尋，頁面可按更新日期、GitHub Star、套件下載量等條件排序。網站在 **2026 年 10 月 1 日**查閱時顯示約 94,668 個 Server。索引數量會改變，應以網站當下顯示為準，也別只看總數或 Star 就決定安裝。

### 4. Smithery：搜尋並查看伺服器管理入口

[Smithery](https://smithery.ai/servers) 提供類別與條件篩選，並展示部分 Server 的使用資訊。頁面在 **2026 年 10 月 1 日**查閱時顯示 13,151 個搜尋結果。平台和目錄功能可能持續調整，因此安裝方式、方案和服務狀態要回到當下的官方說明確認。

### 5. GitHub 與服務官方文件：確認實作細節

找到候選項目後，接著查它連結的原始 Repository 和服務官方文件。目錄摘要可以幫你發現項目，卻無法代替版本紀錄、License、安裝需求、OAuth 範圍、API 費用及原始碼審查。

## 用 MCP Scout 把搜尋變成工作流程

與其在看到「必裝 MCP 清單」時一律先收藏，我會希望 Agent 在開始實作前先做需求分析：完成任務需要哪些資料、外部服務和操作權限？是否已經有可用的 MCP？直接呼叫 API 或使用 CLI 會不會更簡單？

這個想法可以整理成一個 **MCP Scout** Skill。它不負責直接替你安裝工具，而是先找候選、標示來源與限制，再提出方案供你決定：

```text
你是我的 MCP Scout。

我要完成以下工作：
{{工作需求}}

先分析需求並搜尋工具，不要直接開始實作、安裝或執行候選項目。

第一階段：拆解需求
列出完成工作需要的資料、操作與外部服務，例如搜尋、檔案、Database、Email、Calendar、Browser 或 SaaS。

第二階段：搜尋候選
依序查看 Official MCP Registry、public-apis/public-apis、Glama、Smithery、GitHub 與服務官方文件。最多列出 3 個候選，附上來源連結；清楚標示官方或社群專案，找不到證據時不要猜。

第三階段：比較限制
逐一整理提供的 Tools、Repository、License、最近更新、Transport、Agent 相容性、API Key 或 OAuth、費用、權限範圍，以及是否會讀寫本機檔案或執行 Shell。每個判斷都附上可查證的來源。

第四階段：提出選擇
比較使用現有 MCP、直接使用 API／SDK／CLI，或自行建立 MCP 的建置時間、維護成本、安全性、穩定性與可移植性，說明適合的方案與原因。

先交付搜尋結果與建議，等待我確認後才進行安裝或授權設定。
```

這段流程的重點是先把需求和風險攤開來，不要讓搜尋結果直接變成安裝指令。MCP Scout 可以協助找資料，但不能只憑目錄標籤就替候選項目背書。

## 不需要為每件事都加上 MCP

我會用三個問題快速選擇：

- **只是要取得一份資料或完成一次操作？** 先看 API、SDK 或 CLI 是否更直接。
- **Agent 是否要在不同任務中反覆使用同一項能力？** 再評估 MCP 的介面和維護成本。
- **真正需要保存的是工作步驟嗎？** 把判斷方法整理成 Skill；需要工具時，再讓 Skill 指向 API 或 MCP。

例如天氣網站可以直接呼叫天氣 API；如果多個 Agent 都要在對話中查詢天氣、比較時段並安排活動，MCP 可能更容易重複使用。工具是否值得封裝，仍取決於實際使用頻率、權限需求和維護成本。

最後，我想收藏的不是更多 MCP 名稱，而是一條遇到需求時找工具、核對來源、比較限制的路徑。當 Skill 知道何時呼叫 MCP，Agent 又知道缺工具時該去哪裡找，工具庫才會從收藏清單變成真正能使用的工作流程。

## 常見問答 (FAQ)

### Q1：Public APIs 的 MCP Servers 清單適合拿來做什麼？

它適合從 API 類別或能力需求出發，快速發現少量相關 MCP，並查看簡介、驗證方式、Transport 和安裝入口。找到候選後，仍應到 Repository 和官方文件確認細節。

### Q2：要去哪裡搜尋 MCP Server？

可以先看 Official MCP Registry 的登錄資料，再用 Public APIs 按需求找候選，或用 Glama、Smithery 搜尋和篩選。最後回到 GitHub Repository 及服務官方文件確認版本、授權、費用與權限。

### Q3：怎麼判斷 MCP Server 是否適合安裝？

至少要確認維護者與 Repository、License、最近更新、安裝程序、Transport、憑證和費用，以及它要求的檔案、網路或 Shell 權限。目錄列出項目不等於安全認證；對高權限工具，應先檢查程式碼並在受限環境評估。

### Q4：MCP、API 和 Skill 要怎麼選？

一次性或單純的資料請求可先用 API、SDK 或 CLI；需要讓 Agent 以一致介面反覆呼叫的能力，可評估 MCP；需要重複遵循的工作方法則適合整理成 Skill。三者也能搭配使用。

### Q5：MCP Scout 可以自動安裝它找到的 MCP 嗎？

MCP Scout 可以整理需求、搜尋候選和比較限制，但搜尋結果不能代替程式碼審查或權限判斷。建議先讓它提交來源和評估結果，經人確認後再安裝、提供憑證或授予本機權限。

---

## 參考資料

- 電腦王阿達｜[Public APIs 免費 API 資源庫介紹](https://www.kocpc.com.tw/archives/667830?utm_source=chatgpt.com)
- GitHub｜[public-apis/public-apis](https://github.com/public-apis/public-apis?utm_source=chatgpt.com)
- MCP 官方專案｜[Introducing the MCP Registry](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/?utm_source=chatgpt.com)
- [Glama MCP Servers](https://glama.ai/mcp/servers?utm_source=chatgpt.com)
- [Smithery](https://smithery.ai/servers?utm_source=chatgpt.com)
