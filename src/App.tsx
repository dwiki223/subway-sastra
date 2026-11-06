/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, BookOpen, Palette, Trophy, Sparkles, Volume2, VolumeX, Shield, Zap, Info } from 'lucide-react';
import { SubwayEngine } from './game/threeEngine';
import { GameHUD } from './components/GameHUD';
import { CheckpointModal } from './components/CheckpointModal';
import { GuideModal } from './components/GuideModal';
import { GameOverModal } from './components/GameOverModal';
import { SkinSelectorModal } from './components/SkinSelectorModal';
import { QUESTION_BANK, OUTFIT_OPTIONS, shuffleQuestion } from './data/indonesianQuestions';
import { GameState, PlayerStats, Question, AnswerHistory } from './types/game';
import { sound } from './utils/audio';

const STORAGE_KEY_HIGHSCORE = 'subway_sastra_highscore';
const STORAGE_KEY_COINS = 'subway_sastra_coins';
const STORAGE_KEY_SKIN = 'subway_sastra_skin';
const STORAGE_KEY_UNLOCKED_SKINS = 'subway_sastra_unlocked_skins';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SubwayEngine | null>(null);

  // High score & persistent savings
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem(STORAGE_KEY_HIGHSCORE) || '0');
  });
  const [totalCoins, setTotalCoins] = useState<number>(() => {
    return Number(localStorage.getItem(STORAGE_KEY_COINS) || '0');
  });
  const [currentSkin, setCurrentSkin] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_SKIN) || 'smp';
  });
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED_SKINS);
      return saved ? JSON.parse(saved) : ['smp'];
    } catch {
      return ['smp'];
    }
  });

  // Checkpoint settings
  const [checkpointInterval, setCheckpointInterval] = useState<number>(100);

  // Game state
  const [gameState, setGameState] = useState<GameState>('start');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Current Question at checkpoint
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSkinsOpen, setIsSkinsOpen] = useState<boolean>(false);

  // In-game stats
  const [stats, setStats] = useState<PlayerStats>({
    score: 0,
    highScore: highScore,
    distance: 0,
    coins: 0,
    lives: 3,
    checkpointInterval: 100,
    nextCheckpointAt: 100,
    checkpointsCleared: 0,
    correctAnswersCount: 0,
    totalQuestionsAnswered: 0,
    speed: 16,
    multiplier: 1,
    hasShield: false,
    magnetTimeLeft: 0,
    doublePointsTimeLeft: 0,
  });

  // Track latest stats in ref for callback access
  const statsRef = useRef(stats);
  statsRef.current = stats;

  // Initialize Three.js Engine once on mount
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new SubwayEngine(canvasMountRef.current, {
      onCheckpointReached: (distance) => {
        handleReachCheckpoint(distance);
      },
      onCoinCollected: (count) => {
        sound.playCoin();
        setStats((prev) => {
          const mult = prev.doublePointsTimeLeft > 0 ? 2 : 1;
          const addedCoins = count;
          const addedScore = 50 * mult * count;
          return {
            ...prev,
            coins: prev.coins + addedCoins,
            score: prev.score + addedScore,
          };
        });
      },
      onHitObstacle: () => {
        sound.playCrash();
        setStats((prev) => {
          if (prev.hasShield) {
            return { ...prev, hasShield: false };
          }
          const nextLives = prev.lives - 1;
          if (nextLives <= 0) {
            handleGameOver();
          }
          return { ...prev, lives: Math.max(0, nextLives) };
        });
      },
      onDistanceUpdate: (meters) => {
        setStats((prev) => {
          const mult = prev.doublePointsTimeLeft > 0 ? 2 : 1;
          const scoreInc = Math.floor(meters * 2 * mult);
          return {
            ...prev,
            distance: meters,
            score: Math.max(prev.score, scoreInc + prev.coins * 50),
          };
        });
      },
      onPowerupCollected: (type) => {
        sound.playPowerup();
        setStats((prev) => {
          if (type === 'shield') return { ...prev, hasShield: true };
          if (type === 'magnet') return { ...prev, magnetTimeLeft: 12 };
          if (type === 'double') return { ...prev, doublePointsTimeLeft: 15, multiplier: 2 };
          return prev;
        });
      },
      onGameOver: () => {
        handleGameOver();
      },
    });

    engineRef.current = engine;

    // Apply current outfit
    const outfit = OUTFIT_OPTIONS.find((o) => o.id === currentSkin);
    if (outfit) {
      engine.setOutfit(outfit);
    }

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Sync outfit changes to engine
  useEffect(() => {
    if (engineRef.current) {
      const outfit = OUTFIT_OPTIONS.find((o) => o.id === currentSkin);
      if (outfit) {
        engineRef.current.setOutfit(outfit);
      }
    }
  }, [currentSkin]);

  // Update powerup state countdown in React
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const interval = setInterval(() => {
      setStats((prev) => {
        const nextMagnet = Math.max(0, prev.magnetTimeLeft - 0.2);
        const nextDouble = Math.max(0, prev.doublePointsTimeLeft - 0.2);
        return {
          ...prev,
          magnetTimeLeft: nextMagnet,
          doublePointsTimeLeft: nextDouble,
          multiplier: nextDouble > 0 ? 2 : 1,
        };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [gameState, isPaused]);

  // Start a new run
  const handleStartGame = () => {
    // Shuffle questions and randomize their option order
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5).map((q) => shuffleQuestion(q));
    setQuestionPool(shuffled);
    setAnswerHistory([]);

    const initialStats: PlayerStats = {
      score: 0,
      highScore: highScore,
      distance: 0,
      coins: 0,
      lives: 3,
      checkpointInterval: checkpointInterval,
      nextCheckpointAt: checkpointInterval,
      checkpointsCleared: 0,
      correctAnswersCount: 0,
      totalQuestionsAnswered: 0,
      speed: 16,
      multiplier: 1,
      hasShield: false,
      magnetTimeLeft: 0,
      doublePointsTimeLeft: 0,
    };
    setStats(initialStats);
    setGameState('playing');
    setIsPaused(false);

    if (engineRef.current) {
      engineRef.current.start(checkpointInterval);
    }

    if (!isMuted) {
      sound.startBgm();
    }
  };

  // Triggered when runner reaches checkpoint gate
  const handleReachCheckpoint = (distance: number) => {
    setGameState('checkpoint');

    // Pick next question from pool and ensure fresh shuffle of options
    setQuestionPool((prev) => {
      let nextPool = [...prev];
      if (nextPool.length === 0) {
        nextPool = [...QUESTION_BANK].sort(() => Math.random() - 0.5).map((q) => shuffleQuestion(q));
      }
      const rawQ = nextPool.shift() || QUESTION_BANK[0];
      const randomizedQ = shuffleQuestion(rawQ);
      setCurrentQuestion(randomizedQ);
      return nextPool;
    });
  };

  // Called when player selects an option in the quiz modal
  const handleAnswerQuestion = (isCorrect: boolean, selectedIdx: number) => {
    if (!currentQuestion) return;

    // Record in history
    setAnswerHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedOption: selectedIdx,
        isCorrect,
        checkpointDistance: statsRef.current.distance,
      },
    ]);

    setStats((prev) => {
      const nextCorrect = isCorrect ? prev.correctAnswersCount + 1 : prev.correctAnswersCount;
      const nextTotal = prev.totalQuestionsAnswered + 1;
      const nextScore = isCorrect ? prev.score + 500 : prev.score;
      const nextCoins = isCorrect ? prev.coins + 15 : prev.coins;
      const nextLives = isCorrect ? prev.lives : prev.lives - 1;

      return {
        ...prev,
        score: nextScore,
        coins: nextCoins,
        lives: Math.max(0, nextLives),
        correctAnswersCount: nextCorrect,
        totalQuestionsAnswered: nextTotal,
        checkpointsCleared: isCorrect ? prev.checkpointsCleared + 1 : prev.checkpointsCleared,
      };
    });
  };

  // Resume running after question explanation
  const handleResumeAfterCheckpoint = () => {
    const currentLives = statsRef.current.lives;
    const lastHistory = answerHistory[answerHistory.length - 1];
    const wasCorrect = lastHistory ? lastHistory.isCorrect : true;

    if (currentLives <= 0) {
      handleGameOver();
      return;
    }

    setGameState('playing');
    setCurrentQuestion(null);

    if (engineRef.current) {
      engineRef.current.onCheckpointAnswered(wasCorrect);
      setStats((prev) => ({
        ...prev,
        nextCheckpointAt: prev.distance + prev.checkpointInterval,
      }));
    }
  };

  // Game over handler
  const handleGameOver = () => {
    setGameState('gameover');
    sound.pauseBgm();

    const currentScore = statsRef.current.score;
    const currentCoinsGained = statsRef.current.coins;

    // Save high score
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem(STORAGE_KEY_HIGHSCORE, String(currentScore));
    }

    // Save total coins
    const updatedCoins = totalCoins + currentCoinsGained;
    setTotalCoins(updatedCoins);
    localStorage.setItem(STORAGE_KEY_COINS, String(updatedCoins));
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  // Toggle Pause
  const handleTogglePause = () => {
    if (gameState !== 'playing') return;
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    if (engineRef.current) {
      if (nextPaused) {
        engineRef.current.pause();
        sound.pauseBgm();
      } else {
        engineRef.current.resume();
        if (!isMuted) sound.startBgm();
      }
    }
  };

  // Skin unlock & selection
  const handleSelectSkin = (skinId: string) => {
    setCurrentSkin(skinId);
    localStorage.setItem(STORAGE_KEY_SKIN, skinId);
  };

  const handleUnlockSkin = (skinId: string, cost: number) => {
    if (totalCoins < cost) return;
    const newCoins = totalCoins - cost;
    setTotalCoins(newCoins);
    localStorage.setItem(STORAGE_KEY_COINS, String(newCoins));

    const updated = [...unlockedSkins, skinId];
    setUnlockedSkins(updated);
    localStorage.setItem(STORAGE_KEY_UNLOCKED_SKINS, JSON.stringify(updated));

    setCurrentSkin(skinId);
    localStorage.setItem(STORAGE_KEY_SKIN, skinId);
    sound.playPowerup();
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={canvasMountRef} className="absolute inset-0 z-0 h-full w-full" />

      {/* Start / Lobby Screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/90 backdrop-blur-xs">
          {/* Top Branding & Highscore */}
          <div className="flex w-full max-w-4xl items-center justify-between pt-2">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900/80 border border-slate-700/60 px-3.5 py-2 shadow-md">
              <Trophy className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rekor Terbaik</div>
                <div className="font-mono font-black text-white text-sm">{highScore.toLocaleString('id-ID')}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 shadow-md transition cursor-pointer"
                title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
              >
                {isMuted ? <VolumeX className="h-5 w-5 text-rose-400" /> : <Volume2 className="h-5 w-5 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Center Title Card & Game Setup */}
          <div className="flex flex-col items-center text-center max-w-xl space-y-4 px-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-4 py-1.5 text-xs font-black tracking-widest text-indigo-300 uppercase shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Bahasa Indonesia Kelas 9</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md leading-none">
              SUBWAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-400">SASTRA 3D</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-md font-medium leading-relaxed">
              Berlari di lintasan 3D tanpa henti! Hadapi checkpoint soal seru tentang <strong className="text-amber-300">Pantun</strong>, <strong className="text-purple-300">Syair</strong>, dan <strong className="text-sky-300">Gurindam</strong> agar dapat terus melaju!
            </p>

            {/* Checkpoint Distance Interval Selector */}
            <div className="w-full max-w-md rounded-2xl bg-slate-900/85 p-3.5 border border-slate-700/70 shadow-lg">
              <div className="text-xs font-bold text-slate-300 mb-2.5 flex items-center justify-center gap-1.5">
                <span>Frekuensi Checkpoint Soal:</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { dist: 150, label: 'Santai (150m)' },
                  { dist: 100, label: 'Standar (100m)' },
                  { dist: 75, label: 'Ujian (75m)' },
                ].map((item) => (
                  <button
                    key={item.dist}
                    onClick={() => setCheckpointInterval(item.dist)}
                    className={`rounded-xl py-2 px-2 text-xs font-bold transition cursor-pointer border ${
                      checkpointInterval === item.dist
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={handleStartGame}
              className="group relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 active:scale-95 text-slate-950 font-black text-lg sm:text-xl py-4 px-10 shadow-xl shadow-amber-500/20 transition cursor-pointer"
            >
              <Play className="h-6 w-6 fill-slate-950" />
              <span>MULAI BERLARI</span>
            </button>
          </div>

          {/* Bottom Dock Menu (Materials & Skins) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pb-3">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 px-4 border border-slate-700/70 shadow-md transition cursor-pointer"
            >
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>Buku Materi Puisi Rakyat</span>
            </button>

            <button
              onClick={() => setIsSkinsOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 px-4 border border-slate-700/70 shadow-md transition cursor-pointer"
            >
              <Palette className="h-4 w-4 text-amber-400" />
              <span>Kostum & Koin ({totalCoins})</span>
            </button>
          </div>
        </div>
      )}

      {/* Active In-Game HUD */}
      {gameState === 'playing' && (
        <GameHUD
          stats={stats}
          isMuted={isMuted}
          isPaused={isPaused}
          onToggleMute={handleToggleMute}
          onTogglePause={handleTogglePause}
          onOpenGuide={() => {
            setIsPaused(true);
            if (engineRef.current) engineRef.current.pause();
            setIsGuideOpen(true);
          }}
          onMoveLeft={() => engineRef.current?.moveLeft()}
          onMoveRight={() => engineRef.current?.moveRight()}
          onJump={() => engineRef.current?.jump()}
          onSlide={() => engineRef.current?.slide()}
        />
      )}

      {/* Pause Modal Overlay */}
      {gameState === 'playing' && isPaused && !isGuideOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-xl font-black text-white">Permainan Dijeda</h3>
            <p className="text-xs text-slate-300">Tarik napas sejenak sebelum melanjutkan tantangan sastra!</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleTogglePause}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 transition cursor-pointer"
              >
                Lanjutkan
              </button>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="w-full rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold py-2.5 border border-slate-700 transition cursor-pointer text-xs"
              >
                Buka Materi Puisi
              </button>
              <button
                onClick={() => {
                  setGameState('start');
                  sound.pauseBgm();
                  if (engineRef.current) engineRef.current.pause();
                }}
                className="w-full rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-300 font-semibold py-2.5 border border-slate-700 transition cursor-pointer text-xs"
              >
                Keluar ke Menu Utama
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkpoint Quiz Modal */}
      {gameState === 'checkpoint' && currentQuestion && (
        <CheckpointModal
          checkpointIndex={stats.checkpointsCleared + 1}
          distance={stats.distance}
          question={currentQuestion}
          livesRemaining={stats.lives}
          onAnswer={handleAnswerQuestion}
          onResumeGame={handleResumeAfterCheckpoint}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          stats={stats}
          history={answerHistory}
          onRestart={handleStartGame}
          onOpenSkins={() => setIsSkinsOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
      )}

      {/* Educational Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => {
          setIsGuideOpen(false);
          if (gameState === 'playing' && isPaused) {
            handleTogglePause();
          }
        }}
      />

      {/* Skin & Outfit Selector Modal */}
      <SkinSelectorModal
        isOpen={isSkinsOpen}
        currentSkin={currentSkin}
        unlockedSkins={unlockedSkins}
        coins={totalCoins}
        onSelectSkin={handleSelectSkin}
        onUnlockSkin={handleUnlockSkin}
        onClose={() => setIsSkinsOpen(false)}
      />
    </main>
  );
}
