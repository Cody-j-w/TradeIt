'use client';

import React, { useState, useEffect } from 'react';
import LikeButton from './LikeButton';
import { getUsersById } from '@/lib/functions';
import Link from 'next/link';

interface PostRecommendationUser {
    id: string;
    name: string;
    avatar: string;
    slug: string;
    user_id: string;
}


interface PostRecommendation {
    id: string;
    text: string;
    image: string | null;
    type: string;
    timestamp: string;
    user: PostRecommendationUser;
}

interface User {
    id: string;
    name: string;
    avatar: string;
    slug: string;
}

interface RecPostCardProps {
    post: PostRecommendation;
}

const RecPostCard: React.FC<RecPostCardProps> = ({ post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [errorUser, setErrorUser] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoadingUser(true);
            setErrorUser(null);

            
            const userIdToFetch = post.user?.user_id;

            // CRITICAL CHECK: Ensure userIdToFetch is valid before proceeding
            if (!userIdToFetch) {
                console.error("RecPostCard: post.user.user_id is undefined or null for post:", post);
                setErrorUser("Cannot load user: Post's user reference is missing.");
                setLoadingUser(false);
                return;
            }

            try {
                const usersData = await getUsersById([userIdToFetch]);

                if (usersData && usersData[userIdToFetch]) {
                    setUser({
                        id: usersData[userIdToFetch].id,
                        name: usersData[userIdToFetch].name,
                        avatar: usersData[userIdToFetch].avatar,
                        slug: usersData[userIdToFetch].slug,
                    });
                } else {
                    setErrorUser(`Could not load user information for user ${userIdToFetch}. User not found or data incomplete.`);
                }
            } catch (error) {
                console.error("Error fetching user for post ID:", post.id, "Error:", error);
                setErrorUser('Failed to fetch user information due to an internal error.');
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [post.user?.user_id]); // DEPENDENCY ARRAY CHANGE: Watch the nested user_id

    const handleLikeChange = (newLikeState: boolean) => {
        setIsLiked(newLikeState);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    // Render loading/error states for user data first
    if (loadingUser) return <div>Loading user for post...</div>;
    if (errorUser) return <div className="text-red-500">Error loading user: {errorUser}</div>;
    if (!user) return null; // If user is null but not loading or error, something went wrong after loading

    const parsedDate = new Date(post.timestamp);
    const formattedDate = parsedDate.toLocaleDateString();
    const formattedTime = parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-white dark:bg-trade-gray rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-2"
                    />
                    <div className="font-semibold">
                        <Link href={`/pages/users/${user.slug}`} className="hover:underline text-black dark:text-white">
                            {user.name}
                        </Link>
                    </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-trade-orange">
                    {formattedDate} {formattedTime}
                </div>
            </div>

            {post.image && (
                <div className="mb-2">
                    <img
                        src={post.image}
                        alt="Post"
                        className="w-full max-h-96 object-cover rounded"
                    />
                </div>
            )}

            <div className="mb-4">{post.text}</div>

            <div className="flex justify-between items-center border-t py-2">
                <button onClick={toggleComments} className="focus:outline-none text-sm text-blue-600">
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>

                <LikeButton
                    postId={post.id}
                    isLiked={isLiked}
                    onLikeChange={handleLikeChange}
                />
            </div>

            {showComments && (
                <div className="mt-4 text-sm text-gray-600 italic">
                    {/* Placeholder for future comment logic */}
                    Comments will go here...
                </div>
            )}
        </div>
    );
};

export default RecPostCard;