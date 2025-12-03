// /src/view/uiHandler.ts

import { StateManager, GameState } from "../model/stateManager.js";

export class UIHandler {
  private stateManager: StateManager;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
  }

  updateScoreboard() {
    const state: GameState = this.stateManager.getState();
    const p1 = state.players[0];
    const p2 = state.players[1];

    (document.getElementById("p1-name") as HTMLElement).textContent = p1.name;
    (document.getElementById("p2-name") as HTMLElement).textContent = p2.name;

    (document.getElementById("p1-score") as HTMLElement).textContent = p1.score.toString();
    (document.getElementById("p2-score") as HTMLElement).textContent = p2.score.toString();

    (document.getElementById("p1-legs") as HTMLElement).textContent = p1.legsWon.toString();
    (document.getElementById("p2-legs") as HTMLElement).textContent = p2.legsWon.toString();
  }

  highlightActivePlayer() {
    const state = this.stateManager.getState();
    const p1Box = document.getElementById("player1-box")!;
    const p2Box = document.getElementById("player2-box")!;

    if (state.currentPlayer === 0) {
      p1Box.classList.add("active-player");
      p2Box.classList.remove("active-player");
    } else {
      p1Box.classList.remove("active-player");
      p2Box.classList.add("active-player");
    }
  }

  showLegWinner(winnerName: string) {
    alert(`${winnerName} wins this leg!`);
  }

  showSetWinner(winnerName: string) {
    alert(`🏆 ${winnerName} wins the set!`);
  }
}
