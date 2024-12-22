'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Cell, Tetromino } from '../types';
import { BOARD_HEIGHT, BOARD_WIDTH, TETROMINOS } from '../types';
import Board from './Board';
import NextPiece from './NextPiece';

const createEmptyBoard = (): Cell[][] =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

const Tetris: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Tetromino>(TETROMINOS.I);
  const [nextPiece, setNextPiece] = useState<Tetromino>(getRandomTetromino());
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clearedLines, setClearedLines] = useState<number[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const [gameSpeed, setGameSpeed] = useState<number>(1000);
  const lastDownPress = useRef<number>(0);

  function getRandomTetromino(): Tetromino {
    const tetrominoKeys = Object.keys(TETROMINOS);
    const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
    return TETROMINOS[randomKey];
  }

  const moveDown = useCallback(() => {
    if (!isColliding(board, currentPiece, { x: position.x, y: position.y + 1 })) {
      setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
    } else {
      placePiece();
    }
  }, [board, currentPiece, position]);

  const moveLeft = useCallback(() => {
    if (!isColliding(board, currentPiece, { x: position.x - 1, y: position.y })) {
      setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
    }
  }, [board, currentPiece, position]);

  const moveRight = useCallback(() => {
    if (!isColliding(board, currentPiece, { x: position.x + 1, y: position.y })) {
      setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
    }
  }, [board, currentPiece, position]);

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
  }, [board, currentPiece, position]);

  const instantDrop = useCallback(() => {
    let newY = position.y;
    while (!isColliding(board, currentPiece, { x: position.x, y: newY + 1 })) {
      newY++;
    }
    setPosition({ x: position.x, y: newY });
  }, [board, currentPiece, position]);

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

  const placePiece = () => {
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
  };

  const clearLines = (board: Cell[][]): [Cell[][], number[]] => {
    const newBoard = board.map((row) => [...row]);
    const clearedLines: number[] = [];

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        clearedLines.push(y);
      }
    }

    for (const line of clearedLines) {
      newBoard.splice(line, 1);
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    return [newBoard, clearedLines];
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          moveRight();
          break;
        case 'ArrowDown': {
          event.preventDefault();
          const now = Date.now();
          if (now - lastDownPress.current < 200) {
            instantDrop();
          } else {
            moveDown();
          }
          lastDownPress.current = now;
          break;
        }
        case 'ArrowUp':
          event.preventDefault();
          rotate();
          break;
        case ' ':
          event.preventDefault();
          instantDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, gameOver, moveDown, moveLeft, moveRight, rotate, instantDrop]);

  useEffect(() => {
    if (gameOver || !isPlaying) return;

    const gameLoop = setInterval(moveDown, gameSpeed);
    return () => {
      clearInterval(gameLoop);
    };
  }, [gameOver, isPlaying, moveDown, gameSpeed]);

  const adjustSpeed = (speed: number) => {
    setGameSpeed(speed);
  };

  const restartGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomTetromino());
    setNextPiece(getRandomTetromino());
    setPosition({ x: 3, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setClearedLines([]);
    setIsClearing(false);
  };

  const startGame = () => {
    if (!isPlaying && !gameOver) {
      setIsPlaying(true);
    }
  };

  const handleTouchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPlaying || gameOver) return;

    const touch = e.touches[0];
    if (handleTouchStart.current) {
      const deltaX = touch.clientX - handleTouchStart.current.x;
      const deltaY = touch.clientY - handleTouchStart.current.y;
      const deltaTime = Date.now() - handleTouchStart.current.time;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 20) {
          moveRight();
        } else if (deltaX < -20) {
          moveLeft();
        }
      } else {
        if (deltaY > 20) {
          if (deltaTime < 200) {
            instantDrop();
          } else {
            moveDown();
          }
        } else if (deltaY < -20) {
          rotate();
        }
      }

      handleTouchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    }
  };

  const handleTouchEnd = () => {
    handleTouchStart.current = null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Tetris</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div
          onTouchStart={(e) => {
            handleTouchStart.current = { 
              x: e.touches[0].clientX, 
              y: e.touches[0].clientY, 
              time: Date.now() 
            };
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Board board={board} currentPiece={currentPiece} position={position} clearedLines={clearedLines} isClearing={isClearing} />
        </div>
        <div className="flex flex-row md:flex-col justify-between md:justify-start gap-4">
          <NextPiece tetromino={nextPiece} />
          <div className="bg-gray-800 p-2 border-2 border-gray-600">
            <h3 className="mb-2">Score: {score}</h3>
          </div>
          {!isPlaying && !gameOver && (
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={startGame}
            >
              Start Game
            </button>
          )}
          {gameOver && (
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={restartGame}
            >
              Restart
            </button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <button 
          type="button"
          onClick={() => adjustSpeed(1000)} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mr-2"
        >
          Normal
        </button>
        <button 
          type="button"
          onClick={() => adjustSpeed(500)} 
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2"
        >
          Fast
        </button>
        <button 
          type="button"
          onClick={() => adjustSpeed(200)} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
        >
          Insane
        </button>
      </div>
    </div>
  );
};

export default Tetris;
