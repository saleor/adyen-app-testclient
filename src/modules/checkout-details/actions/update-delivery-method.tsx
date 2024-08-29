"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { z } from "zod";

import { BaseError } from "@/lib/errors";
import { createLogger } from "@/lib/logger";

const logger = createLogger("updateDeliveryMethod");

const UpdateDeliveryMethodError = BaseError.subclass(
  "UpdateDeliveryMethodError",
);

const UpdateDeliveryMethodSchema = z.object({
  checkoutDeliveryMethodUpdate: z.object({
    errors: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    ),
  }),
});

const UpdateDeliveryMethodMutation = graphql(`
  mutation checkoutDeliveryMethodUpdate($checkoutId: ID!, $input: ID!) {
    checkoutDeliveryMethodUpdate(id: $checkoutId, deliveryMethodId: $input) {
      errors {
        field
        message
      }
    }
  }
`);

export const updateDeliveryMethod = async (props: {
  envUrl: string;
  checkoutId: string;
  deliveryMethod: string;
}): Promise<
  | { type: "error"; name: string; message: string }
  | {
      type: "success";
      value: z.infer<typeof UpdateDeliveryMethodSchema>;
    }
> => {
  const { envUrl, checkoutId, deliveryMethod } = props;

  try {
    const response = await request(envUrl, UpdateDeliveryMethodMutation, {
      checkoutId,
      input: deliveryMethod,
    });

    const parsedResponse = UpdateDeliveryMethodSchema.safeParse(response);

    if (parsedResponse.error) {
      logger.error("Failed to parse checkoutDeliveryMethodUpdate response", {
        error: parsedResponse.error,
      });
      return {
        type: "error",
        name: "ParsingUpdateDeliveryMethodError",
        message: parsedResponse.error.message,
      };
    }

    if (parsedResponse.data.checkoutDeliveryMethodUpdate.errors.length > 0) {
      logger.error("Failed to update delivery method of checkout", {
        errors: parsedResponse.data.checkoutDeliveryMethodUpdate.errors,
      });

      return {
        type: "error",
        name: "UpdateDeliveryMethodError",
        message:
          "Failed to update delivery method - errors in updateBillingAddress mutation",
      };
    }

    return { type: "success", value: parsedResponse.data };
  } catch (error) {
    logger.error("Failed to update delivery method", { error });
    return {
      type: "error",
      name: "UpdateDeliveryMethodError",
      message: "Failed to update delivery method",
    };
  }
};
