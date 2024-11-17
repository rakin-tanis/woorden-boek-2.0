// pages/api/words/[id].ts
import { NextApiRequest } from "next";
import clientPromise from "@/lib/mongodb"; // Adjust the import based on your DB connection logic
import { ObjectId } from "mongodb"; // Import ObjectId if using MongoDB
import { NextResponse } from "next/server";
import { validateExample } from "@/lib/validation";

export async function PUT(
  req: NextApiRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const exampleId = (await params).id; // Extract the example ID from the parameters
  const body = await req.json(); // Parse the request body

  if (!exampleId) {
    return NextResponse.json(
      { error: "Example ID is required" },
      { status: 400 }
    );
  }

  if (!body) {
    return NextResponse.json(
      { error: "Request body is required" },
      { status: 400 }
    );
  }

  // Validate the example based on its status
  const validation = validateExample(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const client = await clientPromise; // Connect to the database
  const db = client.db("woorden-boek"); // Specify your database name
  const collection = db.collection("examples"); // Specify your collection name

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(exampleId) }, // Update the document with the matching ID
      { $set: body } // Update the fields with the provided body
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Example not found or no changes made" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Example updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating example:", error);
    return NextResponse.json(
      { error: "Failed to update example" },
      { status: 500 }
    );
  }
}


