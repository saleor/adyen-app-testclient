import { type ILogObj, ILogObjMeta, Logger } from "tslog";

import { env } from "@/env";

function isObject(item: unknown) {
  return typeof item === "object" && !Array.isArray(item) && item !== null;
}

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
  /**
   * Use custom console.log transport, because built-in API for pretty logger is limited
   */
  type: "hidden",
  overwrite: {
    /**
     * Format log. Use parent logger (createLogger) args and merge them with args from individual logs
     */
    toLogObj(args, log) {
      const message = args.find((arg) => typeof arg === "string");
      const attributesFromLog = (args.find(isObject) as Object) ?? {};
      const parentAttributes = log ?? {};

      return {
        ...log,
        message,
        attributes: {
          ...parentAttributes,
          ...attributesFromLog,
        },
      };
    },
  },
});

logger.attachTransport((log) => {
  const {
    message,
    attributes,
    _meta: { date, name, parentNames },
  } = log as ILogObj &
    ILogObjMeta & {
      message: string;
      attributes: Record<string, unknown>;
    };

  const formattedName = `${(parentNames ?? []).join(":")}:${name}`;
  const formattedDate = date.toISOString();

  // eslint-disable-next-line no-console
  console.log(
    `${formattedDate} ${formattedName} ${message}`,
    JSON.stringify(attributes, null, 2),
  );
});

export const createLogger = (name: string, params?: Record<string, unknown>) =>
  logger.getSubLogger(
    {
      name: name,
    },
    params,
  );
