
 // Darts scoring and game flow logic 

 import { StateManager, Player, GameState } from "./stateManager.js";

/** Result returned by applyHit so callers know what happened this turn. */
export interface ApplyHitResult {
  busted: boolean;
  newScore: number;
  legWonBy?: number | null; // player index who won the leg
  setWonBy?: number | null; // player index who won the set (if any)
  nextPlayer: number;
}

// Subtracts a hit from current score. If the subtraction would go below zero,
 
export function calculateNewScore(currentScore: number, hit: number): number {
  const result = currentScore - hit;
  return result >= 0 ? result : currentScore; // bust condition
}

// Returns true when a player's score is exactly zero (leg won). 
export function checkLegWinner(score: number): boolean {
  return score === 0;
}

// Switches between player 0 and player 1. 
export function switchPlayer(currentIndex: number): number {
  return currentIndex === 0 ? 1 : 0;
}

// Returns the index of the set winner if someone has reached majority of legs, otherwise null. 
export function checkSetWinner(state: GameState): number | null {
  const needed = Math.ceil(state.maxLegs / 2);
  const winner = state.players.findIndex((p) => p.legsWon >= needed);
  return winner === -1 ? null : winner;
}

// Applies a hit to the current player's score, updating the game state accordingly.

export function applyHit(stateManager: StateManager, hit: number): ApplyHitResult {
  const state = stateManager.getState();
  const currentIndex = state.currentPlayer;
  const player: Player = state.players[currentIndex];

  // Normalize hit
  const scored = Math.max(0, Math.floor(Number(hit) || 0));

  // Compute tentative new score
  const newScore = calculateNewScore(player.score, scored);

  // Detect bust: scored > 0 but score didn't change
  const isBust = scored > 0 && newScore === player.score;

  if (isBust) {
    // Record the bust as a turn of 0 (useful for averages/history)
    player.turns.push(0);

    // Switch player on bust
    state.currentPlayer = switchPlayer(currentIndex);

    return {
      busted: true,
      newScore: player.score,
      legWonBy: null,
      setWonBy: null,
      nextPlayer: state.currentPlayer,
    };
  }

  // update score and record turn
  stateManager.updateScore(currentIndex, newScore);
  player.turns.push(scored);

  // Check for leg win
  if (checkLegWinner(newScore)) {
    // Increase legsWon
    player.legsWon = (player.legsWon || 0) + 1;

    // Reset leg for both players
    stateManager.resetLeg();

    // After resetting leg, check for set winner
    const setWinnerIndex = checkSetWinner(state);

    return {
      busted: false,
      newScore: 0,
      legWonBy: currentIndex,
      setWonBy: setWinnerIndex,
      nextPlayer: state.currentPlayer,
    };
  }

  // switch turn to the other player
  state.currentPlayer = switchPlayer(currentIndex);

  return {
    busted: false,
    newScore,
    legWonBy: null,
    setWonBy: null,
    nextPlayer: state.currentPlayer,
  };
}