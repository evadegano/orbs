const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let animationId;

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


// Search if there is an overlap between a given position and orbs on the canvas
function doesOverlap(x, y, radius) {
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


// Add orbs to the game of random size and position
function generateOrbs(amount, minRadius, maxRadius, className) {
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


// change orbs positions and draw them on the canvas
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

          // update scoreboard with new stats
          updateScoreBoard();
        }
      }

    }

    // update active orbs positions
    if (orb.type === "active") {
      orb.chase();

      if (orb.target.type === "player") {
        let dist = {
          x: Math.abs(orb.target.pos.x - orb.pos.x),
          y: Math.abs(orb.target.pos.y - orb.pos.y)
        }
        // if player orb is out of the vision area, reset active orb's target
        if (dist.x > orb.visionArea || dist.y > orb.visionArea) {
          orb.target.isTarget = false,
          orb.target = null,
          orb.hunt(orbs.filter(orb => orb.type != "player"));
        }
      }

      // check if orb swallows target
      if (orb.swallow(orb.target)) {
        // if the orb swallowed player orb, the game is over
        if (orb.target.type === "player") {
          gameOver();
        } else {
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
    }

    // draw orb on canvas
    orb.draw();
  }

  ctx.restore(); // sauvegarde la position de mon "curseur"
}


// animate game
function animate() {
  draw();
  animationId = requestAnimationFrame(animate);
}


// stop game
function gameOver() {
  // get for how long the game ran
  let stopClock = Date.now() - startClock;

  // if new time record was reached, update local storage
  if (stopClock > localStorage.getItem('longestTime')) {
    localStorage.setItem('longestTime', stopClock);
  }

  // stop animations
  cancelAnimationFrame(animationId);
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