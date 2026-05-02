---
title: 如何打造全自動「課前提醒」工作流？告別手動寄信的自動化教學 | (EP.2) n8n 自動化講師應用教學
cover: /images/cover121.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - 自動化講師應用
description: 每次開課前都要手動寄發提醒信嗎？本篇教學將帶你建立全自動的「課前提醒工作流」，結合排程觸發、Google Sheets 狀態檢查與 Email 自動發送，大幅節省行政時間，讓你的開課流程更順暢！
date: 2026-05-03 00:25:12
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/R_iv9Arslpw?si=YHABEkiH31D1GCrs" 
    title="如何打造全自動「課前提醒」工作流？告別手動寄信的自動化教學 | (EP.2) n8n 自動化講師應用教學" 
    allow="fullscreen">
  </iframe>
</div>

## 為什麼你需要自動化「課前提醒」流程？

開課前一天，你還在逐一比對報名名單、複製貼上學員 Email、手動確認哪些人已寄、哪些人還沒寄嗎？

這樣的手動流程不只耗費時間，更容易因疏失而遺漏學員，導致出席率下降。對於同時管理多門課程的講師來說，這更是沉重的行政負擔。

透過 n8n 建立自動化工作流，系統會每天自動執行以下動作：
- 讀取你的 Google Sheets 報名名單
- 篩選出「明天上課」且「尚未收到提醒信」的學員
- 自動寄出客製化提醒信件
- 將發送狀態回寫至試算表，確保不重複發送

從此，課前提醒變成零人工介入的全自動流程。

---

## 工作流架構總覽

在開始設定前，先了解整體流程的設計邏輯，有助於你在遇到問題時快速定位：

```text
排程觸發 → 讀取 Google Sheets → Code 節點篩選 → 發送 Email → 回寫狀態
```

| 節點 | 功能 | 說明 |
| --- | --- | --- |
| Schedule Trigger | 定時啟動 | 每天指定時間自動執行 |
| Google Sheets | 讀取名單 | 取得所有報名學員資料 |
| Code | 條件篩選 | 過濾出需要提醒的對象 |
| Email | 發送信件 | 寄出客製化提醒信 |
| Google Sheets | 回寫狀態 | 標記「已寄送」避免重複 |

---

## Google Sheets 欄位設定建議

在開始建立工作流之前，請確認你的 Google Sheets「正式名單」工作表包含以下欄位：

| 欄位名稱 | 說明 | 範例值 |
| --- | --- | --- |
| `姓名` | 學員姓名 | 王小明 |
| `學號` | 學員學號（作為唯一識別碼） | A001 |
| `信箱` | 學員 Email | `student@example.com` |
| `課程名稱` | 課程名稱 | AI自動化入門班 |
| `上課日期` | 上課日期 | 2026/05/10 |
| `上課方式` | 實體 / 線上 / 混合等 | 線上 |
| `已寄確認信（Yes/No）` | 是否已寄出報名確認信 | Yes |
| `已寄提醒信（Yes/No）` | 是否已寄出課前提醒信 | No |

> **重要：** `上課日期` 欄位請使用 `YYYY/MM/DD` 格式（斜線分隔），Code 節點的篩選邏輯是以此格式進行比對。

---

## 如何快速完成工作流環境部署？

這套自動化流程的設計邏輯非常清晰：**定時觸發 ➔ 讀取名單 ➔ 條件篩選 ➔ 發送信件 ➔ 更新狀態**。以下是具體的節點設定步驟：

### 步驟一：設定排程觸發器 (Schedule Trigger)

工作流的第一步是設定啟動時間。加入 **Schedule Trigger** 節點，建議設定為**每天早上 8 點**自動執行，確保學員在上課前一天有充裕時間收到提醒。

實際工作流中同時保留了 **Manual Trigger**，方便你在測試時用手動方式隨時觸發，無需等待排程時間。

**開發測試建議：**

- 先使用 **Manual Trigger**（點擊「Execute workflow」）手動測試整條流程
- 或將 Schedule Trigger 的頻率暫時改為「每分鐘」，方便即時驗證
- 確認整體流程無誤後，再改回每天一次的排程

### 步驟二：讀取 Google Sheets 名單

加入 **Google Sheets** 節點，選擇「Get Many Rows」操作，一次讀取「正式名單」工作表的所有資料。

設定要點：

- **Spreadsheet**：選擇你的報名表試算表
- **Sheet**：選擇「正式名單」工作表
- 資料全部抓回後，交給後面的 Code 節點篩選——這樣最穩，不容易因試算表結構變動而出錯

### 步驟三：篩選需要提醒的學員 (Code 節點)

