import clientPromise from "@/lib/mongodb";
import { Example, ThemeDistribution } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { convertUserLevelToQuestionLevel, generateQuestionDistribution } from "@/lib/game";
import { getServerSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const session = await getServerSession();
    const client = await clientPromise;
    const collection = client.db("woorden-boek").collection("players");

    let player;
    try {
      player = await collection.findOne({
        userId: `${session?.user.id}`,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    const level =
      player?.level || parseInt(searchParams.get("level") || "") || 1;

    const gameExamples = await getGameExamples(
      generateQuestionDistribution(Number(level))
    );

    // Shuffle the examples to randomize order
    gameExamples.sort(() => 0.5 - Math.random());
    // Return only necessary information

    return NextResponse.json({ examples: gameExamples }, { status: 200 });
  } catch (error) {
    console.error("Error generating game:", error);
    return NextResponse.json(
      { message: `Internal server error : ${error}` },
      { status: 500 }
    );
  }
}

const getGameExamples = async (distribution: ThemeDistribution[]) => {
  const client = await clientPromise;
  const examplesCollection = client.db("woorden-boek").collection("examples");

  const gameExamples: Example[] = [];

  for (const d of distribution) {
    if (d.questionCount > 0) {
      const { level, theme } = convertUserLevelToQuestionLevel(d.theme);
      const examples = await examplesCollection
        .aggregate([
          {
            $match: {
              level: `${level}`,
              theme: `${theme}`,
              status: "published",
            },
          },
          { $sample: { size: d.questionCount } }, // Randomly sample 7 documents
        ])
        .toArray();

      // Add the found examples to the gameExamples array
      gameExamples.push(
        ...examples.map((doc) => ({
          _id: doc._id.toString(),
          dutch: doc.dutch,
          turkish: doc.turkish,
          level: doc.level,
          source: doc.source,
          words: doc.words || [],
          tags: doc.tags || [],
          theme: doc.theme,
          status: doc.status,
        }))
      );
    }
  }

  // Check if we have enough unique examples
  const uniqueExamples = [
    ...new Map(gameExamples.map((item) => [item._id, item])).values(),
  ];

  if (uniqueExamples.length < 10) {
    console.log(uniqueExamples);
    throw new Error(
      `Not enough unique themes. Found only ${uniqueExamples.length} themes.`
    );
  }

  return uniqueExamples;
};


