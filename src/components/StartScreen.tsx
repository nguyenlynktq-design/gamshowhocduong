import React from 'react';
import { ShieldCheck, Rocket, Globe, Edit3, Sparkles } from 'lucide-react';
import { GameMode, ExternalWebsiteConfig } from '../types/game';

interface StartScreenProps {
  currentMode: GameMode;
  onSwitchMode: (mode: GameMode) => void;
  onStartGame: () => void;
  externalWebsite: ExternalWebsiteConfig;
  onOpenEditor: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  currentMode,
  onSwitchMode,
  onStartGame,
  externalWebsite,
  onOpenEditor
}) => {
  return (
    <div className="relative z-20 flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 my-auto">
      <div className="w-full max-w-2xl bg-[#061026]/95 backdrop-blur-2xl rounded-[32px] p-7 sm:p-10 border border-[#142a55] shadow-[0_20px_80px_rgba(0,0,0,0.9)] flex flex-col items-center text-center gap-6 relative">
        
        {/* Top Shield Icon with Soft Blue Glow & Squircle Frame */}
        <div className="w-24 h-24 rounded-[26px] bg-gradient-to-b from-[#132c66] to-[#091738] p-[2.5px] shadow-[0_0_35px_rgba(0,180,255,0.45)] flex items-center justify-center">
          <div className="w-full h-full rounded-[24px] bg-[#071330] flex items-center justify-center">
            <ShieldCheck className="w-12 h-12 text-[#38bdf8] drop-shadow-[0_0_15px_rgba(56,189,248,0.9)]" />
          </div>
        </div>

        {/* Tag Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#071f45] border border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
          <span className="text-amber-400 text-xs">⭐</span>
          <span className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-cyan-300">
            GAMESHOW HỌC ĐƯỜNG TRUYỀN HÌNH
          </span>
          <span className="text-amber-400 text-xs">⭐</span>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-[#040c20] p-1.5 rounded-full border border-blue-900/80">
          <button
            onClick={() => onSwitchMode(10)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
              currentMode === 10
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            10 Câu Tinh Gọn
          </button>
          <button
            onClick={() => onSwitchMode(15)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
              currentMode === 15
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            15 Câu Toàn Bộ
          </button>
        </div>

        {/* Main Title (Golden & High-Contrast) */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-wide uppercase text-[#ffc837] gold-title-glow leading-tight">
            AI LÀ TRIỆU PHÚ
          </h1>
          
          {/* Topic Pill */}
          <div className="mt-4 inline-block px-7 py-2.5 rounded-full bg-[#052345] border-2 border-cyan-400/70 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            <span className="text-sm sm:text-lg font-display font-black text-cyan-300 uppercase tracking-wide cyan-topic-glow">
              CHỦ ĐỀ: CHUNG TAY ĐẨY LÙI MA TUÝ
            </span>
          </div>
        </div>

        {/* How to play rules card */}
        <div className="w-full bg-[#040c20]/95 rounded-2xl p-5 sm:p-6 border border-blue-900/60 text-left flex flex-col gap-3.5 text-xs sm:text-sm text-slate-200 shadow-inner">
          <div className="flex items-center gap-2 font-display font-extrabold text-amber-400 uppercase tracking-wider text-xs sm:text-sm border-b border-blue-900/70 pb-2.5">
            <span>📜</span> CÁCH CHƠI & THỂ LỆ
          </div>
          
          <div className="flex items-start gap-2.5">
            <span className="text-cyan-400 text-sm mt-0.5">◆</span>
            <span>Mỗi câu hỏi có <strong>4 phương án A, B, C, D</strong> (chỉ có 01 đáp án đúng).</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-cyan-400 text-sm mt-0.5">◆</span>
            <span>Người chơi chọn <strong>01 đáp án đúng</strong> rồi bấm <strong>[CHỐT ĐÁP ÁN]</strong>.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-cyan-400 text-sm mt-0.5">◆</span>
            <span>Sau khi người dẫn đọc câu hỏi, người chơi được quyền giơ tay trả lời câu hỏi.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-amber-400 text-sm mt-0.5">★</span>
            <span>
              Vượt qua <strong>{currentMode} câu hỏi vàng</strong> để tích lũy <strong>{currentMode === 10 ? '1.000 Điểm' : '1.500 Điểm'}</strong> tri thức và bản lĩnh phòng chống ma túy!
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-1">
          <button
            onClick={onStartGame}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-display font-black text-base sm:text-lg tracking-wider uppercase shadow-[0_0_35px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Rocket className="w-5 h-5" />
            <span>BẮT ĐẦU NGAY ➔</span>
          </button>

          {/* External Website Link Button */}
          {externalWebsite.url && (
            <a
              href={externalWebsite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 border border-cyan-400/50 text-cyan-300 font-bold text-sm tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>{externalWebsite.title}</span>
            </a>
          )}

          <button
            onClick={onOpenEditor}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#0a1b3a] hover:bg-[#122a57] border border-blue-700/60 text-slate-300 font-bold text-sm tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Kiểm tra câu hỏi</span>
          </button>
        </div>

        {/* Pedagogical Safety Notice */}
        <p className="text-[11px] text-slate-400 italic max-w-lg mt-0.5">
          * Lưu ý giáo dục: Trò chơi rèn luyện nhận diện dữ kiện. Ngoài đời thực, khi gặp tình huống nghi ngờ, hãy luôn tìm người lớn có trách nhiệm hỗ trợ!
        </p>

      </div>
    </div>
  );
};
