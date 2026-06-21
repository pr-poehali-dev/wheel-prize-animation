import Icon from '@/components/ui/icon';

const SUPPORT_LINK = 'https://max.ru/u/f9LHodD0cOKItwuq1SNZZJz4bHh_L2fcdvoEJOMq5JdCTbGQC3c3cUvDxHc';

const PRIZES = [
  { label: 'Стикер', emoji: '🎟️', chance: '25%', desc: 'Эксклюзивный набор стикеров канала' },
  { label: 'VPN', emoji: '🛡️', chance: '15%', desc: 'Доступ к быстрому VPN' },
  { label: 'Промокод', emoji: '🎫', chance: '8%', desc: 'Скидочный промокод от партнёров' },
  { label: 'Админка', emoji: '⚡', chance: '0.1%', desc: 'Легендарный приз — права администратора' },
];

const BADGES = [
  { icon: 'Flame', title: 'Первый приз', desc: 'Выиграй впервые', got: false },
  { icon: 'Zap', title: 'Легенда', desc: 'Получи Админку', got: false },
  { icon: 'Repeat', title: 'Завсегдатай', desc: '50 участий', got: false },
  { icon: 'Gift', title: 'Коллекционер', desc: 'Собери все призы', got: false },
  { icon: 'Trophy', title: 'Топ-1', desc: 'Возглавь таблицу', got: false },
  { icon: 'Star', title: 'Удачливый', desc: 'Редкий приз', got: false },
];

const Index = () => {
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
            <button onClick={() => scrollTo('prizes')} className="transition-colors hover:text-primary">Призы</button>
            <button onClick={() => scrollTo('leaders')} className="transition-colors hover:text-primary">Лидеры</button>
            <button onClick={() => scrollTo('badges')} className="transition-colors hover:text-primary">Достижения</button>
            <button onClick={() => scrollTo('support')} className="transition-colors hover:text-primary">Поддержка</button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="container relative py-14 text-center md:py-20">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary animate-fade-in">
          <Icon name="Sparkles" size={14} /> Розыгрыши канала
        </span>
        <h1 className="font-display text-5xl font-bold uppercase leading-none sm:text-6xl lg:text-7xl animate-fade-in">
          Лента <span className="text-gold">призов</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground animate-fade-in">
          Эксклюзивные награды от канала snickers_2302. Участвуй в розыгрышах и забирай свой приз!
        </p>
      </section>

      {/* PRIZES FEED */}
      <section id="prizes" className="container py-12">
        <SectionTitle icon="Gift" sub="Лента призов">Что можно выиграть</SectionTitle>
        <div className="mx-auto mt-8 max-w-3xl space-y-4">
          {PRIZES.map((p, i) => (
            <div
              key={p.label}
              className="flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-transform hover:scale-[1.02] hover:border-primary/40 animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-4xl">
                {p.emoji}
              </div>
              <div className="flex-1">
                <div className="font-display text-xl font-bold uppercase">{p.label}</div>
                <div className="text-sm text-muted-foreground">{p.desc}</div>
              </div>
              <div className="shrink-0 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 font-display text-sm font-bold text-gold">
                {p.chance}
              </div>
            </div>
          ))}
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
            Таблица лидеров заполнится реальными игроками после первых розыгрышей.
          </p>
        </div>
      </section>

      {/* BADGES */}
      <section id="badges" className="container py-16">
        <SectionTitle icon="Award" sub="Достижения">Значки и награды</SectionTitle>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {BADGES.map((b) => (
            <div
              key={b.title}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card/40 p-5 text-center opacity-70 transition-transform hover:scale-105 hover:opacity-100"
            >
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
            <p className="mt-2 text-sm text-muted-foreground">Возникли вопросы? Напиши нам — поможем!</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 font-display font-bold uppercase text-primary-foreground">
              <Icon name="Send" size={16} /> Открыть чат
            </span>
          </a>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        🎰 Лента призов • Канал <span className="text-gold">snickers_2302</span>
      </footer>
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
