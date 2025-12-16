import { StateManager } from "../models/stateManager.js";
import { getAverage, getHighestTurn } from "../models/stats.js";

export class UIHandler {
  constructor(private stateManager: StateManager) {}

  updateScoreboard(): void {
    const state = this.stateManager.getState();

    state.players.forEach((p, i) => {
      const nameEl = document.getElementById(`name-${i}`);
      const scoreEl = document.getElementById(`score-${i}`);
      const legsEl = document.getElementById(`legs-${i}`);
      const avgEl = document.getElementById(`avg-${i}`);
      const highEl = document.getElementById(`high-${i}`);

      if (nameEl) nameEl.textContent = p.name;
      if (scoreEl) scoreEl.textContent = String(p.score);
      if (legsEl) legsEl.textContent = String(p.legsWon);
      if (avgEl) avgEl.textContent = String(getAverage(p));
      if (highEl) highEl.textContent = String(getHighestTurn(p));
    });
  }

  highlightActivePlayer(): void {
    const state = this.stateManager.getState();

    state.players.forEach((_, i) => {
      const el = document.getElementById(`player-${i}`);
      if (el) {
        el.classList.toggle("active", i === state.currentPlayer);
      }
    });
  }

  showFlash(message: string, timeout = 3000): void {
    this.showFlashWithType(message, "info", timeout);
  }

  showFlashWithType(message: string, type: "info" | "success" | "error" = "info", timeout = 3000): void {
    const flash = document.getElementById("flash");
    if (!flash) return;
    flash.textContent = message;
    flash.style.display = "block";
    flash.className = "flash flash--visible flash--" + type;

    // play a short beep for success/game-over
    if (type === "success") this.playBeep(480, 0.12);
    if (type === "error") this.playBeep(220, 0.18);

    setTimeout(() => {
      flash.classList.remove("flash--visible");
      flash.style.display = "none";
      flash.className = "flash";
    }, timeout);
  }

  private playBeep(freq = 440, duration = 0.1) {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.value = 0.05;
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, duration * 1000);
    } catch (e) {
      // Audio API may be blocked; ignore.
    }
  }

  showDescription(text: string): void {
    const desc = document.getElementById("description");
    if (!desc) return;
    desc.textContent = text;
  }
}
