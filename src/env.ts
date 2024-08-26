import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_INITIAL_ENV_URL: z
      .string()
      .url()
      .refine((v) => v.endsWith("/graphql/"), "Must end with /graphql/"),
    NEXT_PUBLIC_INITIAL_CHANNEL_SLUG: z.string(),
    NEXT_PUBLIC_LOG_LEVEL: z
      .enum(["info", "warn", "error"])
      .optional()
      .default("info"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_INITIAL_CHANNEL_SLUG:
      process.env.NEXT_PUBLIC_INITIAL_CHANNEL_SLUG,
    NEXT_PUBLIC_INITIAL_ENV_URL: process.env.NEXT_PUBLIC_INITIAL_ENV_URL,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
  },
  extends: [vercel()],
  isServer: typeof window === "undefined",
});
