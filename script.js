let puzzles = [];
let currentPuzzle = null;

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const csvLines = data.trim().split("\n");
            csvLines.shift();  // Remove header
            csvLines.forEach(line => {
                const [clue, word1, word2] = line.split(',');
                puzzles.push({ clue, word1, word2 });
            });
            loadPuzzleForToday();
        });
});

document.addEventListener("DOMContentLoaded", function() {
    loadPuzzleForToday();
});
 {
    const today = new Date();
    const startDay = new Date(2023, 6, 30);  // Month is 0-indexed
    const daysDiff = Math.floor((today - startDay) / (1000 * 60 * 60 * 24)) % puzzles.length;
    currentPuzzle = puzzles[daysDiff];
    document.getElementById('clue').textContent = currentPuzzle.clue;
}

function loadPuzzleForGivenDate() {
    const selectedDate = new Date(document.getElementById('override-date').value);
    const startDay = new Date(2023, 6, 30);  // Month is 0-indexed
    const daysDiff = Math.floor((selectedDate - startDay) / (1000 * 60 * 60 * 24)) % puzzles.length;
    currentPuzzle = puzzles[daysDiff];
    document.getElementById('clue').textContent = currentPuzzle.clue;
}

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

