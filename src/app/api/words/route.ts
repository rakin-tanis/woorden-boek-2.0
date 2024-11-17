import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { validateExample } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Get all values for each filter
    const sources = searchParams.getAll("source");
    const levels = searchParams.getAll("level");
    const themes = searchParams.getAll("theme");
    const statuses = searchParams.getAll("status");

    const client = await clientPromise;
    const db = client.db("woorden-boek");
    const collection = db.collection("examples");

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { dutch: { $regex: search, $options: "i" } },
        { turkish: { $regex: search, $options: "i" } },
      ];
    }

    // Add filters only if values are selected
    if (sources.length > 0) query.source = { $in: sources };
    if (levels.length > 0) query.level = { $in: levels };
    if (themes.length > 0) query.theme = { $in: themes };
    if (statuses.length > 0) query.status = { $in: statuses };

    // Get total count
    const total = await collection.countDocuments(query);

    // Get paginated data
    const data = await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Get available filters
    const [allSources, allLevels, allThemes, allStatuses] = await Promise.all([
      collection.distinct("source"),
      collection.distinct("level"),
      collection.distinct("theme"),
      collection.distinct("status"),
    ]);

    return NextResponse.json({
      data,
      total,
      filters: {
        sources: allSources,
        levels: allLevels,
        themes: allThemes,
        statuses: allStatuses,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the JSON body of the request

    // Validate the example based on its status
    const validation = validateExample(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("woorden-boek");
    const collection = db.collection("examples");

    // Insert the new example into the collection
    const result = await collection.insertOne(body);

    return NextResponse.json(
      { message: "Example added successfully", exampleId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding example:", error);
    return NextResponse.json(
      { error: "Failed to add example" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const exampleId = searchParams.get("exampleId");

  if (!exampleId) {
    return NextResponse.json(
      { error: "Example ID is required" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("woorden-boek");
  const collection = db.collection("examples");

  try {
    await collection.deleteOne({ _id: new ObjectId(exampleId) });
    return NextResponse.json(
      { message: "Example deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting example:", error);
    return NextResponse.json(
      { error: "Failed to delete example" },
      { status: 500 }
    );
  }
}
