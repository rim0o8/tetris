'use client'

import { useEffect } from 'react';
import { useGameControls, useGameState, useKeyboardControls, useTouchControls } from '../hooks';
import Board from './Board';
import NextPiece from './NextPiece';

const Tetris: React.FC = () => {
  const gameState = useGameState();
  const {
    board,
    currentPiece,
    nextPiece,
    position,
    score,
    gameOver,
    isPlaying,
    clearedLines,
    isClearing,
    gameSpeed,
    startGame,
    restartGame,
    adjustSpeed,
  } = gameState;

  // ゲームのコア機能
  const gameControls = useGameControls(gameState);

  // キーボード操作
  useKeyboardControls({
    isPlaying,
    gameOver,
    gameControls,
  });

  // タッチ操作
  const { touchHandlers } = useTouchControls({
    isPlaying,
    gameOver,
    gameControls,
  });

  // ゲームループ
  useEffect(() => {
    if (gameOver || !isPlaying) return;

    const gameLoop = setInterval(gameControls.moveDown, gameSpeed);
    return () => clearInterval(gameLoop);
  }, [gameOver, isPlaying, gameControls.moveDown, gameSpeed]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Tetris</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div {...touchHandlers}>
          <Board
            board={board}
            currentPiece={currentPiece}
            position={position}
            clearedLines={clearedLines}
            isClearing={isClearing}
          />
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
