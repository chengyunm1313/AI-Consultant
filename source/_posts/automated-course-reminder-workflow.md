---
title: 如何建立自動化課程提醒系統？串接 Google Sheets 與自動寄信流程教學 | (EP.3) n8n 自動化講師應用教學
cover: /images/cover122.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - 自動化講師應用
description: 想升級你的課程提醒系統嗎？本教學帶你了解如何透過 n8n 串接 Google Sheets 與 Gmail，實現跨工作表資料合併、自動篩選提醒對象、動態帶入教材連結與 Google Meet，並寫回狀態防止重複寄信，大幅提升行政效率！
date: 2026-05-03 00:44:19
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/-_ELSqJSeJM?si=CgaxPxvHaTwS65IY" 
    title="如何建立自動化課程提醒系統？串接 Google Sheets 與自動寄信流程教學 | (EP.3) n8n 自動化講師應用教學" 
    allow="fullscreen">
  </iframe>
</div>

## 為什麼需要升級你的課程提醒系統？

在上一堂課中，我們完成了基礎的課程確認信機制。今天這一集要往上一層，打造「**課前提醒信**」的升級版流程。

升級的核心差異在於：**這次要跨兩張工作表整合資料**。

- **正式名單**：記錄學員姓名、學號、信箱、上課日期、寄信狀態
- **課程主表**：記錄各課程的教材連結、Google Meet 連結、注意事項

光靠正式名單無法完成完整的提醒信，必須同時讀取課程主表，動態帶入課程資訊後才能寄出。這樣設計的好處是：只要更新課程主表，所有學員收到的資訊就自動跟著更新，不需要逐一手動調整。

---

## 完整工作流架構（6 個節點）

```text
Schedule Trigger
    ↓
Get row(s) in 課程主表
    ↓
Get row(s) in 正式名單
    ↓
篩出明天有課並合併課程主表（Code 節點）
    ↓
Send a message（Gmail 節點）
    ↓
Append or update row in sheet（回寫狀態）
```

---

## 節點詳解

### 節點 1｜Schedule Trigger — 定時觸發

設定每天固定時間自動執行整條流程。測試階段可先設為「每分鐘」，正式上線後改成每天早上 08:00，讓提醒信固定在前一天早上寄出。

> 💡 **重點**：排程觸發並不代表一定會寄信。後面的 Code 節點會做篩選，若當天沒有符合條件的學員，整條流程會安靜地結束，不做任何動作。

---

### 節點 2｜Get row(s) in 課程主表 — 讀取課程資訊

從 Google Sheets 的「**課程主表**」工作表讀取所有課程資料，包含：

| 欄位 | 說明 |
| ------ | ------ |
| 課程名稱 | 用來做跨表比對的 key |
| 上課日期 | 輔助比對，確認課程場次 |
| 上課方式 | 線上 / 實體，輔助比對 |
| 教材連結 | 帶入提醒信 |
| Google meeting 連結 | 帶入提醒信 |
| 注意事項 | 帶入提醒信 |

這個節點**先執行**，讓後面的 Code 節點可以引用課程主表的資料做合併。

---

### 節點 3｜Get row(s) in 正式名單 — 讀取學員名單

從「**正式名單**」工作表讀取所有學員資料。關鍵欄位：

| 欄位 | 說明 |
| ------ | ------ |
| 姓名 / 學號 / 信箱 | 學員基本資料 |
| 課程名稱 / 上課日期 / 上課方式 | 用來對應課程主表 |
| 已寄確認信（Yes/No） | 篩選條件之一 |
| 已寄提醒信（Yes/No） | 篩選條件之一（防重複寄信的關鍵） |

> ⚠️ 此節點開啟 **Execute Once** 模式，確保不論上一節點輸出幾筆課程資料，名單只會被讀取一次。

---

### 節點 4｜Code 節點 — 篩選與合併（核心邏輯）

這是整條流程最重要的節點。它做兩件事：

1. **篩選**：從正式名單中找出「明天上課 + 已寄確認信 + 尚未寄提醒信」的學員
2. **合併**：依課程名稱、日期、上課方式對應課程主表，帶入教材連結、會議連結與注意事項

