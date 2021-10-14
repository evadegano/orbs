// site's elements
const startButton = document.querySelector("#start-btn");
const scoreBoard = document.querySelectorAll("#score-board p");
const introPage = document.querySelector("#intro-page");
const gamePage = document.querySelector("#game-page");
const bgdMusic = document.querySelector("#bgd-music");
const swallowSound = document.querySelector("#swallow-sound");
const backgroundImg = document.querySelector("#bgd-img");

let slideIndex = 0;
let startClock;


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
  // if there is no local storage, create a new one
  if (localStorage.length === 0) {
    localStorage.setItem('largestSize', playerOrb.radius);
    localStorage.setItem('longestTime', 0);
    localStorage.setItem('maxOrbsSwallowed', 0);
    localStorage.setItem('totalGames', 0);
  }
}


// update scoreboard with new stats
function updateScoreBoard() {
  scoreBoard[0].querySelector("span").textContent = Math.floor(playerOrb.radius);
  scoreBoard[1].querySelector("span").textContent = playerOrb.orbsSwallowed;
  scoreBoard[2].querySelector("span").textContent = Math.floor(localStorage.getItem("largestSize"));
  scoreBoard[3].querySelector("span").textContent = localStorage.getItem("maxOrbsSwallowed");
}


// 
function setAttributes() {
  // set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // set background image size depending on canvas size
  if (canvas.width > canvas.height) {
    backgroundImg.width = canvas.width;
  } else {
    backgroundImg.height = canvas.height;
  }
  
  // set sound effects volume
  bgdMusic.volume = 0.2;
  swallowSound.volume = 0.15;
}


// display welcome page on load
window.addEventListener("load", event => {
  showSlides();
})


// launch game when start button is clicked
startButton.addEventListener("click", (event) => {
  // set gameplay attributes
  setAttributes();

  // hide welcome page and display game page
  introPage.style.display = "none";
  gamePage.style.display = "block";

  // start game clock
  startClock = Date.now();

  // play background music
  bgdMusic.play();

  // create a local storage to stock player's info
  createStorage();

  // update scoreboard with player's info
  updateScoreBoard()

  // add a random amount of inactive and active orbs to the game
  let randAmount = random(15, 20);
  generateOrbs(randAmount, 20, 30, Orb);
  randAmount = random(3, 5);
  generateOrbs(randAmount, playerOrb.radius, playerOrb.radius + 10, ActiveOrb);

  // make active orbs look for a target
  for (let i = orbs.length - 1; i >= 0; i--) {
    if (orbs[i].type === "active") {
      orbs[i].hunt(orbs)
    }
  }
  
  // launch game
  animate();
})