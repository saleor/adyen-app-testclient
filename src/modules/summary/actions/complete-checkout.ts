import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";

import { BaseError } from "@/lib/errors";

const CompleteCheckoutError = BaseError.subclass("CompleteCheckoutError");

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

export const completeCheckout = async (props: {
  envUrl: string;
  checkoutId: string;
}) => {
  const { envUrl, checkoutId } = props;
  const response = await ResultAsync.fromPromise(
    request(envUrl, CompleteCheckoutMutation, {
      checkoutId,
    }),
    (error) => {
      return new CompleteCheckoutError("Failed to complete checkout", {
        errors: [error],
      });
    },
  );

  if (response.isErr()) {
    return err(response.error);
  }

  if ((response.value.checkoutComplete?.errors ?? []).length > 0) {
    return err(
      new CompleteCheckoutError("Failed to complete checkout", {
        errors: response.value.checkoutComplete?.errors,
      }),
    );
  }

  return ok(response.value.checkoutComplete);
};
