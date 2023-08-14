let puzzles = [];
let currentPuzzle = null;
let timerInterval = null;
let correctAnswer = null;

// Function to parse CSV data
function parseCSV(data) {
    const rows = data.split('\n').filter(row => row.trim() !== '' && row.includes(','));
    return rows.map(row => {
        const [clue, word1, word2] = row.split(',');
        if (!clue || !word1 || !word2) {
            console.error("Malformed row:", row);
            return null;
        }
        try {
            return {
                clue,
                answers: word1.split('|').map((w1, index) => [w1, word2.split('|')[index]])
            };
        } catch (e) {
            console.error("Error parsing row:", row, "Error:", e);
            return null;
        }
    }).filter(Boolean);
}

// Function to load puzzles from data.csv
function loadPuzzles() {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            puzzles = parseCSV(data);
        })
        .catch(error => {
            console.error("There was an error loading the CSV data:", error);
        });
}

// ... other functions

window.onload = function () {
    loadPuzzles();
    // ... rest of the window.onload function
}
