let puzzles = [];
let currentPuzzle = null;
let timerInterval = null;
let correctAnswer = null;

// Function to parse CSV data
function parseCSV(data) {
    const rows = data.split('\n').filter(row => row.trim() !== '' && row.includes(','));
    return rows.map(row => {
        const [date, clue, word1, word2] = row.split(',');
        if (!date || !clue || !word1 || !word2) {
            console.error("Malformed row:", row);
            return null;
        }
        try {
            return {
                date,
                clue,
                answers: word1.split('|').map((w1, index) => [w1, word2.split('|')[index]])
            };
        } catch (e) {
            console.error("Error parsing row:", row, "Error:", e);
            return null;
        }
    }).filter(Boolean);
}

// Function to load puzzles from data.csv
function loadPuzzles() {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            puzzles = parseCSV(data);
        })
        .catch(error => {
            console.error("There was an error loading the CSV data:", error);
        });
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
    updateTimer();
}

// Function to update the timer display
function updateTimer() {
    const timerElement = document.getElementById('timer');
    let [minutes, seconds] = timerElement.textContent.split(':').map(Number);
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to check the user's guess
function checkGuess() {
    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value.trim().toLowerCase();
    if (guess === correctAnswer.toLowerCase()) {
        showResult(true);
    }
}

// Function to show the result
function showResult(isCorrect) {
    const resultElement = document.getElementById('result');
    const guessInput = document.getElementById('guess-input');
    clearInterval(timerInterval);
    if (isCorrect) {
        resultElement.textContent = "Correct!";
        guessInput.disabled = true;
        guessInput.value = correctAnswer;
        document.getElementById('submit-button').classList.add('disabled');
    } else {
        resultElement.textContent = "Incorrect. Try again!";
    }
}

// Function to override the daily challenge
function overrideChallenge() {
    const overrideDate = document.getElementById('override-date').value;
    if (overrideDate) {
        currentPuzzle = puzzles.find(puzzle => puzzle.date === overrideDate);
        if (currentPuzzle) {
            correctAnswer = currentPuzzle.answers[0][0] + " " + currentPuzzle.answers[0][1];
            document.getElementById('clue').textContent = currentPuzzle.clue;
            document.getElementById('guess-input').value = '';
            document.getElementById('result').textContent = '';
            document.getElementById('submit-button').classList.remove('disabled');
        }
    }
}

window.onload = function () {
    loadPuzzles();
}
