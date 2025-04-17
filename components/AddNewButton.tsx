// AddNewButton.tsx
'use client';

import React, { useState } from 'react';
import Image from "next/image";
import addNew from "@/assets/new.svg";
import addPostIcon from '@/assets/post.svg';
import addTradeIcon from '@/assets/trading.png';
import addBlogIcon from '@/assets/blog.svg';

interface AddNewButtonProps {
  onOpenBlogModal: () => void;
  onOpenTradeModal: () => void;
  onOpenPostModal: () => void; // Change the type to the new function
}

const AddNewButton: React.FC<AddNewButtonProps> = ({ onOpenBlogModal, onOpenTradeModal, onOpenPostModal }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const buttonSpacing = 8;

  return (
    <div className="relative">
      {/* Add Post Button */}
      <button
        onClick={() => {
          onOpenPostModal(); // Call the passed function
          setIsExpanded(false);
        }}
        className={`fixed bottom-26 right-5 z-40 flex items-center justify-center p-2 rounded-full shadow-md transition duration-300 ease-out ${
          isExpanded ? 'opacity-100 scale-100 visible translate-x-[-190px]' : 'opacity-0 scale-0 invisible translate-x-0'
        } bg-trade-orange origin-center`}
      >
        <Image src={addPostIcon} alt="Add Post" width={20} height={20} />
      </button>

      {/* Add Trade Button */}
      <button
        onClick={() => {
          onOpenTradeModal();
          setIsExpanded(false);
        }}
        className={`fixed bottom-26 right-5 z-40 flex items-center justify-center p-2 rounded-full shadow-md transition duration-300 ease-out ${
          isExpanded ? 'opacity-100 scale-100 visible translate-x-[-145px]' : 'opacity-0 scale-0 invisible translate-x-0'
        } bg-trade-orange origin-center`}
      >
        <Image src={addTradeIcon} alt="Add Trade" width={20} height={20} />
      </button>

      {/* Add Blog Button */}
      <button
        onClick={() => {
          onOpenBlogModal();
          setIsExpanded(false);
        }}
        className={`fixed bottom-26 right-5 z-40 flex items-center justify-center p-2 rounded-full shadow-md transition duration-300 ease-out ${
          isExpanded ? 'opacity-100 scale-100 visible translate-x-[-100px]' : 'opacity-0 scale-0 invisible translate-x-0'
        } bg-trade-orange origin-center`}
      >
        <Image src={addBlogIcon} alt="Add Blog" width={20} height={20} />
      </button>

      {/* Main Button */}
      <button
        onClick={toggleExpand}
        className="fixed bottom-26 right-15 z-40 flex items-center justify-center p-3 rounded-full shadow-lg bg-trade-orange text-trade-white origin-center"
      >
        <Image src={addNew} alt="Add New" width={24} height={24} />
      </button>
    </div>
  );
};

export default AddNewButton;