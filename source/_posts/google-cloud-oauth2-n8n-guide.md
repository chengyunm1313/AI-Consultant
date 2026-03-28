---
title: 如何使用 n8n 串接 Gmail？Google OAuth2 授權設定全攻略
cover: /images/cover107.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - Google
description: 想要讓 n8n 自動發送 Gmail 郵件卻卡在授權？本文帶你一步步完成 Google Cloud 的 OAuth2 驗證設定，從開啟 API 到取得密鑰，輕鬆完成自動化工作流串接！
date: 2026-03-28 14:54:33
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/jzlrSpg59Dg?si=2rstO8zFKjUq5icW" 
    title="如何使用 n8n 串接 Gmail？Google OAuth2 授權設定全攻略" 
    allow="fullscreen">
  </iframe>
</div>

## 為什麼這篇設定很重要？

在 n8n 的自動化流程中，Gmail 常常不是單獨存在，而是扮演「最後通知出口」的角色。你可能會先從 LINE、表單、Webhook 或資料庫拿到資料，再交給 AI 做整理，最後自動寄出摘要通知。這也是很多人卡關的地方：**流程節點都接好了，結果 Gmail 節點始終無法授權**。

Google 已經不建議用帳號密碼直接讓第三方服務寄信，因此在 n8n 中要使用 Gmail，標準做法就是透過 **Google Cloud Console** 建立 **OAuth2 授權**，再把 `Client ID` 與 `Client Secret` 填回 n8n。

這個設定一旦完成，未來你不只可以用在 Gmail，也能延伸到 Google Calendar、Google Drive、Google Sheets 等常見 Google 服務。更重要的是，當你做 AI 自動化工作流時，這組憑證就是能不能穩定落地的關鍵一步。

---

## 這篇文章會完成什麼？

本文會帶你完成兩件事：

1. 在 Google Cloud 建立可供 n8n 使用的 Gmail OAuth2 憑證。
2. 把這組憑證套用到一個實戰工作流：`LINE Webhook -> AI Agent -> LINE Reply + Gmail 通知`

根據你提供的工作流 JSON，這條流程的核心邏輯如下：

- `Webhook`：接收 LINE Bot 傳入的 webhook 事件。
- `If`：確認收到的是文字訊息，而不是貼圖、圖片或其他事件。
- `Edit Fields`：把 `body.events[0].message.text` 整理成 `input_text`。
- `AI Agent`：交給 OpenAI 模型做摘要、分類、關鍵字萃取。
- `Structured Output Parser`：限制輸出格式必須是固定 JSON。
- `HTTP Request`：呼叫 LINE Reply API，把摘要結果回傳給使用者。
- `Gmail`：再寄一封 Email，把摘要結果與原始文字同步通知給自己或團隊。

也就是說，**Gmail OAuth2 不是孤立設定，而是整條 AI 通知流程的一部分**。

---

## 第一步：如何在 Google Cloud Console 建立專案與啟用 API？

要讓 n8n 可以代表你操作 Gmail，第一件事就是在 Google Cloud 建立專案，並啟用對應 API。

