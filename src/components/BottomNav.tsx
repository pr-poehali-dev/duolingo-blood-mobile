import Icon from '@/components/ui/icon';

type Tab = 'home' | 'practice' | 'offline' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'home' as Tab, label: 'Главная', icon: 'Home', emoji: '🏠' },
  { id: 'practice' as Tab, label: 'Практика', icon: 'Zap', emoji: '⚡' },
  { id: 'offline' as Tab, label: 'Офлайн', icon: 'Download', emoji: '📥' },
  { id: 'profile' as Tab, label: 'Профиль', icon: 'User', emoji: '👤' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t-2 border-border">
      <div className="max-w-lg mx-auto flex items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 px-1 transition-all duration-200 relative ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary rounded-b-full" />
              )}
              <span
                className={`text-xl transition-transform duration-200 ${isActive ? 'scale-125' : 'scale-100'}`}
              >
                {tab.emoji}
              </span>
              <span className={`text-[10px] font-bold transition-all ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
