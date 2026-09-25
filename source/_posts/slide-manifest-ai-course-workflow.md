---
title: "AI 做簡報總是大綱、PPT、講義對不起來？先建立 Slide Manifest"
cover: /images/cover189.png
toc: true
categories:
  - 生成式AI應用
tags:
  - AI工具
  - AI自動化
  - 自動化講師應用
date: 2026-09-26 01:15:33
subtitle: 讓每張投影片都有明確任務，再讓簡報、講義與 Prompt Card 共用同一份規格。
description: AI 產生的課程簡報常和大綱、講義、Prompt Card 對不起來？本文用 Slide Manifest 定義每張投影片的目標、重點、提示詞與講師備註，帶你從 Course Outline、Manifest QA 到簡報與教材共同生成，減少遺漏、錯頁與版本不同步。
---

最近用 AI 製作課程簡報時，我常遇到一個麻煩：一開始明明規劃好課程大綱，最後的投影片和講義卻對不起來。

- 大綱列了 30 個重點，PPT 少了幾個。
- 大綱中的第 12 頁，到了簡報變成別的內容。
- 簡報放了完整 Prompt，講義卻沒有收錄。
- 講義的實作順序和投影片不同。
- 修改簡報後，講義沒有跟著更新。
- AI 覺得兩頁內容相似，就自行合併成一頁。

這些狀況不一定是 AI 不會做簡報，而是課程大綱、PPT、講義和 Prompt Card 各自被重新理解了一次。每多一次重新解讀，內容就多一個走樣的機會。

我會在課程大綱和各種教材之間加上一層規格：**Slide Manifest**。先把每張投影片要完成的任務寫清楚，再從同一份 Manifest 產生簡報、講義、Prompt Card 和講師備註。

## Slide Manifest 是什麼？

可以把 Slide Manifest 想成整份課程簡報的施工藍圖，也是逐頁的規格表。課程大綱通常說明要教哪些主題；Manifest 則進一步說明每張投影片的目的、重點、呈現方式，以及是否要進入講義。

一般大綱可能只寫：

```markdown
## AI 提示詞實作

- 提示詞基本架構
- Role / Task / Context
- 實作 Facebook 貼文
```

人看得懂這些主題，但還需要決定要拆成幾頁、哪些元素放在一起、是否提供完整 Prompt，以及哪些內容要放進講義。Slide Manifest 把這些決定先記錄下來：

```yaml
- id: slide_011
  section: "03"
  type: concept
  title: 提示詞不是咒語，而是一份工作說明書
  learning_objective: 讓學員理解提示詞的基本概念
  key_points:
    - AI 需要明確任務
    - 提供角色與背景
    - 指定輸出格式
  visual:
    type: diagram
    concept: 使用者 → Prompt → AI → Output
  handout:
    include: true
```

下一頁可以獨立記錄提示詞的組成：

```yaml
- id: slide_012
  section: "03"
  type: framework
  title: Prompt 四大元素
  learning_objective: 讓學員辨識 Prompt 的基本結構
  key_points:
    - Role
    - Task
    - Context
    - Output
  visual:
    type: four_block
  handout:
    include: true
```

實作頁則應把完整提示詞和交付物寫進規格，而不是只留下一個主題名稱：

```yaml
- id: slide_013
  section: "03"
  type: practice
  title: 實作：產生 Facebook 貼文
  learning_objective: 完成第一個行銷文案 Prompt
  prompt:
    text: |
      你是一位社群行銷顧問。

      請根據以下資料撰寫 Facebook 貼文：

      商品：
      目標客群：
      主要特色：

      請輸出：
      1. 標題
      2. 貼文正文
      3. CTA
  handout:
    include: true
    type: prompt_card
```

這樣每張投影片都有自己的 ID 與規格，後續產物便能對回原始頁面，而不必靠標題猜它們是否相同。

## 為什麼大綱、簡報和講義容易不同步？

如果工作流程是「大綱 → AI 做 PPT → AI 做講義 → AI 做 Prompt Card」，每個產物都可能重新從大綱推導一次內容。即使每次理解只差一點，差異最後還是會累積：

```text
課程大綱 → 第一次解讀 → PPT
課程大綱 → 第二次解讀 → 講義
課程大綱 → 第三次解讀 → Prompt Card
```

加入 Manifest 後，流程改成先確認逐頁規格，再由同一份資料分別產生需要的教材：

```text
Course Brief → Course Outline → Slide Manifest → QA
                                   ├─ PPT 與講師備註
                                   ├─ 學員講義
                                   └─ Prompt Card 與實作
```

