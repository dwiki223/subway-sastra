import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Crown, Sparkles, User, LogIn, LogOut, Flame, Compass, Coins, CheckCircle2 } from 'lucide-react';
import { LeaderboardRecord, subscribeToLeaderboard, signInWithGoogle, logOut, auth } from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayerName: string;
  onUpdatePlayerName: (name: string) => void;
  latestScore?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentPlayerName,
  onUpdatePlayerName,
  latestScore,
}) => {
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(currentPlayerName);
  const [sortBy, setSortBy] = useState<'score' | 'distance'>('score');

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.displayName && !currentPlayerName) {
        onUpdatePlayerName(user.displayName);
        setTempName(user.displayName);
      }
    });
    return () => unsub();
  }, []);

  // Listen to Firestore real-time leaderboard
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    const unsub = subscribeToLeaderboard((data) => {
      setRecords(data);
      setIsLoading(false);
    }, 50);

    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const sortedRecords = [...records].sort((a, b) => {
    if (sortBy === 'distance') {
      return (b.distance || 0) - (a.distance || 0);
    }
    return (b.score || 0) - (a.score || 0);
  });

  const handleSaveName = () => {
    const clean = tempName.trim().slice(0, 32);
    if (clean) {
      onUpdatePlayerName(clean);
    }
    setEditingName(false);
  };

  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    if (user && user.displayName) {
      onUpdatePlayerName(user.displayName);
      setTempName(user.displayName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-white">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>Papan Peringkat Global</span>
                  <span className="flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Cloud
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Skor tertinggi pelari sastra dari seluruh Indonesia
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User profile & Login status bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 p-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Nama Pemain Kamu:</div>
                {editingName ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="text"
                      value={tempName}
                      maxLength={32}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Masukkan namamu..."
                      className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleSaveName}
                      className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{currentPlayerName || 'Pelari Tamu'}</span>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                    >
                      (Ganti)
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 hidden sm:inline">{currentUser.displayName || currentUser.email}</span>
                  <button
                    onClick={logOut}
                    className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 px-2.5 py-1.5 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 px-3 py-1.5 text-xs font-bold transition shadow cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Masuk Akun Google</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setSortBy('score')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                sortBy === 'score'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Berdasarkan Skor Tertinggi</span>
            </button>

            <button
              onClick={() => setSortBy('distance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                sortBy === 'distance'
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Berdasarkan Jarak Terjauh</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-800">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Sparkles className="h-8 w-8 mx-auto text-amber-400 animate-spin" />
              <p className="text-xs">Memuat peringkat global dari Firestore...</p>
            </div>
          ) : sortedRecords.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Trophy className="h-10 w-10 mx-auto text-slate-600" />
              <p className="text-sm font-bold text-white">Belum Ada Skor di Papan Peringkat</p>
              <p className="text-xs text-slate-400">Jadilah pelari pertama yang mencetak rekor skor di papan peringkat global!</p>
            </div>
          ) : (
            sortedRecords.map((item, idx) => {
              const isTop1 = idx === 0;
              const isTop2 = idx === 1;
              const isTop3 = idx === 2;
              const isCurrentPlayer = item.playerName.toLowerCase() === currentPlayerName.toLowerCase();

              return (
                <div
                  key={item.id || idx}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl transition ${
                    isCurrentPlayer
                      ? 'bg-indigo-950/60 border border-indigo-500/50 shadow-md'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Left: Rank & Player info */}
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center font-black font-mono text-sm rounded-xl shadow-md">
                      {isTop1 ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 text-slate-950 shadow-amber-500/30">
                          <Crown className="h-5 w-5 fill-slate-950" />
                        </div>
                      ) : isTop2 ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950">
                          <Medal className="h-5 w-5" />
                        </div>
                      ) : isTop3 ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white">
                          <Medal className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 font-bold">
                          #{idx + 1}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-white">
                          {item.playerName}
                        </span>
                        {isCurrentPlayer && (
                          <span className="rounded-md bg-indigo-500/30 border border-indigo-400/40 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300">
                            Kamu
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 text-sky-300">
                          <Compass className="h-3 w-3" /> {item.distance}m
                        </span>
                        <span className="flex items-center gap-1 text-amber-300">
                          <Coins className="h-3 w-3" /> {item.coins}
                        </span>
                        {item.correctAnswers !== undefined && (
                          <span className="flex items-center gap-1 text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" /> {item.correctAnswers} Puisi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Score */}
                  <div className="text-right">
                    <div className="text-base sm:text-xl font-black font-mono text-amber-400 leading-none">
                      {item.score?.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500 mt-1">
                      Poin Skor
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan 50 Peringkat Teratas Global</span>
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
