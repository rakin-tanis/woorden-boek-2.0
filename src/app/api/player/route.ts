import { getServerSession } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { Player } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  console.log("GET api/game");
  const session = await getServerSession();
  const client = await clientPromise;
  const collection = client.db("woorden-boek").collection("players");

  if (!session?.user)
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  try {
    const player = await collection.findOne({
      userId: `${session?.user.id}`,
    });

    if (!player) {
      return NextResponse.json(
        {
          player: {
            userId: session.user.id,
            name: session.user.name,
            level: 1,
            score: 0,
          },
        },
        { status: 200 }
      );
    }
    return NextResponse.json({ player }, { status: 200 });
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json(
      { message: `Internal server error : ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("PUT api/game");
    const session = await getServerSession();

    if (!session?.user)
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const playersCollection = client.db("woorden-boek").collection("players");

    const player: Partial<Player> = {
      userId: session.user.id!,
    };

    if (body.name) {
      const p = await playersCollection.findOne({ name: body.name });
      if (p) {
        return NextResponse.json(
          {
            status: "error",
            message: `Username has already taken.`,
          },
          { status: 200 }
        );
      }
      player.name = body.name;
    }

    if (body.level) {
      player.level = body.level;
    }

    if (body.score) {
      player.score = body.score;
    }

    const result = await playersCollection.updateOne(
      { userId: player.userId },
      {
        $set: { ...player },
      },
      { upsert: true }
    );

    return NextResponse.json(
      {
        status: "success",
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
