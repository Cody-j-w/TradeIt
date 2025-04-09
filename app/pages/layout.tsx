// app/pages/layout
import NavBar from "@/components/NavBar";
import { Metadata } from "next";
import TradeWrapper from "@/components/TradeWrapper";
import React from "react";

export const metadata: Metadata = {
  title: "TradeIt",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://djyrtfx2a7bufblj.public.blob.vercel-storage.com/images/Bee-8kFjNVeR0sgDbfMSH9Pq6kMtAh82Di.png" />
      </head>
      <body className="antialiased bg-[url('/paper.jpg')] bg-contain text-trade-gray min-h-screen">
        <NavBar />
        <div>
          <main className="flex-1">{children}</main>
          <TradeWrapper />
        </div>
      </body>
    </html>
  );
}