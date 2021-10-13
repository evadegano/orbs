
const smallerOrbImg = document.querySelector("#smaller-orb");
const largerOrbImg = document.querySelector("#larger-orb");
const myOrbImg = document.querySelector("#my-orb");


// idle orbs
class Orb {
  constructor(x, y, radius) {
    this.pos = {
      x: x,
      y: y
    };
    this.radius = radius;
    this.img = smallerOrbImg;
    this.isTarget = false;
    this.glow = "#fffcd3";
  }
  
  // draw orb on the canvas
  draw() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius + 2.5, 0, 2 * Math.PI);
    ctx.shadowColor = this.glow;
    ctx.shadowBlur = 1.0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = this.glow;
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
      x: 0,
      y: 0
    };
    this.velocity = {
      x: 0,
      y: 0
    };
    this.img = largerOrbImg;
    this.glow = '#DE5E89';
  }

  // if collision between two orbs, the largest one swallows the other one
  swallow(orb) {
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
      let orbArea = Math.PI * orb.radius ** 2
      let thisArea = Math.PI * this.radius ** 2;
      thisArea += orbArea;
      
      // get the radius of the new area
      this.radius = Math.sqrt(thisArea / Math.PI);

      // decrease max speed as orb gets bigger
      this.maxspeed = 40.0 / this.radius;

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

    this.pos.x += delta.x * this.maxspeed;
    this.pos.y += delta.y * this.maxspeed;

    // if chased orb is swallowed, remove it from array
    if (this.swallow(orb)) {
      orbsArray.splice(index, 1);
      return true;
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

      if (minDelta.x + minDelta.y > delta.x + delta.y) {
        minDelta.x = delta.x;
        minDelta.y = delta.y;
        closestOrbIndex = i;
      }
    }

    if (this.seek(orbsArray, orbsArray[closestOrbIndex], closestOrbIndex)) {
      return true;
    };
  }
}

// my Orb
class MyOrb extends HunterOrb {
  constructor() {
    super(canvas.width / 2, canvas.height / 2);
    this.radius = 30;
    this.img = myOrbImg;
    this.orbsSwallowed = 0;
    this.glow = '#9EEAF9';
  }

  seek(mouse) {
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

    // prevent orb from going out of the canvas horizontally
    if (this.pos.x >= canvas.width - this.radius) {
      this.pos.x -= this.maxspeed;
    } else if (this.pos.x - this.radius <= 0) {
      this.pos.x += this.maxspeed;
    } else {
      this.pos.x += delta.x * this.maxspeed;
    }

    // prevent orb from going out of the canvas vertically
    if (this.pos.y >= canvas.height - this.radius) {
      this.pos.y -= this.maxspeed;
    } else if (this.pos.y - this.radius <= 0) {
      this.pos.y += this.maxspeed;
    } else {
      this.pos.y += delta.y * this.maxspeed;
    }
  }

  swallow(orb) {
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

      // if new record of orbs eaten, update max orbs eaten in local storage
      if (localStorage.getItem('maxOrbsSwallowed') < this.orbsSwallowed) {
        localStorage.setItem('maxOrbsSwallowed', this.orbsSwallowed);
      }
      
      // increase orb with the area of orb that was swallowed
      let orbArea = Math.PI * orb.radius ** 2
      let thisArea = Math.PI * this.radius ** 2;
      thisArea += orbArea;

      // get the radius of the new area
      this.radius = Math.sqrt(thisArea / Math.PI);

      // decrease max speed as orb gets bigger
      this.maxspeed = 40.0 / this.radius;

      // if new record size, update largest size in local storage
      if (localStorage.getItem('largestSize') < this.radius) {
        localStorage.setItem('largestSize', this.radius);
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

/*

attraction
perception radius that grow with their size
size grows logarithmicly

*/