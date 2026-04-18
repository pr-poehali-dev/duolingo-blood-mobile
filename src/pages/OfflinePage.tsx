import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Lesson {
  id: number;
  emoji: string;
  title: string;
  subject: string;
  duration: string;
  size: string;
  downloaded: boolean;
  downloading?: boolean;
  progress?: number;
}

const initialLessons: Lesson[] = [
  { id: 1, emoji: '🇬🇧', title: 'Present Simple: основы', subject: 'Английский', duration: '12 мин', size: '8 МБ', downloaded: true },
  { id: 2, emoji: '🇬🇧', title: 'Past Simple в диалогах', subject: 'Английский', duration: '15 мин', size: '11 МБ', downloaded: true },
  { id: 3, emoji: '🔢', title: 'Решение уравнений', subject: 'Математика', duration: '20 мин', size: '15 МБ', downloaded: true },
  { id: 4, emoji: '🧪', title: 'Виды химических реакций', subject: 'Химия', duration: '18 мин', size: '13 МБ', downloaded: false },
  { id: 5, emoji: '🔢', title: 'Геометрия: теорема Пифагора', subject: 'Математика', duration: '22 мин', size: '16 МБ', downloaded: false },
  { id: 6, emoji: '✍️', title: 'Правописание безударных гласных', subject: 'Русский', duration: '10 мин', size: '7 МБ', downloaded: false },
];

export default function OfflinePage() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const downloadedLessons = lessons.filter(l => l.downloaded);
  const availableLessons = lessons.filter(l => !l.downloaded);
  const totalSize = downloadedLessons.reduce((sum, l) => sum + parseInt(l.size), 0);

  const handleDownload = (id: number) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, downloading: true, progress: 0 } : l));
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 25 + 10;
      if (prog >= 100) {
        clearInterval(interval);
        setLessons(prev => prev.map(l => l.id === id ? { ...l, downloaded: true, downloading: false, progress: undefined } : l));
      } else {
        setLessons(prev => prev.map(l => l.id === id ? { ...l, progress: Math.min(prog, 95) } : l));
      }
    }, 300);
  };

  const handleDelete = (id: number) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, downloaded: false } : l));
    if (playingId === id) setPlayingId(null);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-black text-foreground">Офлайн-уроки 📥</h1>
        <p className="text-sm text-muted-foreground">Учись без интернета в любом месте</p>
      </div>

      {/* Storage info */}
      <div className="animate-fade-in stagger-1 game-card p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Хранилище</p>
            <p className="font-black text-foreground">{totalSize} МБ из 500 МБ</p>
          </div>
          <span className="text-3xl animate-float">💾</span>
        </div>
        <div className="h-3 bg-teal-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-700"
            style={{ width: `${(totalSize / 500) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs text-teal-600 font-semibold">{downloadedLessons.length} уроков скачано</p>
          <p className="text-xs text-teal-600 font-semibold">Свободно: {500 - totalSize} МБ</p>
        </div>
      </div>

      {/* Offline mode banner */}
      <div className="animate-fade-in stagger-2 flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border-2 border-primary/20">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xl">✈️</span>
        </div>
        <div>
          <p className="font-bold text-foreground text-sm">Режим офлайн активен</p>
          <p className="text-xs text-muted-foreground">Скачанные уроки доступны без интернета</p>
        </div>
        <div className="ml-auto">
          <div className="w-3 h-3 bg-green-400 rounded-full pulse-dot" />
        </div>
      </div>

      {/* Downloaded lessons */}
      {downloadedLessons.length > 0 && (
        <div className="animate-fade-in stagger-3">
          <h2 className="text-lg font-black text-foreground mb-3 flex items-center gap-2">
            ✅ Скачано <span className="text-sm text-muted-foreground font-semibold">({downloadedLessons.length})</span>
          </h2>
          <div className="space-y-3">
            {downloadedLessons.map((lesson) => (
              <div key={lesson.id} className="game-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                    {lesson.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-foreground text-sm truncate">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">{lesson.subject} · {lesson.duration} · {lesson.size}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setPlayingId(playingId === lesson.id ? null : lesson.id)}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        playingId === lesson.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      <Icon name={playingId === lesson.id ? 'Pause' : 'Play'} size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                {playingId === lesson.id && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full pulse-dot" />
                      <p className="text-xs font-bold text-primary">Воспроизведение...</p>
                    </div>
                    <div className="h-1.5 bg-primary/20 rounded-full">
                      <div className="h-full w-1/3 bg-primary rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available for download */}
      {availableLessons.length > 0 && (
        <div className="animate-fade-in stagger-4">
          <h2 className="text-lg font-black text-foreground mb-3 flex items-center gap-2">
            ☁️ Доступно для скачивания <span className="text-sm text-muted-foreground font-semibold">({availableLessons.length})</span>
          </h2>
          <div className="space-y-3">
            {availableLessons.map((lesson) => (
              <div key={lesson.id} className="game-card p-4 opacity-80">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center text-xl flex-shrink-0 grayscale">
                    {lesson.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-foreground text-sm truncate">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">{lesson.subject} · {lesson.duration} · {lesson.size}</p>
                  </div>
                  <button
                    onClick={() => !lesson.downloading && handleDownload(lesson.id)}
                    disabled={lesson.downloading}
                    className="p-2 rounded-xl bg-game-teal/10 text-game-teal hover:bg-game-teal/20 transition-colors flex-shrink-0 disabled:opacity-50"
                  >
                    <Icon name={lesson.downloading ? 'Loader' : 'Download'} size={18} className={lesson.downloading ? 'animate-spin' : ''} />
                  </button>
                </div>
                {lesson.downloading && lesson.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-teal-600 font-bold">Загрузка...</span>
                      <span className="text-teal-600 font-bold">{Math.round(lesson.progress)}%</span>
                    </div>
                    <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-300"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
