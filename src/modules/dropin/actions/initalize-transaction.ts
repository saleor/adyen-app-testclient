import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";
import { z } from "zod";

import { BaseError } from "@/lib/errors";

const InitalizeTransactionError = BaseError.subclass(
  "InitalizeTransactionError",
);

const InitalizeTransactionSchema = z.object({
  transactionInitialize: z.object({
    transaction: z.object({
      id: z.string(),
    }),
    data: z.object({
      paymentResponse: z.object({
        action: z.string().optional(),
        resultCode: z.enum(["Authorised", "Pending", "Refused", "Received"]),
        order: z
          .object({
            remainingAmount: z.object({
              value: z.number(),
            }),
          })
          .optional(),
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

  console.log(JSON.stringify(parsedResponse.data, null, 2));

  return ok(parsedResponse.data);
};
