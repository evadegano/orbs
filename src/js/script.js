// site's elements
const startButton = document.querySelector("#start-btn");
const restartButton = document.querySelector("#restart-btn");
const scoreBoard = document.querySelector("#score-board");
const scoreBoardStats = document.querySelectorAll("#score-board p span");
const introPage = document.querySelector("#intro-page");
const gamePage = document.querySelector("#game-page");
const modalBox = document.querySelector("#modal-box");
const modalBoxStats = document.querySelectorAll("#modal-wrapper div h3 span");
const backgroundImg = document.querySelector("#bgd-img");
const bgdMusic = document.querySelector("#bgd-music");
const swallowSound = document.querySelector("#swallow-sound");
const buttonClick = document.querySelector("#button-click");
const gameoverSound = document.querySelector("#gameover-sound");


let slideIndex = 0;
let startClock, stopClock;


// generate a random float in a given interval
function random(min, max) {
  return Math.random() * (max - min) + min;
}


// display slides
function showSlides() {
  const slides = document.querySelectorAll(".slide");
  
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    

  slides[slideIndex-1].style.display = "block";  

  setTimeout(showSlides, 3000); // Change image every 2 seconds
}


// create a local storage to cache player infos
function createStorage() {
  localStorage.setItem("largestSize", 30);
  localStorage.setItem("longestTime", 0);
  localStorage.setItem("maxOrbsSwallowed", 0);
  localStorage.setItem("totalGames", 0);
}


// update scoreboard with new stats
function updateStats(element) {
  if (element === scoreBoardStats) {
    element[0].textContent = Math.floor(playerOrb.radius);
    element[1].textContent = playerOrb.orbsSwallowed;
    element[2].textContent = Math.floor(localStorage.getItem("largestSize"));
    element[3].textContent = localStorage.getItem("maxOrbsSwallowed");
  } else {
    element[0].textContent = Math.floor(playerOrb.radius);
    element[1].textContent = playerOrb.orbsSwallowed;
    element[2].textContent = `${stopClock / 1000}s`;
    element[3].textContent = Math.floor(localStorage.getItem("largestSize"));
    element[4].textContent = localStorage.getItem("maxOrbsSwallowed");
    element[5].textContent = `${localStorage.getItem("longestTime") / 1000}s`;
  }
  
}


// set image sizes and sound effects volume
function setAttributes() {
  // set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // set background image size depending on screen size ratio
  let imgSizeRatio = backgroundImg.naturalWidth / backgroundImg.naturalHeight;
  let viewportSizeRatio = window.innerWidth / window.innerHeight;

  if (viewportSizeRatio >= imgSizeRatio) {
    backgroundImg.width = window.innerWidth;
  } else {
    backgroundImg.height = window.innerHeight;
  }
  
  // set sound effects volume
  bgdMusic.volume = 0.2;
  swallowSound.volume = 0.05;
  buttonClick.volume = 0.1;
  gameoverSound.volume = 0.2;
}


// initialize new game
function initGame() {
  // reset game parameters
  isGameOver = false;
  orbs = [];

  // add player orb to the game
  playerOrb = new PlayerOrb(mouse);
  orbs.push(playerOrb);

  // start game clock
  startClock = Date.now();

  // restart and play background music
  bgdMusic.src = "./src/sounds/relaxing-ambient-music-jonny-easton.mp3";
  bgdMusic.play();

  // update scoreboard with player's info
  updateStats(scoreBoardStats);

  // add a random amount of inactive and active orbs to the game
  let randAmount = random(15, 20);
  generateOrbs(randAmount, 20, 30, Orb);
  randAmount = random(3, 5);
  generateOrbs(randAmount, playerOrb.radius - 5, playerOrb.radius + 10, ActiveOrb);

  // make active orbs look for a target
  for (let i = orbs.length - 1; i >= 0; i--) {
    if (orbs[i].type === "active") {
      orbs[i].hunt(orbs);
    }
  }
  
  // animate game
  animate();
}


// display player's stats when game is over
function gameOver() {
  // get for how long the game ran
  stopClock = Date.now() - startClock;

  // if new time record was reached, update local storage
  if (stopClock > localStorage.getItem("longestTime")) {
    localStorage.setItem("longestTime", stopClock);
  }

  // update stats in the modal box
  updateStats(modalBoxStats);

  // stop background music
  bgdMusic.pause();
  gameoverSound.play();

  // display modal box
  scoreBoard.style.display = "none";
  modalBox.style.display = "block";
}


// display welcome page on load
window.addEventListener("load", event => {
  showSlides();
})


// launch game when start button is clicked
startButton.addEventListener("click", event => {
  // play sound effect
  buttonClick.play()

  // set gameplay attributes
  setAttributes();

  // hide welcome page and display game page
  introPage.style.display = "none";
  gamePage.style.display = "block";

  // if there is no local storage, create a new one
  if (localStorage.length === 0) {
    createStorage();
  }

  initGame();
})


// launch new game when restart button is clicked
restartButton.addEventListener("click", event => {
  // play sound effect
  buttonClick.play();

  // hide modal box and display score board
  modalBox.style.display = "none";
  scoreBoard.style.display = "flex";

  initGame();
})