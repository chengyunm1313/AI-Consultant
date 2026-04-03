---
title: 如何用 n8n 打造 AI Agent 專屬記憶庫？Logging 實戰 | (EP.7) n8n 自動化 API 串接教學
cover: /images/cover109.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - AI工具
description: AI Agent 總是像金魚腦一樣忘記上下文？本篇教學深入解析 Logging 的重要性，帶你避開 Tool Calling 災難，並透過 n8n 與 Google Sheets 一步步建立 AI 的長期記憶庫！
date: 2026-03-31 02:04:51
subtitle:
---

<div class="iframe-wrapper">
  <iframe
    src="https://www.youtube.com/embed/D9QmnKniKm0?si=RW43TrNlrs90tpor"
    title="新手必看！如何用 n8n 打造 AI Agent 專屬記憶庫？Logging 實戰完整教學"
    allow="fullscreen">
  </iframe>
</div>

## 為什麼 AI 需要 Logging？告別「金魚腦」的專屬黑盒子

當我們將 LINE 等通訊軟體與 AI 結合時，常常會遇到一個災難現場：**AI 沒有記憶**。它無法記住上一秒的對話，導致每次回覆都像初次見面，甚至引發錯誤（Error）。

Logging 的本質，就是系統的專屬「黑盒子」。一句話講完：**Logging 就是為了讓你在事後「看得懂發生過什麼事」。**

在 n8n 或任何自動化流程中，Log 不僅僅是無聊的資料，它是拯救開發者的五大超能力：
1. **除錯 (Debug)：** 沒紀錄只能瞎猜，有紀錄就能精準抓蟲。
2. **重現 (Reproduce)：** 還原當下觸發錯誤的 Prompt。
3. **監控 (Monitor)：** 追蹤系統的成功率與 API 呼叫狀況。
4. **優化 (Optimize)：** 作為未來訓練 AI 的精華資料。
5. **稽核 (Audit)：** 有紀錄才有證據，知道哪個環節出錯。

---

## 記憶的進化：從「給人看」到「給 AI 看」

Logging 的應用可以分為兩個階段：

*   **階段一：只做 Logging（給人看）**
    為了事後查看、稽核執行結果。我們開始把資料寫入 Google Sheets，方便我們進行 Debug 與狀態確認。
*   **階段二：Logging + 給 AI 查（AI 也要看）**
    當 AI 需要記得前文、參考歷史紀錄，或是做進階的資料檢索（RAG）時，Log 就直接升級成了 AI 的 Context（上下文）。這能讓 AI 瞬間恢復記憶，甚至做到個人化預測與專屬知識庫的搭建。

---

## 踩雷警告！為什麼讓 AI 自動撈資料（Tool Calling）是一場災難？

很多新手會有一個致命誘惑：「既然 AI 這麼聰明，不要在 Workflow 查了，直接寫個 Tool 讓 AI 自己去 Google Sheet 撈資料（Tool Calling）不是更簡單？」

想法很完美，但對於新手與固定規則的任務來說，這是一個巨大的陷阱！

*   **失控的可控性：** AI 可能亂查太多的資料、查錯條件，甚至決定「不查了」，看它心情做事。
*   **成本超級高：** 先讓 LLM 判斷 → 呼叫工具 → 再回傳 LLM，速度極慢且狂燒 Token。
*   **除錯大地獄：** 出錯時你根本不知道是 Prompt 寫壞、工具沒寫好，還是 AI 邏輯當機。

### 架構大 PK：Workflow 先查 vs. AI Agent 自己撈

| 比較項目 | Workflow 先查 (Pre-fetch / 固定 Context) | AI Agent 自己撈 (Tool Calling / 動態查詢) |
| :--- | :--- | :--- |
| **適用情境** | 固定規則（例：每次都查最新 3 筆對話） | 動態條件（例：查閱特定主題的歷史紀錄） |
| **穩定度** | **極高 (100% 執行)** | 較低（看 AI 心情決定是否呼叫） |
| **除錯難度** | **簡單清晰** | 複雜地獄 |
| **花費成本** | **低** | 高 |

