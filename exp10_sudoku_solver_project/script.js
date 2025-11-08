let board = Array.from({ length: 9 }, () => Array(9).fill(0));
let originalBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
let currentDifficulty = "easy";
let puzzlesGenerated = 0;
let puzzlesSolved = 0;

const difficultyLevels = { easy: 35, medium: 45, hard: 52, expert: 58 };

function updateStats() {
  document.getElementById("puzzles-generated").textContent = puzzlesGenerated;
  document.getElementById("puzzles-solved").textContent = puzzlesSolved;
  document.getElementById("current-difficulty").textContent =
    currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
}

function setControlsDisabled(disabled) {
  document.querySelectorAll("button").forEach((b) => (b.disabled = disabled));
  const fileEl = document.getElementById("sudoku-file");
  if (fileEl) fileEl.disabled = disabled;
  const loader = document.getElementById("loader");
  if (loader) loader.classList.toggle("show", disabled);
}

function setDifficulty(level, ev) {
  currentDifficulty = level;
  document
    .querySelectorAll(".difficulty-btn")
    .forEach((btn) => btn.classList.remove("active"));
  if (ev && ev.currentTarget) ev.currentTarget.classList.add("active");
  updateStats();
  setTimeout(generatePuzzle, 300);
}

function initGrid() {
  const grid = document.getElementById("sudoku-grid");
  grid.innerHTML = "";
  for (let idx = 0; idx < 81; idx++) {
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    const cell = document.createElement("div");
    cell.className = "cell";
    if ((col + 1) % 3 === 0 && col !== 8) cell.classList.add("right-border");
    if ((row + 1) % 3 === 0 && row !== 8) cell.classList.add("bottom-border");
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.inputMode = "numeric";
    input.id = `cell-${idx}`;
    input.addEventListener("input", (e) => {
      const value = e.target.value;
      if (!/^[1-9]$/.test(value)) e.target.value = "";
      updateBoardFromInputs();
    });
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text");
      const ch = text.trim()[0] || "";
      if (/^[1-9]$/.test(ch)) e.target.value = ch;
      updateBoardFromInputs();
    });
    cell.appendChild(input);
    grid.appendChild(cell);
  }
}

function updateBoardFromInputs() {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++) {
      const input = document.getElementById(`cell-${i * 9 + j}`);
      board[i][j] = parseInt(input.value) || 0;
    }
}

function displayBoard() {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++) {
      const input = document.getElementById(`cell-${i * 9 + j}`);
      const cell = input.parentElement;
      input.value = board[i][j] === 0 ? "" : board[i][j];
      if (originalBoard[i][j] !== 0) {
        cell.classList.add("original");
        cell.classList.remove("solved");
        input.disabled = true;
      } else if (board[i][j] !== 0) {
        cell.classList.add("solved");
        cell.classList.remove("original");
        input.disabled = false;
      } else {
        cell.classList.remove("original", "solved");
        input.disabled = false;
      }
    }
}

function isValid(boardState, num, row, col) {
  for (let j = 0; j < 9; j++)
    if (boardState[row][j] === num && j !== col) return false;
  for (let i = 0; i < 9; i++)
    if (boardState[i][col] === num && i !== row) return false;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++)
    for (let j = boxCol; j < boxCol + 3; j++)
      if (boardState[i][j] === num && (i !== row || j !== col)) return false;
  return true;
}

function findEmpty(boardState) {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      if (boardState[i][j] === 0) return [i, j];
  return null;
}

function solve(boardState) {
  const empty = findEmpty(boardState);
  if (!empty) return true;
  const [row, col] = empty;
  for (let num = 1; num <= 9; num++) {
    if (isValid(boardState, num, row, col)) {
      boardState[row][col] = num;
      if (solve(boardState)) return true;
      boardState[row][col] = 0;
    }
  }
  return false;
}

