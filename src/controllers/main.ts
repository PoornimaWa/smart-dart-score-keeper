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

// Helper to recalculate a player's score from all their turns
function recalculatePlayerScore(stateManager: any, playerIdx: number) {
  const state = stateManager.getState();
  const player = state.players[playerIdx];
  if (!player) return;
  player.score = state.startingScore;
  for (const turn of player.turns) {
    const turnTotal = turn.hits.reduce((a: number, b: number) => a + b, 0);

    player.score -= turnTotal;
  }
}


// Three separate hit input logic
const hitBtn = document.getElementById("hit-btn") as HTMLButtonElement | null;
const hitInput1 = document.getElementById("hit1") as HTMLInputElement | null;
const hitInput2 = document.getElementById("hit2") as HTMLInputElement | null;
const hitInput3 = document.getElementById("hit3") as HTMLInputElement | null;
const editHitBtn = document.getElementById("edit-hit-btn") as HTMLButtonElement | null;
const removeHitBtn = document.getElementById("remove-hit-btn") as HTMLButtonElement | null;
// Add event listener for Edit button (always edit last turn of previous player)
if (editHitBtn) {
  editHitBtn.addEventListener("click", () => {
    const state = stateManager.getState();
    // Previous player is the one who just played
    const prevPlayerIdx = state.currentPlayer === 0 ? 1 : 0;
    const prevPlayer = state.players[prevPlayerIdx];
    if (!prevPlayer || prevPlayer.turns.length === 0) {
      uiHandler.showFlash("No turn to edit.");
      return;
    }
    const lastTurnIdx = prevPlayer.turns.length - 1;
    const lastTurn = prevPlayer.turns[lastTurnIdx];
    if (lastTurn) {
      if (hitInput1) hitInput1.value = lastTurn.hits[0] !== undefined ? String(lastTurn.hits[0]) : "";
      if (hitInput2) hitInput2.value = lastTurn.hits[1] !== undefined ? String(lastTurn.hits[1]) : "";
      if (hitInput3) hitInput3.value = lastTurn.hits[2] !== undefined ? String(lastTurn.hits[2]) : "";
      editMode = true;
      editPlayerIdx = prevPlayerIdx;
      editTurnIdx = lastTurnIdx;
      if (editHitBtn) editHitBtn.disabled = false;
      if (removeHitBtn) removeHitBtn.disabled = true;
    } else {
      if (hitInput1) hitInput1.value = "";
      if (hitInput2) hitInput2.value = "";
      if (hitInput3) hitInput3.value = "";
      editMode = false;
      editPlayerIdx = null;
      editTurnIdx = null;
    }
  });
}

let editMode = false;
let editPlayerIdx: number | null = null;
let editTurnIdx: number | null = null;

