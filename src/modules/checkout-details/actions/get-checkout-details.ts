"use server";

import { graphql } from "gql.tada";
import request from "graphql-request";
import { z } from "zod";

import { envUrlSchema } from "@/lib/env-url";
import { BaseError, UnknownError } from "@/lib/errors";
import { actionClient } from "@/lib/safe-action";

import {
  BillingAddressFragment,
  CollectionPointFragment,
  DeliveryMethodFragment,
  ShippingAddressFragment,
  ShippingMethodFragment,
} from "../fragments";

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

export const getCheckoutDetails = actionClient
  .schema(
    z.object({
      checkoutId: z.string(),
      envUrl: envUrlSchema,
    }),
  )
  .metadata({ actionName: "getCheckoutDetails" })
  .action(async ({ parsedInput: { envUrl, checkoutId } }) => {
    const response = await request(envUrl, GetCheckoutQuery, {
      checkoutId,
    }).catch((error) => {
      throw BaseError.normalize(error, UnknownError);
    });

    return response;
  });
