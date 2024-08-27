"use server";
import { graphql, ResultOf } from "gql.tada";
import request from "graphql-request";

import { createLogger } from "@/lib/logger";

import { TotalPriceFragment } from "../fragments";

const logger = createLogger("getCheckoutTotalPrice");

const GetCheckoutTotalPriceQuery = graphql(
  `
    query GetCheckoutTotalPrice($checkoutId: ID!) {
      checkout(id: $checkoutId) {
        totalPrice {
          ...TotalPrice
        }
      }
    }
  `,
  [TotalPriceFragment],
);

export const getCheckoutTotalPrice = async (props: {
  envUrl: string;
  checkoutId: string;
}): Promise<
  | { type: "error"; name: string; message: string }
  | { type: "success"; value: ResultOf<typeof GetCheckoutTotalPriceQuery> }
> => {
  const { envUrl, checkoutId } = props;

  try {
    const response = await request(envUrl, GetCheckoutTotalPriceQuery, {
      checkoutId,
    });

    return { type: "success", value: response };
  } catch (error) {
    logger.error("Failed to get checkout total price", { error });
    return {
      type: "error",
      name: "GetCheckoutTotalPriceError",
      message: "Failed to get checkout total price",
    };
  }
};
