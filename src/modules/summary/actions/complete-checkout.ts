"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { z } from "zod";

import { envUrlSchema } from "@/lib/env-url";
import { BaseError, UnknownError } from "@/lib/errors";
import { actionClient } from "@/lib/safe-action";

const CompleteCheckoutMutation = graphql(`
  mutation CompleteCheckout($checkoutId: ID!) {
    checkoutComplete(id: $checkoutId) {
      order {
        id
      }
      errors {
        field
        message
        code
      }
    }
  }
`);

const CreateCheckoutMutationError = BaseError.subclass(
  "CreateCheckoutMutationError",
);

export const completeCheckout = actionClient
  .schema(
    z.object({
      envUrl: envUrlSchema,
      checkoutId: z.string(),
    }),
  )
  .metadata({ actionName: "completeCheckout" })
  .action(async ({ parsedInput: { envUrl, checkoutId } }) => {
    const response = await request(envUrl, CompleteCheckoutMutation, {
      checkoutId,
    }).catch((error) => {
      throw BaseError.normalize(error, UnknownError);
    });

    if ((response.checkoutComplete?.errors ?? []).length > 0) {
      throw new CreateCheckoutMutationError(
        "Failed to create checkout - errors in completeCheckout mutation.",
        {
          errors: response.checkoutComplete?.errors.map((e) =>
            CreateCheckoutMutationError.normalize(e),
          ),
        },
      );
    }

    return response;
  });
