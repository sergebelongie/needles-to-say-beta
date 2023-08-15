let puzzles = [];
let currentPuzzle = null;
let startTime;
let betaTesting = true; // Set this to false for production

async function initializeGame() {
    await loadPuzzles();
    if(betaTesting) {
        document.getElementById('betaPuzzleId').style.display = "block";
    }
    loadPuzzle();
}

async function loadPuzzles() {
    const response = await fetch("Data.csv");
    const csvText = await response.text();
    const lines = csvText.split('\n').slice(1);  // Remove header
    for (let line of lines) {
        const [clue, word1, word2] = line.split(',');
        puzzles.push({ clue, word1, word2 });
    }
}

function loadPuzzle() {
    const dateDiff = Math.floor((new Date() - new Date("2023-07-30")) / (1000 * 60 * 60 * 24));
    const puzzleId = dateDiff % puzzles.length;
    currentPuzzle = puzzles[puzzleId];
    document.getElementById('clue').textContent = currentPuzzle.clue;
    startTime = new Date();
}

function submitGuess() {
    const word1Guess = document.getElementById('word1').value.trim().toLowerCase();
    const word2Guess = document.getElementById('word2').value.trim().toLowerCase();
    if (word1Guess === currentPuzzle.word1.toLowerCase() && word2Guess === currentPuzzle.word2.toLowerCase()) {
        const endTime = new Date();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        alert(`Correct! It took you ${timeTaken} seconds.`);
    } else {
        alert("Try again!");
    }
}

function copyToClipboard() {
    const dateDiff = Math.floor((new Date() - new Date("2023-07-30")) / (1000 * 60 * 60 * 24));
    const timeTaken = Math.floor((new Date() - startTime) / 1000);
    const text = `I solved Needles to Say puzzle no. ${dateDiff} in ${timeTaken} sec.`;
    navigator.clipboard.writeText(text);
    alert("Text copied to clipboard!");
}

function dismissSplash() {
    document.getElementById('splash').style.display = 'none';
}

function showAbout() {
    alert("Lorem ipsum...");
}

function showFeedback() {
    window.open(`mailto:email@example.com?subject=Feedback for Needles to Say&body=Your feedback here...`);
}

function loadBetaPuzzle() {
    const puzzleId = document.getElementById('betaPuzzleId').value;
    currentPuzzle = puzzles[puzzleId];
    document.getElementById('clue').textContent = currentPuzzle.clue;
}
