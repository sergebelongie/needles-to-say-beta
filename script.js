let betaTesting = false; // Flag for beta testing
let startTime;
let endTime;
let currentPuzzle;

// Function to load the puzzle based on the date or beta testing input
function loadPuzzle(id) {
    // Fetch data from CSV and select puzzle based on ID
    fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        let lines = data.split('\n');
        let puzzleIndex = (id - 1) % (lines.length - 1); // Wrap around if ID exceeds number of rows
        let puzzleData = lines[puzzleIndex + 1].split(',');
        currentPuzzle = {
            clue: puzzleData[0],
            word1: puzzleData[1],
            word2: puzzleData[2]
        };
        document.getElementById('dailyChallengeClue').textContent = currentPuzzle.clue;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    document.getElementById('startGameBtn').addEventListener('click', () => {
        document.getElementById('splashScreen').hidden = true;
        document.getElementById('gameUI').hidden = false;
        if (betaTesting) {
            document.getElementById('betaTestUI').hidden = false;
        }
        let currentDate = new Date();
        let startDate = new Date('2023-07-30');
        let daysDifference = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        loadPuzzle(daysDifference);
        startTime = Date.now();
    });

    // Handle guess submission
    document.getElementById('submitGuessBtn').addEventListener('click', () => {
        let guess = document.getElementById('guessInput').value.toLowerCase();
        if (guess === currentPuzzle.word1.toLowerCase() + ' ' + currentPuzzle.word2.toLowerCase()) {
            endTime = Date.now();
            let timeTaken = Math.round((endTime - startTime) / 1000);
            document.getElementById('gameFeedback').textContent = 'Correct! Well done.';
            document.getElementById('socialSharing').hidden = false;
            document.getElementById('puzzleID').textContent = currentPuzzle.clue;
            document.getElementById('timeTaken').textContent = timeTaken + 's';
        } else {
            document.getElementById('gameFeedback').textContent = 'Try again!';
        }
    });

    // Handle beta testing puzzle loading
    if (betaTesting) {
        document.getElementById('loadPuzzleBtn').addEventListener('click', () => {
            let puzzleId = document.getElementById('puzzleNumberInput').value;
            loadPuzzle(puzzleId);
        });
    }
});
