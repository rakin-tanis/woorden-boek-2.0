import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const client = await clientPromise;
    const examplesCollection = client.db("woorden-boek").collection("examples");

    const source = searchParams.get("source") || "blue";
    const level = searchParams.get("level") || "A1";
    const themes = (searchParams.get("themes") || "1").split(",");

    const trainingExamples = await examplesCollection
      .aggregate([
        {
          $match: {
            source: source,
            level: level,
            theme: { $in: themes },
            status: "published",
          },
        },
        { $sample: { size: 10 } },
      ])
      .toArray();

    // Shuffle the examples to randomize order
    trainingExamples.sort(() => 0.5 - Math.random());
    // Return only necessary information

    return NextResponse.json({ examples: trainingExamples }, { status: 200 });
  } catch (error) {
    console.error("Error generating training examples:", error);
    return NextResponse.json(
      { message: `Internal server error : ${error}` },
      { status: 500 }
    );
  }
}
