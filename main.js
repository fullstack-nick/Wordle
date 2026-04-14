const WORD_API_URL = "https://random-word-api.herokuapp.com/word";
const BACKSPACE_KEY = "BACKSPACE";

let keyClick;
let keydownClick;
let WORD;
let brokenWORD;
let indexedArr = [];
let currentRow = 0;
let currentSquareIndex = 0;
let pendingTimeouts = [];
let activeGameRequestId = 0;

const difficultySelect = document.getElementById("difficulty-select");
const squares = document.querySelectorAll(".square");

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".again").forEach((button) => {
    button.addEventListener("click", startGame);
  });

  if (difficultySelect) {
    difficultySelect.addEventListener("change", startGame);
  }

  startGame();
});

function scheduleTask(callback, delay) {
  const timeoutId = setTimeout(() => {
    pendingTimeouts = pendingTimeouts.filter((id) => id !== timeoutId);
    callback();
  }, delay);

  pendingTimeouts.push(timeoutId);
}

function clearPendingTimeouts() {
  pendingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  pendingTimeouts = [];
}

function displaySections() {
  document.getElementById("game-board").classList.remove("none");
  document.getElementById("keyboard").classList.remove("none");
}

function hideSections() {
  document.getElementById("game-board").classList.add("none");
  document.getElementById("keyboard").classList.add("none");
}

function resetBoard() {
  squares.forEach((square) => {
    square.innerText = "";
    square.classList.remove("flip", "gray", "green", "yellow", "scale-up");
  });
}

function resetKeyboard() {
  document.querySelectorAll(".key").forEach((key) => {
    key.classList.remove("gray", "green", "yellow");
  });
}

function resetPopups() {
  document.querySelector("header").classList.remove("blurred");
  document.querySelector("main").classList.remove("blurred");
  document.querySelector("footer").classList.remove("blurred");
  document.getElementById("popup-success").classList.remove("active");
  document.getElementById("popup-loss").classList.remove("active");
  document.getElementById("loss-word").textContent = "";
}

function resetGameState() {
  WORD = "";
  brokenWORD = [];
  indexedArr = [];
  currentRow = 0;
  currentSquareIndex = 0;
}

function resetGameUi() {
  clearPendingTimeouts();
  removeListeners();
  resetBoard();
  resetKeyboard();
  resetPopups();
  resetGameState();
}

function setDifficultyDisabled(isDisabled) {
  if (difficultySelect) {
    difficultySelect.disabled = isDisabled;
  }
}

function getSelectedDifficulty() {
  return difficultySelect ? difficultySelect.value : "1";
}

function buildWordApiUrl() {
  const params = new URLSearchParams({
    number: "1",
    length: "5",
    diff: getSelectedDifficulty(),
  });

  return `${WORD_API_URL}?${params.toString()}`;
}

function normalizeWordResponse(wordResponse) {
  if (!Array.isArray(wordResponse) || typeof wordResponse[0] !== "string") {
    throw new Error("Unexpected word API response");
  }

  const normalizedWord = wordResponse[0].trim().toUpperCase();

  if (!/^[A-Z]{5}$/.test(normalizedWord)) {
    throw new Error("Word API did not return a valid 5-letter word");
  }

  return [normalizedWord];
}

function setWordState(word) {
  WORD = word;
  brokenWORD = WORD.split("");
  indexedArr = brokenWORD.map((letter, index) => ({
    letter,
    index,
    isGuessed: false,
  }));
}

async function startGame() {
  const requestId = ++activeGameRequestId;

  resetGameUi();
  hideSections();
  setDifficultyDisabled(true);

  try {
    const word = await fetchWord();

    if (requestId !== activeGameRequestId) {
      return;
    }

    setWordState(word[0]);
    displaySections();
    addListeners();
  } catch (error) {
    if (requestId !== activeGameRequestId) {
      return;
    }

    alert("Not able to fetch the word");
    console.error("Error fetching word:", error.message);
  } finally {
    if (requestId === activeGameRequestId) {
      setDifficultyDisabled(false);
    }
  }
}

function addListeners() {
  keyClick = function () {
    insertLetter(this.dataset.key || this.innerText);
  };

  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", keyClick);
  });

  keydownClick = (e) => {
    const key = e.key.toUpperCase();
    const isLetter = /^[A-Z]$/.test(key);

    if (isLetter || key === "ENTER" || key === "BACKSPACE") {
      insertLetter(key === "BACKSPACE" ? BACKSPACE_KEY : key);
    }
  };

  document.addEventListener("keydown", keydownClick);
}

function removeListeners() {
  document.querySelectorAll(".key").forEach((key) => {
    key.removeEventListener("click", keyClick);
  });

  document.removeEventListener("keydown", keydownClick);
}

function insertLetter(letter) {
  if (letter !== "ENTER" && letter !== BACKSPACE_KEY) {
    if (currentSquareIndex < 5) {
      const square = document.getElementById(`square-${currentRow}-${currentSquareIndex}`);
      square.innerText = letter;
      square.classList.add("scale-up");
      scheduleTask(() => {
        square.classList.remove("scale-up");
      }, 50);
      currentSquareIndex++;
    }
  } else if (letter === BACKSPACE_KEY) {
    if (currentSquareIndex > 0) {
      const square = document.getElementById(`square-${currentRow}-${currentSquareIndex - 1}`);
      square.innerText = "";
      currentSquareIndex--;
    }
  } else if (letter === "ENTER") {
    wordCheck();
  }
}

