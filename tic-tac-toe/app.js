let boxes = document.querySelectorAll(".box");
let newgamebtn = document.querySelector("#new");
let resetbtn = document.querySelector("#to-reset");
let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let vsHumanBtn = document.querySelector(".human");
let vsAiBtn = document.querySelector(".ai");

let turn0 = true; 
let isAiMode = false;
let board = ["", "", "", "", "", "", "", "", ""];

const winpatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Reset game
const resetgame = () => {
    turn0 = true;
    board = ["", "", "", "", "", "", "", "", ""];
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
    });
    msgcontainer.classList.add("hide");
}

// Mode buttons
vsHumanBtn.addEventListener('click', () => {
    isAiMode = false;
    vsHumanBtn.classList.add('active-mode');
    vsAiBtn.classList.remove('active-mode');
    resetgame();
});

vsAiBtn.addEventListener('click', () => {
    isAiMode = true;
    vsHumanBtn.classList.remove('active-mode');
    vsAiBtn.classList.add('active-mode');
    resetgame();
});

newgamebtn.addEventListener('click', resetgame);
resetbtn.addEventListener('click', resetgame);

// Check winner
const checkWinner = () => {
    for (let pattern of winpatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            msg.innerText = `Congrats! Winner is ${board[a]}`;
            msgcontainer.classList.remove("hide");
            boxes.forEach(box => box.disabled = true);
            return true;
        }
    }
    if (!board.includes("")) {
        msg.innerText = "It's a Draw!";
        msgcontainer.classList.remove("hide");
        return true;
    }
    return false;
};

// Minimax helpers
function evaluate(board) {
    for (let pattern of winpatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            if (board[a] === "X") return 10;
            if (board[a] === "0") return -10;
        }
    }
    return 0;
}

function isMovesLeft(board) {
    return board.includes("");
}

// Minimax function
function minimax(board, depth, isMax) {
    let score = evaluate(board);
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!isMovesLeft(board)) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "0";
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
}

// Find best move for AI
function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "X";
            let moveVal = minimax(board, 0, false);
            board[i] = "";
            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

// Box click handler
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if ((!isAiMode) || (isAiMode && turn0)) {
            // Human move
            box.innerText = turn0 ? "0" : "X";
            board[index] = turn0 ? "0" : "X";
            box.disabled = true;

            if (checkWinner()) return;

            turn0 = !turn0;

            // AI move
            if (isAiMode && !turn0) {
                setTimeout(()=>{
                let bestMove = findBestMove(board);
                board[bestMove] = "X";
                boxes[bestMove].innerText = "X";
                boxes[bestMove].disabled = true;

                checkWinner();
                turn0 = !turn0;
                },20);
            }
        }
    });
});
