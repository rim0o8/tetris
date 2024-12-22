import Tetris from '../components/Tetris';

export default function Home() {
  return (
    <main style={{
      overflow: 'hidden',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <Tetris />
    </main>
  );
}

