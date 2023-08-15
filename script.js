let betaTesting = false;
let startTime;
let endTime;
let currentPuzzle;

function initializeGame() {
    if (betaTesting) {
        document.getElementById('betaTestUI').style.display = 'block';
    }
    loadPuzzle();
}

function startGame() {
    document.getElementById('splashScreen').style.display = 'none';
    document.getElementById('gameUI').style.display = 'block';
    startTime = Date.now();
}

function loadPuzzle(id) {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            let lines = data.split('\n');
            if (!id) {
                let currentDate = new Date();
                let startDate = new Date('2023-07-30');
                id = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
            }
            let puzzleIndex = (id - 1) % (lines.length - 1);
            let puzzleData = lines[puzzleIndex + 1].split(',');
            currentPuzzle = {
                clue: puzzleData[0],
                word1: puzzleData[1],
                word2: puzzleData[2]
            };
            document.getElementById('dailyChallengeClue').textContent = currentPuzzle.clue;
        });
}

function submitGuess() {
    let guess = document.getElementById('guessInput').value.toLowerCase().trim();
    if (guess === currentPuzzle.word1.toLowerCase() + ' ' + currentPuzzle.word2.toLowerCase()) {
        endTime = Date.now();
        let timeTaken = Math.round((endTime - startTime) / 1000);
        document.getElementById('gameFeedback').textContent = 'Correct! Well done.';
        document.getElementById('socialSharing').style.display = 'block';
        document.getElementById('puzzleID').textContent = currentPuzzle.clue;
        document.getElementById('timeTaken').textContent = timeTaken;
    } else {
        document.getElementById('gameFeedback').textContent = 'Try again!';
    }
}

function checkInput(event) {
    if (event.keyCode === 13) {
        submitGuess();
    }
}

function loadCustomPuzzle() {
    let id = parseInt(document.getElementById('puzzleNumberInput').value);
    loadPuzzle(id);
}

function sendFeedback() {
    let feedback = document.getElementById('feedbackText').value;
    alert(`Thank you for your feedback! We would send this to email@example.com:\n\n${feedback}`);
}

function copyToClipboard() {
    let text = `Needles to Say ${document.getElementById('puzzleID').textContent} in ${document.getElementById('timeTaken').textContent} seconds`;
    let tempInput = document.createElement('textarea');
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert("Copied to clipboard!");
}
