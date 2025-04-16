'use client';

import { useEffect, useState } from 'react';

type Props = {
  userId: string;
};

type Post = {
  id: string;
  text: string;
  image: string;
  timestamp: string;
  user: string;
  good: string;
};

export default function NearYouPosts({ userId }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/posts/near-you?userId=${userId}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setLoading(false);
    };

    if (userId) fetchPosts();
  }, [userId]);

  if (loading) return <p>Loading posts near you...</p>;

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow bg-white">
            <h2 className="font-bold">{post.user}</h2>
            <p>{post.text}</p>
            {post.image && <img src={post.image} alt="Post" className="mt-2 rounded" />}
          </div>
        ))
      ) : (
        <p>No posts found in your area.</p>
      )}
    </div>
  );
}
