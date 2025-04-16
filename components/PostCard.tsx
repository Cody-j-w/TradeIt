// components/PostCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LikeButton from './LikeButton'; // Import the LikeButton
import { getUsersById } from '@/lib/functions'; // Import function to fetch a single user

interface Post {
    id: string; // Or number, adjust type as needed
    user_id: string;
    text: string;
    image: string | null;
    type: string;
    timestamp: Date;
    // Add any other properties your posts have
}

interface User { // Define the User interface
    id: string;
    name: string;
    avatar: string;
    // Add other user properties as needed
}

interface PostCardProps {
    post: Post;
    isDarkMode: boolean; // Prop to control dark mode styling
}

const PostCard: React.FC<PostCardProps> = ({ post, isDarkMode }) => {
    const [isLiked, setIsLiked] = useState(false); // Initial like state (fetch from server)
    const [showComments, setShowComments] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [errorUser, setErrorUser] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoadingUser(true);
            setErrorUser(null);
            try {
                const usersData = await getUsersById([post.user_id]); // Pass an array
                if (usersData && usersData[post.user_id]) { // Access the user by their ID
                    setUser({
                        id: usersData[post.user_id].id,
                        name: usersData[post.user_id].name,
                        avatar: usersData[post.user_id].avatar,
                    });
                } else {
                    setErrorUser('Could not load user information.');
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setErrorUser('Failed to fetch user information.');
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [post.user_id]);

    const handleLikeChange = (newLikeState: boolean) => {
        setIsLiked(newLikeState);
        // Implement logic to update the like count on the server if needed
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    if (loadingUser) {
        return <div>Loading user...</div>; // Or a more sophisticated loading indicator
    }

    if (errorUser) {
        return <div>Error loading user: {errorUser}</div>; // Or a more user-friendly error message
    }

    if (!user) {
        return null; // Or handle the case where user data is not available
    }

    return (
        <div className={`bg-white rounded-lg shadow-md p-4 mb-4 ${isDarkMode ? 'dark:bg-gray-800 dark:text-white' : ''}`}>
            {/* User Info Top Left */}
            <div className="flex items-center mb-2">
                <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full mr-2" />
                <div className="font-semibold">{user.name}</div>
            </div>

            {/* Images (if any) */}
            {post.image && (
                <div className="mb-2">
                    <Image src={post.image} alt="Post Image" width={500} height={300} />
                </div>
            )}

            {/* Post Text */}
            <div className="mb-4">
                {post.text}
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-center border-t py-2">
                <button onClick={toggleComments} className="focus:outline-none">
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>

                <LikeButton
                    postId={post.id}
                    isLiked={isLiked}
                    onLikeChange={handleLikeChange}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Comment Section (Conditionally Rendered) */}
            {showComments && (
                <div className="mt-4">
                    {/* Implement your comment display and input logic here */}
                    Comments will go here...
                </div>
            )}
        </div>
    );
};

export default PostCard;