```javascript
const result = [];

// 取得課程主表所有資料
const courseRows = $("Get row(s) in 課程主表").all().map(item => item.json);

// 計算明天的年月日
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tYear = tomorrow.getFullYear();
const tMonth = tomorrow.getMonth() + 1;
const tDay = tomorrow.getDate();

for (const item of items) {
  const row = item.json;

  const date = row["上課日期"];      // 格式：YYYY/M/D
  const confirm = row["已寄確認信（Yes/No）"];
  const reminder = row["已寄提醒信（Yes/No）"];

  if (!date) continue;

  // 解析日期字串
  const parts = String(date).trim().split('/');
  if (parts.length !== 3) continue;

  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  // 三個篩選條件：明天上課 + 已寄確認信 + 尚未寄提醒信
  if (
    y === tYear && m === tMonth && d === tDay &&
    confirm === "Yes" &&
    reminder !== "Yes"
  ) {
    // 從課程主表找出對應課程（以課程名稱為主，日期與方式為輔）
    const matchedCourse = courseRows.find(course => {
      const sameName = String(course["課程名稱"] || "").trim() === String(row["課程名稱"] || "").trim();
      const sameDate = !course["上課日期"] || String(course["上課日期"]).trim() === String(row["上課日期"] || "").trim();
      const sameType = !course["上課方式"] || String(course["上課方式"]).trim() === String(row["上課方式"] || "").trim();
      return sameName && sameDate && sameType;
    }) || {};

    result.push({
      json: {
        row_number: row["row_number"],
        name: row["姓名"],
        student_id: row["學號"],
        email: row["信箱"],
        course: row["課程名稱"],
        date: row["上課日期"],
        type: row["上課方式"],
        register_time: row["報名時間"],
        material_url: matchedCourse["教材連結"] || "",
        meeting_url: matchedCourse["Google meeting 連結"] || "",
        note: matchedCourse["注意事項"] || ""
      }
    });
  }
}

return result;
```

> 💡 **關鍵設計**：`reminder !== "Yes"` 而非 `=== "No"`，是為了相容欄位空白的初始狀態，不需要預先手動填入 No。

---

### 節點 5｜Send a message — 寄送 Gmail 提醒信

使用 Gmail 節點寄送個人化課前提醒信，以動態變數帶入所有學員與課程資訊：

**信件主旨**：

```text
課前提醒｜{{ $json.course }}（明天上課）
```

**信件內文**：

```text
Hi {{ $json.name }}（{{ $json.student_id }}），您好：

提醒您，您報名的課程將於明天開始。

📘 課程名稱：{{ $json.course }}
📅 上課日期：{{ $json.date }}
📍 上課方式：{{ $json.type }}

📚 教材連結：
{{ $json.material_url }}

💻 Google meeting 連結：
{{ $json.meeting_url }}

📝 注意事項：
{{ $json.note }}

請提前確認上課安排，謝謝！
```

每一位符合條件的學員都會收到專屬的個人化信件，課程資訊直接來自課程主表，不需要人工填寫。

---

### 節點 6｜Append or update row — 回寫寄信狀態

信件成功寄出後，立刻回寫正式名單：

| 欄位                 | 寫入值 |
| -------------------- | ------ |
| 已寄確認信（Yes/No） | YES    |
| 已寄提醒信（Yes/No） | YES    |

使用**學號**作為 matching key，精準對應每一位學員的那一行，不會誤改到其他人的資料。

這是防止重複寄信的最後防線：下次排程觸發時，這筆學員的 `已寄提醒信` 已經是 `YES`，Code 節點的篩選條件 `reminder !== "Yes"` 就不會再把他納入，信件不會重複寄出。

---

## 節點式設計觀念：切入 AI Agent 前的必修課

### 養成加 Sticky Note 的習慣

工作流每個節點旁都應該加上「Sticky Note 說明卡」，清楚標明這個節點的作用、篩選條件與注意事項。工作流越長越複雜，這個習慣越重要。六個月後回來看自己的流程，不需要重新推理就能立刻讀懂。

### 先搞懂資料流，再用 AI Agent

AI Agent 非常擅長處理彈性指令，但它並不擅長「精確控制資料欄位的讀取與寫入」。如果你還不清楚「這個節點的 input 長什麼樣、output 輸出什麼欄位」，直接交給 AI Agent 很容易產生幻覺或資料串接錯誤，而且你不知道問題在哪裡。

**節點式自動化是 AI Agent 的基礎**。搞懂每個節點的輸入輸出、資料結構與篩選邏輯之後，你在指揮 AI Agent 時才能給出精確指令，真正發揮自動化的價值。

