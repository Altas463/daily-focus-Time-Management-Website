import NextAuth, { Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Mở rộng kiểu Profile để thêm field `picture`
interface ExtendedProfile extends Profile {
  picture?: string;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const extendedProfile = profile as ExtendedProfile;
        token.email = extendedProfile.email;
        token.name = extendedProfile.name;
        token.picture = extendedProfile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: token.name as string,
        email: token.email as string,
        image: token.picture as string,
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