這是整個工作流的核心邏輯。加入 **Code** 節點（節點名稱：「篩出明天有課」），貼入以下篩選程式碼：

```javascript
const result = [];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const tYear = tomorrow.getFullYear();
const tMonth = tomorrow.getMonth() + 1;
const tDay = tomorrow.getDate();

for (const item of items) {
  const row = item.json;

  const date = row["上課日期"];
  const confirm = row["已寄確認信（Yes/No）"];
  const reminder = row["已寄提醒信（Yes/No）"];

  if (!date) continue;

  const parts = String(date).trim().split('/');
  if (parts.length !== 3) continue;

  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  if (
    y === tYear &&
    m === tMonth &&
    d === tDay &&
    confirm === "Yes" &&
    reminder !== "Yes"
  ) {
    result.push({
      json: {
        row_number: row["row_number"],
        name: row["姓名"],
        student_id: row["學號"],
        email: row["信箱"],
        course: row["課程名稱"],
        date: row["上課日期"],
        type: row["上課方式"],
        register_time: row["報名時間"]
      }
    });
  }
}

return result;
```

**程式碼說明：**

- 明天日期拆解為年、月、日三個數字，再與試算表的 `YYYY/MM/DD` 格式逐項比對，避免字串比較因格式差異失敗
- **三重條件過濾**：日期符合 **且** 已寄確認信 = `Yes` **且** 尚未寄提醒信
  - 「已寄確認信」的前提很重要——代表學員已完成報名流程，才需要發提醒
- Code 節點同時將中文欄位名稱**重新命名為英文**（`name`、`email`、`student_id`...），讓後續的 Gmail 節點可以用更簡潔的變數名稱取值

### 步驟四：自動發送客製化 Email 提醒信

確認篩選名單後，加入 **Gmail** 節點（使用 Gmail OAuth2 授權）。因為前面的 Code 節點已將欄位重新命名為英文，這裡可以直接使用簡潔的變數名稱：

- **收件人**：`{{ $json.email }}`
- **主旨**：`課前提醒｜{{ $json.course }}`
- **信件內文範例**：

```text
Hi {{ $json.name }}（{{ $json.student_id }}），您好：

提醒您，您報名的課程即將開始。

📘 課程名稱：{{ $json.course }}
📅 上課日期：{{ $json.date }}
📍 上課方式：{{ $json.type }}

請提前確認上課安排，謝謝！
```

> **注意**：Gmail 節點的「Append Attribution」建議關閉（`appendAttribution: false`），避免信件底部出現 n8n 的廣告署名，影響專業形象。

### 步驟五：回寫狀態，杜絕重複發送

這是整個工作流中**最不能遺漏的一環**。信件成功寄出後，必須回到 Google Sheets 將學員的提醒信狀態更新為 `Yes`。

加入第二個 **Google Sheets** 節點，操作選擇「Append or Update Row」：

- **Matching Column（比對欄位）**：`學號`——以學號作為唯一識別，確保更新到正確的列
- **更新欄位**：`已寄提醒信（Yes/No）` 設定為 `Yes`
- 來源資料從 Code 節點取得：`{{ $('篩出明天有課').item.json.student_id }}`

使用「學號」而非「列號」做比對有一個重要優點：即使試算表的排序或列數改變，更新也不會寫入錯誤的列。

> 若沒有這個步驟，下次排程執行時，系統會對同一批學員**再次寄信**，造成學員困擾與信任損失。

---

## 下一步：讓工作流更進階

完成這套課前提醒後，你已省下每次開課前大量的手動作業時間。在下一堂進階課程中，我們將教你如何：

- 在信件中動態帶入**專屬課程連結**與 **Google Meet 視訊網址**
- 加入**課前注意事項附件**，打造更專業的學員體驗
- 建立多課程並行管理的工作流架構，適用於同時開設多門課的講師

---

## 常見問答 (FAQ)

### Q：Google Sheets 欄位名稱和教學不一樣，程式碼需要完整改寫嗎？

A：不需要。只需在 Code 節點中修改對應的欄位名稱即可。例如，若你的日期欄位叫做「課程日期」而非「上課日期」，只需將程式碼中的 `row["上課日期"]` 替換為 `row["課程日期"]`，其餘篩選邏輯完全不變。Google Sheets 回寫節點的 Matching Column 也需要同步修改。建議先在試算表統一欄位命名，後續維護會更輕鬆。

---

### Q：如果想改成「開課前三天」寄送提醒，如何調整？

A：在 Code 節點中，將日期計算的 `+1` 改為 `+3` 即可：

```javascript
// 修改前（明天）
tomorrow.setDate(tomorrow.getDate() + 1);

// 修改後（三天後）
tomorrow.setDate(tomorrow.getDate() + 3);
```

