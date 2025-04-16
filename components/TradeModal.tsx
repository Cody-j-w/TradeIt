'use client'

import React, { useState, useEffect, useRef } from 'react';

// If you have a separate file for your shared User interface (e.g., src/types/user.ts),
// import it here:
// import { User } from '@/src/types/user'; 

// If you DON'T have a separate file, define the User interface here, 
// but make sure it's EXACTLY the same as the one in AddNewWrapper:
interface User {
  id: string; // Changed to string to match UsersTable's id
  name: string;
  image: string;
  slug: string;
  username: string;
  avatar: string;
}

interface Item {
  id: number;
  userId: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  loggedInUser: User | null; // Use the consistent User type
  loggedInUserItems: Item[];
  allUsers: User[]; // Use the consistent User type
  allAvailableItems: Item[];
}

const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  loggedInUser,
  loggedInUserItems,
  allUsers,
  allAvailableItems,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [selectedUserItem, setSelectedUserItem] = useState<Item | null>(null);
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);
  const [isItemSelectOpen, setIsItemSelectOpen] = useState(false);
  const [isUserItemSelectOpen, setIsUserItemSelectOpen] = useState(false);
  const [userItemSearchTerm, setUserItemSearchTerm] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const userSelectRef = useRef<HTMLDivElement>(null);
  const itemSelectRef = useRef<HTMLDivElement>(null);
  const userItemSelectRef = useRef<HTMLDivElement>(null);

  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredItems = allAvailableItems.filter(
	(item) =>
	  item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) &&
	  selectedUser &&
	  String(item.userId) === selectedUser.id
  );

  const filteredUserItems = loggedInUserItems.filter((item) =>
    item.name.toLowerCase().includes(userItemSearchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) {
      setSelectedUser(null);
      setSelectedItem(null);
      setUserSearchTerm('');
      setItemSearchTerm('');
      setSelectedUserItem(null);
      setIsUserSelectOpen(false);
      setIsItemSelectOpen(false);
      setIsUserItemSelectOpen(false);
      setUserItemSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
      if (userSelectRef.current && !userSelectRef.current.contains(event.target as Node)) {
        setIsUserSelectOpen(false);
      }
      if (itemSelectRef.current && !itemSelectRef.current.contains(event.target as Node)) {
        setIsItemSelectOpen(false);
      }
      if (userItemSelectRef.current && !userItemSelectRef.current.contains(event.target as Node)) {
        setIsUserItemSelectOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultUser = {
    id: '0', // Changed to string to match User interface
    username: 'No User Selected',
    avatar: '/path/to/default/user.jpg',
  };

  const defaultItem = {
    id: 0,
    userId: 0,
    name: 'No Item Selected',
    description: 'Please select an item to trade.',
    imageUrl: '/path/to/placeholder.jpg',
  };

  const userToDisplay = selectedUser || defaultUser;
  const itemToDisplay = selectedUserItem || defaultItem;
  const partnerItemToDisplay = selectedItem || defaultItem;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
    >
      <div ref={modalRef} className="bg-white p-6 rounded-lg w-full max-w-2xl z-50 overflow-y-auto dark:bg-trade-gray">
        <h2 className="text-lg font-semibold mb-4">Create Trade Offer</h2>

        {/* Logged-in User Section */}
        <div className="border p-4 mb-4">
          <h3 className="text-md font-semibold mb-2">Your Offer</h3>
          <div className="flex items-start">
            <img src={loggedInUser?.avatar} alt="Your Avatar" className="w-12 h-12 rounded-full mr-4" />
            <div>
              <p className="font-semibold">{loggedInUser?.username}</p>
              <div className="relative" ref={userItemSelectRef}>
                <input
                  type="text"
                  placeholder="Search Your Items"
                  value={userItemSearchTerm}
                  onChange={(e) => {
                    setUserItemSearchTerm(e.target.value);
                    setIsUserItemSelectOpen(true);
                  }}
                  onClick={() => setIsUserItemSelectOpen(true)}
                  className="border p-2 mb-2 w-full"
                />
                {isUserItemSelectOpen && (
                  <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                    {filteredUserItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedUserItem(item);
                          setUserItemSearchTerm(item.name);
                          setIsUserItemSelectOpen(false);
                        }}
                      >
                        {item.name}: {item.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center mt-2">
                <img src={itemToDisplay.imageUrl} alt={itemToDisplay.name} className="w-8 h-8 rounded mr-2" />
                <span>
                  {itemToDisplay.name}: {itemToDisplay.description}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Partner Section */}
        <div className="border p-4">
          <h3 className="text-md font-semibold mb-2">Trade Partner's Offer</h3>

          <div className="flex items-start mb-4">
            <img src={userToDisplay?.avatar} alt="Partner Avatar" className="w-12 h-12 rounded-full mr-4" />
            <div>
              <p className="font-semibold">{userToDisplay?.username}</p>
            </div>
          </div>

          {/* User Select with Search */}
          <div className="relative" ref={userSelectRef}>
            <input
              type="text"
              placeholder="Search User"
              value={userSearchTerm}
              onChange={(e) => {
                setUserSearchTerm(e.target.value);
                setIsUserSelectOpen(true);
              }}
              onClick={() => setIsUserSelectOpen(true)}
              className="border p-2 mb-2 w-full"
            />
            {isUserSelectOpen && (
              <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user);
                      setUserSearchTerm(user.username);
                      setSelectedItem(null);
                      setItemSearchTerm('');
                      setIsUserSelectOpen(false);
                    }}
                  >
                    {user.username}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Select with Search */}
          <div className="relative" ref={itemSelectRef}>
            <input
              type="text"
              placeholder="Search Item"
              value={itemSearchTerm}
              onChange={(e) => {
                setItemSearchTerm(e.target.value);
                setIsItemSelectOpen(true);
              }}
              onClick={() => setIsItemSelectOpen(true)}
              className="border p-2 mb-2 w-full"
            />
            {selectedUser && isItemSelectOpen && (
              <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedItem(item);
                      setItemSearchTerm(item.name);
                      setIsItemSelectOpen(false);
                    }}
                  >
                    {item.name}: {item.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display Selected Item */}
          <div className="flex items-center mt-2">
            <img src={partnerItemToDisplay?.imageUrl} alt={partnerItemToDisplay?.name} className="w-8 h-8 rounded mr-2" />
            <span>
              {partnerItemToDisplay?.name}: {partnerItemToDisplay?.description}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Send Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;