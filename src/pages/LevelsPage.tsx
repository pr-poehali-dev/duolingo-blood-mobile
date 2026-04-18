import { useState } from 'react';
import Icon from '@/components/ui/icon';

type LevelStatus = 'locked' | 'available' | 'completed' | 'perfect';

interface Level {
  id: number;
  title: string;
  emoji: string;
  status: LevelStatus;
  xp: number;
  stars: number;
  subject: string;
}

const worlds = [
  {
    id: 1,
    name: 'Мир 1: Алфавит',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    emoji: '🔤',
    levels: [
      { id: 1, title: 'Буквы A-F', emoji: '🅰️', status: 'perfect' as LevelStatus, xp: 30, stars: 3, subject: 'Английский' },
      { id: 2, title: 'Буквы G-M', emoji: '📝', status: 'perfect' as LevelStatus, xp: 30, stars: 3, subject: 'Английский' },
      { id: 3, title: 'Буквы N-S', emoji: '✍️', status: 'completed' as LevelStatus, xp: 30, stars: 2, subject: 'Английский' },
      { id: 4, title: 'Буквы T-Z', emoji: '🔡', status: 'available' as LevelStatus, xp: 30, stars: 0, subject: 'Английский' },
    ]
  },
  {
    id: 2,
    name: 'Мир 2: Числа',
    color: 'from-orange-400 to-amber-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    emoji: '🔢',
    levels: [
      { id: 5, title: 'Числа 1-10', emoji: '1️⃣', status: 'locked' as LevelStatus, xp: 40, stars: 0, subject: 'Математика' },
      { id: 6, title: 'Числа 11-100', emoji: '💯', status: 'locked' as LevelStatus, xp: 40, stars: 0, subject: 'Математика' },
      { id: 7, title: 'Дроби', emoji: '½', status: 'locked' as LevelStatus, xp: 50, stars: 0, subject: 'Математика' },
      { id: 8, title: 'Уравнения', emoji: '🧮', status: 'locked' as LevelStatus, xp: 60, stars: 0, subject: 'Математика' },
    ]
  },
  {
    id: 3,
    name: 'Мир 3: Природа',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    emoji: '🌿',
    levels: [
      { id: 9, title: 'Животные', emoji: '🦁', status: 'locked' as LevelStatus, xp: 35, stars: 0, subject: 'Биология' },
      { id: 10, title: 'Растения', emoji: '🌺', status: 'locked' as LevelStatus, xp: 35, stars: 0, subject: 'Биология' },
      { id: 11, title: 'Экосистемы', emoji: '🌍', status: 'locked' as LevelStatus, xp: 45, stars: 0, subject: 'Биология' },
      { id: 12, title: 'Биосфера', emoji: '🔬', status: 'locked' as LevelStatus, xp: 55, stars: 0, subject: 'Биология' },
    ]
  },
];

const levelQuestions = [
  {
    question: 'Как переводится слово?',
    text: '"Apple" — это...',
    options: ['Апельсин', 'Яблоко', 'Груша', 'Банан'],
    correct: 1,
  },
  {
    question: 'Выбери правильный перевод:',
    text: '"Dog" — это...',
    options: ['Кот', 'Птица', 'Собака', 'Рыба'],
    correct: 2,
  },
  {
    question: 'Что означает это слово?',
    text: '"Book" — это...',
    options: ['Ручка', 'Тетрадь', 'Стол', 'Книга'],
    correct: 3,
  },
  {
    question: 'Переведи слово:',
    text: '"Sun" — это...',
    options: ['Луна', 'Звезда', 'Солнце', 'Небо'],
    correct: 2,
  },
  {
    question: 'Выбери верный вариант:',
    text: '"Water" — это...',
    options: ['Огонь', 'Земля', 'Воздух', 'Вода'],
    correct: 3,
  },
];

type View = 'map' | 'game' | 'result';

