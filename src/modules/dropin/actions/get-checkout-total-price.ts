import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";

import { BaseError } from "@/lib/errors";

import { TotalPriceFragment } from "../fragments";

const GetCheckoutTotalPriceError = BaseError.subclass(
  "GetCheckoutTotalPriceError",
);

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
}) => {
  const { envUrl, checkoutId } = props;
  const response = await ResultAsync.fromPromise(
    request(envUrl, GetCheckoutTotalPriceQuery, {
      checkoutId,
    }),
    (error) =>
      new GetCheckoutTotalPriceError("Failed to get checkout total price", {
        errors: [error],
      }),
  );
  if (response.isErr()) {
    return err(response.error);
  }

  return ok(response.value);
};
