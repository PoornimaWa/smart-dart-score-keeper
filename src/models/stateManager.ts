
export interface Turn {
  hits: number[]; // always length 3
}

export interface Player {
  name: string;
  score: number;
  turns: Turn[];
  legsWon: number;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  startingScore: number;
  maxLegs: number;
}

export class StateManager {
  private state: GameState;

  constructor() {
    this.state = {
      players: [],
      currentPlayer: 0,
      startingScore: 301,
      maxLegs: 3
    };
  }

  initializePlayers(
    player1: string,
    player2: string,
    startingScore: number,
    maxLegs: number
  ): void {
    this.state.players = [
      { name: player1, score: startingScore, turns: [], legsWon: 0 },
      { name: player2, score: startingScore, turns: [], legsWon: 0 }
    ];
    this.state.startingScore = startingScore;
    this.state.maxLegs = maxLegs;
    this.state.currentPlayer = 0;
  }

  getState(): GameState {
    return this.state;
  }

  updateScore(playerIndex: number, newScore: number): void {
    const player = this.state.players[playerIndex];
    if (!player) throw new Error("Invalid player index");
    player.score = newScore;
  }

  resetLeg(): void {
    for (const p of this.state.players) {
      p.score = this.state.startingScore;
      p.turns = [];
    }
    this.state.currentPlayer = 0;
  }
}
