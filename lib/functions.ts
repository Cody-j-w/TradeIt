"use server";
import { getMaxAge } from "next/dist/server/image-optimizer";
import { auth0 } from "./auth0";
import { fetchFollowedPosts, fetchFollows, getSelf, getSingleUser, getUsers, insertPost, updateAvatar, updateUsername, userLogin } from "./data";
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
    const user = await getSingleUser(userEmail);
    if (user) {
        return user;
    } else {
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

export async function addFollow() {

}

export async function getFollowers() {

}

export async function submitAvatar(data: FormData) {
    const input = data.get("input") as File;
    if (input.size > 0) {
        if (input.type === 'image/jpeg' || input.type === 'image/png') {
            const uploadedImage = await imageUpload(input);
            await updateAvatar(uploadedImage.url);
            revalidatePath("/pages/home");
        }
    }
}

export async function submitUsername(data: FormData) {
    const input = data.get("input")?.toString();
    if (input && input.length > 0) {
        await updateUsername(input);
        revalidatePath("/pages/home");
    }
}