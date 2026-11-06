import React from 'react';
import { Heart, Coins, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Volume2, VolumeX, Pause, Play, BookOpen, Shield, Magnet, Zap } from 'lucide-react';
import { PlayerStats } from '../types/game';

interface GameHUDProps {
  stats: PlayerStats;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onOpenGuide: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onSlide: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
  onOpenGuide,
  onMoveLeft,
  onMoveRight,
  onJump,
  onSlide,
}) => {
  const distanceInCurrentLap = stats.distance % stats.checkpointInterval;
  const progressPercent = Math.min(100, Math.floor((distanceInCurrentLap / stats.checkpointInterval) * 100));
  const metersLeft = Math.max(0, stats.nextCheckpointAt - stats.distance);

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top Bar: Stats, Lives, Controls */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: Score & Distance & Checkpoint Meter */}
        <div className="flex flex-col gap-2">
          {/* Main Score Board */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-slate-900/85 px-4 py-2 border border-slate-700/60 shadow-lg shadow-black/40">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Skor</div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono leading-none">
                {stats.score.toLocaleString('id-ID')}
              </div>
            </div>

            {stats.multiplier > 1 && (
              <span className="rounded-lg bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 text-xs font-black text-amber-300">
                {stats.multiplier}x
              </span>
            )}

            <div className="h-8 w-px bg-slate-700/60" />

            {/* Coins */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-inner shadow-amber-600">
                <Coins className="h-4 w-4" />
              </div>
              <span className="text-lg sm:text-xl font-black font-mono text-amber-300">
                {stats.coins}
              </span>
            </div>
          </div>

          {/* Checkpoint Distance Progress */}
          <div className="pointer-events-auto w-56 sm:w-72 rounded-xl bg-slate-900/85 px-3 py-2 border border-slate-700/60 shadow-md">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-sky-300 flex items-center gap-1">
                <span>Pos Puisi #{stats.checkpointsCleared + 1}</span>
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {metersLeft} m lagi
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-400 transition-all duration-150 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Lives, Distance Pill & Action Buttons */}
        <div className="flex flex-col items-end gap-2">
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Lives / Hearts */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-900/85 px-3 py-2 border border-slate-700/60 shadow-lg">
              {[0, 1, 2].map((idx) => (
                <Heart
                  key={idx}
                  className={`h-5 w-5 transition-transform duration-300 ${
                    idx < stats.lives
                      ? 'fill-rose-500 text-rose-500 scale-100'
                      : 'fill-slate-700 text-slate-600 scale-90'
                  }`}
                />
              ))}
            </div>

            {/* Guide Button */}
            <button
              onClick={onOpenGuide}
              title="Panduan Materi Pantun, Syair, Gurindam"
              className="flex h-10 items-center gap-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white px-3 font-semibold text-xs border border-indigo-400/30 transition shadow-md cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Materi Puisi</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/85 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700/60 shadow-md transition cursor-pointer"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
            </button>

            {/* Pause Toggle */}
            <button
              onClick={onTogglePause}
              title={isPaused ? 'Lanjutkan' : 'Jeda'}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/85 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700/60 shadow-md transition cursor-pointer"
            >
              {isPaused ? <Play className="h-4 w-4 text-amber-400" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>

          {/* Distance Run Metric */}
          <div className="pointer-events-auto rounded-xl bg-slate-900/80 px-3 py-1 border border-slate-800 text-xs font-mono text-slate-300 font-semibold shadow">
            Jarak: <span className="text-white font-bold">{stats.distance}</span> m
          </div>

          {/* Active Powerup Badges */}
          <div className="flex items-center gap-1.5">
            {stats.hasShield && (
              <div className="pointer-events-auto flex items-center gap-1 rounded-lg bg-sky-500/20 border border-sky-400/40 px-2 py-0.5 text-xs font-bold text-sky-300 shadow">
                <Shield className="h-3 w-3" /> Perisai
              </div>
            )}
            {stats.magnetTimeLeft > 0 && (
              <div className="pointer-events-auto flex items-center gap-1 rounded-lg bg-rose-500/20 border border-rose-400/40 px-2 py-0.5 text-xs font-bold text-rose-300 shadow">
                <Magnet className="h-3 w-3" /> Magnet ({Math.ceil(stats.magnetTimeLeft)}s)
              </div>
            )}
            {stats.doublePointsTimeLeft > 0 && (
              <div className="pointer-events-auto flex items-center gap-1 rounded-lg bg-purple-500/20 border border-purple-400/40 px-2 py-0.5 text-xs font-bold text-purple-300 shadow">
                <Zap className="h-3 w-3" /> 2X Skor ({Math.ceil(stats.doublePointsTimeLeft)}s)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Hint Overlay (Desktop) / Mobile Virtual Touch D-Pad (Touchscreens) */}
      <div className="pointer-events-none flex flex-col items-center gap-3">
        {/* Subtle desktop key guide */}
        <div className="hidden md:flex items-center gap-3 rounded-full bg-slate-950/70 border border-slate-800 px-4 py-1 text-[11px] text-slate-400">
          <span><kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-200 font-mono">A / ←</kbd> Kiri</span>
          <span><kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-200 font-mono">D / →</kbd> Kanan</span>
          <span><kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-200 font-mono">W / ↑ / Spasi</kbd> Lompat</span>
          <span><kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-200 font-mono">S / ↓</kbd> Menunduk/Roll</span>
        </div>

        {/* Unified Bottom Control Dock for Mobile / Touch Devices */}
        <div className="pointer-events-auto flex w-full max-w-sm justify-between gap-4 pb-2 md:hidden">
          {/* Left / Right buttons */}
          <div className="flex gap-2">
            <button
              onClick={onMoveLeft}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/90 active:bg-sky-600 text-white border border-slate-700 shadow-xl active:scale-95 transition"
              aria-label="Geser Kiri"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={onMoveRight}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/90 active:bg-sky-600 text-white border border-slate-700 shadow-xl active:scale-95 transition"
              aria-label="Geser Kanan"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>

          {/* Jump / Slide buttons */}
          <div className="flex gap-2">
            <button
              onClick={onJump}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/90 active:bg-amber-600 text-slate-950 font-black border border-amber-300 shadow-xl active:scale-95 transition"
              aria-label="Lompat"
            >
              <ArrowUp className="h-6 w-6" />
            </button>
            <button
              onClick={onSlide}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/90 active:bg-indigo-700 text-white border border-indigo-400 shadow-xl active:scale-95 transition"
              aria-label="Meluncur / Nunduk"
            >
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
