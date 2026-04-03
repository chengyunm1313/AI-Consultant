---
title: n8n 串接 Facebook 自動發文：從 Meta API 到取得長期 Token 完全指南 | (EP.9) n8n 自動化 API 串接教學
cover: /images/cover112.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - 社群行銷
description: 想用 n8n 串接 Facebook 自動發文？本篇完整教學帶你完成 Meta API 串接、建立開發者應用程式、查找 Facebook Page ID、取得長期 Page Access Token，並整理 n8n 常見報錯與 FAQ。
date: 2026-04-03 22:18:59
subtitle: 從 Meta App 建立、Facebook Page ID 查找，到 n8n 長期 Page Access Token 設定與常見錯誤排查
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/9L4Blo8jQRU?si=H7gnkBHsNQzGcDAp" 
    title="n8n 串接 Facebook 自動發文教學：Meta API、Page ID、長期 Token 完整指南" 
    allow="fullscreen">
  </iframe>
</div>

如果你正在找「**n8n 串接 Facebook 自動發文教學**」、「**Facebook Page ID 怎麼找**」或「**Meta 長期 Token 怎麼拿**」，這篇就是針對這些問題整理的實戰指南。

在這篇教學中，我們將探討如何利用 n8n 工作流自動化工具，串接 Facebook Graph API，實現粉絲專頁的一鍵自動發文功能。

如果你不想從零開始刻節點，本篇教學將會使用由（Darks）開源提供的多平台自動發文模板進行示範，並專注解決串接過程中最容易卡關的 **Meta 應用程式建立**與 **長期 Access Token 獲取**。

你可以把這篇文章理解成一份實戰排雷手冊：不是只告訴你「理論上可以串接」，而是直接處理多數人在實作時最常遇到的三個問題：
- Token 很快失效，導致昨天能發、今天不能發
- Meta 權限沒有勾完整，n8n 執行後直接報錯
- 模板本身可用，但一到自己的帳號與粉專環境就卡住

只要你把 **Page ID、長期 Page Access Token、HTTP 節點版本** 這三件事設定正確，Facebook 自動發文流程通常就能穩定跑起來。

---

## n8n 串接 Facebook 自動發文前，你需要先準備什麼？

在開始設定之前，你至少要先備好以下 4 個元素：
1. 一個可正常登入的 n8n 環境
2. 一個你有管理權限的 Facebook 粉絲專頁
3. 一個 Meta for Developers 應用程式
4. 可用於發文的 Facebook Page ID 與長期 Page Access Token

如果這四個條件都具備，後面的設定會順很多；如果少其中任何一項，通常就會卡在權限、授權或 endpoint 錯誤。

---

## 如何快速導入 n8n 自動發文模板？

