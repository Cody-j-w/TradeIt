'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0'; // If you need Auth0 context

interface Post {
    id: string;
    user_id: string;
    text: string;
    image: string | null;
    type: string;
    timestamp: Date;
}

interface MyPostsCardProps {
    post: Post;
}

const MyPostsCard: React.FC<MyPostsCardProps> = ({ post }) => {
    const { user: auth0User } = useUser(); // Access Auth0 user (if needed)
    const [showComments, setShowComments] = useState(false);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center mb-2">
                {/* Display the user's avatar and name (if available) */}
                {auth0User?.picture && (
                    <Image
                        src={auth0User.picture}
                        alt={auth0User.name || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full mr-2"
                    />
                )}
                <div className="font-semibold">{auth0User?.name || 'Unknown User'}</div>
            </div>

            {post.image && (
                <div className="mb-2">
                    <Image src={post.image} alt="Post Image" width={500} height={300} />
                </div>
            )}

            <div className="mb-4">
                {post.text}
            </div>

            <div className="flex justify-between items-center border-t py-2">
                <button onClick={toggleComments} className="focus:outline-none">
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>

                {/* You might add interactive elements here, 
                    but consider if they should update the post data directly 
                    or if those updates should be handled in the parent Profile component.
                */}
            </div>

            {showComments && (
                <div className="mt-4">
                    {/* Implement your comment display and input logic here */}
                    Comments will go here...
                </div>
            )}
        </div>
    );
};

export default MyPostsCard;