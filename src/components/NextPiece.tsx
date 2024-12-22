import type { Tetromino } from '../types';

type NextPieceProps = {
  tetromino: Tetromino;
};

const NextPiece: React.FC<NextPieceProps> = ({ tetromino }) => {
  return (
    <div className="bg-gray-800 p-2 border-2 border-gray-600">
      <h3 className="text-white mb-2">Next:</h3>
      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${tetromino.shape[0].length}, 1fr)` }}>
        {tetromino.shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`cell-${y}-${x}-${cell}`}
              className={`w-4 h-4 sm:w-6 sm:h-6 ${cell ? tetromino.color : 'bg-gray-900'}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NextPiece;
