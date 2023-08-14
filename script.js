let puzzlesData = [];
let currentClue;
let currentAnswer;
let startTime = new Date();
let endTime;

const clueDisplay = document.getElementById('clueDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const successMessage = document.getElementById('successMessage');
const guessInput = document.getElementById('guessInput');
const copyShareBtn = document.getElementById('copyShareBtn');
const tweetShareLink = document.getElementById('tweetShareLink');
const overrideInput = document.getElementById('overrideInput');
const loadPuzzleBtn = document.getElementById('loadPuzzleBtn');
const incorrectMessage = document.getElementById('incorrectMessage');
const giveUpBtn = document.getElementById('giveUpBtn');
const solutionMessage = document.getElementById('solutionMessage');

const isBetaTesting = true;

window.onload = () => {
    fetch('https://sergebelongie.github.io/needles-to-say-beta/data.csv')
        .then(response => response.text())
        .then(data => {
            puzzlesData = parseCSV(data);
            console.log(puzzlesData);
            loadDailyPuzzle();
        })
        .catch(error => {
            console.error("There was an error loading the CSV data:", error);
        });
};

function parseCSV(data) {
    const rows = data.split('\n').slice(1);
    return rows.map(row => {
        const [clue, word1, word2] = row.split(',');
        return {
            clue,
            answers: word1.split('|').map((w1, index) => [w1, word2.split('|')[index]])
        };
    });
}

function loadDailyPuzzle() {
    const dailyPuzzle = getDailyPuzzle();
    currentClue = dailyPuzzle.clue;
    currentAnswer = dailyPuzzle.answers;
    clueDisplay.textContent = currentClue;
}

function getDailyPuzzle(date = new Date()) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return puzzlesData[dayOfYear % puzzlesData.length];
}

guessInput.addEventListener('input', checkGuess);
copyShareBtn.addEventListener('click', copyToClipboard);

if (isBetaTesting) {
    loadPuzzleBtn.addEventListener('click', loadOverridePuzzle);
}

function checkGuess() {
    const guess = guessInput.value.toLowerCase().split(" ");
    if (guess.length === 2) {
        if (isValidAnswer(guess)) {
            endTime = new Date();
            clearInterval(timerInterval);
            displaySuccess();
        } else {
            incorrectMessage.textContent = "Incorrect. Try again!";
        }
    }
}

function isValidAnswer(guess) {
    return currentAnswer.some(answerPair => 
        guess[0] === answerPair[0].toLowerCase() && guess[1] === answerPair[1].toLowerCase()
    );
}

function displaySuccess() {
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    successMessage.style.display = 'block';
    timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const shareText = `Needles to Say ${formattedDate} ${minutes}:${seconds}`;
    tweetShareLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
}

function copyToClipboard() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const timeTaken = timerDisplay.textContent.split(": ")[1];
    const shareText = `Needles to Say ${formattedDate} ${timeTaken}`;
    navigator.clipboard.writeText(shareText);
}

function loadOverridePuzzle() {
    const overrideDate = new Date(overrideInput.value);
    if (isValidDate(overrideDate)) {
        const overridePuzzle = getDailyPuzzle(overrideDate);
        currentClue = overridePuzzle.clue;
        currentAnswer = overridePuzzle.answers;
        clueDisplay.textContent = currentClue;
    } else {
        alert("Please enter a valid date in the format YYYY-MM-DD.");
    }
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

const timerInterval = setInterval(() => {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}, 1000);

giveUpBtn.addEventListener('click', revealSolution);

function revealSolution() {
    clearInterval(timerInterval);
    const onePossibleAnswer = `${currentAnswer[0][0]} ${currentAnswer[0][1]}`;
    solutionMessage.textContent = `One possible answer is: ${onePossibleAnswer}`;
    solutionMessage.style.display = 'block';
}
