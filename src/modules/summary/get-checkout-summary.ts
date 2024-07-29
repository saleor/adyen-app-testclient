import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";

import { BaseError } from "@/lib/errors";

import { CheckoutFragment } from "./fragments";

const GetCheckoutSummaryError = BaseError.subclass("GetCheckoutSummaryError");

const GetCheckoutSummaryQuery = graphql(
  `
    query getCheckout($checkoutId: ID!) {
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
}) => {
  const { envUrl, checkoutId } = props;
  const response = await ResultAsync.fromPromise(
    request(envUrl, GetCheckoutSummaryQuery, {
      checkoutId,
    }),
    (error) =>
      new GetCheckoutSummaryError("Failed to get checkout summary", {
        errors: [error],
      }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  return ok(response.value);
};
