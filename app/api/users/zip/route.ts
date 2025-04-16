import { auth0 } from "@/lib/auth0";
import { updateZipById } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const auth = await auth0.getSession()
    if (!auth || !auth?.user) {
        return NextResponse.json({ "error": "Missing authentication" })
    }
    const url = new URL(req.url);
    const params = url.searchParams;
    const zip = params.get("zip");
    const user = params.get("user");
    try {
        await updateZipById(zip!!, user!!);
        return NextResponse.json({ "message": "new user followed!" });
    } catch (err) {
        console.error("Error: " + err);
        return NextResponse.json({ "message": "there was an error processing your request" });
    }
}