import React from 'react';
import { X, BookOpen, Check, Feather, ShieldAlert, Award } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 p-5 sm:p-7 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Panduan Materi Puisi Rakyat (Kelas 9)</h2>
              <p className="text-xs text-slate-400">Ringkasan cepat materi Pantun, Syair, dan Gurindam</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 font-bold text-white">
                <th className="p-3">Karakteristik</th>
                <th className="p-3 text-amber-300">Pantun</th>
                <th className="p-3 text-purple-300">Syair</th>
                <th className="p-3 text-sky-300">Gurindam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="p-3 font-semibold text-slate-400">Jumlah Baris</td>
                <td className="p-3 font-bold text-amber-200">4 baris / bait</td>
                <td className="p-3 font-bold text-purple-200">4 baris / bait</td>
                <td className="p-3 font-bold text-sky-200">2 baris / bait</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Pola Rima (Sajak)</td>
                <td className="p-3 font-mono font-bold text-amber-200">a - b - a - b</td>
                <td className="p-3 font-mono font-bold text-purple-200">a - a - a - a</td>
                <td className="p-3 font-mono font-bold text-sky-200">a - a</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Struktur Baris</td>
                <td className="p-3 text-xs leading-relaxed">
                  Baris 1-2: <strong>Sampiran</strong><br />
                  Baris 3-4: <strong>Isi</strong>
                </td>
                <td className="p-3 text-xs leading-relaxed">
                  Semua baris adalah <strong>Isi</strong> (tidak ada sampiran)
                </td>
                <td className="p-3 text-xs leading-relaxed">
                  Baris 1: <strong>Sebab / Syarat</strong><br />
                  Baris 2: <strong>Akibat / Jawaban</strong>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Suku Kata</td>
                <td className="p-3 text-xs">8 – 12 suku kata</td>
                <td className="p-3 text-xs">8 – 14 suku kata</td>
                <td className="p-3 text-xs">10 – 14 suku kata</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Fokus Isi</td>
                <td className="p-3 text-xs">Nasihat, jenaka, teka-teki, muda-mudi</td>
                <td className="p-3 text-xs">Kiasan bertutur, petuah agama, cerita panjang</td>
                <td className="p-3 text-xs">Falsafah hidup, budi pekerti, peringatan moral</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Pantun */}
          <div className="rounded-2xl bg-amber-950/20 border border-amber-500/30 p-4">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5 mb-1.5">
              <Feather className="h-4 w-4" /> 1. Pantun (Puisi Asli Nusantara)
            </h3>
            <p className="text-slate-300 leading-relaxed mb-2">
              Berasal dari kata Minangkabau <em>patuntun</em> (penuntun). Baris 1-2 berfungsi menyiapkan rima dan irama (sampiran), sedangkan pesan utama terletak pada baris 3-4.
            </p>
            <div className="rounded-xl bg-slate-950/70 p-3 font-serif italic text-amber-100 text-xs border border-amber-900/40">
              "Berakit-rakit ke hulu, berenang-renang ke tepian. (Sampiran)<br />
              Bersakit-sakit dahulu, bersenang-senang kemudian." (Isi)
            </div>
          </div>

          {/* Syair */}
          <div className="rounded-2xl bg-purple-950/20 border border-purple-500/30 p-4">
            <h3 className="font-bold text-purple-300 text-sm flex items-center gap-1.5 mb-1.5">
              <Award className="h-4 w-4" /> 2. Syair (Puisi Bersajak Terus a-a-a-a)
            </h3>
            <p className="text-slate-300 leading-relaxed mb-2">
              Berasal dari bahasa Arab <em>syi'ir/syu'ur</em> (perasaan). Tidak memiliki sampiran; keempat barisnya merupakan untaian cerita berkesinambungan dengan bahasa kiasan yang indah. Contoh mahakarya: <strong>Syair Perahu</strong> karya Hamzah Fansuri.
            </p>
            <div className="rounded-xl bg-slate-950/70 p-3 font-serif italic text-purple-100 text-xs border border-purple-900/40">
              "Wahai muda kenali dirimu, ialah perahu tamsil tubuhmu,<br />
              Tiadalah berapa lama hidupmu, ke akhirat jua kekal diammu."
            </div>
          </div>

          {/* Gurindam */}
          <div className="rounded-2xl bg-sky-950/20 border border-sky-500/30 p-4">
            <h3 className="font-bold text-sky-300 text-sm flex items-center gap-1.5 mb-1.5">
              <ShieldAlert className="h-4 w-4" /> 3. Gurindam (Puisi Syarat-Jawaban a-a)
            </h3>
            <p className="text-slate-300 leading-relaxed mb-2">
              Berasal dari bahasa Tamil <em>kirindam</em> (perumpamaan). Tiap bait hanya terdiri dari <strong>dua baris</strong> dengan sajak kembar a-a. Mengandung petuah budi pekerti yang padat. Karya terkenal: <strong>Gurindam Dua Belas</strong> karya Raja Ali Haji (1847).
            </p>
            <div className="rounded-xl bg-slate-950/70 p-3 font-serif italic text-sky-100 text-xs border border-sky-900/40">
              "Kurang pikir kurang siasat, (Sebab)<br />
              Tentu dirimu kelak tersesat." (Akibat)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 shadow-md transition cursor-pointer"
          >
            Mengerti & Siap Bermain
          </button>
        </div>
      </div>
    </div>
  );
};