async function solveSudoku() {
  updateBoardFromInputs();
  originalBoard = board.map((r) => [...r]);
  const hasNumbers = board.some((r) => r.some((c) => c !== 0));
  if (!hasNumbers) {
    showStatus("Please enter some numbers first or generate a puzzle!", "error");
    return;
  }
  showStatus("Solving...", "info");
  setControlsDisabled(true);
  await new Promise((res) => setTimeout(res, 40));
  const boardCopy = board.map((r) => [...r]);
  const ok = solve(boardCopy);
  if (ok) {
    board = boardCopy.map((r) => [...r]);
    displayBoard();
    puzzlesSolved++;
    updateStats();
    showStatus("Puzzle solved successfully.", "success");
  } else {
    showStatus("No solution exists for this puzzle. Check your entries.", "error");
  }
  setControlsDisabled(false);
}

function clearBoard() {
  board = Array.from({ length: 9 }, () => Array(9).fill(0));
  originalBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  displayBoard();
  hideStatus();
}

function generatePuzzle() {
  setControlsDisabled(true);
  board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillDiagonalBoxes();
  const solved = board.map((r) => [...r]);
  if (!solve(solved)) {
    showStatus("Failed to generate a valid solved board. Try again.", "error");
    setControlsDisabled(false);
    return;
  }
  board = solved.map((r) => [...r]);
  const cellsToRemove = difficultyLevels[currentDifficulty] || difficultyLevels.easy;
  removeCells(cellsToRemove);
  originalBoard = board.map((r) => [...r]);
  displayBoard();
  puzzlesGenerated++;
  updateStats();
  const given = 81 - cellsToRemove;
  showStatus(`${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)} puzzle generated. ${given} cells given.`, "success");
  setControlsDisabled(false);
}

function fillDiagonalBoxes() {
  for (let k = 0; k < 3; k++) fillBox(k * 3, k * 3);
}

function fillBox(row, col) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let idx = 0;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) board[row + i][col + j] = nums[idx++];
}

function removeCells(count) {
  let removed = 0;
  let attempts = 0;
  const maxAttempts = count * 15 + 200;
  while (removed < count && attempts < maxAttempts) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] === 0) {
      attempts++;
      continue;
    }
    const backup = board[row][col];
    board[row][col] = 0;
    const boardCopy = board.map((r) => [...r]);
    if (hasUniqueSolution(boardCopy)) removed++;
    else board[row][col] = backup;
    attempts++;
  }
}

function hasUniqueSolution(boardState) {
  let solutions = 0;
  function countSolutions(bs) {
    if (solutions > 1) return;
    const empty = findEmpty(bs);
    if (!empty) {
      solutions++;
      return;
    }
    const [r, c] = empty;
    for (let n = 1; n <= 9; n++) {
      if (isValid(bs, n, r, c)) {
        bs[r][c] = n;
        countSolutions(bs);
        bs[r][c] = 0;
        if (solutions > 1) return;
      }
    }
  }
  const copy = boardState.map((r) => [...r]);
  countSolutions(copy);
  return solutions === 1;
}

function showStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = "status " + (type || "info");
  if (type !== "error") {
    setTimeout(() => {
      if (!status.className.includes("error")) hideStatus();
    }, 4000);
  }
}

function hideStatus() {
  const status = document.getElementById("status");
  status.className = "status";
  status.textContent = "";
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const content = e.target.result;
      const lines = content.split("\n");
      if (lines.length < 9) {
        showStatus("Invalid file format. File must contain 9 lines.", "error");
        return;
      }
      const newBoard = [];
      for (let i = 0; i < 9; i++) {
        const row = lines[i].trim().split(/[,\\s]+/).map((num) => parseInt(num) || 0);
        if (row.length !== 9) {
          showStatus("Invalid format. Each line must have 9 numbers.", "error");
          return;
        }
        newBoard.push(row);
      }
      board = newBoard;
      originalBoard = board.map((r) => [...r]);
      displayBoard();
      showStatus("Puzzle loaded successfully from file.", "success");
    } catch (error) {
      showStatus(`Error reading file: ${error.message}`, "error");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

initGrid();
setTimeout(generatePuzzle, 200);