> **專家建議：** 在進入 AI 節點前，先由 Workflow 流程預先整理好必要資訊（固定 Context），確保 AI 每次都有穩定、可控的上下文。只有在遇到「不確定需求」或「延伸問題」時，才交由 Agent 進行動態查詢。

---

## 完整 Workflow 架構解析

本次實作的完整流程共分為 **三大區段**，以下逐一拆解。

### 區段一：接收與解析 LINE 訊息

```
Webhook1 → Edit Fields1
```

**Webhook1** 接收 LINE Messaging API 傳入的 POST 請求（路徑：`line-0324`）。

**Edit Fields1** 負責從 LINE 事件結構中提取三個關鍵欄位：

| 欄位 | 來源路徑 | 說明 |
| :--- | :--- | :--- |
| `input_text` | `body.events[0].message.text` | 使用者輸入的訊息 |
| `userId` | `body.events[0].source.userId` | 識別使用者身份 |
| `replyToken` | `body.events[0].replyToken` | LINE 回覆用的一次性 Token |

---

### 區段二：建立固定 Context（Pre-fetch 記憶）

```
Get User History → Build History Context → Debug History Preview
```

這是整個架構的靈魂——**在 AI 介入前，由 Workflow 自行整理好歷史記憶**。

**Get User History**：從 Google Sheets 的 `logging` 工作表中讀取所有紀錄。

**Build History Context**：透過 Code 節點對資料進行篩選與格式化：

<textarea readonly spellcheck="false" style="width: 100%; min-height: 22rem; font-family: monospace; font-size: 0.95rem; line-height: 1.6; padding: 1rem; border: 1px solid #d9dee8; border-radius: 0.75rem; background: #fbfcfe;">const current = $('Edit Fields1').first().json;
const currentUserId = current.userId || '';

const rows = $input.all().map(item => item.json);

// 只取同一位使用者、狀態為 success 的最近 3 筆紀錄
const filtered = rows
  .filter(row => row.userId === currentUserId && row.status === 'success')
  .sort((a, b) => {
    const ta = new Date(a.timestamp || 0).getTime();
    const tb = new Date(b.timestamp || 0).getTime();
    return tb - ta;
  })
  .slice(0, 3);

const historyContext = filtered.length
  ? filtered.map((row, idx) => {
      return `${idx + 1}.\n時間：${row.timestamp || ''}\n輸入：${row.input_text || ''}\n摘要：${row.summary || ''}\n分類：${row.category || ''}\n關鍵字：${row.keywords || ''}`;
    }).join('\n\n')
  : '無歷史紀錄';

return [
  {
    json: {
      ...current,
      history_context: historyContext,
      history_count: filtered.length
    }
  }
];</textarea>

> **核心邏輯：** 過濾條件為「userId 相同」且 `status === 'success'`，排除失敗紀錄後，取最新 3 筆，確保注入 AI 的都是可靠的高品質記憶。

**Debug History Preview**：在此節點新增 `debug_` 前綴欄位（`debug_userId`、`debug_history_count`、`debug_history_context` 等），讓你在 n8n 執行面板中可以直接確認「AI 即將收到的歷史資料長什麼樣子」，是開發初期排查問題的透明窗口。

---

### 區段三：AI 分析、回覆 LINE 與寫入 Log

```
AI Agent1 → HTTP Request1 → Prepare Log1 → Google Sheets Log1
```

**AI Agent1**（搭配 Google Gemini）接收完整的 Context 後進行分析。

Prompt 設計如下：

<textarea readonly spellcheck="false" style="width: 100%; min-height: 10rem; font-family: monospace; font-size: 0.95rem; line-height: 1.6; padding: 1rem; border: 1px solid #d9dee8; border-radius: 0.75rem; background: #fbfcfe;">請讀取以下內容，輸出摘要、主題分類、3 個關鍵字。

