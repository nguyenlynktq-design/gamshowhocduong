import React from 'react';
import { Crown, RotateCcw, Eye } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  totalScore: number;
  correctCount: number;
  totalQuestions: number;
  onRestart: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  totalScore,
  correctCount,
  totalQuestions,
  onRestart,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
      <div className="bg-[#081535] w-full max-w-xl rounded-3xl p-7 sm:p-9 border border-amber-400/60 shadow-[0_0_60px_rgba(245,158,11,0.6)] flex flex-col items-center text-center gap-5 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Crown Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.8)] animate-pulse">
          <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-slate-950 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-extrabold">
            VINH DANH BẢN LĨNH HỌC ĐƯỜNG
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white mt-1 uppercase tracking-wide">
            CHÚC MỪNG CÁC BẠN!
          </h2>
          <p className="text-xs sm:text-sm text-cyan-300 font-semibold mt-1">
            Các em đã xuất sắc hoàn thành trọn vẹn mọi chặng thử thách của Gameshow!
          </p>
        </div>

        {/* Score Summary Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          <div className="bg-[#040b1e] p-3.5 rounded-2xl border border-cyan-500/40 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Tổng Điểm Tích Lũy
            </span>
            <span className="text-2xl sm:text-3xl font-digital font-black text-amber-400 mt-1">
              {totalScore.toLocaleString('vi-VN')}
            </span>
            <span className="text-[11px] text-cyan-300">Điểm Tri Thức</span>
          </div>
          <div className="bg-[#040b1e] p-3.5 rounded-2xl border border-emerald-500/40 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Câu Trả Lời Đúng
            </span>
            <span className="text-2xl sm:text-3xl font-display font-black text-emerald-400 mt-1">
              {correctCount} / {totalQuestions}
            </span>
            <span className="text-[11px] text-emerald-300">Đạt danh hiệu Vàng</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#040b1e] border border-amber-400/40 text-amber-200 text-xs sm:text-sm leading-relaxed max-w-md text-left">
          🌟 <strong>Thầy cô và cả trường quay tự hào về các em!</strong> Các em đã thể hiện tư duy nhận diện dữ kiện sắc bén, hiểu rõ ranh giới an toàn và luôn sẵn sàng tìm kiếm sự đồng hành tin cậy từ người lớn có trách nhiệm.
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full justify-center">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-slate-950 font-display font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>CHƠI LẠI TỪ ĐẦU (CÂU 01)</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#091738] hover:bg-[#102454] border border-blue-700/60 text-slate-300 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Xem lại đấu trường</span>
          </button>
        </div>

      </div>
    </div>
  );
};
