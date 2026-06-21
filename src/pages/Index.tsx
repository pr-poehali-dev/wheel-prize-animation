import { useState, useEffect, useCallback } from 'react';
import Wheel, { Prize, PRIZES } from '@/components/Wheel';
import Icon from '@/components/ui/icon';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

const WHEEL_URL = 'https://functions.poehali.dev/32c5d589-3586-43bb-8635-6c9eed9dcab0';
const SUPPORT_LINK = 'https://max.ru/u/f9LHodD0cOKItwuq1SNZZJz4bHh_L2fcdvoEJOMq5JdCTbGQC3c3cUvDxHc';
const SPIN_COST = 10;

const BADGES = [
  { icon: 'Flame', title: 'Первый приз', desc: 'Выиграй впервые' },
  { icon: 'Zap', title: 'Легенда', desc: 'Получи Админку' },
  { icon: 'Repeat', title: 'Завсегдатай', desc: '50 участий' },
  { icon: 'Gift', title: 'Коллекционер', desc: 'Собери все призы' },
  { icon: 'Trophy', title: 'Топ-1', desc: 'Возглавь таблицу' },
  { icon: 'Star', title: 'Удачливый', desc: 'Редкий приз' },
];

interface FeedItem { id: number; prize: Prize; time: string; }
let feedCounter = 0;

