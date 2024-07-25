import { graphql } from "gql.tada";
import request from "graphql-request";
import { ResultAsync } from "neverthrow";

import { BaseError } from "@/lib/errors";
import { ProductFragment } from "./cart";

const FetchProductError = BaseError.subclass("FetchProductError");

const FetchProductQuery = graphql(
  `
    query FetchProduct($channelSlug: String!) {
      products(
        first: 1
        channel: $channelSlug
        filter: {
          isPublished: true
          stockAvailability: IN_STOCK
          giftCard: false
        }
        sortBy: { field: PRICE, direction: DESC }
      ) {
        edges {
          node {
            ...Product
          }
        }
      }
    }
  `,
  [ProductFragment],
);

export const fetchProduct = async (props: {
  channelSlug: string;
  envUrl: string;
}) => {
  const { envUrl, channelSlug } = props;

  return ResultAsync.fromPromise(
    request(envUrl, FetchProductQuery, {
      channelSlug,
    }),
    (error) =>
      new FetchProductError("Failed to fetch products", { errors: [error] }),
  );
};
