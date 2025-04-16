'use client';

import { useEffect, useState } from 'react';
import TradeSpotsMap from '@/components/TradeSpotsMap';
import NearYouPosts from '@/components/NearYouPosts';
import { getSession, getMe } from '@/lib/functions'; // Assuming you have these helpers

const Home = () => {
  const [activeTab, setActiveTab] = useState('Following');
  const [userZip, setUserZip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserZip = async () => {
      try {
        const user = await getMe();
        console.log("Fetched user in getMe():", user);
        if ('zip' in user) {
          setUserZip(user.zip);
        } else {
          console.warn('User zip not found on returned object:', user);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserZip();
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
          loading ? (
            <div>Loading...</div>
          ) : userZip ? (
            <NearYouPosts zip={userZip} />
          ) : (
            <div>No ZIP found for this user.</div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
