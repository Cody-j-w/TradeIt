// app/profile/page.tsx
'use client'

import React from 'react';
import Image from 'next/image';

// Placeholder for profile picture
import ProfilePicPlaceholder from '@/assets/profile-placeholder.jpg';

export default function ProfilePage() {
  return (
    <div className="p-4"> 
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Image 
            src={ProfilePicPlaceholder} 
            alt="Profile Picture" 
            width={60} 
            height={60} 
            className="rounded-full mr-4" 
          />
          <div>
            <h2 className="text-lg font-semibold">Mike</h2>
            <p className="text-sm text-gray-500">@BilbeeBoy</p>
          </div>
        </div>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">Follow</button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-4">
        <button className="text-lg font-semibold border-b-2 border-yellow-500">Posts</button>
        <button className="text-lg font-semibold text-gray-500">Trades</button>
      </div>

      {/* Post/Trade Items (Placeholder) */}
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          {/* Post/Trade Content will go here */}
          <p className="text-gray-600">Post/Trade content will be populated here.</p>
        </div>
        <div className="border rounded-lg p-4">
          {/* Post/Trade Content will go here */}
          <p className="text-gray-600">Post/Trade content will be populated here.</p>
        </div>
      </div>
    </div>
  );
}