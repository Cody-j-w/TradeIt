// lib/functions
"use server";
import { getMaxAge } from "next/dist/server/image-optimizer";
import { auth0 } from "./auth0";
import { addFollow, fetchFollowedPosts, fetchFollows, getSelf, getSingleUser, getUsers, insertGood, insertPost, updateAvatar, updateBio, updateUsername, userLogin } from "./data";
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

export async function addPost(data: FormData) {
    const user = (await getSelf()).id;
    const postText = data.get("post")?.toString();
    const goodName = data.get("good")?.toString();
    const image = data.get("image") as File;
    const imageUrl = (await imageUpload(image)).url;
    return await insertPost(user, postText!!, goodName!!, imageUrl);
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

export async function getFollowedPosts() {
    const follows = await fetchFollowedPosts();
    if (follows) {
        return follows;
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
            revalidatePath("/pages/profile"); //placeholder revalidate - change to where ever this function ends up being used, probably /pages/profile
        }
    }
}

export async function submitUsername(data: FormData) {
    const input = data.get("username")?.toString();
    if (input && input.length > 0) {
        await updateUsername(input);
        revalidatePath("/pages/home"); //placeholder revalidate - change to where ever this function ends up being used, probably /pages/profile
    }
}

export async function submitBio(data: FormData) {
    const input = data.get("bio")?.toString();
    if (input) {
        await updateBio(input);
        revalidatePath("/pages/home"); //placeholder revalidate - change to where ever this function ends up being used, probably /pages/profile
    }
}

export async function submitPost(data: FormData) {
    const user = await getSelf();
    const text = data.get("text")?.toString();
    const postGood = data.get("good")?.toString();
    const image = data.get("image") as File;
    let imgUrl = undefined;
    let good = "";
    if (image.size > 0) {
        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            const uploadedImage = await imageUpload(image);
            imgUrl = uploadedImage.url;
        }
    }
    if (postGood) {
        const submittedGood = await insertGood(postGood);
        if (submittedGood) {
            good = submittedGood?.name
        }
    }
    if (good != "" && text) {
        const newPost = await insertPost(user.id, text, good, imgUrl);
        return newPost;
    }
}