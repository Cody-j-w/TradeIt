'use client';

import React, { useEffect, useState } from 'react';
import NearYouPosts from '@/components/NearYouPosts';
import FollowingPosts from '@/components/FollowingPosts';
import PostCard from '@/components/PostCard';
import { getMe } from '@/lib/functions';
import { zipRadiusLookup } from '@/lib/geo';

interface PostRecommendation {
    id: string;
    user_id: string;
    text: string;
    image: string | null;
    type: string;
    timestamp: string;
}

const Home = () => {
    const [activeTab, setActiveTab] = useState<'Following' | 'Suggested' | 'Near You'>('Following');
    const [nearbyZips, setNearbyZips] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [suggestedPosts, setSuggestedPosts] = useState<PostRecommendation[]>([]);
    const [loadingSuggested, setLoadingSuggested] = useState(false);
    const [errorSuggested, setErrorSuggested] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserZip = async () => {
            setLoading(true);
            try {
                const user = await getMe();
                if (user && user.zip) {
                    const zips = zipRadiusLookup(user.zip);
                    setNearbyZips(zips);
                } else {
                    console.warn("User or user zip is missing. 'Near You' tab may not work.");
                    setNearbyZips(null);
                }
            } catch (err) {
                console.error('Failed to fetch user zip:', err);
                setNearbyZips(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUserZip();
    }, []);

    useEffect(() => {
        const fetchSuggestedPosts = async () => {
            if (activeTab !== 'Suggested') return;

            setLoadingSuggested(true);
            setErrorSuggested(null);
            try {
                const user = await getMe();
                if (user && user.id) {
                    const response = await fetch(`/api/py/recommendations/${user.id}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data: PostRecommendation[] = await response.json();
                    setSuggestedPosts(data);
                } else {
                    setErrorSuggested("Could not get user ID.");
                    setSuggestedPosts([]);
                }
            } catch (error) {
                console.error("Error fetching recommendations:", error);
                setErrorSuggested("Failed to fetch recommendations.");
                setSuggestedPosts([]);
            } finally {
                setLoadingSuggested(false);
            }
        };

        fetchSuggestedPosts();
    }, [activeTab]);

    const handleTabClick = (tab: 'Following' | 'Suggested' | 'Near You') => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className="flex fixed w-full justify-center bg-gray-300 text-trade-gray dark:bg-trade-gray dark:text-trade-orange">
                {(['Following', 'Suggested', 'Near You'] as ('Following' | 'Suggested' | 'Near You')[]).map(tab => ( // Explicit type assertion
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
                {activeTab === 'Following' && (<FollowingPosts />)}
                {activeTab === 'Suggested' && (
                    loadingSuggested ? (
                        <div>Loading Suggested Posts...</div>
                    ) : errorSuggested ? (
                        <div>Error: {errorSuggested}</div>
                    ) : suggestedPosts.length > 0 ? (
                        suggestedPosts.map(post => <PostCard key={post.id} post={post} />)
                    ) : (
                        <div>No suggested posts.</div>
                    )
                )}
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