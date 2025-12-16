import { StateManager } from "./stateManager.js";

export function applyHit(
  stateManager: StateManager,
  hit: number
): { bust?: boolean; switchedTo?: number } | { legWon?: boolean; winnerIndex?: number; gameOver?: boolean; gameWinnerIndex?: number } | void {
  const state = stateManager.getState();
  const player = state.players[state.currentPlayer];

  if (!player) {
    throw new Error("Player not found");
  }

  const score = Math.max(0, Math.floor(hit));
  const newScore = player.score - score;

  // Bust
  if (newScore < 0) {
    player.turns.push(0);
    // switch turn
    state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
    return { bust: true, switchedTo: state.currentPlayer };
  }

  player.score = newScore;
  player.turns.push(score);

  // Leg won
  if (newScore === 0) {
    player.legsWon++;
    const winnerIndex = state.currentPlayer;
    const gameOver = player.legsWon >= state.maxLegs;
    if (gameOver) {
      // don't reset so UI can show final legs
      return { legWon: true, winnerIndex, gameOver: true, gameWinnerIndex: winnerIndex };
    }
    stateManager.resetLeg();
    return { legWon: true, winnerIndex };
  }

  state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
}
