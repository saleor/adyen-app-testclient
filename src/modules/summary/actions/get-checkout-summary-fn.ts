import { queryOptions } from "@tanstack/react-query";
import { graphql } from "gql.tada";
import request from "graphql-request";

import { BaseError, UnknownError } from "@/lib/errors";

import { CheckoutFragment } from "../fragments";

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

export const getCheckoutSummaryOptions = (args: {
  envUrl: string;
  checkoutId: string;
}) =>
  queryOptions({
    queryKey: ["checkoutSummary"],
    queryFn: async () => {
      const response = await request(args.envUrl, GetCheckoutSummaryQuery, {
        checkoutId: args.checkoutId,
      }).catch((error) => {
        throw BaseError.normalize(error, UnknownError);
      });

      return response;
    },
  });
