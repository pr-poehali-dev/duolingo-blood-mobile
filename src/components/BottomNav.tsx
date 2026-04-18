export type Tab = 'home' | 'practice' | 'levels' | 'lestore' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'home' as Tab, label: 'Главная', emoji: '🏠' },
  { id: 'practice' as Tab, label: 'Практика', emoji: '⚡' },
  { id: 'levels' as Tab, label: 'Уровни', emoji: '🗺️' },
  { id: 'lestore' as Tab, label: 'LESTORE', emoji: '🛒' },
  { id: 'profile' as Tab, label: 'Профиль', emoji: '👤' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t-2 border-border">
      <div className="max-w-lg mx-auto flex items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLestore = tab.id === 'lestore';
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 px-0.5 transition-all duration-200 relative ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
              )}
              <span className={`transition-transform duration-200 ${isActive ? 'scale-125' : 'scale-100'} ${isLestore && isActive ? 'animate-wiggle' : ''}`}>
                <span className={`text-lg ${isLestore ? 'text-[18px]' : 'text-xl'}`}>{tab.emoji}</span>
              </span>
              <span className={`text-[9px] font-bold transition-all leading-tight ${isActive ? 'text-primary' : 'text-muted-foreground'} ${isLestore ? 'font-black' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
