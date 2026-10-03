import React from 'react';
import { Check, Lightbulb, ArrowRight, Trophy } from 'lucide-react';
import { Question } from '../types/game';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  question: Question;
  praiseOrEncouragement: string;
  isLastQuestion: boolean;
  onProceed: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  isCorrect,
  question,
  praiseOrEncouragement,
  isLastQuestion,
  onProceed
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-[#081535] w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg ${
              isCorrect
                ? 'bg-emerald-950 border border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-amber-950/80 border border-amber-400 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
            }`}
          >
            {isCorrect ? <Check className="w-8 h-8 stroke-[3]" /> : <Lightbulb className="w-8 h-8 text-amber-400" />}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              KẾT QUẢ ĐỐI CHIẾU DỮ KIỆN
            </span>
            <h3
              className={`text-xl sm:text-2xl font-display font-extrabold ${
                isCorrect ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {isCorrect ? 'CHÍNH XÁC HOÀN TOÀN!' : 'CÙNG RÚT RA BÀI HỌC!'}
            </h3>
          </div>
        </div>

        {/* Dynamic Praise or Encouragement */}
        <div
          className={`p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3 transition-all ${
            isCorrect
              ? 'bg-gradient-to-r from-emerald-950/80 to-teal-900/70 border-emerald-400/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'bg-gradient-to-r from-amber-950/80 to-orange-950/70 border-amber-400/50 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
          }`}
        >
          <span className="text-2xl sm:text-3xl flex-shrink-0 animate-bounce">
            {isCorrect ? '🎉' : '💪'}
          </span>
          <div className="flex flex-col">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider ${
                isCorrect ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isCorrect ? '🌟 LỜI KHEN NGỢI TỪ TRƯỜNG QUAY' : '🌱 LỜI KHÍCH LỆ & TIẾP TỤC HỌC TẬP'}
            </span>
            <p className="text-sm sm:text-base font-bold leading-snug">
              {praiseOrEncouragement}
            </p>
          </div>
        </div>

        {/* Explanation Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#040b1e] border border-blue-900/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-cyan-300">GIẢI THÍCH / PHẢN HỒI TỪ TÀI LIỆU NGUỒN:</span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-400 text-emerald-300 font-bold">
              Đáp án: {question.answer}
            </span>
          </div>
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed italic font-medium">
            "{question.rationale}"
          </p>
        </div>

        {/* Safety Lesson Note */}
        <div className="text-xs text-slate-300 bg-cyan-950/30 p-3.5 rounded-xl border border-cyan-500/30 flex items-start gap-2.5">
          <Lightbulb className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>Gợi ý dữ kiện an toàn:</strong> {question.aiHint}
          </span>
        </div>

        {/* Next question action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onProceed}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-display font-bold text-base shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              isCorrect
                ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-slate-950 hover:from-amber-300'
            }`}
          >
            {isLastQuestion ? (
              <>
                <Trophy className="w-5 h-5" />
                <span>XEM TỔNG KẾT & CHÚC MỪNG 👑</span>
              </>
            ) : (
              <>
                <span>TIẾP TỤC CÂU TIẾP THEO</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
