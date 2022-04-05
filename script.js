const score = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const gameArea = document.querySelector(".gameArea");
document.body.style.overflow = "hidden";

let player = { speed: 5, score: 0 };
let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

startScreen.addEventListener("click", Start);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function Start() {
  //gameArea.classList.remove("hide");
  startScreen.classList.add("hide");
  gameArea.innerHTML = "";

  player.start = true;
  player.score = 0;

  window.requestAnimationFrame(gamePlay);

  //Adding line
  for (x = 0; x < 5; x++) {
    let roadline = document.createElement("div");
    roadline.setAttribute("class", "lines");
    roadline.y = x * 190;
    roadline.style.top = roadline.y + "px";
    gameArea.appendChild(roadline);
  }

  //Adding car
  let car = document.createElement("div");
  car.setAttribute("class", "car");
  gameArea.appendChild(car);

  //Used to get the car position.
  player.x = car.offsetLeft;
  player.y = car.offsetTop;
  //console.log("from top " + car.offsetTop);
  //console.log("from left " + car.offsetLeft);

  //Adding enemy cars.
  for (x = 0; x < 3; x++) {
    let enemyCar = document.createElement("div");
    enemyCar.setAttribute("class", "enemycar");
    enemyCar.y = (x + 1) * 350 * -1;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.left = Math.floor(Math.random() * 382) + "px";
    //let imagePrefix = Math.random() * (7 - 1) + 1;
    enemyCar.style.backgroundImage = "url(car" + changeColor() + ".png)";
    //console.log(imagePrefix);
    gameArea.appendChild(enemyCar);
  }
}

function changeColor() {
  return Math.floor((imagePrefix = Math.random() * (7 - 1) + 1));
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.top > bRect.bottom - 8 ||
    aRect.bottom < bRect.top + 8 ||
    aRect.left > bRect.right - 8 ||
    aRect.right < bRect.left + 8
  );
}

function moveLines() {
  let lines = document.querySelectorAll(".lines");
  lines.forEach(function (element) {
    if (element.y >= window.screen.height - 200) {
      element.y -= window.screen.height - 130;
    }
    element.y += player.speed;
    element.style.top = element.y + "px";
  });
}

function endGame() {
  player.start = false;
  startScreen.innerHTML =
    "GAME OVER <br> Your final score is " +
    (player.score + 1) +
    "<br> Press here to retry.";
  startScreen.classList.remove("hide");
}

function moveEnemy(car) {
  let enemyCar = document.querySelectorAll(".enemycar");
  enemyCar.forEach(function (element) {
    if (isCollide(car, element)) {
      console.log("HIT!");
      endGame();
    }

    if (element.y >= window.screen.height - 200) {
      element.y = -180;
      element.style.backgroundImage = "url(car" + changeColor() + ".png)";
      element.style.left = Math.floor(Math.random() * 450) + "px";
    }
    element.y += player.speed;
    element.style.top = element.y + "px";
  });
}

function gamePlay() {
  //console.log("game started.");
  let boundary = gameArea.getBoundingClientRect();
  let car = document.querySelector(".car");

  if (player.start) {
    moveLines();
    moveEnemy(car);

    if (keys.ArrowUp && player.y > boundary.top + 70 * 6) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < boundary.height - 170) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < boundary.width - 100) {
      player.x += player.speed;
    }

    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    player.score++;
    score.innerHTML = "Score: " + player.score;
    window.requestAnimationFrame(gamePlay);
  }
}

function keyDown(e) {
  e.preventDefault();

  keys[e.key] = keys[e.key] == null ? null : true;

  //console.log(e.key);
  //console.log(keys);
}

function keyUp(e) {
  e.preventDefault();

  keys[e.key] = keys[e.key] == null ? null : false;

  //console.log(e.key);
  //console.log(keys);
}