本次使用者輸入：&#123;&#123;$json.input_text&#125;&#125;

以下是此使用者最近的互動紀錄，僅供理解上下文與延續語意。
若與本次輸入無關，請以本次輸入為主：
&#123;&#123;$json.history_context&#125;&#125;</textarea>

System Message 明確規範 AI 行為，防止幻覺與格式失控：

<textarea readonly spellcheck="false" style="width: 100%; min-height: 14rem; font-family: monospace; font-size: 0.95rem; line-height: 1.6; padding: 1rem; border: 1px solid #d9dee8; border-radius: 0.75rem; background: #fbfcfe;">你是資料整理助手。

規則：
1. 使用繁體中文。
2. 不要捏造未提供的資訊。
3. 請只輸出 JSON。
4. 欄位必須包含 summary、category、language、keywords。
5. 若有歷史互動紀錄，僅可用來補足上下文，不可把過去內容誤當成這次輸入內容。
6. 若本次輸入與歷史紀錄無明顯關聯，請忽略歷史紀錄。
7. 若資訊不足，也必須輸出合法 JSON。</textarea>

**Structured Output Parser** 確保 AI 輸出符合以下 JSON Schema，強制欄位驗證，防止格式亂跑：

<textarea readonly spellcheck="false" style="width: 100%; min-height: 16rem; font-family: monospace; font-size: 0.95rem; line-height: 1.6; padding: 1rem; border: 1px solid #d9dee8; border-radius: 0.75rem; background: #fbfcfe;">{
  "type": "object",
  "properties": {
    "summary":  { "type": "string" },
    "category": {
      "type": "string",
      "enum": ["AI工具", "程式開發", "商業", "教育", "其他"]
    },
    "keywords": { "type": "array", "items": { "type": "string" } },
    "language": { "type": "string" }
  },
  "required": ["summary", "category", "keywords", "language"],
  "additionalProperties": false
}</textarea>

**HTTP Request1** 呼叫 LINE Reply API，將 AI 分析結果回傳給使用者。

**Prepare Log1 + Google Sheets Log1** 將本次執行的完整資料寫回 Google Sheets，包含以下欄位：

| 欄位 | 說明 |
| :--- | :--- |
| `timestamp` | 執行時間（`$now`） |
| `workflow` | Workflow 名稱 |
| `status` | 執行狀態（`success`） |
| `executionId` | n8n 執行 ID |
| `userId` / `replyToken` | 使用者識別資訊 |
| `input_text` | 本次輸入 |
| `summary` / `category` / `language` / `keywords` | AI 分析結果 |
| `history_count` | 本次帶入的歷史筆數 |
| `history_context` | 實際注入 AI 的歷史文字 |

> **設計亮點：** 記錄 `history_count` 與 `history_context` 讓你未來可以回溯「AI 當時看到的是什麼」，是除錯 Hallucination 的關鍵利器。

---

## 🎁 附錄：完整 n8n Workflow JSON 腳本

你可以直接複製以下 JSON 程式碼，並匯入至你的 n8n 專案中進行測試。匯入後請記得將 Google Sheets 文件 ID 替換為你自己的試算表 ID，並重新設定 Google Sheets 與 LINE Bearer Token 的憑證（Credentials）。

