import NavBar from "@/components/NavBar";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./global.css";

export const metadata: Metadata = {
  title: "TradeIt",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
		 <head>
                <link rel="icon" href="Bee.png" />
            </head>
<<<<<<< HEAD
      <body className="antialiased bg-[url('/paper.jpg')] bg-contain text-trade-gray min-h-screen">
=======
      <body className="antialiased bg-[url('@/public/paper.jpg')] bg-contain text-trade-gray min-h-screen">
>>>>>>> c15ab73 (updated and finished the main pages. Added some functionality)
        <SessionProvider>
          <NavBar />
          <div>
            <main className="flex-1">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
