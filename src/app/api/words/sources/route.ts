import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Adjust the import path as needed

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("woorden-boek");
    const collection = db.collection("examples");

    // Fetch sources based on optional query parameters
    const { searchParams } = new URL(request.url);

    // Optional filtering parameters
    const levels = searchParams.getAll("level");
    const themes = searchParams.getAll("theme");

    // Build query for sources
    const query: Record<string, unknown> = {};

    // Add filters if provided
    if (levels.length > 0) query.level = { $in: levels };
    if (themes.length > 0) query.theme = { $in: themes };
    query.status = "published";

    // Get distinct sources based on optional filters
    const sources = await collection.distinct("source", query);

    return NextResponse.json({
      sources: sources.map((source) => ({
        value: source,
        label: source.charAt(0).toUpperCase() + source.slice(1),
      })),
    });
  } catch (error) {
    console.error("Sources fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    );
  }
}
