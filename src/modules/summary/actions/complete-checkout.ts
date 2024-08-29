"use server";
import { graphql, ResultOf } from "gql.tada";
import request from "graphql-request";

import { BaseError } from "@/lib/errors";
import { createLogger } from "@/lib/logger";

const CompleteCheckoutError = BaseError.subclass("CompleteCheckoutError");

const logger = createLogger("completeCheckout");

const CompleteCheckoutMutation = graphql(`
  mutation CompleteCheckout($checkoutId: ID!) {
    checkoutComplete(id: $checkoutId) {
      order {
        id
      }
      errors {
        field
        message
        code
      }
    }
  }
`);

export const completeCheckout = async (props: {
  envUrl: string;
  checkoutId: string;
}): Promise<
  | { type: "error"; name: string; message: string }
  | { type: "success"; value: ResultOf<typeof CompleteCheckoutMutation> }
> => {
  const { envUrl, checkoutId } = props;
  try {
    const response = await request(envUrl, CompleteCheckoutMutation, {
      checkoutId,
    });

    if ((response.checkoutComplete?.errors ?? []).length > 0) {
      logger.error("Failed to complete checkout", {
        errors: response.checkoutComplete?.errors,
      });
      return {
        type: "error",
        name: "CompleteCheckoutError",
        message: "Failed to complete checkout - errors in mutation response",
      };
    }

    return { type: "success", value: response };
  } catch (error) {
    logger.error("Failed to complete checkout", {
      error,
    });
    return {
      type: "error",
      name: "CompleteCheckoutError",
      message: "Failed to complete checkout",
    };
  }
};
