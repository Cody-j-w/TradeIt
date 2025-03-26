import { sql } from "@vercel/postgres";
import { db } from "./db";
import { auth } from "@/auth";

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

export async function userExists(userEmail: string) {
    try {
        const isUser =
            await sql`SELECT * FROM users WHERE email = ${userEmail}`;
        return isUser.rows.length === 0;
    } catch (err) {
        console.error("Database error:", err);
        throw new Error("Failed to check user");
    }
}

export async function userLogin(userEmail: string) {
    const isUser = await userExists(userEmail);
    console.log(isUser);
    if (!isUser) {
        try {
            const newslug = userEmail.split("@")[0];
            const newUser =
                await sql`INSERT INTO users (name, email, slug) VALUES (${userEmail}, ${userEmail}, ${newslug})`;
            return newUser.rows;
        } catch (err) {
            console.error("Database Error:", err);
            throw new Error("Failed to create user");
        }
    }
}
