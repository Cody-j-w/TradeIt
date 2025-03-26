import { sql } from "@vercel/postgres";
import { db } from "./db";
import { auth } from "@/auth";
import { Auth0Profile } from "next-auth/providers/auth0";

export async function userInformation() {

    const session = await auth();
    if (session) {
        console.log(session?.user?.id);
        console.log(session?.user?.email);
        return session;
    } else {
        console.log("please sign in");
    }

}