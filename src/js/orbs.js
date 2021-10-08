
var smallerOrbImg = document.querySelector("#smaller-orb");
var largerOrbImg = document.querySelector("#larger-orb");
var myOrbImg = document.querySelector("#my-orb");

// idle orbs
class Orb {
  constructor(x, y, radius) {
    this.pos = {
      x: x,
      y: y
    };
    this.radius = radius;
    this.img = smallerOrbImg;
  }
  
  // draw orb on the canvas
  draw() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius + 1.5, 0, 2 * Math.PI);
    ctx.shadowColor = '#9EEAF9';
    ctx.shadowBlur = 1.0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#9EEAF9';
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(this.img, this.pos.x - this.radius, this.pos.y - this.radius, this.radius*2, this.radius*2);
  }
}

// hunter orbs
class HunterOrb extends Orb {
  constructor(x, y, radius) {
    super(x, y, radius);
    this.maxspeed = 1.0;
    this.maxforce = 0.2;
    this.acceleration = {
      x: null,
      y: null
    };
    this.velocity = {
      x: null,
      y: null
    };
    this.img = largerOrbImg;
  }

  // if collision between two orbs, the largest one swallows the other one
  doesSwallow(orb) {
    let delta = {
      x: null,
      y: null
    }

    delta.x = Math.abs(this.pos.x - orb.pos.x);
    delta.y = Math.abs(this.pos.y - orb.pos.y);

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

  seek(orbsArray, orb, index) {
    // calculate the direction towards the target
    let delta = {
      x: 0,
      y: 0
    }
    delta.x = orb.pos.x - this.pos.x;
    delta.y = orb.pos.y - this.pos.y;

    // normalize delta
    let magnitude = Math.sqrt(delta.x ** 2 + delta.y ** 2);
    delta.x /= magnitude;
    delta.y /= magnitude;

    // use if I need my orb to rotate
    //let angle = Math.atan2(this.delta.y, this.delta.x);
    //let velX = this.maxspeed * Math.cos(angle);
    //let velY = this.maxspeed * Math.sin(angle);

    this.pos.x += delta.x * this.maxspeed;
    this.pos.y += delta.y * this.maxspeed;

    if (this.doesSwallow(orb)) {
      orbsArray.splice(index, 1);
    }
  }

  hunt(orbsArray) {
    let minDelta = {
      x: Infinity,
      y: Infinity
    };
    let delta = {
      x: null,
      y: null
    }

    // index of the closest orb
    let closestOrbIndex = -1;

    for (let i = 0; i < orbsArray.length; i++) {
      delta.x = Math.abs(this.pos.x - orbsArray[i].pos.x);
      delta.y = Math.abs(this.pos.y - orbsArray[i].pos.y);

      // normalize delta
      let magnitudeDelta = Math.sqrt(delta.x ** 2 + delta.y ** 2);
      delta.x /= magnitudeDelta;
      delta.y /= magnitudeDelta;

      if (delta.x + delta.y < this.pos.x + this.pos.y) {
        minDelta.x = delta.x;
        minDelta.y = delta.y;
        closestOrbIndex = i;
      }
    }

    this.seek(orbsArray, orbsArray[closestOrbIndex], closestOrbIndex);
  }
}

// my Orb
class MyOrb extends HunterOrb {
  constructor() {
    super(canvasCenter.x, canvasCenter.y);
    this.radius = 30;
    this.img = myOrbImg;
    this.largestSize = 0;
    this.longestTime = 0;
    this.maxOrbsSwallowed = 0;
    this.orbsSwallowed = 0;
    this.totalGames = 0;
  }

  seek(mouse) {
    // clear canvas and re-draw the orb
    this.draw()

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
    //let velX = this.maxspeed * Math.cos(angle);
    //let velY = this.maxspeed * Math.sin(angle);

    this.pos.x += delta.x * this.maxspeed;
    this.pos.y += delta.y * this.maxspeed ;
  }

  doesSwallow(orb) {
    let delta = {
      x: null,
      y: null
    }

    delta.x = Math.abs(this.pos.x - orb.pos.x);
    delta.y = Math.abs(this.pos.y - orb.pos.y);

    let totalRadius = (this.radius + orb.radius) * 0.6;

    // detect if there is a collision and if orb is bigger than the other orb
    if (delta.x < totalRadius && delta.y < totalRadius && this.radius > orb.radius) {
      // update the number of orbs swallowed
      this.orbsSwallowed++;

      // if new record of orbs eaten, update max orbs eaten
      if (this.maxOrbsSwallowed < this.orbsSwallowed) {
        this.maxOrbsSwallowed = this.orbsSwallowed;
      }
      
      // increase orb with the area of orb that was swallowed
      let thisArea = Math.PI * this.radius ** 2;
      let orbArea = Math.PI * orb.radius ** 2
      let newArea = thisArea + orbArea;
      
      this.radius = Math.sqrt(newArea / Math.PI);

      // if new record size, update largest size
      if (this.largestSize < this.radius) {
        this.largestSize = this.radius;
      }

      return true;
    }

    return false;
  }

  isSwallowed(orb) {
    let delta = {
      x: null,
      y: null
    }

    delta.x = Math.abs(this.pos.x - orb.pos.x);
    delta.y = Math.abs(this.pos.y - orb.pos.y);

    let totalRadius = (this.radius + orb.radius) * 0.6;

    // detect if there is a collision and if orb is smaller than the other orb
    if (delta.x < totalRadius && delta.y < totalRadius && this.radius < orb.radius) {
      // clear orb from canvas
      
      return true;
    }

    return false;
  }
}