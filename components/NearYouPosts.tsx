"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  text: string;
  image?: string;
  timestamp: string;
  user: string;
  good: string;
};

export default function NearYouPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/near-you");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching near-you posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      {posts.map((post) => (
        <div key={post.id} className="border rounded p-4 shadow bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{post.user}</span>
            <span className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString()}</span>
          </div>
          <p className="text-sm">{post.text}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post visual"
              className="mt-2 max-h-64 w-full object-cover rounded"
            />
          )}
          <div className="text-xs text-gray-600 mt-2">
            Offering: <span className="font-medium">{post.good}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
