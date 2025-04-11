"use server";
import { auth0 } from "./auth0";
import { getSelf, insertPost, userLogin } from "./data";
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