<textarea readonly spellcheck="false" style="width: 100%; min-height: 38rem; font-family: monospace; font-size: 0.95rem; line-height: 1.6; padding: 1rem; border: 1px solid #d9dee8; border-radius: 0.75rem; background: #fbfcfe;">{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "line-0324",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [-1392, -288],
      "id": "07a2efae-2d4c-4b63-ab6d-38366b22f782",
      "name": "Webhook1",
      "webhookId": "a6ff766a-b5f5-4d36-9066-963fc0e4407f"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "820ce329-eb3e-46b7-8264-c13e6bab20e1",
              "name": "input_text",
              "value": "=&#123;&#123; $json.body.events[0].message.text &#125;&#125;",
              "type": "string"
            },
            {
              "id": "b9d8194d-1c76-4ad3-a2ab-95fc0db6a001",
              "name": "userId",
              "value": "=&#123;&#123; $json.body.events[0].source.userId || '' &#125;&#125;",
              "type": "string"
            },
            {
              "id": "6fbbf8c4-4044-41a6-9721-4f11ec8b0001",
              "name": "replyToken",
              "value": "=&#123;&#123; $json.body.events[0].replyToken || '' &#125;&#125;",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [-1152, -288],
      "id": "d03c1de9-2b49-4ed0-98a3-d79d0cf0bb96",
      "name": "Edit Fields1"
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "YOUR_GOOGLE_SHEET_ID",
          "mode": "list",
          "cachedResultName": "google sheet logging"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "logging"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [-912, -288],
      "id": "0ff96efd-5db8-45c3-a43e-0b1db98e31b3",
      "name": "Get User History"
    },
    {
      "parameters": {
        "jsCode": "const current = $('Edit Fields1').first().json;\nconst currentUserId = current.userId || '';\n\nconst rows = $input.all().map(item => item.json);\n\nconst filtered = rows\n  .filter(row => row.userId === currentUserId && row.status === 'success')\n  .sort((a, b) => {\n    const ta = new Date(a.timestamp || 0).getTime();\n    const tb = new Date(b.timestamp || 0).getTime();\n    return tb - ta;\n  })\n  .slice(0, 3);\n\nconst historyContext = filtered.length\n  ? filtered.map((row, idx) => {\n      return `${idx + 1}.\\n時間：${row.timestamp || ''}\\n輸入：${row.input_text || ''}\\n摘要：${row.summary || ''}\\n分類：${row.category || ''}\\n關鍵字：${row.keywords || ''}`;\n    }).join('\\n\\n')\n  : '無歷史紀錄';\n\nreturn [\n  {\n    json: {\n      ...current,\n      history_context: historyContext,\n      history_count: filtered.length\n    }\n  }\n];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [-672, -288],
      "id": "fe67f1ce-515a-471c-8fda-cdabfe30b00b",
      "name": "Build History Context"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            { "name": "debug_userId", "value": "=&#123;&#123; $json.userId &#125;&#125;", "type": "string" },
            { "name": "debug_input_text", "value": "=&#123;&#123; $json.input_text &#125;&#125;", "type": "string" },
            { "name": "debug_history_count", "value": "=&#123;&#123; $json.history_count &#125;&#125;", "type": "string" },
            { "name": "debug_history_context", "value": "=&#123;&#123; $json.history_context &#125;&#125;", "type": "string" }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [-432, -288],
      "id": "61c5f27f-f9e9-4eb1-93eb-3f18ea2b586f",
      "name": "Debug History Preview"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=請讀取以下內容，輸出摘要、主題分類、3 個關鍵字。\n\n本次使用者輸入：&#123;&#123;$json.input_text&#125;&#125;\n\n以下是此使用者最近的互動紀錄，僅供理解上下文與延續語意。若與本次輸入無關，請以本次輸入為主：\n&#123;&#123;$json.history_context&#125;&#125;",
        "hasOutputParser": true,
        "options": {
          "systemMessage": "=你是資料整理助手。\n\n規則：\n1. 使用繁體中文。\n2. 不要捏造未提供的資訊。\n3. 請只輸出 JSON。\n4. 欄位必須包含 summary、category、language、keywords。\n5. 若有歷史互動紀錄，僅可用來補足上下文，不可把過去內容誤當成這次輸入內容。\n6. 若本次輸入與歷史紀錄無明顯關聯，請忽略歷史紀錄。\n7. 若資訊不足，也必須輸出合法 JSON。"
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 3.1,
      "position": [-176, -288],
      "id": "e969d51a-4654-4d55-85ae-4c8efe0c3fa0",
      "name": "AI Agent1"
    },
    {
      "parameters": { "options": {} },
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position": [-224, -64],
      "id": "8454dd71-055e-43b5-b445-5289f37fc7f8",
      "name": "Google Gemini Chat Model1"
    },
    {
      "parameters": {
        "schemaType": "manual",
        "inputSchema": "{\n  \"type\": \"object\",\n  \"properties\": {\n    \"summary\": { \"type\": \"string\" },\n    \"category\": {\n      \"type\": \"string\",\n      \"enum\": [\"AI工具\", \"程式開發\", \"商業\", \"教育\", \"其他\"]\n    },\n    \"keywords\": {\n      \"type\": \"array\",\n      \"items\": { \"type\": \"string\" }\n    },\n    \"language\": { \"type\": \"string\" }\n  },\n  \"required\": [\"summary\", \"category\", \"keywords\", \"language\"],\n  \"additionalProperties\": false\n}"
      },
      "type": "@n8n/n8n-nodes-langchain.outputParserStructured",
      "typeVersion": 1.3,
      "position": [16, -64],
      "id": "b9638a0d-bfc5-4af6-8dbc-91f225223b3a",
      "name": "Structured Output Parser1"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.line.me/v2/bot/message/reply",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpBearerAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [{ "name": "Content-Type", "value": "application/json" }]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"replyToken\":\"&#123;&#123; $('Webhook1').item.json.body.events[0].replyToken &#125;&#125;\",\n  \"messages\":[\n    {\n      \"type\": \"text\",\n      \"text\": \"【summary】&#123;&#123; $json.output.summary &#125;&#125; \\n【category】&#123;&#123; $json.output.category &#125;&#125; \\n【language】&#123;&#123; $json.output.language &#125;&#125; \\n【關鍵字】&#123;&#123; $json.output.keywords.join('、') &#125;&#125;\"\n    }\n  ]\n}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [208, -288],
      "id": "371bad55-6ecb-4cc0-8ef2-3a8a0d9ffdc7",
      "name": "HTTP Request1"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            { "name": "timestamp", "value": "=&#123;&#123; $now &#125;&#125;", "type": "string" },
            { "name": "workflow", "value": "=&#123;&#123; $workflow.name &#125;&#125;", "type": "string" },
            { "name": "status", "value": "success", "type": "string" },
            { "name": "executionId", "value": "=&#123;&#123; $execution.id &#125;&#125;", "type": "string" },
            { "name": "userId", "value": "=&#123;&#123; $('Webhook1').item.json.body.events[0].source.userId || '' &#125;&#125;", "type": "string" },
            { "name": "replyToken", "value": "=&#123;&#123; $('Webhook1').item.json.body.events[0].replyToken || '' &#125;&#125;", "type": "string" },
            { "name": "input_text", "value": "=&#123;&#123; $('Edit Fields1').item.json.input_text || '' &#125;&#125;", "type": "string" },
            { "name": "summary", "value": "=&#123;&#123; $('AI Agent1').item.json.output.summary || '' &#125;&#125;", "type": "string" },
            { "name": "category", "value": "=&#123;&#123; $('AI Agent1').item.json.output.category || '' &#125;&#125;", "type": "string" },
            { "name": "language", "value": "=&#123;&#123; $('AI Agent1').item.json.output.language || '' &#125;&#125;", "type": "string" },
            { "name": "keywords", "value": "=&#123;&#123; $('AI Agent1').item.json.output.keywords ? $('AI Agent1').item.json.output.keywords.join('、') : '' &#125;&#125;", "type": "string" },
            { "name": "history_count", "value": "=&#123;&#123; $('Debug History Preview').item.json.history_count || 0 &#125;&#125;", "type": "string" },
            { "name": "history_context", "value": "=&#123;&#123; $('Debug History Preview').item.json.history_context || '' &#125;&#125;", "type": "string" }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [448, -288],
      "id": "920dbd89-1a14-47ce-85f2-cf2bd86b93ba",
      "name": "Prepare Log1"
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "YOUR_GOOGLE_SHEET_ID",
          "mode": "list",
          "cachedResultName": "google sheet logging"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "logging"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "timestamp": "=&#123;&#123; $json.timestamp &#125;&#125;",
            "workflow": "=&#123;&#123; $json.workflow &#125;&#125;",
            "status": "=&#123;&#123; $json.status &#125;&#125;",
            "executionId": "=&#123;&#123; $json.executionId &#125;&#125;",
            "userId": "=&#123;&#123; $json.userId &#125;&#125;",
            "replyToken": "=&#123;&#123; $json.replyToken &#125;&#125;",
            "input_text": "=&#123;&#123; $json.input_text &#125;&#125;",
            "summary": "=&#123;&#123; $json.summary &#125;&#125;",
            "category": "=&#123;&#123; $json.category &#125;&#125;",
            "language": "=&#123;&#123; $json.language &#125;&#125;",
            "keywords": "=&#123;&#123; $json.keywords &#125;&#125;",
            "history_count": "=&#123;&#123; $json.history_count &#125;&#125;",
            "history_context": "=&#123;&#123; $json.history_context &#125;&#125;"
          }
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [704, -288],
      "id": "89ea098f-51c3-4aa2-8632-8c0114eb5b92",
      "name": "Google Sheets Log1"
    }
  ],
  "connections": {
    "Webhook1": { "main": [[{ "node": "Edit Fields1", "type": "main", "index": 0 }]] },
    "Edit Fields1": { "main": [[{ "node": "Get User History", "type": "main", "index": 0 }]] },
    "Get User History": { "main": [[{ "node": "Build History Context", "type": "main", "index": 0 }]] },
    "Build History Context": { "main": [[{ "node": "Debug History Preview", "type": "main", "index": 0 }]] },
    "Debug History Preview": { "main": [[{ "node": "AI Agent1", "type": "main", "index": 0 }]] },
    "AI Agent1": { "main": [[{ "node": "HTTP Request1", "type": "main", "index": 0 }]] },
    "Google Gemini Chat Model1": { "ai_languageModel": [[{ "node": "AI Agent1", "type": "ai_languageModel", "index": 0 }]] },
    "Structured Output Parser1": { "ai_outputParser": [[{ "node": "AI Agent1", "type": "ai_outputParser", "index": 0 }]] },
    "HTTP Request1": { "main": [[{ "node": "Prepare Log1", "type": "main", "index": 0 }]] },
    "Prepare Log1": { "main": [[{ "node": "Google Sheets Log1", "type": "main", "index": 0 }]] }
  }
}</textarea>

