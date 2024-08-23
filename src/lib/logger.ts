import { type ILogObj, Logger } from "tslog";

import { env } from "@/env";

function getMinLevel() {
  switch (env.NEXT_PUBLIC_LOG_LEVEL) {
    case "info":
      return 3;
    case "warn":
      return 4;
    case "error":
      return 5;
  }
}

export const logger = new Logger<ILogObj>({
  minLevel: getMinLevel(),
  hideLogPositionForProduction: true,
  type: "pretty",
});

export const createLogger = (name: string, params?: Record<string, unknown>) =>
  logger.getSubLogger(
    {
      name: name,
    },
    params,
  );
