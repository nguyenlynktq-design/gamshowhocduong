// Multi-Tier Bulletproof Vietnamese Voice Engine
// Hoạt động 100% trên cả Local, Vercel, Netlify và thiết bị di động
// Tầng 1: /api/tts (Vercel Serverless Function & Node server)
// Tầng 2: Direct Google Translate TTS Stream (Hoạt động hoàn hảo trên domain Vercel độc lập)
// Tầng 3: Web Speech API (Được tối ưu cho Edge Hoài My, macOS Linh/Mai, Android Google Tiếng Việt)

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: unknown) => void;
}

let currentSpeed = 1.25; // Mặc định 1.25x: Nhanh chuẩn, phong cách MC Gameshow
let currentAudio: HTMLAudioElement | null = null;
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

// Auto-unlock speech synthesis on any user touch/click on the page
if (typeof window !== 'undefined') {
  const unlockAudioAndSpeech = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {
        // Ignore
      }
    }
  };
  window.addEventListener('click', unlockAudioAndSpeech, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAudioAndSpeech, { once: true, passive: true });
}

function findVietnameseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  // 1. Hoài My (Microsoft Edge Southern Vietnamese female voice)
  const hoaiMy = voices.find(
    (v) =>
      v.name.toLowerCase().includes('hoaimy') ||
      v.name.toLowerCase().includes('hoài my') ||
      (v.lang.toLowerCase().startsWith('vi') && v.name.toLowerCase().includes('nam'))
  );
  if (hoaiMy) return hoaiMy;

  // 2. Female Vietnamese voices (Linh, Mai, etc.)
  const vnFemale = voices.find(
    (v) =>
      v.lang.toLowerCase().replace('_', '-').startsWith('vi') &&
      (v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('nữ') ||
        v.name.toLowerCase().includes('linh') ||
        v.name.toLowerCase().includes('mai'))
  );
  if (vnFemale) return vnFemale;

  // 3. Any Vietnamese voice
  const vnAny = voices.find((v) =>
    v.lang.toLowerCase().replace('_', '-').startsWith('vi')
  );
  if (vnAny) return vnAny;

  return null;
}

/**
 * Fallback to Web Speech API
 */
function speakWithWebSpeech(
  chunks: string[],
  opts: SpeakOptions = {}
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    opts.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
  } catch {
    // Ignore
  }

  const voice = findVietnameseVoice();
  let chunkIdx = 0;

  const speakNextChunk = () => {
    if (!isPlaying || chunkIdx >= chunks.length) {
      isPlaying = false;
      opts.onEnd?.();
      return;
    }

    const text = chunks[chunkIdx];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = currentSpeed;

    if (voice) {
      utterance.voice = voice;
      utterance.pitch = 1.08;
    }

    utterance.onend = () => {
      if (!isPlaying) return;
      chunkIdx++;
      setTimeout(speakNextChunk, 40);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      chunkIdx++;
      if (chunkIdx >= chunks.length) {
        isPlaying = false;
        opts.onEnd?.();
      } else {
        speakNextChunk();
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      chunkIdx++;
      speakNextChunk();
    }
  };

  speakNextChunk();
}

/**
 * Multi-tier sequential player for list of Vietnamese text chunks
 */
export function readTextImmediately(
  rawChunks: string[],
  opts: SpeakOptions = {}
) {
  stopSpeaking();
  isPlaying = true;
  opts.onStart?.();

  // Normalize and split chunks if too long (> 180 chars)
  const chunks: string[] = [];
  for (const raw of rawChunks) {
    const trimmed = raw.replace(/[#*]+/g, '').trim();
    if (!trimmed) continue;
    if (trimmed.length <= 180) {
      chunks.push(trimmed);
    } else {
      const sentences = trimmed.split(/(?<=[.?!;:])\s+/);
      let curr = '';
      for (const s of sentences) {
        if ((curr + ' ' + s).trim().length <= 180) {
          curr = (curr + ' ' + s).trim();
        } else {
          if (curr) chunks.push(curr);
          curr = s.slice(0, 180);
        }
      }
      if (curr) chunks.push(curr);
    }
  }

  if (chunks.length === 0) {
    isPlaying = false;
    opts.onEnd?.();
    return;
  }

  let chunkIndex = 0;
  let useDirectFallback = false;

  const playChunk = () => {
    if (!isPlaying || chunkIndex >= chunks.length) {
      isPlaying = false;
      opts.onEnd?.();
      return;
    }

    const currentText = chunks[chunkIndex];
    const audioUrl = useDirectFallback
      ? `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(currentText)}`
      : `/api/tts?text=${encodeURIComponent(currentText)}`;

    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.playbackRate = currentSpeed;

    audio.onended = () => {
      if (!isPlaying) return;
      chunkIndex++;
      setTimeout(playChunk, 40);
    };

    audio.onerror = () => {
      console.warn('Audio stream failed for chunk, trying next tier...');
      if (!useDirectFallback) {
        useDirectFallback = true;
        playChunk();
      } else {
        const remainingChunks = chunks.slice(chunkIndex);
        speakWithWebSpeech(remainingChunks, opts);
      }
    };

    audio.onloadedmetadata = () => {
      audio.playbackRate = currentSpeed;
    };

    audio.play().catch(() => {
      if (!useDirectFallback) {
        useDirectFallback = true;
        playChunk();
      } else {
        const remainingChunks = chunks.slice(chunkIndex);
        speakWithWebSpeech(remainingChunks, opts);
      }
    });
  };

  playChunk();
}

/**
 * Split question & options into concise chunks (<= 180 chars)
 */
function createQuestionChunks(
  questionText: string,
  options: { A: string; B: string; C: string; D: string }
): string[] {
  const cleanQ = questionText.replace(/\?+$/, '').trim();
  const chunk1 = `${cleanQ}?`;
  const optionsTextAll = `A: ${options.A}. B: ${options.B}. C: ${options.C}. D: ${options.D}.`;

  if (optionsTextAll.length <= 180) {
    return [chunk1, optionsTextAll];
  }

  const optionsAB = `A: ${options.A}. B: ${options.B}.`;
  const optionsCD = `C: ${options.C}. D: ${options.D}.`;
  return [chunk1, optionsAB, optionsCD];
}

/**
 * Main function: readQuestionImmediately
 */
export function readQuestionImmediately(
  questionText: string,
  options: { A: string; B: string; C: string; D: string },
  opts: SpeakOptions = {}
) {
  const chunks = createQuestionChunks(questionText, options);
  readTextImmediately(chunks, opts);
}

/**
 * Main function: readFeedbackExplanation
 * Thuyết minh sau khi học sinh trả lời (Lời khen / khích lệ & giải thích đáp án)
 */
export function readFeedbackExplanation(
  isCorrect: boolean,
  praiseOrEncouragement: string,
  correctOptionKey: string,
  correctOptionText: string,
  rationale: string,
  opts: SpeakOptions = {}
) {
  const statusLine = isCorrect
    ? `Chính xác hoàn toàn!`
    : `Cùng rút ra bài học!`;
  
  const praiseClean = praiseOrEncouragement.replace(/[🎉⭐💪🌟🌱]/g, '').trim();
  const answerLine = `Đáp án đúng là ${correctOptionKey}: ${correctOptionText}.`;
  const rationaleClean = rationale.replace(/^["'\s]+|["'\s]+$/g, '').trim();

  readTextImmediately([statusLine, praiseClean, answerLine, rationaleClean], opts);
}

export function initVoiceEngine() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.getVoices();
    } catch {
      // Ignore
    }
  }
}
