import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Auth0 from "next-auth/providers/auth0";

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    brandColor: "#1F6A3E",
    logo: "/logo.png",
    buttonText: "#FC9E40",
  },
  providers: [Auth0],
  // callbacks: {
  //   authorized: async ({ auth }) => {
  //     // Logged in users are authenticated, otherwise redirect to login page
  //     return !!auth;
  //   },
  //},
});
