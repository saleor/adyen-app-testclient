"use server";

import request from "graphql-request";
import { z } from "zod";

import { graphql } from "@/graphql/gql";
import { envUrlSchema } from "@/lib/env-url";
import { BaseError, UnknownError } from "@/lib/errors";
import { actionClient } from "@/lib/safe-action";

const initializeTransactionMutation = graphql(`
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
  stripeClientSecret: z.string(),
});

export const initializeTransaction = actionClient
  .schema(
    z.object({
      envUrl: envUrlSchema,
      checkoutId: z.string(),
      paymentGatewayId: z.string(),
      data: z.unknown(),
      amount: z.number(),
      idempotencyKey: z.string(),
    }),
  )
  .metadata({ actionName: "initializeTransaction" })
  .action(
    async ({
      parsedInput: {
        envUrl,
        checkoutId,
        paymentGatewayId,
        data,
        amount,
        idempotencyKey,
      },
    }) => {
      const response = await request(envUrl, initializeTransactionMutation, {
        checkoutId,
        data,
        amount,
        idempotencyKey,
        paymentGatewayId,
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
    },
  );
