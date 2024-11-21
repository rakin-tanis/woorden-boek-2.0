import clientPromise from "@/lib/mongodb";
import { Example, Player, ThemeDistribution } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { generateQuestionDistribution } from "@/lib/game";
import { getServerSession } from "@/lib/auth";

const firstGameDistribution = [
  {
    theme: 1,
    questionCount: 3,
  },
  {
    theme: 2,
    questionCount: 2,
  },
  {
    theme: 3,
    questionCount: 1,
  },
  {
    theme: 4,
    questionCount: 1,
  },
  {
    theme: 5,
    questionCount: 1,
  },
  {
    theme: 6,
    questionCount: 1,
  },
  {
    theme: 10,
    questionCount: 1,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = parseInt(searchParams.get("level") || "");
    console.log("GET api/game");
    console.log(level);
    let gameExamples: Example[];
    if (level) {
      // Experienced user:
      gameExamples = await getGameExamples(generateQuestionDistribution(level));
    } else {
      gameExamples = await getGameExamples(firstGameDistribution);
    }
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

  for (const theme of distribution) {
    if (theme.questionCount > 0) {
      const examples = await examplesCollection
        .aggregate([
          {
            $match: {
              level: "A1",
              theme: `${theme.theme}`,
              status: "published",
            },
          },
          { $sample: { size: theme.questionCount } }, // Randomly sample 7 documents
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
    throw new Error(
      `Not enough unique themes. Found only ${uniqueExamples.length} themes.`
    );
  }

  return uniqueExamples;
};


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getServerSession();

    if (!session?.user)
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const playersCollection = client.db("woorden-boek").collection("players");

    const player: Player = {
      userId: session.user.id!,
      name: session.user.name!,
      level: body.level,
    };

    const result = await playersCollection.updateOne(
      { userId: player.userId }, 
      {
        $set: {
          userId: session.user.id,
          name: player.name,
          level: player.level,
        },
      }, 
      { upsert: true }
    );

    session.user.level = body.level;

    return NextResponse.json(
      {
        message: "Player updated successfully",
        updatedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating player:", error);
    return NextResponse.json(
      { message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}