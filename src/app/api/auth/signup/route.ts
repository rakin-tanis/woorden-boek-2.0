import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise, { insertNewPlayer } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    const client = await clientPromise;
    const usersCollection = client.db("woorden-boek").collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      roles: ["USER"],
      createdAt: new Date(),
      status: "ACTIVE",
      emailVerified: false,
      provider: "credentials",
    });

    await insertNewPlayer(result.insertedId.toString(), name);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
