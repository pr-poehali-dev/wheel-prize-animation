import { useState } from 'react';
import Wheel, { Prize, PRIZES } from '@/components/Wheel';
import Icon from '@/components/ui/icon';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

const SUPPORT_LINK = 'https://max.ru/u/f9LHodD0cOKItwuq1SNZZJz4bHh_L2fcdvoEJOMq5JdCTbGQC3c3cUvDxHc';

const BADGES = [
  { icon: 'Flame', title: 'Первый приз', desc: 'Выиграй впервые' },
  { icon: 'Zap', title: 'Легенда', desc: 'Получи Админку' },
  { icon: 'Repeat', title: 'Завсегдатай', desc: '50 участий' },
  { icon: 'Gift', title: 'Коллекционер', desc: 'Собери все призы' },
  { icon: 'Trophy', title: 'Топ-1', desc: 'Возглавь таблицу' },
  { icon: 'Star', title: 'Удачливый', desc: 'Редкий приз' },
];

interface FeedItem {
  id: number;
  prize: Prize;
  time: string;
}

let feedCounter = 0;

const Index = () => {
  const [result, setResult] = useState<Prize | null>(null);
  const [open, setOpen] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const handleResult = (prize: Prize) => {
    setResult(prize);
    setOpen(true);
    const now = new Date();
    const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setFeed(prev => [{ id: ++feedCounter, prize, time }, ...prev].slice(0, 10));
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
            <button onClick={() => scrollTo('play')} className="transition-colors hover:text-primary">Играть</button>
            <button onClick={() => scrollTo('leaders')} className="transition-colors hover:text-primary">Лидеры</button>
            <button onClick={() => scrollTo('badges')} className="transition-colors hover:text-primary">Достижения</button>
            <button onClick={() => scrollTo('support')} className="transition-colors hover:text-primary">Поддержка</button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="container py-10 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
          <Icon name="Sparkles" size={14} /> Колесо Фортуны
        </span>
        <h1 className="font-display text-5xl font-bold uppercase leading-none sm:text-6xl lg:text-7xl">
          Крути и <span className="text-gold">выигрывай</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Эксклюзивные призы от канала — стикеры, VPN, промокоды и даже Админка!
        </p>
      </section>

      {/* PLAY — колесо + лента */}
      <section id="play" className="container py-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">

          {/* Колесо */}
          <div className="flex flex-col items-center gap-6">
            <div className="animate-float">
              <Wheel onResult={handleResult} />
            </div>
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
                    className={`flex items-center gap-4 rounded-xl border bg-card p-4 transition-all ${
                      i === 0 ? 'animate-fade-in border-primary/40' : 'border-border opacity-80'
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                      {item.prize.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-display font-bold uppercase">{item.prize.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.prize.label === 'Ничего' ? 'Не повезло — попробуй ещё!' : 'Поздравляем с выигрышем!'}
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
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Таблица заполнится реальными игроками после первых розыгрышей.
          </p>
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
          <a
            href={SUPPORT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center rounded-2xl border border-primary/40 bg-card p-8 text-center transition-transform hover:scale-105"
          >
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
          </div>
          <button
            onClick={() => setOpen(false)}
            className="mx-auto rounded-full bg-primary px-8 py-3 font-display font-bold uppercase text-primary-foreground transition-transform hover:scale-105"
          >
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
