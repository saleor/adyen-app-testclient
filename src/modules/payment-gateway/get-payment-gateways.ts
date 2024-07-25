import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";

import { BaseError } from "@/lib/errors";

import { PaymentGatewayFragment, TotalPriceFragment } from "./fragments";

const GetPaymentGatewaysError = BaseError.subclass("GetPaymentGatewaysError");

const GetPaymentGatewaysQuery = graphql(
  `
    query GetPaymentGateways($checkoutId: ID!) {
      checkout(id: $checkoutId) {
        totalPrice {
          ...TotalPrice
        }
        availablePaymentGateways {
          ...PaymentGateway
        }
      }
    }
  `,
  [TotalPriceFragment, PaymentGatewayFragment],
);

export const getPaymentGateways = async (props: {
  envUrl: string;
  checkoutId: string;
}) => {
  const { envUrl, checkoutId } = props;

  const response = await ResultAsync.fromPromise(
    request(envUrl, GetPaymentGatewaysQuery, {
      checkoutId,
    }),
    (error) =>
      new GetPaymentGatewaysError("Failed to get payment gateways", {
        errors: [error],
      }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  return ok(response.value);
};
