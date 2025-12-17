import type { Player } from "./stateManager.js";

export function getAverage(player: Player): number {
  if (player.turns.length === 0) return 0;
  const sum = player.turns.reduce((a, b) => a + b, 0);
  return Number((sum / player.turns.length).toFixed(2));
}

export function getHighestTurn(player: Player): number {
  return player.turns.length ? Math.max(...player.turns) : 0;
}
