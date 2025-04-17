// app/pages/users/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { getFollowStatus, getPostsById, getUserBySlug, submitFollow } from '@/lib/functions';
import { useTransition } from 'react';
import React from 'react';

// Placeholder for profile picture
import ProfilePicPlaceholder from '@/assets/profile-placeholder.png';
import PostCard from '@/components/PostCard';

interface User {
    id: string;
    name: string;
    image: string | null;
    slug: string;
    bio?: string | null;
}

interface Post {
    id: string;
    user_id: string;
    text: string;
    image: string | null;
    type: string;
    timestamp: Date;
}

interface Props {
    params: { slug: string };
}

const UserProfilePage: React.FC<Props> = () => {
    const router = useRouter();
    const { user: auth0User } = useUser();
    const [activeTab, setActiveTab] = useState('Posts');
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowPending, startFollowTransition] = useTransition();

    const params = useParams<{ slug: string }>();
    useEffect(() => {
        const fetchUserData: () => Promise<void> = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedUser = await getUserBySlug(params.slug);
                if (fetchedUser) {
                    setUser({
                        id: fetchedUser.id,
                        name: fetchedUser.name,
                        image: fetchedUser.avatar,
                        slug: params.slug,
                        bio: fetchedUser.bio,
                    });
                    fetchUserPosts(fetchedUser.id);
                    if (auth0User?.sub && fetchedUser.id) {
                        checkIfFollowing(fetchedUser.id, auth0User.sub);
                    }
                } else {
                    setUser(null);
                    setError('User not found.');
                }
            } catch (err: any) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [params.slug, auth0User?.sub]);

    const fetchUserPosts = async (userId: string) => {
        try {
            const posts = await getPostsById(userId)
            if (posts) {
                setPosts(posts);
            }
        } catch (err: any) {
            console.error('Error fetching user posts:', err);
            setPosts([]);
        }
    };

    const checkIfFollowing = async (followedId: string, followerId: string) => {
        try {
            const followStatus = await getFollowStatus(user?.id!!)
            setIsFollowing(followStatus);
        } catch (error) {
            console.error('Error checking follow status:', error);
            setIsFollowing(false);
        }
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const onFollowToggle = async () => {
        if (user?.id && auth0User?.sub) {
            startFollowTransition(async () => {
                const formData = new FormData();
                formData.append('user_id', user.id);
                const result = await submitFollow(formData);
                if (result) {
                    setIsFollowing(!isFollowing);
                } else {
                    console.error('Failed to toggle follow.');
                }
            });
        }
    };

    if (isLoading) {
        return <div>Loading user profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }
    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col bg-trade-orange dark:bg-trade-green p-4 fixed w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="relative">
                            <Image
                                src={user.image || ProfilePicPlaceholder}
                                alt="Profile Picture"
                                width={60}
                                height={60}
                                className="rounded-full mr-4 cursor-default"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = ProfilePicPlaceholder.src;
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">{user.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-amber-400">@{user.slug}</p>
                        </div>
                    </div>
                    {/* Follow Button */}
                    {auth0User && user?.id && (
                        <button
                            onClick={onFollowToggle}
                            disabled={isFollowPending}
                            className={`bg-blue-500 text-white px-3 py-2 rounded-md ${isFollowing ? 'bg-gray-500' : ''
                                } ${isFollowPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isFollowPending ? 'Following...' : isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>

                {/* Description Section */}
                <div className="mt-2">
                    <p className="text-sm text-gray-600">
                        {user?.bio || 'No description provided.'}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-around bg-gray-300 text-trade-gray dark:bg-trade-gray dark:text-trade-orange fixed w-full top-30">
                <button
                    className={`px-4 py-2 ${activeTab === 'Posts' ? 'border-b-3 border-trade-blue' : ''}`}
                    onClick={() => handleTabClick('Posts')}
                >
                    Posts
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'Trades' ? 'border-b-3 border-trade-blue' : ''}`}
                    onClick={() => handleTabClick('Trades')}
                >
                    Trades
                </button>
            </div>

            {/* Post/Trade Items */}
            <div className="space-y-4 p-4 pt-45 pb-23">
                {activeTab === 'Posts' && posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : activeTab === 'Posts' ? (
                    <div className="border bg-trade-white rounded-lg p-4">
                        <p className="text-gray-600">No posts yet.</p>
                    </div>
                ) : (
                    <div className="border bg-trade-white rounded-lg p-4">
                        {/* Placeholder for Trades content */}
                        <p className="text-gray-600">Trades content will be populated here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;