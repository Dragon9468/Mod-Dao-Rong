/**
 * Hệ Thống Âm Thanh Đảo Rồng - Web Audio API Sound Engine
 * Tự động tổng hợp âm thanh đa âm sắc, không lo lỗi thiếu file âm thanh MP3.
 */

class DragonSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.masterVolume = 0.8;
    this.sfxVolume = 0.9;
    this.bgmVolume = 0.35;
    this.currentTheme = 'island'; // 'island' | 'battle'
    this.initialized = false;
  }

  init() {
    if (this.initialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("AudioContext not supported:", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startBGM(this.currentTheme);
    }
    return this.isMuted;
  }

  // --- Sound Effects (SFX) ---

  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.05);

    gain.gain.setValueAtTime(0.12 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  playGold() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [987.77, 1318.51, 1975.53]; // B5, E6, B6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18 * this.sfxVolume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  playHarvest() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  playFeed() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Crunch pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

    gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);

    // Cute chirp
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const chirpOsc = this.ctx.createOscillator();
      const chirpGain = this.ctx.createGain();

      chirpOsc.type = 'sine';
      chirpOsc.frequency.setValueAtTime(700, t);
      chirpOsc.frequency.exponentialRampToValueAtTime(1200, t + 0.12);

      chirpGain.gain.setValueAtTime(0.15 * this.sfxVolume, t);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      chirpOsc.connect(chirpGain);
      chirpGain.connect(this.ctx.destination);

      chirpOsc.start(t);
      chirpOsc.stop(t + 0.15);
    }, 70);
  }

  playLevelUp() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Triumphant arpeggio: C5 - E5 - G5 - C6
    const chord = [523.25, 659.25, 783.99, 1046.50];
    const now = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22 * this.sfxVolume, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  playEggCrack() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(360, now + 0.02);
    osc.frequency.setValueAtTime(120, now + 0.04);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  playHatch() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Sparkle harp flourish
    const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22, 1975.53];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0, st);
      gain.gain.linearRampToValueAtTime(0.18 * this.sfxVolume, st + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(st);
      osc.stop(st + 0.38);
    });
  }

  playAttack(element) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    switch (element) {
      case 'FIRE':
        // Flame explosion
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
        gain.gain.setValueAtTime(0.28 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        break;

      case 'WATER':
        // Wave surge
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.3);
        gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
        break;

      case 'THUNDER':
        // Lightning zap
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(200, now + 0.04);
        osc.frequency.setValueAtTime(1200, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
        gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);
        break;

      case 'LEAF':
        // Whirlwind slice
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.22);
        gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);
        break;

      case 'EARTH':
        // Earthquake boom
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
        gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
        break;

      default:
        // Generic strike
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  playUltimate() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Low roar rumble
    const roar = this.ctx.createOscillator();
    const roarGain = this.ctx.createGain();
    roar.type = 'sawtooth';
    roar.frequency.setValueAtTime(180, now);
    roar.frequency.exponentialRampToValueAtTime(80, now + 0.4);
    roarGain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
    roarGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    roar.connect(roarGain);
    roarGain.connect(this.ctx.destination);
    roar.start(now);
    roar.stop(now + 0.5);

    // Rising energy blast
    const blast = this.ctx.createOscillator();
    const blastGain = this.ctx.createGain();
    blast.type = 'sine';
    blast.frequency.setValueAtTime(300, now + 0.1);
    blast.frequency.exponentialRampToValueAtTime(1200, now + 0.45);
    blastGain.gain.setValueAtTime(0.01, now + 0.1);
    blastGain.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, now + 0.35);
    blastGain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    blast.connect(blastGain);
    blastGain.connect(this.ctx.destination);
    blast.start(now + 0.1);
    blast.stop(now + 0.6);
  }

  // --- Procedural Ambient Background Music (BGM) ---
  startBGM(theme = 'island') {
    this.currentTheme = theme;
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.stopBGM();
    this.bgmPlaying = true;

    // Melody loops
    const islandMelody = [
      { note: 261.63, dur: 0.6 }, // C4
      { note: 329.63, dur: 0.6 }, // E4
      { note: 392.00, dur: 0.8 }, // G4
      { note: 523.25, dur: 1.0 }, // C5
      { note: 440.00, dur: 0.6 }, // A4
      { note: 392.00, dur: 0.8 }, // G4
      { note: 349.23, dur: 0.6 }, // F4
      { note: 329.63, dur: 1.2 }  // E4
    ];

    const battleMelody = [
      { note: 220.00, dur: 0.3 }, // A3
      { note: 261.63, dur: 0.3 }, // C4
      { note: 293.66, dur: 0.3 }, // D4
      { note: 329.63, dur: 0.4 }, // E4
      { note: 293.66, dur: 0.3 }, // D4
      { note: 329.63, dur: 0.3 }, // E4
      { note: 440.00, dur: 0.6 }  // A4
    ];

    const melody = (theme === 'battle') ? battleMelody : islandMelody;
    let step = 0;

    const playNextNote = () => {
      if (!this.bgmPlaying || this.isMuted || !this.ctx) return;

      const item = melody[step % melody.length];
      const now = this.ctx.currentTime;

      // Soft ambient tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = (theme === 'battle') ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(item.note, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04 * this.bgmVolume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.dur * 0.95);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + item.dur);

      step++;
      this.bgmTimer = setTimeout(playNextNote, item.dur * 1000);
    };

    playNextNote();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

// Global audio singleton
window.DragonAudio = new DragonSoundEngine();
