---
title: 建立電子書 AI 知識庫的完整實務：VLM + Hierarchical RAG 架構
cover: /images/cover85.png
toc: true
categories:
  - 生成式AI應用
tags:
  - RAG
  - VLM
  - 向量資料庫
date: 2026-03-16 14:30:11
subtitle:
description: 想要將電子書、PDF 轉為高精準度的 AI 知識庫嗎？本文深入解析 VLM 與 Hierarchical RAG 架構，透過章節結構抽取、Metadata 語意補強與 Hybrid Search 技術，解決傳統文字向量搜尋遺失上下文的痛點，大幅提升 AI 知識庫的檢索與回答品質。
---

近年很多人開始把電子書、PDF、技術文件做成 AI 知識庫。但如果只是「把 PDF 文字丟進向量資料庫」，通常效果會不太好。

原因很簡單：**書籍本身是有結構的**。

例如一本完整的書通常包含：
* 章節
* 小節
* 段落
* 圖表
* 表格
* 公式
* 頁面排版

如果忽略這些結構，搜尋品質會下降很多。本文整理一套目前常見、實務上效果不錯的架構，包含 **VLM（Vision-Language Model）**、**Hierarchical RAG**、**Metadata augmentation** 與 **Hybrid search**，能讓電子書知識庫的搜尋與回答品質明顯提升。

## 為什麼電子書知識庫不能只依賴「文字向量搜尋」？

最常見的 RAG 做法是：
```text
PDF → 抽文字 → chunk → embedding → vector DB

```

然後在查詢時：

```text
query → embedding → vector search → 找到 chunk → LLM 回答

```

這種方式在短文件通常沒問題，但在處理書籍時會遇到三個核心問題：

1. **書本內容很長**：一本 400 頁的書可能有 2000+ 個 chunks。
2. **Chunk 會失去上下文**：段落被強制切開後，單一區塊的語意可能不完整。
3. **使用者問法和書本寫法不同**：
* 書本裡的專業用語可能是：`token embedding`
* 使用者查詢的口語可能是：`文字向量化`
如果沒有額外的語意補強，純文字搜尋很容易發生 miss（漏找）。



## 電子書 AI 知識庫的推薦架構 Pipeline

為了達到高精準度，完整的知識庫處理流程可以這樣設計：

```text
電子書 PDF / EPUB
       ↓
    文件解析
       ↓
  章節結構抽取
       ↓
    段落 chunk
       ↓
LLM 產生 Metadata
 - summary
 - keywords
 - possible questions
       ↓
  VLM 解析頁面
 - page summary
 - figure caption
 - table summary
       ↓
  建立向量索引
 - chapter index
 - chunk index
 - page index
       ↓
  Hybrid search
       ↓
   LLM 組成答案

```

## Hierarchical RAG：長文件搜尋的關鍵

處理長篇書籍最常用的技巧是 **Hierarchical RAG（階層式檢索）**。其核心概念是：**先找章節，再找段落**，而不是直接在整本書的所有 chunk 中大海撈針。

### 一般 RAG 流程

```text
query → vector search → 所有 chunks

```

如果一本書有 2000 個 chunks，搜尋範圍過大，容易引入雜訊。

### Hierarchical RAG 流程

建立兩層索引：

* **Level 1**：chapter / section (章節)
* **Level 2**：paragraph / chunk (段落)

查詢流程則改為：

```text
query
 ↓
搜尋 chapter vectors
 ↓
找到最相關的章節
 ↓
只在該「特定章節」內搜尋 chunk
 ↓
LLM 回答

```

**架構優勢：**

* 大幅降低搜尋範圍
* 提升檢索精準度
* 回答內容更符合書本原有的邏輯結構

## 為每個段落增加 Metadata 語意補強

高品質的 AI 知識庫都會對每個 chunk 增加額外的語意資訊（Metadata），通常包含：

* `summary` (摘要)
* `keywords` (關鍵字)
* `possible questions` (可能的問題)
* `entities` (專有名詞 / 實體)

**Metadata JSON 結構範例：**

```json
{
  "chapter": "Self Attention",
  "section": "Attention Score",
  "page": 121,
  "content": "Attention score 計算為 softmax(QKᵀ / √d_k)",
  "summary": "說明 Transformer attention score 的公式",
  "keywords": [
    "transformer",
    "attention",
    "softmax",
    "QK"
  ],
  "possible_questions": [
    "attention score 怎麼算？",
    "Transformer attention 公式是什麼？"
  ]
}

```

### 為什麼要加入 Possible Questions？

因為使用者問問題時，通常不會使用書中的原句。如果書本寫 `token embedding`，而使用者問 `文字向量化`，只要在該 chunk 的 Metadata 補上：

```yaml
possible_questions:
  - Transformer 如何將文字轉成向量？

```

搜尋命中率就會產生質的飛躍。

### 為什麼 Embedding 不建議只做一個？

