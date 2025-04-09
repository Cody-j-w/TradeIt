"use server";
import { auth0 } from "./auth0";

export async function getSession() {
    const session = await auth0.getSession();
    return session;
}