# Wordle

A browser-based Wordle word guessing game with a 5-letter grid, animated feedback, a difficulty selector, and a public random word API.

## Overview

This project is a static, single-page Wordle clone that runs entirely in the browser. It fetches a random 5-letter word from a public API, lets the player choose a difficulty, renders a 6x5 grid, and provides immediate visual feedback for each guess.

Key characteristics visible in the codebase:

- No backend or build pipeline in this repo; everything is client-side.
- The game board and keyboard appear only after a word is successfully fetched for the selected difficulty.
- Win and loss states are presented as modal popups with a "play again" action.

## Features

### Core Gameplay

- Six attempts to guess a 5-letter word, with letter placement and count logic handled in the browser.
- Real-time evaluation with green/yellow/gray feedback per letter and per position.
- Duplicate-letter handling that keeps keyboard and tile states consistent with the word's letter counts.
- Difficulty selector with `Easy`, `Medium`, and `Hard` modes.
- Random target word fetched from `https://random-word-api.herokuapp.com/word`.
- Difficulty mapping uses `diff=1` for Easy, `diff=2` for Medium, and `diff=3` for Hard.

### Input and Feedback

- On-screen keyboard with click input plus physical keyboard support.
- Enter submits a guess; Backspace deletes the last letter.
- Tile flip and scale animations on entry and evaluation.
- "Not enough letters" alert when submitting incomplete guesses.

### End States

- Win popup with a congratulatory message.
- Loss popup revealing the correct word after the final attempt.
- "Play again" starts a fresh round without reloading the page.

## Typical User Workflow

1. The user opens the page. The app requests a random 5-letter word from the API using the default `Easy` difficulty.
2. After the word is fetched, the 6x5 board and keyboard become visible.
3. The user enters letters either by clicking the on-screen keys or using the physical keyboard.
4. Once five letters are entered, the user presses Enter to submit the guess.
5. Tiles flip in sequence, showing green for correct letters in correct positions, yellow for correct letters in the wrong positions, and gray for letters not in the word. The on-screen keyboard updates to match.
6. The user repeats the process for up to six rows, using Backspace to correct mistakes as needed.
7. If all letters match the target word, a win popup appears. If the sixth attempt is used without a win, a loss popup appears and shows the correct word.
8. Changing the difficulty or clicking "Play again" starts a fresh round with a new word without reloading the page.

## Tech Stack

- Frontend: Vanilla HTML, CSS, and JavaScript with direct DOM manipulation.
- Styling: Custom CSS with animations for tile flips and responsive adjustments for small screens.
- Fonts and icons: Google Fonts (Inter) and Font Awesome loaded via CDN.
- API: `fetch` calls to `https://random-word-api.herokuapp.com/word?number=1&length=5&diff=1|2|3` to retrieve a single 5-letter word.

Architecture-wise, the browser loads static files (`index.html`, `style.css`, `main.js`), then `main.js` fetches the target word for the selected difficulty, normalizes the response into the same single-item array shape the original code expected, and drives all rendering and game logic in-memory.

## Architecture / Project Structure

- `main.js` contains the difficulty-aware word API integration, response normalization, and the core gameplay logic.
- `index.html` defines the grid layout, keyboard markup, and popup structure.
- `style.css` controls the color theme, animations, and responsive layout.

## Security / Privacy Notes

- The only network request is a GET call to `random-word-api.herokuapp.com`; no user input is sent to any server.
- No authentication, cookies, or local storage are used.
- All game state is stored in memory and reset when a new round starts.

## Live Demo

[Open the app](https://my-wordle-game.vercel.app/)
