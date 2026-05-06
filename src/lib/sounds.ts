'use client';

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  private init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public playClick() {
    this.playTone(400, 'sine', 0.05, 0.1);
  }

  public playMessageSent() {
    this.playTone(600, 'sine', 0.1, 0.2, 800);
  }

  public playMessageReceived() {
    this.playTone(800, 'sine', 0.1, 0.3, 1200);
  }

  public playNotification() {
    this.playTone(500, 'sine', 0.1, 0.4, 700);
    setTimeout(() => this.playTone(700, 'sine', 0.1, 0.5, 900), 150);
  }

  private playTone(freq: number, type: OscillatorType, vol: number, dur: number, slideToFreq?: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = type;
    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    const now = this.audioCtx.currentTime;
    
    osc.frequency.setValueAtTime(freq, now);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideToFreq, now + dur);
    }

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(vol, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.start(now);
    osc.stop(now + dur);
  }
}

export const sounds = new SoundEngine();
