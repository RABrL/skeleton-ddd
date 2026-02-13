import { createFactory } from "hono/factory";
import type { ProtectedVariables } from "~/types/App";

export const factory = createFactory<{ Variables: ProtectedVariables }>();
