---
title: n8n 串接 Gemini API：從基礎節點到 AI Agent 結構化輸出 | (EP.6) n8n 自動化 API 串接教學
cover: /images/cover108.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - API串接
  - Gemini
description: 想在 n8n 中使用強大且高 CP 值的 AI 模型？本文詳細教學如何申請 Google Gemini API 密鑰，並透過基礎節點與 AI Agent 兩種方式完美實現 JSON 結構化輸出，打造高效自動化工作流！
date: 2026-03-30 00:00:31
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/ijIUavo318k?si=VTu1HJKBod5itge1" 
    title="n8n 串接 Gemini API 完整教學：從基礎節點到 AI Agent 結構化輸出" 
    allow="fullscreen">
  </iframe>
</div>

在 n8n 的自動化工作流中，許多人習慣使用 ChatGPT 的 AI 模型。然而，隨著 Google Gemini 系列模型的強勢崛起（尤其是具備免費額度的優勢），越來越多開發者與行銷人開始轉向使用 Gemini 來節省成本並維持高效的運算能力。

本文將帶您手把手實戰，從申請 Gemini API 密鑰開始，完整解析在 n8n 中串接 Gemini 的兩種核心做法：**基礎節點搭配 JavaScript 解析**，以及**免寫程式的 AI Agent 結構化輸出**。

## 如何快速取得 Google Gemini API 密鑰？

要讓 n8n 成功呼叫 Gemini，我們首先需要前往開發者後台申請 API Key。

