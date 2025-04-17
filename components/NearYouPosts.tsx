'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  user_id: string;
  text: string;
  image: string | null;
  type: string;
  timestamp: string; // from server
}

interface NearYouPostsProps {
  zips: string[];
}

const NearYouPosts: React.FC<NearYouPostsProps> = ({ zips }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      zips.forEach(zip => params.append('zips', zip));
      params.set('page', page.toString());

      const res = await fetch(`/api/posts/near-you?${params.toString()}`);
      const data = await res.json();

      if (data?.posts?.length > 0) {
        const uniquePosts = data.posts.filter((p: Post) => !posts.some(existing => existing.id === p.id));
        setPosts(prev => [...prev, ...uniquePosts]);
        setPage(prev => prev + 1);
        if (uniquePosts.length < 15) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        fetchPosts();
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading, hasMore]);

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={{
            ...post,
            timestamp: post.timestamp,
          }}
        />
      ))}
      {loading && <p className="text-center text-gray-600">Loading more posts...</p>}
      {!hasMore && posts.length > 0 && <p className="text-center text-gray-500">No more posts.</p>}
    </div>
  );
};

export default NearYouPosts;
