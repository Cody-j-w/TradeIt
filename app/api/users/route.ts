import { auth } from "@/auth";
import { getUser } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export const GET = auth(async (req: NextRequest) => {
    // authentication check

    const params = req.nextUrl.searchParams;
    const email = params.get("email");
    if (email) {
        const user = await getUser(email);
        return NextResponse.json({
            name: user?.name,
            image: user?.image,
            slug: user?.slug
        });
    }

})