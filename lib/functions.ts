// lib/functions
"use server";
import { auth0 } from "./auth0";
import { userLogin } from "./data";

export async function getSession() {
    const session = await auth0.getSession();
    return session;
}

export async function login(name: string, image: string) {
    const loginInfo = await userLogin(name, image);
    return loginInfo;
}