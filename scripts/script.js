const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Initializing game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
  // Resetting game variables and UI elements
  correctLetters = [];
  wrongGuessCount = 0;
  hangmanImage.src = "images/hangman-0.svg";
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  wordDisplay.innerHTML = currentWord
    .split("")
    .map(() => `<li class="letter"></li>`)
    .join("");
  keyboardDiv
    .querySelectorAll("button")
    .forEach((btn) => (btn.disabled = false));
  gameModal.classList.remove("show");
};

const getRandomWord = () => {
  // Selecting a random word and hint from the wordList
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word.toLowerCase(); // Making currentWord as random word and converting to lowercase
  document.querySelector(".hint-text b").innerText = hint;
  resetGame();
};

const gameOver = (isVictory) => {
  // After game complete.. showing modal with relevant details
  const modalText = isVictory ? `Jawabanmu:` : "Jawaban Benar:";
  gameModal.querySelector("img").src = `images/${
    isVictory ? "victory" : "lost"
  }.gif`;
  gameModal.querySelector("h4").innerText = isVictory
    ? "Selamat!"
    : "Gim Berakhir!";
  gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
  gameModal.classList.add("show");
};

const initGame = (button, clickedLetter) => {
  // Checking if clickedLetter is exist on the currentWord
  let found = false; // Menandakan apakah huruf yang ditebak ditemukan dalam kata
  if (currentWord.includes(clickedLetter)) {
    // Showing all correct letters on the word display
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        correctLetters.push(letter);
        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
        found = true;
      }
    });
  } else {
    // If clicked letter doesn't exist then update the wrongGuessCount and hangman image
    if (correctLetters.length === 0 && currentWord[0] === clickedLetter) {
      // If the first letter is correct, mark as found
      found = true;
    } else {
      wrongGuessCount++;
      hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
  }

  if (!found) {
    button.disabled = true; // Disabling the clicked button so user can't click again
  }

  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  // Calling gameOver function if any of these condition meets
  if (wrongGuessCount === maxGuesses) return gameOver(false);
  if (correctLetters.length === currentWord.length) return gameOver(true);
};

// Creating keyboard buttons for letters (a-z) and adding event listeners
for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);
  button.addEventListener("click", (e) =>
    initGame(e.target, String.fromCharCode(i))
  );
}

// Creating keyboard buttons for numbers (0-9) and adding event listeners
for (let i = 0; i <= 9; i++) {
  const button = document.createElement("button");
  button.innerText = i;
  keyboardDiv.appendChild(button);
  button.addEventListener("click", (e) => initGame(e.target, e.target.innerText)); // Menggunakan innerText dari tombol yang diklik
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
