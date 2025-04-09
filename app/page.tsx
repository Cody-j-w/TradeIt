import { auth0 } from "@/lib/auth0";
import Image from "next/image";
import logo from "@/public/Bee-Text.png";
import Redirect from "@/components/Redirect";

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, show sign-up and login buttons
  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="mb-8">
          <Image src={logo} alt="Your Logo" width={390} height={200} />
        </div>
        <div className="flex gap-4">
          <a href="/auth/login?screen_hint=signup" className="no-underline">
            <button className="bg-trade-white text-trade-gray  font-semibold py-2 px-4 rounded shadow-md">
              Sign up
            </button>
          </a>
          <a href="/auth/login" className="no-underline">
            <button className="bg-trade-green text-trade-white shadow-md font-bold py-2 px-4 rounded">
              Log in
            </button>
          </a>
        </div>
      </main>
    );
  }

  // If session exists, show a welcome message and logout button
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-8 text-center">
      <Redirect url="/pages/home" />
    </main>
  );
}