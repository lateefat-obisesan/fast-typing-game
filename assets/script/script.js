'use strict';

const words = ['dinosaur','love','pineapple','calendar','robot',
    'building','population','weather','bottle','history','dream',
    'character','money','absolute','discipline','machine','accurate',
    'connection','rainbow','bicycle','eclipse','calculator','trouble',
    'watermelon','developer','philosophy','database','periodic',
    'capitalism','abominable','component','future','pasta','microwave',
    'jungle','wallet','canada','coffee','beauty','agency','chocolate',
    'eleven','technology','alphabet','knowledge','magician','professor',
    'triangle','earthquake','baseball','beyond','evolution','banana',
    'perfumer','computer','management','discovery','ambition','music',
    'eagle','crown','chess','laptop','bedroom','delivery','enemy',
    'button','superman','library','unboxing','bookstore','language',
    'homework','fantastic','economy','interview','awesome','challenge',
    'science','mystery','famous','league','memory','leather','planet',
    'software','update','yellow','keyboard','window'];

const backgroundMusic = new Audio('./assets/media/background-sound.mp3');
backgroundMusic.loop = true;

const gameOverMusic = new Audio('./assets/media/end.mp3');
const victoryMusic = new Audio('./assets/media/winning-sound.mp3');

let time = 99;
let score = 0;
let currentWord = "";
let timer = null;
let totalWordsShown = 0;

// Retrieve High Scores from LocalStorage (JSON.parse converts string to Array)
let highScores = JSON.parse(localStorage.getItem('scores')) || [];

const wordEl = document.getElementById("word");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const sidebar = document.getElementById("statsSidebar");
const statsBtn = document.getElementById("statsBtn");
const closeSidebar = document.getElementById("closeSidebar");
const themeBtn = document.getElementById("themeBtn");
const volumeSlider = document.getElementById("volumeSlider");
const muteBtn = document.getElementById("muteBtn");

class Score {
    #date; 
    #hits; 
    #percentage;

    constructor(date, hits, percentage) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = percentage;
    }

    getDate() {return this.#date;}
    getHits() {return this.#hits;}
    getPercentage() {return this.#percentage;}
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function nextWord() {
    currentWord = getRandomWord();
    totalWordsShown++;
    wordEl.textContent = currentWord;
    wordEl.style.color = "white";
}

function startGame() {
    clearInterval(timer);
    backgroundMusic.pause(); 
    backgroundMusic.currentTime = 0; 
    sidebar.classList.remove("active");
    time = 99;
    score = 0;
    totalWordsShown = 0;
    timeEl.textContent = time;
    scoreEl.textContent = score;

    inputEl.disabled = false;
    inputEl.value = "";
    inputEl.focus();

    backgroundMusic.loop = true;
    backgroundMusic.volume = volumeSlider.value; 
    backgroundMusic.play().catch(error => {
        console.log("Audio blocked:", error);
    });

    nextWord();
    timer = setInterval(updateTime, 1000);
}

function updateTime() {
    time--;
    timeEl.textContent = time;
    if (time <= 0) {endGame();}
}

function endGame() {
    clearInterval(timer);
    inputEl.disabled = true;
    inputEl.blur();
    backgroundMusic.pause();

    const percentage = totalWordsShown > 0 ? Math.round((score / totalWordsShown) * 100) : 0;
    const today = new Date().toLocaleDateString();
    const finalResult = new Score(today, score, percentage);

    if (score === words.length) {
        victoryMusic.play();
    } else {
        gameOverMusic.play();
    }
    wordEl.textContent = `Score: ${finalResult.getHits()} (${finalResult.getPercentage()}%)`;

    saveHighScore(score);
    sidebar.classList.add("active");
}

function saveHighScore(newScore) {
    highScores.push(newScore);
    highScores.sort((a, b) => b - a); 
    highScores = highScores.slice(0, 3); 
    // Save to LocalStorage (JSON.stringify converts Array to string)
    localStorage.setItem('highScores', JSON.stringify(highScores));

    updateScoreUI();
}

function updateScoreUI() {
    const scoreElements = document.querySelectorAll(".score-val");
    highScores.forEach((s, i) => {
        if (scoreElements[i]) scoreElements[i].textContent = s;
    });
}

startBtn.addEventListener("click", startGame);

inputEl.addEventListener("input", () => {
    const typed = inputEl.value.toLowerCase();
    const target = currentWord.toLowerCase();
 
    if (target.startsWith(typed)) {
        wordEl.style.color = "white";
    } else {
        wordEl.style.color = "red";
        inputEl.value = typed.slice(0, -1); 
        return; 
    }

    if (typed === target) {
        score++;
        scoreEl.textContent = score;
        inputEl.value = "";

        if (score === words.length) {
            endGame(); 
            return; 
        }
        nextWord();
    }
});

statsBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
});

closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("active");
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle('purple'); 
});

volumeSlider.addEventListener("input", (e) => {
    const vol = e.target.value;
    backgroundMusic.volume = vol;
    victoryMusic.volume = vol;
    gameOverMusic.volume = vol;
});

muteBtn.addEventListener("click", () => {
    const isMuted = backgroundMusic.muted = !backgroundMusic.muted;
    victoryMusic.muted = gameOverMusic.muted = isMuted;
    muteBtn.textContent = isMuted ? "Unmute" : "Mute";
});

// Initialize Score UI on Page Load
updateScoreUI();