function instancesChecked(letter) {
  const matches = indexedArr.filter((item) => item.letter === letter);

  if (matches.length === 0) {
    return "not in the word";
  }

  return matches.every((item) => item.isGuessed);
}

function setLetterState(letter, index) {
  indexedArr.forEach((el) => {
    if (el.letter === letter && el.index === index) {
      el.isGuessed = true;
    }
  });
}

function wordCheck() {
  indexedArr.forEach((obj) => {
    obj.isGuessed = false;
  });

  if (currentSquareIndex === 5) {
    const rowToCheck = currentRow;
    let summary = 0;
    const insertedLetters = [];

    for (let g = 0; g < 5; g++) {
      insertedLetters.push([document.getElementById(`square-${rowToCheck}-${g}`).innerText, g]);
    }

    for (let i = 0; i < 5; i++) {
      scheduleTask(
        () => {
          const letter = document.getElementById(`square-${rowToCheck}-${i}`).innerText;
          const smLetter = letter.toLowerCase();
          document.getElementById(`square-${rowToCheck}-${i}`).classList.add("flip");

          if (letter === brokenWORD[i]) {
            document.getElementById(`square-${rowToCheck}-${i}`).classList.add("green");
            setLetterState(letter, i);
            summary++;
            document.getElementById(smLetter).classList.add("green");
          } else {
            for (const el of brokenWORD) {
              if (letter === el) {
                document.getElementById(`square-${rowToCheck}-${i}`).classList.add("yellow");
                document.getElementById(smLetter).classList.add("yellow");
              }
            }

            document.getElementById(`square-${rowToCheck}-${i}`).classList.add("gray");

            if (
              !document.getElementById(smLetter).classList.contains("yellow") &&
              !document.getElementById(smLetter).classList.contains("green")
            ) {
              document.getElementById(smLetter).classList.add("gray");
            }
          }
        },
        i === 0 ? 0 : i * 400
      );
    }

    scheduleTask(() => {
      insertedLetters.forEach((l) => {
        if (instancesChecked(l[0], l[1]) === "not in the word") {
          document.getElementById(l[0].toLowerCase()).classList.remove("green");
          document.getElementById(l[0].toLowerCase()).classList.remove("yellow");
          document.getElementById(l[0].toLowerCase()).classList.add("gray");
        } else if (!instancesChecked(l[0], l[1])) {
          document.getElementById(l[0].toLowerCase()).classList.remove("green");
          document.getElementById(l[0].toLowerCase()).classList.remove("gray");
          document.getElementById(l[0].toLowerCase()).classList.add("yellow");
        } else if (instancesChecked(l[0], l[1])) {
          document.getElementById(l[0].toLowerCase()).classList.remove("yellow");
          document.getElementById(l[0].toLowerCase()).classList.remove("gray");
          document.getElementById(l[0].toLowerCase()).classList.add("green");

          insertedLetters.forEach((letter) => {
            if (letter[0] === l[0] && letter[1] !== l[1]) {
              document.getElementById(`square-${rowToCheck}-${letter[1]}`).classList.remove("yellow");
              document.getElementById(`square-${rowToCheck}-${letter[1]}`).classList.add("gray");
            }
          });
        }
      });

      let yellowCount = 0;
      let trueCount;
      const yellowObj = {};

      for (let m = 0; m < 5; m++) {
        if (document.getElementById(`square-${rowToCheck}-${m}`).classList.contains("yellow")) {
          const letter = document.getElementById(`square-${rowToCheck}-${m}`).innerText;

          if (!yellowObj[letter]) {
            yellowObj[letter] = [];
          }

          yellowObj[letter].push(m);
          yellowCount++;
        }
      }

      if (yellowCount > 1) {
        for (const key in yellowObj) {
          trueCount = 0;
          brokenWORD.forEach((letter) => {
            if (letter === key) {
              trueCount++;
            }
          });

          if (yellowObj[key].length > trueCount) {
            yellowObj[key] = yellowObj[key].slice(0, trueCount);

            for (let q = 0; q < 5; q++) {
              if (
                document.getElementById(`square-${rowToCheck}-${q}`).classList.contains("yellow") &&
                document.getElementById(`square-${rowToCheck}-${q}`).innerText === key &&
                !yellowObj[key].includes(q)
              ) {
                document.getElementById(`square-${rowToCheck}-${q}`).classList.remove("yellow");
                document.getElementById(`square-${rowToCheck}-${q}`).classList.add("gray");
              }
            }
          }
        }
      }

      if (rowToCheck === 5 && summary !== 5) {
        document.querySelector("header").classList.add("blurred");
        document.querySelector("main").classList.add("blurred");
        document.querySelector("footer").classList.add("blurred");
        document.getElementById("loss-word").textContent = WORD;
        document.getElementById("popup-loss").classList.add("active");
      }

      if (summary === 5) {
        document.querySelector("header").classList.add("blurred");
        document.querySelector("main").classList.add("blurred");
        document.querySelector("footer").classList.add("blurred");
        document.getElementById("popup-success").classList.add("active");
      }
    }, 5 * 400);

    currentSquareIndex = 0;
    currentRow++;
  } else if (!document.getElementById("square-5-4").innerText) {
    alert("Not enough letters");
  } else if (document.getElementById("square-5-4").innerText) {
    removeListeners();
  }
}

async function fetchWord() {
  const response = await fetch(buildWordApiUrl());

  if (!response.ok) {
    throw new Error(`Word API returned ${response.status}`);
  }

  const wordResponse = await response.json();
  return normalizeWordResponse(wordResponse);
}
