let computerSequence = [];
let playerSequence = [];
let timeoutIDs = [];
let round = 0;
const   ONE_SECOND_DELAY = 1000;

const $button = document.querySelector("button[type=button]");
$button.onclick = startGame;

function startGame() {
  startComputerTurn();
  updateGameState("Computer Turn");

  $button.textContent = "Reset Game";
  $button.classList.replace("btn-warning", "btn-danger");
  $button.onclick = reset;
}

function startComputerTurn() {
  blockPlayerInput();

  addRandomCircle();

  round++;
  updateRoundCounter();

  computerSequence.forEach((circle, sequenceNumber) => {
    const DELAY = (sequenceNumber + 1) * ONE_SECOND_DELAY;
    const timeoutId = setTimeout(() => {
      playSound(circle);
      highlight(circle);
    }, DELAY);
    timeoutIDs.push(timeoutId);
  });

  const PLAYER_DELAY = (computerSequence.length + 1) * ONE_SECOND_DELAY;

  const timeoutId = setTimeout(() => {
    unblockPlayerInput();
    updateGameState("Player turn");
  }, PLAYER_DELAY);
  timeoutIDs.push(timeoutId);

  playerSequence = [];
}

function handlePlayerInput(e) {
  const playerInput = Number(e.target.id.split("-")[1]);
  playSound(playerInput);
  highlight(playerInput);
  playerSequence.push(playerInput);

  const computerInput = computerSequence[playerSequence.length - 1];

  if (playerInput !== computerInput) {
    triggerLooseState();
    return;
  }

  if (playerSequence.length === computerSequence.length) {
    blockPlayerInput();
    const timeoutId = setTimeout(() => {
      updateGameState("Computer turn");
      startComputerTurn();
    }, 1000);
    timeoutIDs.push(timeoutId);
  }
}

function highlight(circle) {
  const $circle = document.querySelector(`#circle-${circle}`);
  $circle.style.opacity = 1;
  setTimeout(() => {
    $circle.style.opacity = 0.5;
  }, 500);
}

function playSound(index) {
  const audio = new Audio(`./assets/sounds/${index}.wav`);
  audio.play();
}

function blockPlayerInput() {
  document.querySelectorAll(".circle").forEach(($circle) => {
    $circle.onclick = () => {};
  });
}

function unblockPlayerInput() {
  document.querySelectorAll(".circle").forEach(($circle) => {
    $circle.onclick = handlePlayerInput;
  });
}

function addRandomCircle() {
  computerSequence.push(Math.floor(Math.random() * 4) + 1);
}

function triggerLooseState() {
  blockPlayerInput();
  updateGameState(`Game ended, you lost in round #${round}`, true);
}

function updateRoundCounter() {
  document.querySelector("#round-counter").textContent = `Round #${round}`;
}

function updateGameState(state, playerLost = false) {
  const $gameState = document.querySelector("#game-state");
  $gameState.textContent = state;
  if (playerLost) {
    $gameState.classList.replace("alert-primary", "alert-danger");
  } else {
    $gameState.classList.replace("alert-danger", "alert-primary");
  }
}

function reset() {
  round = 0;
  computerSequence = [];
  clearAllTimeouts();
  
  $button.textContent = "Start Again!";
  $button.classList.replace("btn-danger", "btn-warning");
  $button.onclick = startGame;
}

function clearAllTimeouts(){
  for (id of timeoutIDs) {
    clearTimeout(id);
  }
  timeoutIDs = [];
}