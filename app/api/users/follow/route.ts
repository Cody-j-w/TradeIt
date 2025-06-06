import { auth0 } from "@/lib/auth0";
import { addFollow, fetchFollows } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const auth = await auth0.getSession()
    if (!auth || !auth?.user) {
        return NextResponse.json({ "error": "Missing authentication" })
    }
    const url = new URL(req.url);
    const params = url.searchParams;
    const follower = params.get("follower");
    const followed = params.get("followed");
    try {
        await addFollow(followed!!, follower!!);
        return NextResponse.json({ "message": "new user followed!" });
    } catch (err) {
        console.error("Error: " + err);
        return NextResponse.json({ "message": "there was an error processing your request" });
    }
}

export async function GET(req: NextRequest) {
    const follows = await fetchFollows();
    return NextResponse.json(follows);
}