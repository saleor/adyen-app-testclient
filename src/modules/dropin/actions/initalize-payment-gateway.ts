"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";

import { createLogger } from "@/lib/logger";

import {
  InitalizePaymentGatewaySchema,
  InitalizePaymentGatewaySchemaType,
} from "../schemas";

const logger = createLogger("initalizePaymentGateway");

const InitalizePaymentGatewayMutation = graphql(`
  mutation initalizePaymentGateway(
    $checkoutId: ID!
    $paymentGatewayId: String!
    $amount: PositiveDecimal!
  ) {
    paymentGatewayInitialize(
      id: $checkoutId
      paymentGateways: [{ id: $paymentGatewayId }]
      amount: $amount
    ) {
      gatewayConfigs {
        id
        data
        errors {
          field
          message
          code
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`);

export const initalizePaymentGateway = async (props: {
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
  amount: number;
}): Promise<
  | { type: "error"; name: string; message: string }
  | { type: "success"; value: InitalizePaymentGatewaySchemaType }
> => {
  const { envUrl, checkoutId, paymentGatewayId, amount } = props;
  try {
    const response = await request(envUrl, InitalizePaymentGatewayMutation, {
      checkoutId,
      paymentGatewayId,
      amount,
    });

    const parsedResponse = InitalizePaymentGatewaySchema.safeParse(response);

    if (parsedResponse.error) {
      logger.error("Failed to parse initalize payment gateway response", {
        error: parsedResponse.error,
      });
      return {
        type: "error",
        name: "ParsingInitalizePaymentGatewayResponseError",
        message: parsedResponse.error.message,
      };
    }

    if (parsedResponse.data.paymentGatewayInitialize.errors.length > 0) {
      logger.error("Failed to initalize payment gateway - errors in mutation", {
        errors: parsedResponse.data.paymentGatewayInitialize.errors,
      });
      return {
        type: "error",
        name: "InitalizePaymentGatewayError",
        message:
          "Failed to initalize payment gateway - errors in initalizePaymentGateway mutation",
      };
    }

    if (
      parsedResponse.data.paymentGatewayInitialize.gatewayConfigs.some(
        (config) => config.errors.length > 0,
      )
    ) {
      logger.error("Failed to initalize payment gateway - errors in configs", {
        errors: parsedResponse.data.paymentGatewayInitialize.gatewayConfigs,
      });
      return {
        type: "error",
        name: "InitalizePaymentGatewayError",
        message:
          "Failed to initalize payment gateway - errors in initalizePaymentGateway configurations",
      };
    }

    return { type: "success", value: parsedResponse.data };
  } catch (error) {
    logger.error("Failed to initalize payment gateway", { error });
    return {
      type: "error",
      name: "InitalizePaymentGatewayError",
      message: "Failed to initalize payment gateway",
    };
  }
};
