let puzzles = [];
let currentPuzzle = null;
let startTime = null;

// Load puzzles from data.csv
fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        let lines = data.trim().split('\n');
        for(let i = 1; i < lines.length; i++) {
            let [clue, word1, word2] = lines[i].split(',');
            puzzles.push({ clue, word1, word2 });
        }
        loadDailyPuzzle();
    });

function loadDailyPuzzle() {
    let dayOfYear = Math.floor((new Date() - new Date('2023-07-30')) / (1000 * 60 * 60 * 24)) % puzzles.length;
    currentPuzzle = puzzles[dayOfYear];
    document.getElementById('dailyClue').textContent = currentPuzzle.clue;
    startTime = new Date();
}

function submitGuess() {
    let guess = document.getElementById('userGuess').value.toLowerCase();
    let [guessedWord1, guessedWord2] = guess.split(' ');

    if (guessedWord1 === currentPuzzle.word1.toLowerCase() && guessedWord2 === currentPuzzle.word2.toLowerCase()) {
        let timeTaken = Math.round((new Date() - startTime) / 1000);
        let minutes = Math.floor(timeTaken / 60);
        let seconds = timeTaken % 60;
        document.getElementById('resultMessage').textContent = `Correct! Time taken: ${minutes}:${seconds}`;
        // Display social share
        document.getElementById('socialShare').style.display = 'block';
    } else {
        document.getElementById('resultMessage').textContent = 'Try again!';
    }
}

function checkForEnter(event) {
    if (event.key === 'Enter') {
        submitGuess();
    }
}

function provideFeedback() {
    window.location.href = 'https://github.com/sergebelongie/needles-to-say-beta/issues';
}

function showAbout() {
    let aboutSection = document.getElementById('aboutSection');
    if (aboutSection.style.display === 'none') {
        aboutSection.style.display = 'block';
    } else {
        aboutSection.style.display = 'none';
    }
}
