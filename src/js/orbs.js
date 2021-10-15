const inactiveImg = document.querySelector("#yellow-orb");
const activeImg = document.querySelector("#red-orb");
const playerImg = document.querySelector("#blue-orb");


// inactive orbs
class Orb {
  constructor(x, y, radius) {
    this.pos = {
      x: x,
      y: y
    };
    this.radius = radius;
    this.img = inactiveImg;
    this.glow = "#F9F2A6"
    this.glowSize = 10;
    this.isTarget = false;
    this.type = "inactive";
  }
  
  // draw orb on the canvas
  draw() {
    ctx.shadowColor = this.glow;
    ctx.shadowBlur = this.glowSize;
    ctx.drawImage(this.img, this.pos.x - this.radius, this.pos.y - this.radius, this.radius*2, this.radius*2);
  }
}


// active orbs
class ActiveOrb extends Orb {
  constructor(x, y, radius) {
    super(x, y, radius);
    // set a speed that decreases as radius increases | maxSpeed = 1.5 and minSpeed = 0.7
    this.speed = 0.8 * Math.exp(-(this.radius - 30) / 13.90) + 0.7;
    this.img = activeImg;
    this.glow = "#B22222";
    this.glowSize = 15;
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
    orbsArray[closestOrbIndex].isTarget = true;
    this.target = orbsArray[closestOrbIndex];
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

    // if target is player orb and is larger than active orb, run in the other direction
    if (this.target.type === "player" && this.target.radius > this.radius) {
      this.speed *= -1;
    }

    // move toward the target
    this.pos.x += dist.x * this.speed;
    this.pos.y += dist.y * this.speed;
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
      thisArea += orbArea / 10;
      
      // get the radius of the new area
      this.radius = Math.sqrt(thisArea / Math.PI);

      return true;
    }

    return false;
  }
}


// player Orb
class PlayerOrb extends ActiveOrb {
  constructor(mouse) {
    super(canvas.width / 2, canvas.height / 2);
    this.radius = 30;
    this.speed = 0.8 * Math.exp(-(this.radius - 30) / 13.90) + 0.7;
    this.img = playerImg;
    this.glow = "#001E17";
    this.orbsSwallowed = 0;
    this.type = "player";
    this.target = mouse;
  }

  // chase target
  chase() {
    // distance between player orb and the target
    let dist = {
      x: null,
      y: null
    }

    if (this.pos.x < canvas.width / 2 && this.pos.y < canvas.height / 2) {
      dist.x = this.target.pos.x - this.pos.x;
      dist.y = this.target.pos.y - this.pos.y;
    } else if (this.pos.x < canvas.width / 2) {
      dist.x = this.target.pos.x - this.pos.x;
      dist.y = this.target.pos.y - canvas.height / 2;
    } else if (this.pos.y < canvas.height / 2) {
      dist.x = this.target.pos.x - canvas.width / 2;
      dist.y = this.target.pos.y - this.pos.y;
    } else {
      dist.x = this.target.pos.x - canvas.width / 2;
      dist.y = this.target.pos.y - canvas.height / 2;
    }

    // normalize distance to the target
    let magnitude = Math.sqrt(dist.x ** 2 + dist.y ** 2);
    dist.x /= magnitude;
    dist.y /= magnitude;

    this.pos.x += dist.x * this.speed;
    this.pos.y += dist.y * this.speed;
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
      if (localStorage.getItem("maxOrbsSwallowed") < this.orbsSwallowed) {
        localStorage.setItem("maxOrbsSwallowed", this.orbsSwallowed);
      }
      
      // increase player orb with the area of orb that was swallowed
      let orbArea = Math.PI * orb.radius ** 2
      let thisArea = Math.PI * this.radius ** 2;
      thisArea += orbArea / 10;

      // update radius with the radius of the new area
      this.radius = Math.sqrt(thisArea / Math.PI);

      // if new record size, update largest size in local storage
      if (localStorage.getItem("largestSize") < this.radius) {
        localStorage.setItem("largestSize", this.radius);
      }

      return true;
    }

    return false;
  }
}