---

## 常見問答 (FAQ)

### Q：為什麼不直接使用 OpenAI 或 Gemini 內建的 Memory 功能？
A：雖然部分 LLM 提供內建對話記憶，但對於自動化流程開發者來說，那就像一個無法受控的「黑盒子」。將 Memory 獨立存放在 Google Sheets 或資料庫中，能讓你隨時監控、修改、除錯（Debug），並確保 AI 不會產生難以追蹤的幻覺（Hallucination）。

### Q：Google Sheets 適合拿來當作長期的大型資料庫嗎？
A：對於新手測試、輕量級專案或概念驗證（PoC），Google Sheets 是完美且直觀的工具，因為它「視覺化且易懂」。但當你的系統上線且流量增大時，建議將 Logging 系統轉移至 PostgreSQL、MySQL 或 Supabase 等正規關聯式資料庫，以確保效能與穩定性。

### Q：什麼時候才真正需要用到 Tool Calling（動態查詢）？
A：當用戶的需求不確定或需要跨時間區間搜尋時。例如，當用戶問：「幫我整理『上個月』關於『商業策略』的所有新聞」，這種條件不固定的問題，Workflow 先查（固定 Context）無法預測，此時才適合讓 AI 透過 Tool Calling 自行下達條件去資料庫撈取資料。

