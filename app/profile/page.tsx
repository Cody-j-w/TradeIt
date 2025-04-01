// app/profile/page.tsx
'use client'

import { useState, useRef } from 'react';
import Image from 'next/image';

// Placeholder for profile picture
import ProfilePicPlaceholder from '@/assets/profile-placeholder.png';
import PencilIcon from '@/assets/pencil.png';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('Posts');
    const [description, setDescription] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null); // State for profile picture
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleEditDescription = () => {
        setIsEditingDescription(true);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleSaveDescription = () => {
        setIsEditingDescription(false);
        // You would typically save the description here (e.g., to a database)
    };

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfilePicClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div> 
            {/* Header Section */}
            <div className="flex flex-col bg-trade-orange p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="relative">
                            <Image 
                                src={profilePic || ProfilePicPlaceholder}
                                alt="Profile Picture" 
                                width={60} 
                                height={60} 
                                className="rounded-full mr-4" 
                            />
                            <button 
                                onClick={handleProfilePicClick} 
                                className="absolute bottom-0 right-3 rounded-full border-1 bg-trade-white p-1"
                            >
                                <Image src={PencilIcon} alt="Edit" className="h-4 w-4" />
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">username</h2>
                            <p className="text-sm text-gray-500">@userurl</p>
                        </div>
                    </div>
                </div>

                {/* Description Section - IN HEADER */}
                <div className="mt-2 flex items-center">
                    {isEditingDescription ? (
                        <div className="flex items-center w-full">
                            <textarea
                                value={description}
                                onChange={handleDescriptionChange}
                                maxLength={120}
                                className="border rounded p-2 w-full"
                                placeholder="Add a short description (max 120 characters)"
                            />
                            <button
                                onClick={handleSaveDescription}
                                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center w-full">
                            <button onClick={handleEditDescription} className="text-gray-500 mr-2">
                                <Image src={PencilIcon} alt="Edit" className="h-4 w-4" />
                            </button>
                            <p className="text-sm text-gray-600">
                                {description || 'Add a short description'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-around bg-gray-300 text-trade-gray">
                <button
                    className={`px-4 py-2 ${activeTab === 'Posts' ? 'border-b-3 border-trade-blue' : ''}`}
                    onClick={() => handleTabClick('Posts')}
                >
                    Posts
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'Trades' ? 'border-b-3 border-trade-blue' : ''}`}
                    onClick={() => handleTabClick('Trades')}
                >
                    Trades
                </button>
            </div>

            {/* Post/Trade Items (Placeholder) */}
            <div className="space-y-4 p-4">
                <div className="border bg-trade-white rounded-lg p-4">
                    {/* Post/Trade Content will go here */}
                    <p className="text-gray-600">Post/Trade content will be populated here.</p>
                </div>
                <div className="border bg-trade-white rounded-lg p-4">
                    {/* Post/Trade Content will go here */}
                    <p className="text-gray-600">Post/Trade content will be populated here.</p>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;