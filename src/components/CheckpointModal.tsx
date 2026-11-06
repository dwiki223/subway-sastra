import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Question } from '../types/game';
import { CheckCircle2, XCircle, Clock, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface CheckpointModalProps {
  checkpointIndex: number;
  distance: number;
  question: Question;
  livesRemaining: number;
  onAnswer: (isCorrect: boolean, selectedIdx: number) => void;
  onResumeGame: () => void;
}

export const CheckpointModal: React.FC<CheckpointModalProps> = ({
  checkpointIndex,
  distance,
  question,
  livesRemaining,
  onAnswer,
  onResumeGame,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25);

  const isCorrect = selectedOption !== null && selectedOption === question.correctAnswer;

  // Sound alert on open
  useEffect(() => {
    sound.playCheckpointAlert();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (hasAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up: treat as wrong answer
          handleSelect(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasAnswered]);

  // Keyboard shortcut listener (1, 2, 3, 4, Space/Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasAnswered) {
        if (['Digit1', 'Numpad1'].includes(e.code) && question.options[0]) handleSelect(0);
        if (['Digit2', 'Numpad2'].includes(e.code) && question.options[1]) handleSelect(1);
        if (['Digit3', 'Numpad3'].includes(e.code) && question.options[2]) handleSelect(2);
        if (['Digit4', 'Numpad4'].includes(e.code) && question.options[3]) handleSelect(3);
      } else {
        if (['Space', 'Enter'].includes(e.code)) {
          e.preventDefault();
          onResumeGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, selectedOption]);

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const correct = idx === question.correctAnswer;
    if (correct) {
      sound.playCorrect();
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      sound.playWrong();
    }

    onAnswer(correct, idx);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 p-5 sm:p-7 shadow-2xl shadow-indigo-950/50 flex flex-col gap-5 overflow-hidden">
        {/* Top Decorative Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-sm">
              #{checkpointIndex}
            </span>
            <div>
              <div className="text-xs font-semibold text-slate-400">CHECKPOINT {distance} METER</div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>Pos Kuis Puisi Rakyat</span>
                <span className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-bold ${getCategoryBadgeColor(question.category)}`}>
                  {question.category}
                </span>
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          {!hasAnswered && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold border transition-colors ${
              timeLeft <= 5
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              <Clock className="h-3.5 w-3.5" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Time Progress Bar */}
        {!hasAnswered && (
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden -mt-2">
            <div
              className={`h-full transition-all duration-1000 linear ${
                timeLeft <= 5 ? 'bg-rose-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${(timeLeft / 25) * 100}%` }}
            />
          </div>
        )}

        {/* The Poem Text Box (if provided) */}
        {question.poemText && question.poemText.length > 0 && (
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-4 border border-slate-800 shadow-inner">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-indigo-400" />
              <span>Bait Puisi Rakyat:</span>
            </div>
            <div className="space-y-1 font-serif text-slate-100 text-sm sm:text-base italic leading-relaxed pl-3 border-l-2 border-indigo-500">
              {question.poemText.map((line, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-xs text-slate-500 font-mono select-none w-4">{idx + 1}.</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The Question Prompt */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
            {question.question}
          </h3>
          <div className="text-xs text-slate-400 mt-0.5">Topik: {question.topic}</div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {question.options.map((opt, idx) => {
            let optionStyles = 'bg-slate-800/80 hover:bg-slate-750 text-slate-200 border-slate-700';

            if (hasAnswered) {
              if (idx === question.correctAnswer) {
                optionStyles = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
              } else if (idx === selectedOption) {
                optionStyles = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                optionStyles = 'opacity-40 bg-slate-800/40 border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={`group flex items-start gap-3 rounded-2xl p-3 sm:p-3.5 text-left text-xs sm:text-sm font-medium border transition-all cursor-pointer ${optionStyles}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black font-mono transition ${
                  hasAnswered && idx === question.correctAnswer
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : hasAnswered && idx === selectedOption
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-700 text-slate-200 group-hover:bg-indigo-600 group-hover:text-white'
                }`}>
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                <span className="flex-1 pt-0.5 leading-snug">{opt}</span>

                {hasAnswered && idx === question.correctAnswer && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {hasAnswered && idx === selectedOption && idx !== question.correctAnswer && (
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation Card */}
        {hasAnswered && (
          <div className={`rounded-2xl p-4 border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
            isCorrect
              ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200'
              : 'bg-rose-950/60 border-rose-600/50 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-black text-sm mb-1">
              {isCorrect ? (
                <>
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>JAWABAN BENAR! (+500 Skor & Sprint Boost)</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <span>
                    {selectedOption === -1 ? 'WAKTU HABIS!' : 'KURANG TEPAT!'}
                    {livesRemaining > 1 ? ` (Tersisa ${livesRemaining - 1} Nyawa)` : ' (Game Over)'}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Pembahasan: </strong>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Action Button: Continue Running */}
        {hasAnswered && (
          <button
            onClick={onResumeGame}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold py-3.5 px-4 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <span>{livesRemaining <= 1 && !isCorrect ? 'Lihat Hasil Akhir' : 'Lanjut Berlari!'}</span>
            <ArrowRight className="h-4 w-4" />
            <kbd className="hidden sm:inline-block ml-2 rounded bg-indigo-800/80 px-2 py-0.5 text-[11px] font-mono text-indigo-200">
              Spasi / Enter
            </kbd>
          </button>
        )}
      </div>
    </div>
  );
};
