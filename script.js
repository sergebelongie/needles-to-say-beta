document.addEventListener('DOMContentLoaded', function() {
    // Variables
    let betaMode = true; // Beta testing flag. Set this to false for production.
    let currentPuzzle = null;
    let startTime = null;
    let endTime = null;

    // DOM Elements
    const splashScreen = document.getElementById('splashScreen');
    const clueText = document.getElementById('clueText');
    const guessInput = document.getElementById('guessInput');
    const submitButton = document.getElementById('submitButton');
    const feedbackButton = document.getElementById('feedbackButton');
    const feedbackModal = document.getElementById('feedbackModal');
    const sendFeedback = document.getElementById('sendFeedback');
    const aboutButton = document.getElementById('aboutButton');
    const aboutModal = document.getElementById('aboutModal');
    const closeAbout = document.getElementById('closeAbout');
    const puzzleIDElem = document.getElementById('puzzleID');
    const timeTakenElem = document.getElementById('timeTaken');
    const betaInput = document.getElementById('betaInput');

    // Event Listeners
    document.getElementById('dismissButton').addEventListener('click', () => {
        splashScreen.style.display = 'none';
    });

    feedbackButton.addEventListener('click', () => {
        feedbackModal.style.display = 'block';
    });

    sendFeedback.addEventListener('click', () => {
        feedbackModal.style.display = 'none';
        // Placeholder for sending feedback. For now, we'll just log it.
        console.log("Feedback sent:", document.getElementById('feedbackText').value);
    });

    aboutButton.addEventListener('click', () => {
        aboutModal.style.display = 'block';
    });

    closeAbout.addEventListener('click', () => {
        aboutModal.style.display = 'none';
    });

    submitButton.addEventListener('click', checkGuess);
    guessInput.addEventListener('keypress', (event) => {
        if (event.keyCode === 13) { // Enter key
            checkGuess();
        }
    });

    // Functions
    function loadPuzzle(id) {
        // Fetch the data from the CSV file
        fetch('data.csv')
            .then(response => response.text())
            .then(data => {
                const puzzles = data.split('\n').slice(1); // Excluding the header
                const index = (id - 1) % puzzles.length;
                const puzzleData = puzzles[index].split(',');
                currentPuzzle = {
                    clue: puzzleData[0],
                    word1: puzzleData[1].toLowerCase(),
                    word2: puzzleData[2].toLowerCase()
                };

                // Update the UI with the clue
                clueText.innerText = 'Clue: ' + currentPuzzle.clue;
            })
            .catch(error => {
                console.error('Error loading puzzle:', error);
            });
    }

    function checkGuess() {
        const guess = guessInput.value.toLowerCase();
        if (guess === currentPuzzle.word1 + ' ' + currentPuzzle.word2) {
            endTime = new Date();
            const timeTaken = Math.floor((endTime - startTime) / 1000);
            alert('Correct!'); // This can be replaced with a fancier modal or notification in the future.
            puzzleIDElem.innerText = calculatePuzzleID();
            timeTakenElem.innerText = timeTaken;
        } else {
            alert('Incorrect. Try again.'); // This can be replaced with a fancier modal or notification in the future.
        }
    }

    function calculatePuzzleID() {
        const startDate = new Date('2023-07-30');
        const currentDate = new Date();
        const differenceInTime = currentDate - startDate;
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays;
    }

    // Initial Setup
    if (betaMode) {
        betaInput.style.display = 'block';
        document.getElementById('loadPuzzle').addEventListener('click', () => {
            const id = parseInt(document.getElementById('betaPuzzleID').value);
            if (id && id > 0) {
                loadPuzzle(id);
            } else {
                alert('Invalid Puzzle ID.');
            }
        });
    } else {
        const id = calculatePuzzleID();
        loadPuzzle(id);
    }

    startTime = new Date();
});

