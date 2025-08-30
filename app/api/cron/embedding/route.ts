import { randomInt } from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    if (userAgent !== 'vercel-cron/1.0') {
        return NextResponse.json({ 'error': 'access denied' }, { 'status': 403 });
    }
    try {
        const response = await fetch("https://sentence-transformer-api-vke1.onrender.com/");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return NextResponse.json(json);
    } catch (err) {
        console.error(err);
        throw new Error(`request error`);
    }

}