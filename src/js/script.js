let slideIndex = 0;
let introPage = document.querySelector("#intro-page");
let startButton = document.querySelector("#start-btn");
let gamePage = document.querySelector("#game-page");

startButton.addEventListener("click", (event) => {
  introPage.style.display = "none";
  gamePage.style.display = "block";
})

showSlides();

function showSlides() {
  var i;
  var slides = document.querySelectorAll(".slide");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    

  slides[slideIndex-1].style.display = "block";  

  setTimeout(showSlides, 3000); // Change image every 2 seconds
}

