import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: "woorden-boek" }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          image: profile.picture,
          email: profile.email,
          name: profile.name,
          role: "user", // Default role for Google sign-ins
          status: "ACTIVE",
          isEmailVerified: false,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const client = await clientPromise;
        const usersCollection = client.db("woorden-boek").collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        if (user.status !== "ACTIVE") {
          throw new Error("Account is not active");
        }

        return {
          id: user._id.toString(),
          image: user.image,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const client = await clientPromise;
        const usersCollection = client.db("woorden-boek").collection("users");

        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        if (!existingUser) {
          await usersCollection.insertOne({
            email: user.email,
            role: "user",
            provider: "google",
            createdAt: new Date(),
            name: user.name,
            image: user.image,
            status: "ACTIVE",
            isEmailVerified: true,
          });
          user.role = "user";
          user.status = "ACTIVE";
          user.isEmailVerified = true;
        } else {
          user.role = existingUser.role;
          user.status = existingUser.status;
          user.isEmailVerified = existingUser.isEmailVerified;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.status = user.status;
        token.isEmailVerified = user.isEmailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.status = token.status as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirect URLs
      if (url.startsWith("/")) {
        // For relative URLs, prefix with base URL
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        // Allow redirects to same origin
        return url;
      }
      // Default to base URL
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signIn",
    // signUp: '/auth/signup',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
