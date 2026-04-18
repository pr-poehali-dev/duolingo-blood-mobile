import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import HomePage from '@/pages/HomePage';
import PracticePage from '@/pages/PracticePage';
import OfflinePage from '@/pages/OfflinePage';
import ProfilePage from '@/pages/ProfilePage';
import AuthPage from '@/pages/AuthPage';
import { getMe, logout, User } from '@/lib/api';

type Tab = 'home' | 'practice' | 'offline' | 'profile';

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getMe().then(u => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-4 animate-float">🎓</div>
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage user={user} />;
      case 'practice': return <PracticePage />;
      case 'offline': return <OfflinePage />;
      case 'profile': return <ProfilePage user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-nunito">
      <div key={activeTab} className="animate-fade-in">
        {renderPage()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
