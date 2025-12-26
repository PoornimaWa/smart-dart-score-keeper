import { StateManager } from "../models/stateManager.js";
import { UIHandler } from "../views/uiHandler.js";

export class SetupController {
  constructor(
    private stateManager: StateManager,
    private uiHandler: UIHandler
  ) {
    this.bindEvents();
  }

  private bindEvents(): void {
    document
      .getElementById("start-game")
      ?.addEventListener("click", () => this.startGame());
  }

  private startGame(): void {
    const p1 = (document.getElementById("player1") as HTMLInputElement).value;
    const p2 = (document.getElementById("player2") as HTMLInputElement).value;
    const score = Number(
      (document.getElementById("gametype") as HTMLSelectElement).value
    );
    const legs = Number(
      (document.getElementById("legs") as HTMLSelectElement).value
    );

    if (!p1 || !p2) {
      alert("Enter both player names");
      return;
    }

    this.stateManager.initializePlayers(p1, p2, score, legs);
    this.uiHandler.updateScoreboard();

    document.getElementById("setup-screen")!.style.display = "none";
    document.getElementById("game-screen")!.style.display = "block";
  }
}