1. **進入開發者平台**：前往 [Google AI Studio](https://aistudio.google.com/)。
2. **尋找申請入口**：在左側選單點擊 `Get API key`。
3. **建立密鑰**：點選 `Create API key`，系統會要求您選擇或建立一個 Google Cloud 專案（Project）。如果您之前尚未建立過，可以點擊 `Create project` 來創建一個新專案。
4. **選擇計費方案**：
   * 若您有綁定信用卡並啟用了付費帳單，系統可能會預設給予 `Tier 1 (Postpay)` 權限，這在需要呼叫「生成圖片」等進階模型時非常有用。
   * 若您想**完全免費使用**，請確保專案的計費狀態設定為 `Free tier`，這對於一般的文本處理與自動化任務已經非常夠用。
5. **複製密鑰**：成功生成後，將這串 API Key 複製下來，準備貼到 n8n 的憑證（Credentials）設定中。

---

## 實戰方法一：透過「Message a Model」節點與 JS 解析 JSON

在 n8n 中，最直覺的呼叫方式是使用原生的 `Google Gemini` 節點（Message a Model 操作）。但在實際應用場景中，我們通常會要求 AI 輸出特定的 JSON 格式（例如：分類、摘要、關鍵字），以便後續串接 LINE Bot 或寫入資料庫。

### 步驟與痛點解析
1. **建立 Credentials**：在 `Message a Model` 節點中，新增 Google Gemini(PaLM) API account，將剛剛複製的 API Key 貼入並儲存。
2. **設定 Prompt 與 System Message**：在 Node 設定中，您可以要求它輸出 JSON，並開啟 `Output Content as JSON` 選項。
3. **痛點（為何需要 Code 節點）**：即使勾選了輸出 JSON，Gemini 原生節點回傳的資料結構往往被包裝在一大包 JSON 陣列內（無法像 ChatGPT 節點那樣直接完美對應輸出規格）。
4. **JavaScript 解析解法**：為了解決這個問題，我們必須在後面加上一個 `Code` 節點，透過 JavaScript 將純文字轉換並萃取出我們需要的欄位。

**Code 節點解析範例：**
```javascript
const raw = $json.content?.parts?.[0]?.text ?? '';

let parsed;

try {
  parsed = JSON.parse(raw);
} catch (error) {
  parsed = {
    summary: '',
    category: '其他',
    keywords:[],
    language: 'zh-TW'
  };
}

return [{ json: parsed }];
```
透過上述程式碼，我們才能確保後續的 HTTP Request 節點（例如推播 LINE 訊息）能正確讀取到 `summary`、`category` 與 `keywords` 等變數。這對於不熟悉程式碼的用戶來說，門檻相對較高。

---

## 實戰方法二：使用 AI Agent 輕鬆達成結構化輸出（專家推薦）

為了避開繁瑣的程式碼解析，**強烈建議使用 n8n 的 AI Agent 架構**。透過「Agent + Model + Output Parser」的黃金三角，您可以讓系統自動將 Gemini 的輸出鎖定在嚴格的 JSON 規格內。

### 完美輸出的配置步驟：

1. **加入 AI Agent 節點**：在畫布中新增 `AI Agent`，並將輸入源連接至前置節點。
2. **連接語言模型 (Language Model)**：在 Agent 的 Model 輸入端，掛載 `Google Gemini Chat Model` 節點，並選定模型（如 `gemini-2.5-flash`）。
3. **強制結構化輸出 (Output Parser)**：
   * 開啟 Agent 節點內的 `Require Specific Output Format`。
   * 在 Parser 輸入端掛載 `Structured Output Parser` 節點。
   * 在 Parser 內直接定義您期待的 JSON Schema（如下方範例）。

**JSON Schema 定義範例：**
```json
{
  "type": "object",
  "properties": {
    "summary": { "type": "string" },
    "category": {
      "type": "string",
      "enum":["AI工具", "程式開發", "商業", "教育", "其他"]
    },
    "keywords": {
      "type": "array",
      "items": { "type": "string" }
    },
    "language": { "type": "string" }
  },
  "required":["summary", "category", "keywords", "language"],
  "additionalProperties": false
}
```

使用 AI Agent 搭配 Structured Output Parser 的最大優勢在於：**完全免寫任何一行解析用的 JavaScript 程式碼**！系統會嚴格逼迫 Gemini 依照您提供的 Schema 回傳乾淨、格式化好的 JSON，極大地提升了工作流的穩定性與開發效率。

### 附錄：完整 n8n 工作流 JSON
您可以直接複製以下 JSON 匯入您的 n8n 畫布中進行測試：

<textarea readonly spellcheck="false" style="width: 100%; min-height: 38rem; font-family: monospace; font-size: 0.95rem; line-height: 1.6; padding: 1rem; border: 1px solid #d9dee8; border-radius: 0.75rem; background: #fbfcfe;">{
  "nodes":[
    {
      "parameters": {
        "promptType": "define",
        "text": "=請讀取以下內容，輸出摘要、主題分類、3 個關鍵字。\n\n內容：\n&#123;&#123;$json.input_text&#125;&#125;",
        "hasOutputParser": true,
        "options": {
          "systemMessage": "你是資料整理助手。\n\n規則：\n1. 使用繁體中文。\n2. 不要捏造未提供的資訊。\n3. 請只輸出 JSON。\n4. 欄位必須包含 summary、category、language。\n5. 若資訊不足，也必須輸出合法 JSON。"
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 3.1,
      "position":[352, -352],
      "name": "AI Agent"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position":[288, -144],
      "name": "Google Gemini Chat Model"
    },
    {
      "parameters": {
        "schemaType": "manual",
        "inputSchema": "{\n  \"type\": \"object\",\n  \"properties\": {\n    \"summary\": { \"type\": \"string\" },\n    \"category\": {\n      \"type\": \"string\",\n      \"enum\":[\"AI工具\", \"程式開發\", \"商業\", \"教育\", \"其他\"]\n    },\n    \"keywords\": {\n      \"type\": \"array\",\n      \"items\": { \"type\": \"string\" }\n    },\n    \"language\": { \"type\": \"string\" }\n  },\n  \"required\":[\"summary\", \"category\", \"keywords\", \"language\"],\n  \"additionalProperties\": false\n}"
      },
      "type": "@n8n/n8n-nodes-langchain.outputParserStructured",
      "typeVersion": 1.3,
      "position":[544, -128],
      "name": "Structured Output Parser"
    }
  ],
  "connections": {
    "Google Gemini Chat Model": {
      "ai_languageModel": [[{"node": "AI Agent","type": "ai_languageModel","index": 0}]]
    },
    "Structured Output Parser": {
      "ai_outputParser": [[{"node": "AI Agent","type": "ai_outputParser","index": 0}]]
    }
  }
}</textarea>

---

## 常見問答 (FAQ)

### Q：為何在 n8n 中選擇使用 Gemini 而不用 ChatGPT？
A：主要優勢在於**成本與免費額度**。Google AI Studio 提供了非常慷慨的 `Free tier`（免費層），對於剛開始建置自動化工作流、或需求量在中小型範圍的用戶來說，可以大幅降低 API 的呼叫成本，同時 Gemini 2.5 Flash 處理速度極快，非常適合自動化場景。

### Q：為什麼使用基礎的「Message a Model」節點還需要額外寫程式碼？
A：因為基礎的 LLM 節點雖然能設定輸出 JSON，但往往會包裝在複雜的結構層級中，無法直接無縫對接下一個節點的變數欄位。透過加入 JavaScript `Code` 節點進行 `JSON.parse()` 解析，才能精準拆解出所需的鍵值（Keys），讓後續推播或寫入資料庫的動作不出錯。

### Q：如果不擅長寫程式，有什麼替代方案嗎？
A：強烈建議採用本文示範的 **AI Agent + Structured Output Parser** 方法。這種架構屬於「宣告式」操作，您只需要在介面上填寫 JSON 格式規範（Schema），n8n 與 AI 就會自動溝通並轉換出完美對應的資料格式，徹底免除撰寫解析程式碼的困擾。

### Q：Google Gemini 的免費額度真的夠做 n8n 自動化嗎？
A：對大多數入門情境來說，通常夠用。若您的工作流主要是做摘要、分類、標籤整理、客服訊息初步回覆，`Free tier` 往往已足以支撐測試與小量正式使用。不過如果您開始大量處理長文本、頻繁排程，或同時有多個工作流共用同一組 API Key，就需要留意速率限制與用量上限。最穩健的做法是先用免費層把流程跑通，再依實際流量決定是否升級付費方案。

### Q：什麼情況下該用「Message a Model」，什麼情況下該直接改用 AI Agent？
A：如果您的任務只是單純的一進一出，例如摘要、翻譯、分類、改寫，且後面只要接一個 `Code` 節點就能順利整理資料，那麼 `Message a Model` 通常更簡單、成本也更低。但如果您已經明確知道後面要依賴固定欄位，例如 `summary`、`category`、`keywords` 去串接 LINE、Email、Sheets 或資料庫，那麼直接使用 **AI Agent + Structured Output Parser** 會更穩定，後續維護也更省力。

### Q：為什麼我明明要求 Gemini 輸出 JSON，結果還是會多出說明文字或格式錯誤？
A：因為單靠 Prompt 約束，模型仍可能在某些情況下額外補充說明，尤其當輸入內容較長、規則較複雜，或模型判斷需要「解釋」時更容易發生。這也是本文會把兩種方法拆開講的原因：如果您走基礎節點路線，就要準備用 `Code` 節點做容錯解析；如果您要的是更高穩定性，就應直接改走 `Structured Output Parser`，把格式控制交給系統，而不是只靠文字要求。

### Q：匯入本文附錄的工作流 JSON 後，還需要手動修改哪些地方？
A：需要，因為附錄的 JSON 是示範骨架，不是可直接上線的最終版本。至少要檢查三個地方：第一，`Google Gemini Chat Model` 是否已綁定您的 Gemini API Credential；第二，前置節點是否真的有提供 `input_text` 這個欄位；第三，後續節點若要讀取 Agent 的結果，是否使用正確路徑，例如 `output.summary`、`output.category`、`output.keywords`。如果其中任何一個欄位名稱對不上，流程就很容易出現空值或報錯。

### Q：如果我的 JSON Schema 定義得太嚴格，會不會反而讓模型常常失敗？
A：會有這種可能，尤其當您同時要求太多欄位、限制太多列舉值，或輸入內容本身資訊不足時。實務上建議 Schema 先維持「夠用就好」：只保留後續流程真正會用到的欄位，避免一開始就設計過多可有可無的結構。對自動化工作流來說，穩定輸出 4 個必要欄位，通常比一次追求 10 個欄位更有價值。

### Q：如果後面我要把 Gemini 的結果寫進 Google Sheets、Notion 或資料庫，最重要的注意事項是什麼？
A：最重要的是欄位名稱與值域要先標準化。不要讓模型今天輸出 `AI工具`、明天輸出 `AI 工具`、後天又輸出 `AI Tool`。一旦分類名稱不一致，後面做搜尋、篩選、儀表板統計都會變得很麻煩。因此像本文示範的 `enum` 設計就非常重要，它不是為了形式好看，而是為了確保資料落地後仍然可被穩定使用。
