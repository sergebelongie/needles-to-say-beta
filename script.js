let puzzles = [];
let currentPuzzle = null;
let timerInterval = null;
let correctAnswer = null;

// Function to parse CSV data
function parseCSV(data) {
    const rows = data.split('\n').filter(row => row.trim() !== '' && row.includes(','));
    return rows.map(row => {
        const [clue, word1, word2] = row.split(',');
        if (!clue || !word1 || !word2) {
            console.error("Malformed row:", row);
            return null;
        }
        try {
            return {
                clue,
                answers: word1.split('|').map((w1, index) => [w1, word2.split('|')[index]])
            };
        } catch (e) {
            console.error("Error parsing row:", row, "Error:", e);
            return null;
        }
    }).filter(Boolean);
}

// Function to start a new game
function startGame() {
    currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    correctAnswer = currentPuzzle.answers[0][0] + " " + currentPuzzle.answers[0][1];
    
    document.getElementById('clue').textContent = currentPuzzle.clue;
    document.getElementById('guess-input').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('submit-button').classList.remove('disabled');
    
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

// Function to check the user's guess
function checkGuess() {
    const guessInput = document.getElementById('guess-input');
    const submitButton = document.getElementById('submit-button');
    
    let guess = guessInput.value.trim();
    
    if (submitButton.classList.contains('disabled')) {
        return;
    }

    submitButton.classList.add('disabled');
    
    if (guess.includes(' ') || guess.length >= correctAnswer.length) {
        guess = guess.replace(',', '');  // remove comma if present
        
        if (correctAnswer.includes(guess)) {
            clearInterval(timerInterval);
            showResult(true);
        } else {
            guessInput.value = '';
            guessInput.placeholder = 'Try again!';
            guessInput.classList.add('incorrect');
            setTimeout(() => {
                guessInput.placeholder = 'Enter your guess...';
                guessInput.classList.remove('incorrect');
            }, 1000);
        }
    }
    
    submitButton.classList.remove('disabled');
}

// ... other functions

window.onload = function () {
    loadPuzzles();
    // ... rest of the window.onload function
}
