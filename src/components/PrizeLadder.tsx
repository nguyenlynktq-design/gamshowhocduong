import React from 'react';
import { Target } from 'lucide-react';

interface PrizeLadderProps {
  totalQuestions: number;
  currentIndex: number;
  rewards: string[];
}

export const PrizeLadder: React.FC<PrizeLadderProps> = ({
  totalQuestions,
  currentIndex,
  rewards
}) => {
  const milestoneNote = totalQuestions === 10 ? 'Mốc Thử Thách: 5 & 10' : 'Mốc Thử Thách: 5, 10 & 15';
  const targetLabel = totalQuestions === 10 ? 'Mục tiêu: 1.000 Điểm' : 'Mục tiêu: 1.500 Điểm';

  // Render top-down
  const ladderIndices = Array.from({ length: totalQuestions }, (_, i) => totalQuestions - 1 - i);

  return (
    <div className="bg-[#06112a]/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-blue-900/60 shadow-2xl flex flex-col h-full justify-between">
      <div>
        {/* Header Ladder */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/60 mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white">
              BẬC THANG ĐIỂM SỐ
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            {milestoneNote}
          </span>
        </div>

        {/* Ladder List */}
        <div className="flex flex-col gap-1 my-1 overflow-y-auto max-h-[520px] pr-1">
          {ladderIndices.map((idx) => {
            const isMilestone =
              totalQuestions === 10
                ? idx === 4 || idx === 9
                : idx === 4 || idx === 9 || idx === 14;
            const isCurrent = idx === currentIndex;

            let rowClass = 'px-3 py-1.5 rounded-xl flex items-center justify-between text-xs transition-all font-mono ';
            if (isCurrent) {
              rowClass += 'ladder-step-active ';
            } else if (isMilestone) {
              rowClass += 'text-amber-400 font-bold bg-[#0d1f47]/60 border border-amber-500/30 ';
            } else {
              rowClass += 'text-slate-300 hover:bg-[#0c1a3b]/40 ';
            }

            return (
              <div key={idx} className={rowClass}>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 font-display font-black ${
                      isCurrent
                        ? 'text-slate-950'
                        : isMilestone
                        ? 'text-amber-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-slate-950 uppercase tracking-tighter">
                      ▶ ĐANG CHƠI
                    </span>
                  )}
                  {!isCurrent && isMilestone && (
                    <span className="text-amber-400">⭐</span>
                  )}
                </div>
                <span
                  className={`font-bold ${
                    isCurrent
                      ? 'text-slate-950 font-black'
                      : isMilestone
                      ? 'text-amber-300 font-extrabold'
                      : ''
                  }`}
                >
                  {rewards[idx] || ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Note in Ladder */}
      <div className="pt-3 border-t border-blue-900/60 mt-2 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Mốc bản lĩnh
        </span>
        <span className="font-mono text-cyan-400 font-bold">
          {targetLabel}
        </span>
      </div>
    </div>
  );
};
