// app/feed/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard'; // Import PostCard
import { getAllPosts } from '@/lib/functions';

interface Post {
    id: string;
    user_id: string;
    text: string;
    image: string | null;
    type: string;
    timestamp: Date;
    // ... other properties ...
}

const Feed = () => {
    const [activeTab, setActiveTab] = useState('Posts');
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const postsPerPage = 10; // Define your pagination size

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchInitialPosts = async () => {
            if (activeTab !== 'Posts') return; // Only fetch if on Posts tab

            setLoading(true);
            try {
                const fetchedPosts = await getAllPosts(page.toString());
                if (fetchedPosts && fetchedPosts.length > 0) {
                    setPosts(fetchedPosts);
                    setHasMore(fetchedPosts.length === postsPerPage);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Error fetching initial posts:", error);
                // Handle error (e.g., show a message to the user)
            } finally {
                setLoading(false);
            }
        };

        fetchInitialPosts();
    }, [activeTab, page]); // Fetch on mount and when activeTab or page changes

    const handleScroll = async () => {
        if (activeTab !== 'Posts' || loading || !hasMore) return;

        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10) {
            setLoading(true);
            const nextPage = page + 1;
            try {
                const newPosts = await getAllPosts(nextPage.toString());
                if (newPosts && newPosts.length > 0) {
                    setPosts(prevPosts => [...prevPosts, ...newPosts]);
                    setPage(nextPage);
                    setHasMore(newPosts.length === postsPerPage);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Error fetching more posts:", error);
                // Handle error
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (activeTab === 'Posts') {
            window.addEventListener('scroll', handleScroll);
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeTab, loading, hasMore, page]);

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
                {activeTab === 'Posts' && (
                    <div>
                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isDarkMode={false} // Example: Pass dark mode state
                            />
                        ))}
                        {loading && <div>Loading more posts...</div>}
                        {!hasMore && posts.length > 0 && <div>No more posts to load.</div>}
                    </div>
                )}
                {activeTab === 'Trades' && <div>Trade content goes here.</div>}
            </div>
        </div>
    );
};

export default Feed;