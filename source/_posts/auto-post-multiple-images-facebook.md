---
title: 使用 Facebook Graph API 自動發布多圖貼文 | (EP10) n8n 自動化 API 串接教學
cover: /images/cover113.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - 社群行銷
description: 想用 n8n 串接 Facebook Graph API 自動發布多圖貼文？本文整理多檔上傳、POST /photos、attached_media 組裝與 FAQ，帶你把單圖流程改成穩定可用的多圖發文工作流。
date: 2026-04-04 00:27:30
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/83zMcRBi6gQ?si=1xDyadJLy9BFz3BD" 
    title="使用 Facebook Graph API 自動發布多圖貼文" 
    allow="fullscreen">
  </iframe>
</div>

如果你正在找「**n8n Facebook 多圖貼文教學**」、「**Facebook attached_media 怎麼設定**」或「**n8n 如何一次發布多張圖片到 Facebook**」，這篇就是針對這些問題整理的實戰版本。

先前我們分享過如何透過 n8n 模板自動發布「單圖加單文」到 Facebook。今天這篇文章，我們將進一步把流程升級成**一次發布多張圖片的 Facebook 貼文**，並直接拆解多數人最常卡住的 `attached_media`、`/photos` 與 binary 判斷問題。

如果你還沒完成 **Page ID**、**長期 Page Access Token** 或單圖發文設定，建議先閱讀上一篇：[n8n 串接 Facebook 自動發文教學：Meta API、Page ID、長期 Token 完整指南](/posts/how-to-automate-facebook-posts-with-n8n/)。

這篇文章可以把它理解成上一篇的進階版：前一篇解決「先發得出去」，這一篇解決「如何穩定改成多圖發文」。

## 如何在 n8n 表單中開啟多檔案上傳功能？

在原本的預設模板中，表單 (Form) 節點僅支援單張圖片與一篇文章。若要實現多圖上傳，我們必須先從觸發器 (Trigger) 著手修改。

請進入 n8n 的 Form Trigger 節點，找到設定並勾選 **`Multiple Files`** 功能。開啟此選項後，表單就能一次接收多張圖片的輸入。為了確認功能正常運作，建議先進行測試，例如輸入標題「test 0403 多圖」並同時上傳三張圖片，藉此確認資料是否成功進入後續的工作流中。

## 破解 API 迷思：為什麼 Facebook Graph API 其實不吃 JSON？

這是在串接 Facebook Graph API 時最容易踩到的坑！許多人在查閱 Meta 官方文件時，會看到官方範例給的都是 JSON 格式。然而，當你實際在 n8n 中將 Content-Type 設為 JSON 時，常常會遇到發文失敗或行為異常的狀況。

經過測試與 AI 的輔助分析，我們得出了一個重要結論：
**Facebook Graph API 預設其實是接收 `url-encoded` 與 `form-data` 格式，而非 JSON。**

在 n8n 的 HTTP Request 節點中，最佳的實踐方式是：
1. **主體內容 (Body)：** 使用 `form-urlencoded` 模式，將 Token、Message 與整理好的 `attached_media` 傳送出去，這樣不僅容易發送，穩定度也最高。
2. **圖片上傳 (Photo Upload)：** 使用 `form-data` 的方式來傳送二進位 (Binary) 的圖片檔案。

請果斷放棄使用 JSON 格式來修改多圖貼文，直接採用 `form-urlencoded` 與 `form-data`，能幫你省下大量的除錯時間。

## 實戰解析：多圖貼文真正要改的是什麼？

很多人第一次改 Facebook 多圖貼文時，會以為只要把 `attached_media[0]` 改成 `attached_media[1]`、`attached_media[2]` 就好。實際上不是這樣。

**多圖貼文的核心不是「多加幾個欄位」，而是整個流程要改成先上傳圖片、再集中發文。**

正確流程如下：
1. 表單允許一次上傳多個檔案
2. 把每張圖拆成獨立 item
3. 每張圖各自呼叫 `POST /photos`，並設定為未發佈
4. 收集每張圖回傳的 `photo id`
5. 最後只呼叫一次 `POST /feed`，把所有 `media_fbid` 一起送進 `attached_media`

換句話說，你不是直接把多張圖片塞進同一次照片上傳請求，而是先把每張圖變成 temporary photo，最後再用一篇貼文把它們組起來。

## 最短版修改清單

如果你手上已經有上一篇的單圖工作流，要改成多圖版，實務上先完成這 5 件事就夠了：

1. `Form Trigger` 把 `Multiple Files` 改成 `true`
2. 原本的「如果圖片不存在」條件，改成檢查 `Object.keys($binary ?? {}).length === 0`
3. 新增一個 `Code` 節點，把多張圖片展開成多個 item
4. 新增一個 `Code` 節點，把所有 `photo id` 整理成 `attached_media`
5. 最後發文的節點，把 `attached_media[0]` 改成整個 `attached_media` 陣列

