

export interface Player {
  name: string;
  score: number;
  legsWon: number;
  turns: number[];
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  maxLegs: number;
}

export class StateManager {
  private state: GameState;

  constructor() {
    this.state = {
      players: [],
      currentPlayer: 0,
      maxLegs: 3,
    };
  }

  initializePlayers(player1: string, player2: string, gameType: number, legsPerSet: number) {
    this.state.players = [
      {
        name: player1,
        score: gameType,
        legsWon: 0,
        turns: [],
      },
      {
        name: player2,
        score: gameType,
        legsWon: 0,
        turns: [],
      },
    ];
    this.state.currentPlayer = 0;
    this.state.maxLegs = legsPerSet;
  }

  getState(): GameState {
    return this.state;
  }

  updateScore(playerIndex: number, newScore: number) {
    this.state.players[playerIndex].score = newScore;
  }

  addTurn(playerIndex: number, score: number) {
    this.state.players[playerIndex].turns.push(score);
  }

  resetLeg() {
    const gameType = this.state.players[0].score + this.state.players[0].turns.reduce((a, b) => b + a, 0); // or keep initial gameType in a variable
    this.state.players.forEach((player) => {
      player.score = gameType;
      player.turns = [];
    });
    this.state.currentPlayer = 0;
  }

  setCurrentPlayer(index: number) {
    this.state.currentPlayer = index;
  }
}
