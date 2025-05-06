'use client'

import React from 'react';

interface User {
  id: string;
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

interface TradeAcceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  loggedInUser: User | null;
  offeredItem: Item | null;
  tradingPartner: User | null;
  requestedItem: Item | null;
}

const TradeAcceptModal: React.FC<TradeAcceptModalProps> = ({
  isOpen,
  onClose,
  loggedInUser,
  offeredItem,
  tradingPartner,
  requestedItem,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-lg z-50 overflow-y-auto dark:bg-trade-gray">
        <h2 className="text-lg font-semibold mb-4">Review Trade Offer</h2>

        {/* Logged-in User's Offer */}
        <div className="border p-4 mb-4">
          <h3 className="text-md font-semibold mb-2">Your Offer</h3>
          <div className="flex items-start">
            <img src={loggedInUser?.avatar} alt="Your Avatar" className="w-12 h-12 rounded-full mr-4" />
            <div>
              <p className="font-semibold">{loggedInUser?.username}</p>
              {offeredItem && (
                <div className="flex items-center mt-2">
                  <img src={offeredItem.imageUrl} alt={offeredItem.name} className="w-8 h-8 rounded mr-2" />
                  <span>{offeredItem.name}: {offeredItem.description}</span>
                </div>
              )}
              {!offeredItem && <p className="text-gray-500">No item offered.</p>}
            </div>
          </div>
        </div>

        {/* Trade Partner's Request */}
        <div className="border p-4 mb-4">
          <h3 className="text-md font-semibold mb-2">Trade Partner's Request</h3>
          <div className="flex items-start">
            <img src={tradingPartner?.avatar} alt="Partner Avatar" className="w-12 h-12 rounded-full mr-4" />
            <div>
              <p className="font-semibold">{tradingPartner?.username}</p>
              {requestedItem && (
                <div className="flex items-center mt-2">
                  <img src={requestedItem.imageUrl} alt={requestedItem.name} className="w-8 h-8 rounded mr-2" />
                  <span>{requestedItem.name}: {requestedItem.description}</span>
                </div>
              )}
              {!requestedItem && <p className="text-gray-500">No item requested.</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">
            Decline
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Accept Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeAcceptModal;