// /src/controller/setup.ts

import { StateManager } from "../model/stateManager.js";
import { UIHandler } from "../view/uiHandler.js";

export class SetupController {
  private stateManager: StateManager;
  private uiHandler: UIHandler;

  constructor() {
    this.stateManager = new StateManager();
    this.uiHandler = new UIHandler(this.stateManager);
    this.addListeners();
  }

  addListeners() {
    const startButton = document.getElementById("start-game")!;
    startButton.addEventListener("click", () => this.handleSetup());
  }

  handleSetup() {
    const player1Input = document.getElementById("player1") as HTMLInputElement;
    const player2Input = document.getElementById("player2") as HTMLInputElement;
    const gameTypeSelect = document.getElementById("gametype") as HTMLSelectElement;
    const legsSelect = document.getElementById("legs") as HTMLSelectElement;

    const player1 = player1Input.value.trim();
    const player2 = player2Input.value.trim();
    const gameType = Number(gameTypeSelect.value);
    const legs = Number(legsSelect.value);

    if (!player1 || !player2) {
      alert("Please enter both player names.");
      return;
    }

    this.stateManager.initializePlayers(player1, player2, gameType, legs);

    this.uiHandler.updateScoreboard();
    this.uiHandler.highlightActivePlayer();

    this.showGameScreen();
  }

  showGameScreen() {
    const setupScreen = document.getElementById("setup-screen")!;
    const gameScreen = document.getElementById("game-screen")!;
    setupScreen.style.display = "none";
    gameScreen.style.display = "block";
  }
}

export const setupController = new SetupController();
