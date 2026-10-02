---
title: 我現在做 Vibe Coding，不會只靠 Playwright 驗收了：SuperDesign × DESIGN.md × Codex Browser
cover: /images/cover202.png
toc: true
categories:
  - Vibe Coding
tags:
  - Vibe Coding
  - AI工具
  - Playwright
date: 2026-10-02 23:32:05
subtitle: 把設計探索、視覺規格、動態驗收與回歸測試接成一條可重複流程。
description: AI 產出的網站即使 build、lint 與測試全過，畫面仍可能失衡。本文整理 SuperDesign、DESIGN.md、Codex Browser 與 Playwright 的分工，帶你建立從設計探索、規格落地到 UI 檢查與核心流程回歸的 Vibe Coding 驗收工作流。
---

最近我一直在整理自己的 Vibe Coding 工作流。

以前的想法很單純：AI 寫完網站後，用 Playwright 跑一次；網站能開、按鈕能點、測試有過，大概就可以交差。

但最近接連研究 SuperDesign、Google 的 `DESIGN.md`，再加上 Codex 的 Browser use，我開始重新思考：**AI 寫完網站之後，應該怎麼驗收？**

程式正確，不等於畫面正確。Build、TypeScript 與單元測試可以都通過，但它們不一定會告訴你手機版 CTA 是否被擋住、卡片間距是否一致，或頁面有沒有符合原本的視覺語言。

我現在會把流程拆成不同角色：

```text
SuperDesign → DESIGN.md → Codex 實作 → Codex Browser 動態驗收 → Playwright 核心回歸 → Deploy
```

這些工具不是互相取代，而是各自處理設計探索、規格、實作、人工判斷與重複測試。

## 為什麼只跑 Playwright，還不算完成 UI 驗收？

Playwright 很適合確認固定流程能不能一再成功。例如使用者能不能登入、完成預約、修改資料，或走完結帳。這些條件可以明確寫成測試，也能放進每次 Pull Request 或部署流程裡。

但「按鈕是不是歪了」「手機版有沒有溢出」「畫面看起來是否符合品牌」通常需要結合上下文判斷。程式可以編譯成功，功能測試也可能通過，視覺層仍然不理想。

