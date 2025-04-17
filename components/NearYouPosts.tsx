'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  user_id: string;
  text: string;
  image: string | null;
  type: string;
  timestamp: string; // keep this as string
}

interface NearYouPostsProps {
  zips: string[];
}

const NearYouPosts = ({ zips }: NearYouPostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const zipQuery = encodeURIComponent(JSON.stringify(zips));
        const res = await fetch(`/api/posts/near-you?zips=${zipQuery}&page=1`);
        const data = await res.json();
        if (data?.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error('Error fetching near-you posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [zips]);

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={{
            ...post,
            timestamp: post.timestamp, // PostCard expects Date
          }}
        />
      ))}
      {loading && <p>Loading posts...</p>}
      {!loading && posts.length === 0 && (
        <p className="text-gray-600">No posts found for nearby ZIPs.</p>
      )}
    </div>
  );
};

export default NearYouPosts;
