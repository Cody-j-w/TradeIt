import { auth } from "@/auth";
import { fetchGood, fetchGoods, insertGood } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const params = url.searchParams;
    const goodName = params.get('good');

    if (goodName !== null) {
        await insertGood(goodName)
    }
    return NextResponse.json({ 'message': 'new good successfully added!' })

}