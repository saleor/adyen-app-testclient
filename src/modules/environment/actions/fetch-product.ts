"use server";

import { graphql, readFragment } from "gql.tada";
import request from "graphql-request";

import { createLogger } from "@/lib/logger";

import { ProductFragment } from "../fragments";

const logger = createLogger("fetchProduct");

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

  try {
    const response = await request(envUrl, FetchProductQuery, {
      channelSlug,
    });

    const products = response.products?.edges.map((edge) =>
      readFragment(ProductFragment, edge.node),
    );

    if (products?.length === 0) {
      return {
        type: "error",
        name: "FetchProductError",
        message: "No products found for selected channel.",
      };
    }

    if (products?.some((product) => product.defaultVariant?.pricing === null)) {
      return {
        type: "error",
        name: "FetchProductError",
        message: "Default variant not available for selected channel.",
      };
    }

    return { type: "success", value: response };
  } catch (error) {
    logger.error("Failed to fetch products", { error });
    return {
      type: "error",
      name: "FetchProductError",
      message: "Failed to fetch products",
    };
  }
};
