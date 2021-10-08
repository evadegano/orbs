const canvas = document.getElementById("play-canvas");
const canvasCenter = {
  x: canvas.width / 2,
  y: canvas.height / 2
}
const ctx = canvas.getContext("2d");
//const camera = new Camera(ctx);
const scoreBoard = document.querySelectorAll("#score-board p");
var startClock, stopClock;

const swallowSound = document.querySelector("#swallow-sound");
const bgdMusic = document.querySelector("#bgd-music");
bgdMusic.volume = 0.2;

let idleOrbs = [];
let hunterOrbs = [];
//let particleArray = [];
let myOrb = new MyOrb();

// add orbs to the game and assign them random positions 
function generateOrbs(amount, minRadius, maxRadius, className, array) {
  for (let i = 0; i < amount; i++) {
    let randR = random(minRadius, maxRadius);
    let randX = random(randR, canvas.width - randR);
    let randY = random(randR, canvas.height - randR);

    array.push(new className(randX, randY, randR));
  }
}

// draw  orbs on the canvas
function draw(array) {
  for (let orb of array) {
    orb.draw();
  }
}

function removeOrbs() {
  for (let i = idleOrbs.length - 1; i >= 0; i--) {
    if (myOrb.doesSwallow(idleOrbs[i])) {
      idleOrbs.splice(i, 1);

      // update the scoreboard
      scoreBoard[0].querySelector("span").textContent = Math.floor(myOrb.radius);
      scoreBoard[1].querySelector("span").textContent = myOrb.orbsSwallowed;
      scoreBoard[2].querySelector("span").textContent = Math.floor(myOrb.largestSize);
      scoreBoard[3].querySelector("span").textContent = myOrb.maxOrbsSwallowed;
    }
  }
}


function orbsHunt() {
  /*
  for (orb of hunterOrbs) {
    orb.hunt(idleOrbs);
  }*/

  hunterOrbs[0].hunt(idleOrbs);
}


// change later to start click
window.addEventListener("load", (event) => {
  startClock = Date.now();

  generateOrbs(17, 10, myOrb.radius, Orb, idleOrbs);

  // generate a random number of hunter orbs
  let randHunterOrbsAmount = random(3, 6)
  generateOrbs(randHunterOrbsAmount, myOrb.radius, 45, HunterOrb, hunterOrbs);

  // generate particles
  //generateOrbs(5, 6, 17, Particle, particleArray);
  
  myOrb.draw();
})


// get mouse coordinates
var mouse = {
  x: 0,
  y: 0
}

window.addEventListener("mousemove", (event) => {
  mouse.x = event.pageX,
  mouse.y = event.pageY
})


// animate game
let animate = function() {

  requestAnimationFrame(animate);
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  myOrb.seek(mouse);
  draw(idleOrbs);
  draw(hunterOrbs);

  /*
  for (let particle of particleArray) {
    particle.draw();
    particle.update();
  }
  */

  //draw(particleArray);
  removeOrbs();
  orbsHunt();
}

animate();

