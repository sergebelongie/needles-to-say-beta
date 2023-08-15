let puzzles = [];

document.addEventListener("DOMContentLoaded", function() {
    showSplashScreen();
    fetchPuzzles();  // Fetch puzzles and then load the puzzle
});

function showSplashScreen() {
    document.getElementById("splashScreen").style.display = "block";
}

function dismissSplash() {
    document.getElementById("splashScreen").style.display = "none";
}

function fetchPuzzles() {
    fetch('Data.csv')
        .then(response => response.text())
        .then(data => {
            let rows = data.split('\n');
            rows.forEach((row, index) => {
                if (index !== 0) {  // Exclude header
                    let columns = row.split(',');
                    puzzles.push({
                        clue: columns[0],
                        word1: columns[1],
                        word2: columns[2]
                    });
                }
            });
            loadPuzzle();
        })
        .catch(error => console.error('Error fetching the puzzles:', error));
}

function loadPuzzle() {
    let today = new Date();
    let startDate = new Date('2023-07-30');
    let diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    let puzzleIndex = diffDays % puzzles.length;
    let puzzle = puzzles[puzzleIndex];

    document.getElementById("puzzleClue").innerText = "Clue: " + puzzle.clue;
}

function openFeedback() {
    document.getElementById("feedbackPopup").style.display = "block";
}

function closeFeedback() {
    document.getElementById("feedbackPopup").style.display = "none";
}

function openAbout() {
    document.getElementById("aboutPopup").style.display = "block";
}

function closeAbout() {
    document.getElementById("aboutPopup").style.display = "none";
}

let startTime;
let endTime;

function startTimer() {
    startTime = new Date();
}

function stopTimer() {
    endTime = new Date();
    let timeDiff = endTime - startTime; // in ms
    return Math.floor(timeDiff / 1000); // to seconds
}

function submitGuess() {
    var word1 = document.getElementById("word1Guess").value;
    var word2 = document.getElementById("word2Guess").value;

    if (word1.toLowerCase() === puzzles[currentPuzzleIndex].word1.toLowerCase() && word2.toLowerCase() === puzzles[currentPuzzleIndex].word2.toLowerCase()) {
        let timeTaken = stopTimer();
        console.log("Correct Guess! Time taken: " + timeTaken + " seconds.");

        let shareString = `I solved Needles to Say puzzle no. ${currentPuzzleIndex + 1} in ${timeTaken} sec.`;
        navigator.clipboard.writeText(shareString)
            .then(() => {
                console.log('Text copied to clipboard');
            })
            .catch(err => {
                console.log('Error in copying text: ', err);
            });
    } else {
        console.log("Incorrect Guess. Try again!");
    }
}

let betaMode = true;  // Toggle this flag for beta testing

function getPuzzle(puzzleNumber) {
    let puzzle = puzzles[puzzleNumber - 1];  // 1-indexed for user-friendliness
    if (puzzle) {
        document.getElementById("puzzleClue").innerText = "Clue: " + puzzle.clue;
    } else {
        console.log("Invalid puzzle number!");
    }
}

document.body.classList.add('fade-in');
