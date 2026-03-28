---
title: n8n AI Agent 完整教學：結合 JSON Schema 打造會思考的自動化工作流
cover: /images/cover106.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - ChatGPT
description: 想在 n8n 中導入更聰明的 AI 助理嗎？本篇教學帶你將基礎對話模型升級為強大的 AI Agent，結合 OpenAI 與 JSON Schema 結構化輸出，打造具備邏輯思考與工具調用能力的高階自動化工作流！
date: 2026-03-27 14:53:24
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/bRO2C9p6EiI?si=mlRW9pQopo94hpwW" 
    title="n8n AI Agent 完整教學：結合 JSON Schema 打造會思考的自動化工作流" 
    allow="fullscreen">
  </iframe>
</div>

## 如何將基礎 LLM 升級為強大的 AI Agent？

在先前的 n8n 實作中，我們常用 `Message a model` 來處理 OpenAI API 的回覆。但只要流程開始牽涉到結構化輸出、節點串接穩定性、或後續還要交給其他系統使用，單純文字回覆通常很快就會碰到限制。

這次的做法不是只讓模型「回答問題」，而是讓它在 n8n 裡扮演一個可控的 **AI Agent**。搭配 **Structured Output Parser** 與 **JSON Schema** 之後，模型不只會回覆內容，還能穩定產出指定欄位，讓後面的 HTTP Request 節點可以直接把結果送進 LINE Bot 或其他 API。

如果你正在做的是「收到訊息 -> AI 分析 -> 結構化結果 -> 推播到外部服務」這種流程，那麼 AI Agent 會比一般對話節點更適合。

## 實作步驟：如何快速完成環境與節點部署？

### 1. 建立工作流基本骨架
根據附加的工作流 JSON，這個範例的核心節點順序如下：

`Webhook -> Edit Fields -> AI Agent -> HTTP Request`

另外 AI Agent 下方還會再掛兩個擴充節點：

- `OpenAI Chat Model`
- `Structured Output Parser`

實作時可以照這個順序建立，會比較不容易接錯線。

### 2. 先用 Edit Fields 整理輸入資料
這個範例不是直接把 LINE Webhook 的整包 JSON 丟給 AI，而是先透過 `Edit Fields` 抽出真正要分析的文字：

{% raw %}
```javascript
{{ $json.body.events[0].message.text }}
```
{% endraw %}

並且將它命名為：

```text
input_text
```

這一步很重要，因為它可以讓後續提示詞更乾淨，也能降低你在 AI Agent 中直接處理深層 JSON 路徑的複雜度。

### 3. 配置 AI Agent 的提示詞與系統設定
進入 AI Agent 的設定畫面，我們需要定義它的角色與任務：
1. **設定 System Message**：在 `Options` 中加入 System Message，建立固定規則。
2. **設定 User Message**：在 `Prompt (User Message)` 中用 Expression 模式動態帶入前一節點的資料。
3. 這份工作流實際使用的 User Message 可整理成：

   {% raw %}
   ```text
   請讀取以下內容，輸出摘要、主題分類、3 個關鍵字。

   內容：
   {{$json.input_text}}
   ```
   {% endraw %}

4. System Message 的設計重點則是：

   ```text
   你是資料整理助手。

   規則：
   1. 使用繁體中文。
   2. 不要捏造未提供的資訊。
   3. 請只輸出 JSON。
   4. 欄位必須包含 summary、category、language。
   5. 若資訊不足，也必須輸出合法 JSON。
   ```

5. 如果你只是想讀取前一節點整理好的文字，也可以記住最核心的變數寫法：

   {% raw %}
   ```javascript
   {{ $json.input_text }}
   ```
   {% endraw %}

*實作提醒：一定要切到 `Expression` 模式。若你停留在 `Fixed`，n8n 會把 {% raw %}`{{$json.input_text}}`{% endraw %} 當成純文字，而不是變數。*

