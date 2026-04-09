'use strict';

const words = ['dinosaur','love','pineapple','calendar','robot','building','population',
            'weather','bottle','history','dream','character','money','absolute','discipline'
            ,'machine','accurate','connection','rainbow','bicycle','eclipse','calculator',
            'trouble','watermelon','developer','philosophy','database','periodic','capitalism',
            'abominable','component','future','pasta','microwave','jungle','wallet','canada',
            'coffee','beauty','agency','chocolate','eleven','technology','alphabet','knowledge',
            'magician','professor','triangle','earthquake','baseball','beyond','evolution','banana',
            'perfumer','computer','management','discovery','ambition','music','eagle','crown','chess',
            'laptop','bedroom','delivery','enemy','button','superman','library','unboxing','bookstore',
            'language','homework','fantastic','economy','interview','awesome','challenge','science',
            'mystery','famous','league','memory','leather','planet','software','update','yellow','keyboard',
            'window'];

const backgroundMusic = new Audio (' ./assets/media/background.mp3');
backgroundMusic.loop= true;

const gameOverMusic = new Audio (' ./assets/media/end.mp3');
const victoryMusic = new Audio (' ./assets/media/winning.mp3');

let time = 99;
let score = 0;
let currentWord = "";
let timer = null;

const wordEl = document.getElementById("word");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
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
    return words [Math.floor (Math.random() * words.length)];
}

function nextWord() {
    currentWord = getRandomWord();
    wordEl.textContent = currentWord;
}

function startGame() {
    time = 99;
    score = 0;
    timeEl.textContent = time;
    scoreEl.textContent = score;
    
    inputEl.disabled = false;
    inputEl.value = "";
    inputEl.focus();
    
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();

    nextWord();
    clearInterval(timer);
    timer = setInterval(updateTime, 1000);
}

function updateTime() {
    time--;
    timeEl.textContent = time;
    if (time <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(timer);
    inputEl.disabled = true;
    backgroundMusic.pause();

    const percentage = Math.round((score / words.length) * 100);
    const today = new Date().toLocaleDateString();
    const finalResult = new Score(today, score, percentage);

    if (score === words.length) {
        winSound.play();
        wordEl.textContent = "Winner!";
    } else {
        failSound.play();
        wordEl.textContent = "Game Over!";
    }

    wordEl.textContent = `Game Over! Score: ${gameScore.getHits()} (${gameScore.getPercentage()}%)`;
}

startBtn.addEventListener("click", startGame);

inputEl.addEventListener("input", () => {
    if (inputEl.value.trim(). toLowerCase() === currentWord.toLowerCase()) {
        score++;
        scoreEl.textContent = score;
        inputEl.value ="";
        if (score === words.length) {
            endGame();
        } else {
            nextWord();
        }
    }
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle('theme-pink');
});

volumeSlider.addEventListener("input", (e) => {
    const vol = e.target.value;
    backgroundMusic.volume = vol;
    winSound.volume = vol;
    failSound.volume = vol;
});

muteBtn.addEventListener("click", () => {
    const isMuted = backgroundMusic.muted = !backgroundMusic.muted;
    winSound.muted = failSound.muted = isMuted;
    muteBtn.textContent = isMuted ? "Unmute" : "Mute";
});