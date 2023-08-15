let puzzles;
let currentPuzzle;
let startTime;
let endTime;

// Load puzzles from data.csv and start the game
fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        puzzles = data.split('\n').slice(1).map(row => {
            const [clue, word1, word2] = row.split(',');
            return { clue, word1, word2 };
        });
        startGame();
    });

function startGame() {
    const betaTesting = true; // Change this flag for production
    if (betaTesting) {
        document.title = "Needles to Say (beta)";
    }

    const daysSinceStart = Math.floor((new Date() - new Date('2023-07-30')) / (1000 * 60 * 60 * 24));
    currentPuzzle = puzzles[daysSinceStart % puzzles.length];

    document.getElementById('clue').textContent = "Clue: " + currentPuzzle.clue;
    startTime = new Date();
}

function submitGuess() {
    const guess = document.getElementById('guess').value.toLowerCase();
    if (guess === currentPuzzle.word1.toLowerCase() + " " + currentPuzzle.word2.toLowerCase()) {
        endTime = new Date();
        const timeTaken = Math.round((endTime - startTime) / 1000);
        alert(`Correct! You solved the puzzle in ${timeTaken} seconds.`);
    } else {
        alert('Incorrect. Try again!');
    }
}

function shareResult() {
    const timeTaken = Math.round((endTime - startTime) / 1000);
    const puzzleId = puzzles.indexOf(currentPuzzle) + 1;
    const shareText = `I solved Needles to Say puzzle no. ${puzzleId} in ${timeTaken} sec.`;
    navigator.clipboard.writeText(shareText);
    alert('Result copied to clipboard!');
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function dismissModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function sendFeedback() {
    // Placeholder for sending feedback
    alert('Feedback sent to email@example.com!');
}
