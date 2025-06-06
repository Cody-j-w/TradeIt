// app/pages/profile/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { getUser, submitZip } from '@/lib/functions';
import LogoutButton from '@/components/LogoutButton';
import MyPostsCard from '@/components/MyPostsCard';
import { getMyPosts } from '@/lib/functions';
import { useTransition } from 'react'; // For pending UI

// Placeholder assets
import ProfilePicPlaceholder from '@/assets/profile-placeholder.png';
import PencilIcon from '@/assets/pencil.png';
import SettingsIcon from '@/assets/settings.svg';

interface User {
  id: string;
  name: string;
  image: string | null;
  slug: string;
  description?: string | null;
}

interface Post {
  id: string;
  user_id: string;
  text: string;
  image: string | null;
  type: string;
  timestamp: Date;
}

const Profile = () => {
  const router = useRouter();
  const { user: auth0User, isLoading, error } = useUser();
  const [activeTab, setActiveTab] = useState('Posts');
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [zipCode, setZipCode] = useState(''); // State for zip code input
  const [isZipFormPending, startZipTransition] = useTransition();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth0User?.email) {
          const fetchedUser = await getUser(auth0User.email);
          console.log('Fetched User:', fetchedUser);
          if (fetchedUser) {
            setUser(fetchedUser);
            setProfilePic(fetchedUser.image);
            const myPosts = await getMyPosts();
            if (myPosts) {
              console.log(myPosts);
              setPosts(myPosts);
            }
          } else {
            setUser(null);
          }
        }
        console.log(posts);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setUser(null);
      }
    };

    fetchUserData();
  }, [auth0User?.email]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleSaveDescription = async () => {
    setIsEditingDescription(false);
    try {
      if (user?.id) {
        const response = await fetch('/api/update-description', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, description }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log('Description saved:', description);
      }
    } catch (err: any) {
      console.error('Error saving description:', err);
    }
  };

  const handleProfilePicChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
      console.log('New profile picture selected:', reader.result);
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
  };

  const handleZipCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (zipCode) {
      startZipTransition(async () => {
        const formData = new FormData();
        formData.append('zip', zipCode);
        const result = await submitZip(formData);
        if (result) {
          console.log('Zip code updated successfully:', result);
          // Optionally, provide user feedback (e.g., a success message)
        } else {
          console.error('Failed to update zip code.');
          // Optionally, provide user feedback (e.g., an error message)
        }
      });
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error loading profile.</div>;
  }

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col bg-trade-orange dark:bg-trade-green z-50 p-4 sticky top-0 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Image
                src={profilePic || user.image || ProfilePicPlaceholder}
                alt="Profile Picture"
                width={60}
                height={60}
                className="rounded-full mr-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    ProfilePicPlaceholder.src;
                }}
              />
              <button
                onClick={handleProfilePicClick}
                className="absolute bottom-0 right-3 rounded-full border-1 bg-trade-white dark:bg-trade-gray p-1"
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
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-amber-400">
                {user.slug}
              </p>
            </div>
          </div>
          {/* Settings Button */}
          <div className="relative">
            <button
              onClick={toggleSettings}
              className="rounded-full p-2 bg-trade-white dark:bg-trade-orange"
            >
              <Image src={SettingsIcon} alt="Settings" className="h-5 w-5" />
            </button>
            {isSettingsOpen && (
              <div
                className="absolute right-0 z-50 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu-button"
              >
                <a
                  href="/account/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Account Settings
                </a>
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <LogoutButton />
                </div>
                {/* Zip Code Form */}
                <form onSubmit={handleZipCodeSubmit} className="px-4 py-2">
                  <label
                    htmlFor="zip-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Update Zip Code:
                  </label>
                  <input
                    type="text"
                    id="zip-code"
                    value={zipCode}
                    onChange={handleZipCodeChange}
                    maxLength={10} // Adjust as needed
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter zip code"
                  />
                  <button
                    type="submit"
                    disabled={isZipFormPending}
                    className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isZipFormPending ? 'Updating...' : 'Update Zip'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
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
              <button
                onClick={handleEditDescription}
                className="text-gray-500 mr-2"
              >
                <Image src={PencilIcon} alt="Edit" className="h-4 w-4" />
              </button>
              <p className="text-sm text-gray-600">
                {user.description || 'Add a short description'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex sticky z-30 justify-around bg-gray-300 text-trade-gray dark:bg-trade-gray dark:text-trade-orange w-full top-30">
        <button
          className={`px-4 py-2 ${
            activeTab === 'Posts' ? 'border-b-3 border-trade-blue' : ''
          }`}
          onClick={() => handleTabClick('Posts')}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'Trades' ? 'border-b-3 border-trade-blue' : ''
          }`}
          onClick={() => handleTabClick('Trades')}
        >
          Trades
        </button>
      </div>

      {/* Post/Trade Items */}
      <div className="space-y-4 p-4 pb-23">
        {activeTab === 'Posts' && posts.length > 0 ? (
          posts.map((post) => <MyPostsCard key={post.id} post={post} />)
        ) : activeTab === 'Posts' ? (
          <div className="border bg-trade-white rounded-lg p-4">
            <p className="text-gray-600">No posts yet.</p>
          </div>
        ) : (
          <div className="border bg-trade-white rounded-lg p-4">
            {/* Placeholder for Trades content */}
            <p className="text-gray-600">Trades content will be populated here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;