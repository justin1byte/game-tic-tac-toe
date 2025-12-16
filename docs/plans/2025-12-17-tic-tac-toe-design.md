# 井字遊戲 (Tic-Tac-Toe) 設計文件

**日期**: 2025-12-17
**類型**: 網頁遊戲
**技術棧**: HTML/CSS/JavaScript (純原生，無框架)

## 專案概述

開發一個經典復古風格的井字遊戲網頁應用，支援雙人對戰和人機對戰兩種模式，包含三種AI難度和計分系統。

## 專案結構

```
tic-tac-toe/
├── index.html          # 主頁面
├── styles.css          # 樣式表
├── game.js             # 遊戲邏輯
└── ai.js               # AI 演算法
```

## 核心功能

### 1. 遊戲模式
- **雙人對戰 (PvP)**: 兩位玩家在同一台電腦上輪流操作
- **人機對戰 (PvC)**: 玩家對抗AI，支援三種難度

### 2. AI 難度級別
- **簡單**: 隨機選擇空格
- **中等**: 基本防守策略 + 隨機攻擊
- **困難**: Minimax 演算法，完美決策

### 3. 計分系統
- 追蹤玩家1勝場、玩家2勝場、平手次數
- 使用 localStorage 持久化保存分數

## 整體架構

### 核心組件

**1. GameBoard (棋盤管理)**
- 渲染 3x3 棋盤
- 處理玩家點擊事件
- 更新棋盤顯示

**2. GameLogic (遊戲邏輯)**
- 檢查勝利條件（8種組合：3橫、3直、2斜）
- 判斷平手狀態
- 管理回合切換

**3. AIPlayer (AI 玩家)**
- 實作三種難度的決策邏輯
- 簡單：隨機選擇
- 中等：防守優先 + 攻擊
- 困難：Minimax 演算法

**4. ScoreKeeper (計分管理)**
- 追蹤勝負平記錄
- 更新計分板顯示
- localStorage 持久化

**5. UIController (介面控制)**
- 模式選擇畫面
- 難度選擇畫面
- 重新開始功能
- 遊戲結果顯示

## 遊戲流程

### 初始化流程
1. 頁面載入顯示模式選擇畫面
2. 選擇雙人模式 → 直接開始遊戲
3. 選擇人機模式 → 顯示難度選擇（簡單/中等/困難）
4. 初始化空白棋盤和計分板
5. 從 localStorage 載入歷史分數（如有）

### 遊戲進行流程

**雙人模式**:
1. 玩家1 (X) 點擊空格下棋
2. 檢查勝利條件
3. 切換到玩家2 (O)
4. 重複步驟直到遊戲結束

**人機模式**:
1. 玩家 (X) 點擊空格下棋
2. 檢查勝利條件
3. AI (O) 根據難度自動下棋
4. 檢查勝利條件
5. 重複步驟直到遊戲結束

### 結束流程
1. 檢測到勝利或平手
2. 顯示結果訊息（"玩家 X 獲勝！"、"平手！"等）
3. 顯示獲勝連線動畫（如有獲勝者）
4. 更新計分板
5. 保存分數到 localStorage
6. 顯示「再玩一局」按鈕
7. 可選擇繼續同模式或返回模式選擇

## AI 難度實作

### 簡單難度
**策略**: 完全隨機選擇

```
function easyAI(board):
  availableSpots = board 中所有空格的索引
  return 隨機選擇一個 availableSpots
```

**特性**: 容易被擊敗，適合新手練習

### 中等難度
**策略**: 基本戰術邏輯

```
function mediumAI(board):
  1. 檢查 AI 是否能一步獲勝 → 走那步
  2. 檢查玩家下一步是否能獲勝 → 阻擋
  3. 否則隨機選擇空格
  return 選擇的位置
```

**特性**: 有挑戰性但可被擊敗，適合一般玩家

### 困難難度
**策略**: Minimax 演算法（完美決策）

```
function minimax(board, depth, isMaximizing):
  if 有獲勝者:
    return 分數 (AI勝 +10, 玩家勝 -10, 平手 0)

  if isMaximizing (AI 回合):
    bestScore = -∞
    for 每個空格:
      模擬在該格下棋
      score = minimax(board, depth+1, false)
      還原棋盤
      bestScore = max(score, bestScore)
    return bestScore
  else (玩家回合):
    bestScore = +∞
    for 每個空格:
      模擬在該格下棋
      score = minimax(board, depth+1, true)
      還原棋盤
      bestScore = min(score, bestScore)
    return bestScore

function hardAI(board):
  bestMove = null
  bestScore = -∞
  for 每個空格:
    模擬在該格下棋
    score = minimax(board, 0, false)
    還原棋盤
    if score > bestScore:
      bestScore = score
      bestMove = 該格
  return bestMove
```

