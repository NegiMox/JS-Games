let level = 1;
let bestLevel = 1;
let answer;
const btns = document.querySelectorAll("button[data-light]");
const sound = document.querySelector(".click");
console.log(sound);

function activate() {
  btns.forEach((button) => {
    button.classList.remove("unclickable");
  });
}

function deactivate() {
  btns.forEach((button) => {
    button.classList.add("unclickable");
  });
}

function activateTile() {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

function updateGameStatus(status) {
  document.getElementById("status").innerHTML = status;
}

function updateLevelText() {
  bestLevel = Math.max(level, bestLevel);
  document.getElementById(
    "level"
  ).innerHTML = `Current Level: ${level}&nbsp;&nbsp;&nbsp;Highest Level Reached: ${bestLevel}`;
}

async function runQuestion(answerArr) {
  for (const color of answerArr) {
    activateTile();
    const button = document.querySelector(`button[data-key="${color}"`);
    button.classList.add(button.getAttribute("data-light"));
    await sleep(1000);
  }
  updateGameStatus("Click the colors in order!");
  document.body.style.background = "#83bf5d";
  activate();
  //document.getElementById("start").disabled = false;
}

function startGame() {
  updateLevelText();
  updateGameStatus("");
  document.getElementById("start").disabled = true;
  document.body.style.background = "#008080";
  answer = [];
  for (let i = 0; i < level; i++) {
    const color = Math.floor(Math.random() * 4);
    answer.push(color);
  }
  runQuestion(answer);
}

async function checkAnswer() {
  if (answer === undefined || answer.length === 0) {
    updateGameStatus("Please click start to play the game!");
    return;
  }

  const ans = answer.splice(0, 1);
  activateTile();
  if (this.getAttribute("data-key") === String(ans)) {
    if (answer.length === 0) {
      level += 1;
      updateGameStatus(`Good Job! You are now in level ${level}!`);
      deactivate();
      updateLevelText();
      document.body.style.background = "#008080";
      await sleep(2000);
      startGame();
    }
  } else {
    level = 1; // reset level
    answer = [];
    updateGameStatus("Game Over!! Click Start to restart the game!");
    deactivate();
    document.getElementById("start").disabled = false;
    updateLevelText();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

window.onload = function () {
  document.getElementById("start").onclick = startGame;

  // Add transitionend to all buttons that need to change color back to original color
  btns.forEach((button) => {
    button.addEventListener("transitionend", (e) => {
      e.target.classList.remove(button.getAttribute("data-light"));
    });
    button.classList.add("unclickable");
    button.addEventListener("click", checkAnswer);
  });
};
