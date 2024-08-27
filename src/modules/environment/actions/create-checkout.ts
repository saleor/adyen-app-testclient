"use server";

import { graphql } from "gql.tada";
import request from "graphql-request";
import { z } from "zod";

import { createLogger } from "@/lib/logger";

const logger = createLogger("createCheckout");

const CreateCheckoutSchema = z.object({
  checkoutCreate: z.object({
    checkout: z.object({
      id: z.string(),
    }),
    errors: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    ),
  }),
});

const CreateCheckoutMutation = graphql(`
  mutation createCheckout($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
      }
      errors {
        field
        message
      }
    }
  }
`);

export const createCheckout = async (props: {
  envUrl: string;
  channelSlug: string;
  variantId: string;
}): Promise<
  | { type: "error"; name: string; message: string }
  | { type: "success"; value: z.infer<typeof CreateCheckoutSchema> }
> => {
  const { envUrl, channelSlug, variantId } = props;
  try {
    const response = await request(envUrl, CreateCheckoutMutation, {
      input: {
        channel: channelSlug,
        email: "adyen-testclient@saleor.io",
        lines: [
          {
            variantId,
            quantity: 1,
          },
        ],
      },
    });

    const parsedResponse = CreateCheckoutSchema.safeParse(response);

    if (parsedResponse.error) {
      logger.error("Failed to parse checkoutCreate response", {
        error: parsedResponse.error,
      });
      return {
        type: "error",
        name: "ParsingCheckoutResponseError",
        message: parsedResponse.error.errors
          .map((error) => error.message)
          .join(", "),
      };
    }

    if (parsedResponse.data.checkoutCreate.errors.length > 0) {
      logger.error("Failed to create checkout", {
        errors: parsedResponse.data.checkoutCreate.errors,
      });
      return {
        type: "error",
        name: "CreateCheckoutError",
        message:
          "Failed to create checkout - errors in createCheckout mutation",
      };
    }

    return { type: "success", value: parsedResponse.data };
  } catch (error) {
    logger.error("Failed to create checkout", { error });
    return {
      type: "error",
      name: "CreateCheckoutError",
      message: "Failed to create checkout",
    };
  }
};
