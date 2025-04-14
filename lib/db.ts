import { Generated } from 'kysely';
import { createKysely } from "@vercel/postgres-kysely";

export interface Database {
    users: UsersTable;
    goods: GoodsTable;
    locations: LocationsTable;
    traders: TradersTable;
    trades: TradesTable;
    ratings: RatingsTable;
    chats: ChatsTable
    messages: MessagesTable;
    followings: FollowingsTable;
    posts: PostsTable;
    tags: TagsTable;
    users_tags: UsersTagsTable;
    posts_tags: PostTagsTable;
    posts_likes: PostLikesTable;
}

export interface UsersTable {
    id: Generated<string>;
    name: string;
    email: string;
    zip: string;
    image: string;
    slug: string;
    bio: string;
    created: Date;
}

export interface GoodsTable {
    id: Generated<string>;
    name: string;
}

export interface LocationsTable {
    id: Generated<string>;
    address: string;
    latitude: number;
    longitude: number;
    totalTrades: number;
}

export interface TradersTable {
    id: Generated<string>;
    user: string;
    good: string;
    timestamp: Date;
}

export interface TradesTable {
    id: Generated<string>;
    trader_a: Generated<string>;
    trader_b: Generated<string>;
    location_id: Generated<string>;
    timestamp: Date;
}

export interface RatingsTable {
    id: Generated<string>;
    trader_id: Generated<string>;
    trade_id: Generated<string>;
    rating: number;
}

export interface ChatsTable {
    id: Generated<string>;
    user_id1: Generated<string>;
    user_id2: Generated<string>;
}

export interface MessagesTable {
    id: Generated<string>;
    text: string;
    user_id: Generated<string>;
    chat_id: Generated<string>;
    timestamp: Date;
}

export interface FollowingsTable {
    id: Generated<string>;
    user_id: Generated<string>;
    follower_id: Generated<string>;
    timestamp: Date;
}

export interface PostsTable {
    id: Generated<string>;
    user_id: Generated<string>;
    good_id: Generated<string>;
    text: string;
    image: string | undefined;
    timestamp: Generated<Date>;
}
export interface PostLikesTable {
    user_id: Generated<string>;
    post_id: Generated<string>;
}

export interface TagsTable {
    id: Generated<string>;
    name: string;
}

export interface UsersTagsTable {
    user_id: Generated<string>;
    tag_id: Generated<string>;
}

export interface PostTagsTable {
    post_id: Generated<string>;
    tag_id: Generated<string>;
}

export const db = createKysely<Database>();