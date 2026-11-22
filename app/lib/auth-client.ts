import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { AuthOptions } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<AuthOptions>()],
});

export const { signIn, signUp, useSession } = authClient;