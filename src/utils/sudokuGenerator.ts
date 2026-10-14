export type SudokuDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuPuzzle {
  id: string;
  difficulty: SudokuDifficulty;
  initial: number[][]; // 0 represents empty cell
  solution: number[][];
  cluesCount: number;
}

// Generate a valid baseline 9x9 solution
function generateBaseSolution(): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < 9; r++) {
    grid[r] = [];
    for (let c = 0; c < 9; c++) {
      grid[r][c] = ((r * 3 + Math.floor(r / 3) + c) % 9) + 1;
    }
  }
  return grid;
}

// Shuffle an array in-place
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Apply validity-preserving transformations to randomize solution
function shuffleSudoku(grid: number[][]): number[][] {
  let board = grid.map((row) => [...row]);

  // 1. Permute numbers 1..9
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffledNumbers = shuffle([...numbers]);
  const map: Record<number, number> = {};
  for (let i = 0; i < 9; i++) {
    map[numbers[i]] = shuffledNumbers[i];
  }
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      board[r][c] = map[board[r][c]];
    }
  }

  // 2. Swap rows within 3x3 blocks
  for (let b = 0; b < 3; b++) {
    const rowIndices = shuffle([0, 1, 2]);
    const blockRows = [board[b * 3 + 0], board[b * 3 + 1], board[b * 3 + 2]];
    board[b * 3 + 0] = blockRows[rowIndices[0]];
    board[b * 3 + 1] = blockRows[rowIndices[1]];
    board[b * 3 + 2] = blockRows[rowIndices[2]];
  }

  // 3. Swap columns within 3x3 blocks
  for (let b = 0; b < 3; b++) {
    const colIndices = shuffle([0, 1, 2]);
    for (let r = 0; r < 9; r++) {
      const orig = [board[r][b * 3 + 0], board[r][b * 3 + 1], board[r][b * 3 + 2]];
      board[r][b * 3 + 0] = orig[colIndices[0]];
      board[r][b * 3 + 1] = orig[colIndices[1]];
      board[r][b * 3 + 2] = orig[colIndices[2]];
    }
  }

  // 4. Swap block bands (row blocks 0-2, 3-5, 6-8)
  const bandIndices = shuffle([0, 1, 2]);
  const newBoard: number[][] = [];
  for (let b = 0; b < 3; b++) {
    const origBand = bandIndices[b];
    for (let r = 0; r < 3; r++) {
      newBoard.push([...board[origBand * 3 + r]]);
    }
  }
  board = newBoard;

  // 5. Optionally transpose with 50% probability
  if (Math.random() > 0.5) {
    const transposed: number[][] = [];
    for (let c = 0; c < 9; c++) {
      transposed[c] = [];
      for (let r = 0; r < 9; r++) {
        transposed[c][r] = board[r][c];
      }
    }
    board = transposed;
  }

  return board;
}

// Generate a puzzle by removing numbers with symmetric layout
export function generateSudokuPuzzle(difficulty: SudokuDifficulty = 'medium'): SudokuPuzzle {
  const solution = shuffleSudoku(generateBaseSolution());
  const initial = solution.map((row) => [...row]);

  // Target number of clues to keep
  let targetClues = 32;
  switch (difficulty) {
    case 'easy':
      targetClues = 38;
      break;
    case 'medium':
      targetClues = 31;
      break;
    case 'hard':
      targetClues = 26;
      break;
    case 'expert':
      targetClues = 22;
      break;
  }

  const cellsToRemove = 81 - targetClues;

  // Create list of all coordinate pairs for 180° symmetric removal
  const pairs: [number, number, number, number][] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 9; c++) {
      const symR = 8 - r;
      const symC = 8 - c;
      if (r === 4 && c > 4) continue; // center row already covered
      pairs.push([r, c, symR, symC]);
    }
  }
  shuffle(pairs);

  let removed = 0;
  for (const [r1, c1, r2, c2] of pairs) {
    if (removed >= cellsToRemove) break;

    initial[r1][c1] = 0;
    removed++;

    if (r1 !== r2 || c1 !== c2) {
      if (removed < cellsToRemove) {
        initial[r2][c2] = 0;
        removed++;
      }
    }
  }

  let finalClues = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (initial[r][c] !== 0) finalClues++;
    }
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const id = `kd-sudoku-${todayStr}-${difficulty}-${Date.now().toString(36)}`;

  return {
    id,
    difficulty,
    initial,
    solution,
    cluesCount: finalClues,
  };
}

// Check if placing a number at (row, col) is locally valid according to Sudoku rules
export function isValidMove(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  if (num === 0) return true;

  // Row check
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false;
  }

  // Column check
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false;
  }

  // 3x3 Block check
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) return false;
    }
  }

  return true;
}

// Find all current conflict cells in the board (duplicates in row, col, or box)
export function findBoardConflicts(board: number[][]): Set<string> {
  const conflicts = new Set<string>();

  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen: Record<number, number[]> = {};
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val !== 0) {
        if (!seen[val]) seen[val] = [];
        seen[val].push(c);
      }
    }
    for (const val in seen) {
      if (seen[val].length > 1) {
        seen[val].forEach((c) => conflicts.add(`${r}-${c}`));
      }
    }
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    const seen: Record<number, number[]> = {};
    for (let r = 0; r < 9; r++) {
      const val = board[r][c];
      if (val !== 0) {
        if (!seen[val]) seen[val] = [];
        seen[val].push(r);
      }
    }
    for (const val in seen) {
      if (seen[val].length > 1) {
        seen[val].forEach((r) => conflicts.add(`${r}-${c}`));
      }
    }
  }

  // Check 3x3 boxes
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const seen: Record<number, [number, number][]> = {};
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          const val = board[r][c];
          if (val !== 0) {
            if (!seen[val]) seen[val] = [];
            seen[val].push([r, c]);
          }
        }
      }
      for (const val in seen) {
        if (seen[val].length > 1) {
          seen[val].forEach(([r, c]) => conflicts.add(`${r}-${c}`));
        }
      }
    }
  }

  return conflicts;
}

// Count remaining digits (how many times each digit 1-9 still needs to be placed)
export function getRemainingDigitCounts(board: number[][]): Record<number, number> {
  const counts: Record<number, number> = {
    1: 9,
    2: 9,
    3: 9,
    4: 9,
    5: 9,
    6: 9,
    7: 9,
    8: 9,
    9: 9,
  };

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val >= 1 && val <= 9) {
        counts[val] = Math.max(0, counts[val] - 1);
      }
    }
  }

  return counts;
}

// Format seconds into MM:SS
export function formatSudokuTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
