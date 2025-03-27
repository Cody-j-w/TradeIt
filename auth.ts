import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    brandColor: "#1F6A3E",
    logo: "@/assets/Bee.png",
    buttonText: "#FC9E40",
  },
  providers: [Auth0],
  callbacks: {
    authorized: async ({ auth }) => {

      return !!auth;
    },
  },
});