### 1. 取得並匯入工作流模板
你可以前往 [n8n 官方 Templates 庫](https://n8n.io/workflows/3066-automate-multi-platform-social-media-content-creation-with-ai/) 或創作者 Darks 的 [Portaly 頁面](https://portaly.cc/darks) 獲取一鍵自動發文模板。
- **作法：** 複製模板內容後，直接在你的 n8n 畫布上按下 `Ctrl+V` (或 `Cmd+V`) 即可貼上完整的工作流。

### 2. 設定社群金鑰 (Data tables)
在新版的 n8n 中，我們可以使用 **Data tables** 來集中管理各個社群平台的 API 金鑰，取代過去分散在各個節點填寫的麻煩。

1. 在 n8n 左側選單點擊 **Data tables**，選擇 `Create data table`。
2. 將表格命名為 `社群金鑰`（若使用模板，請務必與模板預設名稱完全一致）。
3. 新增所需欄位（例如：`main_scope`、`attribute`、`value`）。
4. 針對 Facebook 發文，我們至少需要準備並填入兩項核心資料：
   - **Facebook Page ID**
   - **Facebook Access Token**

接下來，我們將進入 Meta 開發者後台，去獲取這兩項關鍵資料。

---

## 如何建立 Meta 開發者應用程式，讓 n8n 可以串接 Facebook？

要透過 API 發文到 Facebook 粉絲專頁，你必須先在 Meta 建立一支應用程式來取得權限。

### 1. 新增應用程式
1. 前往 [Meta for Developers](https://developers.facebook.com/apps/)。
2. 點擊右上角的 **建立應用程式**。
3. 應用程式類型請選擇 **「商家 (Business)」** 或 **「其他 → 商家」**。
4. 輸入易於辨識的名稱（例如：`n8n-fb-autopost`），並填寫聯絡電子郵件。

### 2. 解決「隱私權政策」網址要求
建立應用程式後，前往 **應用程式設定 → 基本資料**。系統會要求填寫「隱私權政策網址 (Privacy Policy URL)」才能將應用程式狀態切換為「上線」。
> **專家建議：** 如果你沒有個人網站的隱私權頁面，可以使用免費的 [Privacy Policy Generator](https://www.privacypolicies.com/) 生成一份公版隱私權條款，獲取連結後貼回 Meta 後台即可過關。

### 3. 將應用程式切換為「上線」模式
在基本資料設定完成並儲存後，務必將應用程式頂部的狀態由「開發中」切換為 **「上線」**，這樣 n8n 才能順利調用 API。

---

## 如何取得 Facebook 長期 Access Token 與 Page Token？

這是整個流程中最容易出錯的環節。預設取得的 Token 通常只有 1 小時的壽命，我們必須將其轉換為「粉絲專頁專用的長期 Token」。

### 第一步：取得短期 User Token
1. 在 Meta 開發者後台，點擊頂部選單的 **「工具」→「圖形 API 測試工具 (Graph API Explorer)」**。
2. 右側面板設定：
   - **Meta 應用程式**：選擇你剛建立的 App。
   - **用戶或粉絲專頁**：選擇 **「取得粉絲專頁存取權杖」**，並授權勾選你的粉絲專頁。
3. **新增權限 (Permissions)：** 這是發文成功的關鍵，請務必加入以下 5 個權限：
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_read_user_content`
   - `pages_manage_posts`
   - `pages_manage_engagement`
4. 點擊 **Generate Access Token**（產生存取權杖），並複製這串短效期金鑰。

### 第二步：轉換為長效期 Token
1. 在「圖形 API 測試工具」中，點擊上方的 **「存取權杖偵錯工具」** 或點擊權杖旁的「i」圖示展開詳情。
2. 點擊底部的 **「延伸存取權杖 (Extend Access Token)」**，取得約 2-3 個月效期的長期 User Token。
3. **關鍵轉換：** 我們需要將 User Token 換成 Page Token。回到圖形 API 測試工具，在 GET 請求欄位輸入以下端點（請替換為你的粉絲專頁 ID）：
   ```text
   /{你的粉絲專頁編號}?fields=access_token&access_token={剛剛取得的長效_User_Token}
   ```
4. 點擊提交，返回的 JSON 數據中，`access_token` 欄位的值就是你最終需要的 **長期粉絲專頁發文金鑰**！

將這個 Token 與你的 Page ID 填回 n8n 的 Data tables 中，前置作業就大功告成了。

如果你想先驗證 Token 是否真的可用，建議在 n8n 正式執行前，先用 Graph API Explorer 或 HTTP Request 測一次最小請求。只要能成功打到粉絲專頁資料，後續發文流程通常就不會差太遠。

### 補充：Facebook Page ID 怎麼找最快？
如果你手上還沒有 Page ID，最穩的方式不是直接猜名稱，而是透過 Meta 工具或 Graph API 查詢實際 ID。因為在 n8n 串接 Facebook 發文時，真正用來指定目標粉專的是 Page ID，不是粉專顯示名稱。

你可以把這個觀念記住：
- 粉專名稱是給人看的
- Page ID 是給 API 用的

只要這裡填錯，後面就算 Token 正確，發文也可能失敗或打到錯的目標。

---

## n8n Facebook 自動發文失敗怎麼排查？常見報錯修復整理

如果你在執行 n8n 工作流時遇到錯誤，通常是以下兩個原因：

### 1. Graph API 版本過舊
Meta API 更新頻繁，模板中預設的 API 版本可能是 `v23.0`。若報錯，請進入 n8n 的 HTTP Request 節點（負責發布貼文的節點），將 URL 中的版本號手動更改為最新版，例如 `v25.0`：
```text
https://graph.facebook.com/v25.0/{{ $json.facebook_id }}/feed
```

### 2. If 節點 (判斷圖片是否存在) 報錯
舊版的 n8n `If` 節點在讀取空值時容易發生中斷錯誤。若你的流程在判斷「是否上傳圖片」時卡住，建議將該原有的 `If` 節點刪除，重新拖曳一個新的 `If` 節點，並重新設定判斷條件（如判斷 `binary.data` 是否存在），即可解決錯亂問題。

### 3. 發文成功回傳 200，但粉專上看不到貼文
這種情況通常不是 n8n 沒有送出，而是你打到的目標不是預期中的粉絲專頁、權限對錯頁、或貼文被發到不同類型的內容區塊。建議依序檢查：
1. Data table 裡的 `Facebook Page ID` 是否填成正確粉專，而不是個人帳號 ID。
2. Access Token 是否真的是該粉專對應的 Page Token。
3. HTTP Request 節點送出的 endpoint 是否為 `/{page_id}/feed`，而不是其他物件路徑。
4. 粉專角色是否足夠，且授權帳號仍然是該粉專的管理者或具備可發文權限的人員。

### 4. 明明有 Token，卻跳出權限不足或 OAuth 相關錯誤
這通常代表問題不在「有沒有 Token」，而在於 **Token 綁定的權限範圍不夠**。最常見的修法是重新生成權杖，並重新勾選 `pages_manage_posts`、`pages_read_engagement` 等必要權限，再重新做一次長效與 Page Token 轉換。只換節點設定、不重拿權杖，很多時候是修不好的。

---

## 實務建議：讓 Facebook 自動發文流程更穩定的 4 個做法

如果你是要把這個流程真的用在營運，而不只是測試一次，建議多做以下幾件事：

1. **把 Token 到期日記錄下來**
   長期 Token 不是永久有效。建議在 Notion、行事曆或任務系統中記錄建立日期與預估到期時間，避免某天排程突然中斷才回頭找原因。
2. **先做最小發文測試**
   一開始不要直接串完整的 AI 文案、自動抓圖、自動排程。先測最簡單的純文字貼文，確認 Page ID、Token 與 endpoint 都正確，再逐步加功能。
3. **把錯誤訊息完整保留**
   n8n 的執行紀錄、HTTP status code、Meta 回傳的錯誤訊息都很重要。很多 Facebook API 問題不是節點壞掉，而是錯誤訊息裡早就明講是版本、權限或參數不符。
4. **避免把憑證硬寫在節點裡**
   如果你未來還要串接 Instagram、Threads 或其他平台，建議持續用 Data tables 或統一憑證管理方式來控管金鑰，後續維護會簡單很多。

---

## 如果你接下來要改成 Facebook 多圖貼文

這篇文章處理的是「先把 Facebook 自動發文打通」，也就是 Page ID、長期 Token、基本發文與常見權限問題。如果你已經能穩定發單圖或純文字，下一步通常就是改成多圖貼文。

但這一步不是只把欄位多複製幾份而已。Facebook 多圖貼文的正確做法，會需要：
1. 表單支援多檔上傳
2. 每張圖各自呼叫 `POST /photos`
3. 收集所有 `photo id`
4. 最後用 `attached_media` 一次組回 `POST /feed`

完整做法我另外拆成一篇：[使用 Facebook Graph API 自動發布多圖貼文](/posts/auto-post-multiple-images-facebook/)。如果你現在已經跑通這篇的單圖流程，建議直接接著看下一篇。

---

## n8n 串接 Facebook 自動發文 FAQ

以下這一段我特別整理成「真的會遇到的卡點」，如果你不是要理解原理，而是要把流程跑起來，這些問題通常最值得先看。

### Q：為什麼我的 Facebook 發文權限一小時就失效了？
A：因為你一開始拿到的通常不是最終可用的 Page Token，而是「短效期用戶權杖 (Short-lived User Token)」。這種 Token 常常只有約 1 小時效期，適合測試，不適合正式排程。

正確流程應該是：
1. 先取得短期 User Token
2. 再延長成長期 User Token
3. 最後透過 API 轉換成對應粉專的 Page Token

只有完成第三步，你放進 n8n 裡的憑證才比較適合長期自動發文。很多人以為「已經拿到 Token」就可以了，結果其實只是停在第一步。

### Q：建立 Meta 應用程式時，強制要求填寫「隱私權政策網址」該如何解決？
A：Meta 為了合規性，要求上線的 API 應用程式必須具備隱私權政策。若你沒有自己的官網，最簡單的做法就是先用 Privacy Policy Generator 產生一份可公開存取的頁面，再把該 URL 貼回 Meta 後台。

實務上要注意兩件事：
1. 這個網址必須能從外部正常開啟，不能是內網或尚未發布的頁面。
2. 就算你現在只是自己測試，Meta 仍然常要求基本資料填完整，否則某些功能或狀態切換會卡住。

### Q：執行 n8n 流程時出現 Graph API 版本錯誤怎麼辦？
A：Meta 會定期淘汰舊版的 Graph API，所以你拿到的工作流模板就算之前能跑，過一陣子也可能因為版本過期而失效。最直接的做法，就是打開 n8n 中負責發文的 HTTP Request 節點，把 URL 裡的版本號更新成目前支援的版本，例如 `v25.0`。

如果你更新版本後還是報錯，不要只看版本本身，也要同步檢查：
1. endpoint 路徑有沒有寫錯
2. 權限是否完整
3. 請求方法是否為 `POST`
4. 送出的欄位名稱是否符合該 endpoint 要求

### Q：Page ID 要去哪裡找？可以直接用粉專名稱代替嗎？
A：不建議用粉專名稱硬猜，最穩的方式還是直接拿 **Facebook Page ID**。你可以在 Meta 的工具或相關 API 查到 Page ID，之後固定填進 n8n 的 Data table。因為實際發文 endpoint 是依照 ID 指向目標粉專，不是依名稱辨識。

如果你填錯 Page ID，常見結果有兩種：
1. 直接報錯，表示找不到對應資源
2. 成功執行，但其實打到錯的粉專或錯的頁面物件

### Q：我明明是粉專管理員，為什麼還是無法發文？
A：因為「你是管理員」不一定等於「這次授權出來的 Token 具備正確發文權限」。Facebook API 的世界裡，是否能發文不是只看帳號身份，還要看這次產生 Token 時到底勾了哪些 scopes。

換句話說，常見問題不是角色不夠，而是：
1. 你勾漏了 `pages_manage_posts`
2. 你拿的是 User Token，不是 Page Token
3. 你授權的是 A 粉專，但實際要發的是 B 粉專

### Q：n8n 裡建議用 Credentials 還是 Data tables 管理 Token？
A：如果你現在是跟著模板快速實作，而且這份工作流本身就是用 Data tables 設計，那直接沿用 Data tables 會最快，也比較符合這篇教學的流程。它的優點是你可以把多個平台的憑證集中管理，後續替換比較方便。

但如果你的團隊之後會把這套流程做得更正式、更模組化，也可以評估改成 n8n Credentials 或其他集中式密鑰管理方案。重點不在工具名稱，而在於你要避免把 Token 分散寫死在不同節點裡，否則未來更新憑證會很痛苦。

### Q：可以用這種方式排程每天自動發文嗎？
A：可以，這正是 n8n 很適合的場景之一。你可以在前面接 `Schedule Trigger`，固定每天、每週或特定時段執行，再把產生好的文案送到 Facebook 發文節點。

不過正式排程前，建議先確認三件事：
1. Token 已經換成長期可用的 Page Token
2. 貼文內容來源是穩定的，不會臨時產出空值
3. 流程裡有做基本錯誤處理，避免發文失敗卻沒人知道

### Q：Facebook 自動發文可以順便帶圖片嗎？
A：可以，但比起純文字貼文，圖片流程通常更容易出錯，因為你還要額外確認圖片檔案來源、格式、欄位名稱，以及 n8n 裡對 binary 資料的處理是否正常。這也是為什麼很多人在模板裡會卡在 `If` 節點或圖片判斷邏輯。

建議的做法不是一開始就硬上圖片版，而是：
1. 先測純文字貼文
2. 再測單張圖片貼文
3. 最後才整合 AI 文案、圖片生成與排程

這樣你比較容易知道問題到底出在 Facebook API、n8n 節點，還是圖片資料本身。

### Q：為什麼 n8n 測試時能發，排程時卻失敗？
A：這種情況非常常見，因為手動測試與排程執行的上下文不一定完全一樣。最常見的原因包括：
1. 測試時用的是手動輸入資料，排程時來源欄位其實是空的
2. Token 到排程執行時已失效
3. 前面某個節點在排程模式下沒有成功輸出資料，導致發文節點吃到空值

所以你不能只看「手動跑一次有成功」，還要回頭檢查排程當下的 input/output 與 execution log。

### Q：如果未來 Access Token 過期了，要整套重做嗎？
A：通常不用整套重做，但你至少要重新完成「拿新 Token」這一段，並把新的值更新回 n8n 使用的地方。只要 App、粉專、流程本身都還在，通常不需要整套模板重建。

比較務實的做法是：
1. 把 Token 更新流程寫成你自己的內部 SOP
2. 記錄 Page ID、App 名稱、授權帳號
3. 每次更換 Token 後立刻做一次最小發文測試

這樣下次出問題時，你不會又從零開始排查。

### Q：這套流程適合哪些人先導入？
A：最適合的是有固定社群內容產出需求的人，例如個人品牌經營者、顧問、行銷團隊、接案工作者，或本來就已經在用 n8n 串內容工作流的人。尤其如果你已經有固定的文案來源，例如 AI 產文、Notion 選題、Google Sheets 排程表，Facebook 自動發文會很容易接進去。

反過來說，如果你現在連貼文策略、審稿流程、內容節奏都還沒建立好，那先把 API 串起來不一定會立刻帶來效益。自動化放大的前提，是你原本的內容流程已經有基本穩定度。
