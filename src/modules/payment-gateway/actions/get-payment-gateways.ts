"use server";
import { graphql, ResultOf } from "gql.tada";
import request from "graphql-request";

import { createLogger } from "@/lib/logger";

import { PaymentGatewayFragment, TotalPriceFragment } from "../fragments";

const logger = createLogger("getPaymentGateways");

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
}): Promise<
  | { type: "error"; name: string; message: string }
  | { type: "success"; value: ResultOf<typeof GetPaymentGatewaysQuery> }
> => {
  const { envUrl, checkoutId } = props;

  try {
    const response = await request(envUrl, GetPaymentGatewaysQuery, {
      checkoutId,
    });

    return { type: "success", value: response };
  } catch (error) {
    logger.error("Failed to get payment gateways", { error });
    return {
      type: "error",
      name: "GetPaymentGatewaysError",
      message: "Failed to get payment gateways",
    };
  }
};
