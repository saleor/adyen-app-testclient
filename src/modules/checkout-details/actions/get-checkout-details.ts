"use server";

import { graphql, ResultOf } from "gql.tada";
import request from "graphql-request";

import { createLogger } from "@/lib/logger";

import {
  BillingAddressFragment,
  CollectionPointFragment,
  DeliveryMethodFragment,
  ShippingAddressFragment,
  ShippingMethodFragment,
} from "../fragments";

const logger = createLogger("getCheckoutDetails");

const GetCheckoutQuery = graphql(
  `
    query getCheckout($checkoutId: ID!) {
      checkout(id: $checkoutId) {
        billingAddress {
          ...BillingAddress
        }
        shippingAddress {
          ...ShippingAddress
        }
        shippingMethods {
          ...ShippingMethod
        }
        deliveryMethod {
          ...DeliveryMethod
          ...CollectionPoint
        }
      }
    }
  `,
  [
    BillingAddressFragment,
    ShippingAddressFragment,
    ShippingMethodFragment,
    DeliveryMethodFragment,
    CollectionPointFragment,
  ],
);

export const getCheckoutDetails = async (props: {
  envUrl: string;
  checkoutId: string;
}): Promise<
  | { type: "error"; name: string; message: string }
  | { type: "success"; value: ResultOf<typeof GetCheckoutQuery> }
> => {
  const { envUrl, checkoutId } = props;
  try {
    const response = await request(envUrl, GetCheckoutQuery, {
      checkoutId,
    });

    return {
      type: "success",
      value: response,
    };
  } catch (error) {
    logger.error("Failed to get checkout details", { error });
    return {
      type: "error",
      name: "GetCheckoutError",
      message: "Failed to get checkout details",
    };
  }
};
