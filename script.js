let puzzles = [];
let currentPuzzleIndex = 0;
let startTime;

function initializeGame() {
    fetch('Data.csv')
        .then(response => response.text())
        .then(data => {
            let lines = data.split('\n');
            lines.shift(); // Remove headers
            lines.forEach(line => {
                let parts = line.split(',');
                puzzles.push({ clue: parts[0], word1: parts[1], word2: parts[2] });
            });
            loadPuzzle();
        });
}

function loadPuzzle() {
    // Calculate Puzzle ID based on days since 30-Jul-2023
    let startDate = new Date('30-Jul-2023');
    let currentDate = new Date();
    let timeDiff = currentDate - startDate;
    let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    currentPuzzleIndex = daysDiff % puzzles.length;

    document.getElementById('clue').textContent = "Clue: " + puzzles[currentPuzzleIndex].clue;

    // Start timer
    startTime = new Date().getTime();
}

function submitGuess() {
    let guess = document.getElementById('guess').value.toLowerCase();
    let correctAnswer = puzzles[currentPuzzleIndex].word1.toLowerCase() + " " + puzzles[currentPuzzleIndex].word2.toLowerCase();
    
    if (guess === correctAnswer) {
        let endTime = new Date().getTime();
        let timeTaken = Math.floor((endTime - startTime) / 1000);
        alert('Correct! It took you ' + timeTaken + ' seconds.');
        document.getElementById('shareButton').style.display = 'block';
    } else {
        alert('Try again!');
    }
}

function shareResult() {
    let endTime = new Date().getTime();
    let timeTaken = Math.floor((endTime - startTime) / 1000);
    let shareText = `I solved Needles to Say puzzle no. ${currentPuzzleIndex + 1} in ${timeTaken} sec.`;
    navigator.clipboard.writeText(shareText);
    alert('Result copied to clipboard!');
}

function showFeedback() {
    document.getElementById('feedbackTab').style.display = 'block';
}

function dismissFeedback() {
    document.getElementById('feedbackTab').style.display = 'none';
}

function showAbout() {
    document.getElementById('aboutTab').style.display = 'block';
}

function dismissAbout() {
    document.getElementById('aboutTab').style.display = 'none';
}

function dismissSplash() {
    document.getElementById('splashScreen').style.display = 'none';
}

