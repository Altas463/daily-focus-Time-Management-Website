import NextAuth, { Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma"; // Import Prisma client

// Mở rộng interface để truy cập ảnh Google
interface ExtendedProfile extends Profile {
  picture?: string;
}

const handler = NextAuth({
  providers: [
    // Đăng nhập bằng Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Đăng nhập bằng email/password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Gửi yêu cầu xác thực đến backend custom của bạn
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) return null;

        const user = await res.json();

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: null, // Thêm nếu backend trả về avatar
          };
        }

        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // JWT callback: dùng để xử lý token, thêm logic lưu user nếu đăng nhập bằng Google
    async jwt({ token, account, profile }) {
      if (account && profile) {
        if (account.provider === "google") {
          const extendedProfile = profile as ExtendedProfile;

          // Gán thông tin user từ Google vào token
          token.email = extendedProfile.email;
          token.name = extendedProfile.name;
          token.picture = extendedProfile.picture;

          // Kiểm tra và tạo user nếu chưa tồn tại
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
        }

        if (account.provider === "credentials") {
          token.email = profile?.email || "";
          token.name = profile?.name || "";
        }
      }

      return token;
    },

    // Gán thông tin token vào session để client sử dụng
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
