"use client";
import { userLogin } from "@/lib/data";
import { getSession } from "@/lib/functions";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Redirect({ url }: { url: string }) {
    useEffect(() => {
        const session = async () => {
            const session = await getSession();
            if (session && session.user.email) {
                userLogin(session?.user.email);
            }
        }
        session();
        redirect(url);
    }, []);
    return (
        <div className="redirecting">
            Redirecting...
        </div>
    )
}