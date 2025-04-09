'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useUser, getAccessToken } from '@auth0/nextjs-auth0';

// Placeholder for profile picture
import ProfilePicPlaceholder from '@/assets/profile-placeholder.png';
import PencilIcon from '@/assets/pencil.png';

interface User {
  id: string;
  username: string;
  userurl: string;
  // ... other user properties
}

const ProfilePage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const { user: auth0User, isLoading, error } = useUser();
  const [activeTab, setActiveTab] = useState('Posts');
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getAccessToken();
        setAccessToken(token);
        // Replace this with your actual API call to fetch user data based on userId
        // Example using the accessToken:
        // const response = await fetch(`/api/users/${userId}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // const fetchedUser = await response.json();
        // setUser(fetchedUser);

        // Simulate fetching user data (replace with your actual API call)
        const fetchedUser: User = {
          id: userId as string, // Ensure userId is treated as a string
          username: `User ${userId}`,
          userurl: `@user${userId}`,
        };
        setUser(fetchedUser);
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        // Handle error appropriately (e.g., redirect to an error page)
      }
    };

    fetchUserData();
  }, [userId, getAccessToken]);

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
    // add call to save the description to database
    if (accessToken) {
      try {
        // Make your API call to update the description using the accessToken
        // await fetch('/api/update-description', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        //   body: JSON.stringify({ userId, description }),
        // });
        console.log('Description saved:', description);
      } catch (error: any) {
        console.error('Error saving description:', error);
        // Handle error
      }
    } else {
      console.warn('Access token not available.');
    }
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

  const handleFollowClick = async () => {
    // Implement follow logic
    console.log(`Following user: ${user?.username}`);
    if (accessToken && auth0User?.sub && user?.id) {
      try {
        // Make your API call to follow the user using the accessToken
        // await fetch('/api/follow-user', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        //   body: JSON.stringify({ followerId: auth0User.sub, followingId: user.id }),
        // });
        console.log('Follow request sent');
      } catch (error: any) {
        console.error('Error following user:', error);
        // Handle error
      }
    } else {
      console.warn('Access token or user information not available.');
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error loading profile.</div>;
  }

  // Determine if it's the logged-in user's profile using Auth0 user ID
  const isOwnProfile = auth0User?.sub === user?.id;

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
              {isOwnProfile && (
                <button
                  onClick={handleProfilePicClick}
                  className="absolute bottom-0 right-3 rounded-full border-1 bg-trade-white p-1"
                >
                  <Image src={PencilIcon} alt="Edit" className="h-4 w-4" />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.username}</h2>
              <p className="text-sm text-gray-500">{user?.userurl}</p>
            </div>
          </div>
          {!isOwnProfile && auth0User?.sub && ( // Only show follow button if logged in and not own profile
            <button
              onClick={handleFollowClick}
              className="bg-yellow-500 text-white px-4 py-2 rounded-full"
            >
              Follow
            </button>
          )}
        </div>

        {/* Description Section */}
        <div className="mt-2 flex items-center">
          {isOwnProfile ? (
            isEditingDescription ? (
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
            )
          ) : (
            <p className="text-sm text-gray-600">{description}</p>
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
};

export default ProfilePage;