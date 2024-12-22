export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Tetromino = {
  shape: Cell[][];
  color: string;
};

export type GameControls = {
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  rotate: () => void;
  instantDrop: () => void;
};

export type GameState = {
  board: Cell[][];
  setBoard: (board: Cell[][]) => void;
  currentPiece: Tetromino;
  setCurrentPiece: (piece: Tetromino) => void;
  nextPiece: Tetromino;
  setNextPiece: (piece: Tetromino) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  score: number;
  setScore: (score: number) => void;
  gameOver: boolean;
  setGameOver: (gameOver: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  clearedLines: number[];
  setClearedLines: (lines: number[]) => void;
  isClearing: boolean;
  setIsClearing: (isClearing: boolean) => void;
  gameSpeed: number;
};

export const TETROMINOS: { [key: string]: Tetromino } = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'bg-cyan-500',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 'bg-blue-500',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: 'bg-orange-500',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'bg-yellow-500',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 'bg-green-500',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: 'bg-purple-500',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 'bg-red-500',
  },
};

