import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db-connect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password)) &&
          user.active === true
        ) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions || [],
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.permissions = user.permissions || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role;
      if (token?.id) session.user.id = token.id;
      if (token?.permissions) session.user.permissions = token.permissions;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
