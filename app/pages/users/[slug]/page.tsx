// app/pages/users/[slug]/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { getUserBySlug } from '@/lib/functions'; // Import the getUserBySlug function
import LogoutButton from '@/components/LogoutButton';
import MyPostsCard from '@/components/MyPostsCard';

// Placeholder for profile picture
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

interface Props {
  params: { slug: string };
}

const UserProfilePage: React.FC<Props> = ({ params }) => {
  const { slug } = params;
  const router = useRouter();
  const { user: auth0User, isLoading: auth0Loading, error: auth0Error } = useUser();
  const [activeTab, setActiveTab] = useState('Posts');
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOwnProfile = user?.slug === auth0User?.nickname; // Assuming Auth0 user.nickname is the slug

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUser = await getUserBySlug(slug); // Use the imported getUserBySlug
        if (fetchedUser) {
          setUser({
            id: fetchedUser.id,
            name: fetchedUser.name,
            image: fetchedUser.avatar,
            slug: slug, // Ensure slug is set in the user object
            description: user?.description, // Keep existing description if available during initial load
          });
          fetchUserPosts(fetchedUser.id);
        } else {
          setUser(null);
          setError('User not found.');
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [slug]);

  useEffect(() => {
    // Update local description state when user data with description is loaded
    if (user?.description && !isEditingDescription && description === '') {
      setDescription(user.description);
    }
  }, [user?.description, isEditingDescription, description]);

  const fetchUserPosts = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/posts`); // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Post[] = await response.json();
      setPosts(data);
      console.log("Fetched user posts:", data);
    } catch (err: any) {
      console.error('Error fetching user posts:', err);
      setPosts([]);
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSaveDescription = async () => {
    setIsEditingDescription(false);
    if (user?.id) {
      try {
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
        // Optionally update the local user state
        setUser({ ...user, description });
      } catch (err: any) {
        console.error('Error saving description:', err);
      }
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setProfilePic(reader.result as string);
        // Implement logic to upload the new profile picture to your backend
        try {
          const response = await fetch('/api/update-profile-picture', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id, image: reader.result }),
          });
          if (!response.ok) {
            console.error('Error updating profile picture:', response.status);
          } else {
            // Optionally update the local user state
            setUser({ ...user, image: reader.result as string });
          }
        } catch (err) {
          console.error('Error uploading profile picture:', err);
        }
      };
      reader.readAsDataURL(file);
      console.log('New profile picture selected:', reader.result);
    }
  };

  const handleProfilePicClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  if (isLoading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col bg-trade-orange dark:bg-trade-green p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Image
                src={profilePic || user.image || ProfilePicPlaceholder}
                alt="Profile Picture"
                width={60}
                height={60}
                className={`rounded-full mr-4 ${!isOwnProfile && 'cursor-default'}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ProfilePicPlaceholder.src;
                }}
                onClick={handleProfilePicClick}
              />
              {isOwnProfile && (
                <button
                  onClick={handleProfilePicClick}
                  className="absolute bottom-0 right-3 rounded-full border-1 bg-trade-white dark:bg-trade-gray p-1"
                >
                  <Image src={PencilIcon} alt="Edit" className="h-4 w-4" />
                </button>
              )}
              {isOwnProfile && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-amber-400">@{user.slug}</p>
            </div>
          </div>
          {/* Settings Button - Only show on own profile */}
          {isOwnProfile && (
            <div className="relative">
              <button onClick={toggleSettings} className="rounded-full  p-2 bg-trade-white dark:bg-trade-orange">
                <Image src={SettingsIcon} alt="Settings" className="h-5 w-5" />
              </button>
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button">
                    <a href="/account/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Account Settings
                    </a>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      <LogoutButton />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="mt-2 flex items-center">
          {isOwnProfile && isEditingDescription ? (
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
              {isOwnProfile && (
                <button onClick={handleEditDescription} className="text-gray-500 mr-2">
                  <Image src={PencilIcon} alt="Edit" className="h-4 w-4" />
                </button>
              )}
              <p className="text-sm text-gray-600">
                {user?.description || 'No description provided.'}
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

      {/* Post/Trade Items */}
      <div className="space-y-4 p-4">
        {activeTab === 'Posts' && posts.length > 0 ? (
          posts.map((post) => (
            <MyPostsCard key={post.id} post={post} />
          ))
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

export default UserProfilePage;