let puzzles = [];

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
    let puzzleEntry = puzzles[puzzleId];
    if (puzzleEntry) {
        document.getElementById('clue').textContent = puzzleEntry.clue;
    } else {
        document.getElementById('clue').textContent = "No puzzle available for this day.";
    }
}

function submitGuess() {
    let guess = document.getElementById("guess").value.toLowerCase();
    
    let puzzleId;
    let selectedDate = document.getElementById("override-date").value;
    if (selectedDate) {
        let dateSelected = new Date(selectedDate);
        let start = new Date('2023-07-30');
        puzzleId = Math.floor((dateSelected - start) / (1000 * 60 * 60 * 24));
    } else {
        let today = new Date();
        let start = new Date('2023-07-30');
        puzzleId = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    }
    
    let currentPuzzle = puzzles[puzzleId];

    if (currentPuzzle && (guess === currentPuzzle.word1.toLowerCase() || guess === currentPuzzle.word2.toLowerCase())) {
        document.getElementById('result').textContent = "Correct!";
        showSocialShare();
    } else {
        document.getElementById('result').textContent = "Try again!";
    }
}


function showSocialShare() {
    let socialShareDiv = document.getElementById('social-share');
    let shareText = `I solved today's puzzle on Needles to Say! #NeedlesToSay`;
    document.getElementById('share-text').textContent = shareText;
    socialShareDiv.style.display = 'block';
}

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

// Listen for Enter key press on guess input field
document.getElementById("guess").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitGuess();
    }
});
