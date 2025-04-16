//  lib/data
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

export async function fetchUsersByIds(userIds: string[]): Promise<{ [key: string]: { id: string; name: string; image: string; slug: string } }> {
    try {
        const users = await db
            .selectFrom("users")
            .select(['id', 'name', 'image', 'slug'])
            .where("id", "in", userIds)
            .execute();

        const usersById: { [key: string]: { id: string; name: string; image: string; slug: string } } = {};
        users.forEach(user => {
            usersById[user.id] = {
                id: user.id,
                name: user.name,
                image: user.image,
                slug: user.slug,
            };
        });
        return usersById;
    } catch (error) {
        console.error("Error fetching users by IDs:", error);
        return {};
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
    if (goodName.length > 0) {
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
    } else {
        return null;
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

export async function fetchPosts(page: string) {
    const pageNum = parseInt(page);
    const posts = await db
        .selectFrom("posts")
        .innerJoin("users", "users.id", "posts.user_id")
        .innerJoin("goods", "goods.id", "posts.good_id")
        .select(['posts.id', 'users.id as user_id', 'users.name', 'goods.name', 'users.image', 'posts.text', 'posts.image', 'posts.type', 'posts.timestamp'])
        .execute();
    console.log("Raw posts from database in fetchPosts:", posts);
    return posts;
}

export async function insertPost(user: string, postText: string, goodName: string, type: string, image: string | null = null) {

    console.log("user: " + user);
    console.log("post text: " + postText);
    console.log("good name: " + goodName);
    console.log("type: " + type);
    const newTags = await fetchTagsFromPost(postText);
    let tagInsert = null;
    if (newTags.length > 0) {
        console.log(newTags);
        tagInsert = await insertTags(newTags);

    }
    const postGood = await insertGood(goodName);

    const newPost = postGood !== null ? await createPost(postText, user, postGood?.id!!, type, image) : await createBlog(postText, user, image);

    const relations = [];
    if (tagInsert !== null) {
        for (const tag of tagInsert) {
            if (newPost) {
                relations.push({ 'post_id': newPost.id, 'tag_id': tag.id });
            }
        }
        const newPostTags = await db
            .insertInto('posts_tags')
            .values(relations)
            .returning(['post_id', 'tag_id'])
            .execute()
    }


    return newPost;
}

export async function createPost(text: string, user_id: string, good_id: string, type: string, image: string | null = null) {
    try {
        const newPost = await db
            .insertInto('posts')
            .values({
                text: text,
                user_id: user_id,
                good_id: good_id,
                type: type,
                image: image
            })
            .returning(['id'])
            .executeTakeFirst();
        console.log(newPost);
        return newPost;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function createBlog(text: string, user_id: string, image: string | null = null) {
    try {
        const newPost = await db
            .insertInto('posts')
            .values({
                text: text,
                user_id: user_id,
                type: 'blog',
                image: image
            })
            .returning(['id'])
            .executeTakeFirst();
        return newPost;
    } catch (err) {
        console.error(err);
        return null;
    }
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
    for (const tag of tags) {
        console.log(tag.name);
    }
    const tagInsert = await db
        .insertInto("tags")
        .values(tags)
        .returning(['id', 'name'])
        .execute();
    return tagInsert;
}

export async function insertLike(post_id: string) {
    const me = await getSelf();
    const newLike = await db
        .insertInto("posts_likes")
        .values({
            user_id: me.id,
            post_id: post_id
        })
        .returning(['user_id', 'post_id'])
        .executeTakeFirst()
    return newLike;
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
        .innerJoin("users", "users.id", "posts.user_id")
        .innerJoin("goods", "goods.id", "posts.good_id")
        .select(["text", "timestamp", "posts.image as image", "goods.name as good", "users.name as username", "users.image as avatar"])
        .where("users.id", "in", fids)
        .execute()
    return followedPosts;
}

export async function addFollow(userId: string, followerId: string) {
    const fid = followerId;
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

export async function updateZip(zip: string) {
    const me = await getSelf();
    const updatedZIP = await db
        .updateTable("users")
        .set({
            zip: zip
        })
        .where('id', '=', me.id)
        .executeTakeFirst();
    return updatedZIP;
}

export async function updateZipById(zip: string, userId: string) {
    const updatedZIP = await db
        .updateTable("users")
        .set({
            zip: zip
        })
        .where('id', '=', userId)
        .executeTakeFirst();
    return updatedZIP;
}