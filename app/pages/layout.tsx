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
      <div className="antialiased bg-[url('/paper.jpg')] bg-contain text-trade-gray min-h-screen">
        <NavBar />
        <div>
          <div className="flex-1">{children}</div>
          <TradeWrapper />
        </div>
      </div>
  );
}