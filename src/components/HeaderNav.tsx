import React from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Globe,
  Volume2,
  VolumeX,
  Music,
  Mic,
  Edit,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { GameMode, ExternalWebsiteConfig } from '../types/game';

interface HeaderNavProps {
  currentMode: GameMode;
  onGoHomeOrRestart: () => void;
  externalWebsite: ExternalWebsiteConfig;
  soundEnabled: boolean;
  onToggleSound: () => void;
  autoRead: boolean;
  onToggleAutoRead: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  onOpenEditor: () => void;
  onOpenNewGame: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentMode,
  onGoHomeOrRestart,
  externalWebsite,
  soundEnabled,
  onToggleSound,
  autoRead,
  onToggleAutoRead,
  isSpeaking,
  onToggleSpeech,
  onOpenEditor,
  onOpenNewGame,
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <header className="w-full px-4 lg:px-8 py-3 bg-[#060e24]/95 border-b border-blue-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-xl z-30">
      
      {/* Brand & Title Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onGoHomeOrRestart}
          title="Về trang chủ / Bắt đầu lại"
          className="w-11 h-11 rounded-xl bg-gradient-to-b from-blue-600 to-indigo-950 p-[1.5px] shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center cursor-pointer hover:scale-105 transition"
        >
          <div className="w-full h-full bg-[#08132d] rounded-[10px] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
          </div>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-display font-extrabold uppercase tracking-wider text-cyan-300">
              GAMESHOW HỌC ĐƯỜNG
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 border border-amber-400/50 text-amber-300 uppercase">
              {currentMode} CÂU HỎI VÀNG
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-display font-black text-white uppercase tracking-wider">
            CHUNG TAY ĐẨY LÙI MA TUÝ
          </h2>
        </div>
      </div>

      {/* Action Tools Right */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        
        {/* Restart Button */}
        <button
          onClick={onGoHomeOrRestart}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border border-rose-400/50 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Chơi lại từ đầu</span>
        </button>

        {/* External Website Nav Button */}
        {externalWebsite.url && (
          <a
            href={externalWebsite.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-[#081f3d] hover:bg-[#0f2d59] border border-cyan-400/50 text-cyan-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{externalWebsite.title}</span>
          </a>
        )}

        {/* Auto Read Vietnamese Voice Toggle */}
        <button
          onClick={onToggleAutoRead}
          title="Tự động đọc câu hỏi bằng Giọng Nữ Miền Nam khi chuyển câu"
          className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            autoRead
              ? 'bg-cyan-950/70 border-cyan-400/80 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.35)]'
              : 'bg-[#0a1838] hover:bg-[#102454] border-blue-800 text-slate-400'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${autoRead ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">
            Tự động đọc: {autoRead ? 'BẬT' : 'TẮT'}
          </span>
        </button>

        {/* Sound Effects Toggle */}
        <button
          onClick={onToggleSound}
          className="px-3 py-2 rounded-xl bg-[#0a1838] hover:bg-[#102454] border border-blue-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 text-slate-200 cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
          <span className="hidden sm:inline">
            Hiệu ứng: {soundEnabled ? 'BẬT' : 'TẮT'}
          </span>
        </button>

        {/* Read question aloud with Southern Vietnamese Female Voice */}
        <button
          onClick={onToggleSpeech}
          className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            isSpeaking
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 border-pink-300 text-white shadow-[0_0_18px_rgba(244,63,94,0.6)] animate-pulse'
              : 'bg-[#102652] hover:bg-[#183572] border-cyan-400/60 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
          }`}
          title="Đọc câu hỏi bằng giọng Nữ Miền Nam (Bấm chọn đáp án ngay mà không cần đợi đọc xong)"
        >
          <Mic className={`w-4 h-4 ${isSpeaking ? 'text-white' : 'text-pink-400'}`} />
          <span>
            {isSpeaking ? '🔊 Đang đọc... (Bấm để dừng)' : '🎙️ Đọc câu hỏi (Nữ Nam)'}
          </span>
        </button>

        {/* Teacher Editor */}
        <button
          onClick={onOpenEditor}
          className="px-3 py-2 rounded-xl bg-[#1a1530] hover:bg-[#251e44] border border-amber-500/40 text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-amber-300 transition active:scale-95 cursor-pointer"
        >
          <Edit className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Biên tập / Giáo viên</span>
        </button>

        {/* New Game from source */}
        <button
          onClick={onOpenNewGame}
          className="px-3 py-2 rounded-xl bg-[#0c1f44] hover:bg-[#132f69] border border-cyan-500/40 text-xs sm:text-sm font-bold flex items-center gap-1.5 text-cyan-300 transition active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="hidden lg:inline">Tạo game từ nguồn</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          title="Toàn màn hình máy chiếu"
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#0a1838] hover:bg-[#102454] border border-blue-800 text-slate-200 text-sm transition active:scale-95 cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <Maximize2 className="w-4 h-4 text-cyan-400" />
          )}
        </button>
      </div>

    </header>
  );
};