這不表示課程內容永遠不能修改。它表示在產生不同教材時，先共用同一份已確認的逐頁規格；課程方向改變時，也要同步更新 Manifest，再產生受影響的產物。

## 每張投影片的規格要包含哪些欄位？

剛開始不必設計成複雜的資料庫。先記錄足以界定每張投影片工作的欄位：

```yaml
id: slide_021
section: "04"
type: practice
title: 實作：建立你的第一個 AI 工作流程
learning_objective: 學員可以完成一個從輸入到輸出的 AI 工作流程
key_message: 先定義資料如何進來、處理，再確認結果如何交付
key_points:
  - 定義輸入
  - 定義處理方式
  - 定義輸出
  - 測試結果
visual:
  type: workflow
  content: 使用者輸入 → AI 分析 → 產生結果
speaker_notes:
  - 先展示完成品
  - 再拆解流程
  - 最後讓學員實作
handout:
  include: true
  type: lab
duration: 10
source:
  outline_section: 4.2
```

最基本的欄位可包括 `id`、`section`、`type`、`title`、`learning_objective`、`key_points`、`visual`、`speaker_notes`、`handout` 和 `source`。如果課程會產生示範或實作，再補上 `demo`、`practice`、`prompt`、`duration` 等資訊。

### 為教學簡報補上實作與講師資訊

教學課程通常還需要 `key_message`、`demo`、`practice`、`prompt` 和 `duration`。這些欄位可以說明本頁要讓學員帶走什麼、老師要示範什麼、學員要完成什麼，以及這一段預計花多少時間。

欄位名稱不是重點，定義清楚才是重點。例如 `practice` 不能只寫「做一個流程」，還要列出學員要操作的步驟和完成條件；`prompt` 若要進入講義，就應放入完整可使用的文字，而不是只留一個 Prompt 標題。

### 用 `type` 指定每頁的功能

替每張投影片指定 `type`，能讓製作流程知道這頁要負責什麼工作。常見類型可以是：

```text
cover
section
concept
framework
comparison
workflow
case_study
demo
practice
prompt
summary
qna
```

`type: comparison` 表示要呈現比較關係；`type: prompt` 則代表需要適合閱讀與複製提示詞的版型。Manifest 因此不只管理內容，也能連接簡報的 Design System。

## 建立 Slide Manifest 的建議流程

### 1. 先整理 Course Brief

在排頁面前，先寫清楚上課對象、課程時間、學員程度、學習目標、實作數量、是否需要 Prompt 或 Demo，以及是否需要學員講義。需求若還不明確，後面的逐頁規格也很難一次到位。

### 2. 編寫 Course Outline

接著整理課程章節與要教的概念。例如「AI 工作流程概念」底下列出 Agent 是什麼、與 Chatbot 有何不同，以及有哪些工作流程案例。這階段先定義課程涵蓋範圍，不急著決定每個主題要做幾張投影片。

### 3. 將大綱拆成逐頁 Manifest

逐頁決定 ID、章節、類型、標題、學習目標、重點、視覺方式、示範、實作、Prompt、講師備註、講義設定與大綱來源。每一頁都應能回答：「這張投影片在課程中負責什麼？」

可以用以下提示詞建立初稿：

```text
請根據以下課程大綱建立 Slide Manifest。
此階段只規劃完整的逐頁架構，不要設計簡報或產生 PPT。

每張投影片都要有唯一 ID，並記錄 section、type、title、
learning_objective、key_message、key_points、visual、demo、
practice、prompt、speaker_notes、handout 與 source。

一個 Manifest 項目對應一張投影片。請勿自行合併、刪除或新增頁面。
```

### 4. 先做 Manifest QA，再做 PPT

先審逐頁架構，確認它涵蓋課程大綱、頁面順序合理、ID 不重複、頁數符合預期，而且沒有實作或 Prompt 遺漏。再逐項檢查：

- 每個大綱主題是否都有對應的投影片？
- ID 是否唯一、連續，且沒有重複頁面？
- 每個學習目標是否具體？
- 每張實作頁是否包含步驟和完成條件？
- 每張 Prompt 頁是否附上完整提示詞？
- 每個 Demo 是否寫出展示目標？
- 標記要放進講義的頁面是否都有足夠材料？
- 投影片、實作、Prompt 和案例的數量是否符合課程規劃？

越早發現缺頁，越不需要在整份簡報完成後重排內容。

### 5. 讓 PPT、講義與 Prompt Card 共用 Manifest

確認規格後，再要求 AI 依 Manifest 產生簡報。一個 Manifest 項目對應一張投影片，保留 ID、標題、Prompt 和實作的原意；可以調整視覺呈現，但不應在製作時自行新增、刪除或合併內容。

