import React from 'react';
import { BarChart3, X } from 'lucide-react';
import { OptionKey } from '../types/game';

interface AudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollData: Record<OptionKey, number>;
}

export const AudienceModal: React.FC<AudienceModalProps> = ({
  isOpen,
  onClose,
  pollData
}) => {
  if (!isOpen) return null;

  const options: OptionKey[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-[#081535] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-indigo-500/40 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-400 flex items-center justify-center text-xl text-indigo-300">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">
                KẾT QUẢ KHẢO SÁT KHÁN GIẢ / LỚP HỌC
              </h3>
              <p className="text-xs text-slate-400">
                Tỷ lệ biểu quyết của các đại diện tại trường quay
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

        <div className="flex flex-col gap-3.5 py-2">
          {options.map((letter) => {
            const pct = pollData[letter] || 0;
            return (
              <div key={letter} className="flex items-center gap-3">
                <span className="w-6 font-display font-black text-amber-400 text-sm">
                  {letter}
                </span>
                <div className="flex-1 bg-[#04091c] rounded-full h-5 overflow-hidden p-0.5 border border-blue-900">
                  <div
                    className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2 text-[10px] font-bold text-slate-950"
                    style={{ width: `${pct}%` }}
                  >
                    {pct > 10 ? `${pct}%` : ''}
                  </div>
                </div>
                <span className="w-10 text-right font-digital text-xs font-bold text-slate-300">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 italic text-center">
          Ý kiến khán giả là nguồn tham khảo quan trọng, hãy tự tin vào lập luận dữ kiện của bản thân.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition cursor-pointer"
        >
          ĐÃ HIỂU Ý KIẾN - TIẾP TỤC
        </button>
      </div>
    </div>
  );
};
