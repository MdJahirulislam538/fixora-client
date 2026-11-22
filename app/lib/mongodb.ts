import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DATABASE ?? "fixora";

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

// Global singleton to avoid creating multiple connections in dev (hot reload)
declare global {
  var _fixoraMongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._fixoraMongoClientPromise) {
    const client = new MongoClient(uri);
    global._fixoraMongoClientPromise = client.connect();
  }
  clientPromise = global._fixoraMongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(database?: string) {
  const c = await clientPromise;
  return c.db(database ?? dbName);
}

export { clientPromise };
