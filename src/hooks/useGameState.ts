import { useState } from 'react';
import type { Cell, GameState, Tetromino } from '../types';
import { BOARD_HEIGHT, BOARD_WIDTH, TETROMINOS } from '../types';
import { getRandomTetromino } from './useGameControls';

const createEmptyBoard = (): Cell[][] =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export function useGameState(): GameState & {
  restartGame: () => void;
  startGame: () => void;
  adjustSpeed: (speed: number) => void;
} {
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

  const adjustSpeed = (speed: number) => {
    setGameSpeed(speed);
  };

  return {
    // 状態
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
    gameOver,
    setGameOver,
    isPlaying,
    setIsPlaying,
    clearedLines,
    setClearedLines,
    isClearing,
    setIsClearing,
    gameSpeed,
    // アクション
    restartGame,
    startGame,
    adjustSpeed,
  };
} 