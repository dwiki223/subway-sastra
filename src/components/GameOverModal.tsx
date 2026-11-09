import React, { useState } from 'react';
import { PlayerStats, AnswerHistory } from '../types/game';
import { RotateCcw, Trophy, Coins, Compass, CheckCircle2, XCircle, BookOpen, ChevronDown, ChevronUp, Palette } from 'lucide-react';

interface GameOverModalProps {
  stats: PlayerStats;
  history: AnswerHistory[];
  onRestart: () => void;
  onOpenSkins: () => void;
  onOpenGuide: () => void;
  onOpenQuestionBank?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  history,
  onRestart,
  onOpenSkins,
  onOpenGuide,
  onOpenQuestionBank,
}) => {
  const [showReview, setShowReview] = useState<boolean>(false);
  const accuracy = stats.totalQuestionsAnswered > 0
    ? Math.round((stats.correctAnswersCount / stats.totalQuestionsAnswered) * 100)
    : 0;

  const isNewHighScore = stats.score > stats.highScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 p-5 sm:p-7 shadow-2xl flex flex-col gap-5 text-white">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs font-black tracking-wider text-rose-300 uppercase">
            Permainan Selesai
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Pelari Hebat!
          </h2>
          <p className="text-xs text-slate-400">
            Perjalanan literasi puisimu sungguh membanggakan.
          </p>
        </div>

        {/* High Score Badge */}
        {isNewHighScore && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 p-2.5 text-amber-300 text-xs font-bold animate-bounce">
            <Trophy className="h-4 w-4" />
            <span>REKOR BARU TERTINGGI TERCAPAI!</span>
          </div>
        )}

        {/* Score Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/60 text-center">
            <div className="text-[11px] font-semibold text-slate-400">Total Skor</div>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              {stats.score.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/60 text-center">
            <div className="text-[11px] font-semibold text-slate-400">Jarak Lari</div>
            <div className="text-xl font-black text-sky-400 font-mono mt-0.5">
              {stats.distance} <span className="text-xs font-normal">m</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/60 text-center">
            <div className="text-[11px] font-semibold text-slate-400">Koin Kumpul</div>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5 flex items-center justify-center gap-1">
              <Coins className="h-4 w-4" /> {stats.coins}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700/60 text-center">
            <div className="text-[11px] font-semibold text-slate-400">Akurasi Kuis</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Checkpoint Statistics & Speed Milestone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-indigo-400" />
              <span className="text-slate-300">Pos Kuis:</span>
            </div>
            <span className="font-bold text-white font-mono">
              {stats.correctAnswersCount} / {stats.totalQuestionsAnswered} Pos Tuntas
            </span>
          </div>

          <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">⚡</span>
              <span className="text-slate-300">Tingkat Kecepatan:</span>
            </div>
            <span className="font-bold text-amber-300 font-mono">
              {stats.speedMultiplier}x (Tahap {stats.speedStage})
            </span>
          </div>
        </div>

        {/* Questions Review Accordion */}
        {history.length > 0 && (
          <div className="rounded-2xl bg-slate-950/60 border border-slate-800 overflow-hidden">
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <span>Ulas Pembahasan Soal yang Dilewati ({history.length} Soal)</span>
              </div>
              {showReview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showReview && (
              <div className="p-3.5 pt-0 space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-800">
                {history.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300">
                        Pos #{idx + 1} ({item.checkpointDistance} m) - {item.question.category.toUpperCase()}
                      </span>
                      {item.isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Benar
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                          <XCircle className="h-3.5 w-3.5" /> Salah
                        </span>
                      )}
                    </div>

                    {item.question.poemText && (
                      <div className="font-serif italic text-slate-300 pl-2 border-l border-slate-700 text-[11px]">
                        {item.question.poemText.join(' / ')}
                      </div>
                    )}

                    <div className="text-slate-200 font-medium">
                      {item.question.question}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Jawabanmu: <span className={item.isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>
                        {item.selectedOption >= 0 ? item.question.options[item.selectedOption] : 'Waktu Habis'}
                      </span>
                    </div>

                    {!item.isCorrect && (
                      <div className="text-[11px] text-emerald-300 font-semibold">
                        Kunci Jawaban: {item.question.options[item.question.correctAnswer]}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <strong className="text-slate-300">Pembahasan: </strong>
                      {item.question.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold py-3.5 px-4 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Main Lagi</span>
          </button>

          {onOpenQuestionBank && (
            <button
              onClick={onOpenQuestionBank}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 border border-emerald-400/40 shadow-md transition cursor-pointer text-xs"
            >
              <BookOpen className="h-4 w-4" />
              <span>Semua Kunci Jawaban</span>
            </button>
          )}

          <button
            onClick={onOpenSkins}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold py-3.5 px-4 border border-slate-700 transition cursor-pointer text-xs"
          >
            <Palette className="h-4 w-4 text-amber-400" />
            <span>Kostum</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold py-3.5 px-4 border border-slate-700 transition cursor-pointer text-xs"
          >
            <BookOpen className="h-4 w-4 text-sky-400" />
            <span>Materi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
