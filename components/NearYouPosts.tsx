'use client';

import { useEffect, useState } from 'react';

type Post = {
  id: number;
  text: string;
  good: string;
  image?: string;
  created: string;
  user_name: string;
  user_image?: string;
};

export default function NearYouPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearYouPosts = async () => {
      try {
        const res = await fetch('/api/posts/near-you');
        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        console.error('Error fetching near-you posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearYouPosts();
  }, []);

  return (
    <div className="space-y-4">
      {loading && <p>Loading posts near you...</p>}
      {!loading && posts.length === 0 && <p>No nearby posts found.</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          className="border rounded-xl p-4 shadow-md bg-white flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            {post.user_image && (
              <img
                src={post.user_image}
                alt={post.user_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <span className="font-semibold text-trade-gray">{post.user_name}</span>
          </div>

          <p className="text-sm">{post.text}</p>
          <p className="text-sm text-gray-500 italic">Looking for: {post.good}</p>

          {post.image && (
            <img
              src={post.image}
              alt="post image"
              className="rounded-lg max-h-60 object-cover"
            />
          )}

          <p className="text-xs text-gray-400">{new Date(post.created).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
