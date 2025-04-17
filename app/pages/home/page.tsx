'use client';

import { useEffect, useState } from 'react';
import NearYouPosts from '@/components/NearYouPosts';
import { getMe } from '@/lib/functions';
import { zipRadiusLookup } from '@/lib/geo';
import PostCard from '@/components/PostCard';

const Home = () => {
  const [activeTab, setActiveTab] = useState('Following');
  const [nearbyZips, setNearbyZips] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserZip = async () => {
      try {
        const user = await getMe();
        if ('zip' in user && user.zip) {
          const zips = zipRadiusLookup(user.zip);
          setNearbyZips(zips);
        }
      } catch (err) {
        console.error('Failed to fetch user zip:', err);
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
      <div className="flex fixed w-full justify-center bg-gray-300 text-trade-gray dark:bg-trade-gray dark:text-trade-orange">
        {['Following', 'Suggested', 'Near You'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-trade-blue' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 pt-15 pb-23">
        {activeTab === 'Following' && <div>Following content goes here.</div>}
        {activeTab === 'Suggested' && <div>Suggested content goes here.</div>}
        {activeTab === 'Near You' && (
          loading ? (
            <div>Loading...</div>
          ) : nearbyZips ? (
            <NearYouPosts zips={nearbyZips} />
          ) : (
            <div>No ZIP found for this user.</div>
          )
        )}

      </div>
    </div>
  );
};

export default Home;