很多系統會偷懶，把所有內容合併成一段文字再做 embedding (`summary + keywords + content`)。但更好的做法是建立多個獨立向量：

1. `content_vector` (偏向細節)
2. `summary_vector` (偏向抽象概念)
3. `question_vector` (偏向使用者真實語言)

這三種內容的語意分布完全不同，分開建立索引能帶來更精確的比對結果。

## Chunk 大小設定建議

切分文本的顆粒度對結果影響甚鉅。以下是一個常見的 Baseline 參考：

| 內容類型 | Chunk Size (Tokens) | Overlap (Tokens) |
| --- | --- | --- |
| **一般文字書** | 300 – 700 | 50 – 100 |
| **技術專業書** | 200 – 500 | 50 – 100 |

> **實務提醒：** 如果文章內容包含大量的**程式碼**、**表格**或**數學公式**，Chunk 通常需要切得更小，以確保每個區塊的資訊足夠聚焦。

## VLM 在電子書知識庫扮演的角色

傳統 OCR 無法處理複雜版面，而 **VLM（Vision-Language Model）** 可以深入理解視覺元素，例如：圖表、表格、UI 截圖、架構圖與流程圖。

**處理流程：**

```text
PDF page image → VLM → 產出 page summary / figure caption / table summary

```

將這些圖表解說文字一併做 embedding 後，當使用者提問：「*這張架構圖在講什麼？*」時，系統才有能力精準作答。

## Hybrid Search：向量與關鍵字的完美結合

單純依賴向量搜尋（Vector Search）並不一定最穩定。實務上最強悍的檢索組合是：

`Vector Search (語意) + BM25 Keyword Search (關鍵字) + Reranker (重新排序)`

**查詢流程：**

```text
query
 ↓
Vector search 與 Keyword search 雙軌並行
 ↓
合併候選名單 (Candidates)
 ↓
Rerank (利用重排模型選出最相關的 Top K)
 ↓
LLM 回答

```

這個做法能完美互補語意搜尋與精確字詞比對的缺點，大幅降低 miss 機率。

## 建議的資料表 Schema 設計

為了配合上述架構，建議的資料庫 Schema 可設計如下：

### Chapters (章節層級資料)

```json
{
  "chapter_id": "ch05",
  "title": "Self Attention",
  "summary": "介紹 self-attention 原理",
  "keywords": ["transformer", "attention"],
  "page_start": 101,
  "page_end": 145
}

```

### Chunks (段落層級資料)

```json
{
  "chunk_id": "ch05-sec03-p02",
  "content": "...",
  "summary": "...",
  "keywords": ["attention score"],
  "possible_questions": [
    "attention score 怎麼算"
  ],
  "page_start": 121,
  "page_end": 122
}

```

### Pages (頁面層級資料)

```json
{
  "page_number": 121,
  "page_summary": "...",
  "figures": ["transformer attention diagram"],
  "tables": []
}

```

## 常見問答 FAQ

### Q：如果用 NotebookLM，還需要這些技術嗎？

**不一定。** NotebookLM 的特點是可以直接讀 PDF、支援長 context，且會自動建立引用。

* **適合直接使用 NotebookLM 的情境：** 文件數量不多、每本書僅幾百頁、不需要自己建置系統。
* **必須自己建構 RAG 的情境：** 準備打造自己的 AI 產品、需要支援大量文件庫、要整合企業內部搜尋系統、需要建立 API 或自訂檢索邏輯。
*(備註：NotebookLM 本質上也是在使用類似的技術，只是 Google 已經幫你完美封裝好了。)*

### Q：是不是可以直接把整本書塞進 LLM？

**有時可以。** 如果書本總字數不大（例如 `< 200k tokens`），某些支援超長 Context 的模型確實可以直接吃下全文。

* **優點：** 不用做 RAG，省去 chunking 的麻煩。
* **缺點：** Token 成本極高、無法應付跨多份大文件的全庫搜尋。

### Q：RAG 效果不好，通常是哪裡出問題？

實務上最常見的 5 大地雷：

1. Chunk 切得不好（斷句生硬或長度不對）。
2. 沒有做 Metadata 語意擴充。
3. 忽略了書籍原有的章節結構。
4. 只依賴 Vector Search，沒用 Hybrid Search。
5. 沒有使用 Reranking 進行最終排序。

> **結論：** RAG 表現不佳通常**不是 LLM 模型本身的問題，而是資料處理與結構設計的問題**。

## 總結

建立電子書 AI 知識庫時，決定最終品質上限的往往不是你用了多強大的 LLM，而是：

* **Chunk 的切割策略**
* **Metadata 的語意補強 (Augmentation)**
* **Hierarchical RAG 的階層式設計**
* **Hybrid Search 的雙軌檢索**
* **VLM 對於圖文內容的深度理解**

只要將這些基礎工程扎實做好，即使是搭配輕量級的開源模型，也能打造出極具水準的知識問答系統。
