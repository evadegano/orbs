const canvas = document.getElementById("2D-canvas");
const canvasCenter = {
  x: canvas.width / 2,
  y: canvas.height / 2
}
const ctx = canvas.getContext("2d");

var speed = 0.5;
var orbs = [];
var myOrb;


class Orb {
  constructor(x, y, radius) {
    this.pos = {
      x: x,
      y: y
    };
    this.delta = {
      x: 0,
      y: 0
    }
    this.radius = radius;
    this.speed = speed;
    this.color = "red";
  }
  
  drawOrb() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class MyOrb extends Orb {
  constructor() {
    super(canvasCenter.x, canvasCenter.y);
    this.radius = 30;
    this.color = "blue";
    this.largestSize = 0;
    this.longestTime = 0;
    this.maxOrbsSwallowed = 0;
    this.totalOrbsSwallowed = 0;
    this.totalGames = 0;
  }

  update(mouse) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawOrb()

    this.delta.x = (mouse.x - this.pos.x);
    this.delta.y = (mouse.y - this.pos.y);

    this.pos.x += this.delta.x;
    this.pos.y += this.delta.y;
  }
}

// add orbs to the game and assign them random positions 
function addOrbs() {
  for (let i = 0; i < 20; i++) {
    let randX = Math.random() * canvas.width;
    let randY = Math.random() * canvas.height;
    let randR = Math.random() * (30 - 10) + 10;

    orbs[i] = new Orb(randX, randY, randR);
  }
}

// draw the orbs on the canvas
function drawOrbs() {
  for (let orb of orbs) {
    orb.drawOrb();
  }
}

// change later to start click
window.addEventListener("load", (event) => {
  addOrbs();
  
  myOrb = new MyOrb();
  myOrb.drawOrb();
})

// animate game
let animate = function() {
  requestAnimationFrame(animate);
  drawOrbs();
}

animate();

// make myOrb follow the mouse
window.addEventListener("mousemove", (event) => {
  let mouse = {
    x: event.pageX,
    y: event.pageY
  }

  myOrb.update(mouse);

})