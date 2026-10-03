import React, { useState } from 'react';
import {
  Scissors,
  Users,
  Bot,
  Shuffle,
  Pause,
  Play,
  FlaskConical,
  Lock,
  Undo2,
  Volume2,
  FastForward
} from 'lucide-react';
import { Question, OptionKey, LifelinesState } from '../types/game';
import { setSpeechSpeed, getSpeechSpeed } from '../utils/speech';

interface QuestionArenaProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  currentReward: string;
  totalScore: number;
  timeLeft: number;
  timerDuration: number;
  timerPaused: boolean;
  onToggleTimerPause: () => void;
  lifelinesUsed: LifelinesState;
  onUseLifeline: (type: keyof LifelinesState) => void;
  selectedOption: OptionKey | null;
  onSelectOption: (option: OptionKey) => void;
  onClearOption: () => void;
  onLockAnswer: () => void;
  isLocked: boolean;
  isEvaluating: boolean;
  eliminatedOptions: OptionKey[];
  revealedAnswer: { isCorrect: boolean; correctAnswer: OptionKey } | null;
  instructionText: string;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

export const QuestionArena: React.FC<QuestionArenaProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentReward,
  totalScore,
  timeLeft,
  timerDuration,
  timerPaused,
  onToggleTimerPause,
  lifelinesUsed,
  onUseLifeline,
  selectedOption,
  onSelectOption,
  onClearOption,
  onLockAnswer,
  isLocked,
  isEvaluating,
  eliminatedOptions,
  revealedAnswer,
  instructionText,
  isSpeaking,
  onToggleSpeech
}) => {
  const [speed, setSpeed] = useState(getSpeechSpeed());
  const options: OptionKey[] = ['A', 'B', 'C', 'D'];

  // Timer circle stroke offset (circumference = 2 * PI * 13 ≈ 81.6)
  const timerCircleOffset = 81.6 - (timeLeft / timerDuration) * 81.6;

  // Question backlight glow color
  let backdropGlow = 'from-blue-700/25 via-cyan-600/25 to-indigo-700/25';
  if (isLocked && !revealedAnswer) {
    backdropGlow = 'from-orange-600 via-amber-600 to-red-600 opacity-90 animate-pulse';
  } else if (revealedAnswer) {
    backdropGlow = revealedAnswer.isCorrect
      ? 'from-emerald-500 via-teal-500 to-green-600 opacity-90'
      : 'from-red-600 via-rose-600 to-pink-600 opacity-90';
  }

  return (
    <div className="flex flex-col justify-between gap-4 h-full">
      {/* SUBHEADER CONTROL BAR */}
      <div className="bg-[#071330]/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-blue-900/60 flex flex-wrap items-center justify-between gap-3 shadow-md">
        
        <div className="flex items-center gap-3">
          {/* Question Index Pill */}
          <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 border border-cyan-400/50 font-display font-black text-sm sm:text-base text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <span>CÂU {(currentIndex + 1).toString().padStart(2, '0')}</span>{' '}
            <span className="text-cyan-300 font-bold text-xs">/ {totalQuestions.toString().padStart(2, '0')}</span>
          </div>

          {/* Current Level Points & Total Score */}
          <div className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-3">
            <div>
              Mức điểm câu này:{' '}
              <span className="font-display font-black text-amber-400 text-sm sm:text-base">
                {currentReward}
              </span>
            </div>
            <div className="hidden sm:inline-block px-3 py-1 rounded-lg bg-[#040d24] border border-cyan-500/40 text-cyan-300 font-bold text-xs">
              Tổng điểm:{' '}
              <span className="font-digital text-amber-300 text-sm font-extrabold">
                {totalScore.toLocaleString('vi-VN')}
              </span>{' '}
              Điểm
            </div>
          </div>
        </div>

        {/* Lifelines + Countdown Timer */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Circular Countdown Badge */}
          <div className="flex items-center gap-2 bg-[#04091c] px-3 py-1.5 rounded-xl border border-blue-900">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90 transform">
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  stroke="#1e293b"
                  strokeWidth="2.5"
                  fill="transparent"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  stroke={timeLeft <= 5 ? '#EF4444' : timeLeft <= 10 ? '#F59E0B' : '#00F0FF'}
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeDasharray="81.6"
                  strokeDashoffset={timerCircleOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span
                className={`absolute font-digital text-xs font-bold ${
                  timeLeft <= 5
                    ? 'text-red-400 animate-ping'
                    : timeLeft <= 10
                    ? 'text-amber-400'
                    : 'text-cyan-300'
                }`}
              >
                {timeLeft.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Pause/Resume Button */}
            <button
              onClick={onToggleTimerPause}
              title={timerPaused ? 'Tiếp tục thời gian' : 'Tạm dừng thời gian'}
              className="text-slate-400 hover:text-cyan-400 transition p-1 cursor-pointer"
            >
              {timerPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>

          {/* Lifeline 1: 50:50 */}
          <button
            onClick={() => onUseLifeline('5050')}
            disabled={lifelinesUsed['5050'] || isLocked || isEvaluating}
            title="Loại bỏ 2 phương án sai"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#091738] hover:bg-[#102554] border border-blue-700/60 text-cyan-300 text-xs sm:text-sm font-display font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <Scissors className="w-3.5 h-3.5 text-cyan-400" />
            <span>50:50</span>
          </button>

          {/* Lifeline 2: Khán giả */}
          <button
            onClick={() => onUseLifeline('audience')}
            disabled={lifelinesUsed.audience || isLocked || isEvaluating}
            title="Khảo sát ý kiến khán giả / lớp học"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#091738] hover:bg-[#102554] border border-blue-700/60 text-indigo-300 text-xs sm:text-sm font-display font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Khán Giả</span>
          </button>

          {/* Lifeline 3: AI Gợi ý */}
          <button
            onClick={() => onUseLifeline('ai')}
            disabled={lifelinesUsed.ai || isLocked || isEvaluating}
            title="Hỏi cố vấn AI về dữ kiện"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#091738] hover:bg-[#102554] border border-blue-700/60 text-amber-300 text-xs sm:text-sm font-display font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Gợi Ý</span>
          </button>

          {/* Lifeline 4: Đổi câu hỏi */}
          <button
            onClick={() => onUseLifeline('switch')}
            disabled={lifelinesUsed.switch || isLocked || isEvaluating}
            title="Đổi sang câu hỏi dự phòng"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#091738] hover:bg-[#102554] border border-blue-700/60 text-emerald-300 text-xs sm:text-sm font-display font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Đổi Câu</span>
          </button>
        </div>

      </div>

      {/* MAIN QUESTION CARD */}
      <div className="relative flex-1 flex flex-col justify-center">
        {/* Dynamic Neon Backlight */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${backdropGlow} rounded-3xl blur-2xl transition-all duration-700 pointer-events-none`} />

        <div className="relative bg-[#06122d]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-cyan-500/35 shadow-[0_15px_50px_rgba(0,0,0,0.7)] flex flex-col items-center text-center justify-center min-h-[220px] sm:min-h-[260px] gap-4">
          
          {/* Category & Difficulty Badge Pill */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#091b40] border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <FlaskConical className="w-6 h-6" />
            </div>

            <div className="text-left flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-0.5 rounded-full bg-[#0a234f] border border-cyan-400/40 text-[11px] font-bold text-cyan-300 uppercase tracking-wider inline-block">
                  CHỦ ĐỀ: CHUNG TAY ĐẨY LÙI MA TUÝ
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-950/60 border border-pink-400/40 text-[10px] font-bold text-pink-300 uppercase tracking-wide inline-flex items-center gap-1">
                  <span>🎙️</span> Giọng Nữ Miền Nam
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                Mức độ: <span className="text-slate-200 font-semibold">{question.levelLabel || 'Căn bản'}</span>
              </div>
            </div>
          </div>

          {/* Big Bold Question Text */}
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-extrabold text-white leading-relaxed tracking-wide max-w-4xl">
            {question.question}
          </h3>

          {/* Quick Voice Reading & Speed Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-1">
            <button
              onClick={onToggleSpeech}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-all active:scale-95 cursor-pointer shadow-lg ${
                isSpeaking
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 border-pink-300 text-white shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-pulse'
                  : 'bg-gradient-to-r from-blue-900/80 to-indigo-900/80 hover:from-blue-800 hover:to-indigo-800 border-cyan-400/60 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-white animate-bounce' : 'text-cyan-300'}`} />
              <span>
                {isSpeaking
                  ? '🔊 Đang đọc... (Bấm để dừng)'
                  : '🔊 BẤM ĐỂ NGHE ĐỌC TIẾNG VIỆT'}
              </span>
            </button>

            {/* Quick Speed Switcher */}
            <button
              onClick={() => {
                const speeds = [1.0, 1.25, 1.4, 1.6];
                const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
                const nextSpeed = speeds[nextIdx];
                setSpeed(nextSpeed);
                setSpeechSpeed(nextSpeed);
              }}
              title="Bấm để đổi tốc độ đọc (1.0x, 1.25x, 1.4x, 1.6x)"
              className="px-4 py-2.5 rounded-2xl bg-[#081b3d] hover:bg-[#0f2e66] border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition active:scale-95 cursor-pointer hover:border-amber-300"
            >
              <FastForward className="w-4 h-4 text-amber-400" />
              <span>Tốc độ: {speed}x {speed === 1.25 ? '(Chuẩn)' : speed >= 1.4 ? '(Nhanh)' : ''}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4 OPTIONS (A, B, C, D) 2x2 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {options.map((optLetter) => {
          const isEliminated = eliminatedOptions.includes(optLetter);
          const isSelected = selectedOption === optLetter;
          
          let btnStateClass = 'opt-idle';
          if (revealedAnswer) {
            if (optLetter === revealedAnswer.correctAnswer) {
              btnStateClass = 'opt-correct';
            } else if (isSelected && !revealedAnswer.isCorrect) {
              btnStateClass = 'opt-wrong';
            }
          } else if (isLocked && isSelected) {
            btnStateClass = 'opt-locked';
          } else if (isSelected) {
            btnStateClass = 'opt-selected';
          }

          return (
            <button
              key={optLetter}
              onClick={() => onSelectOption(optLetter)}
              disabled={isEliminated || isLocked || isEvaluating}
              style={{
                opacity: isEliminated ? 0.15 : 1,
                pointerEvents: isEliminated ? 'none' : 'auto'
              }}
              className={`${btnStateClass} btn-gameshow-hex p-4 sm:p-5 text-left rounded-2xl flex items-center gap-4 cursor-pointer focus:outline-none transition-all`}
            >
              <span className="w-10 h-10 rounded-xl bg-[#061026] border border-amber-400/60 text-amber-400 font-display font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                {optLetter}
              </span>
              <span className="font-semibold text-sm sm:text-base md:text-lg text-slate-100 flex-1 leading-snug">
                {question.options[optLetter]}
              </span>
            </button>
          );
        })}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="bg-[#06112a]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        
        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${
              isLocked
                ? 'bg-orange-500 animate-ping'
                : selectedOption
                ? 'bg-amber-400 animate-ping'
                : 'bg-cyan-400 animate-pulse'
            }`}
          />
          <span className="text-xs sm:text-sm text-slate-300 font-medium">
            {instructionText}
          </span>
        </div>

        {/* Action Buttons Right */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {selectedOption && !isLocked && (
            <button
              onClick={onClearOption}
              className="px-4 py-3 rounded-xl bg-[#091738] hover:bg-[#102454] text-slate-300 font-semibold text-xs sm:text-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
              <span>Chọn lại</span>
            </button>
          )}

          {/* BIG GOLD CHỐT ĐÁP ÁN BUTTON */}
          <button
            onClick={onLockAnswer}
            disabled={!selectedOption || isLocked || isEvaluating}
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-display font-black text-base sm:text-lg tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-5 h-5 text-slate-950" />
            <span>{isLocked ? 'ĐANG CHỐT...' : 'CHỐT ĐÁP ÁN'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
