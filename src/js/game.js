const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// initialize mouse coordinates
var mouse = {
  pos: {
    x: 0,
    y: 0
  }
}
let animationId; // var used to stock animation frames
let isGameOver; // bool used to stop the game
let orbs; // array containing all the orbs
let playerOrb; // player


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
      var randX = random(randRad, canvas.width - randRad);
      var randY = random(randRad, canvas.height - randRad);
    } while (doesOverlap(randX, randY, randRad));

    // add new orb to the game
    orbs.push(new className(randX, randY, randRad));
  }
}


// change orbs positions and draw them on the canvas
function draw() {
  // reset canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // save cursor position
  ctx.save()

  // make the camera follow the player
  if (playerOrb.pos.x < canvas.width / 2 && playerOrb.pos.y < canvas.height / 2) {
    ctx.translate(0, 0);
  } else if (playerOrb.pos.x < canvas.width / 2) {
    ctx.translate(0, canvas.height / 2 - playerOrb.pos.y);
  } else if (playerOrb.pos.y < canvas.height / 2) {
    ctx.translate(canvas.width / 2 - playerOrb.pos.x, 0);
  } else {
    ctx.translate(canvas.width / 2 - playerOrb.pos.x, canvas.height / 2 - playerOrb.pos.y);
  }

  for (let orb of orbs) {
    // update player orb's position
    if (orb.type === "player") {
      playerOrb.chase(); 

      // check if player orb swallows another orb
      for (let orb of orbs) {
        if (orb.type === "player") {
          continue;
        }

        if (playerOrb.swallow(orb)) {
          // play sound effect
          swallowSound.play();

          if (orb.type === "inactive") {
            // generate a new inactive orb
            do {
              var randRad = random(playerOrb.radius - 20, playerOrb.radius - 10);
              var randX = random(randRad, canvas.width - randRad);
              var randY = random(randRad, canvas.height - randRad);
            } while (doesOverlap(randX, randY, randRad));
    
            // remove swallowed orb and reset it
            orb.radius = randRad;
            orb.pos = {
              x: randX,
              y: randY
            }
            orb.isTarget = false;
          } else {
            // generate a new active orb
            do {
              var randRad = random(playerOrb.radius - 5, playerOrb.radius + 5);
              var randX = random(randRad, canvas.width - randRad);
              var randY = random(randRad, canvas.height - randRad);
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
            orb.hunt(orbs);
          }

          // update scoreboard with new stats
          updateStats(scoreBoardStats);
        }
      }

    }

    // update active orbs positions
    if (orb.type === "active") {
      // update orb's glow color depending on its size
      if (orb.radius > playerOrb.radius) {
        orb.glow = "#B22222";
      } else {
        orb.glow = "#6D22C7";
      }

      // make orb chase its target
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
          stopGame();
        } else {
          // generate a new random position and make sure there is no overlap
          do {
            var randRad = random(playerOrb.radius - 20, playerOrb.radius - 10);
            var randX = random(randRad, canvas.width - randRad);
            var randY = random(randRad, canvas.height - randRad);
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

  // save cursor position
  ctx.restore();
}


// animate game
function animate() {
  draw();
  
  if (!isGameOver) {
    animationId = requestAnimationFrame(animate);
  }
}


// stop game
function stopGame() {
  // stop animations
  cancelAnimationFrame(animationId);
  isGameOver = true;

  gameOver();
}


// update mouse coordinates on every move
window.addEventListener("mousemove", event => {
  mouse.pos.x = event.pageX,
  mouse.pos.y = event.pageY
})


// resize canvas and background image with viewport
window.addEventListener("resize", event => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // resize background image depending on screen size ratio
  let imgSizeRatio = backgroundImg.naturalWidth / backgroundImg.naturalHeight;
  let viewportSizeRatio = window.innerWidth / window.innerHeight;

  if (viewportSizeRatio >= imgSizeRatio) {
    backgroundImg.width = window.innerWidth;
  } else {
    backgroundImg.height = window.innerHeight;
  }
});