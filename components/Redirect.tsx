"use client";
import { userLogin } from "@/lib/data";
import { getSession } from "@/lib/functions";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Redirect({ url }: { url: string }) {
    const [auth, setAuth] = useState(false);
    useEffect(() => {
        const session = async () => {
            const session = await getSession();
            if (session && session.user.email) {
                userLogin(session?.user.email);
                setAuth(true);
            }
        }
        session();
        if (auth === true) {
            redirect(url);
        } else {
            redirect("/");
        }
    }, []);
    return (
        <div className="redirecting">
            Redirecting...
        </div>
    )
}