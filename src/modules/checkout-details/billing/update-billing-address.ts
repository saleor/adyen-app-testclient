"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ResultAsync } from "neverthrow";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { BaseError } from "@/lib/errors";
import { createPath } from "@/lib/utils";

import { BillingAddressSchemaType } from "./billing";

const UpdateBillingAddressError = BaseError.subclass(
  "UpdateBillingAddressError",
);

const UpdateBillingAddressSchema = z.object({
  checkoutBillingAddressUpdate: z.object({
    errors: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    ),
  }),
});

const UpdateBillingAddressMutation = graphql(`
  mutation updateBillingAddress($checkoutId: ID!, $input: AddressInput!) {
    checkoutBillingAddressUpdate(
      checkoutId: $checkoutId
      billingAddress: $input
    ) {
      errors {
        field
        message
      }
    }
  }
`);

export const updateBillingAddress = async (props: {
  envUrl: string;
  checkoutId: string;
  billingAddress: BillingAddressSchemaType;
}) => {
  const { envUrl, checkoutId, billingAddress } = props;
  const response = await ResultAsync.fromPromise(
    request(envUrl, UpdateBillingAddressMutation, {
      checkoutId,
      input: billingAddress,
    }),
    (error) =>
      new UpdateBillingAddressError("Failed to update billing address", {
        errors: [error],
      }),
  );
  if (response.isErr()) {
    return err(response.error);
  }

  const parsedResponse = UpdateBillingAddressSchema.safeParse(response.value);

  if (parsedResponse.error) {
    return err(
      new UpdateBillingAddressError("Failed to parse checkout response", {
        errors: [parsedResponse.error],
      }),
    );
  }

  if (parsedResponse.data.checkoutBillingAddressUpdate.errors.length > 0) {
    return err(
      new UpdateBillingAddressError("Failed to create checkout", {
        errors: parsedResponse.data.checkoutBillingAddressUpdate.errors,
      }),
    );
  }

  revalidatePath(
    createPath("env", encodeURIComponent(envUrl), "checkout", checkoutId),
  );
};
