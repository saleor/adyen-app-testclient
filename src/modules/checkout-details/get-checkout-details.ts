import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";

import { BaseError } from "@/lib/errors";

import { BillingAddressFragment } from "./billing";
import { ShippingAddressFragment, ShippingMethodFragment } from "./shipping";

const GetCheckoutError = BaseError.subclass("GetCheckoutError");

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
      }
    }
  `,
  [BillingAddressFragment, ShippingAddressFragment, ShippingMethodFragment],
);

export const getCheckoutDetails = async (props: {
  envUrl: string;
  checkoutId: string;
}) => {
  const { envUrl, checkoutId } = props;
  const response = await ResultAsync.fromPromise(
    request(envUrl, GetCheckoutQuery, {
      checkoutId,
    }),
    (error) =>
      new GetCheckoutError("Failed to get checkout details", {
        errors: [error],
      }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  return ok(response.value);
};
