import { StateManager } from "../models/stateManager.js";
import { UIHandler } from "../views/uiHandler.js";
import { SetupController } from "./setup.js";  
import { applyHit } from "../models/gameLogic.js";
import { initTheme } from "../views/themeManager.js";

const stateManager = new StateManager();
const uiHandler = new UIHandler(stateManager);

new SetupController(stateManager, uiHandler);

initTheme();
// show short description before starting
uiHandler.showDescription("Enter the players and settings, then press Start Game to begin.");

document.getElementById("hit-btn")?.addEventListener("click", () => {
  const input = document.getElementById("hit") as HTMLInputElement;
  const raw = input.value;
  const hit = Number(raw);

  // basic validation
  if (!raw || Number.isNaN(hit) || hit < 0) {
    uiHandler.showFlash("Invalid hit value. Enter a non-negative number.");
    return;
  }

  // limit to reasonable maximum per turn (three darts = 180)
  if (hit > 180) {
    uiHandler.showFlash("Hit too large. Maximum per turn is 180.");
    return;
  }

  const result = applyHit(stateManager, hit);
  uiHandler.updateScoreboard();
  uiHandler.highlightActivePlayer();

  if (result && (result as any).bust) {
    uiHandler.showFlashWithType("Bust! Score unchanged — turn passes to the other player.", "error");
  }

  if (result && (result as any).legWon) {
    const winnerIdx = (result as any).winnerIndex;
    const state = stateManager.getState();
    const name = state.players[winnerIdx]?.name ?? "Player";
    if ((result as any).gameOver) {
      uiHandler.showFlashWithType(`Game over — ${name} has won the game!`, "success", 5000);
      // disable controls
      const btn = document.getElementById("hit-btn") as HTMLButtonElement | null;
      const inp = document.getElementById("hit") as HTMLInputElement | null;
      if (btn) btn.disabled = true;
      if (inp) inp.disabled = true;
      const ng = document.getElementById("new-game") as HTMLButtonElement | null;
      if (ng) {
        ng.style.display = "inline-block";
        ng.removeAttribute("aria-hidden");
        ng.addEventListener("click", () => window.location.reload());
      }
    } else {
      uiHandler.showFlashWithType(`${name} won the leg!`, "success");
    }
  }

  input.value = "";
});

// Pause button toggles input availability
const pauseBtn = document.getElementById("pause-btn") as HTMLButtonElement | null;
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    const inp = document.getElementById("hit") as HTMLInputElement | null;
    const btn = document.getElementById("hit-btn") as HTMLButtonElement | null;
    const isPaused = pauseBtn.getAttribute("aria-pressed") === "true";
    if (!isPaused) {
      // pause
      if (inp) inp.disabled = true;
      if (btn) btn.disabled = true;
      pauseBtn.setAttribute("aria-pressed", "true");
      pauseBtn.textContent = "Resume";
      uiHandler.showFlashWithType("Paused", "info", 2000);
    } else {
      // resume
      if (inp) inp.disabled = false;
      if (btn) btn.disabled = false;
      pauseBtn.setAttribute("aria-pressed", "false");
      pauseBtn.textContent = "Pause";
      uiHandler.showFlashWithType("Resumed", "info", 1500);
    }
  });
}

// Exit button asks for confirmation and returns to setup (reload page)
const exitBtn = document.getElementById("exit-btn") as HTMLButtonElement | null;
if (exitBtn) {
  exitBtn.addEventListener("click", () => {
    const ok = confirm("Exit the current game and return to setup?\nUnsaved progress will be lost.");
    if (ok) window.location.reload();
  });
}
