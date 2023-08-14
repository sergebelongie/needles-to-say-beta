// Define your puzzles data
let puzzles = [];

// Load puzzles data on page load
fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        let csvLines = data.split('\n');
        csvLines.shift(); // remove headers
        csvLines.forEach(line => {
            let [clue, word1, word2] = line.split(',');
            puzzles.push({ clue, word1, word2 });
        });
        loadPuzzleForToday();
    });

function loadPuzzleForToday() {
    let today = new Date();
    let start = new Date('2023-07-30');
    let difference = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    loadPuzzle(difference);
}

function loadPuzzleForGivenDate() {
    let selectedDate = new Date(document.getElementById("override-date").value);
    let start = new Date('2023-07-30');
    let difference = Math.floor((selectedDate - start) / (1000 * 60 * 60 * 24));
    loadPuzzle(difference);
}

function loadPuzzle(puzzleId) {
    if (puzzles[puzzleId]) {
        document.getElementById('clue').textContent = puzzles[puzzleId].clue;
    } else {
        document.getElementById('clue').textContent = "No puzzle available for this day.";
    }
}

function submitGuess() {
    // Your submit logic here
}

// Additional code for other functionalities...


function submitGuess() {
    const guessedWordPair = document.getElementById('guess').value.toLowerCase().trim();
    const correctPair = `${currentPuzzle.word1.toLowerCase()} ${currentPuzzle.word2.toLowerCase()}`;
    
    const resultDiv = document.getElementById('result');

    if (guessedWordPair === correctPair) {
        resultDiv.textContent = 'Correct!';
        showSocialShare();
    } else {
        resultDiv.textContent = 'Try again.';
    }
}

function showSocialShare() {
    const puzzleId = (new Date() - new Date(2023, 6, 30)) / (1000 * 60 * 60 * 24);
    const shareText = `Needles to Say #${puzzleId} ${document.getElementById('timer').textContent}`;
    document.getElementById('social-share').style.display = 'block';
    document.getElementById('share-text').textContent = shareText;
}

document.getElementById('guess').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        submitGuess();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadPuzzleForToday();
});

