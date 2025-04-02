// components/TradeWrapper.tsx
'use client';

import React, { useState } from 'react';
import TradeButton from '@/components/TradeButton';
import TradeModal from '@/components/TradeModal';

interface User {
  id: number;
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

const TradeWrapper: React.FC = () => {
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User>({ // Placeholder data - You'll need to fetch this
    id: 1,
    username: 'CurrentUser',
    avatar: '/path/to/current/avatar.jpg',
  });
  const [loggedInUserItems, setLoggedInUserItems] = useState<Item[]>([ // Placeholder data - You'll need to fetch this
    { id: 101, userId: 1, name: 'Item 1', description: 'Description 1', imageUrl: '/path/to/item1.jpg' },
    { id: 102, userId: 1, name: 'Item 2', description: 'Description 2', imageUrl: '/path/to/item2.jpg' },
  ]);
  const [allUsers, setAllUsers] = useState<User[]>([ // Placeholder data - You'll need to fetch this
    { id: 2, username: 'UserA', avatar: '/path/to/userA/avatar.jpg' },
    { id: 3, username: 'UserB', avatar: '/path/to/userB/avatar.jpg' },
  ]);
  const [allAvailableItems, setAllAvailableItems] = useState<Item[]>([ // Placeholder data - You'll need to fetch this
    { id: 201, userId: 2, name: 'Item A', description: 'Description A', imageUrl: '/path/to/itemA.jpg' },
    { id: 202, userId: 2, name: 'Item B', description: 'Description B', imageUrl: '/path/to/itemB.jpg' },
    { id: 301, userId: 3, name: 'Item C', description: 'Description C', imageUrl: '/path/to/itemC.jpg' },
  ]);

  const openTradeModal = () => {
    setIsTradeModalOpen(true);
  };

  const closeTradeModal = () => {
    setIsTradeModalOpen(false);
  };

  return (
    <>
      {/* Trade Button (Floating) */}
      {!isTradeModalOpen && <TradeButton onOpen={openTradeModal} />}

      {/* Conditionally render TradeModal */}
      {isTradeModalOpen && (
        <TradeModal
          isOpen={isTradeModalOpen}
          onClose={closeTradeModal}
          loggedInUser={loggedInUser}
          loggedInUserItems={loggedInUserItems}
          allUsers={allUsers}
          allAvailableItems={allAvailableItems}
        />
      )}
    </>
  );
};

export default TradeWrapper;