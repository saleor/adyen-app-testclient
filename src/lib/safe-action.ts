import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";

import { BaseError } from "./errors";
import { createLogger } from "./logger";

const logger = createLogger("serverAction");

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleReturnedServerError(e) {
    if (e instanceof BaseError) {
      return {
        message: e.message,
        name: e.name,
      };
    }

    return {
      message: DEFAULT_SERVER_ERROR_MESSAGE,
      name: "Adyen testclient error",
    };
  },
  handleServerErrorLog(originalError, utils) {
    logger.error(`Error during ${utils.metadata.actionName} action handling:`, {
      error: originalError,
      actionName: utils.metadata.actionName,
    });
  },
});
