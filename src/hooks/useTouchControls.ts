import { useRef } from 'react';
import type { GameControls } from '../types';

type TouchControlsProps = {
  isPlaying: boolean;
  gameOver: boolean;
  gameControls: GameControls;
};

export function useTouchControls({ isPlaying, gameOver, gameControls }: TouchControlsProps) {
  const handleTouchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwiping = useRef<boolean>(false);

  const handleTap = () => {
    if (!isPlaying || gameOver || isSwiping.current) return;
    gameControls.rotate();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPlaying || gameOver) return;

    const touch = e.touches[0];
    if (handleTouchStart.current) {
      const deltaX = touch.clientX - handleTouchStart.current.x;
      const deltaY = touch.clientY - handleTouchStart.current.y;
      const totalMovement = Math.abs(deltaX) + Math.abs(deltaY);

      // スワイプ開始の判定
      if (totalMovement > 10 && !isSwiping.current) {
        isSwiping.current = true;
      }

      if (isSwiping.current) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 20) {
            gameControls.moveRight();
          } else if (deltaX < -20) {
            gameControls.moveLeft();
          }
        } else {
          if (deltaY > 20) {
            const deltaTime = Date.now() - handleTouchStart.current.time;
            if (deltaTime < 200) {
              gameControls.instantDrop();
            } else {
              gameControls.moveDown();
            }
          }
        }

        handleTouchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isPlaying || gameOver) return;

    if (!isSwiping.current) {
      const deltaTime = Date.now() - (handleTouchStart.current?.time || 0);
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - (handleTouchStart.current?.x || 0);
      const deltaY = touch.clientY - (handleTouchStart.current?.y || 0);
      const totalMovement = Math.abs(deltaX) + Math.abs(deltaY);

      // タップ判定（スワイプしていない場合のみ）
      if (deltaTime < 200 && totalMovement < 10) {
        handleTap();
      }
    }

    handleTouchStart.current = null;
    isSwiping.current = false;
  };

  return {
    touchHandlers: {
      onTouchStart: (e: React.TouchEvent) => {
        handleTouchStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        };
      },
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
} 