import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

export interface Prize {
  label: string;
  weight: number;
  color: string;
  emoji: string;
}

export const PRIZES: Prize[] = [
  { label: 'Ничего', weight: 50, color: '#3a3026', emoji: '😶' },
  { label: 'Стикер', weight: 25, color: '#ff8a1e', emoji: '🎟️' },
  { label: 'VPN', weight: 15, color: '#1f1a14', emoji: '🛡️' },
  { label: 'Промокод', weight: 8, color: '#ffb443', emoji: '🎫' },
  { label: 'VIP', weight: 1.9, color: '#ff6b1e', emoji: '👑' },
  { label: 'Админка', weight: 0.1, color: '#ffd86b', emoji: '⚡' },
];

function weightedPick(): number {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < PRIZES.length; i++) {
    r -= PRIZES[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}

interface WheelProps {
  onResult: (prize: Prize) => void;
}

const Wheel = ({ onResult }: WheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const seg = 360 / PRIZES.length;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const idx = weightedPick();
    const targetCenter = idx * seg + seg / 2;
    const fullTurns = 6 * 360;
    const final = fullTurns + (360 - targetCenter);
    const base = rotation - (rotation % 360);
    const newRotation = base + final;
    setRotation(newRotation);
    setTimeout(() => {
      setSpinning(false);
      onResult(PRIZES[idx]);
    }, 5600);
  };

  const gradient = PRIZES.map((p, i) => {
    const start = i * seg;
    const end = (i + 1) * seg;
    return `${p.color} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Pointer */}
      <div className="absolute -top-2 z-30 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
        <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[34px] border-l-transparent border-r-transparent border-t-secondary" />
      </div>

      {/* Wheel body */}
      <div className="relative animate-glow-pulse rounded-full p-3" style={{ background: 'radial-gradient(circle, #2a2018, #120d08)' }}>
        <div
          ref={wheelRef}
          className="wheel-spin relative h-72 w-72 rounded-full border-[6px] border-secondary/80 sm:h-96 sm:w-96"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${gradient})`,
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7)',
          }}
        >
          {PRIZES.map((p, i) => {
            const angle = i * seg + seg / 2;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 origin-top font-display font-bold uppercase tracking-wide"
                style={{
                  transform: `rotate(${angle}deg) translate(-50%, 8px)`,
                }}
              >
                <div className="flex flex-col items-center text-center" style={{ transform: 'translateY(20px)' }}>
                  <span className="text-2xl drop-shadow">{p.emoji}</span>
                  <span className="text-xs text-black/85 drop-shadow-sm sm:text-sm">{p.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center button */}
        <button
          onClick={spin}
          disabled={spinning}
          className="absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-secondary bg-gradient-to-b from-primary to-orange-700 font-display font-bold uppercase text-primary-foreground shadow-[0_0_25px_rgba(255,138,30,0.7)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-80 sm:h-24 sm:w-24"
        >
          {spinning ? (
            <Icon name="Loader2" className="animate-spin" size={28} />
          ) : (
            <>
              <Icon name="Sparkles" size={22} />
              <span className="text-xs leading-tight">Крутить</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Wheel;
