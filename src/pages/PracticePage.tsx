import { useState } from 'react';
import Icon from '@/components/ui/icon';

type PracticeView = 'list' | 'quiz' | 'result';

const exercises = [
  {
    id: 1,
    emoji: '📝',
    type: 'Тест',
    title: 'Времена глаголов',
    subject: 'Английский',
    difficulty: 'Лёгкий',
    diffColor: 'text-green-600 bg-green-50 border-green-200',
    xp: 30,
    time: '5 мин',
    questions: 10,
  },
  {
    id: 2,
    emoji: '🧮',
    type: 'Упражнение',
    title: 'Квадратные уравнения',
    subject: 'Математика',
    difficulty: 'Средний',
    diffColor: 'text-orange-600 bg-orange-50 border-orange-200',
    xp: 50,
    time: '10 мин',
    questions: 8,
  },
  {
    id: 3,
    emoji: '🔬',
    type: 'Тест',
    title: 'Периодическая таблица',
    subject: 'Химия',
    difficulty: 'Сложный',
    diffColor: 'text-red-600 bg-red-50 border-red-200',
    xp: 80,
    time: '15 мин',
    questions: 15,
  },
  {
    id: 4,
    emoji: '✍️',
    type: 'Письмо',
    title: 'Диктант: предлоги',
    subject: 'Русский',
    difficulty: 'Лёгкий',
    diffColor: 'text-green-600 bg-green-50 border-green-200',
    xp: 25,
    time: '7 мин',
    questions: 12,
  },
];

const quizQuestions = [
  {
    question: 'Выберите правильное время глагола:',
    text: 'She ___ to school every day.',
    options: ['go', 'goes', 'going', 'went'],
    correct: 1,
  },
  {
    question: 'Какое слово означает "книга"?',
    text: 'Переведите слово: "book"',
    options: ['стол', 'ручка', 'книга', 'окно'],
    correct: 2,
  },
  {
    question: 'Выберите правильный вариант:',
    text: 'I ___ a student.',
    options: ['am', 'is', 'are', 'be'],
    correct: 0,
  },
];

export default function PracticePage() {
  const [view, setView] = useState<PracticeView>('list');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [filter, setFilter] = useState<'all' | 'test' | 'exercise'>('all');

  const filtered = exercises.filter(e =>
    filter === 'all' ? true : filter === 'test' ? e.type === 'Тест' : e.type === 'Упражнение'
  );

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === quizQuestions[currentQ].correct;
    setTimeout(() => {
      setAnswers(prev => [...prev, isCorrect]);
      if (currentQ + 1 < quizQuestions.length) {
        setCurrentQ(q => q + 1);
        setSelected(null);
      } else {
        setView('result');
      }
    }, 800);
  };

  const resetQuiz = () => {
    setView('list');
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
  };

  if (view === 'result') {
    const correct = answers.filter(Boolean).length;
    const pct = Math.round((correct / quizQuestions.length) * 100);
    return (
      <div className="pb-24 pt-8 px-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="game-card p-8 text-center w-full animate-bounce-in">
          <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}</div>
          <h2 className="text-2xl font-black mb-1">
            {pct >= 80 ? 'Отлично!' : pct >= 50 ? 'Хороший результат!' : 'Продолжай стараться!'}
          </h2>
          <p className="text-muted-foreground mb-6">Ты ответил правильно на {correct} из {quizQuestions.length} вопросов</p>
          <div className="text-5xl font-black text-gradient-purple mb-2">{pct}%</div>
          <div className="h-4 bg-muted rounded-full overflow-hidden mb-4">
            <div className="xp-bar h-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-center gap-2 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 mb-6">
            <span className="text-xl">⭐</span>
            <span className="font-black text-yellow-600">+{pct >= 80 ? 30 : pct >= 50 ? 20 : 10} XP получено!</span>
          </div>
          <button
            onClick={resetQuiz}
            className="w-full py-3 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-opacity"
          >
            К упражнениям
          </button>
        </div>
      </div>
    );
  }

  if (view === 'quiz') {
    const q = quizQuestions[currentQ];
    const progress = ((currentQ) / quizQuestions.length) * 100;
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <button onClick={resetQuiz} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div className="xp-bar h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-bold text-muted-foreground">{currentQ + 1}/{quizQuestions.length}</span>
        </div>

        <div className="game-card p-6 mb-6 animate-fade-in">
          <p className="text-sm font-bold text-primary mb-2">{q.question}</p>
          <p className="text-xl font-black text-foreground">{q.text}</p>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let style = 'border-border bg-white hover:border-primary/50 hover:bg-primary/5';
            if (selected !== null) {
              if (idx === q.correct) style = 'border-green-400 bg-green-50';
              else if (idx === selected && selected !== q.correct) style = 'border-red-400 bg-red-50';
              else style = 'border-border bg-white opacity-50';
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all duration-200 flex items-center gap-3 ${style}`}
              >
                <span className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-sm font-black flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
                {selected !== null && idx === q.correct && <span className="ml-auto">✅</span>}
                {selected !== null && idx === selected && selected !== q.correct && <span className="ml-auto">❌</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-5">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-black text-foreground">Практика ⚡</h1>
        <p className="text-sm text-muted-foreground">Прокачивай навыки каждый день</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in stagger-1">
        {[
          { emoji: '✅', value: '12', label: 'Выполнено' },
          { emoji: '🎯', value: '87%', label: 'Точность' },
          { emoji: '⚡', value: '340', label: 'XP сегодня' },
        ].map((s, i) => (
          <div key={i} className="game-card p-3 text-center">
            <span className="text-xl">{s.emoji}</span>
            <p className="font-black text-lg text-foreground leading-tight">{s.value}</p>
            <p className="text-[10px] text-muted-foreground font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 animate-fade-in stagger-2">
        {(['all', 'test', 'exercise'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
              filter === f
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-white border-2 border-border text-muted-foreground hover:border-primary/30'
            }`}
          >
            {f === 'all' ? 'Все' : f === 'test' ? 'Тесты' : 'Упражнения'}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      <div className="space-y-3">
        {filtered.map((ex, i) => (
          <div key={ex.id} className={`game-card p-4 cursor-pointer animate-fade-in stagger-${i + 2}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                {ex.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${ex.diffColor}`}>
                    {ex.difficulty}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">{ex.subject}</span>
                </div>
                <p className="font-black text-foreground">{ex.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-muted-foreground">⏱ {ex.time}</span>
                  <span className="text-xs text-muted-foreground">❓ {ex.questions} вопросов</span>
                  <span className="text-xs font-bold text-yellow-600">⭐ +{ex.xp} XP</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setView('quiz')}
              className="w-full mt-3 py-2.5 bg-primary text-primary-foreground font-black rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              Начать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
