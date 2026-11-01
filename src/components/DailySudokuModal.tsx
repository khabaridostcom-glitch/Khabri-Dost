import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  Pencil,
  Undo2,
  Redo2,
  Eraser,
  Lightbulb,
  RotateCcw,
  Play,
  Pause,
  Trophy,
  CheckCircle2,
  Sparkles,
  Printer,
  ChevronDown,
  Info,
  Maximize2,
  Minimize2,
  Gamepad2,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import {
  generateSudokuPuzzle,
  findBoardConflicts,
  getRemainingDigitCounts,
  formatSudokuTime,
  SudokuDifficulty,
  SudokuPuzzle,
} from '../utils/sudokuGenerator';

interface MoveHistoryState {
  board: number[][];
  notes: Record<string, number[]>;
  selectedCell: [number, number] | null;
  actionDesc?: string;
}

interface DailySudokuModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDifficulty?: SudokuDifficulty;
}

export const DailySudokuModal: React.FC<DailySudokuModalProps> = ({
  isOpen,
  onClose,
  initialDifficulty = 'medium',
}) => {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>(initialDifficulty);
  const [puzzle, setPuzzle] = useState<SudokuPuzzle>(() => generateSudokuPuzzle(initialDifficulty));
  const [board, setBoard] = useState<number[][]>(() => puzzle.initial.map((r) => [...r]));
  const [notes, setNotes] = useState<Record<string, number[]>>({});
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  // Pencil mode toggle (core requirement)
  const [pencilMode, setPencilMode] = useState<boolean>(false);

  // Undo / Redo history stack (core requirement)
  const [history, setHistory] = useState<MoveHistoryState[]>([
    {
      board: puzzle.initial.map((r) => [...r]),
      notes: {},
      selectedCell: null,
      actionDesc: 'प्रारंभिक बोर्ड',
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Timer and Game State
  const [seconds, setSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [maxMistakes] = useState<number>(3);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showRulesInfo, setShowRulesInfo] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Start new puzzle
  const handleStartNewGame = useCallback((diff: SudokuDifficulty = difficulty) => {
    const newPuz = generateSudokuPuzzle(diff);
    setPuzzle(newPuz);
    const initialCopy = newPuz.initial.map((r) => [...r]);
    setBoard(initialCopy);
    setNotes({});
    setSelectedCell(null);
    setDifficulty(diff);
    setMistakes(0);
    setIsSolved(false);
    setHintsLeft(3);
    setSeconds(0);
    setIsPaused(false);

    setHistory([
      {
        board: initialCopy,
        notes: {},
        selectedCell: null,
        actionDesc: 'नई पहेली',
      },
    ]);
    setHistoryIndex(0);
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    if (!isOpen || isPaused || isSolved) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused, isSolved]);

  // Check victory condition
  useEffect(() => {
    if (isSolved) return;

    let complete = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0 || board[r][c] !== puzzle.solution[r][c]) {
          complete = false;
          break;
        }
      }
      if (!complete) break;
    }

    if (complete) {
      setIsSolved(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [board, puzzle.solution, isSolved]);

  // Push new state to Undo History
  const pushHistory = useCallback(
    (newBoard: number[][], newNotes: Record<string, number[]>, cell: [number, number] | null, actionDesc: string) => {
      setHistory((prev) => {
        const truncated = prev.slice(0, historyIndex + 1);
        return [
          ...truncated,
          {
            board: newBoard.map((r) => [...r]),
            notes: { ...newNotes },
            selectedCell: cell,
            actionDesc,
          },
        ];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // UNDO BUTTON HANDLER (Core Requirement)
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const targetIndex = historyIndex - 1;
    const targetState = history[targetIndex];

    setBoard(targetState.board.map((r) => [...r]));
    setNotes({ ...targetState.notes });
    setSelectedCell(targetState.selectedCell);
    setHistoryIndex(targetIndex);
  }, [history, historyIndex]);

  // REDO HANDLER
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const targetIndex = historyIndex + 1;
    const targetState = history[targetIndex];

    setBoard(targetState.board.map((r) => [...r]));
    setNotes({ ...targetState.notes });
    setSelectedCell(targetState.selectedCell);
    setHistoryIndex(targetIndex);
  }, [history, historyIndex]);

  // Input number into selected cell (either as committed value or candidate pencil note)
  const handleInputNumber = useCallback(
    (num: number) => {
      if (!selectedCell || isPaused || isSolved) return;
      const [r, c] = selectedCell;

      // Cannot modify initial given clues
      if (puzzle.initial[r][c] !== 0) return;

      const cellKey = `${r}-${c}`;

      if (pencilMode) {
        // PENCIL MODE: Toggle candidate notes in cell (Core Requirement)
        // Only allow notes if cell doesn't have a committed number
        if (board[r][c] !== 0) return;

        const currentCellNotes = notes[cellKey] || [];
        let newCellNotes: number[];

        if (currentCellNotes.includes(num)) {
          newCellNotes = currentCellNotes.filter((n) => n !== num);
        } else {
          newCellNotes = [...currentCellNotes, num].sort((a, b) => a - b);
        }

        const newNotes = { ...notes };
        if (newCellNotes.length > 0) {
          newNotes[cellKey] = newCellNotes;
        } else {
          delete newNotes[cellKey];
        }

        setNotes(newNotes);
        pushHistory(board, newNotes, [r, c], `पेंसिल नोट ${num}`);
      } else {
        // STANDARD MODE: Commit final number into cell
        if (board[r][c] === num) return; // already set

        // Check mistake against puzzle solution
        if (num !== puzzle.solution[r][c]) {
          setMistakes((prev) => prev + 1);
        }

        const newBoard = board.map((row, rowIdx) =>
          row.map((val, colIdx) => (rowIdx === r && colIdx === c ? num : val))
        );

        // Committing final number clears candidate notes for this cell
        const newNotes = { ...notes };
        delete newNotes[cellKey];

        // Also proactively remove candidate note `num` from same row, col, and 3x3 box
        for (let checkCol = 0; checkCol < 9; checkCol++) {
          const k = `${r}-${checkCol}`;
          if (newNotes[k]) {
            newNotes[k] = newNotes[k].filter((n) => n !== num);
            if (newNotes[k].length === 0) delete newNotes[k];
          }
        }
        for (let checkRow = 0; checkRow < 9; checkRow++) {
          const k = `${checkRow}-${c}`;
          if (newNotes[k]) {
            newNotes[k] = newNotes[k].filter((n) => n !== num);
            if (newNotes[k].length === 0) delete newNotes[k];
          }
        }
        const boxR = Math.floor(r / 3) * 3;
        const boxC = Math.floor(c / 3) * 3;
        for (let br = boxR; br < boxR + 3; br++) {
          for (let bc = boxC; bc < boxC + 3; bc++) {
            const k = `${br}-${bc}`;
            if (newNotes[k]) {
              newNotes[k] = newNotes[k].filter((n) => n !== num);
              if (newNotes[k].length === 0) delete newNotes[k];
            }
          }
        }

        setBoard(newBoard);
        setNotes(newNotes);
        pushHistory(newBoard, newNotes, [r, c], `संख्या ${num} दर्ज की`);
      }
    },
    [selectedCell, isPaused, isSolved, puzzle, pencilMode, board, notes, pushHistory]
  );

  // Erase cell content (committed value or pencil notes)
  const handleErase = useCallback(() => {
    if (!selectedCell || isPaused || isSolved) return;
    const [r, c] = selectedCell;

    // Cannot erase initial given clue
    if (puzzle.initial[r][c] !== 0) return;

    const cellKey = `${r}-${c}`;
    const hadValue = board[r][c] !== 0;
    const hadNotes = Boolean(notes[cellKey] && notes[cellKey].length > 0);

    if (!hadValue && !hadNotes) return;

    const newBoard = board.map((row, rowIdx) =>
      row.map((val, colIdx) => (rowIdx === r && colIdx === c ? 0 : val))
    );

    const newNotes = { ...notes };
    delete newNotes[cellKey];

    setBoard(newBoard);
    setNotes(newNotes);
    pushHistory(newBoard, newNotes, [r, c], 'सेल मिटाया');
  }, [selectedCell, isPaused, isSolved, puzzle, board, notes, pushHistory]);

  // Use Hint
  const handleUseHint = useCallback(() => {
    if (!selectedCell || isPaused || isSolved || hintsLeft <= 0) return;
    const [r, c] = selectedCell;

    if (puzzle.initial[r][c] !== 0) return;
    if (board[r][c] === puzzle.solution[r][c]) return;

    const correctNum = puzzle.solution[r][c];
    const newBoard = board.map((row, rowIdx) =>
      row.map((val, colIdx) => (rowIdx === r && colIdx === c ? correctNum : val))
    );

    const cellKey = `${r}-${c}`;
    const newNotes = { ...notes };
    delete newNotes[cellKey];

    setHintsLeft((prev) => prev - 1);
    setBoard(newBoard);
    setNotes(newNotes);
    pushHistory(newBoard, newNotes, [r, c], `संकेत: संख्या ${correctNum}`);
  }, [selectedCell, isPaused, isSolved, hintsLeft, puzzle, board, notes, pushHistory]);

  // Keyboard navigation & inputs
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keyboard inside input fields
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }

      // Redo: Ctrl+Y
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Toggle Pencil Mode: key 'P' or 'N'
      if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setPencilMode((prev) => !prev);
        return;
      }

      // Space: Pause/Resume
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      // Erase: Backspace or Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleErase();
        return;
      }

      // Numbers 1-9
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        handleInputNumber(parseInt(e.key, 10));
        return;
      }

      // Arrow navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setSelectedCell((prev) => {
          if (!prev) return [0, 0];
          let [r, c] = prev;
          if (e.key === 'ArrowUp') r = (r + 8) % 9;
          if (e.key === 'ArrowDown') r = (r + 1) % 9;
          if (e.key === 'ArrowLeft') c = (c + 8) % 9;
          if (e.key === 'ArrowRight') c = (c + 1) % 9;
          return [r, c];
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleUndo, handleRedo, handleErase, handleInputNumber]);

  if (!isOpen) return null;

  // Active highlights
  const conflicts = findBoardConflicts(board);
  const remainingCounts = getRemainingDigitCounts(board);

  const selectedValue = selectedCell ? board[selectedCell[0]][selectedCell[1]] : 0;
  const isSelectedCellInitial = selectedCell ? puzzle.initial[selectedCell[0]][selectedCell[1]] !== 0 : false;

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col w-full overflow-hidden transition-all text-slate-900 ${
          isFullscreen ? 'max-w-6xl h-[95vh]' : 'max-w-4xl max-h-[95vh]'
        }`}
      >
        {/* HEADER BAR */}
        <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black font-kd-headline text-white truncate">
                  दैनिक सुडोकू पहेली (Daily Sudoku)
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-red-800/80 text-amber-200 px-2 py-0.5 rounded-full border border-red-400/40">
                  {difficulty === 'easy'
                    ? 'सरल'
                    : difficulty === 'medium'
                    ? 'मध्यम'
                    : difficulty === 'hard'
                    ? 'कठिन'
                    : 'विशेषज्ञ'}
                </span>
              </div>
              <p className="text-[11px] text-red-100 hidden sm:block truncate">
                खबरी दोस्त दैनिक मानसिक व्यायाम • 9×9 क्लासिक समाचार पत्र पहेली
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Rules Info Button */}
            <button
              onClick={() => setShowRulesInfo(!showRulesInfo)}
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="नियम एवं निर्देश (Rules)"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Print Friendly Button */}
            <button
              onClick={() => window.print()}
              className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer text-xs"
              title="प्रिंट करें (Print on Paper)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title={isFullscreen ? 'सामान्य आकार' : 'बड़ा आकार (Fullscreen)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition cursor-pointer ml-1"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* RULES INFO POPUP BANNER */}
        {showRulesInfo && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 text-xs text-amber-950 flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">सुडोकू नियम व कीबोर्ड शॉर्टकट्स:</p>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  प्रत्येक पंक्ति, स्तंभ और 3×3 ग्रिड में 1 से 9 तक के अंक बिना दोहराए भरें।
                  कीबोर्ड पर <span className="font-mono font-bold bg-amber-200/70 px-1 rounded">1-9</span> दबाकर अंक भरें,{' '}
                  <span className="font-mono font-bold bg-amber-200/70 px-1 rounded">P</span> या{' '}
                  <span className="font-mono font-bold bg-amber-200/70 px-1 rounded">N</span> से पेंसिल मोड (नोट्स) बदलें, और{' '}
                  <span className="font-mono font-bold bg-amber-200/70 px-1 rounded">Ctrl+Z</span> से Undo करें।
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRulesInfo(false)}
              className="text-amber-800 hover:text-amber-950 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CONTROLS STRIP: DIFFICULTY, TIMER, MISTAKES */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Difficulty Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-500 hidden xs:inline">कठिनाई:</span>
            <div className="flex rounded-lg bg-slate-200/70 p-0.5 text-[11px] font-bold">
              {(['easy', 'medium', 'hard', 'expert'] as SudokuDifficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => handleStartNewGame(d)}
                  className={`px-2 py-1 rounded-md transition cursor-pointer ${
                    difficulty === d
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {d === 'easy'
                    ? 'सरल'
                    : d === 'medium'
                    ? 'मध्यम'
                    : d === 'hard'
                    ? 'कठिन'
                    : 'विशेषज्ञ'}
                </button>
              ))}
            </div>
          </div>

          {/* Timer & Mistakes Tracker */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mistakes */}
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-semibold shadow-2xs">
              <span className="text-[11px] text-slate-500">गलतियां:</span>
              <span className={`font-mono font-bold ${mistakes > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {mistakes}/{maxMistakes}
              </span>
            </div>

            {/* Timer with Pause/Play */}
            <div className="flex items-center space-x-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-mono font-bold shadow-2xs">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-slate-600 hover:text-red-600 transition cursor-pointer p-0.5"
                title={isPaused ? 'खेल शुरू करें (Resume)' : 'खेल रोकें (Pause)'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <span className={isPaused ? 'text-amber-600' : 'text-slate-900'}>
                {formatSudokuTime(seconds)}
              </span>
            </div>

            {/* New Game Button */}
            <button
              onClick={() => handleStartNewGame(difficulty)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 transition cursor-pointer flex items-center space-x-1"
              title="नई पहेली जनरेट करें"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xs:inline">नई पहेली</span>
            </button>
          </div>
        </div>

        {/* MAIN GAME BODY: 9x9 GRID + ACTION TOOLBAR + NUMBER PAD */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 bg-slate-100/50">
          {/* 9x9 SUDOKU BOARD */}
          <div className="relative flex flex-col items-center">
            {/* The Grid Container */}
            <div
              className="relative bg-slate-900 p-1 sm:p-1.5 rounded-2xl shadow-xl select-none"
              style={{ width: 'min(90vw, 460px)', height: 'min(90vw, 460px)' }}
            >
              {/* PAUSE OVERLAY */}
              {isPaused && (
                <div className="absolute inset-0 z-30 bg-slate-900/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 mb-3 border border-white/20">
                    <Pause className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold">खेल रोका गया है (Game Paused)</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs">
                    पहेली बोर्ड सुरक्षित रूप से छुपाया गया है। जारी रखने के लिए नीचे क्लिक करें।
                  </p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="mt-4 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer text-xs sm:text-sm"
                  >
                    <Play className="w-4 h-4" />
                    <span>जारी रखें (Resume Game)</span>
                  </button>
                </div>
              )}

              {/* VICTORY OVERLAY */}
              {isSolved && (
                <div className="absolute inset-0 z-30 bg-emerald-950/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-white text-center animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-amber-300 mb-3 animate-bounce">
                    <Trophy className="w-9 h-9" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    शानदार विजय! (SOLVED)
                  </span>
                  <h3 className="text-xl font-black mt-2 font-kd-headline">
                    बधाई हो! आपने पहेली हल कर ली!
                  </h3>
                  <div className="mt-3 flex items-center space-x-4 text-xs text-emerald-200 font-mono">
                    <div>
                      समय: <span className="font-bold text-white">{formatSudokuTime(seconds)}</span>
                    </div>
                    <div>
                      गलतियां: <span className="font-bold text-white">{mistakes}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartNewGame(difficulty)}
                    className="mt-5 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer text-xs sm:text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>अगली पहेली खेलें (Next Puzzle)</span>
                  </button>
                </div>
              )}

              {/* 9x9 CELLS GRID */}
              <div className="w-full h-full grid grid-cols-9 grid-rows-9 gap-[1px] bg-slate-300 rounded-xl overflow-hidden">
                {board.map((row, r) =>
                  row.map((val, c) => {
                    const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                    const isInitial = puzzle.initial[r][c] !== 0;
                    const isSameRowOrCol =
                      selectedCell && (selectedCell[0] === r || selectedCell[1] === c);
                    const isSameBox =
                      selectedCell &&
                      Math.floor(selectedCell[0] / 3) === Math.floor(r / 3) &&
                      Math.floor(selectedCell[1] / 3) === Math.floor(c / 3);
                    const isSameNumber =
                      selectedValue !== 0 && val !== 0 && val === selectedValue;
                    const hasConflict = conflicts.has(`${r}-${c}`);
                    const cellNotes = notes[`${r}-${c}`] || [];

                    // Thicker borders for 3x3 subgrids
                    const borderClasses = `
                      ${r % 3 === 2 && r !== 8 ? 'border-b-2 border-b-slate-900' : ''}
                      ${c % 3 === 2 && c !== 8 ? 'border-r-2 border-r-slate-900' : ''}
                    `;

                    // Background highlight logic
                    let bgClass = 'bg-white';
                    if (isSelected) {
                      bgClass = 'bg-red-200/90 ring-2 ring-red-600 ring-inset z-10';
                    } else if (hasConflict) {
                      bgClass = 'bg-rose-100/90 text-red-700 animate-pulse';
                    } else if (isSameNumber) {
                      bgClass = 'bg-amber-100 font-black text-amber-950';
                    } else if (isSameRowOrCol || isSameBox) {
                      bgClass = 'bg-slate-50/80';
                    }

                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        onClick={() => setSelectedCell([r, c])}
                        className={`relative flex items-center justify-center transition-colors cursor-pointer outline-none ${borderClasses} ${bgClass}`}
                        style={{ aspectRatio: '1/1' }}
                      >
                        {val !== 0 ? (
                          <span
                            className={`text-base sm:text-xl lg:text-2xl font-mono leading-none ${
                              isInitial
                                ? 'font-black text-slate-900'
                                : hasConflict
                                ? 'font-black text-red-600'
                                : 'font-bold text-red-700'
                            }`}
                          >
                            {val}
                          </span>
                        ) : cellNotes.length > 0 ? (
                          // 3x3 MINI GRID CANDIDATE NOTES (Core Requirement)
                          <div className="w-full h-full p-0.5 grid grid-cols-3 grid-rows-3 text-[9px] sm:text-[10px] text-slate-500 font-mono font-semibold leading-none pointer-events-none">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                              <div
                                key={n}
                                className="flex items-center justify-center"
                              >
                                {cellNotes.includes(n) ? (
                                  <span
                                    className={`${
                                      selectedValue === n
                                        ? 'text-amber-800 font-bold bg-amber-200/90 rounded-[2px] px-0.5'
                                        : 'text-slate-600'
                                    }`}
                                  >
                                    {n}
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick helper status */}
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between w-full max-w-[460px] px-1 font-kd-meta">
              <span>
                {selectedCell
                  ? `सेल (${selectedCell[0] + 1}, ${selectedCell[1] + 1}) • ${
                      isSelectedCellInitial ? 'निर्धारित अंक (स्थिर)' : 'संपादन योग्य'
                    }`
                  : 'किसी भी सेल पर क्लिक करें'}
              </span>
              <span>
                {pencilMode ? '✏️ पेंसिल (नोट्स) मोड सक्रिय' : '🖊️ सामान्य अंक प्रविष्टि'}
              </span>
            </div>
          </div>

          {/* ACTION TOOLBAR & NUMBER PAD CONTROLS */}
          <div className="flex flex-col w-full max-w-[380px] space-y-4">
            {/* ACTION TOOLBAR BUTTONS: UNDO, REDO, PENCIL, ERASE, HINT */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-kd-meta">
                गेम टूल्स एवं संपादन (Actions)
              </span>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {/* 1. UNDO BUTTON (Core Requirement) */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border transition cursor-pointer ${
                    historyIndex > 0
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 active:scale-95 shadow-2xs'
                      : 'bg-slate-50/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                  }`}
                  title={`पूर्ववत करें (Undo last move - Ctrl+Z) [${historyIndex} उपलब्ध]`}
                >
                  <Undo2 className="w-5 h-5 text-slate-700" />
                  <span className="text-[10px] font-bold mt-1">Undo</span>
                </button>

                {/* 2. REDO BUTTON */}
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border transition cursor-pointer ${
                    historyIndex < history.length - 1
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 active:scale-95 shadow-2xs'
                      : 'bg-slate-50/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                  }`}
                  title="पुनः लागू करें (Redo - Ctrl+Y)"
                >
                  <Redo2 className="w-5 h-5 text-slate-700" />
                  <span className="text-[10px] font-bold mt-1">Redo</span>
                </button>

                {/* 3. PENCIL MODE TOGGLE BUTTON (Core Requirement) */}
                <button
                  type="button"
                  onClick={() => setPencilMode(!pencilMode)}
                  className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border transition cursor-pointer relative ${
                    pencilMode
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-300 ring-offset-1 font-black'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
                  }`}
                  title="पेंसिल नोट्स मोड टॉगल करें (Pencil Candidates Toggle - Key P/N)"
                >
                  {pencilMode && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
                  )}
                  <Pencil className={`w-5 h-5 ${pencilMode ? 'text-slate-950' : 'text-slate-700'}`} />
                  <span className="text-[10px] font-bold mt-1">
                    {pencilMode ? 'पेंसिल ON' : 'पेंसिल'}
                  </span>
                </button>

                {/* 4. ERASE BUTTON */}
                <button
                  type="button"
                  onClick={handleErase}
                  disabled={!selectedCell || isSelectedCellInitial}
                  className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border transition cursor-pointer ${
                    selectedCell && !isSelectedCellInitial
                      ? 'bg-slate-50 hover:bg-rose-50 text-slate-800 hover:text-red-700 border-slate-200 active:scale-95 shadow-2xs'
                      : 'bg-slate-50/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                  }`}
                  title="अंक या नोट मिटाएं (Erase cell - Delete/Backspace)"
                >
                  <Eraser className="w-5 h-5 text-slate-700" />
                  <span className="text-[10px] font-bold mt-1">मिटाएं</span>
                </button>

                {/* 5. HINT BUTTON */}
                <button
                  type="button"
                  onClick={handleUseHint}
                  disabled={!selectedCell || isSelectedCellInitial || hintsLeft <= 0}
                  className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border transition cursor-pointer relative ${
                    selectedCell && !isSelectedCellInitial && hintsLeft > 0
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 active:scale-95 shadow-2xs'
                      : 'bg-slate-50/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                  }`}
                  title={`सही अंक का संकेत लें (${hintsLeft} संकेत शेष)`}
                >
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold mt-1">संकेत ({hintsLeft})</span>
                </button>
              </div>

              {/* Status Banner for Active Mode */}
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  pencilMode
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pencilMode ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  ></span>
                  <span className="font-semibold text-[11px]">
                    {pencilMode
                      ? 'पेंसिल मोड सक्रिय: अब किसी भी सेल में संभावित छोटे नोट्स भरें'
                      : 'साधारण मोड सक्रिय: सीधे अंतिम अंक दर्ज करें'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPencilMode(!pencilMode)}
                  className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                >
                  {pencilMode ? 'साधारण में बदलें' : 'पेंसिल ऑन करें'}
                </button>
              </div>
            </div>

            {/* ON-SCREEN NUMBER PAD (1-9) */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider font-kd-meta">
                <span>संख्या पैड (1 से 9)</span>
                <span className="text-slate-500">शेष आवश्यक अंक</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                  const remaining = remainingCounts[num];
                  const isDone = remaining === 0;

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleInputNumber(num)}
                      disabled={isDone && !pencilMode}
                      className={`h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs relative ${
                        isDone
                          ? 'bg-slate-100 text-slate-300 border-slate-200'
                          : pencilMode
                          ? 'bg-amber-50/50 hover:bg-amber-100/80 text-amber-950 border-amber-200 hover:border-amber-300'
                          : 'bg-slate-50 hover:bg-red-50 text-slate-900 hover:text-red-700 border-slate-200 hover:border-red-300'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl font-bold font-mono leading-none">
                        {num}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {isDone ? 'पूर्ण ✓' : `${remaining} शेष`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NEWSPAPER FOOTER TIPS */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 space-y-1 font-kd-meta">
              <p className="font-bold text-slate-700">💡 समाधान युक्ति (Pro Tip):</p>
              <p>
                पहेली में अनिश्चित होने पर पहले <strong>'पेंसिल'</strong> ऑन करके सेल में उम्मीदवार अंक दर्ज करें, फिर पुष्ट होने पर साधारण मोड से अंतिम अंक भरें। किसी भी गलती पर तुरंत <strong>'Undo'</strong> दबाएं!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
