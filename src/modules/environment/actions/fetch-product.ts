import { graphql, readFragment } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";

import { BaseError } from "@/lib/errors";

import { ProductFragment } from "../components/cart";

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

  const response = await ResultAsync.fromPromise(
    request(envUrl, FetchProductQuery, {
      channelSlug,
    }),
    (error) =>
      new FetchProductError("Failed to fetch products", { errors: [error] }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  const products = response.value.products?.edges.map((edge) =>
    readFragment(ProductFragment, edge.node),
  );

  if (products?.length === 0) {
    return err(
      new FetchProductError("No products found for selected channel."),
    );
  }

  if (products?.some((product) => product.defaultVariant?.pricing === null)) {
    return err(
      new FetchProductError(
        "Default variant not available for selected channel.",
      ),
    );
  }

  return ok(response.value);
};