**特性**: 使用最優策略，幾乎不可能被擊敗（最多平手）

## 視覺設計（經典復古風）

### 配色方案
- **背景**: `#F5F5DC` (米白色/Beige) 模仿紙張質感
- **棋盤線條**: `#2C1810` (深棕色) 手繪風格
- **X 符號**: `#8B4513` (SaddleBrown)
- **O 符號**: `#4A4A4A` (深灰色)
- **勝利連線**: `#DC143C` (Crimson 紅色)
- **按鈕**: `#DEB887` (BurlyWood) 配深色邊框

### 棋盤設計
- **尺寸**: 3x3 網格，每格 90px × 90px
- **線條**: 4px 粗線，略帶不規則感（可選）
- **符號**: 使用 SVG 或 Canvas 繪製，帶手繪風格
  - X: 兩條交叉斜線
  - O: 圓形，稍粗的描邊
- **間距**: 格子間距 10px

### UI 元素

**標題**:
- 字體: `'Courier New', monospace` 或 `Georgia, serif`
- 大小: 48px
- 顏色: `#2C1810`
- 文字: "井字遊戲" 或 "Tic-Tac-Toe"

**計分板**:
```
玩家 X: 5 勝          平手: 2          玩家 O: 3 勝
```
- 位置: 棋盤上方
- 字體: 24px, 同標題字體
- 佈局: 左右分列，中間顯示平手

**按鈕**:
- 樣式: 圓角矩形 (border-radius: 8px)
- 立體感: box-shadow 製造陰影
- 尺寸: 最小 150px × 50px
- hover 效果: 背景顏色稍微變深
- 類型:
  - 模式選擇: "雙人對戰" / "人機對戰"
  - 難度選擇: "簡單" / "中等" / "困難"
  - 遊戲控制: "再玩一局" / "返回選單"

**遊戲結果訊息**:
- 位置: 棋盤下方或覆蓋層
- 字體: 32px, 粗體
- 訊息範例:
  - "玩家 X 獲勝！"
  - "玩家 O 獲勝！"
  - "平手！"

### 動畫效果

**下棋動畫**:
- X 或 O 淡入出現 (opacity: 0 → 1)
- 持續時間: 0.2s
- 緩動函數: ease-in

**勝利動畫**:
- 紅色連線從起點劃到終點
- 動畫持續: 0.5s
- 獲勝的三格略微高亮或放大

**按鈕 hover**:
- 背景顏色轉換: 0.2s
- 輕微上移效果 (transform: translateY(-2px))

**原則**: 保持簡潔，不過度花俏，符合復古風格

## 資料結構

### 遊戲狀態
```javascript
const gameState = {
  board: ['', '', '', '', '', '', '', '', ''],  // 索引 0-8，空字串表示空格
  currentPlayer: 'X',                            // 'X' 或 'O'
  mode: 'pvp',                                   // 'pvp' 或 'pvc'
  difficulty: null,                              // 'easy', 'medium', 'hard' (僅 pvc 模式)
  gameOver: false,                               // 遊戲是否結束
  winner: null                                   // null, 'X', 'O', 或 'draw'
}
```

### 計分資料
```javascript
const score = {
  player1: 0,    // X 的勝場
  player2: 0,    // O 的勝場
  draws: 0       // 平手次數
}
```

### 勝利組合
```javascript
const winningCombinations = [
  [0, 1, 2],  // 第一橫排
  [3, 4, 5],  // 第二橫排
  [6, 7, 8],  // 第三橫排
  [0, 3, 6],  // 第一直排
  [1, 4, 7],  // 第二直排
  [2, 5, 8],  // 第三直排
  [0, 4, 8],  // 左上到右下斜線
  [2, 4, 6]   // 右上到左下斜線
]
```

## 關鍵邏輯

### 勝利條件檢查
```javascript
function checkWinner(board) {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        line: combination
      }
    }
  }

  // 檢查平手
  if (board.every(cell => cell !== '')) {
    return { winner: 'draw', line: null }
  }

  return null  // 遊戲繼續
}
```

