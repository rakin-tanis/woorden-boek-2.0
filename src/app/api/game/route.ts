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

  // First-time game: Select 10 A1 examples from themes 1-10
  const gameExamples = (
    await examplesCollection
      .aggregate([
        {
          $match: {
            level: "A1",
            theme: {
              $in: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            },
            status: "published",
          },
        },
        {
          $group: {
            _id: "$theme",
            example: { $first: "$$ROOT" },
          },
        },
        {
          $sample: { size: 10 },
        },
        {
          $replaceRoot: { newRoot: "$example" },
        },
      ])
      .toArray()
  ).map((doc) => ({
    _id: doc._id.toString(),
    dutch: doc.dutch,
    turkish: doc.turkish,
    level: doc.level,
    source: doc.source,
    words: doc.words || [],
    tags: doc.tags || [],
    theme: doc.theme,
    status: doc.status,
  }));

  if (gameExamples.length < 10) {
    // Option 1: Throw an error
    if (gameExamples.length < 10) {
      throw new Error(
        `Not enough unique themes. Found only ${gameExamples.length} themes.`
      );
      // return NextResponse.json(
      //   { message: `Not enough unique themes. Found only ${gameExamples.length} themes.` },
      //   { status: 500 }
      // );
    }
  }

  return gameExamples;
};
