'use client';

import { useEffect, useState } from 'react';

type Post = {
  id: number;
  text: string;
  image: string | null;
  timestamp: string;
  user: string;
  good: string | null;
};

type NearYouPostsProps = {
  zip: string;
};

const NearYouPosts = ({ zip }: NearYouPostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/near-you?zip=${zip}&page=${page}`);
      const data = await res.json();
      if (data?.posts?.length > 0) {
        setPosts(prev => [...prev, ...data.posts]);
      }
    } catch (err) {
      console.error('Error fetching near-you posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && !loading) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="p-4 bg-white shadow-md rounded">
          <h3 className="font-bold">{post.user}</h3>
          <p className="text-sm text-gray-600">{new Date(post.timestamp).toLocaleString()}</p>
          <p className="mt-2">{post.text}</p>
          {post.good && <p className="text-blue-600 font-medium mt-1">🔁 {post.good}</p>}
          {post.image && (
            <img src={post.image} alt="Post visual" className="mt-2 max-h-64 object-cover rounded" />
          )}
        </div>
      ))}
      {loading && <p>Loading more posts...</p>}
    </div>
  );
};

export default NearYouPosts;
