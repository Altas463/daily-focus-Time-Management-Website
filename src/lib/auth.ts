import { NextAuthOptions, Profile, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Account } from "next-auth";
import prisma from "@/lib/prisma";

interface ExtendedProfile extends Profile {
  picture?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) return null;
        const user = await res.json();

        if (user) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                provider: "credentials",
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: null,
          };
        }

        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, profile }: {
      token: JWT;
      account: Account | null;
      profile?: Profile;
    }) {
      if (account && profile) {
        if (account.provider === "google") {
          const extendedProfile = profile as ExtendedProfile;

          token.email = extendedProfile.email;
          token.name = extendedProfile.name;
          token.picture = extendedProfile.picture;

          const existingUser = await prisma.user.findUnique({
            where: { email: extendedProfile.email || "" },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: extendedProfile.email || "",
                name: extendedProfile.name || "",
                image: extendedProfile.picture || "",
                provider: "google",
              },
            });
          }
        } else if (account.provider === "credentials") {
          token.email = profile?.email || "";
          token.name = profile?.name || "";
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        name: token.name as string,
        email: token.email as string,
        image: token.picture as string,
      };
      return session;
    },
  },
};
