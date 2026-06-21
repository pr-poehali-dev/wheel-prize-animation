import { useState } from 'react';
import Wheel, { Prize } from '@/components/Wheel';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const LEADERS = [
  { name: 'snickers_2302', prize: 'Админка', emoji: '⚡', score: 9999 },
  { name: 'NeoFox', prize: 'VIP', emoji: '👑', score: 4210 },
  { name: 'Lego_Master', prize: 'VIP', emoji: '👑', score: 3870 },
  { name: 'KittyCat', prize: 'Промокод', emoji: '🎫', score: 2150 },
  { name: 'DarkBro', prize: 'Промокод', emoji: '🎫', score: 1980 },
  { name: 'Sunny99', prize: 'VPN', emoji: '🛡️', score: 1340 },
  { name: 'PixelPro', prize: 'VPN', emoji: '🛡️', score: 1120 },
];

const BADGES = [
  { icon: 'Flame', title: 'Первый спин', desc: 'Крутани колесо впервые', got: true },
  { icon: 'Crown', title: 'Король удачи', desc: 'Выиграй VIP-приз', got: true },
  { icon: 'Zap', title: 'Легенда', desc: 'Получи Админку', got: false },
  { icon: 'Repeat', title: 'Завсегдатай', desc: '50 вращений подряд', got: true },
  { icon: 'Gift', title: 'Коллекционер', desc: 'Собери все призы', got: false },
  { icon: 'Trophy', title: 'Топ-1', desc: 'Возглавь таблицу', got: false },
];

const Index = () => {
  const [result, setResult] = useState<Prize | null>(null);
  const [open, setOpen] = useState(false);

  const handleResult = (prize: Prize) => {
    setResult(prize);
    setOpen(true);
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-40 glass">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="text-2xl">🎰</span>
            <span className="text-gold">snickers_2302</span>
          </div>
          <nav className="hidden gap-6 font-medium text-muted-foreground md:flex">
            <button onClick={() => scrollTo('wheel')} className="transition-colors hover:text-primary">Колесо</button>
            <button onClick={() => scrollTo('leaders')} className="transition-colors hover:text-primary">Лидеры</button>
            <button onClick={() => scrollTo('badges')} className="transition-colors hover:text-primary">Достижения</button>
            <button onClick={() => scrollTo('support')} className="transition-colors hover:text-primary">Поддержка</button>
          </nav>
        </div>
      </header>

      {/* HERO + WHEEL */}
      <section id="wheel" className="container relative grid items-center gap-12 py-12 md:grid-cols-2 md:py-20">
        <div className="animate-fade-in text-center md:text-left">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            <Icon name="Sparkles" size={14} /> Колесо Фортуны
          </span>
          <h1 className="font-display text-5xl font-bold uppercase leading-none sm:text-6xl lg:text-7xl">
            Крути и <span className="text-gold">забирай</span> приз
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground md:mx-0">
            Эксклюзивное колесо призов от канала. Стикеры, VPN, промокоды, VIP и даже Админка — попытай удачу прямо сейчас!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <button onClick={() => scrollTo('leaders')} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display font-bold uppercase text-primary-foreground shadow-[0_0_20px_rgba(255,138,30,0.5)] transition-transform hover:scale-105">
              <Icon name="Trophy" size={18} /> Таблица лидеров
            </button>
          </div>
        </div>

        <div className="flex justify-center animate-float">
          <Wheel onResult={handleResult} />
        </div>
      </section>

      {/* LEADERS */}
      <section id="leaders" className="container py-16">
        <SectionTitle icon="Trophy" sub="Зал славы">Самые удачливые игроки</SectionTitle>
        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {LEADERS.map((l, i) => (
            <div
              key={l.name}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-transform hover:scale-[1.02] ${
                i === 0
                  ? 'border-secondary bg-gradient-to-r from-secondary/15 to-transparent'
                  : 'border-border bg-card'
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold ${i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-display font-bold">{l.name}</div>
                <div className="text-sm text-muted-foreground">{l.emoji} {l.prize}</div>
              </div>
              <div className="font-display text-lg font-bold text-gold">{l.score.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BADGES */}
      <section id="badges" className="container py-16">
        <SectionTitle icon="Award" sub="Достижения">Значки и награды</SectionTitle>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {BADGES.map((b) => (
            <div
              key={b.title}
              className={`group flex flex-col items-center rounded-2xl border p-5 text-center transition-transform hover:scale-105 ${
                b.got ? 'border-primary/40 bg-card' : 'border-border bg-card/40 opacity-60'
              }`}
            >
              <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${b.got ? 'bg-primary text-primary-foreground shadow-[0_0_18px_rgba(255,138,30,0.5)]' : 'bg-muted text-muted-foreground'}`}>
                <Icon name={b.icon} size={26} />
              </div>
              <div className="font-display font-bold uppercase">{b.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{b.desc}</div>
              {b.got && (
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                  <Icon name="Check" size={12} /> Получено
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" className="container py-16">
        <SectionTitle icon="LifeBuoy" sub="Поддержка">Техническая поддержка</SectionTitle>
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { icon: 'Send', title: 'Telegram', val: '@snickers_2302' },
            { icon: 'Mail', title: 'Почта', val: 'support@snickers.ru' },
            { icon: 'MessageCircle', title: 'Чат', val: 'Онлайн 24/7' },
          ].map((c) => (
            <div key={c.title} className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-transform hover:scale-105">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon name={c.icon} size={24} />
              </div>
              <div className="font-display font-bold uppercase">{c.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.val}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        🎰 Колесо Фортуны • Канал <span className="text-gold">snickers_2302</span>
      </footer>

      {/* RESULT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass border-primary/40 text-center sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-3xl uppercase">
              {result?.label === 'Ничего' ? 'Почти!' : 'Поздравляем!'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {result?.label === 'Ничего' ? 'В этот раз не повезло — попробуй ещё раз!' : 'Твой выигрыш:'}
            </DialogDescription>
          </DialogHeader>
          <div className="animate-pop-in py-4">
            <div className="text-7xl">{result?.emoji}</div>
            <div className="mt-3 font-display text-4xl font-bold text-gold uppercase">{result?.label}</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="mx-auto rounded-full bg-primary px-8 py-3 font-display font-bold uppercase text-primary-foreground transition-transform hover:scale-105"
          >
            Забрать
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SectionTitle = ({ icon, sub, children }: { icon: string; sub: string; children: React.ReactNode }) => (
  <div className="text-center">
    <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
      <Icon name={icon} size={14} /> {sub}
    </span>
    <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">{children}</h2>
  </div>
);

export default Index;
