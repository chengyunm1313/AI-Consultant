---
title: 如何打造 Google 表單作業繳交與自動寄信催繳系統？ | (EP.4) n8n 自動化講師應用教學
cover: /images/cover123.png
toc: true
categories:
  - AI自動化
tags:
  - AI自動化
  - n8n
  - 自動化講師應用
description: 每天都在手動核對名單？學習如何運用 n8n 結合 Google 表單與試算表，打造全自動化的作業繳交追蹤系統，從精準判定遲交時間到自動寄信催繳，大幅解放你的行政生產力！
date: 2026-05-04 00:35:05
subtitle:
---

<div class="iframe-wrapper">
  <iframe 
    src="https://www.youtube.com/embed/zHB_TUBG7N8?si=OFOo1EGzkXnBG1Sg" 
    title="如何打造 Google 表單作業繳交與自動寄信催繳系統？ | (EP.4) n8n 自動化講師應用教學" 
    allow="fullscreen">
  </iframe>
</div>

每次批改作業前，你是否還在手動打開試算表，一行一行比對學生名單？這種「人工核對」方式不只費時，更容易出現遺漏。這篇教學，我們將實作一套完整的 n8n 自動化系統，讓表單填交、狀態判斷到催繳通知全程零人工介入。

這套系統的核心概念是：**「資料收集 → 標準化 → 期限比對 → 自動記錄」**。只要學生一送出表單，整個流程就自動啟動，你只需要定期查看試算表即可。接下來，我們拆解 **Flow A：Google Form 提交作業 → 寫入 submissions** 的每一個節點。

---

## 整體流程架構

這個自動化系統由兩個工作流組成：

| 工作流 | 功能 |
| --- | --- |
| **Flow A（本篇）** | Google 表單提交 → 標準化欄位 → 查詢作業設定 → 判斷準時/遲交 → 寫入 submissions |
| **Flow B（下一篇）** | 每日定時觸發 → 比對未交名單 → 自動寄信催繳 |

本篇聚焦在 Flow A，帶你從觸發器開始，逐步建立整個接收與記錄流程。

---

## 步驟一：Google Sheets Trigger — 監聽新提交

許多人會直覺選用「Google Forms Trigger」，但我們這裡刻意改用 **Google Sheets Trigger**，原因在於 Google Form 的回覆會自動同步到「原始回覆」工作表，而 Sheets Trigger 更穩定、也更容易控制觸發時機。

設定方式：

- **Document**：選擇你的試算表
- **Sheet**：選擇「原始回覆」分頁
- **Event**：設為 `Row Added`（有新資料列加入時觸發）

> 每當學生提交 Google 表單，這個 Trigger 就會收到一筆新資料，並自動啟動後續流程。

---

## 步驟二：Set Submission Fields — 標準化欄位名稱

Google 表單的欄位名稱是中文（例如「學號」、「時間戳記」），在跨節點傳遞時容易因編碼問題出錯。這個節點的任務，就是把中文欄位名稱**對應成英文標準欄位**：

| 表單原始欄位 | 標準化後欄位名稱 |
| --- | --- |
| 時間戳記 | `submitted_at` |
| 學號 | `student_id` |
| 姓名 | `student_name` |
| Email | `email` |
| 作業代號 | `assignment_id` |
| 作業檔案 | `file_url` |

另外也固定寫入 `source: "google_form"`，方便未來如果有其他提交來源（如 LINE Bot、API）時，能快速識別資料來源。

---

## 步驟三：Get Assignment — 查詢作業設定

資料標準化後，系統需要知道「這份作業的截止時間是什麼時候？」。這些資訊不寫死在程式碼裡，而是統一存放在 **assignments 工作表**中，讓你隨時調整而不需要修改 workflow。

assignments 工作表的欄位結構建議如下：

| 欄位 | 說明 |
| --- | --- |
| `作業代號` | 與表單選項一致，例如 `homework_0102` |
| `作業名稱` | 作業的顯示名稱 |
| `due_at` | 截止時間，格式為 ISO 8601（例如 `2025-01-15T23:59:00+08:00`） |
| `is_active` | 是否啟用，填 `1` 表示啟用、`0` 表示關閉 |

這個節點以 `assignment_id` 和 `is_active = 1` 作為篩選條件，一次查詢就能取得對應的截止時間與作業名稱。`is_active` 的設計讓你在作業結束後，只需要把值從 `1` 改成 `0`，系統就不會再接受該代號的新提交。

---

## 步驟四：Compute Status — 計算準時 / 遲交狀態

這是整個 Flow A 最關鍵的節點。由於 Google 表單的「時間戳記」格式是台灣慣用的 `2025/1/15 上午 9:30:00`，並非標準的 ISO 格式，JavaScript 原生的 `new Date()` 無法直接解析，因此我們需要自己撰寫解析函式。

以下是這個 Code 節點執行的三件事：

### 1. 解析台灣時間格式

```javascript
function parseTaiwanDateTime(text) {
  const m = String(text).trim().match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(上午|下午)\s+(\d{1,2}):(\d{2}):(\d{2})$/
  );
  if (!m) return null;

  let [, y, mo, d, ap, h, mi, s] = m;
  h = Number(h);

  if (ap === '下午' && h !== 12) h += 12;
  if (ap === '上午' && h === 12) h = 0;

  return { y: Number(y), mo: Number(mo), d: Number(d), h, mi: Number(mi), s: Number(s) };
}
```

這個函式用正規表達式拆解時間字串，並正確處理「上午 12 點 = 午夜」、「下午 12 點 = 中午」這兩個 12 小時制的常見陷阱。

### 2. 比對截止時間，判斷狀態