### 4. 結合 Structured Output Parser 實現 JSON 格式化
為了讓 AI 的輸出能被後續的 HTTP Request（例如發送到 LINE）完美讀取，我們必須規範它的輸出格式：
1. 點擊 AI Agent 下方的 `Output Parser` 擴充節點，選擇 **Structured Output Parser**。
2. 將 `Schema Type` 設為手動定義 JSON Schema。
3. 使用標準 JSON Schema 來限制欄位格式。根據附加檔案，這次實作的 Schema 如下：
   ```json
   {
     "type": "object",
     "properties": {
       "summary": { "type": "string" },
       "category": {
          "type": "string",
         "enum": ["AI工具", "程式開發", "商業", "教育", "其他"]
       },
       "keywords": {
         "type": "array",
         "items": { "type": "string" }
       },
       "language": { "type": "string" }
     },
     "required": ["summary", "category", "keywords", "language"],
     "additionalProperties": false
   }
   ```

> **Schema 設計重點解析**：
> - **`enum`**：限制 `category` 只能從預定義的分類中選擇，避免 AI 自由發揮產生不一致的分類名稱。
> - **`keywords` 陣列**：讓 AI 自動提取 3 個關鍵字，方便後續做資料標籤或搜尋索引。
> - **`required`**：強制所有欄位都必須存在，防止 AI 漏掉任何一個欄位。
> - **`additionalProperties: false`**：禁止 AI 額外輸出未定義的欄位，確保 JSON 結構乾淨一致。

### 5. 串接 OpenAI Chat Model
AI Agent 就像一個大腦，需要連接特定的語言模型才能運作：
1. 點擊 AI Agent 下方的 `Chat Model` 擴充節點。
2. 搜尋並選擇 **OpenAI Chat Model**。
3. 在模型設定中選擇對應模型版本。本次附加檔案使用的是：

   ```text
   gpt-5-mini
   ```

如果你的任務是摘要、分類、關鍵字提取這類結構化整理工作，先從成本較低、速度較快的模型開始，通常就很夠用了。

### 6. 修正 HTTP Request 節點的輸出參數
這是升級 AI Agent 後最容易踩雷的地方。因為節點改成 AI Agent 之後，輸出物件不再和原本 `Message a model` 一樣，後面的 HTTP Request 若仍沿用舊路徑，就很容易送出空值或直接報錯。

根據附加檔案，HTTP Request 送往 LINE Reply API 時，正文內容是從 `output` 物件裡取值，因此你至少要重新綁定以下欄位：
- 摘要：{% raw %}`{{ $json.output.summary }}`{% endraw %}
- 分類：{% raw %}`{{ $json.output.category }}`{% endraw %}
- 語言：{% raw %}`{{ $json.output.language }}`{% endraw %}

若你也想把關鍵字一起送出去，可以再補上：

- 關鍵字：{% raw %}`{{ $json.output.keywords.join('、') }}`{% endraw %}

另外，附加工作流中的 LINE 訊息模板有一個小細節值得注意：欄位名稱寫成了 `languag`，如果你要正式發布，建議順手改成 `language`，避免訊息文字看起來像拼字錯誤。

完成變數重綁後，執行 `Execute workflow` 測試，理想狀況下你就能在 LINE 收到一段由 AI 產生、而且格式固定的摘要結果。

---

## 觀念解析：一般模型 (Message a model) vs. AI Agent 差異在哪？

為什麼我們不繼續用原本的 `Message a model`，而要大費周章換成 `AI Agent`？這兩者雖然看起來都是處理文字，但運作底層完全不同：

| 比較維度 | 一般對話模型 (Message a model) | AI Agent |
| :--- | :--- | :--- |
| **處理邏輯** | **線性直出 (Linear)**：輸入問題 $\rightarrow$ 產出解答 $\rightarrow$ 結束。 | **循環思考 (Loop)**：接收任務 $\rightarrow$ 思考 $\rightarrow$ 調用工具 $\rightarrow$ 驗證 $\rightarrow$ 產出。 |
| **擴充能力** | 僅能單純處理文字生成與回覆。 | 可串接多種工具 (Tools)、資料庫或記憶庫 (Memory)。 |
| **Token 消耗** | 極低（省錢），適合簡單明確的任務（如翻譯、改寫）。 | 較高（耗費 Token），因為會進行多次內部對話與工具反覆確認。 |

> **顧問建議**：如果你的任務只是單純改寫、翻譯、生成一段文字，`Message a model` 通常更省成本；但如果你需要穩定輸出結構、後續還要串 API、或未來準備接工具與記憶能力，直接用 `AI Agent` 會更有擴充性。

---

