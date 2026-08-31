const symbols = ["🍎", "🚀", "🎮", "⚡", "🐼", "🎵", "🌟", "🧩"];

const board = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");
const statusEl = document.getElementById("status");
const newGameBtn = document.getElementById("newGameBtn");
const winModal = document.getElementById("winModal");
const winMessage = document.getElementById("winMessage");
const playAgainBtn = document.getElementById("playAgainBtn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerId = null;
let gameStarted = false;
let score = 1000;
let bestScore = Number(sessionStorage.getItem("memoryBestScore")) || 0;

bestScoreEl.textContent = bestScore || "—";

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }

  return copy;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const secondsPart = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secondsPart}`;
}

function updateStats() {
  movesEl.textContent = moves;
  timerEl.textContent = formatTime(seconds);
  scoreEl.textContent = Math.max(0, score);
  bestScoreEl.textContent = bestScore || "—";
}

function calculateScore() {
  const timePenalty = seconds * 3;
  const movePenalty = Math.max(0, moves - 8) * 20;
  return Math.max(0, 1000 - timePenalty - movePenalty);
}

function startTimer() {
  if (timerId !== null) return;

  timerId = setInterval(() => {
    seconds += 1;
    score = calculateScore();
    updateStats();
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function createCard(symbol, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.symbol = symbol;
  card.dataset.index = index;
  card.setAttribute("aria-label", "Hidden memory card");

  card.innerHTML = `
    <span class="card-inner">
      <span class="card-face card-back" aria-hidden="true"></span>
      <span class="card-face card-front" aria-hidden="true">${symbol}</span>
    </span>
  `;

  card.addEventListener("click", () => handleCardClick(card));
  return card;
}

function handleCardClick(card) {
  if (
    lockBoard ||
    card === firstCard ||
    card.classList.contains("matched") ||
    card.classList.contains("flipped")
  ) {
    return;
  }

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
    statusEl.textContent = "Good luck! Find the matching pairs.";
  }

  card.classList.add("flipped");
  card.setAttribute("aria-label", `Card showing ${card.dataset.symbol}`);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves += 1;
  score = calculateScore();
  updateStats();
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.disabled = true;
    secondCard.disabled = true;

    matchedPairs += 1;
    statusEl.textContent = `Match found! ${matchedPairs} of 8 pairs completed.`;
    resetTurn();

    if (matchedPairs === symbols.length) {
      finishGame();
    }

    return;
  }

  lockBoard = true;
  statusEl.textContent = "Not a match. Try again.";

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard.setAttribute("aria-label", "Hidden memory card");
    secondCard.setAttribute("aria-label", "Hidden memory card");
    resetTurn();
  }, 750);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function finishGame() {
  stopTimer();
  score = calculateScore();

  if (score > bestScore) {
    bestScore = score;
    sessionStorage.setItem("memoryBestScore", String(bestScore));
  }

  updateStats();
  statusEl.textContent = "All pairs matched!";

  winMessage.textContent =
    `You finished in ${moves} moves and ${formatTime(seconds)} with a score of ${score}.`;

  winModal.classList.remove("hidden");
  playAgainBtn.focus();
}

function newGame() {
  stopTimer();

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  seconds = 0;
  score = 1000;
  gameStarted = false;

  winModal.classList.add("hidden");
  board.replaceChildren();

  const deck = shuffle([...symbols, ...symbols]);

  deck.forEach((symbol, index) => {
    board.appendChild(createCard(symbol, index));
  });

  statusEl.textContent = "Find all 8 matching pairs.";
  updateStats();
}

newGameBtn.addEventListener("click", newGame);
playAgainBtn.addEventListener("click", newGame);

newGame();
