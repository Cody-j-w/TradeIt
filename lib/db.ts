import { Generated } from 'kysely';
import { createKysely } from "@vercel/postgres-kysely";

export interface Database {
    users: UsersTable;
    goods: GoodsTable;
    locations: LocationsTable;
    trades: TradesTable;
    chats: ChatsTable
    messages: MessagesTable;
    posts: PostsTable;
    tags: TagsTable;
    posttags: PostTagsTable;
    postlikes: PostLikesTable;
}

export interface UsersTable {
    id: Generated<string>;
    name: string;
    email: string;
    password: string;
    zip: number;
    created: Date;
}

export interface GoodsTable {
    id: Generated<string>;
    name: string;
}

export interface LocationsTable {
    id: string;
    address: string;
    totalTrades: number;
}

export interface TradesTable {
    id: Generated<string>;
    user_id1: Generated<string>;
    user_id2: Generated<string>;
    goods_id1: Generated<string>;
    goods_id2: Generated<string>;
    location_id: Generated<string>;
    timestamp: Date;
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

export interface PostsTable {
    id: Generated<string>;
    user_id: Generated<string>;
    text: string;
    timestamp: Date;
}
export interface PostLikesTable {
    id: Generated<string>;
    user_id: Generated<string>;
    post_id: Generated<string>;
}

export interface TagsTable {
    id: Generated<string>;
    name: string;
}

export interface PostTagsTable {
    id: Generated<string>;
    post_id: Generated<string>;
    tag_id: Generated<string>;
}

export const db = createKysely<Database>();