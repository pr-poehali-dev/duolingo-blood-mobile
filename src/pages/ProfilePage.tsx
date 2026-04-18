import { useState } from 'react';
import Icon from '@/components/ui/icon';

const stats = [
  { emoji: '📚', value: '47', label: 'Уроков' },
  { emoji: '⚡', value: '3 240', label: 'XP всего' },
  { emoji: '🔥', value: '7', label: 'Дней подряд' },
  { emoji: '🏆', value: '12', label: 'Достижений' },
];

const weekActivity = [40, 80, 60, 100, 75, 90, 65];
const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const achievements = [
  { emoji: '🔥', title: 'Неделя огня', desc: '7 дней подряд', unlocked: true },
  { emoji: '⚡', title: 'Быстрый старт', desc: 'Первые 3 урока', unlocked: true },
  { emoji: '💎', title: 'Коллекционер', desc: '10 курсов', unlocked: true },
  { emoji: '🌟', title: 'Перфекционист', desc: '100% в тесте', unlocked: false },
  { emoji: '🚀', title: 'К звёздам', desc: '50 уроков', unlocked: false },
  { emoji: '👑', title: 'Чемпион', desc: 'Топ 1%', unlocked: false },
];

type Section = 'stats' | 'settings';

export default function ProfilePage() {
  const [section, setSection] = useState<Section>('stats');
  const [name, setName] = useState('Алексей Смирнов');
  const [dailyGoal, setDailyGoal] = useState(20);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [reminders, setReminders] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);

  const level = 12;
  const xpCurrent = 3240;
  const xpNext = 3500;
  const xpPct = Math.round((xpCurrent / xpNext) * 100);

  const saveName = () => {
    setName(tempName);
    setEditingName(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-5">
      {/* Profile card */}
      <div className="animate-fade-in game-card p-5 bg-gradient-to-br from-primary/10 via-pink-50 to-orange-50 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-game-pink flex items-center justify-center text-4xl shadow-lg">
              🧑‍🎓
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-game-green rounded-xl flex items-center justify-center text-xs font-black text-white shadow">
              {level}
            </div>
          </div>
          <div className="flex-1">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="flex-1 text-lg font-black border-2 border-primary rounded-xl px-2 py-1 outline-none bg-white"
                  autoFocus
                />
                <button onClick={saveName} className="p-2 bg-primary text-primary-foreground rounded-xl">
                  <Icon name="Check" size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-foreground">{name}</h2>
                <button onClick={() => setEditingName(true)} className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon name="Pencil" size={14} />
                </button>
              </div>
            )}
            <p className="text-sm text-muted-foreground font-semibold">Уровень {level} · Мастер знаний</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-primary font-bold">XP {xpCurrent}</span>
                <span className="text-muted-foreground">{xpNext} до ур. {level + 1}</span>
              </div>
              <div className="h-2.5 bg-primary/15 rounded-full overflow-hidden">
                <div className="xp-bar h-full" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 animate-fade-in stagger-1">
        {(['stats', 'settings'] as Section[]).map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex-1 py-2.5 rounded-2xl font-black text-sm transition-all duration-200 ${
              section === s
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-white border-2 border-border text-muted-foreground'
            }`}
          >
            {s === 'stats' ? '📊 Статистика' : '⚙️ Настройки'}
          </button>
        ))}
      </div>

      {section === 'stats' && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-2 animate-fade-in stagger-2">
            {stats.map((s, i) => (
              <div key={i} className="game-card p-3 text-center">
                <span className="text-xl">{s.emoji}</span>
                <p className="font-black text-sm text-foreground leading-tight mt-0.5">{s.value}</p>
                <p className="text-[9px] text-muted-foreground font-semibold leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly activity */}
          <div className="animate-fade-in stagger-3 game-card p-4">
            <h3 className="font-black text-foreground mb-4 flex items-center gap-2">
              📈 Активность за неделю
            </h3>
            <div className="flex items-end gap-2 h-20">
              {weekActivity.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-lg overflow-hidden bg-muted flex-1 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-game-pink rounded-lg transition-all duration-700"
                      style={{ height: `${val}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground font-bold">{dayLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="animate-fade-in stagger-4">
            <h3 className="font-black text-foreground mb-3 flex items-center justify-between">
              🏆 Достижения
              <span className="text-sm text-muted-foreground font-semibold">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </span>
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className={`game-card p-3 text-center transition-all duration-200 ${
                    !a.unlocked ? 'grayscale opacity-40' : ''
                  }`}
                >
                  <span className={`text-2xl block mb-1 ${a.unlocked ? 'bounce-in' : ''}`}>{a.emoji}</span>
                  <p className="text-xs font-black text-foreground leading-tight">{a.title}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {section === 'settings' && (
        <div className="space-y-3 animate-fade-in stagger-2">
          {/* Daily goal */}
          <div className="game-card p-4">
            <h3 className="font-black text-foreground mb-3 flex items-center gap-2">
              🎯 Дневная цель
            </h3>
            <div className="flex gap-2 flex-wrap">
              {[10, 15, 20, 30].map(min => (
                <button
                  key={min}
                  onClick={() => setDailyGoal(min)}
                  className={`px-4 py-2 rounded-xl font-black text-sm transition-all duration-200 ${
                    dailyGoal === min
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  {min} мин
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="game-card p-4 space-y-4">
            <h3 className="font-black text-foreground flex items-center gap-2">🔔 Уведомления</h3>
            {[
              { label: 'Напоминания о занятиях', value: notifications, set: setNotifications, emoji: '⏰' },
              { label: 'Звуковые эффекты', value: soundEffects, set: setSoundEffects, emoji: '🔊' },
              { label: 'Напоминание вечером', value: reminders, set: setReminders, emoji: '🌙' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <p className="font-semibold text-sm text-foreground">{item.label}</p>
                </div>
                <button
                  onClick={() => item.set(!item.value)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                    item.value ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                      item.value ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Account actions */}
          <div className="game-card p-4 space-y-1">
            <h3 className="font-black text-foreground mb-3 flex items-center gap-2">👤 Аккаунт</h3>
            {[
              { emoji: '🔑', label: 'Изменить пароль' },
              { emoji: '📧', label: 'Сменить email' },
              { emoji: '🌐', label: 'Язык интерфейса' },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
              >
                <span>{item.emoji}</span>
                <span className="font-semibold text-sm text-foreground flex-1">{item.label}</span>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>

          <button className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-500 font-black text-sm hover:bg-red-50 transition-colors">
            🚪 Выйти из аккаунта
          </button>
        </div>
      )}
    </div>
  );
}
