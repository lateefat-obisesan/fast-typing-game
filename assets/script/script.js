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
let timer;

const wordEl = document.getElementById("word");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const music = document.getElementById("bgMusic");

// Score Class
class Score {
    #date;
    #hits;
    #percentage;

    constructor(date, hits, percentage) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = percentage;
    }

    getDate() {
        return this.#date;
    }
    getHits() {
        return this.#hits;
    }
    getPercentage() {
        return this.#percentage;
    }
}

// Random word
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

// Start Game
startBtn.addEventListener("click", startGame);

function startGame() {
    time = 99;
    score = 0;
    input.disabled = false;
    input.value = "";
    input.focus();

    nextWord();
    clearInterval(timer);
    timer = setInterval(updateTime, 1000);
}

// Timer
function updateTime() {
    time--;
    timeEl.textContent = time;

    if (time <= 0) {
        endGame();
    }
}

// Next word
function nextWord() {
    currentWord = getRandomWord();
    wordEl.textContent = currentWord;
}

// Typing logic
input.addEventListener("input", () => {
    if (input.value === currentWord) {
        score++;
        scoreEl.textContent = score;
        input.value = "";
        nextWord();

        if (score === words.length) {
            endGame();
        }
    }
});

// End Game
function endGame() {
    clearInterval(timer);
    input.disabled = true;
    music.pause();
    music.currentTime = 0;

    const percentage = Math.round((score / words.length) * 100);
    const gameScore = new Score(new Date(), score, percentage);

    wordEl.textContent = `Game Over! Score: ${gameScore.getHits()} (${gameScore.getPercentage()}%)`;
}