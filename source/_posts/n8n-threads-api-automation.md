---
title: 如何串接 Threads API 實現全自動發文？ | (EP12) n8n 自動化 API 串接教學
cover: /images/cover125.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - AI工具
  - API串接
description: 想要實現 Threads 自動發文？本篇完整教學帶你使用 n8n 串接 Meta Threads API，從建立應用程式、取得測試人員權限，到成功展延 60 天長期 Token，一步步打造你的 AI 自動化發文系統！
date: 2026-05-04 18:02:12
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/oWXRGQYBxqo?si=7oSRuLJ3EEPuJAoF" 
    title="如何串接 Threads API 實現全自動發文？ | (EP12) n8n 自動化 API 串接教學" 
    allow="fullscreen">
  </iframe>
</div>

繼我們先前成功串接 Facebook 與 Instagram 的 API 後，今天要挑戰 Meta 家族中**設定步驟最多、但成就感也最高**的 Threads API 自動化發文！

Threads 的 API 授權流程比 IG 更繁瑣，官方文件也相對零散，許多人卡在「Token 失效」或「測試人員未接受邀請」這兩個地方就放棄了。本篇教學將完整拆解每一個關鍵步驟，帶你從零到一打通 API 授權、取得長期 Token，並在 n8n 中成功測試自動發文與圖片發布。

如果你不想從頭打造，也可以直接匯入「達哥」提供的 n8n 模板（付費版與免費版皆有）省去繁瑣設定。話不多說，開始吧！

---

## 第一步：建立 Meta Threads 應用程式

要透過程式控制 Threads 發文，首先必須在 Meta 開發者平台建立專屬應用程式並開通權限。

1. **建立應用程式**：進入 Meta 開發者平台，點選右上角的「建立應用程式」。
2. **選擇使用案例**：在選項中找到並選取 **「存取 Threads API」**（Access Threads API），不要選到 Instagram 或其他選項。
3. **跳過企業管理平台**：系統會詢問是否要連結商家資產管理組合，測試用途可先選擇「還不想要連結」，直接進行下一步。
4. **確認應用程式權限**：建立完成後，進入設定頁面，將所有 Threads 相關的應用程式權限（讀取、發文等）逐一按下「新增」，確保 API 擁有足夠的執行授權。

> **小提醒**：應用程式初建時會處於「開發模式」，此模式下只有你自己（或已驗證的測試人員）才能使用 API，這是正常的。

---

## 第二步：新增並驗證 Threads 測試人員

由於應用程式處於開發模式，你必須先把自己的帳號設為「測試人員」，才能進行發文實測。

1. **新增測試人員**：在開發者後台的左側選單找到 **「應用程式設定」→「角色」**，點擊新增「Threads 測試人員」。
2. **取得並輸入使用者編號**：開啟 Threads 帳號設定，找到你的**使用者編號（User ID）**，複製後貼至開發者後台並送出邀請。
3. **接受邀請（最容易被跳過的關鍵步驟）**：
   在手機或網頁版 Threads 進入 **「設定」→「帳號」→「網站權限」**，找到剛送出的邀請並按下「接受」。**若未完成此動作，所有 API 呼叫都會出現 Permission Denied 錯誤。**

---

## 第三步：取得短效 Token 並進行首次測試

接下來要取得 API 的「通行證」，也就是 Access Token。

1. **開啟測試工具**：在開發者後台右上角的「工具」中，開啟 **「圖形 API 測試工具（Graph API Explorer）」**。
2. **切換應用程式**：在右上角的下拉選單中，將 Facebook 預設應用程式切換為你剛剛建立的 **Threads 應用程式**。
3. **新增測試權限**：在 Permissions 欄位中，加入 `threads_content_publish`、`threads_read_replies` 等 Threads 相關權限。
4. **產生存取權杖**：點擊「產生 Access Token」，完成授權畫面後即可取得一串**短效 Token（有效期約 1 小時）**。
5. **複製 User ID**：在測試工具左側點擊提交，取得你的 `User ID`，請務必記錄下來，後續步驟都會用到。

---

## 第四步：展延取得 60 天長期 Token（Long-Lived Token）

短效 Token 只有 1 小時壽命，對自動化發文來說完全不夠用。我們必須將其轉換為可維持兩個月的長期 Token。

1. **取得應用程式密鑰**：回到 **「應用程式設定」→「基本資料」**，複製 `應用程式編號（App ID）` 與 `應用程式密鑰（App Secret）`（需點擊顯示密碼才看得到）。
2. **呼叫展延 API**：使用以下格式的 GET 請求進行 Token 展延：

   ```text
   GET https://graph.threads.net/access_token
     ?grant_type=th_exchange_token
     &client_id={App ID}
     &client_secret={App Secret}
     &access_token={短效 Token}
   ```

