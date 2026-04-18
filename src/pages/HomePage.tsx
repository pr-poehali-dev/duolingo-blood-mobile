import { useState } from 'react';
import { User } from '@/lib/api';

interface HomePageProps {
  user: User;
}

const dailyGoalProgress = 65;

const courses = [
  {
    id: 1,
    emoji: '🇬🇧',
    title: 'Английский язык',
    subtitle: 'Уровень A2 → B1',
    progress: 42,
    color: 'from-blue-500 to-indigo-600',
    lessons: 24,
    xp: 1240,
  },
  {
    id: 2,
    emoji: '🔢',
    title: 'Математика',
    subtitle: 'Алгебра 8 класс',
    progress: 68,
    color: 'from-game-orange to-amber-500',
    lessons: 18,
    xp: 980,
  },
  {
    id: 3,
    emoji: '🧪',
    title: 'Химия',
    subtitle: 'Основы органики',
    progress: 15,
    color: 'from-game-teal to-emerald-500',
    lessons: 31,
    xp: 320,
  },
];

const achievements = [
  { emoji: '🔥', label: '7 дней подряд', unlocked: true },
  { emoji: '⚡', label: 'Быстрый старт', unlocked: true },
  { emoji: '💎', label: 'Коллекционер', unlocked: true },
  { emoji: '🏆', label: 'Топ 10%', unlocked: false },
  { emoji: '🌟', label: 'Перфекционист', unlocked: false },
];

export default function HomePage({ user }: HomePageProps) {
  const [streak] = useState(user.streak || 7);

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <p className="text-sm text-muted-foreground font-semibold">Добро пожаловать 👋</p>
          <h1 className="text-2xl font-black text-foreground">Привет, {user.name.split(' ')[0]}!</h1>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 border-2 border-orange-200 rounded-2xl px-3 py-2">
          <span className="text-xl animate-fire">🔥</span>
          <div>
            <p className="text-xs text-orange-500 font-bold leading-none">серия</p>
            <p className="text-lg font-black text-orange-500 leading-none">{streak}</p>
          </div>
        </div>
      </div>

      {/* Daily Goal Card */}
      <div className="animate-fade-in stagger-1 game-card p-5 bg-gradient-to-br from-primary/10 to-pink-50 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Дневная цель</p>
            <p className="text-lg font-black text-foreground">20 минут занятий</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-primary/15 rounded-full overflow-hidden">
            <div
              className="xp-bar h-full"
              style={{ width: `${dailyGoalProgress}%` }}
            />
          </div>
          <span className="text-sm font-black text-primary">{dailyGoalProgress}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Осталось 7 минут — ты почти у цели! 💪</p>
      </div>

      {/* My Courses */}
      <div className="animate-fade-in stagger-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-foreground">Мои курсы</h2>
          <button className="text-sm font-bold text-primary">Все →</button>
        </div>
        <div className="space-y-3">
          {courses.map((course, i) => (
            <div
              key={course.id}
              className={`game-card p-4 cursor-pointer animate-fade-in stagger-${i + 2}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                  {course.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-black text-foreground truncate">{course.title}</p>
                    <span className="text-xs font-bold text-muted-foreground ml-2 flex-shrink-0">{course.progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{course.subtitle}</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-700`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">📚 {course.lessons} уроков</span>
                <span className="text-xs text-muted-foreground">⭐ {course.xp} XP</span>
                <span className="ml-auto text-xs font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                  Продолжить
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="animate-fade-in stagger-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-foreground">Достижения</h2>
          <span className="text-xs font-bold text-muted-foreground bg-muted rounded-full px-2 py-1">3/5</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {achievements.map((a, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-2xl border-2 min-w-[70px] transition-all duration-200 ${
                a.unlocked
                  ? 'bg-white border-primary/30 shadow-md'
                  : 'bg-muted/50 border-border opacity-50 grayscale'
              }`}
            >
              <span className={`text-2xl ${a.unlocked ? 'bounce-in' : ''}`}>{a.emoji}</span>
              <p className="text-[9px] font-bold text-center text-muted-foreground leading-tight">{a.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}