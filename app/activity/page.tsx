// app/activity/page
'use client';

import React, { useState, useEffect } from 'react';

interface Activity {
	id: number;
	username: string;
	time: string;
	action: string;
	avatar: string;
	imageUrl: string | null;
	message: string | null;
}

const fetchNotifications = async (): Promise<Activity[]> => {
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Sample data for testing (optional)
	return [
		{
			id: 1,
			username: 'JohnDoe',
			time: '1 hour ago',
			action: 'Commented on your post',
			avatar: '/path/to/avatar1.jpg',
			imageUrl: '/path/to/image1.jpg',
			message: 'Great post!'
		},
		{
			id: 2,
			username: 'JaneSmith',
			time: '2 hours ago',
			action: 'Started following you',
			avatar: '/path/to/avatar2.jpg',
			imageUrl: null,
			message: null
		}
	]  ;
};

const Activity = () => {
	const [activeTab, setActiveTab] = useState('Posts');

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};

	const [activity, setActivity] = useState<Activity[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadActivities = async () => {
			const data = await fetchNotifications();
			setActivity(data);
			setLoading(false);
		};

		loadActivities();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

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
			<div className='p-4 space-y-4'> {/* Added space-y-4 here */}
				{activity.map((activity) => (
					<div key={activity.id} className="flex items-start py-4 border-b rounded-lg bg-trade-white border-gray-200">
						<div className="relative w-12 h-12 rounded-full mr-4">
							<img
								src={activity.avatar}
								alt={`${activity.username}'s avatar`}
								className=" ml-2 w-full h-full rounded-full"
							/>
							<div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></div>
						</div>
						<div className="flex-grow">
							<div className="flex items-center">
								<span className="font-semibold mr-1">{activity.username}</span>
								<span className="text-gray-500 text-sm">{activity.time}</span>
							</div>
							<p className="text-sm">
								{activity.action}
							</p>
						</div>
						{activity.imageUrl && (
							<img
								src={activity.imageUrl}
								alt="Notification image"
								className="w-16 h-16 object-cover rounded ml-2 mr-4"
							/>
						)}
						{activity.action === 'Started following you' && (
							<button className="ml-2 mr-4 bg-blue-500 text-white py-2 px-4 rounded ">
								Follow
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Activity;