if (hitBtn && hitInput1 && hitInput2 && hitInput3) {
  // Disable edit/remove while adding
  if (editHitBtn) editHitBtn.disabled = true;
  if (removeHitBtn) removeHitBtn.disabled = true;

  // Submit Turn button
  hitBtn.addEventListener("click", () => {
    // ...existing code...
    const hits = [hitInput1, hitInput2, hitInput3].map(inp => Number(inp.value));
    for (let i = 0; i < hits.length; i++) {
      const val = [hitInput1, hitInput2, hitInput3][i]?.value;
      if (val === undefined || val === "" || isNaN(Number(val)) || Number(val) < 0) {
        uiHandler.showFlash(`Invalid value for Hit ${i + 1}. Enter a non-negative number.`);
        return;
      }
    }
    const turnTotal = hits.reduce((a, b) => a + b, 0);
    if (turnTotal > 180) {
      uiHandler.showFlash("Total for three darts cannot exceed 180.");
      return;
    }

    if (editMode && editPlayerIdx !== null && editTurnIdx !== null) {
      // Edit mode: update the selected turn
      const state = stateManager.getState();
      const player = state.players[editPlayerIdx];
      if (player && Array.isArray(player.turns) && player.turns[editTurnIdx]) {
        const turnToEdit = player.turns[editTurnIdx];
        if (turnToEdit) {
          turnToEdit.hits = hits;
          recalculatePlayerScore(stateManager, editPlayerIdx);
          uiHandler.updateScoreboard();
          uiHandler.showFlash("Turn updated.");
        }
      }
      // Reset edit mode and clear inputs
      if (hitInput1) hitInput1.value = "";
      if (hitInput2) hitInput2.value = "";
      if (hitInput3) hitInput3.value = "";
      editMode = false;
      editPlayerIdx = null;
      editTurnIdx = null;
      if (editHitBtn) editHitBtn.disabled = false;
      if (removeHitBtn) removeHitBtn.disabled = false;
    } else {
      // Only handle new turn submissions here
      const result = applyHit(stateManager, hits);
      uiHandler.updateScoreboard();
      // ...existing code...

      if (result && (result as any).bust) {
        uiHandler.showFlashWithType("Bust! Score unchanged — turn passes to the other player.", "error");
      }

      if (result && (result as any).legWon) {
        const winnerIdx = (result as any).winnerIndex;
        const state = stateManager.getState();
        const name = state.players[winnerIdx]?.name ?? "Player";
        if ((result as any).gameOver) {
          uiHandler.showFlashWithType(`Game over — ${name} has won the game!`, "success", 5000);
          hitInput1.disabled = true;
          hitInput2.disabled = true;
          hitInput3.disabled = true;
          if (hitBtn) hitBtn.disabled = true;
          if (editHitBtn) editHitBtn.disabled = true;
          if (removeHitBtn) removeHitBtn.disabled = true;
          let ng = document.getElementById("new-game") as HTMLButtonElement | null;
          if (!ng) {
            // Fallback: create button if not present
            ng = document.createElement("button");
            ng.id = "new-game";
            ng.textContent = "New Game";
            ng.setAttribute("aria-label", "Start a new game");
            ng.className = "new-game-btn";
            document.body.appendChild(ng);
          }
          ng.style.display = "inline-block";
          ng.removeAttribute("aria-hidden");
          ng.addEventListener("click", () => window.location.reload());
        } else {
          uiHandler.showFlashWithType(`${name} won the leg!`, "success");
        }
      }
      // Reset inputs for next turn
      if (hitInput1) hitInput1.value = "";
      if (hitInput2) hitInput2.value = "";
      if (hitInput3) hitInput3.value = "";
      // Enable edit/remove for last turn
      if (editHitBtn) editHitBtn.disabled = false;
      if (removeHitBtn) removeHitBtn.disabled = false;
    }

  });
}


  // Event delegation for .edit-turn-btn (edit any turn in history)
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains("edit-turn-btn")) {
      const playerIdx = Number(target.getAttribute("data-player"));
      const turnIdx = Number(target.getAttribute("data-turn"));
      const state = stateManager.getState();
      const player = state.players[playerIdx];
      if (!player || !player.turns[turnIdx]) return;
      const turn = player.turns[turnIdx];
      // Set edit mode for this turn and player
      editMode = true;
      editPlayerIdx = playerIdx;
      editTurnIdx = turnIdx;
      // Enable the Edit button, disable Remove while editing
      if (editHitBtn) editHitBtn.disabled = false;
      if (removeHitBtn) removeHitBtn.disabled = true;
      // Fill the input fields with the selected turn's values
      if (hitInput1) hitInput1.value = turn.hits[0] !== undefined ? String(turn.hits[0]) : "";
      if (hitInput2) hitInput2.value = turn.hits[1] !== undefined ? String(turn.hits[1]) : "";
      if (hitInput3) hitInput3.value = turn.hits[2] !== undefined ? String(turn.hits[2]) : "";
    }
  });

  // Remove last turn button
  if (removeHitBtn) removeHitBtn.addEventListener("click", () => {
    // Always target the last turn of the previous player (the one who just played)
    const state = stateManager.getState();
    const playerIdx = state.currentPlayer === 0 ? 1 : 0;
    const player = state.players[playerIdx];
    if (!player || player.turns.length === 0) return;
    player.turns.pop();
    recalculatePlayerScore(stateManager, playerIdx);
    uiHandler.updateScoreboard();
    // (Highlight effect removed as requested)
    if (editHitBtn) editHitBtn.disabled = true;
    if (removeHitBtn) removeHitBtn.disabled = true;
    if (hitInput1) hitInput1.value = "";
    if (hitInput2) hitInput2.value = "";
    if (hitInput3) hitInput3.value = "";
    // Reset edit mode if it was active
    editMode = false;
    editPlayerIdx = null;
    editTurnIdx = null;
    // Focus the first hit input for the current player
    if (hitInput1) hitInput1.focus();
  });
function inpIsInvalid(inp: HTMLInputElement): boolean {
  if (!inp) return true;
  if (inp.value === "") return false; // allow blank as 0

  const n = Number(inp.value);
  return Number.isNaN(n) || n < 0;
}

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