### Q：為什麼過濾歷史紀錄時要加上 `status === 'success'` 的條件？
A：這是防止「垃圾記憶污染」的關鍵設計。如果 AI 曾因為網路錯誤、格式異常或 Token 不足而失敗，那筆紀錄的 `input_text` 或 `summary` 可能是空的或不完整的。把這些「失敗記憶」注入 AI，反而會讓 AI 困惑或輸出錯誤的摘要。只保留 `success` 的紀錄才能確保記憶品質。

### Q：`Debug History Preview` 節點有什麼用？正式上線後可以刪掉嗎？
A：`Debug History Preview` 是一個「透明窗口」節點，讓你在 n8n 執行面板中可以直接看到「AI 即將收到的歷史資料長什麼樣子」，在開發初期排查問題時非常有價值。正式上線後可保留（幾乎沒有效能開銷），作為日後維護時的快速診斷工具。若確定不再需要除錯，可刪除以精簡流程。

### Q：Structured Output Parser 是什麼？為什麼要用它？
A：`Structured Output Parser` 的作用是強制 AI 必須按照你定義的 JSON Schema 格式輸出，而不是隨意回傳文字。如果 AI 輸出不符合格式（例如缺少 `summary` 欄位），n8n 會自動觸發重試。這對於後續的 `keywords.join('、')` 等欄位操作至關重要——若格式不穩定，後面的節點就會直接報錯。

