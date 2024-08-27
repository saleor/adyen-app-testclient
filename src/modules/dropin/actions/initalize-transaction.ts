"use server";

import { graphql } from "gql.tada";
import request from "graphql-request";
import { z } from "zod";

import { createLogger } from "@/lib/logger";

import { InitalizeTransactionSchema } from "../schemas";

const logger = createLogger("initalizeTransaction");

const initalizeTransactionMutation = graphql(`
  mutation InitalizeTransaction(
    $checkoutId: ID!
    $data: JSON
    $idempotencyKey: String
    $paymentGatewayId: String!
    $amount: PositiveDecimal!
  ) {
    transactionInitialize(
      id: $checkoutId
      paymentGateway: { id: $paymentGatewayId, data: $data }
      amount: $amount
      idempotencyKey: $idempotencyKey
    ) {
      transaction {
        id
      }
      data
      errors {
        field
        message
        code
      }
    }
  }
`);

export const initalizeTransaction = async (props: {
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
  data: unknown;
  amount: number;
  idempotencyKey: string;
}): Promise<
  | { type: "error"; name: string; message: string }
  | { type: "success"; value: z.infer<typeof InitalizeTransactionSchema> }
> => {
  const { envUrl, checkoutId, paymentGatewayId, data, amount, idempotencyKey } =
    props;

  try {
    const response = await request(envUrl, initalizeTransactionMutation, {
      checkoutId,
      data,
      amount,
      idempotencyKey,
      paymentGatewayId,
    });

    const parsedResponse = InitalizeTransactionSchema.safeParse(response);

    if (parsedResponse.error) {
      logger.error("Failed to parse initalize transaction response", {
        error: parsedResponse.error,
      });
      return {
        type: "error",
        name: "ParsingInitalizeTransactionResponseError",
        message: parsedResponse.error.message,
      };
    }

    if (parsedResponse.data.transactionInitialize.errors.length > 0) {
      logger.error("Failed to initalize transaction - errors in mutation", {
        errors: parsedResponse.data.transactionInitialize.errors,
      });
      return {
        type: "error",
        name: "InitalizeTransactionError",
        message: "Failed to initalize transaction - errors in mutation",
      };
    }

    return {
      type: "success",
      value: parsedResponse.data,
    };
  } catch (error) {
    logger.error("Failed to initalize transaction", { error });
    return {
      type: "error",
      name: "InitalizeTransactionError",
      message: "Failed to initalize transaction",
    };
  }
};
