import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { Example } from "@/types";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Verify user is authenticated
    const session = await getServerSession();

    console.log("api/game");
    const client = await clientPromise;
    const usersCollection = client.db("woorden-boek").collection("users");

    // Find the user

    let gameExamples: Example[];

    if (session?.user) {
      const user = await usersCollection.findOne({
        email: session?.user.email,
      });

      if (user?.gameLevel) {
        // Experienced user:
        // 7 examples from current level and theme
        gameExamples = await getExperiencedUserExamples(user.gameLevel);
      } else {
        gameExamples = await getFistGameExamples();
      }
    } else {
      gameExamples = await getFistGameExamples();
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

const getExperiencedUserExamples = async (gameLevel: string) => {
  const client = await clientPromise;
  const examplesCollection = client.db("woorden-boek").collection("examples");

  const currentLevelExamples = await examplesCollection
    .find({
      level: "A1",
      theme: gameLevel,
      status: "published",
    })
    .limit(7)
    .toArray();

  // 3 examples from next theme
  const nextThemeExamples = await examplesCollection
    .find({
      level: "A1",
      theme: (gameLevel + 1).toString(),
      status: "published",
    })
    .limit(3)
    .toArray();

  const gameExamples = [...currentLevelExamples, ...nextThemeExamples].map(
    (doc) => ({
      _id: doc._id.toString(),
      dutch: doc.dutch,
      turkish: doc.turkish,
      level: doc.level,
      source: doc.source,
      words: doc.words || [],
      tags: doc.tags || [],
      theme: doc.theme,
      status: doc.status,
    })
  );
  return gameExamples;
};

const getFistGameExamples = async () => {
  const client = await clientPromise;
  const examplesCollection = client.db("woorden-boek").collection("examples");

  const themeDistribution = {
    "1": 3,
    "2": 2,
    "3": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 1,
  } as const;

  const gameExamples: Example[] = [];

  for (const theme of Object.keys(themeDistribution)) {
    const requiredCount =
      themeDistribution[theme as keyof typeof themeDistribution];

    if (requiredCount > 0) {
      const examples = await examplesCollection
        .find({
          level: "A1",
          theme: theme,
          status: "published",
        })
        .limit(requiredCount)
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
