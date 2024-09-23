"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { z } from "zod";

import { envUrlSchema } from "@/lib/env-url";
import { BaseError, UnknownError } from "@/lib/errors";
import { createLogger } from "@/lib/logger";
import { actionClient } from "@/lib/safe-action";

import { CheckoutFragment } from "../fragments";

const logger = createLogger("getCheckoutSummary");

const GetCheckoutSummaryQuery = graphql(
  `
    query getCheckoutSummary($checkoutId: ID!) {
      checkout(id: $checkoutId) {
        ...Checkout
      }
    }
  `,
  [CheckoutFragment],
);

export const getCheckoutSummary = actionClient
  .schema(
    z.object({
      envUrl: envUrlSchema,
      checkoutId: z.string(),
    }),
  )
  .metadata({ actionName: "getCheckoutSummary" })
  .action(async ({ parsedInput: { envUrl, checkoutId } }) => {
    const response = await request(envUrl, GetCheckoutSummaryQuery, {
      checkoutId,
    }).catch((error) => {
      throw BaseError.normalize(error, UnknownError);
    });

    return response;
  });
