"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ResultAsync } from "neverthrow";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { BaseError } from "@/lib/errors";
import { createPath } from "@/lib/utils";

import { ShippingAddressSchemaType } from "./shipping";

const UpdateShippingAddressError = BaseError.subclass(
  "UpdateShippingAddressError",
);

const UpdateShippingAddressSchema = z.object({
  checkoutShippingAddressUpdate: z.object({
    errors: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    ),
  }),
});

const UpdateShippingAddressMutation = graphql(`
  mutation updateBillingAddress($checkoutId: ID!, $input: AddressInput!) {
    checkoutShippingAddressUpdate(
      checkoutId: $checkoutId
      shippingAddress: $input
    ) {
      errors {
        field
        message
      }
    }
  }
`);

export const updateShippingAddress = async (props: {
  envUrl: string;
  checkoutId: string;
  shippingAddress: ShippingAddressSchemaType;
}) => {
  const { envUrl, checkoutId, shippingAddress } = props;

  const response = await ResultAsync.fromPromise(
    request(envUrl, UpdateShippingAddressMutation, {
      checkoutId,
      input: shippingAddress,
    }),
    (error) =>
      new UpdateShippingAddressError("Failed to update shipping address", {
        errors: [error],
      }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  const parsedResponse = UpdateShippingAddressSchema.safeParse(response.value);

  if (parsedResponse.error) {
    return err(
      new UpdateShippingAddressError("Failed to parse checkout response", {
        errors: [parsedResponse.error],
      }),
    );
  }

  if (parsedResponse.data.checkoutShippingAddressUpdate.errors.length > 0) {
    return err(
      new UpdateShippingAddressError("Failed to create checkout", {
        errors: parsedResponse.data.checkoutShippingAddressUpdate.errors,
      }),
    );
  }

  revalidatePath(
    createPath("env", encodeURIComponent(envUrl), "checkout", checkoutId),
  );
};
