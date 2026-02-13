import { Hono } from "hono";
import { postAccountHandlers } from "~/controllers/accounts/post-account";
import type { AppVariables } from "~/types/app";

/**
 * Accounts Routes
 *
 * PATTERN DEMONSTRATION:
 * Routes are organized by resource (accounts, orders, etc.) and use
 * the Hono framework's type-safe routing with AppVariables.
 *
 * Each route imports handlers from the controllers directory.
 */
export const accountsApp = new Hono<{ Variables: AppVariables }>().post(
  "/",
  ...postAccountHandlers,
);
