const symbols = ["🍎","🚀","🎮","⚡","🐼","🎵","🌟","🧩"];

const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const statusEl = document.getElementById("status");
const newGameBtn = document.getElementById("newGame");
const modal = document.getElementById("winModal");
const winText = document.getElementById("winText");
const playAgainBtn = document.getElementById("playAgain");

let firstCard = null;
let secondCard = null;
let locked = false;
let moves = 0;
let pairs = 0;
let seconds = 0;
let timer = null;
let started = false;
let score = 1000;

let bestScore = Number(localStorage.getItem("memoryBestScore")) || 0;

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function timeText(value) {
  const min = Math.floor(value / 60).toString().padStart(2, "0");
  const sec = (value % 60).toString().padStart(2, "0");
  return min + ":" + sec;
}

function getScore() {
  return Math.max(0, 1000 - (seconds * 3) - (Math.max(0, moves - 8) * 20));
}

function updateStats() {
  score = getScore();
  movesEl.textContent = moves;
  timerEl.textContent = timeText(seconds);
  scoreEl.textContent = score;
  bestEl.textContent = bestScore || "—";
}

function startTimer() {
  if (timer !== null) return;
  timer = setInterval(() => {
    seconds += 1;
    updateStats();
  }, 1000);
}

function stopTimer() {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

function makeCard(symbol, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.symbol = symbol;
  card.dataset.index = index;
  card.setAttribute("aria-label", "Hidden memory card");

  card.innerHTML =
    '<span class="card-inner">' +
      '<span class="card-face card-back" aria-hidden="true"></span>' +
      '<span class="card-face card-front" aria-hidden="true">' + symbol + '</span>' +
    '</span>';

  card.addEventListener("click", () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (
    locked ||
    card === firstCard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) return;

  if (!started) {
    started = true;
    startTimer();
  }

  card.classList.add("flipped");
  card.setAttribute("aria-label", "Card showing " + card.dataset.symbol);

  if (firstCard === null) {
    firstCard = card;
    statusEl.textContent = "Choose another card.";
    return;
  }

  secondCard = card;
  moves += 1;
  updateStats();
  compareCards();
}

function compareCards() {
  const match = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (match) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    pairs += 1;

    statusEl.textContent = "Match found! " + pairs + " of " + symbols.length + " pairs completed.";
    resetTurn();

    if (pairs === symbols.length) finishGame();
    return;
  }

  locked = true;
  statusEl.textContent = "Not a match. Try again.";

  const cardA = firstCard;
  const cardB = secondCard;

  setTimeout(() => {
    cardA.classList.remove("flipped");
    cardB.classList.remove("flipped");
    cardA.setAttribute("aria-label", "Hidden memory card");
    cardB.setAttribute("aria-label", "Hidden memory card");
    resetTurn();
  }, 700);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  locked = false;
}

function finishGame() {
  stopTimer();
  score = getScore();

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("memoryBestScore", String(bestScore));
  }

  updateStats();
  statusEl.textContent = "All pairs matched!";
  winText.textContent =
    "You finished in " + moves + " moves, " + timeText(seconds) +
    ", with a score of " + score + ".";
  modal.classList.remove("hidden");
}

function newGame() {
  stopTimer();

  firstCard = null;
  secondCard = null;
  locked = false;
  moves = 0;
  pairs = 0;
  seconds = 0;
  started = false;
  score = 1000;

  modal.classList.add("hidden");
  board.replaceChildren();

  shuffle([...symbols, ...symbols]).forEach((symbol, index) => {
    board.appendChild(makeCard(symbol, index));
  });

  statusEl.textContent = "Find all 8 matching pairs.";
  updateStats();
}

newGameBtn.addEventListener("click", newGame);
playAgainBtn.addEventListener("click", newGame);

newGame();
