import { setupController } from "./setup.js";
import { toggleTheme, loadTheme } from "../view/themeManager.js";
import {
  calculateNewScore,
  checkLegWinner,
  switchPlayer,
} from "../model/gameLogic.js";

const stateManager = setupController.getStateManager();
const uiHandler = setupController.getUIHandler();

window.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  const addScoreButton = document.getElementById("add-score");
  const scoreInput = document.getElementById("score-input") as HTMLInputElement | null;
  const themeButton = document.getElementById("theme-toggle");

  addScoreButton?.addEventListener("click", () => {
    const value = Number(scoreInput?.value);

    if (Number.isNaN(value) || value < 0) {
      alert("Please enter a valid score.");
      return;
    }

    const newScore = calculateNewScore(stateManager, value);
    stateManager.updateCurrentPlayerScore(newScore);

    const winner = checkLegWinner(stateManager);

    if (winner) {
      uiHandler.showWinner(winner);
      alert(`${winner.name} wins the leg!`);
    } else {
      switchPlayer(stateManager);
    }

    uiHandler.updateScoreboard();
    uiHandler.highlightActivePlayer();

    if (scoreInput) scoreInput.value = "";
  });

  themeButton?.addEventListener("click", () => {
    toggleTheme();
  });
});
