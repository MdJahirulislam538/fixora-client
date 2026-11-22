import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { getOAuthState } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { toNextJsHandler } from "better-auth/next-js";
import { getMongoClient } from "./mongodb";

let handlers: ReturnType<typeof toNextJsHandler> | undefined;

function createAuthOptions() {
  const client = getMongoClient();
  const databaseName = process.env.MONGODB_DATABASE || "fixora";

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  return {
    database: mongodbAdapter(client.db(databaseName), { client }),
    emailAndPassword: { enabled: true },
    baseURL: process.env.BETTER_AUTH_URL,
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "customer",
          input: true,
          transform: {
            input: (value) =>
              value === "technician" ? "technician" : "customer",
          },
        },
      },
    },
    socialProviders:
      googleClientId && googleClientSecret
        ? {
            google: {
              clientId: googleClientId,
              clientSecret: googleClientSecret,
            },
          }
        : {},
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const oauthState = await getOAuthState<{ role?: unknown }>();
            const role =
              user.role === "technician" || oauthState?.role === "technician"
                ? "technician"
                : "customer";
            return { data: { ...user, role } };
          },
        },
      },
    },
  } satisfies BetterAuthOptions;
}

export type AuthOptions = ReturnType<typeof createAuthOptions>;

export function getAuthHandlers() {
  if (handlers) return handlers;

  handlers = toNextJsHandler(betterAuth(createAuthOptions()));
  return handlers;
}
