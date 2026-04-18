import { useState, useEffect } from 'react';

const reminders = [
  {
    emoji: '🦉',
    title: 'Сова знает, где ты живёшь',
    message: 'Ты не занимался сегодня. Это очень. Очень. Плохо.',
    buttonText: 'Срочно учиться!',
    buttonColor: 'bg-red-500 hover:bg-red-600',
    bgColor: 'from-red-50 to-orange-50',
    borderColor: 'border-red-200',
    vibe: 'blood',
  },
  {
    emoji: '🚀',
    title: 'Пора к звёздам!',
    message: 'Каждый день практики = один шаг к мечте. Твоя серия ждёт тебя!',
    buttonText: '🔥 Начать занятие',
    buttonColor: 'bg-gradient-to-r from-primary to-game-pink hover:opacity-90',
    bgColor: 'from-primary/5 to-pink-50',
    borderColor: 'border-primary/20',
    vibe: 'motivate',
  },
  {
    emoji: '🧠',
    title: 'Мозг просит тренировки!',
    message: 'Нейроны скучают без тебя. Всего 10 минут — и день засчитан!',
    buttonText: '💡 Потренироваться',
    buttonColor: 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90',
    bgColor: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
    vibe: 'brain',
  },
  {
    emoji: '🏆',
    title: 'Соперники уже занимаются!',
    message: 'Пока ты читаешь это — другие набирают XP. Не отставай!',
    buttonText: '⚡ В бой!',
    buttonColor: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90',
    bgColor: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-200',
    vibe: 'compete',
  },
  {
    emoji: '😴',
    title: 'Эй, засоня!',
    message: 'Знания сами в голову не залезут. Хотя было бы удобно... Давай, 5 минут!',
    buttonText: '🎯 Ладно, учусь',
    buttonColor: 'bg-gradient-to-r from-game-teal to-cyan-500 hover:opacity-90',
    bgColor: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    vibe: 'sleepy',
  },
];

interface ReminderPopupProps {
  onClose: () => void;
  onStudy: () => void;
}

export default function ReminderPopup({ onClose, onStudy }: ReminderPopupProps) {
  const [reminder] = useState(() => reminders[Math.floor(Math.random() * reminders.length)]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleStudy = () => {
    setVisible(false);
    setTimeout(onStudy, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center p-4 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-sm transition-all duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`game-card p-6 bg-gradient-to-br ${reminder.bgColor} border-2 ${reminder.borderColor} shadow-2xl`}>
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center text-sm font-black hover:bg-black/20 transition-colors"
          >
            ✕
          </button>

          {/* Emoji */}
          <div className="text-6xl mb-3 animate-float text-center">{reminder.emoji}</div>

          {/* Text */}
          <h3 className="text-xl font-black text-foreground text-center mb-2">{reminder.title}</h3>
          <p className="text-sm text-muted-foreground text-center mb-5 leading-relaxed">{reminder.message}</p>

          {/* Buttons */}
          <button
            onClick={handleStudy}
            className={`w-full py-3.5 rounded-2xl text-white font-black text-base transition-all duration-200 mb-2 ${reminder.buttonColor}`}
          >
            {reminder.buttonText}
          </button>
          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-2xl text-muted-foreground font-bold text-sm hover:bg-black/5 transition-colors"
          >
            Напомни позже
          </button>
        </div>
      </div>
    </div>
  );
}
