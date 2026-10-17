---
title: "Vibe Coding 新手教學：Void 是什麼？Vinext 又是什麼？用 Codex 建站與選擇 Cloudflare 部署"
cover: /images/cover224.png
toc: true
categories:
  - 軟體開發
tags:
  - Vibe Coding
  - Cloudflare
  - AI工具
date: 2026-10-18 02:06:52
subtitle: "Void、Vinext、Cloudflare Workers 與 Vercel，從新專案到既有 Next.js 專案一次看懂。"
description: "Void 和 Vinext 有什麼不同？本文從 Vite、Next.js 與 Cloudflare 部署說起，帶你用 Codex 建立 Void 練習網站、認識 D1，再判斷既有 Next.js 專案是否適合 Vinext。"
---

最近看到 MUKI WU 分享影片《Vite 被 Cloudflare 買了？Void 開源能取代 Vercel 嗎？》，我也開始研究 Void 和 Vinext。

這兩個名稱都和 Vite 有關，也都出現在 Cloudflare 的開發工具消息裡，但它們解決的問題並不相同。**Void 適合從 Vite 專案開始，整合全端功能與部署；Vinext 則讓既有 Next.js 專案改用 Vite 工具鏈。**

這篇會用一個新手能跟上的例子，帶你用 Codex 建立 Void 練習網站，再認識什麼時候才需要研究 Vinext。安裝與指令依本文整理時的官方文件編寫；文章中的範例不是每種環境都已實機驗證，實際操作仍要以所安裝版本的文件為準。

## Vite、Void、Vinext、Vercel 和 Cloudflare 有什麼不同？

先把幾個常一起出現的名稱分開看：

| 名稱 | 主要工作 | 可以先這樣理解 |
|---|---|---|
| Vite | 網頁開發伺服器與建置工具 | 協助開發、即時預覽和打包網頁 |
| Vite+ | 整合 JavaScript 開發工具鏈 | 把建置、測試與程式碼檢查等工具放在一起 |
| Next.js | React 全端框架 | 提供頁面路由、伺服器渲染等網站開發功能 |
| Vinext | 以 Vite 重新實作 Next.js API 的外掛 | 讓既有 Next.js 專案有機會改由 Vite 工具鏈執行 |
| Void | Vite 全端 SDK、CLI 與部署平台 | 協助建立 API、連接資料資源並部署 Vite 應用 |
| Vercel | 雲端部署與代管平台 | 提供部署、預覽和團隊開發流程 |
| Cloudflare | 雲端基礎設施與全球網路平台 | 提供 Workers、D1、KV、R2 等服務 |

**Void 和 Vinext 不是同一種工具。**Void 的重點是從 Vite 應用出發，建立全端功能並管理部署；Vinext 的重點是讓 Next.js 專案沿用熟悉的應用目錄結構，改由 Vite 處理建置與執行。

