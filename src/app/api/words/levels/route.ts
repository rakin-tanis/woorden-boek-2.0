import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("woorden-boek");
    const collection = db.collection("examples");

    // Fetch levels based on optional query parameters
    const { searchParams } = new URL(request.url);

    // Optional filtering parameters
    const sources = searchParams.getAll("source");
    const themes = searchParams.getAll("theme");

    // Build query for levels
    const query: Record<string, unknown> = {};

    // Add filters if provided
    if (sources.length > 0) query.source = { $in: sources };
    if (themes.length > 0) query.theme = { $in: themes };
    query.status = "published"

    // Get distinct levels based on optional filters
    const levels = await collection.distinct("level", query);

    return NextResponse.json({
      levels: levels.map((level) => ({
        value: level,
        label: level.charAt(0).toUpperCase() + level.slice(1),
      })),
    });
  } catch (error) {
    console.error("Levels fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch levels" },
      { status: 500 }
    );
  }
}
