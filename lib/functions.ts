// lib/functions
"use server";
import { getMaxAge } from "next/dist/server/image-optimizer";
import { auth0 } from "./auth0";
import { addFollow, fetchFollowedPosts, fetchFollows, fetchPosts, getSelf, getSingleUser, getUsers, fetchUsersByIds, insertGood, insertLike, insertPost, updateAvatar, updateBio, updateUsername, updateZip, userLogin, fetchLoggedInUserPosts, fetchUserBySlug, fetchFollowStatus, fetchPostsById } from "./data"
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


export async function getUsersById(userIds: string[]): Promise<{ [key: string]: { id: string; name: string; avatar: string; slug: string } }> {
    try {
        const usersData = await fetchUsersByIds(userIds);
        const formattedUsers: { [key: string]: { id: string; name: string; avatar: string; slug: string } } = {};
        for (const id in usersData) {
            if (usersData.hasOwnProperty(id)) {
                formattedUsers[id] = {
                    id: usersData[id].id,
                    name: usersData[id].name,
                    avatar: usersData[id].image,
                    slug: usersData[id].slug
                };
            }
        }
        return formattedUsers;
    } catch (error) {
        console.error("Error in lib/functions getUsersByIds:", error);
        return {};
    }
}

export async function getUserBySlug(slug: string): Promise<{ id: string; bio: string; name: string; avatar: string } | null> {
    try {
        const userData = await fetchUserBySlug(slug);
        if (userData) {
            const formattedUser = {
                id: userData.id,
                name: userData.name,
                avatar: userData.image,
                bio: userData.bio
            };
            return formattedUser;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error in lib/functions getUserBySlug for slug "${slug}":`, error);
        return null;
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
    console.log("Raw posts from fetchPosts:", posts);
    console.log("Raw posts from fetchPosts in getAllPosts:", posts);
    if (posts) {
        const formattedPosts = posts.map(post => ({
            id: post.id,
            user_id: post.user_id,
            text: post.text,
            image: post.image,
            type: post.type,
            timestamp: post.timestamp,
            name: post.name,
        }));
        console.log("Formatted posts:", formattedPosts);
        return formattedPosts;
    } else {
        console.log("fetchPosts returned null or undefined");
        return null;
    }
}

export async function getMyPosts() {
    const posts = await fetchLoggedInUserPosts();
    if (posts) {
        const formattedPosts = posts.map(post => ({
            id: post.id,
            user_id: post.user_id,
            text: post.text,
            image: post.image,
            type: post.type,
            timestamp: post.timestamp,
            name: post.name,
        }));
        console.log("Formatted posts:", formattedPosts);
        return formattedPosts;
    } else {
        console.log("fetchPosts returned null or undefined");
        return null;
    }
}

export async function getPostsById(user_id: string) {
    const posts = await fetchPostsById(user_id);
    if (posts) {
        const formattedPosts = posts.map(post => ({
            id: post.id,
            user_id: post.user_id,
            text: post.text,
            image: post.image,
            type: post.type,
            timestamp: post.timestamp,
            name: post.name,
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
    const me = await getSelf();
    const followedUser = await data.get("user_id")?.toString();
    if (followedUser) {
        const newFollow = await addFollow(followedUser, me.id)
        return newFollow;
    } else {
        return null;
    }
}

export async function getFollowStatus(user_id: string) {
    const status = await fetchFollowStatus(user_id);
    return status;
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
