import { auth0 } from '@/lib/auth0';
import { fetchPosts, getSelf, insertPost } from '@/lib/data';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const auth = await auth0.getSession()
    if (!auth || !auth?.user) {
        return NextResponse.json({ "error": "Missing authentication" })
    }
    const me = await getSelf()
    const url = new URL(req.url);
    const params = url.searchParams;
    const user = me.id;
    const text = params.get('text');
    const good = params.get('good');
    const type = params.get('type');
    const image = params.get('image');

    if (user !== null && text !== null && good !== null && type !== null && (image === undefined || image === null)) {
        await insertPost(user, text, good, type);
        return NextResponse.json({ "message": "post successfully added!" });
    } else if (user !== null && text !== null && good !== null && type !== null && (image !== null && image !== undefined)) {
        await insertPost(user, text, good, type, image);
        return NextResponse.json({ "message": "post successfully added!" })
    } else {
        console.log("parameter missing");
        console.log("parameters:")
        console.log("user: " + user);
        console.log("text: " + text);
        console.log("good: " + good);
        console.log("image: " + image);
        return NextResponse.json({ "message": "failed to add post" })
    }
}

export async function GET(req: NextRequest) {
    const posts = await fetchPosts('1');
    return NextResponse.json(posts);
}