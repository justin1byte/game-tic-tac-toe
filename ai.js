// ===== AI Move Decision =====
function getAIMove(board, difficulty) {
    switch (difficulty) {
        case 'easy':
            return easyAI(board);
        case 'medium':
            return mediumAI(board);
        case 'hard':
            return hardAI(board);
        default:
            return easyAI(board);
    }
}

// ===== Easy AI: Random Selection =====
function easyAI(board) {
    const availableSpots = getAvailableSpots(board);

    if (availableSpots.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableSpots.length);
    return availableSpots[randomIndex];
}

// ===== Medium AI: Basic Tactics =====
function mediumAI(board) {
    const winningMove = findWinningMove(board, 'O');
    if (winningMove !== null) return winningMove;

    const blockingMove = findWinningMove(board, 'X');
    if (blockingMove !== null) return blockingMove;

    if (board[4] === '') return 4;

    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === '');
    if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        return randomCorner;
    }

    return easyAI(board);
}

// ===== Find Winning Move Helper =====
function findWinningMove(board, player) {
    const availableSpots = getAvailableSpots(board);

    for (let spot of availableSpots) {
        const testBoard = [...board];
        testBoard[spot] = player;

        if (checkWinnerAI(testBoard) === player) {
            return spot;
        }
    }

    return null;
}

// ===== Hard AI: Minimax Algorithm =====
function hardAI(board) {
    let bestScore = -Infinity;
    let bestMove = null;

    const availableSpots = getAvailableSpots(board);

    for (let spot of availableSpots) {
        board[spot] = 'O';

        const score = minimax(board, 0, false);

        board[spot] = '';

        if (score > bestScore) {
            bestScore = score;
            bestMove = spot;
        }
    }

    return bestMove;
}

// ===== Minimax Algorithm =====
function minimax(board, depth, isMaximizing) {
    const winner = checkWinnerAI(board);

    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'draw') return 0;

    const availableSpots = getAvailableSpots(board);

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let spot of availableSpots) {
            board[spot] = 'O';
            const score = minimax(board, depth + 1, false);
            board[spot] = '';
            bestScore = Math.max(score, bestScore);
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let spot of availableSpots) {
            board[spot] = 'X';
            const score = minimax(board, depth + 1, true);
            board[spot] = '';
            bestScore = Math.min(score, bestScore);
        }

        return bestScore;
    }
}

// ===== Helper: Get Available Spots =====
function getAvailableSpots(board) {
    const spots = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            spots.push(i);
        }
    }
    return spots;
}

// ===== Helper: Check Winner (AI Version) =====
function checkWinnerAI(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.every(cell => cell !== '')) {
        return 'draw';
    }

    return null;
}
