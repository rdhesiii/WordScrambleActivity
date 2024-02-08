document.addEventListener("DOMContentLoaded", function () {
    const timerElement = document.getElementById("timer");
    const scrambledWordElement = document.getElementById("scrambled-word");
    const hintElement = document.getElementById("hint");
    const answerInput = document.getElementById("answer-input");
    const checkWordButton = document.getElementById("check-word");
    const addTimeButton = document.getElementById("add-time");
    const giveUpButton = document.getElementById("give-up");
    const finalMessageElement = document.getElementById("final-message");
    const startOverButton = document.getElementById("reset-game");

    let timer = 60;
    let timerInterval;
    let currentWord = "";
    let totalAttempts = 0;
    let correctAnswers = 0;
    let hasGuessedWrong = false;
    let hasAttempted = false;
    let isGameFinished = false;
    let usedWords = new Set(); 

    function updateScoreDisplay() {
        const scoreCorrectElement = document.getElementById("score-correct");
        const scoreTotalElement = document.getElementById("score-total");
        const emojiElement = document.getElementById("emoji");
        const successRate = correctAnswers / totalAttempts;

        scoreCorrectElement.textContent = correctAnswers;
        scoreTotalElement.textContent = totalAttempts;

        if (successRate >= 0.5) {
            emojiElement.textContent = "😊";
        } else {
            emojiElement.textContent = "😞";
        }
    }

    giveUpButton.addEventListener("click", () => {
        if (!hasAttempted) {
            totalAttempts++;
            hasAttempted = true;
        }

        alert(`The correct answer was: ${currentWord}`);
        refreshWord();
        answerInput.value = "";

        updateScoreDisplay();
        startTimer();
    });

    function scrambleWord(word) {
        const array = word.split('');
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        const scrambled = array.join('');
        return scrambled === word ? scrambleWord(word) : scrambled;
    }

    function refreshWord() {
        // Check if all words have been attempted
        if (usedWords.size >= wordsAndHints.length) {
            clearInterval(timerInterval);
            isGameFinished = true;
            const successRate = correctAnswers / totalAttempts;
            finalMessageElement.textContent = successRate >= 0.5
                ? `Congratulations! You completed the game with ${correctAnswers} correct answers out of ${totalAttempts} attempts.`
                : `You completed the game with ${correctAnswers} correct answers out of ${totalAttempts} attempts. Try again to improve your score!`;
            return;
        }
    
        let { word, hint } = wordsAndHints[Math.floor(Math.random() * wordsAndHints.length)];
    
        // Make sure the word hasn't been used before
        while (usedWords.has(word)) {
            ({ word, hint } = wordsAndHints[Math.floor(Math.random() * wordsAndHints.length)]);
        }
    
        usedWords.add(word); // Add the word to the used words set
        currentWord = word;
        const scrambled = scrambleWord(word);
    
        const spanLetters = scrambled.split('').map((letter, index) => `<span tabindex="${index + 1}" aria-label="${letter}" role="presentation">${letter}</span>`).join('');
    
        scrambledWordElement.innerHTML = spanLetters;
        hintElement.textContent = `Hint: ${hint}`;
        hasAttempted = false;
    }

    function startTimer() {
        clearInterval(timerInterval);
        timer = 60;
        document.getElementById('timer-value').textContent = timer;

        timerInterval = setInterval(() => {
            timer--;
            document.getElementById('timer-value').textContent = timer;

            if (timer <= 0) {
                clearInterval(timerInterval);
                alert(`Time's up! The correct answer was: ${currentWord}. Try another word.`);
                refreshWord();
                startTimer();
            }
        }, 1000);
    }

    answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            checkWordButton.click();
        }
    });

    checkWordButton.addEventListener("click", () => {
        if (answerInput.value.trim() === "") {
            alert("Please enter your guess before checking the word.");
            return;
        }

        if (answerInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
            if (!hasGuessedWrong) {
                correctAnswers++;
            }
            if (!hasAttempted) {
                totalAttempts++;
                hasAttempted = true;
            }
            alert("Correct! Well done!");
            clearInterval(timerInterval);
            refreshWord();
            answerInput.value = "";
            startTimer();
            updateScoreDisplay();
            hasGuessedWrong = false;
        } else {
            if (!hasGuessedWrong) {
                hasGuessedWrong = true;
            }
            if (!hasAttempted) {
                totalAttempts++;
                hasAttempted = true;
            }
            alert("Incorrect! Try again.");
            answerInput.value = "";
            updateScoreDisplay();
            answerInput.focus(); // Focus on the input field after an incorrect attempt
        }
    });

    addTimeButton.addEventListener("click", () => {
        timer += 30;
        document.getElementById('timer-value').textContent = timer;
    });

    startOverButton.addEventListener("click", () => {
        usedWords.clear();
        totalAttempts = 0;
        correctAnswers = 0;
        hasGuessedWrong = false;
        hasAttempted = false;
        isGameFinished = false;
        finalMessageElement.textContent = "";
        updateScoreDisplay();
        refreshWord();
        startTimer();
    });

    // Initialize the game
    refreshWord();
    startTimer();
});
