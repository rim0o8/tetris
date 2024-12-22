import type { Cell, Tetromino } from '../types';
import { TETROMINOS } from '../types';

type BoardProps = {
  board: Cell[][];
  currentPiece: Tetromino;
  position: { x: number; y: number };
  clearedLines: number[];
  isClearing: boolean;
};

const Board = ({ board, currentPiece, position, clearedLines, isClearing }: BoardProps) => {
  const renderCell = (x: number, y: number) => {
    const cell = board[y][x];
    const isPieceCell = 
      y >= position.y && 
      y < position.y + currentPiece.shape.length &&
      x >= position.x && 
      x < position.x + currentPiece.shape[0].length &&
      currentPiece.shape[y - position.y][x - position.x] !== 0;

    const cellColor = isPieceCell 
      ? currentPiece.color 
      : cell 
        ? TETROMINOS[Object.keys(TETROMINOS)[cell - 1]].color 
        : 'bg-gray-900';

    const isCleared = clearedLines.includes(y);

    return (
      <div
        key={`${y}-${x}`}
        className={`w-6 h-6 sm:w-8 sm:h-8 ${cellColor} ${
          isPieceCell ? 'animate-fall' : ''
        } ${isCleared && isClearing ? 'animate-flash' : ''} ${
          isCleared && !isClearing ? 'animate-dissolve' : ''
        } transition-all duration-300 ease-in-out`}
      />
    );
  };

  return (
    <div className="grid grid-cols-10 gap-px bg-gray-800 p-1 border-2 border-gray-600 max-w-[300px] sm:max-w-[400px]">
      {board.map((row, y) =>
        row.map((_, x) => renderCell(x, y))
      )}
    </div>
  );
};

export default Board;
