import { MongoClient } from "mongodb";

declare global {
  var mongoClient: MongoClient | undefined;
}

export function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI must be configured to use authentication.");
  }

  if (global.mongoClient) return global.mongoClient;

  const client = new MongoClient(uri);
  if (process.env.NODE_ENV !== "production") {
    global.mongoClient = client;
  }
  return client;
}
