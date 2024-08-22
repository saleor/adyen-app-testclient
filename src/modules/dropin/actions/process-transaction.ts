import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";
import { z } from "zod";

import { BaseError } from "@/lib/errors";

import { AdyenPaymentDetailResponse } from "../adyen/payment-detail-reponse";

const ProcessTransactionError = BaseError.subclass("ProcessTransactionError");

export const TransactionProcessSchema = z.object({
  transactionProcess: z.object({
    data: z.object({
      paymentDetailsResponse: z.object({
        resultCode: z.enum(["Authorised", "Pending", "Refused", "Received"]),
        refusalReason: z.string().optional(),
      }),
    }),
    errors: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
        code: z.string(),
      }),
    ),
  }),
});

const processTransactionMutation = graphql(`
  mutation TransactionProcess($transactionId: ID!, $data: JSON) {
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
}) => {
  const { envUrl, transactionId, data } = props;
  const response = await ResultAsync.fromPromise(
    request(envUrl, processTransactionMutation, {
      transactionId,
      data,
    }),
    (error) =>
      new ProcessTransactionError("Failed to process transaction", {
        errors: [error],
      }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  const parsedResponse = TransactionProcessSchema.safeParse(response.value);

  if (parsedResponse.error) {
    return err(
      new ProcessTransactionError(
        "Failed to parse process transaction response",
        {
          errors: [parsedResponse.error],
        },
      ),
    );
  }

  if (parsedResponse.data.transactionProcess.errors.length > 0) {
    return err(
      new ProcessTransactionError("Failed to process transaction", {
        errors: parsedResponse.data.transactionProcess.errors,
      }),
    );
  }

  return ok(new AdyenPaymentDetailResponse(parsedResponse.data));
};
