import { useEffect, useRef } from 'react';
import type { GameControls } from '../types';

type KeyboardControlsProps = {
  isPlaying: boolean;
  gameOver: boolean;
  gameControls: GameControls;
};

export function useKeyboardControls({ isPlaying, gameOver, gameControls }: KeyboardControlsProps) {
  const lastDownPress = useRef<number>(0);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          gameControls.moveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          gameControls.moveRight();
          break;
        case 'ArrowDown': {
          event.preventDefault();
          const now = Date.now();
          if (now - lastDownPress.current < 200) {
            gameControls.instantDrop();
          } else {
            gameControls.moveDown();
          }
          lastDownPress.current = now;
          break;
        }
        case 'ArrowUp':
          event.preventDefault();
          gameControls.rotate();
          break;
        case ' ':
          event.preventDefault();
          gameControls.instantDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, gameOver, gameControls]);
} 