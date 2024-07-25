import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_INITIAL_ENV_URL: z.string().url(),
    NEXT_PUBLIC_INITIAL_CHANNEL_SLUG: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_INITIAL_CHANNEL_SLUG:
      process.env.NEXT_PUBLIC_INITIAL_CHANNEL_SLUG,
    NEXT_PUBLIC_INITIAL_ENV_URL: process.env.NEXT_PUBLIC_INITIAL_ENV_URL,
  },
  extends: [vercel()],
});
