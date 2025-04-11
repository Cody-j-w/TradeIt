// lib/functions
"use server";
import { auth0 } from "./auth0";
import { getSelf, getSingleUser, getUsers, insertPost, userLogin } from "./data";
import { put } from '@vercel/blob';

export async function getSession() {
    const session = await auth0.getSession();
    return session;
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
    return users;
}