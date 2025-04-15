"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Post {
  id: number;
  text: string;
  image?: string;
  user: string;
  good: string;
  timestamp: string;
  zip: string;
}

interface Props {
  userId: string;
}

export default function NearYouPosts({ userId }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/near-you?userId=${userId}&limit=20&offset=${page * 20}`);
      const data = await res.json();
      if (Array.isArray(data.posts)) {
        setPosts((prev) => [...prev, ...data.posts]);
        setHasMore(data.posts.length === 20);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching near-you posts:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, userId]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!bottomRef.current || !hasMore) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPosts();
      }
    });

    observer.current.observe(bottomRef.current);
  }, [fetchPosts, hasMore]);

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] p-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded p-4">
          <h2 className="font-bold">{post.user}</h2>
          <p className="text-gray-700 mb-2">{post.text}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post image"
              className="w-full max-h-64 object-cover rounded"
            />
          )}
          <div className="text-sm text-gray-500 mt-2">
            ZIP: {post.zip} | Item: {post.good}
          </div>
        </div>
      ))}
      {loading && <p className="text-center text-gray-500">Loading more...</p>}
      <div ref={bottomRef} />
    </div>
  );
}
