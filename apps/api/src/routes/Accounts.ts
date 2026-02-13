import { Hono } from "hono";
import { postAccountHandlers } from "~/controllers/accounts/PostAccount";
import type { AppVariables } from "~/types/App";

/**
 * Accounts Routes
 *
 * PATTERN DEMONSTRATION:
 * Routes are organized by resource (accounts, orders, etc.) and use
 * the Hono framework's type-safe routing with AppVariables.
 *
 * Each route imports handlers from the controllers directory.
 */
/**
 * @name Accounts
 */
export const accountsApp = new Hono<{ Variables: AppVariables }>().post(
  "/",
  ...postAccountHandlers,
);
export type AppType = typeof accountsApp;
