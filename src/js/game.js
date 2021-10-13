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

// initialize the array containing all the orbs
let orbs = [];

// add player orb to the game
let playerOrb = new PlayerOrb(mouse);
orbs.push(playerOrb);


function doesOverlap(x, y, radius) {
  /*
  Search if there is an overlap between a given position
  and orbs already present on the canvas
  ---
  - x: float, x position on the canvas
  - y: float, y position on the canvas
  - radius: float, orb radius
  */

  // loop through array to search for an overlap
  for (let orb of orbs) {
    let delta = {
      x: Math.abs(x - orb.pos.x),
      y: Math.abs(y - orb.pos.y),
      // add 10px to leave some space between orbs
      radius: radius + orb.radius + 10
    }

    // if an overlap has been found, generate a new random position
    if (delta.x < delta.radius && delta.y < delta.radius) {
      return true;
    }
  }

  return false;
}


function generateOrbs(amount, minRadius, maxRadius, className) {
  /*
  Add orbs to the game of random size and position
  ---
  - amount: int, number of orbs that must be created
  - minRadius: float, lower bound of the random radius
  - maxRadius: float, upper bound of the random radius
  - className: class, class of the orb created
  */

  for (let i = 0; i < amount; i++) {
    // generate a new random position and make sure there is no overlap
    do {
      var randRad = random(minRadius, maxRadius);
      var randX = random(-canvas.width, canvas.width);
      var randY = random(-canvas.height, canvas.height);
    } while (doesOverlap(randX, randY, randRad));

    // add new orb to the game
    orbs.push(new className(randX, randY, randRad));
  }
}


function draw() {
  // reset canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save() // sauvegarde la position de mon "curseur"

  // make the camera follow the player
  //ctx.translate(canvas.width / 2 - playerOrb.pos.x, canvas.height / 2 - playerOrb.pos.y);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(30 / playerOrb.radius, 30 / playerOrb.radius);
  ctx.translate(-playerOrb.pos.x, -playerOrb.pos.y);

  for (let orb of orbs) {
    // update player orb's position
    if (orb.type === "player") {
      playerOrb.chase();

      // loop inside a loop -> not optimal: use hash table instead
      // check if player orb swallows another orb
      for (let orb of orbs) {
        if (orb.type === "player") {
          continue;
        }

        if (playerOrb.swallow(orb)) {
          // if the orb is inactive
          if (orb.type === "inactive") {
            do {
              var randRad = random(10, 20);
              var randX = random(-canvas.width, canvas.width);
              var randY = random(-canvas.height, canvas.height);
            } while (doesOverlap(randX, randY, randRad));
    
            // remove swallowed orb and reset it
            orb.radius = randRad;
            orb.pos = {
              x: randX,
              y: randY
            }
            orb.isTarget = false;
          } else {
            do {
              var randRad = random(playerOrb.radius, playerOrb.radius + 10);
              var randX = random(-canvas.width, canvas.width);
              var randY = random(-canvas.height, canvas.height);
            } while (doesOverlap(randX, randY, randRad));
    
            // remove swallowed orb and reset it
            orb.radius = randRad;
            orb.pos = {
              x: randX,
              y: randY
            }

            // reset targets
            orb.target.isTarget = false;
            orb.target = null;
          }
        }
      }

    }

    // update active orbs positions
    if (orb.type === "active") {
      orb.chase();

      // check if orb swallows target
      if (orb.swallow(orb.target)) {
        // generate a new random position and make sure there is no overlap
        do {
          var randRad = random(10, 20);
          var randX = random(orb.target.radius, canvas.width - orb.target.radius);
          var randY = random(orb.target.radius, canvas.height - orb.target.radius);
        } while (doesOverlap(randX, randY, randRad));

        // remove swallowed orb and reset it
        orb.target.radius = randRad;
        orb.target.pos = {
          x: randX,
          y: randY
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

  ctx.restore(); // sauvegarde la position de mon "curseur"
}


// animate game
let animate = function() {
  draw();
  requestAnimationFrame(animate);
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