### Q：`category` 欄位為什麼要用 `enum` 限制固定選項？
A：這是維持資料一致性的核心手段。如果不加 `enum`，AI 可能今天回傳「AI 工具」、明天回傳「人工智慧工具」、後天回傳「AI Tools」，同一個意思三種寫法，導致你在 Google Sheets 篩選或後續統計時出現資料亂象。使用 `enum: ["AI工具", "程式開發", "商業", "教育", "其他"]` 強制統一格式，是設計健壯資料管線的基本功。

### Q：為什麼要在 Log 中記錄 `history_count` 和 `history_context`？
A：這是為了讓未來的你能「重現 AI 當時的視角」。假設某次 AI 回傳了奇怪的摘要，你打開 Log 可以直接看到：「當時 AI 帶了幾筆記憶（`history_count`）」以及「那些記憶的完整內容是什麼（`history_context`）」。沒有這兩個欄位，你只能看到輸出結果，完全無法判斷問題出在 Prompt、歷史資料，還是 AI 本身。

### Q：Prompt 中說「若與本次輸入無關，請以本次輸入為主」，這樣真的有效嗎？
A：這條規則能降低 AI 誤用歷史資料的機率，但不能完全保證。因此 System Message 中同時加入了「不可把過去內容誤當成這次輸入內容」的明確規則，雙重防護。若主題相近偶爾仍可能混淆，此時可考慮在 Prompt 中加入更明確的分隔標記（如 `---歷史紀錄開始---`）來強化區隔。

### Q：`replyToken` 是什麼？為什麼要記錄在 Log 裡？
A：LINE 的 `replyToken` 是一個**一次性、有時效的 Token**（約 30 秒有效），用來對應「這次訊息的回覆權限」。HTTP Request 節點使用它呼叫 LINE Reply API 回傳訊息給使用者。記錄在 Log 中，是為了當回覆失敗時，你可以確認 Token 是否正確傳遞（雖然過了時效無法重新使用，但至少能確認資料流程正確）。

### Q：如果使用者是第一次傳訊息（沒有任何歷史紀錄），流程會出錯嗎？
A：不會。`Build History Context` 節點在 `filtered.length` 為 0 時，會將 `history_context` 設為 `'無歷史紀錄'` 字串，並將此值傳給 AI Prompt。AI 收到這個明確的提示後，會直接以本次輸入為唯一依據進行分析，完全不受影響。
