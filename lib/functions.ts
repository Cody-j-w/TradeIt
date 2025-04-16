// lib/functions
"use server";
import { getMaxAge } from "next/dist/server/image-optimizer";
import { auth0 } from "./auth0";
import { addFollow, fetchFollowedPosts, fetchFollows, fetchPosts, getSelf, getSingleUser, getUsers, fetchUsersByIds, insertGood, insertLike, insertPost, updateAvatar, updateBio, updateUsername, updateZip, userLogin } from "./data"
import { put } from '@vercel/blob';
import { revalidatePath } from "next/cache";

export async function getSession() {
    const session = await auth0.getSession();
    return session;
}

export async function getMe() {
    const me = await getSelf();
    return me;
}

export async function login(name: string, image: string) {
    const loginInfo = await userLogin(name, image);
    return loginInfo;
}

export async function imageUpload(image: File) {
    const blob = await put(image.name, image, {
        access: 'public',
        addRandomSuffix: true
    });
    return blob;
}

export async function getUser(userEmail: string) {
    try {
        const user = await getSingleUser(userEmail);
        if (user) {
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export async function getAllUsers() {
    const users = await getUsers();
    if (users) {
        return users;
    } else {
        return null;
    }
}

export async function getUsersById(userIds: string[]): Promise<{[key: string]: { id: string; name: string; avatar: string }}> {
    try {
        const usersData = await fetchUsersByIds(userIds);
        const formattedUsers: {[key: string]: { id: string; name: string; avatar: string }} = {};
        for (const id in usersData) {
            if (usersData.hasOwnProperty(id)) {
                formattedUsers[id] = {
                    id: usersData[id].id,
                    name: usersData[id].name,
                    avatar: usersData[id].image,
                };
            }
        }
        return formattedUsers;
    } catch (error) {
        console.error("Error in lib/functions getUsersByIds:", error);
        return {};
    }
}

export async function getFollowedPosts() {
    const follows = await fetchFollowedPosts();
    if (follows) {
        return follows;
    } else {
        return null;
    }
}

export async function getAllPosts(page: string) {
    const posts = await fetchPosts(page);
    if (posts) {
        const formattedPosts = posts.map(post => ({
            id: Math.random().toString(36).substring(2, 15), // Keep this if your database doesn't provide a direct post ID
            user_id: post.user_id, // Access the user's ID from the 'id' property of the joined 'users' table
            text: post.text,
            image: post.image,
            type: 'blog',
            timestamp: post.timestamp,
            name: post.name, // Access the user's name from the 'name' property of the joined 'users' table
        }));
        return formattedPosts;
    } else {
        return null;
    }
}

export async function getFollowedUsers() {
    const follows = await fetchFollows();
    if (follows) {
        return follows;
    } else {
        return null;
    }
}

export async function submitFollow(data: FormData) {
    const followedUser = await data.get("user_id")?.toString();
    if (followedUser) {
        const newFollow = await addFollow(followedUser)
        return newFollow;
    } else {
        return null;
    }
}

export async function getFollowers() {

}

export async function submitAvatar(data: FormData) {
    const input = data.get("input") as File;
    if (input.size > 0) {
        if (input.type === 'image/jpeg' || input.type === 'image/png') {
            const uploadedImage = await imageUpload(input);
            await updateAvatar(uploadedImage.url);
            return { "message": "successfully updated" }
        }
    }
}

export async function submitUsername(data: FormData) {
    const input = data.get("username")?.toString();
    if (input && input.length > 0) {
        await updateUsername(input);
        return { "message": "successfully updated" }
    }
}

export async function submitBio(data: FormData) {
    const input = data.get("bio")?.toString();
    if (input) {
        await updateBio(input);
        return { "message": "successfully updated" }
    }
}

export async function submitZip(data: FormData) {
    const zip = data.get("zip")?.toString();
    if (zip) {
        await updateZip(zip);
        return { "message": "successfully updated" }
    }
}

export async function submitPost(data: FormData): Promise<boolean> {
    const user = await getSelf();
    const text = data.get("text")?.toString();
    const postGood = data.get("good")?.toString();
    let type = data.get("type")?.toString();
    if (type !== 'UFT' && type !== 'ISO') {
        type = 'blog';
    }
    const image = data.get("image") as File;
    let imgUrl: string | null = null;
    let good: string | null = null;
    let success = false;
    // tests
    console.log("user: " + user.id);
    console.log("text: " + text);
    console.log("postGood: " + postGood);
    console.log("type: " + type);

    if (image !== null) {
        if (image.size > 0) {
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                const uploadedImage = await imageUpload(image);
                imgUrl = uploadedImage.url;
            }
        }
    }

    if (postGood) {
        const submittedGood = await insertGood(postGood);
        good = submittedGood?.name ?? null;
    }

    if (text) {
        const newPost = await insertPost(user.id, text, good ?? "", type, imgUrl);
        if (newPost) {
            success = true;
        }
    }
    return success;
}

export async function likePost(data: FormData) {
    const post = data.get("post_id")?.toString();
    if (post) {
        const newLike = await insertLike(post);
        return newLike;
    } else {
        return null;
    }
}
