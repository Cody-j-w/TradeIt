// components/AddNewWrapper.tsx
'use client';

import React, { useState, useEffect } from 'react';
import AddNewButton from '@/components/AddNewButton';
import TradeModal from '@/components/TradeModal';
import PostModal from '@/components/PostModal';
import BlogModal from '@/components/BlogModal';
import { getMe, getAllUsers } from '@/lib/functions';

interface User {
    id: string; // Keep as string for compatibility (or adjust TradeModal)
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

const AddNewWrapper: React.FC = () => {
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // Use User, not UsersTable
    const [allUsers, setAllUsers] = useState<User[] | null>(null); // Use User[], not UsersTable[]
    const [loggedInUserItems, setLoggedInUserItems] = useState<Item[]>([]);
    const [allAvailableItems, setAllAvailableItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getMe();
            if (user) {
                // Adapt UsersTable to User immediately
                const adaptedUser: User = {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                    slug: user.slug,
                    username: "default_username", // Replace with actual logic
                    avatar: "/default/avatar.png",   // Replace with actual logic
                };
                setLoggedInUser(adaptedUser);
            }

            const users = await getAllUsers();
            if (users) {
                const adaptedUsers: User[] = users.map(u => ({
                    id: u.id,
                    name: u.name,
                    image: u.image,
                    slug: u.slug,
                    username: "default_username", // Replace with actual logic
                    avatar: "/default/avatar.png",   // Replace with actual logic
                }));
                setAllUsers(adaptedUsers);
            }
        };

        fetchUserData();
    }, []);

    const openTradeModal = () => {
        setIsTradeModalOpen(true);
    };

    const closeTradeModal = () => {
        setIsTradeModalOpen(false);
    };

    const openPostModal = () => {
        setIsPostModalOpen(true);
    };

    const closePostModal = () => {
        setIsPostModalOpen(false);
    };

    const openBlogModal = () => {
        setIsBlogModalOpen(true);
    };

    const closeBlogModal = () => {
        setIsBlogModalOpen(false);
    };

    if (!loggedInUser || !allUsers) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <AddNewButton
                onOpenPostModal={openPostModal}
                onOpenBlogModal={openBlogModal}
                onOpenTradeModal={openTradeModal}
            />
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
            {isPostModalOpen && (
                <PostModal
                    isOpen={isPostModalOpen}
                    onClose={closePostModal}
                />
            )}
            {isBlogModalOpen && (
                <BlogModal
                    isOpen={isBlogModalOpen}
                    onClose={closeBlogModal}
                />
            )}
        </>
    );
};

export default AddNewWrapper;