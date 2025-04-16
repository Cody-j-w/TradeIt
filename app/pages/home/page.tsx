'use client';

import { useEffect, useState } from 'react';
import TradeSpotsMap from '@/components/TradeSpotsMap';
import NearYouPosts from '@/components/NearYouPosts';

const Home = () => {
  const [activeTab, setActiveTab] = useState('Following');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/session');
        const data = await res.json();
        if (data.user?.sub) {
          setUserId(data.user.sub); // Auth0 stores ID as "sub"
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

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
        {activeTab === 'Near You' && (
          <>
            {loading ? (
              <div>Loading...</div>
            ) : userId ? (
              <NearYouPosts userId={userId} />
            ) : (
              <div>No session found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
