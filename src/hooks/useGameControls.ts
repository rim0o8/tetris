import { useCallback } from 'react';
import type { Cell, GameControls, GameState, Tetromino } from '../types';
import { TETROMINOS } from '../types';

export function getRandomTetromino(): Tetromino {
  const tetrominoKeys = Object.keys(TETROMINOS);
  const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
  return TETROMINOS[randomKey];
}

const isColliding = (board: Cell[][], piece: Tetromino, pos: { x: number; y: number }): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (
        piece.shape[y][x] &&
        (board[pos.y + y] === undefined ||
          board[pos.y + y][pos.x + x] === undefined ||
          board[pos.y + y][pos.x + x] !== 0)
      ) {
        return true;
      }
    }
  }
  return false;
};

export function useGameControls(gameState: GameState): GameControls {
  const {
    board,
    setBoard,
    currentPiece,
    setCurrentPiece,
    nextPiece,
    setNextPiece,
    position,
    setPosition,
    score,
    setScore,
    setGameOver,
    setIsPlaying,
    setClearedLines,
    setIsClearing,
  } = gameState;

  const placePiece = useCallback(() => {
    const newBoard = board.map((row) => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          newBoard[position.y + y][position.x + x] = cell;
        }
      });
    });

    setBoard(newBoard);
    const [clearedBoard, newClearedLines] = clearLines(newBoard);

    if (newClearedLines.length > 0) {
      setClearedLines(newClearedLines);
      setIsClearing(true);
      setTimeout(() => {
        setBoard(clearedBoard);
        setClearedLines([]);
        setIsClearing(false);
        setScore((prev) => prev + newClearedLines.length * 100);
      }, 500);
    } else {
      setBoard(clearedBoard);
    }

    if (isColliding(clearedBoard, nextPiece, { x: 3, y: 0 })) {
      setGameOver(true);
      setIsPlaying(false);
    } else {
      setCurrentPiece(nextPiece);
      setNextPiece(getRandomTetromino());
      setPosition({ x: 3, y: 0 });
    }
  }, [board, currentPiece, nextPiece, position, setBoard, setCurrentPiece, setGameOver, setIsClearing, setIsPlaying, setNextPiece, setPosition, setScore, setClearedLines]);

  const clearLines = useCallback((board: Cell[][]): [Cell[][], number[]] => {
    const newBoard = board.map((row) => [...row]);
    const clearedLines: number[] = [];

    for (let y = board.length - 1; y >= 0; y--) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        clearedLines.push(y);
      }
    }

    for (const line of clearedLines) {
      newBoard.splice(line, 1);
      newBoard.unshift(Array(board[0].length).fill(0));
    }

    return [newBoard, clearedLines];
  }, []);

  const moveDown = useCallback(() => {
    if (!isColliding(board, currentPiece, { x: position.x, y: position.y + 1 })) {
      setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
    } else {
      placePiece();
    }
  }, [board, currentPiece, position, placePiece, setPosition]);

  const moveLeft = useCallback(() => {
    if (!isColliding(board, currentPiece, { x: position.x - 1, y: position.y })) {
      setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
    }
  }, [board, currentPiece, position, setPosition]);

  const moveRight = useCallback(() => {
    if (!isColliding(board, currentPiece, { x: position.x + 1, y: position.y })) {
      setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
    }
  }, [board, currentPiece, position, setPosition]);

  const rotate = useCallback(() => {
    const rotatedPiece = {
      ...currentPiece,
      shape: currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map((row) => row[index]).reverse()
      ),
    };
    if (!isColliding(board, rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [board, currentPiece, position, setCurrentPiece]);

  const instantDrop = useCallback(() => {
    let newY = position.y;
    while (!isColliding(board, currentPiece, { x: position.x, y: newY + 1 })) {
      newY++;
    }
    setPosition({ x: position.x, y: newY });
  }, [board, currentPiece, position, setPosition]);

  return {
    moveDown,
    moveLeft,
    moveRight,
    rotate,
    instantDrop,
  };
} 