其餘的 Gmail 節點與回寫邏輯完全不需要變動。若你想同時在「三天前」和「一天前」各發一次提醒，建議分別建立兩條獨立的工作流，各自有各自的回寫欄位（如「已寄三日提醒信」和「已寄前日提醒信」），這樣狀態管理最清晰，不容易互相干擾。

---

### Q：測試時不小心寄出太多信怎麼辦？

A：在開發與測試階段，請採取以下保護措施：

1. **修改收件人**：在 Email 節點暫時將收件人從 `{{ $json.Email }}` 改為你自己的測試信箱
2. **停用 Email 節點**：在工作流中右鍵點擊 Email 節點，選擇「Disable」，僅觀察資料流輸出的 JSON 內容
3. **限制資料筆數**：在 Google Sheets 節點設定「Limit」，一次只讀取 1~2 筆資料進行測試

確認篩選條件與回寫狀態（Yes/No）都正確後，再關閉所有限制、改回真實收件人。

---

### Q：為什麼系統會重複寄信給同一位學員？

A：這是最常見的錯誤，通常由以下原因造成：

1. **步驟五的回寫節點未正確執行**：請確認工作流最後有成功更新「已寄提醒信（Yes/No）」欄位。執行後手動打開試算表，確認欄位值是否已改為 `Yes`。
2. **欄位名稱不完全一致**：Code 節點中的 `row["已寄提醒信（Yes/No）"]` 必須與 Google Sheets 的欄位標題**逐字相同**，包含括號與標點符號，差一個字就會讀到 `undefined`，導致條件永遠成立。
3. **Matching Column 設定錯誤**：回寫節點若 Matching Column 設定不正確，更新可能寫入到錯誤的列，讓原始列的狀態維持 `No`。

**除錯建議**：在 Code 節點篩選結果中，暫時加入 `console.log(JSON.stringify(row))` 印出每筆資料的完整欄位名稱，就能快速確認試算表傳回的欄位名稱是否與程式碼一致。

---

### Q：我的課程同時有多個梯次，同一門課有不同上課日期，工作流支援嗎？

A：完全支援，工作流的設計本身就是逐筆比對每位學員的 `ClassDate`，因此同一門課的不同梯次只要在 Google Sheets 中各自有一列記錄，系統就能精準對應每位學員的實際上課日期，不會混淆。若你的報名表裡有多門課程，同樣適用，篩選邏輯只關心「日期」和「狀態」，與課程名稱無關。

---

### Q：工作流使用的是 Gmail 節點，還是一般的 Email 節點？有什麼差別？

A：本工作流使用的是 **Gmail 節點**（搭配 Gmail OAuth2 授權），不是通用的 Email (SMTP) 節點。兩者的差異如下：

| 節點 | 授權方式 | 適合情境 |
| --- | --- | --- |
| **Gmail** | Google OAuth 授權 | 使用 Gmail 帳號發信，設定簡單、顯示名稱友善 |
| **Email (SMTP)** | 填入 SMTP 伺服器設定 | 使用自訂網域信箱（如 `info@yourschool.com`） |

若你已有 Google Workspace 帳號，**Gmail 節點**是最快速的選擇——完成 OAuth 授權後即可使用，無需額外的 SMTP 設定。若你希望以機構網域信箱發信，則改用 SMTP 節點，品牌形象更專業，但需要向你的郵件服務商取得 SMTP 憑證。

---

### Q：如果某位學員的 Email 信箱填寫錯誤，工作流會報錯嗎？

A：當 Email 節點遇到無效信箱（如格式錯誤或不存在的地址），工作流預設會**中斷並報錯**，導致後續學員的信件也無法寄出，狀態也不會被回寫。

**建議解法**：在 Email 節點的「Settings」中開啟「Continue On Fail」選項，讓工作流在遇到單一錯誤時跳過該筆資料，繼續處理下一位學員。同時，可以在後方加入一個通知節點（如 Line Notify 或 Slack），在寄信失敗時主動告警，讓你能即時追蹤並手動補寄。

---

### Q：n8n 自架版（Self-hosted）和 n8n Cloud 的設定方式有差異嗎？

A：工作流的節點邏輯和設定方式**完全相同**，差異主要在環境維護層面：

- **n8n Cloud**：免維護、開箱即用，適合個人講師或小型工作室，但有使用量限制與月費
- **Self-hosted**：需自行部署伺服器（如 Railway、Render 或 VPS），免費且可無限使用，但需負責更新與備份

若你是第一次建立自動化工作流，建議先從 **n8n Cloud 的免費方案**開始體驗，熟悉流程後再考慮自架。
