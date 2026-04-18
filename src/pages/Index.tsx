import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import HomePage from '@/pages/HomePage';
import PracticePage from '@/pages/PracticePage';
import OfflinePage from '@/pages/OfflinePage';
import ProfilePage from '@/pages/ProfilePage';

type Tab = 'home' | 'practice' | 'offline' | 'profile';

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'practice': return <PracticePage />;
      case 'offline': return <OfflinePage />;
      case 'profile': return <ProfilePage />;
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
