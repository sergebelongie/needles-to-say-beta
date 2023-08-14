const gameArea = document.getElementById("gameArea");
const clueElement = document.getElementById("clue");
const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const resultElement = document.getElementById("result");
const puzzleSelect = document.getElementById("puzzleSelect");

let currentPairIndex = 0;
let wordPairs = [];

async function fetchAndParseCSV() {
    const csvUrl = 'data.csv';
    const response = await fetch(csvUrl);
    const csvData = await response.text();
    
    wordPairs = Papa.parse(csvData, { header: true }).data;
    populatePuzzleSelect();
    displayClueAndCheckGuess();
}

function displayClueAndCheckGuess() {
    if (currentPairIndex < wordPairs.length) {
        const currentPair = wordPairs[currentPairIndex];
        clueElement.textContent = `Clue: ${currentPair.clue}`;
        
        submitBtn.disabled = false;
        resultElement.textContent = "";

        submitBtn.addEventListener("click", () => {
            const guess = guessInput.value.toLowerCase();
            if (guess === currentPair.answer.toLowerCase()) {
                resultElement.textContent = "Correct!";
            } else {
                resultElement.textContent = "Incorrect. Try again.";
            }

            guessInput.value = "";
            submitBtn.disabled = true;
        });
    } else {
        gameArea.innerHTML = "<p>Congratulations! You've completed all puzzles.</p>";
    }
}

function populatePuzzleSelect() {
    for (let i = 0; i < wordPairs.length; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `Puzzle ${i + 1}`;
        puzzleSelect.appendChild(option);
    }

    puzzleSelect.addEventListener("change", () => {
        currentPairIndex = parseInt(puzzleSelect.value);
        displayClueAndCheckGuess();
    });
}

fetchAndParseCSV();
