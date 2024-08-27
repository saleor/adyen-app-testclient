"use server";
import { graphql, ResultOf } from "gql.tada";
import request from "graphql-request";

import { createLogger } from "@/lib/logger";

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

export const getCheckoutSummary = async (props: {
  envUrl: string;
  checkoutId: string;
}): Promise<
  | { type: "error"; name: string; message: string }
  | { type: "success"; value: ResultOf<typeof GetCheckoutSummaryQuery> }
> => {
  const { envUrl, checkoutId } = props;
  try {
    const response = await request(envUrl, GetCheckoutSummaryQuery, {
      checkoutId,
    });

    return { type: "success", value: response };
  } catch (error) {
    logger.error("Failed to get checkout summary", {
      error,
    });
    return {
      type: "error",
      name: "GetCheckoutSummaryError",
      message: "Failed to get checkout summary",
    };
  }
};
