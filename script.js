const gameArea = document.getElementById("gameArea");
const clueElement = document.getElementById("clue");
const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const resultElement = document.getElementById("result");

let currentPairIndex = 0;

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

// Replace this with your actual word pairs data
const wordPairs = [
    { clue: "unnecessary sewing implement", answer: "needless needles" },
    { clue: "Five o’clock shadow grizzly", answer: "beard bear" }
];

displayClueAndCheckGuess();
