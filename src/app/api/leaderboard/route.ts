import { leaderboardSections } from "@/components/leaderboard/leaderboardSections";
import { getServerSession } from "@/lib/session";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("GET api/leaderboard");
  const session = await getServerSession();
  // const session = { user: { id: ''}}
  if (!session?.user)
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  try {
    const client = await clientPromise;
    const collection = client.db("woorden-boek").collection("players");

    // Find the current user
    const currentUser = await collection.findOne({
      userId: `${session.user.id}`,
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const currentPlayer = await collection.findOne({
      userId: `${session?.user.id}`,
    });

    if (!currentPlayer) {
      return NextResponse.json(
        { message: "player not found" },
        { status: 404 }
      );
    }

    const { minLevel, maxLevel } = leaderboardSections.find(
      (section) =>
        currentPlayer.level >= section.minLevel &&
        currentPlayer.level <= section.maxLevel
    ) || {
      minLevel: 1,
      maxLevel: 50,
    };

    // Find all players in the specified level range
    const allPlayersInRange = await collection
      .find({
        level: {
          $gte: minLevel,
          $lte: maxLevel,
        },
      })
      .sort({ score: -1 })
      .toArray();

    // Get total number of players in the level range
    const totalPlayersInRange = allPlayersInRange.length;

    // Find current user's rank
    const currentUsersRank =
      allPlayersInRange.findIndex(
        (player) => player.userId === currentUser.userId
      ) + 1;

    // Determine slice of entries to return
    let startIndex = Math.max(0, currentUsersRank - 4); // 3 entries before current user
    let endIndex = Math.min(allPlayersInRange.length, startIndex + 7); // 7 total entries

    // Ensure we always try to show 7 entries if possible
    if (endIndex - startIndex < 7 && allPlayersInRange.length > 7) {
      startIndex = Math.max(0, allPlayersInRange.length - 7);
      endIndex = allPlayersInRange.length;
    }

    // Slice the entries
    const leaderboardEntries = allPlayersInRange
      .slice(startIndex, endIndex)
      .map((entry, index) => ({
        ...entry,
        rank: startIndex + index + 1,
        id: entry.userId === currentUser.userId ? "current" : entry.userId,
        _id: entry._id.toString(),
        score: entry.score || 0,
      }));

    // Ensure current user is in the entries if not already
    const currentUserInEntries = leaderboardEntries.some(
      (entry) => entry.id === "current"
    );
    if (!currentUserInEntries) {
      leaderboardEntries.push({
        ...currentUser,
        rank: currentUsersRank,
        id: "current",
        _id: currentUser._id.toString(),
        score: currentUser.score || 0,
      });
    }
    // Get the top 3 players by score within the specified level range
    const topPlayers = allPlayersInRange.slice(0, 3).map((entry, index) => ({
      ...entry,
      rank: index + 1,
      id: entry.userId === currentUser.userId ? "current" : entry.userId,
      _id: entry._id.toString(),
      score: entry.score || 0,
    }));

    topPlayers.forEach((tp) => {
      if (!leaderboardEntries.some((e) => e._id === tp._id)) {
        leaderboardEntries.push(tp);
      }
    });

    // Sort entries by score
    const finalEntries = leaderboardEntries.sort((a, b) => b.score - a.score);

    return NextResponse.json(
      {
        entries: finalEntries,
        currentPlayerRank: currentUsersRank,
        totalPlayersInRange: totalPlayersInRange,
        levelRange: { min: minLevel, max: maxLevel },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
