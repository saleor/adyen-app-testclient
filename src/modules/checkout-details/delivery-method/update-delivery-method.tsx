"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ResultAsync } from "neverthrow";
import { redirect } from "next/navigation";
import { z } from "zod";

import { BaseError } from "@/lib/errors";
import { createPath } from "@/lib/utils";

const UpdateDeliveryMethodError = BaseError.subclass(
  "UpdateDeliveryMethodError",
);

const UpdateDeliveryMethodSchema = z.object({
  checkoutDeliveryMethodUpdate: z.object({
    errors: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    ),
  }),
});

const UpdateDeliveryMethodMutation = graphql(`
  mutation checkoutDeliveryMethodUpdate($checkoutId: ID!, $input: ID!) {
    checkoutDeliveryMethodUpdate(id: $checkoutId, deliveryMethodId: $input) {
      errors {
        field
        message
      }
    }
  }
`);

export const updateDeliveryMethod = async (props: {
  envUrl: string;
  checkoutId: string;
  deliveryMethod: string;
}) => {
  const { envUrl, checkoutId, deliveryMethod } = props;

  const response = await ResultAsync.fromPromise(
    request(envUrl, UpdateDeliveryMethodMutation, {
      checkoutId,
      input: deliveryMethod,
    }),
    (error) =>
      new UpdateDeliveryMethodError("Failed to update delivery method", {
        errors: [error],
      }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  const parsedResponse = UpdateDeliveryMethodSchema.safeParse(response.value);

  if (parsedResponse.error) {
    return err(
      new UpdateDeliveryMethodError("Failed to parse checkout response", {
        errors: [parsedResponse.error],
      }),
    );
  }

  if (parsedResponse.data.checkoutDeliveryMethodUpdate.errors.length > 0) {
    return err(
      new UpdateDeliveryMethodError("Failed to update delivery method", {
        errors: parsedResponse.data.checkoutDeliveryMethodUpdate.errors,
      }),
    );
  }

  // revalidatePath(`/env/${encodeURIComponent(envUrl)}/checkout/${checkoutId}`);

  redirect(
    createPath(
      "env",
      encodeURIComponent(envUrl),
      "checkout",
      checkoutId,
      "payment-gateway",
    ),
  );
};
