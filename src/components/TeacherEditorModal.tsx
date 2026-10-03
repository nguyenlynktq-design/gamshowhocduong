import React, { useState, useEffect } from 'react';
import { Edit3, RotateCcw, X, Save, Globe } from 'lucide-react';
import { Question, OptionKey, ExternalWebsiteConfig } from '../types/game';

interface TeacherEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSaveQuestions: (updatedQuestions: Question[], updatedWebsite: ExternalWebsiteConfig) => void;
  onRestoreOriginals: () => void;
  externalWebsite: ExternalWebsiteConfig;
}

export const TeacherEditorModal: React.FC<TeacherEditorModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSaveQuestions,
  onRestoreOriginals,
  externalWebsite
}) => {
  const [editedQuestions, setEditedQuestions] = useState<Question[]>([]);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEditedQuestions(JSON.parse(JSON.stringify(questions)));
      setLinkTitle(externalWebsite.title);
      setLinkUrl(externalWebsite.url);
    }
  }, [isOpen, questions, externalWebsite]);

  if (!isOpen) return null;

  const handleQuestionTextChange = (index: number, val: string) => {
    setEditedQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], question: val };
      return copy;
    });
  };

  const handleAnswerChange = (index: number, val: OptionKey) => {
    setEditedQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], answer: val };
      return copy;
    });
  };

  const handleOptionChange = (qIndex: number, optKey: OptionKey, val: string) => {
    setEditedQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex] = {
        ...copy[qIndex],
        options: {
          ...copy[qIndex].options,
          [optKey]: val
        }
      };
      return copy;
    });
  };

  const handleSave = () => {
    onSaveQuestions(editedQuestions, {
      title: linkTitle.trim() || 'Tổng Đài 111',
      url: linkUrl.trim() || 'https://tongdai111.vn'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-[#081535] w-full max-w-4xl max-h-[90vh] rounded-3xl p-5 sm:p-7 border border-indigo-500/40 shadow-2xl flex flex-col gap-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-900/60 pb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-900 border border-indigo-400 flex items-center justify-center text-xl text-indigo-300">
              <Edit3 className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">
                BIÊN TẬP CÂU HỎI (DÀNH CHO GIÁO VIÊN)
              </h3>
              <p className="text-xs text-slate-400">
                Xem trước, chỉnh sửa câu chữ hoặc khôi phục dữ liệu gốc
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

        {/* External Link Configuration */}
        <div className="p-3 bg-[#040b1e] rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row gap-2.5 items-center flex-shrink-0">
          <span className="text-xs font-bold text-cyan-300 whitespace-nowrap flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-cyan-400" />
            Cấu hình Website liên kết:
          </span>
          <input
            type="text"
            placeholder="Tên hiển thị (VD: Tổng Đài 111)"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            className="w-full sm:w-1/3 bg-[#091738] border border-blue-800 rounded-lg p-2 text-white text-xs focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Đường link (https://...)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full sm:w-1/2 bg-[#091738] border border-blue-800 rounded-lg p-2 text-cyan-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Audio & Voice in Code Badge Notice */}
        <div className="p-2.5 bg-gradient-to-r from-blue-950/70 to-indigo-950/70 rounded-xl border border-blue-700/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="text-base">🎙️</span>
            <span>
              <strong>Giọng Nữ Miền Nam</strong> & <strong>Âm thanh lưu 100% trong code</strong>: Không phụ thuộc file ngoài, xuất app chạy mượt mà offline, đọc câu hỏi lập tức không phải chờ.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                import('../utils/speech').then(({ readQuestionImmediately }) => {
                  readQuestionImmediately(
                    'Chào mừng quý thầy cô và các bạn học sinh đến với Gameshow Ai Là Triệu Phú, chủ đề Chung tay đẩy lùi ma túy!',
                    {
                      A: 'Tự tin',
                      B: 'Bản lĩnh',
                      C: 'An toàn',
                      D: 'Trách nhiệm'
                    }
                  );
                });
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-700/60 hover:bg-cyan-600 border border-cyan-400/50 text-cyan-200 font-bold text-[11px] whitespace-nowrap transition cursor-pointer flex items-center gap-1"
            >
              <span>🔊</span> Thử giọng đọc
            </button>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400/60 text-emerald-300 font-bold text-[10px] whitespace-nowrap">
              ✓ SẴN SÀNG
            </span>
          </div>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm">
          {editedQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="p-3.5 rounded-2xl bg-[#040b1e] border border-blue-900 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between font-bold text-amber-400">
                <span>Câu {(idx + 1).toString().padStart(2, '0')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">Đáp án:</span>
                  <select
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(idx, e.target.value as OptionKey)}
                    className="bg-[#091738] border border-blue-700 rounded px-2 py-1 text-cyan-300 font-bold focus:outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Câu hỏi:</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionTextChange(idx, e.target.value)}
                  className="w-full bg-[#091738] border border-blue-800 rounded-lg p-2 text-white font-medium text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {(['A', 'B', 'C', 'D'] as OptionKey[]).map((optKey) => (
                  <div key={optKey} className="flex items-center gap-2">
                    <span className="w-5 text-center font-bold text-amber-400">{optKey}:</span>
                    <input
                      type="text"
                      value={q.options[optKey]}
                      onChange={(e) => handleOptionChange(idx, optKey, e.target.value)}
                      className="flex-1 bg-[#091738] border border-blue-800 rounded p-1.5 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-blue-900/60 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={() => {
              onRestoreOriginals();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#091738] hover:bg-[#102454] text-slate-300 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Khôi phục dữ liệu gốc</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#091738] hover:bg-[#102454] text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi & Áp dụng</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
