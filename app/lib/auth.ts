import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DATABASE ?? "fixoraClientDb";

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

// Global singleton — reuses the connection across hot reloads in dev
declare global {
  var _fixoraMongoClient: MongoClient | undefined;
}

let mongoClient: MongoClient;
if (global._fixoraMongoClient) {
  mongoClient = global._fixoraMongoClient;
} else {
  mongoClient = new MongoClient(uri);
  if (process.env.NODE_ENV === "development") {
    global._fixoraMongoClient = mongoClient;
  }
}

const db = mongoClient.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client: mongoClient }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true, // allow client to send this field on sign-up
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      area: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        async before(user) {
          return {
            data: {
              ...user,
              role: user.role === "technician" ? "technician" : "customer",
            },
          };
        },
      },
      update: {
        async before(user) {
          const safeUser = { ...user };
          Reflect.deleteProperty(safeUser, "role");
          return { data: safeUser };
        },
      },
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
