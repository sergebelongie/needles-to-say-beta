let startTime;
let currentAnswers = [];

window.onload = function() {
    fetchDailyPuzzle();
};

function getDayNumberSinceReferenceDate() {
    let referenceDate = new Date(2023, 6, 30); // 30-Jul-2023
    let currentDate = new Date();
    let timeDifference = currentDate - referenceDate;
    let dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return dayDifference;
}

function startGame() {
    document.getElementById('splashScreen').style.display = 'none';
    document.getElementById('gameInterface').style.display = 'block';
    startTime = new Date();
}

function fetchDailyPuzzle() {
    let dayNumber = getDayNumberSinceReferenceDate();
    let totalEntries = 47;
    let puzzleIndex = dayNumber % totalEntries;

    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            let rows = data.split("\n");
            let selectedRow = rows[puzzleIndex + 1];
            let columns = selectedRow.split(",");

            let clue = columns[0];
            document.getElementById('clue').innerText = clue;

            currentAnswers = [
                columns[1].split("|"),
                columns[2].split("|")
            ];
        })
        .catch(error => {
            console.error("Error fetching the puzzle data: ", error);
        });
}

function submitGuess() {
    let userInputWord1 = document.getElementById('inputWord1').value.toLowerCase().trim();
    let userInputWord2 = document.getElementById('inputWord2').value.toLowerCase().trim();

    if (currentAnswers[0].includes(userInputWord1) && currentAnswers[1].includes(userInputWord2)) {
        let endTime = new Date();
        let timeTaken = (endTime - startTime) / 1000;
        let minutes = Math.floor(timeTaken / 60);
        let seconds = Math.floor(timeTaken % 60);
        alert(`Correct! It took you ${minutes}m ${seconds}s.`);
    } else {
        alert('Incorrect. Try again.');
    }
}

function submitFeedback() {
    let feedbackText = document.getElementById('feedbackText').value;
    if (feedbackText.trim() === '') {
        alert('Please provide feedback before submitting.');
    } else {
        alert('Thank you for your feedback!');
        // Send the feedback to a server or store it, as needed
    }
}
