const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const backgroundImg = document.querySelector("#particles-js");
backgroundImg.height = canvas.height;

const viewportMidWidth = window.innerWidth / 2;
const viewportMidHeight = window.innerHeight / 2;

const scoreBoard = document.querySelectorAll("#score-board p");

const swallowSound = document.querySelector("#swallow-sound");
swallowSound.volume = 0.25;

// array containing 
let idleOrbs = [];
let hunterOrbs = [];
let myOrb = new MyOrb();


function generateOrbs(amount, minRadius, maxRadius, className, array) {
  /*
  Add orbs to the game of random size and position
  ---
  - amount: int, number of orbs that must be created
  - minRadius: float, lower bound of the random radius
  - maxRadius: float, upper bound of the random radius
  - className: class, class of the orb created
  - array: object, array to which orbs must be added
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
    for (let j = 0; j < array.length; j++) {
      let delta = {
        x: Math.abs(randPos.x - array[j].pos.x),
        y: Math.abs(randPos.y - array[j].pos.y),
        // add 10 to leave some space between orbs
        radius: randRadius + array[j].radius + 10
      }

      // if an overlap has been found, generate a new random position
      if (delta.x < delta.radius && delta.y < delta.radius) {
        overlapping = true;
        break;
      }
    }

    // if no overlap, generate a new orb at the random position
    if (!overlapping) {
      array.push(new className(randPos.x, randPos.y, randRadius));
      counter++;
    }
  }
}

function draw() {
  /*
  Draw orbs on the canvas and update their position
  */

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // complexity: n
  for (let i = idleOrbs.length - 1; i >= 0; i--) {
    // if myOrb swallows an idle orb, remove it from canvas and add a new one
    if (myOrb.swallow(idleOrbs[i])) {
      swallowSound.play();
      idleOrbs.splice(i, 1);
      generateOrbs(1, 10, 20, Orb, idleOrbs);

      // update scoreboard width new stats
      scoreBoard[0].querySelector("span").textContent = Math.floor(myOrb.radius);
      scoreBoard[1].querySelector("span").textContent = myOrb.orbsSwallowed;
      scoreBoard[2].querySelector("span").textContent = Math.floor(localStorage.getItem("largestSize"));
      scoreBoard[3].querySelector("span").textContent = localStorage.getItem("maxOrbsSwallowed");
    } else {
      idleOrbs[i].draw();
    }
  }

  // draw hunter orbs on canvas and make them hunt
  // complexity: n
  for (let orb of hunterOrbs) {
    orb.draw();

    if (orb.hunt(idleOrbs)) {
      generateOrbs(1, 10, 20, Orb, idleOrbs);
    };


  }

  // make myOrb follow the mouse and make the camera follow myOrb
  myOrb.seek(mouse);
  window.scrollTo(-(viewportMidHeight - myOrb.pos.x), -(viewportMidHeight - myOrb.pos.y))
}


// get mouse coordinates
var mouse = {
  x: 0,
  y: 0
}

window.addEventListener("mousemove", (event) => {
  mouse.x = event.pageX,
  mouse.y = event.pageY
})

let animate = function() {
  draw();
  requestAnimationFrame(animate);
}