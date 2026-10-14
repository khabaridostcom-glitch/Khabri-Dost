import React from 'react';
import { Gamepad2, Sparkles, Play, Pencil, Undo2, Award, Clock } from 'lucide-react';

interface SudokuGameWidgetProps {
  onOpenSudokuModal: () => void;
  isAdmin?: boolean;
}

export const SudokuGameWidget: React.FC<SudokuGameWidgetProps> = ({
  onOpenSudokuModal,
}) => {
  // A clean 9x9 preview pattern representing a newspaper daily puzzle
  const previewCells = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-slate-800">
      {/* Widget Header */}
      <div className="bg-gradient-to-r from-red-700 to-slate-900 text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-kd-headline text-white leading-tight">
              दैनिक सुडोकू (Daily Sudoku)
            </h3>
            <p className="text-[10px] text-red-200 font-kd-meta">
              समाचार पत्र दिमागी कसरत पहेली
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
          आज की पहेली
        </span>
      </div>

      {/* Widget Body */}
      <div className="p-3.5 space-y-3">
        {/* Feature Badges for Pencil Mode & Undo */}
        <div className="flex items-center justify-between gap-1.5 text-[10px] text-slate-600 font-medium">
          <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
            <Pencil className="w-3 h-3 text-amber-600" />
            <span>पेंसिल नोट्स (Pencil Mode)</span>
          </span>
          <span className="flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md">
            <Undo2 className="w-3 h-3 text-slate-600" />
            <span>पूर्ववत (Undo Protection)</span>
          </span>
        </div>

        {/* Mini 9x9 Preview Board */}
        <div
          onClick={onOpenSudokuModal}
          className="relative bg-slate-900 p-1 rounded-xl shadow-inner cursor-pointer group select-none hover:ring-2 hover:ring-red-500 transition-all"
        >
          <div className="grid grid-cols-9 grid-rows-9 gap-[1px] bg-slate-300 rounded-lg overflow-hidden aspect-square">
            {previewCells.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold ${
                    val !== 0
                      ? 'bg-white text-slate-900'
                      : 'bg-slate-50 text-transparent'
                  } ${r % 3 === 2 && r !== 8 ? 'border-b border-b-slate-900' : ''} ${
                    c % 3 === 2 && c !== 8 ? 'border-r border-r-slate-900' : ''
                  }`}
                >
                  {val !== 0 ? val : ''}
                </div>
              ))
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-white p-3 text-center">
            <Play className="w-8 h-8 text-amber-400 mb-1 animate-pulse" />
            <span className="text-xs font-bold font-kd-headline">
              पहेली हल करना शुरू करें
            </span>
            <span className="text-[10px] text-slate-300 mt-0.5">
              पेंसिल मोड एवं Undo सुरक्षा के साथ
            </span>
          </div>
        </div>

        {/* CTA Launch Button */}
        <button
          type="button"
          onClick={onOpenSudokuModal}
          className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer text-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>दैनिक सुडोकू खेलें (Play Daily Sudoku)</span>
        </button>
      </div>
    </div>
  );
};
