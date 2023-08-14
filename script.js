const gameArea = document.getElementById("gameArea");
const clueElement = document.getElementById("clue");
const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const resultElement = document.getElementById("result");

let currentPairIndex = 0;
let wordPairs = [];

// Fetch and parse the CSV data
async function fetchAndParseCSV() {
    const csvUrl = 'data.csv';
    const response = await fetch(csvUrl);
    const csvData = await response.text();
    
    wordPairs = Papa.parse(csvData, { header: true }).data;
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
            currentPairIndex++;
            displayClueAndCheckGuess();
        });
    } else {
        gameArea.innerHTML = "<p>Congratulations! You've completed the game.</p>";
    }
}

// Call the function to fetch and parse the CSV data
fetchAndParseCSV();
