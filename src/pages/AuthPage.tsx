import { useState } from 'react';
import { register, login, User } from '@/lib/api';

interface AuthPageProps {
  onAuth: (user: User) => void;
}

type Mode = 'login' | 'register';

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = mode === 'login'
        ? await login(email, password)
        : await register(name, email, password);
      onAuth(result.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-game-orange/20 rounded-full blur-3xl" style={{animationDelay:'1s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-game-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-3 animate-float">🎓</div>
          <h1 className="text-3xl font-black text-gradient-purple">УчиЛёгко</h1>
          <p className="text-sm text-muted-foreground mt-1 font-semibold">Учись. Играй. Побеждай!</p>
        </div>

        {/* Card */}
        <div className="game-card p-6 animate-fade-in stagger-1">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-6 bg-muted rounded-2xl p-1">
            {(['login', 'register'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-xl font-black text-sm transition-all duration-200 ${
                  mode === m ? 'bg-white shadow-md text-foreground' : 'text-muted-foreground'
                }`}
              >
                {m === 'login' ? '🔑 Войти' : '✨ Регистрация'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-black text-foreground mb-1.5 ml-1">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Как тебя зовут?"
                  required
                  className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white text-foreground font-semibold placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-foreground mb-1.5 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white text-foreground font-semibold placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-foreground mb-1.5 ml-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Минимум 6 символов' : '••••••••'}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white text-foreground font-semibold placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="animate-fade-in bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-sm text-red-600 font-bold flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-game-pink text-white font-black rounded-2xl text-base transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Загрузка...
                </>
              ) : mode === 'login' ? '🚀 Войти' : '🎉 Создать аккаунт'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 font-semibold animate-fade-in stagger-2">
          {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-primary font-black">
            {mode === 'login' ? 'Зарегистрируйся!' : 'Войди!'}
          </button>
        </p>
      </div>
    </div>
  );
}