如果你是用既有模板直接改，這 5 項通常就是變更範圍的 80%。剩下的問題，多半都是權限、Graph API 版本，或請求格式設定錯誤。

## 多圖上傳的資料處理與判斷邏輯

### 1. 先展開圖片，再逐張上傳
表單收到多張圖片後，n8n 內部通常不會直接變成多筆獨立資料，而是先包在同一個輸入裡。這時要先新增一個節點，把圖片展開成一張圖一個 item，後面的 Facebook 上傳節點才能逐張處理。

這一步的重點不是「看起來有三張圖」，而是**流程裡真的要變成三個可迭代的 item**。只有這樣，後面的 `POST /photos` 才能對每張圖各自拿到一個 `photo id`。

### 2. 每張圖都先走 `POST /photos`
Facebook 多圖貼文不是直接把多張 binary 一次送到 `/feed`。正確做法是每張圖先打一次 `/{page_id}/photos`，並設定為不立即發佈，讓 Facebook 先建立暫存照片。

等每張圖都成功回傳 ID 之後，才進到最後一個發文節點。這也是很多人一直測不通的原因，因為他們跳過了「先建立 temporary photo」這一步。

### 3. 最後一次把所有 `media_fbid` 組回 `attached_media`
當你拿到多張圖的 `photo id` 後，接下來不是再一張一張發貼文，而是把所有 ID 整理成 Facebook 要的格式，例如：

```json
[
  { "media_fbid": "photo_id_1" },
  { "media_fbid": "photo_id_2" },
  { "media_fbid": "photo_id_3" }
]
```

最後只呼叫一次 `POST /feed`，並把整包 `attached_media` 傳出去，這樣 Facebook 才會把它視為同一篇多圖貼文。

### 4. 「是否有圖片」的判斷邏輯也要一起改
單圖流程常見的寫法，通常是假設只有一個固定欄位，例如 `binary.data` 或某個指定圖片名稱。但多圖流程下，這種判斷很容易失準，因為二進位檔案不再只有單一鍵值。

比較穩的做法，是直接檢查目前是否真的存在任何 binary 檔案：

```javascript
if (Object.keys($binary ?? {}).length === 0) {
    // 沒有圖片，走純文字貼文流程
} else {
    // 有圖片，走圖片上傳與多圖發文流程
}
```

這段寫法的好處是，不需要綁死某個圖片欄位名稱，對單張圖、多張圖、甚至沒有圖片的情境都比較穩。

## 可直接參考的 Code Node 範例

如果你想更快落地，下面這兩段可以作為 `Code` 節點的參考起點。實際欄位名稱還是要依你的工作流資料結構微調，但核心思路就是這樣。

### 範例 1：展開多張圖片
這個節點的目的是把同一筆輸入裡的多張 binary 圖片，拆成多個 item，讓後面的 `POST /photos` 可以逐張執行。

```javascript
const binaryEntries = Object.entries($binary ?? {});

return binaryEntries.map(([key, file]) => {
  return {
    json: {
      ...$json,
      binaryKey: key,
      fileName: file.fileName ?? key,
    },
    binary: {
      [key]: file,
    },
  };
});
```

這段的重點是：
1. 先用 `Object.entries($binary ?? {})` 取出所有圖片
2. 每張圖各自回傳成一個 item
3. 保留原本的 `$json`，避免後面發文文案或其他欄位不見

### 範例 2：整理成 `attached_media`
當每張圖片都上傳到 `POST /photos` 後，Facebook 會回傳各自的 `id`。接下來就要把這些 `id` 整理成最後發文節點要吃的格式。

```javascript
const attached_media = $input.all().map((item) => {
  return {
    media_fbid: item.json.id,
  };
});

return [
  {
    json: {
      attached_media,
    },
  },
];
```

如果你的最後一個發文節點還需要貼文文字、Page ID 或其他欄位，就記得在這裡一起帶回去，不要只剩 `attached_media`。

### 最後發文節點要注意什麼？
整理完之後，最後一個 `POST /feed` 節點要送的，不再是單一的 `attached_media[0]`，而是整包 `attached_media`。也就是說，這一步的重點不只是欄位名稱改掉，而是**前面的資料形狀已經從單張圖邏輯，變成多張圖陣列邏輯**。

## 跨平台自動發文的策略與考量

在學會了 Facebook 多圖發文後，你可能會想：「我能不能把這個多圖工作流直接套用到 Instagram、Threads、X (Twitter) 或 LinkedIn 上？」

這裡要特別提醒，**每個社群平台的 API 設計與支援度皆不相同**。Facebook 接受的 `attached_media` 多圖陣列格式，放到其他平台可能會導致報錯。如果你追求的是「一鍵同時發布到所有平台」，那麼維持**「一圖一文」**會是最安全、兼容性最高的方式。

