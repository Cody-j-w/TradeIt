import { sql } from "@vercel/postgres";
import { db } from "./db";
import { Tag } from "./definitions";
import { auth0 } from "./auth0";

// export async function userInformation() {

//     const session = await auth();
//     if (session) {
//         console.log(session?.user?.id);
//         console.log(session?.user?.email);
//         return session;
//     } else {
//         console.log("please sign in");
//     }

// }

export async function getSelf() {
    const session = await auth0.getSession();
    const self = await db
        .selectFrom("users")
        .select(["id", "name", "image", "slug"])
        .where("email", "=", session?.user.email!!)
        .execute()
    return self[0];
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

export async function userLogin(userEmail: string, userPicture: string) {
    const isUser = await userExists(userEmail);
    console.log(isUser);
    if (!isUser) {
        try {
            const newslug = userEmail.split("@")[0];
            const newUser =
                await sql`INSERT INTO users (name, email, slug, image) VALUES (${userEmail}, ${userEmail}, ${newslug}, ${userPicture})`;
            return newUser.rows;
        } catch (err) {
            console.error("Database Error:", err);
            throw new Error("Failed to create user");
        }
    }
}

export async function getSingleUser(userEmail: string) {
    const isUser = await userExists(userEmail);
    if (isUser) {
        const fetchedUser = await db
            .selectFrom("users")
            .select(['id', 'name', 'image', 'slug'])
            .where('email', '=', userEmail)
            .execute();
        return fetchedUser[0];
    }
}

export async function getUsers() {
    const users = await db
        .selectFrom("users")
        .select(['id', 'name', 'image', 'slug'])
        .execute();
    return users;
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

export async function createTrader(userId: string, goodId: string) {
    const newTrader = await db
        .insertInto("traders")
        .values({
            user: userId,
            good: goodId,
            timestamp: new Date()
        })
        .returning(['id', 'user', 'good'])
        .execute();
    return newTrader;
}

export async function createTrade(traderOne: string, traderTwo: string, location: string) {
    const newTrade = await db
        .insertInto("trades")
        .values({
            trader_a: traderOne,
            trader_b: traderTwo,
            location_id: location,
            timestamp: new Date()
        })
        .returning(['trader_a', 'trader_b', 'location_id', 'timestamp'])
        .execute();
    return newTrade;
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
    // ??? WHERE DO?
}

export async function insertPost(user: string, postText: string, goodName: string, image: string | undefined = undefined) {

    const newTags = await fetchTagsFromPost(postText);

    const tagInsert = await insertTags(newTags);

    const postGood = await insertGood(goodName);

    const newPost = await createPost(postText, user, postGood?.id!!, image);

    const relations = [];
    for (const tag of tagInsert) {
        relations.push({ 'post_id': newPost[0].id, 'tag_id': tag.id });
    }
    const newPostTags = await db
        .insertInto('posts_tags')
        .values(relations)
        .returning(['post_id', 'tag_id'])
        .execute()
}

export async function createPost(text: string, user_id: string, good_id: string, image: string | undefined = undefined) {
    const newPost = await db
        .insertInto('posts')
        .values({
            text: text,
            user_id: user_id,
            good_id: good_id,
            image: image
        })
        .returning(['id'])
        .execute();
    return newPost;
}

export async function fetchTagsFromPost(postText: string) {
    const tags = await db
        .selectFrom('tags')
        .select('name')
        .execute();
    const newTags = [];
    const tagNames = tags.map(tag => tag.name);
    const postTags = postText.split("#").slice(1);
    for (const tag of postTags) {
        const sanitizedTag = tag.split(" ")[0];
        if (!tagNames.includes(sanitizedTag)) {
            newTags.push({ 'name': sanitizedTag });
        }
    }

    return newTags;
}

export async function insertTags(tags: Tag[]) {
    const tagInsert = await db
        .insertInto('tags')
        .values(tags)
        .returning(['id', 'name'])
        .execute();
    return tagInsert;
}

export async function fetchFollows() {
    const follower = await getSelf();
    const fid = follower.id;
    const followedUsers = await db
        .selectFrom("users")
        .innerJoin("followings as f", "f.user_id", "users.id")
        .select(["users.id", "bio", "name", "image"])
        .where("f.follower_id", "=", fid)
        .execute()
    return followedUsers;
}

export async function fetchFollowedPosts() {
    const followedUsers = await fetchFollows();
    const fids = [];
    for (const user of followedUsers) {
        fids.push(user.id);
    }
    const followedPosts = await db
        .selectFrom("posts")
        .innerJoin("goods", "goods.id", "posts.good_id")
        .select(["text", "timestamp", "image", "goods.name"])
        .where("posts.id", "in", fids)
        .execute()
    return followedPosts;
}

export async function addFollow(userId: string,) {
    const follower = await getSelf();
    const fid = follower.id;
    const newFollow = await db
        .insertInto("followings")
        .values({
            user_id: userId,
            follower_id: fid,
            timestamp: new Date()
        })
        .executeTakeFirst();
    return newFollow;
}

export async function fetchFollowers() {
    const me = await getSelf();
    const followers = await db
        .selectFrom("users")
        .innerJoin("followings", "follower_id", "users.id")
        .select(["users.id", "users.name", "users.image"])
        .where("followings.user_id", "=", me.id)
        .execute();
    return followers;
}

export async function updateUsername(name: string) {
    const me = await getSelf();
    const newUsername = await db
        .updateTable("users")
        .set({
            name: name
        })
        .where('id', '=', me.id)
        .executeTakeFirst();
    return newUsername;
}

export async function updateAvatar(image: string) {
    const me = await getSelf();
    const newAvatar = await db
        .updateTable("users")
        .set({
            image: image
        })
        .where('id', '=', me.id)
        .executeTakeFirst();
    return newAvatar;
}

export async function updateBio(bio: string) {
    const me = await getSelf();
    const newBio = await db
        .updateTable("users")
        .set({
            bio: bio
        })
        .where('id', '=', me.id)
        .executeTakeFirst();
    return newBio;
}