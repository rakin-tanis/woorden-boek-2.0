import { MongoClient, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export const findUserWithEmail = async (email: string) => {
  try {
    const client = await clientPromise;
    const usersCollection = client.db("woorden-boek").collection("users");
    const user = await usersCollection.findOne({ email });
    return user;
  } catch (error) {
    console.error("Find user error: ", error);
    throw new Error("Find user error: " + error);
  }
};

export const updateLastLogin = async (userId: string) => {
  try {
    const client = await clientPromise;
    const usersCollection = client.db("woorden-boek").collection("users");
    const lastLoginAt = new Date();
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { lastLoginAt } }
    );
  } catch (error) {
    console.error("Update last login error: ", error);
    throw new Error("Update last login error: " + error);
  }
};

export const insertNewPlayer = async (playerName: string, userId: string) => {
  try {
    const client = await clientPromise;
    const playersCollection = client.db("woorden-boek").collection("players");

    // Function to generate a unique player name (case-insensitive)
    async function generateUniqueName(baseName: string): Promise<string> {
      // Normalize the base name (lowercase for comparison)
      const normalizedBaseName = baseName.toLowerCase();

      let uniqueName = normalizedBaseName;
      let suffix = 1;

      // Check for case-insensitive name matches
      while (
        await playersCollection.findOne({
          name: { $regex: new RegExp(`^${uniqueName}$`, "i") },
        })
      ) {
        // Create a new unique name with suffix
        uniqueName = `${normalizedBaseName}_${suffix}`;
        suffix++;
      }

      return uniqueName;
    }

    // Generate a unique player name
    const uniquePlayerName = await generateUniqueName(playerName);

    await playersCollection.insertOne({
      userId: userId,
      name: uniquePlayerName,
      level: 1,
      score: 0,
    });
  } catch (error) {
    console.error("New player adding error: ", error);
    throw new Error("New player adding error: " + error);
  }
};
