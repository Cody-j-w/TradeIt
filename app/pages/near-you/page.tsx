"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Post {
  id: number;
  content: string;
  timestamp: string;
  user_id: string;
  author_name: string;
  author_zip: string;
  author_image: string | null;
  author_slug: string;
}

export default function NearYouPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      // Replace this with dynamic ZIP lookup if needed
      const userZip = "74101";
      const res = await fetch("/api/posts/near-you", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: userZip }),
      });
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Posts Near You</h1>

      {loading ? (
        <p className="text-gray-500">Loading nearby posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts nearby yet.</p>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[80vh]">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
            >
              <div className="flex items-center mb-2">
                {post.author_image ? (
                  <Image
                    src={post.author_image}
                    alt={post.author_name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                )}
                <div>
                  <p className="font-semibold text-sm">{post.author_name}</p>
                  <p className="text-xs text-gray-500">ZIP: {post.author_zip}</p>
                </div>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(post.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
