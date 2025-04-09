// app/feed/page
'use client';

import { useState } from 'react';

const Feed = () => {
	const [activeTab, setActiveTab] = useState('Posts');

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};

	return (
		<div>
			<div className="flex justify-around bg-gray-300 text-trade-gray">
				<button
					className={`px-4 py-2 ${activeTab === 'Posts' ? 'border-b-2 border-trade-blue' : ''}`}
					onClick={() => handleTabClick('Posts')}
				>
					Posts
				</button>
				<button
					className={`px-4 py-2 ${activeTab === 'Trades' ? 'border-b-2 border-trade-blue' : ''}`}
					onClick={() => handleTabClick('Trades')}
				>
					Trades
				</button>
			</div>

			<div className="p-4">
				{activeTab === 'Posts' && <div>Post content goes here.</div>}
				{activeTab === 'Trades' && <div>Trade content goes here.</div>}
			</div>
		</div>
	);
};

export default Feed;
