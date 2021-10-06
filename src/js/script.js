const canvas = document.getElementById("2D-canvas");
const canvasCenter = {
  x: canvas.width / 2,
  y: canvas.height / 2
}
const ctx = canvas.getContext("2d");

var orbs = [];
var myOrb;


// add orbs to the game and assign them random positions 
function addOrbs() {
  for (let i = 0; i < 20; i++) {
    let randR = Math.random() * (40 - 10) + 10;
    let randX = Math.random() * (canvas.width - randR) + randR;
    let randY = Math.random() * (canvas.height - randR) + randR;

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
  // loop from end of array to make splicing easier
  for (let i = orbs.length - 1; i >= 0; i--) {
    if (myOrb.doesSwallow(orbs[i])) {
      orbs.splice(i, 1);
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
}

animate();

