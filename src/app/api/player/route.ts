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
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
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
    console.log("POST api/game", body);
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
