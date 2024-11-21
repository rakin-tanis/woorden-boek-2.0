import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify user is authenticated
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const usersCollection = client.db("woorden-boek").collection("users");

    // Find the user
    const user = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user's game level if exists
    return res.status(200).json({
      level: user.gameLevel || null,
    });
  } catch (error) {
    console.error("Error checking user level:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
