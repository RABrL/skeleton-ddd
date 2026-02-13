import "reflect-metadata";

import { auth } from "@repo/auth";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { authMiddleware } from "~/middlewares/AuthMiddleware";
import { corsMiddleware } from "~/middlewares/CorsMiddleware";
import { accountsApp } from "~/routes/Accounts";
import type { AppVariables } from "~/types/App";

export const app = new Hono<{ Variables: AppVariables }>()
  .basePath("/api")
  // CORS - must be before routes
  .use("*", corsMiddleware)
  // Auth middleware - adds user/session to context and enforces authentication
  .use("*", authMiddleware)
  // Better Auth routes (handles /auth/* including sign-up, sign-in, etc)
  .on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  // API Documentation
  .get("/openapi.json", async (c) => {
    const file = Bun.file("./openapi/openapi.json");
    return c.json(await file.json());
  })
  .get("/docs", Scalar({ url: "/api/openapi.json" }))
  // Domain routes
  .route("/accounts", accountsApp)
  // Health check
  .get("/health", (c) => c.json({ status: "ok" }));

export default {
  port: 8000,
  fetch: app.fetch,
};
