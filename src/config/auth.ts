import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

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
          isEmailVerified: true,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          provider: "google",
        };
      },
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "e-mail" },
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

        const lastLoginAt = new Date();
        await usersCollection.updateOne(
          { _id: new ObjectId(user._id) },
          { $set: { lastLoginAt } }
        );

        return {
          id: user._id.toString(),
          image: user.image,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          isEmailVerified: user.emailVerified,
          createdAt: user.createdAt,
          lastLoginAt: lastLoginAt,
          provider: "google",
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
      }
      if (new URL(url).origin === baseUrl) {
        // Allow redirects to same origin
        return url;
      }
      // Default to base URL
      return baseUrl;
    },
  },
  events: {
    async signIn(message) {
      console.log("Sign in successful", message);
    },
    async signOut(message) {
      console.log("Sign out successful", message);
    },
    async createUser(message) {
      console.log("User created", message);
    },
  },
  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/signOut",
    error: "/auth/error",
    verifyRequest: "/auth/verifyRequest",
    newUser: "/auth/newUser",
  },
  debug: process.env.NODE_ENV === "development", // Enable debug logs
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", code, metadata);
    },
  },
};
