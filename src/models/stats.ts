import type { Player } from "./stateManager.js";


export function getAverage(player: Player): number {
  if (player.turns.length === 0) return 0;
  const sum = player.turns.reduce((acc, turn) => acc + turn.hits.reduce((a, b) => a + b, 0), 0);
  const darts = player.turns.length * 3;
  return Number((sum / darts).toFixed(2));
}

export function getHighestTurn(player: Player): number {
  if (!player.turns.length) return 0;
  return Math.max(...player.turns.map(turn => turn.hits.reduce((a, b) => a + b, 0)));
}
