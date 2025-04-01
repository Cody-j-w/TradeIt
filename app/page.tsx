// app/page
'use client';

import { useState } from 'react';

const Home = () => {
    const [activeTab, setActiveTab] = useState('Following');

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
                {activeTab === 'Near You' && <div>Near You content goes here.</div>}
            </div>
        </div>
    );
};

export default Home;