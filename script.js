let puzzles = [];
let currentPuzzle = null;
let startTime = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log("Document loaded");

    // Load CSV data
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            let rows = data.split('\n').slice(1);
            rows.forEach(row => {
                let [clue, word1, word2] = row.split(',');
                puzzles.push({clue, word1, word2});
            });
            loadDailyPuzzle();
        })
        .catch(err => console.log("Error loading CSV:", err));

    // Event listeners
    document.getElementById('submitGuess').addEventListener('click', checkGuess);
    document.getElementById('loadPuzzle').addEventListener('click', loadBetaPuzzle);
    document.getElementById('copyToClipboard').addEventListener('click', copyShareText);
    document.getElementById('guessInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });
});

function loadDailyPuzzle() {
    let date = new Date();
    let referenceDate = new Date("2023-07-30");
    let daysDiff = Math.floor((date - referenceDate) / (1000 * 60 * 60 * 24));
    let puzzleIndex = daysDiff % puzzles.length;
    currentPuzzle = puzzles[puzzleIndex];
    document.getElementById('clue').textContent = currentPuzzle.clue;
    startTime = Date.now();
}

function checkGuess() {
    let guess = document.getElementById('guessInput').value.toLowerCase();
    let answer = `${currentPuzzle.word1.toLowerCase()} ${currentPuzzle.word2.toLowerCase()}`;
    if (guess === answer) {
        let timeTaken = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('feedbackMessage').textContent = `Correct! Time taken: ${timeTaken} seconds.`;
        
        let puzzleIndex = puzzles.indexOf(currentPuzzle); // Get puzzle ID
        let shareText = `Needles to Say ${puzzleIndex + 1} ${timeTaken} sec.`;
        
        document.getElementById('shareText').value = shareText;
        document.getElementById('socialSharing').style.display = 'block';
    } else {
        document.getElementById('feedbackMessage').textContent = "Incorrect, try again!";
    }
}

function loadBetaPuzzle() {
    let puzzleNumber = parseInt(document.getElementById('puzzleNumber').value);
    if (puzzleNumber >= 0 && puzzleNumber < puzzles.length) {
        currentPuzzle = puzzles[puzzleNumber];
        document.getElementById('clue').textContent = currentPuzzle.clue;
        startTime = Date.now();
    } else {
        document.getElementById('feedbackMessage').textContent = "Invalid puzzle number!";
    }
}

function copyShareText() {
    let shareText = document.getElementById('shareText');
    shareText.select();
    document.execCommand('copy');
}
