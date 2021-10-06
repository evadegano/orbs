const canvas = document.getElementById("2D-canvas");
const canvasCenter = {
  x: canvas.width / 2,
  y: canvas.height / 2
}
const ctx = canvas.getContext("2d");

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
    this.speed = 1.5;
    this.color = "blue";
  }
  
  // draw orb on the canvas
  drawOrb() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  // turn orbs to red when they are larger than myOrb
  updateTexture() {
    if (this.radius > myOrb.radius) {
      this.color = "red";
      this.drawOrb();
    }
  }
}

class MyOrb extends Orb {
  constructor() {
    super(canvasCenter.x, canvasCenter.y);
    this.radius = 30;
    this.color = "purple";
    this.largestSize = 0;
    this.longestTime = 0;
    this.maxOrbsSwallowed = 0;
    this.totalOrbsSwallowed = 0;
    this.totalGames = 0;
  }

  update(mouse) {
    // clear canvas and re-draw the orb
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawOrb()

    this.delta.x = (mouse.x - this.pos.x);
    this.delta.y = (mouse.y - this.pos.y);
    let angle = Math.atan2(this.delta.y, this.delta.x);
    let velX = this.speed * Math.cos(angle);
    let velY = this.speed * Math.sin(angle);

    this.pos.x += velX;
    this.pos.y += velY ;
  }
}

// add orbs to the game and assign them random positions 
function addOrbs() {
  for (let i = 0; i < 20; i++) {
    let randX = Math.random() * canvas.width;
    let randY = Math.random() * canvas.height;
    let randR = Math.random() * (40 - 10) + 10;

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