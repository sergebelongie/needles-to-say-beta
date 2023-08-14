// Function to get the day number since 30-Jul-2023
function getDayNumberSinceReferenceDate() {
    const referenceDate = new Date('2023-07-30');
    const currentDate = new Date();
    const differenceInTime = currentDate - referenceDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
    return differenceInDays;
}

// Function to start the game
function startGame() {
    document.getElementById('splashScreen').style.display = 'none';
    document.getElementById('gameInterface').style.display = 'block';
    fetchDailyPuzzle();
}

// Function to fetch the daily puzzle from data.csv
function fetchDailyPuzzle() {
    let dayNumber = getDayNumberSinceReferenceDate();
    let totalEntries = 47;
    let puzzleIndex = dayNumber % totalEntries;

    // Using the Fetch API to get the CSV data
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            let rows = data.split("\n"); // Splitting data into rows
            let selectedRow = rows[puzzleIndex + 1]; // +1 considering the header row
            let columns = selectedRow.split(","); // Splitting row into columns

            let clue = columns[0];
            document.getElementById('clue').innerText = clue;

            // If needed, you can also extract the possible answers here
            // For simplicity, we're just fetching the clue for now
        })
        .catch(error => {
            console.error("Error fetching the puzzle data: ", error);
        });
}

// Function to submit the guess and check it
function submitGuess() {
    let userInputWord1 = document.getElementById('inputWord1').value.toLowerCase();
    let userInputWord2 = document.getElementById('inputWord2').value.toLowerCase();

    // Logic to check the user's guess against the solution
    // For simplicity, let's assume a dummy check for now
    if (userInputWord1 === "dummy1" && userInputWord2 === "dummy2") {
        alert('Correct!');
    } else {
        alert('Incorrect. Try again.');
    }
}

// Function to submit feedback
function submitFeedback() {
    let feedbackText = document.getElementById('feedbackText').value;

    // Logic to handle the feedback submission. This might involve sending it to a server or storing it somewhere.
    alert('Thank you for your feedback!');
}
