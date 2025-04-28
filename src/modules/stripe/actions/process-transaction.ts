"use server";

import request from "graphql-request";
import { z } from "zod";

import { graphql } from "@/graphql/gql";
import { envUrlSchema } from "@/lib/env-url";
import { BaseError, UnknownError } from "@/lib/errors";
import { actionClient } from "@/lib/safe-action";

const processTransactionMutation = graphql(`
  mutation ProcessTransaction($transactionId: ID!, $data: JSON) {
    transactionProcess(id: $transactionId, data: $data) {
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

const ProcessTransactionError = BaseError.subclass("ProcessTransactionError");

const saleorDataSchema = z
  .object({
    paymentIntent: z.object({
      errors: z
        .array(
          z.object({
            code: z.string(),
            message: z.string(),
          }),
        )
        .optional(),
    }),
  })
  .nullable();

export const processTransaction = actionClient
  .schema(
    z.object({
      envUrl: envUrlSchema,
      data: z.unknown(),
      transactionId: z.string(),
    }),
  )
  .metadata({ actionName: "processTransaction" })
  .action(async ({ parsedInput: { envUrl, transactionId, data } }) => {
    const response = await request(envUrl, processTransactionMutation, {
      transactionId,
      data,
    }).catch((error) => {
      throw BaseError.normalize(error, UnknownError);
    });

    if (!response.transactionProcess) {
      throw new ProcessTransactionError(
        "No response from processTransaction mutation.",
      );
    }

    if (response.transactionProcess.errors.length > 0) {
      throw new ProcessTransactionError(
        "Errors in processTransaction mutation.",
        {
          errors: response.transactionProcess.errors.map((e) =>
            ProcessTransactionError.normalize(e),
          ),
        },
      );
    }

    const parsedSaleorDataResult = saleorDataSchema.safeParse(
      response.transactionProcess.data,
    );

    if (!parsedSaleorDataResult.success) {
      throw new ProcessTransactionError(
        "Failed to parse Saleor data from processSession mutation.",
        {
          errors: parsedSaleorDataResult.error.errors,
        },
      );
    }

    return {
      ...response.transactionProcess,
      data: parsedSaleorDataResult.data,
    };
  });
