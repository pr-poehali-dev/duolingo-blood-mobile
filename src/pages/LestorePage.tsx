import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface App {
  id: number;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  category: string;
  rating: number;
  reviews: number;
  size: string;
  version: string;
  featured?: boolean;
  isInstalled?: boolean;
  badgeText?: string;
  badgeColor?: string;
  gradient: string;
  screenshots: string[];
}

const apps: App[] = [
  {
    id: 1,
    name: 'Дуолинго Кровавый',
    tagline: 'Учи или умри. Буквально.',
    description: 'Жёсткая версия Дуолинго — если пропустишь урок, Сова придёт ночью. Экстремальное обучение языкам: 0 пощады, 100% результат. Серия не прощает слабости.',
    emoji: '🦉',
    category: 'Образование',
    rating: 4.9,
    reviews: 142000,
    size: '48 МБ',
    version: '666.0',
    featured: true,
    badgeText: '🔥 ХИТ',
    badgeColor: 'bg-red-500',
    gradient: 'from-red-500 via-orange-500 to-yellow-400',
    screenshots: ['🗡️', '💀', '🩸'],
  },
  {
    id: 2,
    name: 'МозгоДрочер Pro',
    tagline: 'Прокачай мозг до предела',
    description: 'Интенсивные тренировки памяти и внимания. 500+ упражнений, нейронаука в действии.',
    emoji: '🧠',
    category: 'Тренировки',
    rating: 4.7,
    reviews: 38500,
    size: '32 МБ',
    version: '3.2.1',
    badgeText: '⭐ ТОП',
    badgeColor: 'bg-yellow-500',
    gradient: 'from-purple-500 to-pink-500',
    screenshots: ['💡', '🎯', '⚡'],
  },
  {
    id: 3,
    name: 'КвантоМатика',
    tagline: 'Математика — это круто',
    description: 'Игровые задачи по математике от школьной до университетской. ИИ-тренер адаптирует сложность.',
    emoji: '∑',
    category: 'Математика',
    rating: 4.6,
    reviews: 21000,
    size: '25 МБ',
    version: '2.0.4',
    gradient: 'from-blue-500 to-cyan-400',
    screenshots: ['🔢', '📐', '🧮'],
  },
  {
    id: 4,
    name: 'СловоМания',
    tagline: '10 000 слов за 30 дней',
    description: 'Метод интервальных повторений для запоминания иностранных слов. Поддержка 40+ языков.',
    emoji: '📚',
    category: 'Языки',
    rating: 4.5,
    reviews: 55000,
    size: '19 МБ',
    version: '5.1.0',
    gradient: 'from-green-400 to-teal-500',
    screenshots: ['🗣️', '🌐', '✅'],
  },
  {
    id: 5,
    name: 'ХимОгонь',
    tagline: 'Химия без занудства',
    description: 'Интерактивные опыты, периодическая таблица в 3D, реакции в AR. Для любителей взрывов.',
    emoji: '🧪',
    category: 'Науки',
    rating: 4.4,
    reviews: 9800,
    size: '61 МБ',
    version: '1.8.3',
    gradient: 'from-teal-400 to-green-500',
    screenshots: ['💥', '⚗️', '🔬'],
  },
];

type FilterCategory = 'all' | 'Образование' | 'Математика' | 'Языки' | 'Науки' | 'Тренировки';

