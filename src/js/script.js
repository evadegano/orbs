let slideIndex = 0;
let startButton = document.querySelector("#start-btn");
let startClock, stopClock;
const bgdMusic = document.querySelector("#bgd-music");
bgdMusic.volume = 0.2;


showSlides();

function showSlides() {
  let slides = document.querySelectorAll(".slide");
  
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    

  slides[slideIndex-1].style.display = "block";  

  setTimeout(showSlides, 3000); // Change image every 2 seconds
}

function createStorage() {
  // if there is no local storage, create a new one
  if (localStorage.length === 0) {
    localStorage.setItem('largestSize', playerOrb.radius);
    localStorage.setItem('longestTime', 0);
    localStorage.setItem('maxOrbsSwallowed', 0);
    localStorage.setItem('totalGames', 0);
  }
}

function updateScoreBoard() {
  scoreBoard[0].querySelector("span").textContent = Math.floor(playerOrb.radius);
  scoreBoard[1].querySelector("span").textContent = playerOrb.orbsSwallowed;
  scoreBoard[2].querySelector("span").textContent = Math.floor(localStorage.getItem("largestSize"));
  scoreBoard[3].querySelector("span").textContent = localStorage.getItem("maxOrbsSwallowed");
}

startButton.addEventListener("click", (event) => {
  const introPage = document.querySelector("#intro-page");
  const gamePage = document.querySelector("#game-page");

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
  let randAmount = random(20, 25);
  generateOrbs(randAmount, 10, 20, Orb);
  randAmount = random(3, 5);
  generateOrbs(randAmount, playerOrb.radius, 45, ActiveOrb);

  // make active orbs look for a target
  for (let i = orbs.length - 1; i >= 0; i--) {
    if (orbs[i].type === "active") {
      orbs[i].hunt(orbs)
    }
  }
  
  // launch game
  animate();
})