```javascript
const submittedAtDate = new Date(parts.y, parts.mo - 1, parts.d, parts.h, parts.mi, parts.s);
const dueAtDate = new Date(dueAtText); // due_at 為 ISO 格式，可直接解析

const delayMinutes = Math.max(0, Math.floor((submittedAtDate - dueAtDate) / 60000));

const status = submittedAtDate <= dueAtDate ? 'on_time' : 'late';
```

`delayMinutes` 只有在遲交時才有意義，`Math.max(0, ...)` 確保準時繳交的延遲值不會出現負數。

### 3. 提取 Google Drive 檔案 ID

學生上傳的作業檔案，Google 表單只記錄一個 Drive 分享連結，實際的檔案 ID 藏在 URL 裡。我們用以下邏輯把它抽出來，方便後續流程（例如自動下載或批改）直接取用：

```javascript
function extractDriveFileId(url) {
  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/
  ];
  for (const pattern of patterns) {
    const match = String(url).match(pattern);
    if (match) return match[1];
  }
  return '';
}
```

這個函式相容三種常見的 Google Drive 連結格式，只要是合法的 Drive URL，都能正確提取。

---

## 步驟五：Append to submissions — 寫入資料庫

完成狀態計算後，最後一步是將所有資料追加寫入 **submissions 工作表**，這張表就是你的「繳交記錄資料庫」。

每一筆記錄包含：

| 欄位 | 說明 |
| --- | --- |
| `assignment_id` | 作業代號 |
| `student_id` / `student_name` | 學生學號與姓名 |
| `email` | 聯絡信箱（催繳用） |
| `submitted_at` | 原始台灣時間字串 |
| `submitted_at_iso` | 轉換後的 ISO 格式時間（`+08:00`） |
| `due_at` | 作業截止時間 |
| `status` | `on_time` 或 `late` |
| `delay_minutes` | 遲交分鐘數（準時者為 `0`） |
| `file_url` | 原始分享連結 |
| `drive_file_id` | 抽取出的 Drive 檔案 ID |

有了這張表，Flow B（自動催繳）只需要用 `status = 'late'` 或比對「誰的名字不在 submissions 裡」，就能精準找出需要提醒的人。

---

## 應用延伸

這套流程的設計概念可以輕鬆複用到各種情境：

- **企業培訓**：員工每月繳交學習心得，逾期自動提醒主管
- **合約文件催收**：客戶 onboarding 必備文件，系統自動追蹤回收率
- **跨部門進度回報**：專案每週回報表，自動標記哪些人尚未填寫
- **活動報名核對**：比對報名名單與實際繳費記錄

只要情境符合「收件 → 對照截止時間 → 記錄狀態」的邏輯，這套架構都能直接套用。

---

## 常見問答 (FAQ)

### Q：為什麼用 Google Sheets Trigger，而不是直接用 Google Forms Trigger？

A：Google Sheets Trigger 比 Google Forms Trigger 更穩定，觸發延遲也更低。此外，Google Form 回覆預設就會寫入連動的試算表，因此監聽 Sheets 的「新增列」事件，功能上完全等效，且更容易在試算表直接觀察與除錯資料。

---

### Q：台灣時間的「上午/下午」格式真的不能直接用 new Date() 解析嗎？

A：對，`new Date("2025/1/15 上午 9:30:00")` 在不同 JavaScript 環境下行為不一致，部分環境會回傳 `Invalid Date`。在 n8n 的 Code 節點環境中，含有「上午」、「下午」中文字符的時間字串無法被原生 `Date()` 正確解析，必須自行用正規表達式拆解後再重組為 `Date` 物件。

---

### Q：assignments 表的 is_active 欄位有什麼用？

A：這是一個「開關」設計。當一份作業的截止日已過，你只需要把 `is_active` 從 `1` 改為 `0`，Get Assignment 節點就找不到這筆資料，後續流程會中斷並報錯，避免過期作業繼續被記錄。這讓你不需要修改任何程式碼，純粹靠試算表資料來控制哪些作業「仍在接收中」。

---

### Q：delay_minutes 為什麼要用 Math.max(0, ...) 防止負數？

A：遲交判斷式是 `submittedAt - dueAt`。準時繳交時，這個差值是負數，代表「提早了幾分鐘」。但 `delay_minutes` 欄位的語義是「延遲了多少分鐘」，對準時的同學來說應該是 `0` 而不是負數，`Math.max(0, ...)` 確保寫入資料庫的值語義清晰。

---

### Q：drive_file_id 提取有什麼用途？

A：Google Drive 的分享連結有多種格式（含 `/d/`、`?id=`、`/file/d/` 等），直接儲存 URL 不方便後續程式化操作。提取 `drive_file_id` 後，後續節點可以直接呼叫 Google Drive API，例如：自動將檔案移到指定資料夾、設定閱讀權限、或讓 AI 節點直接讀取文件內容進行自動批改。

---

### Q：如果學生重複提交怎麼辦？系統會判斷成最新一筆嗎？

A：目前 Flow A 的設計是「每筆提交都寫入」，不會自動去重。如果你需要「同一個學生只保留最後一筆」，可以在 Append 節點之前加入一個 Google Sheets 查詢節點，先確認該 `student_id + assignment_id` 是否已有資料，再決定要覆寫還是新增。或者在 submissions 表的後處理（如 Flow B）中，以 `student_id` 分組取最新時間的那筆即可。

---

### Q：這套系統可以只用 Google 試算表和 n8n，不需要其他付費工具嗎？

A：可以，本篇所有流程都只使用 Google Sheets（免費）+ n8n（可自架 Community 版免費使用）。整套系統零額外費用，適合教育機構或預算有限的團隊直接部署。