### 玩家下棋
```javascript
function makeMove(index) {
  // 驗證
  if (gameState.gameOver) return false
  if (gameState.board[index] !== '') return false

  // 更新棋盤
  gameState.board[index] = gameState.currentPlayer

  // 檢查遊戲結果
  const result = checkWinner(gameState.board)
  if (result) {
    gameState.gameOver = true
    gameState.winner = result.winner
    updateScore(result.winner)
    return true
  }

  // 切換玩家
  gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X'

  // 如果是 AI 回合，觸發 AI 下棋
  if (gameState.mode === 'pvc' && gameState.currentPlayer === 'O') {
    setTimeout(() => aiMove(), 500)  // 延遲 0.5 秒讓體驗更自然
  }

  return true
}
```

### AI 下棋
```javascript
function aiMove() {
  let move

  switch (gameState.difficulty) {
    case 'easy':
      move = easyAI(gameState.board)
      break
    case 'medium':
      move = mediumAI(gameState.board)
      break
    case 'hard':
      move = hardAI(gameState.board)
      break
  }

  makeMove(move)
}
```

## 錯誤處理

### 使用者操作驗證
- **點擊已佔用格子**: 不執行任何動作，不切換玩家
- **遊戲結束後點擊**: 禁用棋盤點擊事件
- **AI 回合**: 禁用玩家點擊，直到 AI 完成下棋

### 邊界情況
- 棋盤索引範圍檢查 (0-8)
- 模式和難度未選擇時，不允許開始遊戲
- localStorage 讀取失敗時，使用預設分數 (0, 0, 0)

### 用戶體驗
- AI 下棋前有短暫延遲 (0.5s)，避免瞬間響應造成困惑
- 按鈕點擊後立即禁用，防止重複觸發
- 模式切換時清空棋盤和遊戲狀態

## 持久化 (localStorage)

### 保存分數
```javascript
function saveScore() {
  localStorage.setItem('ticTacToeScore', JSON.stringify(score))
}
```

### 載入分數
```javascript
function loadScore() {
  const saved = localStorage.getItem('ticTacToeScore')
  if (saved) {
    const parsed = JSON.parse(saved)
    score.player1 = parsed.player1 || 0
    score.player2 = parsed.player2 || 0
    score.draws = parsed.draws || 0
  }
}
```

### 重置分數（可選功能）
提供「清除記錄」按鈕，讓使用者可以重置所有分數。

## 實作優先級

### 第一階段：核心功能
1. 建立基本 HTML 結構
2. 實作棋盤渲染和點擊處理
3. 實作遊戲邏輯（勝利檢查、回合切換）
4. 雙人對戰模式

### 第二階段：AI 系統
5. 簡單 AI（隨機）
6. 中等 AI（基本戰術）
7. 困難 AI（Minimax）
8. 難度選擇介面

### 第三階段：計分與持久化
9. 計分系統
10. localStorage 整合
11. 模式選擇介面

### 第四階段：視覺與體驗
12. CSS 樣式（復古風格）
13. 動畫效果
14. 響應式設計（可選）

## 技術考量

### 為何選擇純 JavaScript
- 專案規模小，狀態管理簡單
- 無需打包工具或編譯步驟
- 快速開發和部署
- 學習曲線低
- 檔案小，載入快

### 效能優化
- Minimax 演算法已針對 3x3 棋盤優化（最多 9 層遞迴）
- 事件委派處理棋盤點擊
- CSS 動畫使用 GPU 加速屬性（transform, opacity）

### 可擴展性
- 模組化設計，各組件職責清晰
- 若未來需要，可輕鬆遷移到框架
- 可擴展為多種棋類遊戲集合

## 測試重點

### 遊戲邏輯測試
- 8 種勝利組合是否正確判斷
- 平手條件是否正確
- 回合切換邏輯

### AI 測試
- 簡單 AI 是否隨機選擇
- 中等 AI 是否能防守和攻擊
- 困難 AI 是否不可擊敗（手動測試）

### UI/UX 測試
- 所有按鈕功能正常
- 模式切換流程順暢
- 計分正確更新和保存
- 動畫流暢無卡頓

### 跨瀏覽器測試
- Chrome、Firefox、Safari、Edge
- localStorage 兼容性

## 交付標準

### 功能完整性
- ✅ 雙人對戰模式
- ✅ 人機對戰模式（三種難度）
- ✅ 計分系統
- ✅ 分數持久化

### 視覺標準
- ✅ 經典復古風格設計
- ✅ 清晰的 UI/UX
- ✅ 平滑的動畫效果

### 代碼品質
- ✅ 模組化、可讀性高
- ✅ 適當的註釋
- ✅ 無明顯 bug

### 使用體驗
- ✅ 流暢的操作體驗
- ✅ 直覺的介面設計
- ✅ 適當的視覺回饋

---

**設計完成日期**: 2025-12-17
**預期實作時間**: 依階段逐步完成