const Index = () => {
  const [username, setUsername] = useState(() => localStorage.getItem('wheel_username') || '');
  const [usernameInput, setUsernameInput] = useState('');
  const [bricks, setBricks] = useState<number | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [result, setResult] = useState<Prize | null>(null);
  const [open, setOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinError, setSpinError] = useState('');

  const loadBalance = useCallback(async (name: string) => {
    try {
      const r = await fetch(`${WHEEL_URL}?username=${encodeURIComponent(name)}`);
      const d = await r.json();
      if (d.bricks !== undefined) setBricks(d.bricks);
    } catch (_) { /* ignore */ }
  }, []);

  useEffect(() => {
    if (username) loadBalance(username);
  }, [username, loadBalance]);

  const handleSetUsername = () => {
    const name = usernameInput.trim();
    if (!name) return;
    setUsername(name);
    localStorage.setItem('wheel_username', name);
    loadBalance(name);
  };

  const handlePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoMsg(null);
    try {
      const r = await fetch(`${WHEEL_URL}/promo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code: promoCode.trim() }),
      });
      const d = await r.json();
      if (d.ok) {
        setBricks(d.bricks);
        setPromoMsg({ text: `+${d.added} бриков начислено!`, ok: true });
        setPromoCode('');
      } else {
        setPromoMsg({ text: d.error || 'Ошибка', ok: false });
      }
    } catch {
      setPromoMsg({ text: 'Ошибка сети', ok: false });
    }
    setPromoLoading(false);
  };

  const handleSpin = async (localPrize: Prize) => {
    if (!username) return;
    setSpinError('');
    try {
      const r = await fetch(`${WHEEL_URL}/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const d = await r.json();
      if (d.prize) {
        setBricks(d.bricks);
        setResult(d.prize as Prize);
        setOpen(true);
        const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        setFeed(prev => [{ id: ++feedCounter, prize: d.prize as Prize, time }, ...prev].slice(0, 10));
      } else {
        setSpinError(d.error || 'Ошибка');
      }
    } catch {
      setSpinError('Ошибка сети');
    }
    setSpinning(false);
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const canSpin = !!username && bricks !== null && bricks >= SPIN_COST;

  if (!username) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <div className="text-6xl animate-float">🎰</div>
        <h1 className="font-display text-4xl font-bold uppercase text-center">
          Введи свой <span className="text-gold">ник</span>
        </h1>
        <p className="text-muted-foreground text-center max-w-xs">
          Чтобы начать крутить колесо и копить брики — укажи свой ник из канала
        </p>
        <div className="flex w-full max-w-sm gap-2">
          <input
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 font-sans text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="Твой ник..."
            value={usernameInput}
            onChange={e => setUsernameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSetUsername()}
          />
          <button
            onClick={handleSetUsername}
            className="rounded-xl bg-primary px-5 py-3 font-display font-bold uppercase text-primary-foreground shadow-[0_0_20px_rgba(255,138,30,0.4)] transition-transform hover:scale-105"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-40 glass">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="text-2xl">🎰</span>
            <span className="text-gold">snickers_2302</span>
          </div>
          {/* Баланс + ник */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5 font-display font-bold text-gold">
              <span>🧱</span>
              <span>{bricks ?? '...'}</span>
              <span className="font-sans text-xs font-normal text-muted-foreground">бриков</span>
            </div>
            <button
              onClick={() => { setUsername(''); localStorage.removeItem('wheel_username'); }}
              className="hidden items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:flex"
            >
              <Icon name="LogOut" size={14} /> {username}
            </button>
          </div>
        </div>
      </header>

      {/* NAV LINKS */}
      <div className="container flex justify-center gap-6 py-3 text-sm font-medium text-muted-foreground">
        <button onClick={() => scrollTo('play')} className="transition-colors hover:text-primary">Играть</button>
        <button onClick={() => scrollTo('leaders')} className="transition-colors hover:text-primary">Лидеры</button>
        <button onClick={() => scrollTo('badges')} className="transition-colors hover:text-primary">Достижения</button>
        <button onClick={() => scrollTo('support')} className="transition-colors hover:text-primary">Поддержка</button>
      </div>

      {/* HERO */}
      <section className="container py-6 text-center">
        <h1 className="font-display text-5xl font-bold uppercase leading-none sm:text-6xl">
          Крути и <span className="text-gold">выигрывай</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          1 спин = {SPIN_COST} бриков. Вводи промокоды и пополняй баланс!
        </p>
      </section>

      {/* PROMO */}
      <section className="container max-w-sm py-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase text-muted-foreground">
            <Icon name="Ticket" size={15} /> Ввести промокод
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm uppercase placeholder:normal-case placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Введи код..."
              value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handlePromo()}
            />
            <button
              onClick={handlePromo}
              disabled={promoLoading || !promoCode.trim()}
              className="rounded-xl bg-primary px-4 py-2 font-display text-sm font-bold uppercase text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
            >
              {promoLoading ? <Icon name="Loader2" size={16} className="animate-spin" /> : 'Активировать'}
            </button>
          </div>
          {promoMsg && (
            <p className={`mt-2 text-xs font-semibold ${promoMsg.ok ? 'text-green-400' : 'text-red-400'}`}>
              {promoMsg.ok ? '✅' : '❌'} {promoMsg.text}
            </p>
          )}
        </div>
      </section>

      {/* PLAY */}
      <section id="play" className="container py-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">

          {/* Колесо */}
          <div className="flex flex-col items-center gap-4">
            <div className={canSpin ? 'animate-float' : 'opacity-60'}>
              <Wheel
                onResult={handleSpin}
                disabled={!canSpin || spinning}
                onSpinStart={() => setSpinning(true)}
              />
            </div>
            {!canSpin && (
              <div className="rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-2 text-center text-sm text-secondary">
                {bricks === 0 || (bricks !== null && bricks < SPIN_COST)
                  ? `Нужно минимум ${SPIN_COST} бриков — введи промокод!`
                  : 'Загрузка...'}
              </div>
            )}
            {spinError && (
              <p className="text-sm font-semibold text-red-400">❌ {spinError}</p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {PRIZES.filter(p => p.label !== 'Ничего').map(p => (
                <span key={p.label} className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-sm">
                  {p.emoji} <span className="font-semibold">{p.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Лента результатов */}
          <div>
            <div className="mb-4 flex items-center gap-2 font-display text-lg font-bold uppercase">
              <Icon name="Activity" size={20} className="text-primary" />
              Лента результатов
              {feed.length > 0 && (
                <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 font-sans text-xs font-normal text-primary">
                  {feed.length}
                </span>
              )}
            </div>
            {feed.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-14 text-center">
                <div className="mb-3 text-4xl">🎰</div>
                <div className="font-display font-bold uppercase">Покрути колесо!</div>
                <p className="mt-1 text-sm text-muted-foreground">Твои результаты появятся здесь</p>
              </div>
            ) : (
              <div className="space-y-2">
                {feed.map((item, i) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 rounded-xl border bg-card p-4 transition-all ${i === 0 ? 'animate-fade-in border-primary/40' : 'border-border opacity-80'}`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                      {item.prize.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-display font-bold uppercase">{item.prize.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.prize.label === 'Ничего' ? 'Не повезло — попробуй ещё!' : 'Поздравляем!'}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground">{item.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LEADERS */}
      <section id="leaders" className="container py-16">
        <SectionTitle icon="Trophy" sub="Зал славы">Самые удачливые игроки</SectionTitle>
        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center rounded-2xl border border-dashed border-border bg-card/40 py-14 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Icon name="Trophy" size={30} />
          </div>
          <div className="font-display text-xl font-bold uppercase">Скоро здесь появятся победители</div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">Таблица заполнится после первых розыгрышей.</p>
        </div>
      </section>

      {/* BADGES */}
      <section id="badges" className="container py-16">
        <SectionTitle icon="Award" sub="Достижения">Значки и награды</SectionTitle>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {BADGES.map((b) => (
            <div key={b.title} className="flex flex-col items-center rounded-2xl border border-border bg-card/40 p-5 text-center opacity-70 transition-transform hover:scale-105 hover:opacity-100">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon name={b.icon} size={26} />
              </div>
              <div className="font-display font-bold uppercase">{b.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{b.desc}</div>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Icon name="Lock" size={12} /> Закрыто
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" className="container py-16">
        <SectionTitle icon="LifeBuoy" sub="Поддержка">Техническая поддержка</SectionTitle>
        <div className="mx-auto mt-8 max-w-md">
          <a href={SUPPORT_LINK} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center rounded-2xl border border-primary/40 bg-card p-8 text-center transition-transform hover:scale-105">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon name="MessageCircle" size={28} />
            </div>
            <div className="font-display text-xl font-bold uppercase">Написать в поддержку</div>
            <p className="mt-2 text-sm text-muted-foreground">Возникли вопросы? Напишем — поможем!</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 font-display font-bold uppercase text-primary-foreground">
              <Icon name="Send" size={16} /> Открыть чат
            </span>
          </a>
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
              {result?.label === 'Ничего' ? 'В этот раз не повезло — крути ещё!' : 'Твой выигрыш:'}
            </DialogDescription>
          </DialogHeader>
          <div className="animate-pop-in py-4">
            <div className="text-7xl">{result?.emoji}</div>
            <div className="mt-3 font-display text-4xl font-bold uppercase text-gold">{result?.label}</div>
            {bricks !== null && (
              <div className="mt-3 text-sm text-muted-foreground">Остаток: 🧱 {bricks} бриков</div>
            )}
          </div>
          <button onClick={() => setOpen(false)}
            className="mx-auto rounded-full bg-primary px-8 py-3 font-display font-bold uppercase text-primary-foreground transition-transform hover:scale-105">
            {result?.label === 'Ничего' ? 'Попробовать снова' : 'Забрать!'}
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