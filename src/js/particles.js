class Particle {
  constructor(x, y, radius) {
    this.pos = {
      x: x, 
      y: y
    }
    this.radius = radius;
    this.color = "#9EEAF9";
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  // make particles fade out
  update() {
    this.radius -= 0.05;

    if (this.radius < 0) {
      this.pos.x = (myOrb.pos.x + random(myOrb.radius, myOrb.radius + 10));
      this.pos.y = (myOrb.pos.y + random(myOrb.radius, myOrb.radius + 10));
      this.radius = random(7, 17);
    }
  }
}