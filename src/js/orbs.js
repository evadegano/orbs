
class Orb {
  constructor(x, y, radius) {
    this.pos = {
      x: x,
      y: y
    };
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
    } else {
      this.color = "blue";
      this.drawOrb();
    }
  }

  // if collision between two orbs, the largest one swallows the other one
  doesSwallow(orb) {
    let delta = {
      x: null,
      y: null
    }

    delta.x = Math.abs(this.pos.x - orb.pos.x);
    delta.y = Math.abs(this.pos.y - orb.pos.y);

    // keep 60% of the total 
    let totalRadius = (this.radius + orb.radius) * 0.6;

    // detect if there is a collision and if orb is bigger than the other orb
    if (delta.x < totalRadius && delta.y < totalRadius && this.radius > orb.radius) {
      // increase orb with the area of orb that was swallowed
      let thisArea = Math.PI * this.radius ** 2;
      let orbArea = Math.PI * orb.radius ** 2
      let newArea = thisArea + orbArea;
      
      this.radius = Math.sqrt(newArea / Math.PI);

      return true;
    }

    return false;
    
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

    // calculate the direction towards the mouse
    let delta = {
      x: 0,
      y: 0
    }
    delta.x = mouse.x - this.pos.x;
    delta.y = mouse.y - this.pos.y;

    // normalize delta
    let magnitude = Math.sqrt(delta.x ** 2 + delta.y ** 2);
    delta.x /= magnitude;
    delta.y /= magnitude;

    // use if I need my orb to rotate
    //let angle = Math.atan2(this.delta.y, this.delta.x);
    //let velX = this.speed * Math.cos(angle);
    //let velY = this.speed * Math.sin(angle);

    this.pos.x += delta.x * this.speed;
    this.pos.y += delta.y * this.speed ;
  }
}