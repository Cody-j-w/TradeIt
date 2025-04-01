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
        return isUser.rows.length !== 0;
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

export async function getUser(userEmail: string) {
    const isUser = await userExists(userEmail);
    if (isUser) {
        const fetchedUser = await db
            .selectFrom("users")
            .select(['name', 'image', 'slug'])
            .where('email', '=', userEmail)
            .execute();
        return fetchedUser[0];
    }
}

export async function fetchGood(goodName: string) {
    const fetchedGood = await db
        .selectFrom("goods")
        .select(['id', 'name'])
        .where('name', '=', goodName)
        .execute();
    return fetchedGood;
}

export async function fetchGoods() {
    const fetchedGoods = await db
        .selectFrom("goods")
        .select(['id', 'name'])
        .execute();
    return fetchedGoods;
}

export async function insertGood(goodName: string) {
    const checkedGood = await fetchGood(goodName);
    if (checkedGood.length === 0) {
        const insertedGood = await db
            .insertInto('goods')
            .values({
                name: goodName
            })
            .returning(['id', 'name'])
            .executeTakeFirst();
        return insertedGood;
    } else {
        return checkedGood[0];
    }
}

export async function fetchLocation(locationAddress: string) {
    const fetchedLocation = await db
        .selectFrom('locations')
        .select(['id', 'address', 'latitude', 'longitude'])
        .where('address', '=', locationAddress)
        .execute();
    return fetchedLocation[0];
}

export async function fetchLocations() {
    const fetchedLocations = await db
        .selectFrom('locations')
        .select(['id', 'address', 'latitude', 'longitude'])
        .execute();
    return fetchedLocations;
}

export async function insertLocation(address: string) {
    // geolocation stuff to get coordinates
    // then put address and coordinates into DB
}

export async function fetchPosts() {

}