# 🧠 Memory Match

A responsive **Memory Card Matching Game** built with vanilla HTML, CSS and JavaScript.

The player flips cards two at a time and tries to find all eight matching pairs using as few moves and as little time as possible.

## Features

- 16 cards with 8 matching pairs
- Randomized card shuffle on every new game
- Animated card flipping
- Automatic match detection
- Move counter
- Live timer
- Score calculation
- Session best-score tracking
- Win/completion modal
- Restart / New Game functionality
- Responsive layout for desktop and mobile
- Keyboard-accessible buttons
- Reduced-motion support

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- CSS Grid
- DOM Manipulation
- Browser Session Storage

## Project Structure

```text
memory-card-game/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

### Option 1 — Open directly

Download or clone the repository and open `index.html` in a modern browser.

### Option 2 — VS Code

1. Open the project folder in VS Code.
2. Open `index.html`.
3. Run it with a local development extension such as Live Server, or open the file directly in your browser.

No package installation is required.

## How the Game Works

1. The game creates two copies of eight symbols.
2. The deck is shuffled using the Fisher-Yates shuffle algorithm.
3. When a player selects a card, JavaScript reveals it.
4. A second selection triggers a comparison of the two card values.
5. Matching cards remain visible.
6. Non-matching cards are flipped back after a short delay.
7. The game ends after all eight pairs are matched.

## Scoring

The initial score is 1000.

The score decreases based on elapsed time and unnecessary moves. The best score is retained for the current browser session.

## GitHub

```bash
git init
git add .
git commit -m "Add memory card matching game"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your own GitHub repository URL.

## CV Description

**Memory Card Matching Game | HTML, CSS, JavaScript | GitHub**

- Developed an interactive memory card game with randomized card generation, pair-matching logic and game-state management.
- Implemented card-flip animations, move tracking, timer functionality, score calculation and restart controls using JavaScript.
- Designed a responsive and accessible user interface using HTML5, CSS3 and JavaScript DOM manipulation.

## Future Improvements

- Difficulty levels
- Sound effects
- Multiple card themes
- Persistent high scores using localStorage
- Dark/light theme switcher
- Online leaderboard
