// Procedural 8-bit Audio Synthesizer using Web Audio API
// Generates authentic retro square/triangle/sawtooth sound effects with zero external assets.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBip(freq = 440, type = 'square', duration = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // AudioContext policy or unsupported
    }
  }

  playSelect() {
    this.playBip(587.33, 'square', 0.05); // D5
    setTimeout(() => this.playBip(880, 'square', 0.08), 50); // A5
  }

  playRoll() {
    if (!this.enabled) return;
    this.init();
    const tones = [300, 420, 520, 650, 800, 950];
    tones.forEach((t, i) => {
      setTimeout(() => this.playBip(t, 'triangle', 0.05), i * 45);
    });
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    const fanfare = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    fanfare.forEach((f, i) => {
      setTimeout(() => this.playBip(f, 'square', 0.12), i * 90);
    });
  }

  playHeal() {
    if (!this.enabled) return;
    this.init();
    [440, 554.37, 659.25].forEach((f, i) => {
      setTimeout(() => this.playBip(f, 'sine', 0.1), i * 60);
    });
  }
}

export const sound = new SoundEngine();