export default function LevelsPage() {
  const [view, setView] = useState<View>('map');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [hearts, setHearts] = useState(3);
  const [worldLevels, setWorldLevels] = useState(worlds);

  const startLevel = (level: Level) => {
    if (level.status === 'locked') return;
    setCurrentLevel(level);
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setHearts(3);
    setView('game');
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === levelQuestions[currentQ % levelQuestions.length].correct;
    if (!isCorrect) setHearts(h => h - 1);
    setTimeout(() => {
      const newAnswers = [...answers, isCorrect];
      if (currentQ + 1 >= 5 || (!isCorrect && hearts <= 1)) {
        setAnswers(newAnswers);
        setView('result');
      } else {
        setAnswers(newAnswers);
        setCurrentQ(q => q + 1);
        setSelected(null);
      }
    }, 700);
  };

  const finishLevel = (passed: boolean) => {
    if (passed && currentLevel) {
      const correct = answers.filter(Boolean).length + 1;
      const stars = correct >= 5 ? 3 : correct >= 4 ? 2 : 1;
      setWorldLevels(prev => prev.map(world => ({
        ...world,
        levels: world.levels.map((lvl, idx) => {
          if (lvl.id === currentLevel.id) {
            return { ...lvl, status: stars === 3 ? 'perfect' : 'completed', stars };
          }
          if (lvl.id === currentLevel.id + 1 && lvl.status === 'locked') {
            return { ...lvl, status: 'available' };
          }
          return lvl;
        })
      })));
    }
    setView('map');
    setCurrentLevel(null);
  };

  // RESULT VIEW
  if (view === 'result') {
    const correct = answers.filter(Boolean).length;
    const passed = correct >= 3 && hearts > 0;
    const stars = correct >= 5 ? 3 : correct >= 4 ? 2 : correct >= 3 ? 1 : 0;
    return (
      <div className="pb-24 pt-8 px-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="game-card p-8 text-center w-full animate-bounce-in">
          <div className="text-6xl mb-2">{passed ? '🎉' : '💀'}</div>
          <h2 className="text-2xl font-black mb-1">{passed ? 'Уровень пройден!' : 'Попробуй ещё раз!'}</h2>
          <p className="text-muted-foreground text-sm mb-5">{passed ? `Ты ответил правильно на ${correct} из 5 вопросов` : 'Закончились жизни! Не сдавайся!'}</p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1,2,3].map(s => (
              <span key={s} className={`text-4xl transition-all duration-300 ${s <= stars ? 'opacity-100 scale-110' : 'opacity-20 grayscale'}`}>⭐</span>
            ))}
          </div>

          {passed && (
            <div className="flex items-center justify-center gap-2 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 mb-5">
              <span className="text-xl">✨</span>
              <span className="font-black text-yellow-600">+{currentLevel?.xp || 30} XP получено!</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setCurrentQ(0); setSelected(null); setAnswers([]); setHearts(3); setView('game'); }}
              className="flex-1 py-3 border-2 border-border rounded-2xl font-black text-sm hover:bg-muted transition-colors"
            >
              🔄 Ещё раз
            </button>
            <button
              onClick={() => finishLevel(passed)}
              className="flex-1 py-3 bg-primary text-primary-foreground font-black text-sm rounded-2xl hover:opacity-90 transition-opacity"
            >
              {passed ? '→ Далее' : '🗺️ Карта'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GAME VIEW
  if (view === 'game' && currentLevel) {
    const q = levelQuestions[currentQ % levelQuestions.length];
    const progress = (currentQ / 5) * 100;
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-5 animate-fade-in">
          <button onClick={() => setView('map')} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Icon name="X" size={20} />
          </button>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div className="xp-bar h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-1">
            {[1,2,3].map(h => (
              <span key={h} className={`text-xl transition-all ${h <= hearts ? 'opacity-100' : 'opacity-20 grayscale'}`}>❤️</span>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="game-card p-6 mb-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{currentLevel.emoji}</span>
            <p className="text-xs font-bold text-primary uppercase tracking-wider">{q.question}</p>
          </div>
          <p className="text-xl font-black text-foreground">{q.text}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, idx) => {
            let style = 'border-border bg-white hover:border-primary/50 hover:bg-primary/5';
            if (selected !== null) {
              if (idx === q.correct) style = 'border-green-400 bg-green-50';
              else if (idx === selected && selected !== q.correct) style = 'border-red-400 bg-red-50';
              else style = 'border-border bg-white opacity-40';
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all duration-200 text-center ${style}`}
              >
                {selected !== null && idx === q.correct && <span className="block text-xl mb-1">✅</span>}
                {selected !== null && idx === selected && selected !== q.correct && <span className="block text-xl mb-1">❌</span>}
                {opt}
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 font-semibold">Вопрос {currentQ + 1} из 5</p>
      </div>
    );
  }

  // MAP VIEW
  const totalCompleted = worldLevels.flatMap(w => w.levels).filter(l => l.status === 'completed' || l.status === 'perfect').length;
  const totalLevels = worldLevels.flatMap(w => w.levels).length;

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-black text-foreground">Карта уровней 🗺️</h1>
        <p className="text-sm text-muted-foreground">Пройдено {totalCompleted} из {totalLevels} уровней</p>
      </div>

      {/* Progress */}
      <div className="animate-fade-in stagger-1 game-card p-4 bg-gradient-to-r from-primary/10 to-game-pink/10 border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-black text-primary">Общий прогресс</span>
          <span className="text-sm font-black text-primary">{Math.round((totalCompleted / totalLevels) * 100)}%</span>
        </div>
        <div className="h-3 bg-primary/15 rounded-full overflow-hidden">
          <div className="xp-bar h-full transition-all duration-700" style={{ width: `${(totalCompleted / totalLevels) * 100}%` }} />
        </div>
      </div>

      {/* Worlds */}
      {worldLevels.map((world, wi) => (
        <div key={world.id} className={`animate-fade-in stagger-${wi + 2}`}>
          {/* World header */}
          <div className={`flex items-center gap-3 p-4 rounded-3xl bg-gradient-to-r ${world.color} text-white mb-4 shadow-lg`}>
            <span className="text-3xl">{world.emoji}</span>
            <div>
              <p className="font-black text-lg leading-tight">{world.name}</p>
              <p className="text-xs opacity-80">{world.levels.filter(l => l.status !== 'locked').length}/{world.levels.length} уровней открыто</p>
            </div>
          </div>

          {/* Level path */}
          <div className="relative">
            {/* Connecting path */}
            <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-border -translate-x-1/2 -z-0" />

            <div className="space-y-4 relative z-10">
              {world.levels.map((level, li) => {
                const isLeft = li % 2 === 0;
                const statusConfig = {
                  perfect: { bg: 'bg-gradient-to-br from-yellow-400 to-orange-500', ring: 'ring-yellow-300', emoji: '⭐', textColor: 'text-white' },
                  completed: { bg: 'bg-gradient-to-br from-primary to-game-pink', ring: 'ring-primary/40', emoji: '✅', textColor: 'text-white' },
                  available: { bg: 'bg-gradient-to-br from-game-teal to-cyan-400', ring: 'ring-teal-300', emoji: level.emoji, textColor: 'text-white' },
                  locked: { bg: 'bg-muted', ring: 'ring-border', emoji: '🔒', textColor: 'text-muted-foreground' },
                }[level.status];

                return (
                  <div key={level.id} className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Level button */}
                    <button
                      onClick={() => startLevel(level)}
                      disabled={level.status === 'locked'}
                      className={`w-16 h-16 rounded-2xl ${statusConfig.bg} ring-4 ${statusConfig.ring} flex items-center justify-center text-2xl shadow-lg transition-all duration-200 ${level.status !== 'locked' ? 'hover:scale-110 active:scale-95' : 'cursor-not-allowed opacity-60'} flex-shrink-0`}
                    >
                      {statusConfig.emoji}
                    </button>

                    {/* Level info card */}
                    <div className={`flex-1 game-card p-3 ${level.status === 'locked' ? 'opacity-50' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-sm text-foreground">{level.title}</p>
                          <p className="text-xs text-muted-foreground">{level.subject} · +{level.xp} XP</p>
                        </div>
                        {level.status !== 'locked' && (
                          <div className="flex gap-0.5">
                            {[1,2,3].map(s => (
                              <span key={s} className={`text-sm ${s <= level.stars ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
                            ))}
                          </div>
                        )}
                        {level.status === 'available' && (
                          <span className="text-xs font-black text-game-teal bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 ml-1">Играть!</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
