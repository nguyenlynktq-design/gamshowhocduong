// High-Speed Authentic Vietnamese Voice Engine (Giọng Nữ Tiếng Việt Tốc Độ Nhanh)
// Tối ưu tốc độ đọc dứt khoát, lưu loát, không ngắt quãng dài, phong cách MC Gameshow

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: unknown) => void;
}

let currentSpeed = 1.25; // Tốc độ mặc định 1.25x: Nhanh, linh hoạt, rõ ràng
let currentAudio: HTMLAudioElement | null = null;
let preloadedAudios: HTMLAudioElement[] = [];
let isPlaying = false;

export function getSpeechSpeed(): number {
  return currentSpeed;
}

export function setSpeechSpeed(speed: number) {
  currentSpeed = speed;
  if (currentAudio) {
    try {
      currentAudio.playbackRate = speed;
    } catch {
      // Ignore
    }
  }
}

export function stopSpeaking() {
  isPlaying = false;
  preloadedAudios = [];

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
    } catch {
      // Ignore
    }
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

/**
 * Split text into logical, concise chunks (<= 180 chars) to minimize HTTP requests
 */
function createFastChunks(
  questionText: string,
  options: { A: string; B: string; C: string; D: string }
): string[] {
  const cleanQ = questionText.replace(/\?+$/, '').trim();
  
  // Chunk 1: Question
  const chunk1 = `${cleanQ}?`;

  // Concise options format without repeating long "Phương án..."
  const optionsTextAll = `A: ${options.A}. B: ${options.B}. C: ${options.C}. D: ${options.D}.`;

  if (optionsTextAll.length <= 180) {
    return [chunk1, optionsTextAll];
  }

  // If options are long, split into A+B and C+D
  const optionsAB = `A: ${options.A}. B: ${options.B}.`;
  const optionsCD = `C: ${options.C}. D: ${options.D}.`;
  return [chunk1, optionsAB, optionsCD];
}

/**
 * Play chunks sequentially at high speed (1.25x) with zero lag between chunks
 */
export function readQuestionImmediately(
  questionText: string,
  options: { A: string; B: string; C: string; D: string },
  opts: SpeakOptions = {}
) {
  stopSpeaking();
  isPlaying = true;

  const chunks = createFastChunks(questionText, options);
  opts.onStart?.();

  // Preload all audio elements in parallel
  preloadedAudios = chunks.map((chunk) => {
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(chunk)}`);
    audio.preload = 'auto';
    return audio;
  });

  let index = 0;

  const playCurrentIndex = () => {
    if (!isPlaying || index >= preloadedAudios.length) {
      isPlaying = false;
      opts.onEnd?.();
      return;
    }

    const audio = preloadedAudios[index];
    currentAudio = audio;

    // Apply speed
    audio.playbackRate = currentSpeed;

    audio.onended = () => {
      if (!isPlaying) return;
      index++;
      // Ultra-short 40ms pause between chunks for natural brisk flow
      setTimeout(playCurrentIndex, 40);
    };

    audio.onerror = () => {
      if (!isPlaying) return;
      index++;
      playCurrentIndex();
    };

    // Ensure playbackRate applies after metadata is ready
    audio.onloadedmetadata = () => {
      audio.playbackRate = currentSpeed;
    };

    audio.play().then(() => {
      audio.playbackRate = currentSpeed;
    }).catch((err) => {
      console.warn('Playback error:', err);
      index++;
      if (index >= preloadedAudios.length) {
        isPlaying = false;
        opts.onError?.(err);
      } else {
        playCurrentIndex();
      }
    });
  };

  playCurrentIndex();
}
