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
  handleServerError(error, utils) {
    logger.error(`Error during ${utils.metadata.actionName} action handling:`, {
      error: error,
      actionName: utils.metadata.actionName,
    });

    if (error instanceof BaseError) {
      return {
        message: error.message,
        name: error.name,
      };
    }

    return {
      message: DEFAULT_SERVER_ERROR_MESSAGE,
      name: "Adyen testclient error",
    };
  },
});
