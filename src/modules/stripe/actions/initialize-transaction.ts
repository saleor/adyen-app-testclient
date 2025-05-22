import request from "graphql-request";
import { z } from "zod";

import { graphql } from "@/graphql/gql";
import { BaseError, UnknownError } from "@/lib/errors";

const InitializeTransactionMutation = graphql(`
  mutation InitializeTransaction(
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

const InitializeTransactionError = BaseError.subclass(
  "InitializeTransactionError",
);

const saleorDataSchema = z.object({
  paymentIntent: z.object({
    stripeClientSecret: z.string().optional(),
    errors: z
      .array(
        z.object({
          code: z.string(),
          message: z.string(),
        }),
      )
      .optional(),
  }),
});

export const getInitializeTransactionMutationFn = async (args: {
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
  data: any;
  amount: number;
  idempotencyKey: string;
}) => {
  const response = await request(args.envUrl, InitializeTransactionMutation, {
    checkoutId: args.checkoutId,
    data: args.data,
    amount: args.amount,
    idempotencyKey: args.idempotencyKey,
    paymentGatewayId: args.paymentGatewayId,
  }).catch((error) => {
    throw BaseError.normalize(error, UnknownError);
  });

  if (!response.transactionInitialize) {
    throw new InitializeTransactionError(
      "No response from initializeTransaction mutation.",
    );
  }

  if (response.transactionInitialize.errors.length > 0) {
    throw new InitializeTransactionError(
      "Errors in initializeTransaction mutation.",
      {
        errors: response.transactionInitialize.errors.map((e) =>
          InitializeTransactionError.normalize(e),
        ),
      },
    );
  }

  const parsedSaleorDataResult = saleorDataSchema.safeParse(
    response.transactionInitialize.data,
  );

  if (!parsedSaleorDataResult.success) {
    throw new InitializeTransactionError(
      "Failed to parse Saleor data from initializeTransaction mutation.",
      {
        errors: parsedSaleorDataResult.error.errors,
      },
    );
  }

  return {
    ...response.transactionInitialize,
    data: parsedSaleorDataResult.data,
  };
};
