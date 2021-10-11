//const canvas = document.getElementById("game-canvas");
//const ctx = canvas.getContext("2d");

let backgroundImg = document.querySelector("#particles-js");
backgroundImg.height = canvas.height;

const viewportMidWidth = window.innerWidth / 2;
const viewportMidHeight = window.innerHeight / 2;

const scoreBoard = document.querySelectorAll("#score-board p");

const swallowSound = document.querySelector("#swallow-sound");
swallowSound.volume = 0.25;

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
  while (counter <= amount) {
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
        radius: randRadius + array[j].pos.radius + 10
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
  Draw orbs on the canvas and update their positions
  */

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  myOrbHunts();
  orbsHunt();
  
  // draw idle orbs on canvas
  // complexity: n
  for (let orb of idleOrbs) {
    orb.draw();
  }

  // draw hunter orbs on canvas
  // complexity: n
  for (let orb of hunterOrbs) {
    orb.draw();
  }

  // make myOrb follow the mouse and make the camera follow myOrb
  myOrb.seek(mouse);
  window.scrollTo(-(viewportMidHeight - myOrb.pos.x), -(viewportMidHeight - myOrb.pos.y))
  myOrb.draw();
}

function myOrbHunts() {
  /*
  Draw orbs on the canvas and update their positions
  */

  for (let i = idleOrbs.length - 1; i >= 0; i--) {
    if (myOrb.swallow(idleOrbs[i])) {

      swallowSound.play();
      idleOrbs.splice(i, 1);
      generateOrbs(1, 10, 20, Orb, idleOrbs);

      // update the scoreboard
      scoreBoard[0].querySelector("span").textContent = Math.floor(myOrb.radius);
      scoreBoard[1].querySelector("span").textContent = myOrb.orbsSwallowed;
      scoreBoard[2].querySelector("span").textContent = Math.floor(myOrb.largestSize);
      scoreBoard[3].querySelector("span").textContent = myOrb.maxOrbsSwallowed;
    }
  }
}

function orbsHunt() {
  for (let orb of hunterOrbs) {
    if (orb.hunt(idleOrbs)) {
      generateOrbs(1, 10, 20, Orb, idleOrbs);
    };
  }
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