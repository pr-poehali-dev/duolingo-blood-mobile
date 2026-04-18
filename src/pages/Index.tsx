import { useState, useEffect } from 'react';
import BottomNav, { Tab } from '@/components/BottomNav';
import HomePage from '@/pages/HomePage';
import PracticePage from '@/pages/PracticePage';
import OfflinePage from '@/pages/OfflinePage';
import ProfilePage from '@/pages/ProfilePage';
import LevelsPage from '@/pages/LevelsPage';
import LestorePage from '@/pages/LestorePage';
import AuthPage from '@/pages/AuthPage';
import ReminderPopup from '@/components/ReminderPopup';
import { getMe, logout, User } from '@/lib/api';

const REMINDER_KEY = 'last_reminder_shown';
const REMINDER_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    getMe().then(u => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  // Show reminder after delay if user is logged in
  useEffect(() => {
    if (!user) return;
    const last = parseInt(localStorage.getItem(REMINDER_KEY) || '0');
    const now = Date.now();
    const delay = now - last > REMINDER_INTERVAL_MS ? 8000 : 0; // 8 sec on fresh, skip if recent
    if (now - last < REMINDER_INTERVAL_MS) return;
    const timer = setTimeout(() => setShowReminder(true), delay);
    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleReminderClose = () => {
    localStorage.setItem(REMINDER_KEY, String(Date.now()));
    setShowReminder(false);
  };

  const handleReminderStudy = () => {
    localStorage.setItem(REMINDER_KEY, String(Date.now()));
    setShowReminder(false);
    setActiveTab('practice');
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
      case 'levels': return <LevelsPage />;
      case 'lestore': return <LestorePage />;
      case 'profile': return <ProfilePage user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-nunito">
      <div key={activeTab} className="animate-fade-in">
        {renderPage()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      {showReminder && (
        <ReminderPopup
          onClose={handleReminderClose}
          onStudy={handleReminderStudy}
        />
      )}
    </div>
  );
}
