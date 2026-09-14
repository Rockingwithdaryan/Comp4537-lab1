import { STRINGS } from "../lang/messages/en/user.js";
//AI assisted, but written by me
export class FormValidator {
  constructor(minCount, maxCount) {
    this.minCount = minCount;
    this.maxCount = maxCount;
  }

  isValidCount(value) {
    const num = Number(value);
    return Number.isInteger(num) && num >= this.minCount && num <= this.maxCount;
  }
}
//Written by me (daryan)
export class UserInterface {
  constructor() {
    this.titleEl = document.querySelector("h1");
    this.subtitleEl = document.querySelector("h2");
    this.descriptionEl = document.querySelector("#Description p");
    this.controlsEl = document.getElementById("controls");
    this.gameBoardEl = document.getElementById("game-board");
  }

  renderStaticText() {
    this.titleEl.textContent = STRINGS.GAME_TITLE;
    this.subtitleEl.textContent = STRINGS.GAME_SUBTITLE;
    this.descriptionEl.textContent = STRINGS.GAME_DESCRIPTION;
  }

  renderControls() {
    const label = document.createElement("label");
    label.textContent = STRINGS.INPUT_LABEL;
    label.setAttribute("for", "buttonCount");

    this.inputEl = document.createElement("input");
    this.inputEl.type = "number";
    this.inputEl.id = "buttonCount";

    this.goButtonEl = document.createElement("button");
    this.goButtonEl.textContent = STRINGS.BTN_GO;
    this.goButtonEl.id = "goButton";

    this.errorEl = document.createElement("p");
    this.errorEl.id = "errorMessage";

    this.messageEl = document.createElement("p");
    this.messageEl.id = "gameMessage";

    this.controlsEl.appendChild(label);
    this.controlsEl.appendChild(this.inputEl);
    this.controlsEl.appendChild(this.goButtonEl);
    this.controlsEl.appendChild(this.errorEl);
    this.controlsEl.appendChild(this.messageEl);
  }
//written by ai
  getInputValue() {
    return this.inputEl.value;
  }

  showError(message) {
    this.errorEl.textContent = message;
  }

  clearError() {
    this.errorEl.textContent = "";
  }

  showMessage(message) {
    this.messageEl.textContent = message;
  }

  onGoClick(handler) {
    this.goButtonEl.addEventListener("click", handler);
  }
//Written by me (daryan)
  randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
//Written by me (daryan) and assisted by ai 
  createButtons(count) {
    this.gameBoardEl.innerHTML = "";
    const buttons = [];
    for (let i = 1; i <= count; i++) {
      const btn = document.createElement("button");
      btn.classList.add("game-button");
      btn.style.backgroundColor = this.randomColor();
      btn.textContent = i;
      btn.dataset.order = i;
      this.gameBoardEl.appendChild(btn);
      buttons.push(btn);
    }
    return buttons;
  }
//written by ai
  positionButtonRandomly(btn) {
    const maxX = Math.max(window.innerWidth - btn.offsetWidth, 0);
    const maxY = Math.max(window.innerHeight - btn.offsetHeight, 0);
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    btn.style.position = "fixed";
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
  }

  hideNumber(btn) {
    btn.textContent = "";
  }

  revealNumber(btn) {
    btn.textContent = btn.dataset.order;
  }
}
//written by me (daryan) and assisted by ai
export class GameEngine {
  constructor(ui) {
    this.ui = ui;
    this.buttons = [];
    this.expectedIndex = 1;
    this.gameOver = false;
    this.timers = [];
  }

  reset() {
    this.timers.forEach(id => clearTimeout(id));
    this.timers = [];
    this.buttons = [];
    this.expectedIndex = 1;
    this.gameOver = false;
  }

  start(count) {
    this.reset();
    this.ui.showMessage("");
    this.buttons = this.ui.createButtons(count);

    const pauseMs = count * 1000;
    const timer = setTimeout(() => this.scramble(count, 0), pauseMs);
    this.timers.push(timer);
  }
//written by ai
  scramble(totalScrambles, doneCount) {
    if (doneCount >= totalScrambles) {
      this.enableClicks();
      return;
    }
    this.buttons.forEach(btn => this.ui.positionButtonRandomly(btn));
    const timer = setTimeout(() => this.scramble(totalScrambles, doneCount + 1), 2000);
    this.timers.push(timer);
  }

  enableClicks() {
    this.buttons.forEach(btn => {
      this.ui.hideNumber(btn);
      btn.addEventListener("click", () => this.handleButtonClick(btn));
    });
  }
//written by me (daryan) and assisted by ai
  handleButtonClick(btn) {
    if (this.gameOver) return;

    const order = Number(btn.dataset.order);
    if (order === this.expectedIndex) {
      this.ui.revealNumber(btn);
      this.expectedIndex++;
      if (this.expectedIndex > this.buttons.length) {
        this.ui.showMessage(STRINGS.MSG_SUCCESS);
        this.gameOver = true;
      }
    } else {
      this.buttons.forEach(b => this.ui.revealNumber(b));
      this.ui.showMessage(STRINGS.MSG_WRONG_ORDER);
      this.gameOver = true;
    }
  }
}
//Written by me (daryan)
export class AppController {
  constructor(ui, gameEngine) {
    this.ui = ui;
    this.gameEngine = gameEngine;
    this.validator = new FormValidator(3, 7);
  }

  init() {
    this.ui.renderStaticText();
    this.ui.renderControls();
    this.ui.onGoClick(() => this.handleGoClick());
  }
//written by ai
  handleGoClick() {
    const value = this.ui.getInputValue();
    if (this.validator.isValidCount(value)) {
      this.ui.clearError();
      this.gameEngine.start(Number(value));
    } else {
      this.ui.showError(STRINGS.ERROR_INVALID_COUNT);
    }
  }
}
//Written by me (daryan)
const ui = new UserInterface();
const gameEngine = new GameEngine(ui);
const controller = new AppController(ui, gameEngine);
controller.init();