然而，如果你是為了深入學習 API 串接與自動化邏輯，強烈建議你親手實作一次專屬於 Facebook 的多圖發文流程。這能幫助你透徹理解 API 格式的差異、陣列資料的轉換，大幅提升你的 n8n 實戰能力！

## 常見問答 (FAQ)

### Q：多圖貼文是不是只要多加幾個 `attached_media[1]`、`attached_media[2]` 就可以？
A：不行。這是最常見的誤解。Facebook 多圖貼文的重點不是多塞幾個欄位，而是要先讓每張圖各自上傳成未發佈照片，再把所有 `photo id` 組成 `attached_media` 後一次送進 `POST /feed`。如果你只是在原本單圖節點上多加幾個欄位，通常流程會不穩，或根本不會被 Facebook 正確識別成同一篇多圖貼文。

### Q：在 n8n 裡，正確的多圖發文順序是什麼？
A：最穩的順序是這樣：
1. 表單開啟多檔上傳
2. 將多張圖展開成多個 item
3. 每張圖各自呼叫 `POST /photos`
4. 收集所有回傳的 `photo id`
5. 最後呼叫一次 `POST /feed`，把所有 `media_fbid` 傳進 `attached_media`

如果你的流程不是這個順序，通常就是之後會卡住的地方。

### Q：為什麼我照著官方文件用 JSON 傳多圖，還是一直失敗？
A：因為官方文件的範例格式，不代表在 n8n 裡就是最穩的做法。實務上，Facebook Graph API 在這類發文情境下，通常用 `application/x-www-form-urlencoded` 與 `multipart/form-data` 會更穩。簡單說：
- 圖片上傳用 `form-data`
- 最後發文用 `form-urlencoded`

如果你整段流程都硬用 JSON，常見結果就是欄位格式對了，但請求仍然失敗，或 Facebook 不照你預期解析。

### Q：為什麼「是否有圖片」這個判斷在多圖版容易壞掉？
A：因為單圖流程通常只檢查某一個固定欄位，例如 `binary.data`。但多圖上傳時，binary 的結構不一定只會有單一鍵值，所以原本那種寫死欄位名稱的判斷方式常常會失準。比較穩的寫法是：

```javascript
Object.keys($binary ?? {}).length === 0
```

這樣你判斷的是「現在到底有沒有任何圖片檔」，而不是賭某個欄位名稱剛好存在。

### Q：表單已經開了 `Multiple Files`，為什麼還是不能直接發多圖？
A：因為 `Multiple Files` 只解決「前端可以一次上傳多張圖」，沒有幫你完成後面的資料整理。你還是得自己把圖片展開、逐張上傳、收集 ID、再整理成 `attached_media`。也就是說，表單只是入口，多圖貼文能不能成功，關鍵仍然在後面的工作流設計。

### Q：多圖流程測試時，最少要驗證哪些情境？
A：至少要測這 3 種：
1. 沒有圖片，只發純文字
2. 只有 1 張圖片
3. 一次上傳多張圖片

如果這三種都能正常執行，代表你的條件分流、binary 判斷、圖片上傳與最後發文邏輯大致是穩的。只測「三張圖剛好成功一次」其實不夠，因為很多錯誤都發生在無圖或單圖情境切換時。

### Q：如果我要沿用上一篇單圖模板，最少要改哪些地方？
A：最小修改範圍就是本文前面那 5 項：
1. `Form Trigger` 開啟 `Multiple Files`
2. 調整「是否有圖片」判斷
3. 新增圖片展開節點
4. 新增 `attached_media` 整理節點
5. 把最後發文欄位從單一 `attached_media[0]` 改成整個 `attached_media`

你可以把它理解成：前面多了一段「圖片預處理」，最後一段則從「單圖發文」改成「多圖組裝後發文」。

### Q：如果發文節點一直報權限錯誤，是多圖流程寫錯了嗎？
A：不一定。多圖流程錯誤與權限錯誤是兩件事。如果你看到的是 OAuth、permission、scope 相關訊息，通常先檢查的不是 `attached_media`，而是：
1. 你現在用的是不是正確的 Page Token
2. 權限是否包含 `pages_manage_posts`
3. Page ID 是否對應到同一個粉專

這類問題比較接近授權設定，而不是多圖組裝本身。需要的話可以回頭對照上一篇的 Token 教學一起排查。

### Q：這篇流程可以直接套到 Instagram 或其他平台嗎？
A：不建議直接照搬。這篇的重點是 Facebook Page 的多圖貼文流程，而 `attached_media` 這種組法本身就帶有平台特性。若你是做跨平台自動發文，最穩的策略通常還是先維持「一圖一文」，再依各平台 API 能力逐一擴充，而不是假設 Facebook 的多圖格式能通用。

## 參考資料

- [Meta Developers：Page Posts](https://developers.facebook.com/docs/pages-api/posts/)
- [上一篇：n8n 串接 Facebook 自動發文教學](/posts/how-to-automate-facebook-posts-with-n8n/)
