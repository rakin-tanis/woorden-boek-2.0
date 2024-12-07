import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("woorden-boek");
    const collection = db.collection("examples");

    // Fetch themes based on optional query parameters
    const { searchParams } = new URL(request.url);

    // Optional filtering parameters
    const sources = searchParams.getAll("source");
    const levels = searchParams.getAll("level");

    // Build query for themes
    const query: Record<string, unknown> = {};

    // Add filters if provided
    if (sources.length > 0) query.source = { $in: sources };
    if (levels.length > 0) query.level = { $in: levels };
    query.status = "published";

    // Get distinct themes based on optional filters
    const themes = await collection.distinct("theme", query);

    return NextResponse.json({
      themes: themes.map((theme) => ({
        value: theme,
        label: theme.charAt(0).toUpperCase() + theme.slice(1),
      })),
    });
  } catch (error) {
    console.error("Themes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch themes" },
      { status: 500 }
    );
  }
}
