import { StateManager } from "./stateManager.js";

export function applyHit(
  stateManager: StateManager,
  hits: number[]
): { bust?: boolean; switchedTo?: number } | { legWon?: boolean; winnerIndex?: number; gameOver?: boolean; gameWinnerIndex?: number } | void {
  const state = stateManager.getState();
  const player = state.players[state.currentPlayer];

  if (!player) {
    throw new Error("Player not found");
  }

  // Ensure hits is always length 3
  const turnHits = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const h = hits[i] ?? 0;
    turnHits[i] = Math.max(0, Math.floor(h));
  }
  const turnTotal = turnHits.reduce((a, b) => a + b, 0);
  const newScore = player.score - turnTotal;

  // Bust
  if (newScore < 0 || newScore === 1) {
    player.turns.push({ hits: [0, 0, 0] });
    // switch turn
    state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
    return { bust: true, switchedTo: state.currentPlayer };
  }

  player.score = newScore;
  player.turns.push({ hits: turnHits });

  // Leg won
  if (newScore === 0) {
    player.legsWon++;
    const winnerIndex = state.currentPlayer;
    const neededToWin = Math.ceil(state.maxLegs / 2);
    const gameOver = player.legsWon >= neededToWin;
    if (gameOver) {
      // don't reset so UI can show final legs
      return { legWon: true, winnerIndex, gameOver: true, gameWinnerIndex: winnerIndex };
    }
    stateManager.resetLeg();
    return { legWon: true, winnerIndex };
  }

  state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
}
