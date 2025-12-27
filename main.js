document.addEventListener("DOMContentLoaded", () => {
  fetchWord();
  const agains = document.querySelectorAll(".again");
  agains.forEach((btt) => [
    btt.addEventListener("click", () => {
      location.reload();
    }),
  ]);
  // document.getElementById("popup").classList.toggle("active");
});

function displaySections() {
  document.getElementById("game-board").classList.remove("none");
  document.getElementById("keyboard").classList.remove("none");
}

let keyClick;
let keydownClick;

function addListeners() {
  keyClick = function (e) {
    insertLetter(this.innerText);
  };
  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", keyClick);
  });

  keydownClick = (e) => {
    let key = e.key.toUpperCase();
    const isLetter = /^[A-Z]$/.test(key);
    if (isLetter || key === "ENTER" || key === "BACKSPACE") {
      insertLetter(key === "BACKSPACE" ? "⌫" : key);
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

let WORD;
let brokenWORD;
let indexedArr;
let currentRow = 0;

const squares = document.querySelectorAll(".square");
let currentSquareIndex = 0;
function insertLetter(letter) {
  // const row = document.getElementById(`row-${currentRow}`)
  if (letter !== "ENTER" && letter !== "⌫") {
    if (currentSquareIndex < 5) {
      // let square = squares[currentSquareIndex];
      let square = document.getElementById(`square-${currentRow}-${currentSquareIndex}`);
      square.innerText = letter;
      square.classList.add("scale-up");
      setTimeout(() => {
        square.classList.remove("scale-up");
      }, 50);
      currentSquareIndex++;
    }
  } else if (letter === "⌫") {
    if (document.getElementById(`square-${currentRow}-${currentSquareIndex - 1}`) !== undefined) {
      let square = document.getElementById(`square-${currentRow}-${currentSquareIndex - 1}`);
      square.innerText = "";
      currentSquareIndex === 0 ? 0 : currentSquareIndex--;
    }
  } else if (letter === "ENTER") {
    wordCheck();
  }
}

// function wordCheck() {
//     console.log(WORD);
//     brokenWORD = WORD.split('');
//     console.log(brokenWORD);
//     if (currentSquareIndex === 5) {
//         for (let i = 0; i < 5; i++) {
//             console.log(document.getElementById(`square-${currentRow}-${i}`).innerText)
//             const letter = document.getElementById(`square-${currentRow}-${i}`).innerText;
//             const smLetter = letter.toLowerCase();
//             document.getElementById(`square-${currentRow}-${i}`).classList.add("flip");
//             if (letter == brokenWORD[i]) {
//                 document.getElementById(`square-${currentRow}-${i}`).classList.add("green");
//                 document.getElementById(smLetter).classList.add("green");
//             } else {
//                 for (let el of brokenWORD) {
//                     if (letter === el) {
//                         document.getElementById(`square-${currentRow}-${i}`).classList.add("yellow")
//                         document.getElementById(smLetter).classList.add("yellow");
//                     }
//                 }
//                 if (!document.getElementById(`square-${currentRow}-${i}`).classList.contains("yellow")) {
//                     document.getElementById(`square-${currentRow}-${i}`).classList.add("gray");
//                     document.getElementById(smLetter).classList.add("gray");
//                 }
//             }
//         }

//         currentSquareIndex = 0;
//         currentRow++;
//     } else {
//         alert("Not enough letters");
//     }
// }

function instancesChecked(letter, i) {
  const matches = indexedArr.filter((item) => item.letter === letter);

  if (matches.length === 0) {
    return "not in the word";
  }

  return matches.every((item) => item.isGuessed);

  // let foundMatch = false;

  // for (let i = 0; i < indexedArr.length; i++) {
  //     if (indexedArr[i].letter === letter) {
  //         foundMatch = true;

  //         if (!indexedArr[i].isGuessed) {
  //             return false;
  //           }
  //     }
  // }

  // return foundMatch;

  // for (const el of indexedArr) {
  //     if (el.letter === letter) {
  //         if (el.isGuessed === true) {
  //             continue;
  //         } else {
  //             return false;
  //         }
  //     }
  // }
  // indexedArr.forEach(el => {
  //     if (el.letter === letter) {

  //     }
  // })
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
    obj["isGuessed"] = false;
  });

  if (currentSquareIndex === 5) {
    const rowToCheck = currentRow;
    let summary = 0;
    let currenSmLetter = [];
    let insertedLetters = [];
    for (let g = 0; g < 5; g++) {
      insertedLetters.push([document.getElementById(`square-${rowToCheck}-${g}`).innerText, g]);
    }

    for (let i = 0; i < 5; i++) {
      setTimeout(
        () => {
          const letter = document.getElementById(`square-${rowToCheck}-${i}`).innerText;
          const smLetter = letter.toLowerCase();
          currenSmLetter.push(smLetter);
          document.getElementById(`square-${rowToCheck}-${i}`).classList.add("flip");
          if (letter == brokenWORD[i]) {
            document.getElementById(`square-${rowToCheck}-${i}`).classList.add("green");
            setLetterState(letter, i);
            summary++;
            document.getElementById(smLetter).classList.add("green");
            // if ((!document.getElementById(smLetter).classList.contains("yellow"))) {
            //     document.getElementById(smLetter).classList.add("green");
            // } else if (document.getElementById(smLetter).classList.contains("yellow")) {
            //     if (instancesChecked(letter)) {
            //         document.getElementById(smLetter).classList.add("green");
            //     }
            // } else {
            //     document.getElementById(smLetter).classList.add("green");
            // }
          } else {
            for (let el of brokenWORD) {
              if (letter === el) {
                document.getElementById(`square-${rowToCheck}-${i}`).classList.add("yellow");
                document.getElementById(smLetter).classList.add("yellow");
              }
            }
            document.getElementById(`square-${rowToCheck}-${i}`).classList.add("gray");
            if (!document.getElementById(smLetter).classList.contains("yellow") && !document.getElementById(smLetter).classList.contains("green")) {
              document.getElementById(smLetter).classList.add("gray");
            }
          }

          // if (summary === 5) {
          //     currenSmLetter.forEach(letter => {
          //         document.getElementById(letter).classList.add("green");
          //     })
          // }
        },
        i === 0 ? 0 : i * 400
      );
    }

    setTimeout(() => {
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
      let yellowObj = {};
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
        for (let key in yellowObj) {
          trueCount = 0;
          brokenWORD.forEach((letter) => {
            if (letter === key) trueCount++;
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
        const lossWord = document.getElementById("loss-word");
        if (lossWord) {
          lossWord.textContent = WORD;
        }
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
  const URL = "https://random-word-api.vercel.app/api?words=1&length=5&type=uppercase";

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      alert("Not able to fetch the word");
      throw new Error("No word returned");
    }
    const word = await response.json();
    WORD = word[0];
    brokenWORD = WORD.split("");
    indexedArr = brokenWORD.map((letter, index) => ({
      letter,
      index,
      isGuessed: false,
    }));
    displaySections();
    addListeners();
  } catch (error) {
    console.error("Error fetching word:", error.message);
  }
}