Playwright 也支援 Visual Comparison，可以用 `toHaveScreenshot()` 建立基準畫面並在後續執行時比對。這很適合穩定、重要而且值得守住的畫面；不代表每一個頁面、每一個 hover 狀態都要做成快照測試。快照基準仍需人工檢視與更新，而且不同作業系統、瀏覽器版本與字型可能造成差異。[Playwright 官方文件](https://playwright.dev/docs/test-snapshots)

所以我不會把 Playwright 全砍掉，而是讓它專注在可以明確定義、必須重複通過的 Regression Test。

## 讓 SuperDesign、DESIGN.md、Codex 與 Playwright 各自負責一段

| 工具 | 在流程中的工作 | 適合處理的問題 |
| --- | --- | --- |
| SuperDesign | 探索與比較設計方向 | 新頁面要採取什麼視覺方向？哪些設計變體值得比較？ |
| `DESIGN.md` | 記錄可重用的設計規格 | 顏色、字體、間距、元件與品牌原則要怎麼維持一致？ |
| Codex | 依規格實作並修正程式 | 如何把選定的設計方向落進現有程式碼？ |
| Codex Browser | 動態檢查實際畫面與互動 | RWD、流程、Console 或 Network 是否有可見問題？ |
| Playwright | 自動守住關鍵 Regression | 登入、預約、Checkout 或 CRUD 是否持續正常？ |

### SuperDesign：先探索方向，再開始寫 UI

以前我可能會直接跟 Coding Agent 說：「幫我把這個 Dashboard 做漂亮一點。」但「漂亮」的判斷太開放，Agent 可能直接選一套通用風格開始寫，最後很難確認它是否理解我的方向。

SuperDesign 可以放在實作前，協助分析既有介面、整理設計系統，並探索或比較不同的 UI 設計草稿。先看過幾個方向、選定適合的方案，再交給 Coding Agent 實作，會比要求它憑一句形容詞猜設計更容易對齊。[SuperDesign Skill 官方專案](https://github.com/superdesigndev/superdesign-skill)

我會把這一步理解成「負責想」：先決定要往哪個方向走，不急著把第一個生成結果當成定案。

### `DESIGN.md`：把視覺共識寫成可讀規格

SuperDesign 解決的是「設計方向可以長怎樣？」；`DESIGN.md` 則可以接著回答「選定的設計規格是什麼？」

它以 Markdown 搭配結構化資料描述視覺識別與設計系統，例如色彩、字體、間距、圓角與元件。專案中的人和 Coding Agent 都可以查閱，也能透過工具檢查格式、比較版本，或匯出 Design Token。

不過，規格檔不會自動成為 Single Source of Truth。工作流程需要明確要求 Agent 先讀取它，也要維護規格與程式碼的一致。撰寫本文時，Google Labs Code 的官方專案仍把 `DESIGN.md` 格式標為 alpha，規格與 CLI 都還在發展中；實際支援內容可能改變。[Google Labs Code：DESIGN.md](https://github.com/google-labs-code/design.md)

### Codex Browser：讓 Agent 實際打開頁面檢查

以前常見的迴圈是：Playwright 失敗、Agent 看 Log、猜測原因，再修改程式。現在 Codex 也可以使用 Browser 打開頁面、操作互動，並在實際畫面中發現 UI 問題。

Codex Browser 適合做偏動態的檢查：桌機和手機版版面是否合理、文字或圖片有沒有被切掉、表單能不能完成、導覽順不順。若啟用 Browser Developer Mode 的完整 CDP 存取，還能檢查 Console、Network、頁面狀態與 JavaScript 效能。這項存取要由使用者在桌面 App 設定中開啟，使用完整 CDP 檢查網站前也會要求明確核准；不能假設它預設就能讀取所有瀏覽器內部狀態。[OpenAI：Browser Developer Mode](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)

我會把 Browser 想成「會實際操作網站的動態驗收員」。它可以幫忙看出問題、定位問題，再配合修改與重新載入，確認修正有沒有生效。

### Playwright：把最重要、可重複的流程留下來

以預約 SaaS 為例，我會優先保留這些不能壞的流程：

1. 登入
2. 查詢可預約時段
3. 建立預約
4. 修改預約
5. 取消預約
6. 後台看得到這筆預約

這些流程有明確成功條件，適合交給自動化測試。相較之下，卡片 padding、手機排版、文字是否被裁切等視覺問題，通常更適合在每次實作後用 Browser 實際檢視。

```ts
test('使用者可以完成預約', async ({ page }) => {
  await page.goto('/booking');
  await page.getByLabel('姓名').fill('測試使用者');
  await page.getByRole('button', { name: '下一步' }).click();
  await expect(page.getByText('選擇預約時間')).toBeVisible();
});
```

我的個人做法是把大部分一次性的 UI 檢視交給 Browser，再把真正不能壞的使用者旅程留給 Playwright。文中提到的「80% 動態驗收、20% 自動回歸」只是我用來說明分工的個人粗略比例，不是研究數據或通用標準。

## 我會怎麼安排 Vibe Coding 的 UI 驗收流程？

```text
SuperDesign
    ↓ 探索並選定設計方向
DESIGN.md
    ↓ 明確定義色彩、字體、間距與元件原則
Codex
    ↓ 依規格實作網站
Codex Browser ─── Playwright
    ↓ 動態檢查       ↓ 核心 Regression
修正 UX／RWD       守住固定流程
    └───────┬───────┘
            ↓
           Deploy
```

這個流程把每個階段要回答的問題拆清楚：

- **SuperDesign：** 要探索哪些設計方向？最後選哪一個？
- **`DESIGN.md`：** 顏色、字體、間距和元件原則如何描述？
- **Codex：** 如何把選定的方向與規格實作進程式碼？
- **Codex Browser：** 頁面實際打開後看起來如何、互動有沒有問題？
- **Playwright：** 哪些不能靠目測、每次改版都必須重新通過？

### 可以直接交給 Coding Agent 的 Browser 驗收要求

完成前端實作後，可以要求 Agent 依照專案的 `DESIGN.md` 檢視實際頁面。若有問題，要繼續定位、修改、重新載入並複查，而不是只列出缺陷：

```text
完成實作後，請使用 Browser 驗收，不要只回報程式已完成。

1. 先閱讀專案中的 DESIGN.md。
2. 打開本機網站，實際操作主要頁面與表單。
3. 檢查色彩、字體、間距、版面、圓角、元件與 RWD。
4. 檢查 Hover、Active、Focus、Overflow、文字裁切與圖片載入。
5. 若目前 Browser 權限允許，檢查 Console 與失敗的 Network Request。
6. 發現問題時，定位對應的 DOM、CSS 或 Component，修正後 Reload 並重驗。

最後分別回報：
DESIGN.md       PASS / FAIL
Desktop         PASS / FAIL
Tablet          PASS / FAIL
Mobile          PASS / FAIL
Console         PASS / FAIL / 未檢查
Network         PASS / FAIL / 未檢查
Interaction     PASS / FAIL

列出為了通過驗收而修改的檔案與尚未解決的問題。
```

## 結論：不要問 Browser 能不能取代 Playwright

我現在會先問：「哪些驗收需要理解畫面與上下文？」以及「哪些驗收應該固定、可重複地執行？」

需要判斷視覺、UX 與不同裝置呈現的部分，交給 Browser 輔助檢查；登入、預約、Checkout、CRUD 等有明確條件的核心流程，留給 Playwright 穩定回歸。SuperDesign 先探索，`DESIGN.md` 記錄規格，Codex 負責實作，Browser 負責動態檢視，Playwright 守住關鍵流程。

以前的 Vibe Coding 是「AI 幫我把網站寫出來」；我期待下一階段是：**AI 不只把網站寫出來，也要在能力與權限允許的範圍內，協助確認它做得如何。**

## 常見問答 (FAQ)

### Q1：Codex Browser 可以取代 Playwright 嗎？

不適合把兩者當成互相取代的工具。Browser 適合檢視畫面、互動與上下文；Playwright 適合反覆驗證登入、預約、結帳等明確流程，也能比對選定的視覺基準。

### Q2：`DESIGN.md` 和 SuperDesign 有什麼不同？

SuperDesign 用來探索、比較設計方向與設計草稿；`DESIGN.md` 用來把選定後的設計系統整理成規格，讓人和 Agent 可以依據它協作。前者偏探索，後者偏記錄與對齊。

### Q3：Codex Browser 一定能檢查 Console 和 Network 嗎？

不一定。較深入的瀏覽器診斷需要支援的 Browser use 環境、已啟用 Developer Mode 的完整 CDP 存取，且檢查網站時仍可能需要使用者明確核准。驗收報告應區分已檢查與因權限未檢查的項目。

### Q4：哪些測試最值得保留在 Playwright？

優先保留重要、可明確描述成功條件，而且改版後必須重複通過的使用者旅程，例如登入、建立或取消預約、結帳和核心 CRUD。探索性的視覺問題則可在 Browser 驗收時檢視。

### Q5：每個頁面都要建立 Screenshot Regression 嗎？

不用。挑選穩定且值得保護的核心頁面或元件即可，並在相同的瀏覽器、作業系統、字型與測試資料環境下比對。快照能指出畫面改變，但仍需要人判斷改變是預期還是缺陷。

## 參考資料

- [OpenAI Help Center：Codex Browser use 與 Developer Mode](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [Google Labs Code：`DESIGN.md` 格式、CLI 與專案狀態](https://github.com/google-labs-code/design.md)
- [SuperDesign Skill：Coding Agent 的設計探索與系統工作流](https://github.com/superdesigndev/superdesign-skill)
- [Playwright：Visual Comparisons](https://playwright.dev/docs/test-snapshots)

---