Cloudflare 在 2026 年 10 月介紹 Void 時，說明 VoidZero 已加入 Cloudflare，並公開 Void SDK、CLI 和 Platform。這不代表 Vite、Void 和 Vinext 是同一個產品，也不代表原有的 Vite 專案會自動變成 Void 專案。[Cloudflare 的 Void 公告](https://blog.cloudflare.com/deploy-with-void/)

### 用一句話記住它們的差異

- **Vite**：負責開發和建置前端應用。
- **Void**：在 Vite 工作流上加上全端路由、資源管理與部署。
- **Vinext**：讓 Next.js 專案改用 Vite 工具鏈，並保留大量 Next.js 開發介面。
- **Vercel 和 Cloudflare**：提供網站部署及執行所需的雲端服務。

Void 不是 Vercel 的直接替代品，Vinext 也不是把所有 Next.js 專案自動搬到 Cloudflare 的保證。選擇時應先看手上的專案、需要的功能和可接受的遷移成本。

## 為什麼 Void 適合拿來學習 Vibe Coding？

假設你想請 Codex 做一個活動報名網站。它可能需要網頁表單、API、資料庫和部署環境。過去，這些部分常要分別設定；Void 的目標是把 Vite 應用和 Cloudflare 資源放進較連貫的開發流程。

Void 主要由三個部分組成：

- **Void SDK**：在 Vite 專案中開發前端、伺服器路由及資源操作。
- **Void CLI**：初始化專案、建置、建立或綁定 Cloudflare 資源、套用資料庫遷移並部署。
- **Void Platform**：供團隊共用的部署平台，可自行架設並設定使用者權限和資源限制。

初學者通常可以先從 SDK 和 CLI 開始，不需要一開始就安裝團隊用的 Platform。你可以先在自己的 Cloudflare 帳號裡建立一個小型練習，再視需要研究共用平台。

Void 的功能可以組合使用，也能和一些既有的 Vite 架構合作。不過官方目前將 Vinext adapters 列為實驗性支援；第一次學習時，先分開理解 Void 和 Vinext，會更容易判斷問題來自哪一層。[Void Cloudflare 整合說明](https://void.cloud/integrations/cloudflare)

## 如何在 Mac 安裝 Void 並建立第一個專案？

以下範例以 macOS 和 npm 說明。你需要 Node.js、終端機和 Void；若要部署到 Cloudflare，還需要 Cloudflare 帳號。Void 官方目前要求 Node.js 24.21.0 以上版本，其他作業系統也可依官方支援條件操作。[Void 官方 GitHub](https://github.com/voidzero-dev/void)

### 先確認 Node.js 版本

打開 Mac 的「終端機」，輸入：

```bash
node -v
npm -v
```

若 Node.js 版本低於 Void 目前要求的版本，請先更新。若你電腦上有其他 Node.js 專案，可以用 nvm 管理多個版本，避免更新後影響舊專案。

### 建立練習資料夾並初始化

在終端機輸入：

```bash
mkdir void-playground
cd void-playground
npm install -D void
npx void init
```

初始化指令會啟動設定流程，讓你選擇 UI 框架、起始範本和部署目標。Void 的 Vite+ 工具鏈是預設選項；如果只想先在本機學習，可以先略過部署設定。[Void Quickstart](https://void.cloud/guide/quickstart)

這篇用活動報名系統作為範例，可以選擇下列方向：

| 設定項目 | 練習選擇 | 適合原因 |
|---|---|---|
| Toolchain | Vite+（預設） | 使用 Void 提供的整合工具鏈 |
| Frontend | React | 建立常見的互動式網頁 |
| Starter | D1 | 練習網站、API 與 SQL 資料庫 |
| Deployment | Cloudflare | 之後可部署到自己的 Cloudflare 帳號 |

初始化時，Void 也會準備 Agent 可讀的專案指引。若要重新設定 Codex 等 Coding Agent，可以在專案根目錄執行：

```bash
npx void init --agents
```

它會建立或更新 AGENTS.md，並依照可偵測到的 Agent 設定連結對應技能；這樣 Codex 可以讀取專案所安裝版本的 Void 文件，而不是只依賴模型記憶。[Void Coding Agents 指南](https://void.cloud/integrations/agents)

### 在本機啟動網站和 API

初始化完成後，在專案資料夾輸入：

```bash
npm run dev
```

依照終端機顯示的網址開啟瀏覽器，Quickstart 範例通常使用：

**http://localhost:5173**

如果範本沒有 API 範例，可以新增 routes/api/hello.ts：

```typescript
import { defineHandler } from 'void';

export const GET = defineHandler(() => {
  return {
    message: 'Hello from Void'
  };
});
```

再打開：

**http://localhost:5173/api/hello**

你會看到類似以下 JSON：

```json
{
  "message": "Hello from Void"
}
```

這個路由的檔案路徑對應到 /api/hello，而 GET 表示用讀取方式回傳資料。Void 的官方 Quickstart 使用相同的入門範例；各種範本的檔案是否已預先建立，則要依初始化結果確認。[Void Quickstart：呼叫伺服器路由](https://void.cloud/guide/quickstart)

## 如何用 Codex 開發一個報名網站？

先把剛剛的 void-playground 專案開在 Codex。接著可以把以下提示詞貼給 Codex，請它先閱讀專案說明和已安裝版本的 Void 文件：

```text
你是一位熟悉 Void、React、TypeScript 與 Cloudflare Workers 的全端工程師。

請先閱讀專案中的 AGENTS.md，以及 node_modules/void/ 內目前安裝版本的官方文件，再開始修改程式。

我要建立一套簡單的活動報名網站。

前台功能：
1. 顯示活動名稱、日期和地點。
2. 提供姓名與 Email 欄位。
3. 在瀏覽器與伺服器端檢查必填欄位和 Email 格式。
4. 成功寫入資料後，再顯示報名完成訊息。

後端功能：
1. 使用 Void 官方伺服器路由。
2. 使用 Cloudflare D1 儲存報名資料。
3. 使用資料庫 migration 管理結構變更。
4. 防止同一個 Email 重複報名。

管理功能：
1. 管理頁必須有身分驗證和權限檢查。
2. 未完成授權前，不能公開報名名單或 Email。

開發規則：
1. 優先使用專案已安裝版本的官方 API。
2. 不要使用過時的 Void 語法。
3. 不要建立不必要的第二套伺服器或部署流程。
4. 先在本機完成開發與檢查，不要直接修改正式環境，也不要擅自部署。

完成後請說明建立了哪些檔案、API 如何運作、資料存在哪裡、如何在本機測試，以及部署前還需要確認什麼。
```

接著你可以在瀏覽器測試表單，並確認資料真的寫進本機 D1。不要只看畫面有沒有出現「報名成功」，還要檢查 API 回應和資料庫內容。

正式網站也需要補上個資告知、垃圾報名防護和管理者權限。練習時不要使用真實的客戶資料，也不要把公開的名單頁當成登入驗證。

## 如何將 Void 網站部署到 Cloudflare？

本機功能確認完成後，若初始化時已選 Cloudflare 作為部署目標，可執行：

```bash
npx void deploy
```

若當時略過部署設定，也可以指定 Cloudflare：

```bash
npx void deploy --platform cloudflare
```

首次部署時，Void 可能會開啟瀏覽器要求登入並選擇 Cloudflare 帳號。CLI 會建置應用、建立所需資源、套用 migrations 並回報部署網址。[Void 的 Cloudflare 部署指南](https://void.cloud/integrations/cloudflare)

部署後可到 Cloudflare 控制台的 Workers & Pages 檢查 Worker 狀態；若使用 D1，也要確認資料庫已建立並收到測試資料。**本機 D1 與正式環境的 D1 是不同資料庫**，本機測試資料不會自動複製到正式環境。

部署前也要檢查 migration。程式碼回復到舊版本，不代表資料庫結構會自動回到舊狀態。第一次公開部署前，先理解哪些資源會建立、資料存在哪裡、帳號目前使用的方案與額度。

## Vinext 是什麼？什麼時候才需要它？

Vinext 是一個以 Vite 重新實作 Next.js API 的 Vite 外掛。它的目標是讓既有 Next.js 專案能保留許多熟悉的路由、元件和設定方式，再透過 Vite 建置並選擇合適的部署平台。

**如果你從零開始做一般 Vite 網站，通常不需要先安裝 Vinext。**它主要適合已經有 Next.js 專案、想評估 Vite 工具鏈或 Cloudflare Workers 部署的開發者。

### 怎麼辨認既有專案是不是 Next.js？

可以查看專案根目錄的 package.json。如果依賴中有 next，通常就是 Next.js 專案。app/、pages/ 和 next.config.js 或 next.config.ts 也常見於 Next.js 專案。

### 如何先檢查相容性，再試用 Vinext？

不要直接在正式專案上遷移。先建立 Git 備份或測試分支，再在專案目錄執行：

```bash
npx vinext check
```

這會掃描部分已知相容性問題。檢查結果不能代替完整測試，但可以先找出值得注意的差異。

若要建立 Vinext 設定，可接著執行：

```bash
npx vinext init
```

Cloudflare 文件中的典型流程會加入 dev:vinext 和 build:vinext 等 scripts。初始化後請先檢查 package.json，再依實際產生的指令啟動開發伺服器與正式建置：

```bash
npm run dev:vinext
npm run build:vinext
```

部署到 Cloudflare Workers 的範例指令是：

```bash
npx @vinext/cloudflare deploy
```

詳細流程請參考[Cloudflare 的 Next.js／Vinext 指南](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)。Cloudflare 也提供建立 Cloudflare-ready 專案的 C3 流程；若你是在既有 Next.js 專案上遷移，請以目前文件和 vinext init 的輸出為準。

### Vinext 1.0 是否代表完全相容 Next.js？

不是。Vinext 在 2026 年 9 月發布 1.0，代表它自身的公開 API 開始依循穩定版本規則；這不等於所有 Next.js API 和功能都已完整相容。官方文件仍列出部分功能差異，包括 Cache Components 和 Partial Prerendering，遷移正式網站前應查看相容性差異並實際測試。[Vinext 1.0 說明](https://vinext.dev/blog/vinext-1-0)・[Vinext 相容性差異](https://vinext.dev/docs/reference/differences)

Cloudflare 目前推薦在 Workers 上評估 Vinext；如果既有應用仍有相容性缺口，也仍保留 OpenNext adapter 等其他路徑。若網站只需要靜態輸出，Cloudflare Pages 也是另一種情境。選擇前先看專案實際用到的功能，不要只根據版本號或建置速度決定。

## Vibe Coding 專案該選哪一種架構？

可以先用下面幾種情境縮小範圍：

| 專案情境 | 可以先評估 | 選擇時要注意 |
|---|---|---|
| 品牌網站、作品集、簡單活動頁 | Vite + 靜態網站代管 | 如果沒有後端資料需求，不必增加全端架構 |
| 從零開始做表單、預約或內部工具 | Void + Vite + Cloudflare Workers + D1 | 確認資料庫、使用權限、個資與資源額度 |
| 已有 Next.js 專案，想評估 Workers | Next.js + Vinext + Cloudflare Workers | 先跑相容性檢查，測試實際使用到的功能 |
| 已有穩定的 Worker + D1 | 維持現有架構，按需要改善 | 不要只為了新框架而重寫 |
| 有會員、訂單、金流或多人維護需求 | 先定義資料、權限、金流與維運需求 | 需要比較完整架構與維護成本，不能只看部署一鍵化 |

簡單來說：**從零開始、想在 Cloudflare 上建立 Vite 全端應用，可以研究 Void；已經有 Next.js，才需要評估 Vinext；既有系統運作正常，就先確認遷移能解決什麼問題。**

若專案已經使用 Next.js 並依賴特定功能，可以比較 Vinext 的相容性差異，或繼續評估 OpenNext 等現有部署方式。Void 對 Vinext 的 adapter 目前仍是實驗性支援，正式系統要先做獨立驗證。[Void Cloudflare 整合說明](https://void.cloud/integrations/cloudflare)

## 開始寫程式前，先請 Codex 做技術選型

把需求交給 AI 後，不一定要馬上讓它寫程式。你可以先請 Codex 說明架構選擇、風險和還需要確認的資訊：

```text
你是一位熟悉 Vite、Next.js、Void、Vinext、Cloudflare 與 Vercel 的技術架構顧問。

我準備建立一個網站。請先詢問並整理：
1. 網站主要用途。
2. 是否需要會員、資料庫、檔案上傳或金流。
3. 是否已有現成專案，以及目前使用的框架。
4. 是否指定部署平台、團隊流程或預算範圍。

在開始寫程式前，請評估以下選項是否符合需求：
A. Vite + 靜態網站代管
B. Void + Cloudflare Workers
C. Next.js + Vinext + Cloudflare Workers
D. Next.js + Vercel
E. Cloudflare Worker + D1

請比較學習成本、現有專案相容性、部署與維護需求、資料庫和權限設計，以及遷移風險。區分官方已說明的能力和仍需實測的部分。

先提出推薦方案、理由和待確認事項；等我確認後再開始修改程式。不要直接部署正式環境。
```

這段提示詞不保證 AI 每次都選對架構，但能讓你在程式碼產生前先看見方案取捨。架構不複雜時，也可以直接沿用熟悉且已運作穩定的工具。

## 新手可以怎麼安排學習順序？

如果要安排一門 Vibe Coding 入門實作課，我會拆成四個階段：

1. **先做一個簡單網站**：用 Codex 和 Vite 建立互動網頁，認識本機開發與正式網站的差異。
2. **再加入 API 和資料庫**：用 Void 建立表單、路由和 D1，確認資料如何從前端寫進資料庫。
3. **了解部署與環境**：學習 Workers、D1、環境變數和 migration，理解測試資料與正式資料的區別。
4. **最後看既有 Next.js 專案**：用測試分支檢查 Vinext 相容性，再比較不同部署路徑。

這個順序會先建立網站與資料的基本概念，再逐步加入部署和遷移。新手不必在第一天就同時學會 Vite、Void、Vinext、Next.js、資料庫、Docker 和雲端維運。

## 常見問答 (FAQ)

### Q1：Void 免費嗎？使用 Void 會不會產生 Cloudflare 費用？

Void SDK、CLI 和 Platform 的原始碼以 MIT 授權公開，但 Cloudflare Workers、D1、R2 等雲端服務仍有各自的方案、額度和使用條件。軟體開源不代表雲端資源無限制免費；部署前請查看 Cloudflare 目前的方案與服務用量。

### Q2：使用 Void 一定要架設 Void Platform 嗎？

不需要。個人專案可以用 Void SDK 和 CLI，部署到自己的 Cloudflare 帳號。Void Platform 主要提供團隊共用的部署環境、權限和資源管理功能。

### Q3：Void 可以完全取代 Vercel 嗎？

不能一概而論。Void 適合需要 Vite 全端功能並希望部署到 Cloudflare 的情境；Vercel 有自己的 Next.js 整合、預覽部署和團隊工作流程。應依專案需求、既有架構和維護方式比較，而不是只看平台名稱。

### Q4：Next.js 專案可以直接改用 Vinext 嗎？

不能保證直接替換就能運作。Vinext 提供相容性檢查與遷移指引，但仍有尚未完整支援的 Next.js 功能。先備份專案、執行 npx vinext check，再在測試分支驗證實際使用的頁面、資料載入、快取與部署行為。

### Q5：Void 和 Vinext 可以一起使用嗎？

可以把兩者放在同一個架構評估中，但 Void 官方目前將 Vinext adapters 標示為實驗性支援。入門時先分開學習兩者；若要整合到正式專案，請查閱相同版本的官方文件並自行完整測試。

## 結語：AI 幫你寫程式，選型仍需要理解

Void 和 Vinext 代表兩種不同的開發需求：Void 把 Vite 全端應用、Cloudflare 資源和部署流程連在一起；Vinext 則讓既有 Next.js 專案有機會改用 Vite 工具鏈。

使用 Codex 或其他 Coding Agent 時，不妨先確認網站是否需要後端、資料應存在哪裡、誰能存取資料，以及部署後由誰維護。**AI 可以協助你寫程式，工具可以簡化部署，但是否值得採用某個架構，仍要回到專案本身。**

如果你想先補上 Vibe Coding 的基礎，可以接著閱讀[從零開始用 AI 寫程式的 Vibe Coding 指南](/posts/ai-vibe-coding-for-non-coders/)；若想了解 Cloudflare 專案的 API 與安全考量，也可以參考[Vibe Coding、Cloudflare API 與安全設定](/posts/vibe-coding-ai-cloudflare-api-security/)。

### 官方學習資源

本文依據 2026 年 10 月 18 日可查閱的官方文件整理；指令和功能可能隨版本更新，請以安裝版本的文件為準。

**Void 與 Cloudflare：**

- [Void 官方網站](https://void.cloud/)
- [Void Quickstart](https://void.cloud/guide/quickstart)
- [Void Coding Agents 指南](https://void.cloud/integrations/agents)
- [Void Cloudflare 整合與限制](https://void.cloud/integrations/cloudflare)
- [Void 官方 GitHub](https://github.com/voidzero-dev/void)
- [Cloudflare：Deploy with Void](https://blog.cloudflare.com/deploy-with-void/)
- [Cloudflare Workers 文件](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 文件](https://developers.cloudflare.com/d1/)

**Vinext：**

- [Vinext 官方網站](https://vinext.dev/)
- [Vinext 1.0 說明](https://vinext.dev/blog/vinext-1-0)
- [Vinext 文件](https://vinext.dev/docs)
- [Vinext 相容性差異](https://vinext.dev/docs/reference/differences)
- [Cloudflare：Next.js 與 Vinext 部署指南](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)

**Node.js：**

- [Node.js 下載頁面](https://nodejs.org/en/download/)

---