3. **儲存長期金鑰**：成功後你將取得一串全新的長效 Token，**有效期 60 天**。請立即存入 n8n 的憑證管理區或安全的資料庫，不要直接寫在工作流程節點裡。

> **進階提醒**：若要讓 Token 永不過期，可以在每次呼叫 API 時同步呼叫「刷新 Token」端點（`/refresh_access_token`），讓 60 天計時器重置，實現無限期自動化。

---

## 第五步：在 n8n 中實測自動發文與圖片發布

拿到長期 Token 與 User ID 後，終於可以回到 n8n 進行實測！

1. **填入憑證資料**：在 n8n 的 HTTP Request 節點（或 Threads 專用節點）中，將 `長期 Token` 與 `User ID` 填入設定的 Data Table。
2. **測試純文字發文**：
   - 在 n8n 表單輸入測試文字，例如：「n8n Threads 自動發文測試 🚀」
   - 點擊執行，等待約 30 秒（Threads API 有發布延遲機制）
   - 回到 Threads 前台重新整理，確認貼文是否成功上架
3. **測試圖片發布**：
   - 在節點中帶入可公開存取的圖片網址（URL），圖片必須是可直接下載的公開連結
   - 再次點擊執行
   - 確認 Threads 前台圖片與貼文已順利出現

恭喜你！到這裡你已經完整打通 Threads API 的自動化工作流。接下來可以結合 ChatGPT 生成文案、RSS 自動追蹤熱點，打造真正的「無人值守」社群經營系統！

---

## 常見問答 (FAQ)

### Q：測試發文時出現 Permission Denied，該怎麼解決？

**A：** 十之八九是「測試人員邀請未接受」。請開啟 Threads App 或網頁版，進入 **「設定」→「帳號」→「網站權限」**，手動點擊「接受」應用程式邀請，這個步驟完成後 API 權限才正式生效。

---

### Q：為什麼 Threads 自動發文突然失效了？

**A：** 最常見的原因是 **Token 過期**。請確認你使用的是長期 Token（60 天）而非短效 Token（1 小時）。若已是長期 Token，請檢查是否超過 60 天未呼叫刷新端點。建議在 n8n 工作流程中加入定期自動刷新 Token 的邏輯，避免工作流中斷。

---

### Q：圖片發文失敗，錯誤訊息說無法存取圖片網址，怎麼辦？

**A：** Threads API 在處理圖片時，**必須能直接下載該圖片 URL**，不支援需要登入或有 Referer 限制的連結。建議將圖片上傳至 Google Drive（設定公開分享）、Imgur、或自架的靜態儲存空間，再取得直接連結使用。

---

### Q：取得的 User ID 和 Threads 帳號顯示的 ID 不一樣，哪個才是對的？

**A：** 兩者都正確，但用途不同。發文 API 所需的 User ID 是從 Graph API Explorer 取得的**數字格式 ID**，不是 Threads 帳號頁面上的 `@username`。請確保你填入 n8n 的是 Graph API 回傳的那一串數字。

---

### Q：應用程式需要上架審核才能正式使用嗎？

**A：** 只要是對**自己的帳號**發文，開發模式下即可正常運作，不需要送審。若你未來想要讓其他人授權你的應用程式代為發文（例如 SaaS 工具、代客經營服務），才需要向 Meta 申請「上線模式」並通過審核。

---

### Q：發文後想要知道效果怎麼做？有辦法透過 API 讀取互動數據嗎？

**A：** 可以！Threads API 提供了 Insights 端點，可以讀取特定貼文的**觀看數、按讚數、回覆數、轉發數**等指標。在申請權限時加入 `threads_manage_insights`，就能在 n8n 中建立自動化數據回報工作流，定期彙整貼文成效至 Google Sheets 或 Notion。

---

### Q：如果不想從頭設定 API 節點，有現成的 n8n 模板可以用嗎？

**A：** 有！你可以使用「達哥」提供的 n8n Threads 專屬模板（包含付費版與免費版）。匯入後只需將你的 `User ID` 和 `長期 Token` 填入對應的 Data Table 中，即可跳過繁瑣的 HTTP API 參數設定，直接進入測試。

---

### Q：Threads API 有發文頻率限制嗎？發太多會被封鎖嗎？

**A：** 有。Meta 官方規定每個帳號每 24 小時最多可發布 **250 則貼文**（包含回覆）。對於一般社群自動化來說這個上限相當充裕，但如果你打算大量灌文或做壓力測試，要注意這個限制，避免帳號被暫時限流。
