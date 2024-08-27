"use server";

import { graphql } from "gql.tada";
import request from "graphql-request";
import { z } from "zod";

import { createLogger } from "@/lib/logger";

import { TransactionProcessSchema } from "../schemas/transaction-process";

const logger = createLogger("processTransaction");

const processTransactionMutation = graphql(`
  mutation transactionProcess($transactionId: ID!, $data: JSON) {
    transactionProcess(id: $transactionId, data: $data) {
      transaction {
        id
        actions
        message
        pspReference
        events {
          type
          id
          createdAt
          message
          pspReference
        }
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

export const processTransaction = async (props: {
  envUrl: string;
  transactionId: string;
  data: unknown;
}): Promise<
  | { type: "error"; name: string; message: string }
  | { type: "success"; value: z.infer<typeof TransactionProcessSchema> }
> => {
  const { envUrl, transactionId, data } = props;
  try {
    const response = await request(envUrl, processTransactionMutation, {
      transactionId,
      data,
    });

    const parsedResponse = TransactionProcessSchema.safeParse(response);

    if (parsedResponse.error) {
      logger.error("Failed to parse process transaction response", {
        error: parsedResponse.error,
      });
      return {
        type: "error",
        name: "ParsingProcessTransactionResponseError",
        message: parsedResponse.error.message,
      };
    }

    if (parsedResponse.data.transactionProcess.errors.length > 0) {
      logger.error("Failed to process transaction - errors in mutation", {
        errors: parsedResponse.data.transactionProcess.errors,
      });
      return {
        type: "error",
        name: "ProcessTransactionError",
        message: "Failed to process transaction - errors in mutation",
      };
    }

    return {
      type: "success",
      value: parsedResponse.data,
    };
  } catch (error) {
    logger.error("Failed to process transaction", { error });
    return {
      type: "error",
      name: "ProcessTransactionError",
      message: "Failed to process transaction",
    };
  }
};