## 常見問答 (FAQ)

### 一、節點設定與資料流

#### Q：為什麼這個流程要先用 `Edit Fields`，不能直接把 Webhook 內容丟進 AI Agent 嗎？
A：可以直接丟，但不建議。LINE Webhook 的 JSON 通常層級較深，若直接在提示詞裡寫 {% raw %}`{{$json.body.events[0].message.text}}`{% endraw %}，可讀性與維護性都比較差。先用 `Edit Fields` 把資料整理成 `input_text`，後續提示詞會更乾淨，也更容易除錯。

#### Q：AI Agent 的 `Prompt` 為什麼一定要切成 `Expression`？
A：因為你要讀的是前一個節點動態傳入的值。若使用 `Fixed`，n8n 會把 {% raw %}`{{$json.input_text}}`{% endraw %} 當成一般字串，而不是變數，模型收到的就不是實際訊息內容。

#### Q：系統提示詞已經寫「請只輸出 JSON」了，為什麼還要加 Output Parser？
A：因為提示詞只是要求，Parser 才是約束。只靠提示詞，模型仍可能偶爾多說一句說明文字；加上 `Structured Output Parser` 與 JSON Schema，才比較能把輸出鎖定在你要的欄位結構內。

### 二、Structured Output 與 JSON Schema

#### Q：JSON Schema 裡的 `required` 和 `additionalProperties: false` 有什麼差別？
A：`required` 是規定哪些欄位一定要出現；`additionalProperties: false` 是禁止模型額外加出沒定義的欄位。兩者一起用，才能同時做到「不能漏欄位」與「不能亂加欄位」。

#### Q：`category` 為什麼要用 `enum`？
A：因為分類欄位很容易失控。若不限制，模型可能一下輸出「商業應用」、一下輸出「商務」、一下又寫「創業」，後續做篩選、分析或寫入資料庫時就會很麻煩。用 `enum` 能把分類名稱固定下來。

#### Q：`keywords` 是陣列，實際發送 LINE 訊息時要怎麼顯示？
A：如果 LINE 訊息需要純文字顯示，可以把陣列轉成字串，例如：

{% raw %}
```javascript
{{ $json.output.keywords.join('、') }}
```
{% endraw %}

這樣收到的訊息會比較適合一般使用者閱讀。

### 三、常見錯誤與除錯

#### Q：為什麼把一般模型換成 AI Agent 後，最後的 HTTP Request 會報錯或變成空值？
A：最常見原因就是資料路徑改了。切換成 AI Agent 後，輸出通常會包在 `output` 物件中，所以你原本綁的欄位若不是 {% raw %}`{{ $json.output.summary }}`{% endraw %} 這類新路徑，就會抓不到值。

#### Q：如果 AI 回傳格式仍然不穩，應該先檢查哪裡？
A：先檢查三件事：
1. `Structured Output Parser` 是否真的接在 AI Agent 的 `ai_outputParser` 連線上。
2. JSON Schema 是否為合法格式，尤其是括號、逗號與 `required` 欄位名稱。
3. System Message 是否和 Schema 衝突，例如提示詞要求輸出欄位和 Schema 定義不一致。

#### Q：附加工作流裡 LINE 訊息的欄位名稱出現 `languag`，這會影響流程嗎？
A：不會影響資料抓取，因為真正取值仍然是 {% raw %}`{{ $json.output.language }}`{% endraw %}。但它會讓使用者在 LINE 看到拼字錯誤，所以建議改掉，這屬於顯示層的細節修正。

### 四、模型選擇與使用時機

#### Q：這種摘要與分類工作，適合用哪一種模型？
A：如果需求是摘要、分類、關鍵字提取、標籤整理這種中低複雜度任務，先用輕量模型通常最划算。像附加檔案採用的 `gpt-5-mini`，就很適合作為第一版驗證。

#### Q：什麼情況下我應該直接用 AI Agent，而不是 `Message a model`？
A：當你符合以下其中一種情況，就很適合改用 AI Agent：

1. 你需要穩定的 JSON 結構輸出。
2. 你後面還要串接 API、資料庫或聊天平台。
3. 你未來可能會加上工具調用、知識庫檢索或多步驟判斷。

如果只是一次性生成文字，`Message a model` 仍然比較省錢也比較簡單。
