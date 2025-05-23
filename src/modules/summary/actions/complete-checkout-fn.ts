import request from "graphql-request";

import { graphql } from "@/graphql/gql";
import { BaseError, UnknownError } from "@/lib/errors";

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

export const completeMutationFn = async (args: {
  envUrl: string;
  checkoutId: string;
}) => {
  const response = await request(args.envUrl, CompleteCheckoutMutation, {
    checkoutId: args.checkoutId,
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
};
