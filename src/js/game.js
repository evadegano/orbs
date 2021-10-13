const canvas = document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const backgroundImg = document.querySelector("#particles-js");
backgroundImg.width = canvas.width;

const scoreBoard = document.querySelectorAll("#score-board p");

const swallowSound = document.querySelector("#swallow-sound");
swallowSound.volume = 0.25;

// initialize mouse coordinates
var mouse = {
  pos: {
    x: 0,
    y: 0
  }
  
}

// array containing 
let orbs = [];
let playerOrb = new PlayerOrb(mouse);
orbs.push(playerOrb);


function generateOrbs(amount, minRadius, maxRadius, className) {
  /*
  Add orbs to the game of random size and position
  ---
  - amount: int, number of orbs that must be created
  - minRadius: float, lower bound of the random radius
  - maxRadius: float, upper bound of the random radius
  - className: class, class of the orb created
  */

  let counter = 0;

  // complexity 1
  while (counter < amount) {
    // generate a random radius and position
    let randRadius = random(minRadius, maxRadius);
    let randPos = {
      x: random(randRadius, canvas.width - randRadius),
      y: random(randRadius, canvas.height - randRadius)
    }

    // set overlapping to false by default
    let overlapping = false;
    
    // loop through array to search for overlap
    for (let j = 0; j < orbs.length; j++) {
      let delta = {
        x: Math.abs(randPos.x - orbs[j].pos.x),
        y: Math.abs(randPos.y - orbs[j].pos.y),
        // add 10 to leave some space between orbs
        radius: randRadius + orbs[j].radius + 10
      }

      // if an overlap has been found, generate a new random position
      if (delta.x < delta.radius && delta.y < delta.radius) {
        overlapping = true;
        break;
      }
    }

    // if no overlap, generate a new orb at the random position
    if (!overlapping) {
      orbs.push(new className(randPos.x, randPos.y, randRadius));
      counter++;
    }
  }
}

function draw() {
  // reset canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let orb of orbs) {
    // update player orb's position
    if (orb.type === "player") {
      playerOrb.chase();
    }

    // update active orbs positions
    if (orb.type === "active") {
      orb.chase();

      // check if orb swallows target
      if (orb.swallow(orb.target)) {
        // remove swallowed orb and reset it
        orb.target.radius = random(10, 20);
        orb.target.pos = {
          x: random(orb.target.radius, canvas.width - orb.target.radius),
          y: random(orb.target.radius, canvas.height - orb.target.radius)
        }
        orb.target.isTarget = false;

        // reset orb's target
        orb.target = null;

        // search for a new target
        orb.hunt(orbs);
      }
    }

    // draw orb on canvas
    orb.draw();
  }
}

//
function gameOver() {
  return undefined;
}

// update mouse coordinates on every move
window.addEventListener("mousemove", (event) => {
  mouse.pos.x = event.pageX,
  mouse.pos.y = event.pageY
})

// resize canvas and background image with viewport
window.addEventListener('resize', (reportWindowSize) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  backgroundImg.width = canvas.width;
});

// animate game
let animate = function() {
  draw();
  requestAnimationFrame(animate);
}