---
title: n8n 串接 ChatGPT API 完全指南 | (EP.3) n8n 自動化 API 串接教學
cover: /images/cover105.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - API串接
  - ChatGPT
description: 想知道如何讓 n8n 與 ChatGPT 完美結合嗎？本篇教學詳細拆解 OpenAI API 申請、n8n 節點設定與 Prompt 撰寫技巧，並附上最新官方文件連結，手把手帶你完成 AI 自動化工作流！
date: 2026-03-26 16:57:57
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/kGe3L7yFUUk?si=nXpVzzjGafnMkvs5" 
    title="n8n 串接 ChatGPT API 完全指南：零程式碼打造 AI 自動化工作流" 
    allow="fullscreen">
  </iframe>
</div>

## 如何快速開啟你的 AI 自動化冒險？

在 AI 工具百花齊放的時代，雖然有多種大型語言模型可供選擇，但在 n8n 自動化流程中，最穩定且最常被使用的核心引擎依然是 **ChatGPT (OpenAI API)**。本篇文章將手把手帶你完成 n8n 與 ChatGPT 的串接，從申請 API 密鑰、模型選擇到完整的 Prompt 詠唱技巧，一次幫你打通自動化工作流的任督二脈！

> **實用資源連結：**
> * [OPENAI API 平台](https://openai.com/zh-Hant/)
> * [n8n 官方文件：OpenAI node 整合指南](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai/?utm_source=chatgpt.com)

## 步驟一：如何取得與保護你的 OpenAI API 魔法鑰匙？

要讓 n8n 成功呼叫 ChatGPT，你必須先取得專屬的 API Key，並了解官方的計費與使用規範。

### 1. 申請 API Key
1. 你可以先前往 [OPENAI API 平台](https://openai.com/zh-Hant/) 了解最新的模型能力與官方資訊。
2. 接著登入 [OpenAI Platform 開發者後台](https://platform.openai.com/)（注意：此帳號獨立於一般版 ChatGPT 網頁，可分開註冊）。
3. 點擊右上角個人頭像，進入 **Profile -> API keys**。
4. 點擊 **Create new secret key**，為你的 Key 命名（例如：`n8n-try`），並選擇預設的 Project。
5. 複製生成的金鑰（格式通常為 `sk-...`）。請注意，這組金鑰建立後通常只會完整顯示一次，務必立即妥善保存。

### 2. 公會嚴格守則：資安防護
> **專家警告：** 這把「魔法鑰匙」絕對不可外洩！千萬不要將 API Key 直接寫在程式碼中，或推送到公開的 GitHub Repo。一旦外洩，你的額度將面臨被盜刷的風險。在 n8n 中，請務必使用內建的 **Credentials** 系統來安全儲存。

*(註：新申請的帳號若未綁定信用卡並儲值 Credit，呼叫 API 時將會報錯。建議先至 Billing 頁面進行小額充值以啟用服務，否則即使 Key 建立成功也可能因額度問題而無法呼叫。)*

## 步驟二：n8n 實戰，如何正確配置「OpenAI node」節點？

隨著 n8n 官方不斷迭代，舊版的 Assistant API 節點已被淘汰。最新的整合方式請務必參考官方指南：[OpenAI node 官方文件](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai/?utm_source=chatgpt.com)。

### 1. 新增節點與設定憑證
在 n8n 工作流中，新增一個最新的 **OpenAI Node (Message a Model)** 節點。在 **Credential to connect with** 欄位中，選擇創建新的憑證，並貼上剛剛申請的 OpenAI API Key 來完成連線。

### 2. 挑選適合的 AI 精靈 (Model)
在節點的 Model 列表中，你會看到多種模型。實戰上的選擇策略如下：
* **GPT-5-mini (萬能主角)：** 性價比最高、處理速度快，足以應付 80% 以上的日常自動化任務（如：摘要、分類、翻譯）。**（實戰首推）**
* **GPT-5-nano (低成本首選)：** 適合大量且極度單純的資料抽取，成本最低。
* **GPT-5 / GPT-4o (BOSS 戰專用)：** 當需要高難度推理、複雜程式碼撰寫或嚴格邏輯判斷時再派上用場。

如果你只是要先做出第一個能穩定跑通的 MVP，建議直接從 `gpt-5-mini` 開始。它的速度、成本與輸出品質在 n8n 場景中相對平衡，很適合摘要、分類、標籤整理、客服初步回覆等任務。

## 步驟三：詠唱的藝術，如何精準設定 Prompt 與輸出 JSON 格式？

要讓 AI 聽話，不能只把資料丟給它，必須建立「三層漢堡」結構的提示詞 (Prompt)。核心原則很簡單：`System` 負責規則，`User` 負責任務，而 `JSON Schema` 負責把輸出格式鎖死。

### 1. 頂層：系統人設 (System Prompt)
在節點設定中，將 Role 設為 `System`。在這裡賦予 AI 角色與規則：

```text
你是資料整理助手。

規則：
1. 使用繁體中文。
2. 不要捏造未提供的資訊。
3. 請只輸出 JSON。
4. 欄位必須包含 summary、category、keywords、language。
5. 若資訊不足，也必須輸出合法 JSON。
```

### 2. 中層與底層：任務指令與動態輸入 (User Prompt)
再新增一個 Message 區塊，Role 設為 `User`，並動態帶入前方節點的變數：

```text
請讀取以下內容，輸出摘要、主題分類、3 個關鍵字。

內容：
{{ $json.input_text }}
```

### 3. 強制結構化輸出 (JSON Schema)
為了後續自動化節點能順利讀取資料，我們必須限制 AI **只能輸出 JSON**：
1. 在節點底部的 **Options** 點擊 `Add Option`。
2. 選擇 `Text Format` 或 `Output Format` 中的 `JSON Schema`（不同版本 UI 命名略有差異）。
3. 貼上你預先定義好的 Schema 格式，例如：

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

這樣做的最大好處是，下一個節點不需要再猜 AI 回了什麼格式，直接用固定欄位去接值即可。特別是 `enum` 很實用，它能強迫模型只能從你預設好的分類清單中挑選答案，大幅降低資料髒亂與拼字不一致的問題。

## 步驟四：資料淨化與回傳，如何完成連段技？

在呼叫完 AI 後，我們通常需要將結果傳回前端（例如 Line Bot 或資料庫）。

1. **Set 節點淨化：** 在接收 Webhook 與傳給 AI 之間，建議先安插一個 `Set` (Edit Fields) 節點，將複雜的 Webhook 結構簡化為 `input_text`。例如把 `{{ $json.body.events[0].message.text }}` 指派給 `input_text`，這能讓你的 Prompt 保持乾淨，也讓後續維護更容易。
2. **HTTP Request 回傳：** 取得 AI 產出的 JSON 後，使用 HTTP Request 節點，動態帶入 `replyToken` 與 AI 產出的摘要內容，即可成功將結果推播給使用者。

如果你是串接 Line Bot，JSON Body 可以參考下面這個最小可行範例：

```json
{
  "replyToken": "{{ $('Webhook').item.json.body.events[0].replyToken }}",
  "messages": [
    {
      "type": "text",
      "text": "【summary】{{ $json.output[0].content[0].text.summary }}\n【category】{{ $json.output[0].content[0].text.category }}\n【language】{{ $json.output[0].content[0].text.language }}"
    }
  ]
}
```

如果你也想把關鍵字一起回傳，只要在文字內容中再補上 `keywords` 欄位即可。透過這種做法，一個從接收、處理到回覆的 MVP AI 自動化工作流就能順利跑起來。

---

## 常見問答 (FAQ)

為了方便你快速排錯，我把常見問題依照「最容易搜尋到的痛點」重新整理成四類：先處理帳號與節點錯誤，再看模型與成本，接著解決工作流穩定性，最後才是上線與維護。

### 一、帳號、節點與連線錯誤

### Q：為什麼我的 OpenAI API Key 一直報錯或無法使用？
A：最常見的原因是「帳戶餘額不足」。OpenAI API 的計費機制與一般網頁版 ChatGPT Plus 訂閱是完全分開的。請登入 OpenAI API 後台的 Billing 頁面，綁定信用卡並儲值（Add payment details），API 即可正常開通使用。

### Q：為什麼我在 n8n 執行 OpenAI 節點時，會收到「Error: 401 Insufficient Quota」的錯誤？
A：這是因為你的 OpenAI 開發者帳戶「餘額不足」。OpenAI API 的計費與一般網頁版的 ChatGPT Plus 訂閱是分開的。請登入 OpenAI Platform 的 Billing 頁面，綁定信用卡並預先儲值（如 5 美金），即可開通 API 權限。

### Q：為什麼在 n8n 裡找不到舊版的 OpenAI Assistant 節點？
A：n8n 官方已於後續版本中淘汰了舊的 Assistant API 節點，改用更具彈性的架構。目前的最佳實踐是參考[OpenAI node 官方文件](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai/)，使用「Message a Model」或 LangChain 相關節點，不僅支援多模態（圖片、音訊），在設定 JSON Schema 結構化輸出時也更加穩定。

### Q：如果我在 OpenAI 節點裡找不到 `JSON Schema` 選項怎麼辦？
A：這通常有兩種原因。第一，你使用的是較舊版的 n8n，介面中可能還沒有完整支援結構化輸出功能；第二，你可能不是使用最新的 `Message a Model` 類型節點，而是用了舊版或其他 OpenAI 相關節點。最穩妥的做法是先更新 n8n，並確認你使用的是官方目前主推的 OpenAI 節點。若暫時無法升級，也可以先在 Prompt 中強制要求輸出 JSON，再用後續節點做驗證，但穩定性仍然不如原生 Schema。

### 二、模型選型與成本控制

### Q：`gpt-5-mini`、`gpt-5-nano`、`gpt-5` 到底該怎麼選？
A：你可以用一句話快速判斷。若你的任務是摘要、分類、標籤整理、客服初步回覆這類標準型工作，先選 `gpt-5-mini`；若你的任務極度單純，而且請求量很大、很在意成本，可以試 `gpt-5-nano`；若你要處理多步邏輯推理、複雜文字生成或高品質程式碼任務，再升級到 `gpt-5`。不要一開始就選最強模型，否則通常只是成本更高，效果卻未必明顯更好。

### Q：為什麼我的成本會比想像中高？不是只有丟一段文字給 AI 嗎？
A：成本不只和輸入文字長度有關，也和你送出的系統提示詞、使用者提示詞、歷史上下文，以及模型輸出的字數有關。如果你在工作流中夾帶大量背景資訊、冗長規則、長篇聊天紀錄，Token 消耗就會快速增加。最佳做法是先用 Set、Code 或資料清洗節點把不必要的欄位砍掉，只保留 AI 真正需要看的內容。

### Q：我可以把整段客服對話、網頁內容或 PDF 全部丟進去，讓 AI 自己理解嗎？
A：技術上有時可以，但實務上不建議一開始就這樣做。資料越雜，輸出越不穩，成本也越高。比較好的流程是先做前處理，例如擷取重點欄位、清除無關字串、限制字數，再把精煉後的內容送進 OpenAI 節點。AI 並不是垃圾桶，前處理做得越乾淨，結果通常越穩。

### Q：如果我的工作流只是做摘要或分類，還需要用 AI Agent 嗎？
A：通常不需要。這種任務屬於標準的一進一出文字處理，使用單純的 OpenAI 節點反而最穩、最便宜，也最好除錯。AI Agent 真正適合的是需要自行查資料、決策、呼叫工具、反覆嘗試的流程。如果只是摘要、翻譯、改寫、分類或抽取欄位，直接用 LLM 節點即可。

### 三、輸出格式與工作流穩定性

### Q：AI 有時候會亂講話或格式跑版，導致後面的自動化流程中斷怎麼辦？
A：這就是 Prompt 工程的關鍵！除了在 System Prompt 中明確寫出「請只輸出 JSON，不要包含其他廢話」之外，務必在 OpenAI 節點的 Options 中開啟 `Output Format: JSON Schema`，並嚴格定義你要的欄位結構。這樣 AI 就會被強制限制，只產出合法且符合你所需的 JSON 結構，確保工作流穩定運行。

### Q：為什麼我明明要求 AI 輸出 JSON，它還是會多回一些說明文字？
A：因為單靠 Prompt 約束並不保險。模型即使理解了你的要求，也有可能在某些情況下額外補一句說明，尤其在輸入內容複雜、上下文過長或指令不夠明確時更容易發生。最有效的解法不是一直加重語氣，而是直接使用 `JSON Schema` 或結構化輸出功能，讓格式限制由系統層處理，而不是只靠文字要求。

### Q：為什麼同一段 Prompt，今天測得好好的，明天結果卻有點不一樣？
A：這是生成式模型的正常現象。即使模型、提示詞與輸入看似相同，輸出的文字細節仍可能略有差異。因此在 n8n 工作流裡，真正需要追求的不是「每次字字相同」，而是「每次都符合你要的結構與規則」。也就是說，請把重點放在穩定的欄位輸出、固定分類值與可驗證的資料格式，而不是要求每一句自然語言都完全一致。

### Q：OpenAI 節點回傳成功了，但我不知道該怎麼抓裡面的欄位怎麼辦？
A：最簡單的方法是先在 n8n 的執行結果面板中查看該節點的實際輸出 JSON，確認資料路徑後，再複製到下一個節點的表達式中。很多新手會直接照抄別人的 `{{ $json.output[0].content[0].text.summary }}`，但不同節點版本或設定方式，輸出結構可能略有差異。正確做法永遠是先看自己的執行結果，再決定要抓哪一層。

### Q：為什麼 AI 有時候回傳的內容會導致後面的 HTTP Request 節點報錯？
A：通常是因為 AI 回傳了包含 Markdown 標記（如 ````json ````）或多餘的聊天廢話，導致 n8n 無法正確解析 JSON。解決方案是確實使用步驟三教學的 `JSON Schema` 功能，這會在底層強制 API 僅能輸出純粹且符合規則的 JSON 格式。

### Q：Webhook 傳來的結構太複雜，我一定要用 Set (Edit Fields) 節點嗎？
A：雖然不是強迫的，但**強烈建議使用**。將深層的 JSON 路徑（例如 `body.events[0].message.text`）統一轉換為一個易讀的變數 `input_text`，不僅方便你在 Prompt 中引用，未來如果前端平台（從 Line 換成 Telegram）更換了，你也只需要在 Set 節點修改一次對應關係，大幅提高工作流的維護性。

### Q：如果我想讓 AI 根據不同情境回不同格式，還適合用固定 Schema 嗎？
A：可以，但你要先重新思考資料設計。實務上不建議讓同一個節點今天回 A 格式、明天回 B 格式，因為這會讓後續節點很難維護。更好的做法通常有兩種：一種是把所有可能欄位都設計進同一份 Schema，未使用欄位留空；另一種是先用前一個節點做路由判斷，再分流到不同的 OpenAI 節點，各自使用不同 Schema。這樣工作流會比混合格式穩定很多。

### 四、上線測試與後續維護

### Q：如果我想把 AI 產出的結果寫進 Google Sheets、Notion 或資料庫，有什麼要注意？
A：最重要的是欄位要先標準化。也就是說，不要讓 AI 自由發揮欄位名稱、分類文字或日期格式，而是先在 Schema 裡把欄位類型與值域定義好。這樣後續接 Google Sheets、Notion、Airtable、SQL 等節點時，才不會出現欄位名稱忽然改掉、分類值拼法不一致，或日期格式無法寫入的問題。

### Q：我該怎麼測試這個工作流，才不會一上線就翻車？
A：請不要一開始就拿真實使用者流量測。比較穩健的方式是先準備 5 到 10 組測試資料，刻意涵蓋正常輸入、空字串、超長文本、語意模糊內容，以及格式不完整的情境。只要這些案例都能穩定輸出合法 JSON，而且後面的 HTTP Request 或資料庫節點都接得住，你再上線會安全很多。

### Q：如果未來 OpenAI 模型更新，我現在的 n8n 工作流會壞掉嗎？
A：有可能，但通常不是整個流程壞掉，而是輸出風格、欄位路徑或可選模型名稱發生變化。因此建議你在工作流中盡量避免硬依賴模型的自由文字表現，而是把穩定性建立在 `System Prompt`、`JSON Schema` 與後續驗證節點上。只要格式約束做得夠紮實，未來即使更換模型，調整成本也會低很多。
