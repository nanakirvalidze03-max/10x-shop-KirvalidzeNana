import { useEffect, useState } from 'react';

const COLORS = ['#ffd23f', '#ff6b9d', '#3ddc97', '#6d28d9', '#38bdf8'];

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

function makePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2.2 + Math.random() * 1.8,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 8,
  }));
}

interface ConfettiProps {
  count?: number;
  durationMs?: number;
  onDone?: () => void;
}

// Pure CSS confetti (no library). It removes itself after `durationMs`.
// With "reduce motion" enabled in the OS the pieces stay invisible (see index.css).
export function Confetti({ count = 70, durationMs = 5000, onDone }: ConfettiProps) {
  const [pieces] = useState(() => makePieces(count));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onDone]);

  if (!visible) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.45, backgroundColor: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
        />
      ))}
    </div>
  );
}
