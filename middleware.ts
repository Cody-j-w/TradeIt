//export { auth as middleware } from "@/auth";
import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
    return await auth0.middleware(request);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|logo.png|about|$).*)",
    ],
};