// app/layout.tsx

import NavBar from "@/components/NavBar";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./global.css";
import TradeWrapper from "@/components/TradeWrapper";
import React from "react";

export const metadata: Metadata = {
  title: "TradeIt",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="Bee.png" />
      </head>
      <body className="antialiased bg-[url('/paper.jpg')] bg-contain text-trade-gray min-h-screen">
        <SessionProvider>
          <NavBar />
          <div>
            <main className="flex-1">{children}</main>
            <TradeWrapper />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}