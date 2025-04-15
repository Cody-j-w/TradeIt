"use server";
import { getMaxAge } from "next/dist/server/image-optimizer";
import { auth0 } from "./auth0";
import { addFollow, fetchFollowedPosts, fetchFollows, getSelf, getSingleUser, getUsers, insertGood, insertLike, insertPost, updateAvatar, updateBio, updateUsername, updateZip, userLogin } from "./data";
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

export async function submitPost(data: FormData) {
    const user = await getSelf();
    const text = data.get("text")?.toString();
    const postGood = data.get("good")?.toString();
    let type = data.get("type")?.toString();
    if (type !== 'UFT' && type !== 'ISO') {
        type = 'blog';
    }
    const image = data.get("image") as File;
    let imgUrl = null;
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
        const newPost = await insertPost(user.id, text, good, type, imgUrl);
        return newPost;
    }
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