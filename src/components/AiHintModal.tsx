import React from 'react';
import { Bot, X } from 'lucide-react';

interface AiHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint: string;
}

export const AiHintModal: React.FC<AiHintModalProps> = ({
  isOpen,
  onClose,
  hint
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-[#081535] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-400 flex items-center justify-center text-xl text-amber-300 animate-pulse">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-amber-300">
                CỐ VẤN TRÍ TUỆ NHÂN TẠO (AI ADVISOR)
              </h3>
              <p className="text-xs text-slate-400">
                Phân tích logic bám sát quy tắc bảo vệ an toàn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#040b1e] border border-amber-500/30">
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {hint}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm transition shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer"
        >
          CẢM ƠN CỐ VẤN AI
        </button>
      </div>
    </div>
  );
};
