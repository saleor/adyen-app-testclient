import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";
import { z } from "zod";

import { BaseError } from "@/lib/errors";

import { AdyenPaymentResponse } from "../adyen/payment-response";

const InitalizeTransactionError = BaseError.subclass(
  "InitalizeTransactionError",
);

export const InitalizeTransactionSchema = z.object({
  transactionInitialize: z.object({
    transaction: z.object({
      id: z.string(),
    }),
    data: z.object({
      paymentResponse: z.object({
        action: z
          .object({
            paymentMethodType: z.string(),
            paymentData: z.string(),
            url: z.string().optional(),
            type: z.string(),
            qrCodeData: z.string().optional(),
            sdkData: z
              .object({
                token: z.string(),
              })
              .optional(),
          })
          .optional(),
        resultCode: z.enum(["Authorised", "Pending", "Refused", "Received"]),
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
}) => {
  const { envUrl, checkoutId, paymentGatewayId, data, amount, idempotencyKey } =
    props;
  const response = await ResultAsync.fromPromise(
    request(envUrl, initalizeTransactionMutation, {
      checkoutId,
      data,
      amount,
      idempotencyKey,
      paymentGatewayId,
    }),
    (error) =>
      new InitalizeTransactionError("Failed to initalize transaction", {
        errors: [error],
      }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  const parsedResponse = InitalizeTransactionSchema.safeParse(response.value);

  if (parsedResponse.error) {
    return err(
      new InitalizeTransactionError(
        "Failed to parse initalize transaction response",
        {
          errors: [parsedResponse.error],
        },
      ),
    );
  }

  if (parsedResponse.data.transactionInitialize.errors.length > 0) {
    return err(
      new InitalizeTransactionError("Failed to initalize transaction", {
        errors: parsedResponse.data.transactionInitialize.errors,
      }),
    );
  }

  return ok(new AdyenPaymentResponse(parsedResponse.data));
};
