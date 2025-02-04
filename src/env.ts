import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

import { envUrlSchema } from "./lib/env-url";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_INITIAL_ENV_URL: envUrlSchema,
    NEXT_PUBLIC_INITIAL_CHANNEL_SLUG: z.string(),
    NEXT_PUBLIC_INITIAL_CHECKOUT_COUNTRY_CODE: z
      .enum(["PL", "SE", "US"])
      .optional()
      .default("US"),
    NEXT_PUBLIC_LOG_LEVEL: z
      .enum(["info", "warn", "error"])
      .optional()
      .default("info"),
    NEXT_PUBLIC_SEGMENT_WRITE_KEY: z.string(),
    NEXT_PUBLIC_STOREFRONT_USER_EMAIL: z.string(),
    NEXT_PUBLIC_STOREFRONT_USER_PASSWORD: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_INITIAL_CHANNEL_SLUG:
      process.env.NEXT_PUBLIC_INITIAL_CHANNEL_SLUG,
    NEXT_PUBLIC_INITIAL_ENV_URL: process.env.NEXT_PUBLIC_INITIAL_ENV_URL,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
    NEXT_PUBLIC_INITIAL_CHECKOUT_COUNTRY_CODE:
      process.env.NEXT_PUBLIC_INITIAL_CHECKOUT_COUNTRY_CODE,
    NEXT_PUBLIC_SEGMENT_WRITE_KEY: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    NEXT_PUBLIC_STOREFRONT_USER_EMAIL:
      process.env.NEXT_PUBLIC_STOREFRONT_USER_EMAIL,
    NEXT_PUBLIC_STOREFRONT_USER_PASSWORD:
      process.env.NEXT_PUBLIC_STOREFRONT_USER_PASSWORD,
  },
  extends: [vercel()],
  isServer: typeof window === "undefined",
});