1. **登入平台：** 前往[Google Cloud Console](https://console.cloud.google.com/) 並使用你的 Google 帳號登入。（建議預先綁定實體信用卡以利通過身分驗證，避免使用易遭拒絕的簽帳金融卡）。
2. **建立新專案：** 點擊左上角專案選單，選擇「**新增專案 (New Project)**」。將專案命名為易於辨識的名稱（例如：`n8n-try`），若無所屬機構可選擇「無組織」，接著點擊「建立」。
3. **進入 API 服務：** 專案建立完成後，展開左側導覽選單，選擇「**API 和服務**」>「**已啟用的 API 和服務**」（建議將此選項加入星號釘選，未來會經常使用）。
4. **啟用所需 API：** 點擊上方的「**+ 啟用 API 和服務**」，在搜尋框中尋找並啟用以下服務：
   * `Gmail API` (本次寄信必備)
   * `Google Calendar API` (建議一併開啟)
   * `Google Drive API` (建議一併開啟)

---

## 第二步：如何設定 OAuth 同意畫面與新增測試使用者？

在取得金鑰之前，還要先設定 OAuth 同意畫面。這個畫面就是你在 n8n 點擊 `Sign in with Google` 時，Google 會跳出來要求你確認授權的那一頁。

1. **設定同意畫面：** 在「API 和服務」選單中點擊「**OAuth 同意畫面**」。
2. **選擇使用者類型：** 一般個人用戶請選擇「**外部 (External)**」，點擊建立。
3. **填寫應用程式資訊：**
   * 應用程式名稱：輸入如 `n8n-try`。
   * 使用者支援電子郵件：選擇你目前的 Google 帳號。
   * 開發人員聯絡資訊：同樣填入你的 Google 帳號。
4. **新增測試使用者 (非常重要)：** 
   因為我們的應用程式仍在「測試中 (Testing)」狀態，並未經過 Google 官方審核發布，**只有被加入「測試使用者」名單的帳號才能順利授權**。
   * 在「測試使用者」區塊，點擊「**+ ADD USERS**」。
   * 輸入你即將用來「發送 Email」的 Google 帳號並儲存。

---

## 第三步：如何取得 Client ID 與密鑰 (Secret)？

前面都設定好後，現在就可以正式建立 n8n 要使用的 OAuth2 憑證。

1. **建立憑證：** 點擊左側選單的「**憑證**」，接著點擊上方「**+ 建立憑證**」，選擇「**OAuth 用戶端 ID**」。
2. **設定應用程式類型：** 選擇「**網頁應用程式 (Web application)**」，並輸入名稱（如：`n8n-try`）。
3. **設定重新導向 URI (Redirect URI)：**
   * 回到你的 n8n 介面，新增一個 Gmail 節點，動作選擇 `Send a message`。
   * 在認證 (Credential) 欄位選擇 `Create new credential`。
   * 複製 n8n 介面上提供的 `OAuth Redirect URL`（例如：`https://n8n-try.zeabur.app/rest/oauth2-credential/callback`）。
   * 將此網址貼回 Google Cloud 憑證設定的「**已授權的重新導向 URI**」欄位中（注意：網址結尾不可包含斜線 `/`）。
4. **取得金鑰：** 點擊「建立」後，系統會彈出視窗顯示你的 **用戶端 ID (Client ID)** 與 **用戶端密鑰 (Client Secret)**。請將這兩組字串妥善複製並保存。

> **專家提示：** 密鑰 (Secret) 只會在第一次建立時完整顯示，請務必妥善備份。若不慎遺失或外洩，可回到憑證管理頁面刪除舊密鑰並重新生成。

---

## 第四步：如何回到 n8n 建立 Gmail Credential？

Google 端的工作完成後，接下來就是把這組 OAuth2 憑證填回 n8n。

1. **輸入憑證資訊：** 回到 n8n 的 Credential 設定畫面，將剛剛取得的 `Client ID` 與 `Client Secret` 貼入對應欄位，點擊「**Sign in with Google**」。
2. **完成安全授權：**
   * 登入你設定為「測試使用者」的 Google 帳號。
   * 系統會出現「這個應用程式未經 Google 驗證」的警告。這是正常現象，請點擊左下方的「**繼續 / 進階**」，再點擊「**前往 n8n-try (不安全)**」。
   * 勾選「全選」賦予讀寫信件的權限，最後點擊「繼續」，若顯示 Connection successful 即代表串接成功！
3. **命名 Credential：** 建議不要直接用預設名稱，可命名為像 `Gmail (n8n-try)` 或 `Gmail (LINE 摘要通知)`，之後多個專案並存時比較好管理。

---

## 第五步：如何把 Gmail 應用到這個 LINE + AI 工作流？

當 Credential 建好後，就可以把它接到你這份工作流裡的 Gmail 節點。你提供的 JSON 使用的是 `Send a message1` 節點，實際設定重點如下。

### 1. 先理解這條工作流的資料流

這份工作流的順序是：

`Webhook -> If -> Edit Fields -> AI Agent -> HTTP Request + Gmail`

其中最關鍵的資料轉換有兩段：

- `Edit Fields` 把 LINE 訊息抽成 `input_text`
- `AI Agent` 透過結構化輸出，回傳 `summary`、`category`、`keywords`、`language`

也因為如此，Gmail 節點裡的主旨與內文，就可以直接引用 AI Agent 的輸出欄位。

### 2. Gmail 節點的設定方式

在 Gmail 節點中，至少要確認以下欄位：

- **Resource / Operation：** `Message` / `Send`
- **Credential：** 選擇剛剛建好的 Gmail OAuth2 憑證
- **To：** 你的收件信箱，或團隊共用信箱
- **Email Type：** `Text`

你提供的範例主旨使用這段 Expression：

{% raw %}
```javascript
LINE 摘要通知｜{{$json.output.category}}
```
{% endraw %}

信件內容則把 AI 整理後的資料與原始訊息一起寄出：

{% raw %}
```javascript
您好，

已收到一則新的 LINE 文字內容，並完成自動整理如下：

【摘要】
{{$json.output.summary}}

【分類】
{{$json.output.category}}

【關鍵字】
{{$json.output.keywords.join('、')}}

【語言】
{{$json.output.language}}

--------------------
【原始內容】
{{$('Edit Fields').item.json.input_text}}
```
{% endraw %}

這種寫法很適合通知型工作流，因為你不只會收到 AI 的摘要結果，也能同步保留原始內容做交叉檢查。

### 3. 為什麼這樣設計很實用？

這份流程其實同時做了兩件事：

- 對外：透過 `HTTP Request` 呼叫 LINE Reply API，把摘要立即回覆給使用者
- 對內：透過 `Gmail` 把摘要寄給自己或團隊，形成通知與留存紀錄

如果你未來想把這條流程改造成客服摘要、業務回報、報名表單通知、或內部知識蒐集，這個架構都很容易擴充。

---

## 第六步：AI Agent 與 Structured Output 在這個流程中扮演什麼角色？

這篇主題雖然是 Gmail OAuth2，但如果不了解前面的 AI 結構，很多人會在 Gmail 節點誤抓欄位，導致信件主旨或內文出現空值。

### 1. `Edit Fields` 做了什麼？

`Edit Fields` 節點把原始 LINE Webhook 內容：

{% raw %}
```javascript
{{ $json.body.events[0].message.text }}
```
{% endraw %}

整理成單一欄位：

```text
input_text
```

這樣做的好處是提示詞更乾淨，也比較不容易在後面節點重複寫深層路徑。

### 2. `AI Agent` 的提示詞邏輯

你提供的 AI Agent 使用的是以下任務設定：

{% raw %}
```text
請讀取以下內容，輸出摘要、主題分類、3 個關鍵字。

內容：
{{$json.input_text}}
```
{% endraw %}

而 System Message 則限制模型：

- 使用繁體中文
- 不要捏造資訊
- 只輸出 JSON
- 必須包含 `summary`、`category`、`language`
- 資訊不足也要輸出合法 JSON

### 3. `Structured Output Parser` 為什麼重要？

因為後面的 LINE Reply 與 Gmail 都不是要讀一大段自由文字，而是要讀固定欄位。

你的 JSON Schema 其實已經把這件事做得很完整：

- `summary`：摘要文字
- `category`：限定在 `AI工具`、`程式開發`、`商業`、`教育`、`其他`
- `keywords`：字串陣列
- `language`：語言判斷

這代表 Gmail 節點可以穩定用下面這些欄位，而不是碰運氣讀模型輸出：

- {% raw %}`{{$json.output.summary}}`{% endraw %}
- {% raw %}`{{$json.output.category}}`{% endraw %}
- {% raw %}`{{$json.output.keywords.join('、')}}`{% endraw %}
- {% raw %}`{{$json.output.language}}`{% endraw %}

---

## 第七步：正式測試前，建議先檢查哪些地方？

在你按下 `Execute workflow` 之前，建議先做一次快速檢查：

1. Google Cloud 的 OAuth 同意畫面是否已加入正確的測試使用者。
2. Gmail Credential 中的 `Client ID`、`Client Secret` 是否來自同一個專案與同一組憑證。
3. `OAuth Redirect URL` 是否完整貼入 Google Cloud，而且沒有多餘斜線。
4. Gmail 節點是否真的選到正確的 Credential，而不是舊的或失效的憑證。
5. Gmail 節點中的 Expression 是否抓的是 AI Agent 的 `output` 欄位。
6. `keywords` 若要顯示成文字，是否已用 `.join('、')` 轉成字串。
7. `If` 節點是否限制只有 `message.type = text` 才往下走，避免貼圖或圖片事件直接報錯。

如果這幾個地方都正確，通常整條流程就能順利跑起來。

---

## 常見問答 (FAQ)

### Q：註冊 Google Cloud Platform (GCP) 需要綁定信用卡嗎？會不會被亂扣款？

A：Google Cloud 通常會要求綁定信用卡做身分驗證，這是平台的常見流程。若你只是用來做 Gmail OAuth、Calendar 或 Drive 這類基礎串接，而且沒有另外啟用付費資源，通常不會因為這篇教學本身產生額外高額費用。不過還是建議你定期查看帳單與專案啟用服務，避免把測試專案長期放著不管。

### Q：在 n8n 點擊 `Sign in with Google` 時，出現「Access denied」或「此應用程式尚未完成驗證」怎麼辦？

A：最常見有兩種原因：

- 你用來登入授權的 Google 帳號，沒有被加入 OAuth 同意畫面的「測試使用者」
- 你登入的帳號和 Google Cloud 專案內設定的測試帳號不是同一個

先回到 Google Cloud 的「OAuth 同意畫面」，確認測試使用者名單，再重新回 n8n 授權一次。

### Q：為什麼我明明已經拿到 `Client ID` 和 `Client Secret`，n8n 還是授權失敗？

A：這通常不是金鑰本身錯，而是 **Redirect URI 不一致**。請重新比對：

- n8n Credential 畫面顯示的 `OAuth Redirect URL`
- Google Cloud 憑證中的「已授權的重新導向 URI」

兩邊只要少一個字、多一個 `/`、或網域不同，都可能導致授權失敗。

### Q：Gmail 節點已經成功連上，但寄信時仍然失敗，應該先檢查哪裡？

A：建議先檢查這四個點：

1. Gmail 節點是否真的選到正確的 OAuth2 Credential。
2. `To` 欄位是否為合法 Email。
3. 主旨與內文中的 Expression 是否抓得到值。
4. 前一個 AI Agent 是否真的有成功輸出 `output.summary`、`output.category` 等欄位。

很多人以為是 Gmail 壞掉，實際上是前面節點沒有值，導致寄信內容組不起來。

### Q：這份工作流中，為什麼 Gmail 節點要用 {% raw %}`{{$json.output.summary}}`{% endraw %}，而不是 {% raw %}`{{$json.summary}}`{% endraw %}？

A：因為你這份流程使用的是 `AI Agent + Structured Output Parser`。在這種情況下，AI 的結構化輸出通常會包在 `output` 物件裡，所以 Gmail 與 HTTP Request 要抓的是：

- {% raw %}`{{$json.output.summary}}`{% endraw %}
- {% raw %}`{{$json.output.category}}`{% endraw %}
- {% raw %}`{{$json.output.keywords}}`{% endraw %}
- {% raw %}`{{$json.output.language}}`{% endraw %}

如果你直接寫 {% raw %}`{{$json.summary}}`{% endraw %}，通常會抓不到值。

### Q：`keywords` 是陣列，直接放到 Gmail 內文裡可以嗎？

A：技術上可以，但顯示通常不夠友善。比較建議轉成一般文字，例如：

{% raw %}
```javascript
{{$json.output.keywords.join('、')}}
```
{% endraw %}

這樣收件者看到的會是「AI、自動化、LINE Bot」這種格式，而不是原始陣列樣式。

### Q：如果 LINE 傳來的是貼圖、圖片或非文字事件，這條流程會怎麼樣？

A：你提供的工作流已經先用 `If` 節點判斷：

{% raw %}
```javascript
{{ $json.body.events[0].message.type }} === text
```
{% endraw %}

這是必要的，因為後面的 `Edit Fields` 會直接讀 `message.text`。如果沒有先過濾，遇到非文字事件時就可能報錯。

### Q：為什麼這個流程同時要回 LINE，又要寄 Gmail？不是重複通知嗎？

A：兩者用途不同：

- LINE Reply 是給最終使用者的即時回覆
- Gmail 是給自己或團隊的內部通知與紀錄留存

如果你之後想追蹤哪些訊息被分類成什麼主題、或想保留原始內容做人工覆核，Email 留存會非常實用。

### Q：如果我的 Client Secret 不小心外洩了，應該怎麼補救？

A：請立刻回到 Google Cloud Console 的「API 和服務」>「憑證」，找到對應的 OAuth 用戶端，重新產生新的密鑰，並在 n8n 更新成新的 Credential 設定。確認新密鑰可正常授權後，再停用或刪除舊密鑰。只要你懷疑有外洩，就不要繼續使用原本那組。

### Q：這組 Google OAuth2 設定之後只能拿來寄 Gmail 嗎？

A：不是。只要同一個 Google Cloud 專案有啟用對應 API，你之後通常還可以延伸用到 Google Calendar、Google Drive、Google Sheets 等服務。不過每種服務在 n8n 端可能會有不同的權限範圍與 Credential 類型，實作時還是要分開確認。
