import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Question, OptionKey } from '../types/game';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportQuestions: (questions: Question[]) => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onImportQuestions
}) => {
  const [sourceText, setSourceText] = useState('');

  if (!isOpen) return null;

  const handleProcessInput = () => {
    const rawText = sourceText.trim();
    if (!rawText) {
      onClose();
      return;
    }

    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const newItems: Question[] = [];
    let cur: Question | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const numMatch = line.match(/^(?:Câu\s*)?(\d{1,2})[\.:\s]*$/i) || line.match(/^(\d{1,2})$/);
      
      if (numMatch && i + 1 < lines.length) {
        if (cur) newItems.push(cur);
        cur = {
          id: numMatch[1].padStart(2, '0'),
          question: lines[++i],
          options: { A: '', B: '', C: '', D: '' },
          answer: 'A',
          rationale: 'Theo dữ kiện tài liệu nguồn.',
          levelLabel: 'Tình huống',
          aiHint: 'Bám sát dữ kiện trực tiếp từ tài liệu nguồn.'
        };
        continue;
      }

      if (cur) {
        if (line.includes('A.') && line.includes('B.')) {
          const parts = line.split(/[A-D]\.\s*/).filter(Boolean);
          if (parts.length >= 4) {
            cur.options.A = parts[0].replace(/;\s*$/, '');
            cur.options.B = parts[1].replace(/;\s*$/, '');
            cur.options.C = parts[2].replace(/;\s*$/, '');
            cur.options.D = parts[3].replace(/;\s*$/, '');
          }
        } else if (line.match(/^([A-D])\s*[—–-]\s*(.*)$/)) {
          const ansMatch = line.match(/^([A-D])\s*[—–-]\s*(.*)$/);
          if (ansMatch) {
            cur.answer = ansMatch[1] as OptionKey;
            cur.rationale = ansMatch[2];
          }
        }
      }
    }
    if (cur) newItems.push(cur);

    if (newItems.length > 0) {
      onImportQuestions(newItems);
      onClose();
    } else {
      alert('Không nhận diện được định dạng câu hỏi. Vui lòng kiểm tra mẫu câu hỏi!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-[#081535] w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-xl text-cyan-300">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">
                TẠO GAME MỚI TỪ NGUỒN TÀI LIỆU / YOUTUBE
              </h3>
              <p className="text-xs text-slate-400">
                Dán câu hỏi hoặc nội dung văn bản để hệ thống tự động phân tích
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">
            Dán nội dung câu hỏi theo định dạng:
          </label>
          <textarea
            rows={8}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={`01
Người lạ mời cốc đã rót sẵn. Em biết chắc điều nào?
A. Cốc chứa ma túy; B. Cốc đã rót sẵn; C. Người đó phạm pháp; D. Cốc an toàn.
B — Dữ kiện nhìn thấy; chưa thể xác định thành phần.`}
            className="w-full p-3.5 rounded-xl bg-[#040b1e] border border-blue-900 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#091738] text-slate-300 text-xs font-semibold hover:bg-[#102454] cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleProcessInput}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md hover:opacity-95 cursor-pointer"
          >
            Chuyển đổi & Chơi Ngay
          </button>
        </div>

      </div>
    </div>
  );
};
