import { useState } from 'react';
import Icon from '@/components/ui/icon';

export interface Prize {
  label: string;
  weight: number;
  color: string;
  emoji: string;
}

export const PRIZES: Prize[] = [
  { label: 'Ничего', weight: 50, color: '#2a2018', emoji: '😶' },
  { label: 'Стикер', weight: 25, color: '#c45e00', emoji: '🎟️' },
  { label: 'VPN', weight: 15, color: '#1a1410', emoji: '🛡️' },
  { label: 'Промокод', weight: 8, color: '#b87b00', emoji: '🎫' },
  { label: 'Ничего', weight: 1.9, color: '#2a2018', emoji: '😶' },
  { label: 'Админка', weight: 0.1, color: '#c47a00', emoji: '⚡' },
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
  disabled?: boolean;
  onSpinStart?: () => void;
}

const Wheel = ({ onResult, disabled, onSpinStart }: WheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const seg = 360 / PRIZES.length;

  const spin = () => {
    if (spinning || disabled) return;
    setSpinning(true);
    onSpinStart?.();
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
      <div className="absolute -top-2 z-30">
        <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[30px] border-l-transparent border-r-transparent border-t-secondary" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }} />
      </div>

      <div className="relative rounded-full p-3 animate-glow-pulse" style={{ background: 'radial-gradient(circle, #2a2018, #100c06)' }}>
        <div
          className="wheel-spin relative h-64 w-64 rounded-full border-[5px] border-secondary/70 sm:h-80 sm:w-80"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${gradient})`,
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
          }}
        >
          {PRIZES.map((p, i) => {
            const angle = i * seg + seg / 2;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 origin-top font-display font-bold"
                style={{ transform: `rotate(${angle}deg) translate(-50%, 10px)` }}
              >
                <div className="flex flex-col items-center" style={{ transform: 'translateY(18px)' }}>
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-[10px] font-bold uppercase text-white/80 drop-shadow sm:text-xs">{p.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center */}
        <button
          onClick={spin}
          disabled={spinning || disabled}
          className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-secondary bg-gradient-to-b from-primary to-orange-700 font-display font-bold uppercase text-primary-foreground shadow-[0_0_25px_rgba(255,138,30,0.7)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 sm:h-20 sm:w-20"
        >
          {spinning
            ? <Icon name="Loader2" className="animate-spin" size={24} />
            : <><Icon name="Sparkles" size={18} /><span className="text-[10px]">Крутить</span></>
          }
        </button>
      </div>
    </div>
  );
};

export default Wheel;