---

## 常見問答 (FAQ)

### Q：為什麼篩選條件用 `reminder !== "Yes"` 而不是 `=== "No"`？

A：因為新學員剛登錄到正式名單時，「已寄提醒信」欄位通常是**空白**，而不是填了 `No`。如果用 `=== "No"` 篩選，空白欄位的學員就會被漏掉，永遠收不到提醒信。改用 `!== "Yes"` 可以同時涵蓋「空白」與「No」這兩種初始狀態，新學員不需要預先手動填任何值，流程就能正確運作。

---

### Q：日期格式不對會怎樣？流程會報錯嗎？

A：Code 節點已做防護處理：若 `split('/')` 切割後不是三段，就直接 `continue` 跳過該筆資料，不會讓整條流程中斷。但學員仍然不會收到信，因此務必統一正式名單的日期格式為 **YYYY/M/D**（例如 `2026/5/10`）。可以在 Google Sheets 設定欄位格式或加入資料驗證，從來源端防止格式錯誤。

---

### Q：課程主表找不到對應的課程時，信件會少哪些資訊？

A：Code 節點在找不到對應課程時，`matchedCourse` 會是空物件 `{}`，`material_url`、`meeting_url`、`note` 都會變成空字串 `""`。信件仍然會寄出，但這三個欄位會是空白。建議在寄信後檢查一下是否有空白連結，可以在 Code 節點加一行 `console.log` 印出未匹配的課程名稱，方便追查是哪裡打錯字或格式不一致。

---

### Q：已寄確認信還不是 Yes 的學員，為什麼不寄提醒信給他們？

A：這是刻意設計的業務邏輯：**確認信代表這位學員的報名資料已被人工審核過**。如果一位學員還沒收到確認信，表示他的資料可能還在審核中，貿然寄出提醒信可能會造成混亂（例如報名失敗的學員收到提醒）。流程設計的順序是：確認信（審核通過）→ 提醒信（課前一天）。

---

### Q：如果同一位學員報名了多門課，會正確對應到每門課的教材嗎？

A：會。課程主表的比對邏輯是「課程名稱 + 上課日期 + 上課方式」三欄都相符才算匹配。只要正式名單每一行對應一筆報名記錄（一行 = 一位學員 + 一門課），就能各自找到對應的課程主表資料，不會混用。

---

### Q：Google Sheets 回寫時，為什麼要用「學號」當 matching key，而不是行號？

A：行號（row_number）在 Google Sheets 中不是穩定的識別碼。只要有人新增或刪除其他行，同一位學員的行號就會改變，回寫時就會寫到錯誤的行。「學號」是每位學員唯一且不變的識別碼，能確保 `appendOrUpdate` 精準更新到正確那一行，是更安全的設計。

---

### Q：我想加入「上課前兩天」也寄一次提醒，該怎麼做？

A：有兩種做法：

1. **加一個新欄位**：在正式名單新增「已寄兩天前提醒信（Yes/No）」欄位，複製一套相同的流程，把 `tomorrow.setDate(tomorrow.getDate() + 1)` 改為 `+ 2`，並把篩選與回寫條件改為對應新欄位。
2. **用排程 + 天數變數**：讓 Code 節點讀取一個「提前天數」變數，由外部控制要篩選幾天後的名單，一套流程就能同時處理不同時間點的提醒。

對初學者來說，做法一比較直覺，不容易出錯。

---

### Q：排程一直跑，但完全沒有寄出任何信，怎麼除錯？

A：按以下順序逐步檢查：

1. **Code 節點輸出**：手動執行流程，查看 Code 節點輸出了幾筆資料。如果是 0 筆，表示篩選條件沒有命中任何學員。
2. **確認日期格式**：正式名單的上課日期是否真的是 `YYYY/M/D` 格式？有沒有多餘空格或全形斜線？
3. **確認狀態欄位**：`已寄確認信` 是否已填 `Yes`（注意大小寫）？`已寄提醒信` 是否是空白或 `No`？
4. **確認明天日期**：把 Code 節點加一行 `console.log(tYear, tMonth, tDay)` 確認系統時區計算是否正確（n8n 的時區設定可能與你的本地時區不同）。
5. **課程主表對應**：確認課程主表中的課程名稱和正式名單完全一致，包括空格與標點符號。
