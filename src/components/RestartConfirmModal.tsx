import React from 'react';
import { RotateCcw } from 'lucide-react';

interface RestartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RestartConfirmModal: React.FC<RestartConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-[#081535] w-full max-w-md rounded-3xl p-6 sm:p-7 border border-red-500/40 shadow-2xl flex flex-col gap-5 text-center items-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500 flex items-center justify-center text-3xl text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]">
          <RotateCcw className="w-8 h-8 text-rose-400" />
        </div>
        <div>
          <h3 className="text-xl font-display font-extrabold text-white">
            BẠN MUỐN CHƠI LẠI TỪ ĐẦU?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Hệ thống sẽ đặt lại toàn bộ điểm số, phục hồi 4 quyền trợ giúp và bắt đầu lại từ Câu số 01.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#091738] hover:bg-[#102454] border border-blue-800 text-slate-300 font-semibold text-sm transition cursor-pointer"
          >
            Tiếp tục chơi
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] transition cursor-pointer"
          >
            Đồng ý chơi lại
          </button>
        </div>
      </div>
    </div>
  );
};
