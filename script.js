let puzzles = [];
let currentPuzzleId = 0;
let startTime, endTime;

// Load CSV data
function loadPuzzles() {
    fetch('Data.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            lines.shift(); // Remove header
            lines.forEach(line => {
                const [clue, word1, word2] = line.split(',');
                puzzles.push({ clue, word1, word2 });
            });

            // Calculate Puzzle ID
            const startDate = new Date('2023-07-30');
            const currentDate = new Date();
            const timeDiff = currentDate - startDate;
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            currentPuzzleId = daysDiff % puzzles.length;

            // Display clue
            document.getElementById('clue').textContent = "Clue: " + puzzles[currentPuzzleId].clue;

            // Start timer
            startTime = new Date();
        });
}

// Popups
document.getElementById('dismissButton').addEventListener('click', function() {
    document.getElementById('splashScreen').style.display = 'none';
});

document.getElementById('feedbackTab').addEventListener('click', function() {
    document.getElementById('feedbackPopup').style.display = 'flex';
});

document.getElementById('aboutTab').addEventListener('click', function() {
    document.getElementById('aboutPopup').style.display = 'flex';
});

document.getElementById('sendFeedback').addEventListener('click', function() {
    // Placeholder for sending feedback. In a real-world scenario, this would send the feedback to a server or email.
    console.log('Feedback:', document.getElementById('feedbackText').value);
    document.getElementById('feedbackPopup').style.display = 'none';
});

// Initialize game
window.onload = function() {
    loadPuzzles();
    document.getElementById('splashScreen').style.display = 'flex';
};
