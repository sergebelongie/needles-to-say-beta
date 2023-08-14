let currentPuzzle = {};

document.addEventListener("DOMContentLoaded", function() {
    loadPuzzleForToday();
});

async function fetchData() {
    const response = await fetch("data.csv");
    const data = await response.text();
    const puzzles = data.split("\n").map(row => {
        const [date, clue, word1, word2] = row.split(",");
        return { date, clue, word1, word2 };
    });
    return puzzles;
}

async function loadPuzzleForToday() {
    const puzzles = await fetchData();
    const currentDate = new Date().toISOString().split("T")[0];
    currentPuzzle = puzzles.find(puzzle => puzzle.date === currentDate);
    displayPuzzle(currentPuzzle);
}

function displayPuzzle(puzzle) {
    document.getElementById("clue").textContent = puzzle.clue;
}

async function loadPuzzleForGivenDate() {
    const puzzles = await fetchData();
    const selectedDate = document.getElementById("override-date").value;
    currentPuzzle = puzzles.find(puzzle => puzzle.date === selectedDate);
    displayPuzzle(currentPuzzle);
}

function submitGuess() {
    let userGuess = document.getElementById("guess").value.trim();
    console.log("User's Guess:", userGuess);
    console.log("Selected Puzzle:", currentPuzzle);

    if (userGuess.toLowerCase() === (currentPuzzle.word1 + ' ' + currentPuzzle.word2).toLowerCase()) {
        showCorrectMessage();
        showSocialShare();
    } else {
        document.getElementById("result").textContent = "Try again!";
    }
}

function showCorrectMessage() {
    document.getElementById("result").textContent = "Correct!";
}

function showSocialShare() {
    document.getElementById("social-share").style.display = "block";
    document.getElementById("share-text").textContent = `I solved today's puzzle on Needles to Say! #NeedlesToSay`;
}

document.getElementById("guess").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        submitGuess();
    }
});
