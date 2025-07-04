// app/pages/meetup/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Interfaces to type the data received from URL
interface UserDetails {
    id: string;
    name: string;
    avatar: string;
}

interface ItemDetails {
    id: string; // Changed to string as it comes from URL query
    name: string;
    description: string;
    imageUrl: string;
}

const MeetupPage: React.FC = () => {
    const searchParams = useSearchParams();

    // State to store parsed trade details
    const [loggedInUser, setLoggedInUser] = useState<UserDetails | null>(null);
    const [offeredItem, setOfferedItem] = useState<ItemDetails | null>(null);
    const [tradingPartner, setTradingPartner] = useState<UserDetails | null>(null);
    const [requestedItem, setRequestedItem] = useState<ItemDetails | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (searchParams) {
            try {
                const loggedInUserId = searchParams.get('loggedInUserId');
                const loggedInUserName = searchParams.get('loggedInUserName');
                const loggedInUserAvatar = searchParams.get('loggedInUserAvatar');
                if (loggedInUserId && loggedInUserName && loggedInUserAvatar) {
                    setLoggedInUser({
                        id: loggedInUserId,
                        name: loggedInUserName,
                        avatar: loggedInUserAvatar,
                    });
                } else {
                    throw new Error("Missing logged-in user details.");
                }

                const offeredItemId = searchParams.get('offeredItemId');
                const offeredItemName = searchParams.get('offeredItemName');
                const offeredItemDescription = searchParams.get('offeredItemDescription');
                const offeredItemImageUrl = searchParams.get('offeredItemImageUrl');
                if (offeredItemId && offeredItemName && offeredItemDescription && offeredItemImageUrl) {
                    setOfferedItem({
                        id: offeredItemId,
                        name: offeredItemName,
                        description: offeredItemDescription,
                        imageUrl: offeredItemImageUrl,
                    });
                } else {
                    throw new Error("Missing offered item details.");
                }

                const tradingPartnerId = searchParams.get('tradingPartnerId');
                const tradingPartnerName = searchParams.get('tradingPartnerName');
                const tradingPartnerAvatar = searchParams.get('tradingPartnerAvatar');
                if (tradingPartnerId && tradingPartnerName && tradingPartnerAvatar) {
                    setTradingPartner({
                        id: tradingPartnerId,
                        name: tradingPartnerName,
                        avatar: tradingPartnerAvatar,
                    });
                } else {
                    throw new Error("Missing trading partner details.");
                }

                const requestedItemId = searchParams.get('requestedItemId');
                const requestedItemName = searchParams.get('requestedItemName');
                const requestedItemDescription = searchParams.get('requestedItemDescription');
                const requestedItemImageUrl = searchParams.get('requestedItemImageUrl');
                if (requestedItemId && requestedItemName && requestedItemDescription && requestedItemImageUrl) {
                    setRequestedItem({
                        id: requestedItemId,
                        name: requestedItemName,
                        description: requestedItemDescription,
                        imageUrl: requestedItemImageUrl,
                    });
                } else {
                    throw new Error("Missing requested item details.");
                }

                setLoading(false);
            } catch (err: any) {
                console.error("Error parsing trade details from URL:", err);
                setError(`Failed to load trade details: ${err.message}`);
                setLoading(false);
            }
        }
    }, [searchParams]);

    if (loading) {
        return <div className="p-8 text-center">Loading trade details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    if (!loggedInUser || !offeredItem || !tradingPartner || !requestedItem) {
        return <div className="p-8 text-center text-red-500">Essential trade details are missing. Please try again.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white p-6">
            <div className="max-w-3xl mx-auto bg-white dark:bg-trade-gray rounded-lg shadow-lg p-8 mt-10">
                <h1 className="text-3xl font-bold mb-6 text-center text-trade-blue dark:text-trade-orange">Trade Accepted! Meetup Details</h1>

                <p className="mb-6 text-center text-lg">
                    Congratulations! Your trade has been accepted. Here are the details to coordinate your meetup.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Your Offer */}
                    <div className="bg-gray-50 dark:bg-zinc-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="mr-2">Your Offer</span>
                            <img src={loggedInUser.avatar} alt={loggedInUser.name} className="w-10 h-10 rounded-full" />
                        </h2>
                        <div className="flex items-center mb-2">
                            <span className="font-medium mr-2">You ({loggedInUser.name}) are offering:</span>
                        </div>
                        <div className="flex items-start">
                            <img src={offeredItem.imageUrl} alt={offeredItem.name} className="w-16 h-16 rounded mr-4 object-cover" />
                            <div>
                                <p className="font-bold text-lg">{offeredItem.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{offeredItem.description}</p>
                                <Link href={`/pages/items/${offeredItem.id}`} className="text-trade-blue hover:underline text-sm mt-1 block">
                                    View Item
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Partner's Request */}
                    <div className="bg-gray-50 dark:bg-zinc-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="mr-2">Partner's Item</span>
                            <img src={tradingPartner.avatar} alt={tradingPartner.name} className="w-10 h-10 rounded-full" />
                        </h2>
                        <div className="flex items-center mb-2">
                            <span className="font-medium mr-2">{tradingPartner.name} is trading:</span>
                        </div>
                        <div className="flex items-start">
                            <img src={requestedItem.imageUrl} alt={requestedItem.name} className="w-16 h-16 rounded mr-4 object-cover" />
                            <div>
                                <p className="font-bold text-lg">{requestedItem.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{requestedItem.description}</p>
                                <Link href={`/pages/items/${requestedItem.id}`} className="text-trade-blue hover:underline text-sm mt-1 block">
                                    View Item
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold mb-4">Next Steps:</h3>
                    <p className="text-lg mb-2">
                        Please contact {tradingPartner.name} to arrange a convenient meetup time and location.
                    </p>
                    <p className="text-lg">
                        Their username is: <span className="font-bold text-trade-blue dark:text-trade-orange">{tradingPartner.name}</span>
                    </p>
                    {/* Example placeholder for contact info - replace with actual methods */}
                    <p className="text-md text-gray-600 dark:text-gray-300 mt-4">
                        (You might add a chat link or contact method here in a real app)
                    </p>
                </div>

                <div className="text-center">
                    <Link href="/" className="inline-block bg-trade-blue dark:bg-trade-orange text-white px-6 py-3 rounded-lg text-lg hover:opacity-90 transition-opacity">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MeetupPage;