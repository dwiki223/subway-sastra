import React from 'react';
import { X, Check, Lock, Coins, Sparkles } from 'lucide-react';
import { OUTFIT_OPTIONS } from '../data/indonesianQuestions';

interface SkinSelectorModalProps {
  isOpen: boolean;
  currentSkin: string;
  unlockedSkins: string[];
  coins: number;
  onSelectSkin: (skinId: string) => void;
  onUnlockSkin: (skinId: string, cost: number) => void;
  onClose: () => void;
}

export const SkinSelectorModal: React.FC<SkinSelectorModalProps> = ({
  isOpen,
  currentSkin,
  unlockedSkins,
  coins,
  onSelectSkin,
  onUnlockSkin,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-5 sm:p-7 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Koleksi Kostum Pelari</h2>
              <p className="text-xs text-slate-400">Pilih penampilan jagoan sastramu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Coin Balance Badge */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-950/70 border border-slate-800 p-3 mb-4 text-xs font-semibold">
          <span className="text-slate-400">Koin Kamu:</span>
          <div className="flex items-center gap-1.5 font-mono text-amber-300 font-bold text-sm">
            <Coins className="h-4 w-4 text-amber-400" />
            <span>{coins} Koin</span>
          </div>
        </div>

        {/* Outfit List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {OUTFIT_OPTIONS.map((outfit) => {
            const isUnlocked = unlockedSkins.includes(outfit.id) || outfit.cost === 0;
            const isSelected = currentSkin === outfit.id;
            const canAfford = coins >= outfit.cost;

            return (
              <div
                key={outfit.id}
                className={`flex flex-col justify-between rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">{outfit.name}</span>
                    {/* Color Swatch Preview */}
                    <div className="flex -space-x-1">
                      <div className="h-4 w-4 rounded-full border border-slate-900" style={{ backgroundColor: outfit.shirtColor }} />
                      <div className="h-4 w-4 rounded-full border border-slate-900" style={{ backgroundColor: outfit.pantsColor }} />
                      <div className="h-4 w-4 rounded-full border border-slate-900" style={{ backgroundColor: outfit.accentColor }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug mb-3">
                    {outfit.description}
                  </p>
                </div>

                {isUnlocked ? (
                  <button
                    disabled={isSelected}
                    onClick={() => onSelectSkin(outfit.id)}
                    className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Dipakai
                      </>
                    ) : (
                      'Pilih Kostum'
                    )}
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => onUnlockSkin(outfit.id, outfit.cost)}
                    className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition cursor-pointer ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Buka ({outfit.cost} Koin)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-6 transition cursor-pointer text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