export default function LestorePage() {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [installedIds, setInstalledIds] = useState<Set<number>>(new Set());
  const [installingId, setInstallingId] = useState<number | null>(null);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  const filtered = apps.filter(a => filter === 'all' || a.category === filter);

  const handleInstall = (app: App, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (installedIds.has(app.id)) return;
    setInstallingId(app.id);
    setTimeout(() => {
      setInstallingId(null);
      setInstalledIds(prev => new Set([...prev, app.id]));
    }, 1800);
  };

  const categories: FilterCategory[] = ['all', 'Образование', 'Языки', 'Математика', 'Науки', 'Тренировки'];

  // App detail modal
  if (selectedApp) {
    const isInstalled = installedIds.has(selectedApp.id);
    const isInstalling = installingId === selectedApp.id;
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto animate-fade-in">
        <button onClick={() => setSelectedApp(null)} className="flex items-center gap-2 text-primary font-bold mb-4 hover:opacity-70 transition-opacity">
          <Icon name="ArrowLeft" size={20} /> Назад в LESTORE
        </button>

        {/* App hero */}
        <div className={`rounded-3xl bg-gradient-to-br ${selectedApp.gradient} p-8 text-white text-center mb-5 shadow-xl`}>
          <div className="text-7xl mb-3">{selectedApp.emoji}</div>
          <h2 className="text-2xl font-black">{selectedApp.name}</h2>
          <p className="text-sm opacity-80 mt-1">{selectedApp.tagline}</p>
          {selectedApp.badgeText && (
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-black ${selectedApp.badgeColor} text-white`}>
              {selectedApp.badgeText}
            </span>
          )}
        </div>

        {/* Screenshots */}
        <div className="flex gap-3 mb-5 overflow-x-auto pb-2">
          {selectedApp.screenshots.map((sc, i) => (
            <div key={i} className={`flex-shrink-0 w-28 h-44 rounded-2xl bg-gradient-to-br ${selectedApp.gradient} opacity-80 flex items-center justify-center text-5xl shadow-md`}>
              {sc}
            </div>
          ))}
          {[...Array(3 - selectedApp.screenshots.length)].map((_, i) => (
            <div key={`extra-${i}`} className="flex-shrink-0 w-28 h-44 rounded-2xl bg-muted flex items-center justify-center text-3xl opacity-40">📱</div>
          ))}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Рейтинг', value: `${selectedApp.rating} ⭐` },
            { label: 'Отзывов', value: selectedApp.reviews.toLocaleString('ru') },
            { label: 'Размер', value: selectedApp.size },
          ].map((m, i) => (
            <div key={i} className="game-card p-3 text-center">
              <p className="font-black text-sm text-foreground">{m.value}</p>
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="game-card p-4 mb-5">
          <h3 className="font-black text-foreground mb-2">Описание</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{selectedApp.description}</p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <span className="text-xs bg-muted rounded-full px-3 py-1 font-semibold">{selectedApp.category}</span>
            <span className="text-xs bg-muted rounded-full px-3 py-1 font-semibold">v{selectedApp.version}</span>
          </div>
        </div>

        {/* Install */}
        <button
          onClick={() => handleInstall(selectedApp)}
          disabled={isInstalled || isInstalling}
          className={`w-full py-4 rounded-2xl font-black text-base transition-all duration-300 flex items-center justify-center gap-2 ${
            isInstalled
              ? 'bg-green-100 text-green-600 border-2 border-green-200'
              : `bg-gradient-to-r ${selectedApp.gradient} text-white shadow-lg hover:opacity-90`
          }`}
        >
          {isInstalling ? (
            <>
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Устанавливаю...
            </>
          ) : isInstalled ? (
            <>✅ Установлено</>
          ) : (
            <>⬇️ Установить бесплатно</>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🛒</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">LESTORE</h1>
            <p className="text-xs text-muted-foreground font-semibold">Лучшие учебные приложения</p>
          </div>
        </div>
      </div>

      {/* Featured: Duolingo Кровавый */}
      <div
        onClick={() => setSelectedApp(apps[0])}
        className="animate-fade-in stagger-1 cursor-pointer rounded-3xl overflow-hidden shadow-xl"
      >
        <div className="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 p-6 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-black mb-2">🔥 ВЫБОР РЕДАКЦИИ</span>
              <h2 className="text-xl font-black leading-tight">Дуолинго Кровавый</h2>
              <p className="text-sm opacity-90 mt-1">Учи или умри. Буквально.</p>
            </div>
            <div className="text-6xl ml-4 animate-float">🦉</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">⭐ 4.9</span>
              <span className="text-xs opacity-80">· 142K отзывов</span>
            </div>
            <button
              onClick={(e) => handleInstall(apps[0], e)}
              disabled={installedIds.has(1) || installingId === 1}
              className="px-5 py-2 bg-white text-red-500 font-black rounded-xl text-sm hover:bg-red-50 transition-colors disabled:opacity-70"
            >
              {installingId === 1 ? '...' : installedIds.has(1) ? '✅ Есть' : 'Установить'}
            </button>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="animate-fade-in stagger-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
              filter === cat
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-white border-2 border-border text-muted-foreground hover:border-primary/30'
            }`}
          >
            {cat === 'all' ? 'Все' : cat}
          </button>
        ))}
      </div>

      {/* App list */}
      <div className="space-y-3">
        {filtered.map((app, i) => {
          const isInstalled = installedIds.has(app.id);
          const isInstalling = installingId === app.id;
          return (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`animate-fade-in stagger-${Math.min(i + 2, 6)} game-card p-4 cursor-pointer`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
                  {app.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-black text-foreground truncate">{app.name}</p>
                    {app.badgeText && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full text-white flex-shrink-0 ${app.badgeColor}`}>
                        {app.badgeText}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-1">{app.tagline}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-yellow-500">⭐ {app.rating}</span>
                    <span className="text-xs text-muted-foreground">{app.size}</span>
                    <span className="text-xs text-muted-foreground">{app.category}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleInstall(app, e)}
                  disabled={isInstalled || isInstalling}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl font-black text-xs transition-all duration-200 ${
                    isInstalled
                      ? 'bg-green-100 text-green-600'
                      : isInstalling
                        ? 'bg-primary/20 text-primary'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {isInstalling ? (
                    <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin block" />
                  ) : isInstalled ? '✅' : '⬇️'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom banner */}
      <div className="animate-fade-in game-card p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 text-center">
        <p className="text-xs text-muted-foreground font-semibold">🛒 LESTORE · Все приложения бесплатны</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Образование должно быть доступным каждому</p>
      </div>
    </div>
  );
}
