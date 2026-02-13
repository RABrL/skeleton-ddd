import { defineConfig } from "hono-auto-docs";

export default defineConfig({
  tsConfigPath: "./tsconfig.json",
  appPath: "src/index.ts",
  openApi: {
    openapi: "3.0.0",
    info: {
      title: "Template API",
      version: "1.0.0",
      description: "API for Template application",
    },
    servers: [{ url: "http://localhost:8000" }],
  },
  outputs: {
    openApiJson: "./openapi.json",
  },
});
