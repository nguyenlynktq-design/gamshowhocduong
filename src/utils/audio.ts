// Standalone, 100% in-code Web Audio Synthesizer for "Ai Là Triệu Phú"
// Stored completely in code: No external MP3/WAV downloads needed, works completely offline when exported!
// Âm thanh nền đã được gỡ bỏ theo yêu cầu người dùng; chỉ giữ lại hiệu ứng âm thanh (SFX)

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

if (typeof window !== 'undefined') {
  const unlockAudioContext = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore
    }
  };
  window.addEventListener('click', unlockAudioContext, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAudioContext, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudioContext, { once: true, passive: true });
}

export function playTone(
  freq: number,
  type: OscillatorType = 'sine',
  duration = 0.2,
  gainValue = 0.15,
  pitchBendTo?: number
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (pitchBendTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, pitchBendTo), ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio play errors
  }
}

// Generate realistic audience clapping sound via Web Audio API noise buffer
export function playApplause(duration = 2.2) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const pulse = Math.sin((i / ctx.sampleRate) * 28 * Math.PI) > 0.8 ? 1.5 : 0.7;
      data[i] = white * pulse * (1 - i / bufferSize);
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1100;
    filter.Q.value = 1.2;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
  } catch {
    // Ignore
  }
}

export const SFX = {
  // Sound when tapping an option: Crisp bright dual-tone chime
  select: (enabled = true) => {
    if (!enabled) return;
    playTone(587.33, 'triangle', 0.12, 0.22); // D5
    setTimeout(() => playTone(880.0, 'sine', 0.18, 0.25), 50); // A5
  },

  // Sound when pressing [CHỐT ĐÁP ÁN]: Dramatic TV studio heartbeat drone + rising tension
  tensionDrone: (enabled = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Deep sub impact
      playTone(65, 'triangle', 1.8, 0.4, 40);

      // Tension sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 1.9);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.9);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.0);

      // Heartbeat pulse after 0.7s
      setTimeout(() => {
        playTone(55, 'sine', 0.35, 0.3);
      }, 700);
      setTimeout(() => {
        playTone(50, 'sine', 0.35, 0.25);
      }, 1100);
    } catch {
      // Ignore
    }
  },

  // Correct answer fanfare: Grand brass-like chord & triumphant arpeggio + applause
  correct: (enabled = true) => {
    if (!enabled) return;
    playTone(523.25, 'triangle', 0.4, 0.3); // C5
    playTone(659.25, 'triangle', 0.4, 0.25); // E5
    setTimeout(() => {
      playTone(783.99, 'triangle', 0.45, 0.32); // G5
      playTone(1046.5, 'sine', 0.6, 0.35); // C6
    }, 120);
    setTimeout(() => {
      playTone(1318.51, 'sine', 0.7, 0.4); // E6
      playTone(1567.98, 'sine', 0.8, 0.35); // G6
      playApplause(2.4);
    }, 240);
  },

  // Wrong answer: Studio buzzer + dissonant plunge
  wrong: (enabled = true) => {
    if (!enabled) return;
    playTone(174.61, 'sawtooth', 0.5, 0.35, 95); // F3 downwards
    playTone(185.0, 'sawtooth', 0.5, 0.32, 100); // F#3 dissonant clash
    setTimeout(() => {
      playTone(110.0, 'sawtooth', 0.6, 0.3, 55);
    }, 150);
  },

  // Countdown second tick: studio digital woodblock
  tick: (enabled = true) => {
    if (!enabled) return;
    playTone(987.77, 'sine', 0.05, 0.08); // B5 click
  },

  // Lifeline chime: Futuristic synth sweep
  lifeline: (enabled = true) => {
    if (!enabled) return;
    playTone(440, 'sine', 0.15, 0.2, 880);
    setTimeout(() => playTone(880, 'triangle', 0.25, 0.25, 1760), 80);
  }
};
