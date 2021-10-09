const canvas = document.getElementById("game-canvas");
const canvasCenter = {
  x: canvas.width / 2,
  y: canvas.height / 2
}
const ctx = canvas.getContext("2d");
const scoreBoard = document.querySelectorAll("#score-board p");

const swallowSound = document.querySelector("#swallow-sound");
swallowSound.volume = 0.25;

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

      swallowSound.play();
      idleOrbs.splice(i, 1);
      generateOrbs(1, 10, 20, Orb, idleOrbs);

      // update the scoreboard
      scoreBoard[0].querySelector("span").textContent = Math.floor(myOrb.radius);
      scoreBoard[1].querySelector("span").textContent = myOrb.orbsSwallowed;
      scoreBoard[2].querySelector("span").textContent = Math.floor(myOrb.largestSize);
      scoreBoard[3].querySelector("span").textContent = myOrb.maxOrbsSwallowed;
    }
  }
}

function orbsHunt() {
  for (let orb of hunterOrbs) {
    if (orb.hunt(idleOrbs)) {
      generateOrbs(1, 10, 20, Orb, idleOrbs);
    };
  }
}


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

  /* 
  ctx.save() // sauvegarde la position de mon "curseur"
  if (canvas.height - myOrb.pos.y < canvasCenter.y) {
    ctx.translate(0,0) // si mario s'approche du sol => on ne bouge pas la camera
  } else {
    ctx.translate(0, - myOrb.pos.y + canvasCenter.y) // la camera suit le y de mario (centré)
  }
  ctx.restore()
  */

  myOrb.seek(mouse);
  draw(idleOrbs);
  draw(hunterOrbs);
  removeOrbs();
  orbsHunt();

  
}