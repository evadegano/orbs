
const smallerOrbImg = document.querySelector("#smaller-orb");
const largerOrbImg = document.querySelector("#larger-orb");
const myOrbImg = document.querySelector("#my-orb");


// inactive orbs
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
    this.type = "inactive";
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

// active orbs
class ActiveOrb extends Orb {
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
    this.type = "active"
    this.target = null;
    this.visionArea = this.radius * 3;
  }

  // search for nearest target
  hunt(orbsArray) {
    // distance to the nearest target
    let minDist = {
      x: Infinity,
      y: Infinity
    };

    // index of the closest orb
    let closestOrbIndex = -1;

    for (let i = 0; i < orbsArray.length; i++) {
      // make sure active orbs don't target each other
      if (orbsArray[i].type === "active") {
        continue;
      }

      // don't target orbs that are already targeted
      if (orbsArray[i].isTarget) {
        continue;
      }

      // calculate the distance to potential target
      let dist = {
        x: Math.abs(this.pos.x - orbsArray[i].pos.x),
        y: Math.abs(this.pos.y - orbsArray[i].pos.y)
      }

      // if distance is smaller than the current min distance, update min distance
      if (dist.x + dist.y < minDist.x + minDist.y) {
        minDist.x = dist.x;
        minDist.y = dist.y;

        // store the index of the new closest target
        closestOrbIndex = i;
      }
    }

    // set orb as target
    orbs[closestOrbIndex].isTarget = true;
    this.target = orbs[closestOrbIndex];
  }

  // chase target
  chase() {
    // distance between orb and the target
    let dist = {
      x: this.target.pos.x - this.pos.x,
      y: this.target.pos.y - this.pos.y
    }
  
    // normalize distance to the target
    let magnitude = Math.sqrt(dist.x ** 2 + dist.y ** 2);
    dist.x /= magnitude;
    dist.y /= magnitude;

    // move toward the target
    this.pos.x += dist.x * this.maxspeed;
    this.pos.y += dist.y * this.maxspeed;
  }

  // if collision between two orbs, the largest one swallows the other one
  swallow(orb) {
    // distance between orb and other orb
    let dist = {
      x: Math.abs(this.pos.x - orb.pos.x),
      y: Math.abs(this.pos.y - orb.pos.y)
    }

    let totalRadius = (this.radius + orb.radius) * 0.6;

    // detect if there is a collision and if orb is bigger than the other orb
    if (dist.x < totalRadius && dist.y < totalRadius && this.radius > orb.radius) {
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
}

// player Orb
class PlayerOrb extends ActiveOrb {
  constructor(mouse) {
    super(0, 0);
    this.radius = 30;
    this.img = myOrbImg;
    this.orbsSwallowed = 0;
    this.glow = '#9EEAF9';
    this.type = "player";
    this.target = mouse;
    this.visionArea = canvas.width + canvas.height;
  }

  // chase target
  chase() {
    // distance between player orb and the target
    let dist = {
      x: this.target.pos.x - canvas.width / 2,
      y: this.target.pos.y - canvas.height / 2
    }

    // normalize distance to the target
    let magnitude = Math.sqrt(dist.x ** 2 + dist.y ** 2);
    dist.x /= magnitude;
    dist.y /= magnitude;

    this.pos.x += dist.x * this.maxspeed;
    this.pos.y += dist.y * this.maxspeed;
  }

  swallow(orb) {
    // distance between player orb and other orb
    let dist = {
      x: Math.abs(this.pos.x - orb.pos.x),
      y: Math.abs(this.pos.y - orb.pos.y)
    }

    let totalRadius = (this.radius + orb.radius) * 0.6;

    // check if there is a collision and if orb is bigger than the other orb
    if (dist.x < totalRadius && dist.y < totalRadius && this.radius > orb.radius) {
      // update the number of orbs swallowed
      this.orbsSwallowed++;

      // if new record of orbs eaten, update max orbs eaten in local storage
      if (localStorage.getItem('maxOrbsSwallowed') < this.orbsSwallowed) {
        localStorage.setItem('maxOrbsSwallowed', this.orbsSwallowed);
      }
      
      // increase player orb with the area of orb that was swallowed
      let orbArea = Math.PI * orb.radius ** 2
      let thisArea = Math.PI * this.radius ** 2;
      thisArea += orbArea;

      // update radius with the radius of the new area
      this.radius = Math.sqrt(thisArea / Math.PI);

      // decrease speed as orb gets bigger
      this.maxspeed = 40.0 / this.radius;

      // if new record size, update largest size in local storage
      if (localStorage.getItem('largestSize') < this.radius) {
        localStorage.setItem('largestSize', this.radius);
      }

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