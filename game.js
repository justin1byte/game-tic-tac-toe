// ===== Game State =====
const gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    mode: null,
    difficulty: null,
    gameOver: false,
    winner: null,
    aiThinking: false
};

// ===== Score Data =====
const score = {
    player1: 0,
    player2: 0,
    draws: 0
};

// ===== Winning Combinations =====
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// ===== DOM Elements =====
const elements = {
    modeSelection: document.getElementById('mode-selection'),
    difficultySelection: document.getElementById('difficulty-selection'),
    gameScreen: document.getElementById('game-screen'),

    btnPvP: document.getElementById('btn-pvp'),
    btnPvC: document.getElementById('btn-pvc'),
    btnEasy: document.getElementById('btn-easy'),
    btnMedium: document.getElementById('btn-medium'),
    btnHard: document.getElementById('btn-hard'),
    btnBackMode: document.getElementById('btn-back-mode'),
    btnRestart: document.getElementById('btn-restart'),
    btnBackMenu: document.getElementById('btn-back-menu'),
    btnResetScore: document.getElementById('btn-reset-score'),

    gameBoard: document.getElementById('game-board'),
    cells: document.querySelectorAll('.cell'),
    scoreX: document.getElementById('score-x'),
    scoreO: document.getElementById('score-o'),
    scoreDraw: document.getElementById('score-draw'),
    currentTurn: document.getElementById('current-turn'),
    gameResult: document.getElementById('game-result'),
    resultMessage: document.getElementById('result-message'),
    winningLine: document.getElementById('winning-line')
};

// ===== Initialization =====
function init() {
    loadScore();
    updateScoreDisplay();
    attachEventListeners();
    showScreen('mode-selection');
}

// ===== Event Listeners =====
function attachEventListeners() {
    elements.btnPvP.addEventListener('click', () => startGame('pvp'));
    elements.btnPvC.addEventListener('click', () => showDifficultySelection());

    elements.btnEasy.addEventListener('click', () => startGame('pvc', 'easy'));
    elements.btnMedium.addEventListener('click', () => startGame('pvc', 'medium'));
    elements.btnHard.addEventListener('click', () => startGame('pvc', 'hard'));
    elements.btnBackMode.addEventListener('click', () => showScreen('mode-selection'));

    elements.btnRestart.addEventListener('click', restartGame);
    elements.btnBackMenu.addEventListener('click', backToMenu);
    elements.btnResetScore.addEventListener('click', resetScore);

    elements.gameBoard.addEventListener('click', handleCellClick);
}

// ===== Screen Management =====
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = {
        'mode-selection': elements.modeSelection,
        'difficulty-selection': elements.difficultySelection,
        'game-screen': elements.gameScreen
    }[screenName];

    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function showDifficultySelection() {
    showScreen('difficulty-selection');
}

// ===== Game Start =====
function startGame(mode, difficulty = null) {
    gameState.mode = mode;
    gameState.difficulty = difficulty;
    resetGameState();
    showScreen('game-screen');
    renderBoard();
    updateTurnIndicator();
}

function resetGameState() {
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.gameOver = false;
    gameState.winner = null;
    gameState.aiThinking = false;
    elements.gameResult.classList.add('hidden');
    clearWinningLine();
}

// ===== Board Rendering =====
function renderBoard() {
    elements.cells.forEach((cell, index) => {
        const value = gameState.board[index];
        cell.textContent = value;
        cell.setAttribute('data-symbol', value);

        if (value) {
            cell.classList.add('filled');
        } else {
            cell.classList.remove('filled');
        }

        cell.classList.remove('winning', 'disabled');
    });
}

// ===== Cell Click Handler =====
function handleCellClick(event) {
    const cell = event.target;

    if (!cell.classList.contains('cell')) return;
    if (gameState.gameOver) return;
    if (gameState.aiThinking) return;

    const index = parseInt(cell.getAttribute('data-index'));

    const success = makeMove(index);

    if (success) {
        renderBoard();
        updateTurnIndicator();
    }
}

