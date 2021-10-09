let slideIndex = 0;
let startButton = document.querySelector("#start-btn");
let startClock, stopClock;
const bgdMusic = document.querySelector("#bgd-music");
bgdMusic.volume = 0.2;


function init() {
  showSlides();
  animate();
}


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


startButton.addEventListener("click", (event) => {
  let introPage = document.querySelector("#intro-page");
  let gamePage = document.querySelector("#game-page");

  introPage.style.display = "none";
  gamePage.style.display = "block";

  startClock = Date.now();
  bgdMusic.play();

  generateOrbs(17, 10, 20, Orb, idleOrbs);
  // generate a random number of hunter orbs
  let randHunterOrbsAmount = random(3, 6)
  generateOrbs(randHunterOrbsAmount, myOrb.radius, 45, HunterOrb, hunterOrbs);
  
  myOrb.draw();
})


init();