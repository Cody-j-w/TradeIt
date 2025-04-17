'use client';

import React, { useState, useEffect } from 'react';
import LikeButton from './LikeButton';
import { getUsersById } from '@/lib/functions';
import Link from 'next/link';

interface Post {
  id: string;
  user_id: string;
  text: string;
  image: string | null;
  type: string;
  timestamp: string; // ISO string from the API
}

interface User {
  id: string;
  name: string;
  avatar: string;
  slug: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      setErrorUser(null);
      try {
        const usersData = await getUsersById([post.user_id]);
        if (usersData && usersData[post.user_id]) {
          setUser({
            id: usersData[post.user_id].id,
            name: usersData[post.user_id].name,
            avatar: usersData[post.user_id].avatar,
            slug: usersData[post.user_id].slug,
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
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  if (loadingUser) return <div>Loading user...</div>;
  if (errorUser) return <div>Error loading user: {errorUser}</div>;
  if (!user) return null;

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

export default PostCard;
