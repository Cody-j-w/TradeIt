'use client';

import { useEffect, useState } from 'react';
import TradeSpotsMap from '@/components/TradeSpotsMap';
import NearYouPosts from '@/components/NearYouPosts';
import { useSession } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('Following');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id); // Adjust based on your session structure
    }
  }, [session]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="flex justify-center bg-gray-300 text-trade-gray">
        <button
          className={`px-4 py-2 ${activeTab === 'Following' ? 'border-b-2 border-trade-blue' : ''}`}
          onClick={() => handleTabClick('Following')}
        >
          Following
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'Suggested' ? 'border-b-2 border-trade-blue' : ''}`}
          onClick={() => handleTabClick('Suggested')}
        >
          Suggested
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'Near You' ? 'border-b-2 border-trade-blue' : ''}`}
          onClick={() => handleTabClick('Near You')}
        >
          Near You
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'Following' && <div>Following content goes here.</div>}
        {activeTab === 'Suggested' && <div>Suggested content goes here.</div>}
        {activeTab === 'Near You' && userId && <NearYouPosts userId={userId} />}
      </div>
    </div>
  );
};

export default Home;
