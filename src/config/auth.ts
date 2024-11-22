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
          const lastLoginAt = new Date();
          await usersCollection.updateOne(
            { _id: new ObjectId(existingUser._id) },
            { $set: { lastLoginAt } }
          );

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

/* 
sen bir senior oyun geliştiricisin. asagida bahsettigim kriterler cercevesinde bir oyun tasarlamani istiyorum.
oyunun amacı kullanicilarin oynarken turkceden hollandacaya ceviri becerilerini geliştirmeleri. 
database'de 5600 kusur tane ornek cümle var, bu cumlelerin hem turkceleri, hem hollandacalari mevcut, 
ayni zamanda bu cümleler hollandaca dil seviyelerine(A1,A2,B1,B2) gore etiketlenmiş ayrica ayni dil sevilerinin icinde de 1 den 15 e kadar thema lara ayrilmis, 
temalar ilerledikce cumleler zorlasmaktadir. senden bu cumleleri oyunda kullanmani istiyorum. 
oyun adam asmaca oyunu tarzinda olmali(daha iyi bir onerin varsa soyleyebilirsin). 
oyunculardan turkcesini verdigimiz cumleleri hollandacaya cevirmelerini isteyecez. 
oyunun tasarimi konusunda detayli bir analiz hazirlamani istiyorum. Hangi yontemler kullanilmali, 
oyuncuya bir seferde kac soru sorulmalı, sure kisitlamasi olmali mi, puanlama nasil yapılmalı, 
oyuncunun dogru ve yanlis cevapladigi sorulara gore sonraki sorulari secerken nasil bir yontem kullanilmali. 
bu arada oyun nextjs kullanilarak web icin geliştirilecektir, hedef telefon uzerinden oynanmasıdır, 
ama masaüstüne de uyumlu olmalıdır. coz zor gorsel efektler olmamalıdır, modern ve sade gorunmelidir.




You are a senior game developer. I want you to design a language-learning game to help users improve their translation skills from Turkish to Dutch. Below are the requirements and considerations for the game:
1. Database:
   * Contains over 5,600 example sentences with Turkish and Dutch versions.
   * Sentences are tagged by Dutch proficiency levels (A1, A2, B1, B2) and organized into 15 themes per level, increasing in difficulty as the themes progress.
2. Game Concept:
   * The game should resemble a hangman-style format, where players translate Turkish sentences into Dutch. (Feel free to suggest better alternatives if you have ideas.)
   * The game must adapt to the player’s proficiency level and performance as they play.
3. Design Analysis: Prepare a detailed plan covering the following:
   * Gameplay Mechanics:
      * How to make the game engaging.
      * How many questions should players answer in a single session.
   * Time Constraints:
      * Should there be a time limit for answers? Why or why not?
   * Scoring System:
      * How to motivate players and track progress effectively.
   * Adaptive Question Selection:
      * How should the difficulty of subsequent questions adjust based on player performance (correct/incorrect answers)?
4. Technical Requirements:
   * The game will be developed as a web application using Next.js.
   * It should prioritize mobile usability but also work seamlessly on desktops.
   * The design must be modern, minimalist, and free from complex visual effects to ensure clarity and smooth performance.
Provide a detailed approach to how you would design and implement this game.



Game Design Philosophy


* Instead of a hangman-style game, I've designed a more direct translation challenge that focuses on active recall
* The interface is clean and distraction-free to keep users focused on learning
* Mobile-first design with large touch targets and readable text


Gameplay Mechanics


* Session Length: 5-7 minutes (optimal for maintaining focus)
* Questions per session: 10-12 questions (allowing ~30 seconds per question)
* Progressive difficulty within themes
* Streak system to encourage consistent performance


Time Management


* 60-second timer per session rather than per question

Rationale:

* Creates urgency without excessive pressure
* Allows players to spend more time on challenging questions
* Prevents frustration on difficult translations




Scoring System


* Base points: 10 points per correct answer
* Streak multiplier: Points × (streak + 1)
* Progress bar shows completion towards session goal
* Persistent high scores to track improvement


Adaptive Difficulty Algorithm


* Initial placement test determines starting level
* Difficulty adjusts based on:

* Current streak (3+ correct answers triggers level up)
* Success rate in current theme
* Time taken to answer


Smooth difficulty progression to maintain engagement


Technical Implementation Details


React/Next.js stack with:

Server components for initial render
Client components for game interaction
Local storage for progress persistence

Learning Enhancement Features


Immediate feedback on answers
Correct answer shown after mistakes
Progress tracking across themes
Spaced repetition for previously incorrect answers

Would you like me to elaborate on any of these aspects or 
show you how to implement additional features like the spaced 
repetition system or the theme progression logic?
*/
