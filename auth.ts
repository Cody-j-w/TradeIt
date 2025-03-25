import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    brandColor: "#1ED2AF",
    logo: "/logo.png",
    buttonText: "#ffffff",
  },
  providers: [],
  callbacks: {
    authorized: async ({ auth }) => {

      return !!auth;
    },
  },
});
