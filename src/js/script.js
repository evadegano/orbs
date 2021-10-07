const canvas = document.getElementById("2D-canvas");
const canvasCenter = {
  x: canvas.width / 2,
  y: canvas.height / 2
}
const ctx = canvas.getContext("2d");
//const camera = new Camera(ctx);
const scoreBoard = document.querySelectorAll("#score-board p");
const swallowSound = document.querySelector("#swallow-sound");

var orbs = [];
var myOrb;


// add orbs to the game and assign them random positions 
function addOrbs() {
  for (let i = 0; i < 20; i++) {
    let randR = random(10, 40);
    let randX = random(randR, canvas.width);
    let randY = random(randR, canvas.height);

    orbs[i] = new Orb(randX, randY, randR);
  }
}

// draw the orbs on the canvas
function drawOrbs() {
  for (let orb of orbs) {
    orb.drawOrb();
    orb.updateTexture();
  }
}

function removeOrbs() {
  // start from end of array to make splicing easier
  for (let i = orbs.length - 1; i >= 0; i--) {
    if (myOrb.doesSwallow(orbs[i])) {
      swallowSound.play();
      
      orbs.splice(i, 1);

      // update the scoreboard
      scoreBoard[0].querySelector("span").textContent = Math.floor(myOrb.radius);
      scoreBoard[1].querySelector("span").textContent = myOrb.orbsSwallowed;
      scoreBoard[2].querySelector("span").textContent = Math.floor(myOrb.largestSize);
      scoreBoard[3].querySelector("span").textContent = myOrb.maxOrbsSwallowed;
      //ctx.scale(30 / myOrb.radius, 30 / myOrb.radius);
    }
  }
}

function moveCamera() {
  ctx.translate(-myOrb.pos.x, -myOrb.pos.y);
}

// change later to start click
window.addEventListener("load", (event) => {
  addOrbs();
  
  myOrb = new MyOrb();
  myOrb.drawOrb();
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

  myOrb.update(mouse);
  //console.log(mouse)
  //moveCamera();
  drawOrbs();
  removeOrbs();

  while (orbs.length < 20) {
    let randR = random(10, 40);
    let randX = random(randR, canvas.width);
    let randY = random(randR, canvas.height);
    orbs.push(new Orb(randX, randY, randR));
  }
}

animate();

