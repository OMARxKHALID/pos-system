import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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
        // Hardcoded admin credentials (replace with DB lookup in production)
        if (
          credentials.email === "admin@example.com" &&
          credentials.password === "admin123"
        ) {
          return { id: 1, name: "Admin", email: "admin@example.com" };
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
});

export { handler as GET, handler as POST };
