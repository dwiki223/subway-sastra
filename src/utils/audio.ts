// Procedural Web Audio API sound synthesizer - zero external audio dependencies

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmInterval: number | null = null;
  private bgmStep: number = 0;
  private isBgmPlaying: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.pauseBgm();
    } else if (!muted && !this.isBgmPlaying) {
      this.startBgm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Coin collect ping
  public playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Jump swoosh
  public playJump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Slide sound
  public playSlide() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Filtered noise swoosh
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const now = this.ctx.currentTime;
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.21);
  }

  // Checkpoint approach klaxon / gong
  public playCheckpointAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      const now = this.ctx!.currentTime + idx * 0.07;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    });
  }

  // Correct answer fanfare
  public playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.08 }, // E5
      { freq: 783.99, time: 0.16 }, // G5
      { freq: 1046.50, time: 0.24 },// C6
      { freq: 1318.51, time: 0.35 } // E6
    ];

    chords.forEach(({ freq, time }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      const now = this.ctx!.currentTime + time;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  // Wrong answer buzz
  public playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.35);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Collision / Stumble crash
  public playCrash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);
  }

  // Powerup pickup
  public playPowerup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // 1500m Speed multiplier 2x sound effect
  public playSpeedUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const freqs = [329.63, 440.00, 554.37, 659.25, 880.00, 1108.73]; // E4, A4, C#5, E5, A5, C#6
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      const now = this.ctx!.currentTime + idx * 0.05;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    });
  }

  // Light upbeat background rhythm track generated procedurally
  public startBgm() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    const bassNotes = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83]; // A2 pattern
    const bpm = 124;
    const intervalMs = (60 / bpm / 2) * 1000;

    this.bgmInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const step = this.bgmStep % 16;
      this.bgmStep++;

      const now = this.ctx.currentTime;

      // Bass beat on eighths
      if (step % 2 === 0) {
        const noteIdx = Math.floor(step / 2) % bassNotes.length;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassNotes[noteIdx], now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
      }

      // Hi-hat tick
      if (step % 2 === 1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'highpass' as unknown as OscillatorType;
        osc.frequency.setValueAtTime(3000, now);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    }, intervalMs);
  }

  public pauseBgm() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.isBgmPlaying = false;
  }
}

export const sound = new SoundEngine();
