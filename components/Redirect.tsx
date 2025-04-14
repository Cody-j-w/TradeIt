"use client";
import { userLogin } from "@/lib/data";
import { getSession, login } from "@/lib/functions";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Redirect({ url }: { url: string }) {
    useEffect(() => {
        const session = async () => {
            const session = await getSession();
            console.log(session !== null);
            console.log(session?.user.email !== null)
            if (session !== null && session.user.email !== null) {
                await login(session?.user.email!!, session.user.picture!!);
                redirect(url);
            } else {
                redirect("/");
            }
        }
        session();
    }, []);
    return (
        <div className="redirecting">
            Redirecting...
        </div>
    )
}