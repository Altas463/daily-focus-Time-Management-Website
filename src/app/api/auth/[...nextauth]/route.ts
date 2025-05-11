import NextAuth, { Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Interface mở rộng để xử lý thông tin profile Google
interface ExtendedProfile extends Profile {
  picture?: string;
}

const handler = NextAuth({
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email và Password - Credentials
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Gửi yêu cầu tới backend để kiểm tra tài khoản và mật khẩu
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) return null;

        const user = await res.json();
        if (user) {
          // Trả về thông tin người dùng khi xác thực thành công
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: null, // Nếu có ảnh người dùng từ backend, gán vào đây
          };
        }

        return null; // Trả về null nếu xác thực không thành công
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Callback để lưu thông tin vào token khi sử dụng Google hoặc Credentials
    async jwt({ token, account, profile }) {
      if (account && profile) {
        if (account.provider === "google") {
          // Google OAuth callback
          const extendedProfile = profile as ExtendedProfile;
          token.email = extendedProfile.email;
          token.name = extendedProfile.name;
          token.picture = extendedProfile.picture;
        } else if (account.provider === "credentials") {
          // Credentials callback
          token.email = profile?.email || "";
          token.name = profile?.name || "";
        }
      }
      return token;
    },

    // Callback để lưu session với thông tin người dùng
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
