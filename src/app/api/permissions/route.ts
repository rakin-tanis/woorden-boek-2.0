import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const PERMISSIONS_COLLECTION = "permissions"; // Define your MongoDB collection name

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("woorden-boek");
    const collection = db.collection(PERMISSIONS_COLLECTION);

    // Fetch all roles from the collection
    const permissions = await collection.find({}).toArray();

    return NextResponse.json(permissions);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}
