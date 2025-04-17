'use client';

import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  user_id: string;
  text: string;
  image: string | null;
  type: string;
  timestamp: string;
}

const FollowingPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts/following');
        const data = await res.json();
        if (data?.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching following posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No posts from followed users yet.</p>}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FollowingPosts;
