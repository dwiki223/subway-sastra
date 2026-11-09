import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, CheckCircle2, Eye, EyeOff, Sparkles, Filter } from 'lucide-react';
import { QUESTION_BANK } from '../data/indonesianQuestions';
import { Question } from '../types/game';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAnswerKeys, setShowAnswerKeys] = useState<boolean>(true);

  const categories = [
    { id: 'all', label: 'Semua Soal', count: QUESTION_BANK.length },
    { id: 'pantun', label: 'Pantun', count: QUESTION_BANK.filter((q) => q.category === 'pantun').length },
    { id: 'syair', label: 'Syair', count: QUESTION_BANK.filter((q) => q.category === 'syair').length },
    { id: 'gurindam', label: 'Gurindam', count: QUESTION_BANK.filter((q) => q.category === 'gurindam').length },
    { id: 'perbandingan', label: 'Perbandingan & Analisis', count: QUESTION_BANK.filter((q) => q.category === 'perbandingan').length },
  ];

  const filteredQuestions = useMemo(() => {
    return QUESTION_BANK.filter((q) => {
      const matchCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchText =
        q.question.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query) ||
        q.explanation.toLowerCase().includes(query) ||
        (q.poemText && q.poemText.some((line) => line.toLowerCase().includes(query)));
      return matchCategory && matchText;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'pantun':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'syair':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'gurindam':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-white">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 shadow-inner">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>Bank Soal & Kunci Jawaban</span>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-bold font-mono">
                    {QUESTION_BANK.length} Soal
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Materi Bahasa Indonesia Kelas 9: Pantun, Syair, dan Gurindam lengkap dengan pembahasan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  showAnswerKeys
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Beralih antara melihat kunci atau mode latihan mandiri"
              >
                {showAnswerKeys ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="hidden sm:inline">
                  {showAnswerKeys ? 'Kunci Ditampilkan' : 'Kunci Disembunyikan'}
                </span>
              </button>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search bar & Category filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari bait puisi, topik, kata kunci (misal: Raja Ali Haji, rima, suku kata)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-950/80 border border-slate-700/80 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question List View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm space-y-2">
              <Filter className="h-8 w-8 mx-auto text-slate-600" />
              <p>Tidak ada soal yang cocok dengan pencarianmu.</p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 sm:p-5 space-y-3 hover:border-slate-700 transition"
              >
                {/* Top tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 font-mono font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryColor(q.category)}`}>
                      {q.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Topik: <strong className="text-slate-300">{q.topic}</strong>
                    </span>
                  </div>

                  <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold">
                    Tingkat: {q.difficulty}
                  </span>
                </div>

                {/* Poem verse stanza if present */}
                {q.poemText && q.poemText.length > 0 && (
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 pl-4 border-l-4 border-l-indigo-500 font-serif italic text-slate-200 text-xs sm:text-sm space-y-1">
                    {q.poemText.map((line, lIdx) => (
                      <div key={lIdx} className="flex gap-2">
                        <span className="text-slate-500 select-none font-mono text-[11px]">{lIdx + 1}.</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Question Prompt */}
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {q.question}
                </h3>

                {/* Options A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isKey = oIdx === q.correctAnswer;
                    const letter = ['A', 'B', 'C', 'D'][oIdx];

                    return (
                      <div
                        key={oIdx}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs border transition ${
                          showAnswerKeys && isKey
                            ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200 ring-1 ring-emerald-500/30 font-medium'
                            : 'bg-slate-900/50 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black font-mono ${
                            showAnswerKeys && isKey
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="flex-1 pt-0.5 leading-snug">{opt}</span>
                        {showAnswerKeys && isKey && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {showAnswerKeys && (
                  <div className="rounded-xl bg-indigo-950/30 border border-indigo-900/40 p-3 text-xs leading-relaxed text-slate-300 mt-2">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-300 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Kunci: {['A', 'B', 'C', 'D'][q.correctAnswer]} &mdash; Pembahasan Kaidah Sastra:</span>
                    </div>
                    <p className="text-slate-300">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan {filteredQuestions.length} dari {QUESTION_BANK.length} soal</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