產生講義時，只處理 `handout.include: true` 的項目；`handout.type` 可以指定它要成為 Prompt Card、練習單或 Lab。`speaker_notes` 則可整理成簡報的講師備註。完成後再回頭比對每頁 ID 與 Manifest，確認簡報和講義沒有少頁、漏 Prompt 或順序錯置。

### 6. Manifest 定稿後做版本管理

Manifest 確認後，可以記錄版本、狀態與頁數，例如：

```yaml
manifest_version: 1.0
status: approved
slide_count: 58
```

當 `status` 是 `approved`，製作簡報時就不要靜默改動架構。若要修改第 27 頁，更新該頁規格、版本與變更紀錄，並重新產生受影響的簡報或講義。這個做法能保留修改脈絡，也方便確認哪些產物需要更新。

## Manifest 不一定要用 YAML

YAML 適合放在可版本管理的課程專案裡，但剛開始也可以用 Markdown 表格、CSV、Google Sheet 或 Notion 資料庫。只要每張投影片有穩定 ID，且欄位能清楚描述規格，就能當作 Manifest 使用。

| ID | Type | Title | Learning Objective | Key Points | Visual | Handout |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | Cover | AI 辦公自動化 | 建立課程期待 | 課程名稱 | Hero | No |
| S02 | Concept | 什麼是 AI Agent | 理解 Agent 概念 | 自主、多步驟 | Diagram | Yes |
| S03 | Comparison | Chatbot vs Agent | 理解兩者差異 | 對話與執行 | Comparison | Yes |
| S04 | Practice | 找出可自動化工作 | 完成流程盤點 | 輸入、流程、輸出 | Worksheet | Yes |

使用熟悉的格式開始，通常比一開始花很多時間設計完美 schema 更實際。之後若要自動生成教材，再逐步把欄位整理成 YAML 或 JSON。

## 用 Codex 整理課程專案

如果你用 Codex 製作課程，可以把規格、素材和產物分開放，降低檔案混在一起的機會：

```text
/course-project
  README.md
  /course
    course-brief.md
    course-outline.md
  /manifest
    slide-manifest.yaml
  /content
    prompts.md
    labs.md
    cases.md
  /assets
    /images
    /icons
    /screenshots
  /output
    course.pptx
    handout.md
    prompt-cards.md
```

工作流程就是 `course-outline.md` → `slide-manifest.yaml` → QA → PPT、講義、Prompt Card。之後要改課程時，先更新規格，再重新產生相關交付物。

## Slide Manifest 與 Design System 各自管什麼？

Slide Manifest 定義每頁要講什麼、要完成什麼；Design System 定義頁面要如何呈現。前者可以記錄 `type: prompt` 與 `layout: prompt_card`，後者則規範字體、色彩、區塊與版型。兩者分工清楚後，內容架構和視覺設計就能各自維護，也能一起產出簡報。

## 用一份逐頁規格，減少教材不同步

Course Outline 說明課程要教什麼；Slide Manifest 說明每一張投影片負責什麼；Presentation 則決定內容最後長什麼樣子。

如果簡報、講義、Prompt Card 和講師備註都各自從大綱重新推導，很容易出現漏頁、順序不一致或修改不同步。先建立並審查 Slide Manifest，再讓各種教材依同一份規格產生，能讓每份產物都對回同一張投影片。對需要長期維護、反覆開課或大量製作課程的團隊，這是值得先建立的一層內容規格。

## 常見問答 (FAQ)

### Q1：Slide Manifest 和課程大綱有什麼不同？

Course Outline 列出課程主題與內容範圍；Slide Manifest 會進一步把內容拆成逐頁規格，記錄每張投影片的 ID、目標、重點、呈現方式，以及是否要放入講義或 Prompt Card。

### Q2：Slide Manifest 一定要用 YAML 嗎？

不一定。Markdown 表格、CSV、Google Sheet 或 Notion 資料庫都可以。重點是每張投影片有穩定且唯一的 ID，欄位也足以說明它的目的與教材需求。

### Q3：建立 Manifest 後，還能修改簡報內容嗎？

可以。先更新 Manifest 的相關項目、版本或變更紀錄，再重新產生受影響的簡報、講義或 Prompt Card。這樣各份教材才能繼續對應同一份已確認的規格。

### Q4：小型課程也需要 Slide Manifest 嗎？

如果內容很少、只需製作一次簡報，簡單大綱可能就足夠；若同一課程會產生投影片、講義、Prompt Card 或多次更新，逐頁規格能更容易檢查遺漏與同步狀況。
