"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Redirect({ url }: { url: string }) {
    useEffect(() => {
        redirect(url);
    });
    return (
        <div className="redirecting">
            Redirecting...
        </div>
    )
}