// ===== Make Move =====
function makeMove(index) {
    if (gameState.board[index] !== '') return false;
    if (gameState.gameOver) return false;

    gameState.board[index] = gameState.currentPlayer;

    const result = checkWinner(gameState.board);

    if (result) {
        handleGameEnd(result);
        return true;
    }

    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';

    if (gameState.mode === 'pvc' && gameState.currentPlayer === 'O') {
        gameState.aiThinking = true;
        elements.gameBoard.classList.add('ai-thinking');

        setTimeout(() => {
            const aiMove = getAIMove(gameState.board, gameState.difficulty);
            gameState.aiThinking = false;
            elements.gameBoard.classList.remove('ai-thinking');

            if (aiMove !== null) {
                makeMove(aiMove);
                renderBoard();
                updateTurnIndicator();
            }
        }, 500);
    }

    return true;
}

// ===== Check Winner =====
function checkWinner(board) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return {
                winner: board[a],
                line: combination
            };
        }
    }

    if (board.every(cell => cell !== '')) {
        return { winner: 'draw', line: null };
    }

    return null;
}

// ===== Game End Handler =====
function handleGameEnd(result) {
    gameState.gameOver = true;
    gameState.winner = result.winner;

    updateScore(result.winner);

    displayResult(result);

    if (result.line) {
        drawWinningLine(result.line);
        highlightWinningCells(result.line);
    }
}

// ===== Display Result =====
function displayResult(result) {
    let message = '';

    if (result.winner === 'draw') {
        message = '平手！';
    } else {
        message = `玩家 ${result.winner} 獲勝！`;
    }

    elements.resultMessage.textContent = message;
    elements.gameResult.classList.remove('hidden');
}

// ===== Highlight Winning Cells =====
function highlightWinningCells(line) {
    line.forEach(index => {
        elements.cells[index].classList.add('winning');
    });
}

// ===== Draw Winning Line =====
function drawWinningLine(line) {
    const canvas = elements.winningLine;
    const boardRect = elements.gameBoard.getBoundingClientRect();

    canvas.width = boardRect.width;
    canvas.height = boardRect.height;
    canvas.style.width = boardRect.width + 'px';
    canvas.style.height = boardRect.height + 'px';

    const ctx = canvas.getContext('2d');

    const [start, _, end] = line;
    const startCell = elements.cells[start];
    const endCell = elements.cells[end];

    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const x1 = startRect.left - boardRect.left + startRect.width / 2;
    const y1 = startRect.top - boardRect.top + startRect.height / 2;
    const x2 = endRect.left - boardRect.left + endRect.width / 2;
    const y2 = endRect.top - boardRect.top + endRect.height / 2;

    ctx.strokeStyle = '#DC143C';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    let progress = 0;
    const animate = () => {
        if (progress < 1) {
            progress += 0.05;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(
                x1 + (x2 - x1) * progress,
                y1 + (y2 - y1) * progress
            );
            ctx.stroke();

            requestAnimationFrame(animate);
        }
    };

    animate();
}

function clearWinningLine() {
    const canvas = elements.winningLine;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===== Update Turn Indicator =====
function updateTurnIndicator() {
    elements.currentTurn.textContent = gameState.currentPlayer;
}

// ===== Score Management =====
function updateScore(winner) {
    if (winner === 'X') {
        score.player1++;
    } else if (winner === 'O') {
        score.player2++;
    } else if (winner === 'draw') {
        score.draws++;
    }

    saveScore();
    updateScoreDisplay();
}

function updateScoreDisplay() {
    elements.scoreX.textContent = score.player1;
    elements.scoreO.textContent = score.player2;
    elements.scoreDraw.textContent = score.draws;
}

function resetScore() {
    if (confirm('確定要清除所有記錄嗎？')) {
        score.player1 = 0;
        score.player2 = 0;
        score.draws = 0;
        saveScore();
        updateScoreDisplay();
    }
}

// ===== localStorage =====
function saveScore() {
    try {
        localStorage.setItem('ticTacToeScore', JSON.stringify(score));
    } catch (e) {
        console.error('Failed to save score:', e);
    }
}

function loadScore() {
    try {
        const saved = localStorage.getItem('ticTacToeScore');
        if (saved) {
            const parsed = JSON.parse(saved);
            score.player1 = parsed.player1 || 0;
            score.player2 = parsed.player2 || 0;
            score.draws = parsed.draws || 0;
        }
    } catch (e) {
        console.error('Failed to load score:', e);
    }
}

// ===== Game Controls =====
function restartGame() {
    resetGameState();
    renderBoard();
    updateTurnIndicator();
}

function backToMenu() {
    showScreen('mode-selection');
    resetGameState();
    renderBoard();
}

// ===== Start Application =====
document.addEventListener('DOMContentLoaded', init);
