// components/LikeButton.tsx
'use client';

import React, { useState } from 'react';
import { likePost } from '@/lib/functions';
import Image from 'next/image';
import LikeEmpty from "@/assets/likeOutlineOrange.svg";
import LikeLight from "@/assets/likeOrange.svg";
import LikeDark from "@/assets/likeOrange.svg";

interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  onLikeChange: (newLikeState: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, isLiked, onLikeChange}) => {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLikeClick = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      console.log("Fuck you, Ace. I don't wanna make a Button"); // Added console log

      const formData = new FormData();
      formData.append('post_id', postId);

      const result = await likePost(formData);
      if (result) {
        const newLikeState = !localIsLiked;
        setLocalIsLiked(newLikeState);
        onLikeChange(newLikeState);
      } else {
        console.error('Failed to like/unlike post.');
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  let likeImage;
  if (!localIsLiked) {
    likeImage = LikeEmpty;
  } else if (localIsLiked) {
    likeImage = LikeLight;
  } else {
    likeImage = LikeDark;
  }

  return (
    <button onClick={handleLikeClick} disabled={isSubmitting}>
      <Image src={likeImage} alt={localIsLiked ? "Liked" : "Not Liked"} width={24} height={24} />
    </button>
  );
};

export default LikeButton;