// Web Audio API Synthesizer for Timer completion sounds and ambient wellness mixer
class AudioManager {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private instrumentGain: GainNode | null = null;
  private isNaturePlaying: boolean = false;
  private isInstrumentPlaying: boolean = false;
  private activeOscillators: Array<{ stop: () => void }> = [];
  private natureNoiseNode: AudioNode | null = null;
  private currentInstrumentInterval: any = null;
  private natureInterval: any = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play Timer completion sound
  public playCompletionSound(
    soundType: 'Bell' | 'Chime' | 'Singing Bowl' | 'Gong' | 'Soft Bell' | 'Soft Notification',
    volume: number = 0.7
  ) {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, now);
      masterGain.connect(ctx.destination);

      switch (soundType) {
        case 'Bell': {
          // Harmonic warm bell
          [523.25, 1046.5, 1567.98].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            const decay = 2.5 - idx * 0.4;
            gain.gain.setValueAtTime(0.3 / (idx + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + decay);
          });
          break;
        }
        case 'Chime': {
          // Ascending dual chime
          [880, 1318.51, 1760].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(0.25, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.0);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 2.0);
          });
          break;
        }
        case 'Singing Bowl': {
          // Warm resonant singing bowl with subtle beating
          const fundamental = 216; // A3 harmonic
          [fundamental, fundamental + 1.2, fundamental * 2.76, fundamental * 5.4].forEach(
            (freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now);
              gain.gain.setValueAtTime(0.25 / (idx + 1), now);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
              osc.connect(gain);
              gain.connect(masterGain);
              osc.start(now);
              osc.stop(now + 4.5);
            }
          );
          break;
        }
        case 'Gong': {
          // Low resonant metallic strike
          [110, 164.81, 220, 277.18].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.3 / (idx + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 4.0);
          });
          break;
        }
        case 'Soft Bell':
        case 'Soft Notification':
        default: {
          // Gentle two-tone soft chime
          [659.25, 987.77].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const startTime = now + idx * 0.15;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(startTime);
            osc.stop(startTime + 1.8);
          });
          break;
        }
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Start Ambient Nature Sound
  public startNatureSound(
    type: 'Rain' | 'Ocean Waves' | 'Ocean' | 'Birds' | 'Forest' | 'Wind' | 'Water Streams' | 'Flowing Water',
    volume: number = 0.5
  ) {
    this.stopNatureSound();
    try {
      const ctx = this.initContext();
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate brown/pink-like soothing noise
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain boost
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (type === 'Rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      } else if (type === 'Ocean Waves' || type === 'Ocean') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        // LFO for wave surges
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8-second wave period
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(300, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        this.activeOscillators.push(lfo);
      } else if (type === 'Wind') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(150, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        this.activeOscillators.push(lfo);
      } else if (type === 'Birds' || type === 'Forest') {
        // Rustling forest breeze
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        filter.Q.setValueAtTime(0.5, ctx.currentTime);

        // Periodic gentle bird chirps
        const chirpInterval = setInterval(() => {
          if (!this.ctx || !this.ambientGain) return;
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const baseFreq = 2200 + Math.random() * 800;
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.05);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, now + 0.12);
            gain.gain.setValueAtTime(0.015, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
            osc.connect(gain);
            gain.connect(this.ambientGain);
            osc.start(now);
            osc.stop(now + 0.25);
          } catch (e) {}
        }, type === 'Birds' ? 2400 : 4500);
        this.natureInterval = chirpInterval;
      } else {
        // Water Streams / Flowing Water
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);
      }

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      whiteNoise.start();
      this.natureNoiseNode = whiteNoise;
      this.isNaturePlaying = true;
    } catch (err) {
      console.warn('Nature sound error:', err);
    }
  }

  public stopNatureSound() {
    if (this.natureInterval) {
      clearInterval(this.natureInterval);
      this.natureInterval = null;
    }
    if (this.natureNoiseNode) {
      try {
        (this.natureNoiseNode as any).stop?.();
        this.natureNoiseNode.disconnect();
      } catch (e) {}
      this.natureNoiseNode = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.activeOscillators = [];
    this.isNaturePlaying = false;
  }

  public setNatureVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);
    }
  }

  // Instrumental Soothing Chords & Workout Beats loop
  public startInstrumentSound(
    instrument: 'Piano' | 'Flute' | 'Guitar' | 'Vina' | 'Violin' | 'Light Workout Beats' | 'Instrumental Music',
    volume: number = 0.5
  ) {
    this.stopInstrumentSound();
    try {
      const ctx = this.initContext();
      this.instrumentGain = ctx.createGain();
      this.instrumentGain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
      this.instrumentGain.connect(ctx.destination);

      if (instrument === 'Light Workout Beats') {
        // Rhythmic gentle tempo beat (110 BPM - steady cadence)
        const bpm = 110;
        const beatInterval = (60 / bpm) * 1000;
        let beatCount = 0;

        const playBeat = () => {
          if (!this.ctx || !this.instrumentGain) return;
          const now = ctx.currentTime;
          const isDownbeat = beatCount % 4 === 0;
          beatCount++;

          // Gentle thumping kick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isDownbeat ? 120 : 85, now);
          osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
          gain.gain.setValueAtTime(isDownbeat ? 0.35 : 0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
          osc.connect(gain);
          gain.connect(this.instrumentGain!);
          osc.start(now);
          osc.stop(now + 0.16);

          // Subtle melodic synth chime on 2 and 4
          if (beatCount % 2 === 0) {
            const chimeOsc = ctx.createOscillator();
            const chimeGain = ctx.createGain();
            chimeOsc.type = 'triangle';
            const chordNotes = [329.63, 392.0, 440.0, 523.25];
            const note = chordNotes[(beatCount / 2) % chordNotes.length];
            chimeOsc.frequency.setValueAtTime(note, now + 0.05);
            chimeGain.gain.setValueAtTime(0.12, now + 0.05);
            chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
            chimeOsc.connect(chimeGain);
            chimeGain.connect(this.instrumentGain!);
            chimeOsc.start(now + 0.05);
            chimeOsc.stop(now + 0.42);
          }
        };

        playBeat();
        this.currentInstrumentInterval = setInterval(playBeat, beatInterval);
        this.isInstrumentPlaying = true;
        return;
      }

      const chords = [
        [261.63, 329.63, 392.0], // C Major
        [220.0, 261.63, 329.63], // A Minor
        [174.61, 220.0, 261.63], // F Major
        [196.0, 246.94, 293.66], // G Major
      ];

      let chordIdx = 0;
      const playChord = () => {
        if (!this.ctx || !this.instrumentGain) return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq, noteIdx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          const now = ctx.currentTime + noteIdx * 0.15;

          if (instrument === 'Flute') {
            osc.type = 'sine';
          } else if (instrument === 'Guitar' || instrument === 'Vina') {
            osc.type = 'triangle';
          } else if (instrument === 'Violin') {
            osc.type = 'sawtooth';
          } else {
            osc.type = 'sine'; // Piano / Instrumental Music
          }

          osc.frequency.setValueAtTime(freq, now);
          noteGain.gain.setValueAtTime(0, now);
          noteGain.gain.linearRampToValueAtTime(0.18, now + 0.1);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

          osc.connect(noteGain);
          noteGain.connect(this.instrumentGain!);
          osc.start(now);
          osc.stop(now + 4.0);
        });
      };

      playChord();
      this.currentInstrumentInterval = setInterval(playChord, 4200);
      this.isInstrumentPlaying = true;
    } catch (err) {
      console.warn('Instrument sound error:', err);
    }
  }

  public stopInstrumentSound() {
    if (this.currentInstrumentInterval) {
      clearInterval(this.currentInstrumentInterval);
      this.currentInstrumentInterval = null;
    }
    this.isInstrumentPlaying = false;
  }

  public setInstrumentVolume(volume: number) {
    if (this.instrumentGain && this.ctx) {
      this.instrumentGain.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);
    }
  }

  public stopAll() {
    this.stopNatureSound();
    this.stopInstrumentSound();
  }

  // --- GAME INTERACTIVE SOUND EFFECTS ---
  public playPop(volume: number = 0.4) {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      // Pitch drop creates organic soap bubble pop sound
      const startFreq = 400 + Math.random() * 250;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // AudioContext muted/unsupported fallback
    }
  }

  public playWaterDrop(volume: number = 0.35) {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      // Quick chirp upward
      const base = 800 + Math.random() * 400;
      osc.frequency.setValueAtTime(base, now);
      osc.frequency.exponentialRampToValueAtTime(base * 1.8, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(base * 0.9, now + 0.12);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  public playChimeNote(freq: number = 440, type: OscillatorType = 'sine', duration: number = 1.2, volume: number = 0.3) {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  public playSuccessChime(volume: number = 0.45) {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(volume * 0.7, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 1.8);
      });
    } catch {}
  }

  // Voice Guidance for exercise & yoga steps
  public speakGuidance(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  }

  public cancelSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

export const audioManager = new AudioManager();
