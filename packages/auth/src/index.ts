import { Uuid } from "@repo/core/shared/domain/value-object/Uuid";
import { db } from "@repo/db";
import {
  authAccount,
  authSession,
  authUser,
  authVerification,
} from "@repo/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authUser,
      session: authSession,
      account: authAccount,
      verification: authVerification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: () => Uuid.generate().value,
    },
  },
});

export type AuthAPI = typeof auth;
