// app/layout.tsx
import { Metadata } from "next";
import "./global.css";
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
      <body className="antialiased bg-trade-gray bg-contain text-trade-orange h-screen">
        <div>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}