"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createLogger } from "@/lib/logger";
import { createPath } from "@/lib/utils";

import { ShippingAddressSchemaType } from "../components/shipping";

const logger = createLogger("updateShippingAddress");

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
  mutation updateShippingAddress($checkoutId: ID!, $input: AddressInput!) {
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
}): Promise<
  | { type: "error"; name: string; message: string }
  | {
      type: "success";
      value: z.infer<typeof UpdateShippingAddressSchema>;
    }
> => {
  const { envUrl, checkoutId, shippingAddress } = props;

  try {
    const response = await request(envUrl, UpdateShippingAddressMutation, {
      checkoutId,
      input: shippingAddress,
    });

    const parsedResponse = UpdateShippingAddressSchema.safeParse(response);

    if (parsedResponse.error) {
      logger.error("Failed to parse updateShippingAddress response", {
        error: parsedResponse.error,
      });
      return {
        type: "error",
        name: "ParsingUpdateShippingAddressError",
        message: parsedResponse.error.message,
      };
    }

    if (parsedResponse.data.checkoutShippingAddressUpdate.errors.length > 0) {
      logger.error("Failed to update shipping address of checkout", {
        errors: parsedResponse.data.checkoutShippingAddressUpdate.errors,
      });

      return {
        type: "error",
        name: "UpdateShippingAddressError",
        message:
          "Failed to update billing address - errors in updateShippingAddress mutation",
      };
    }

    revalidatePath(
      createPath("env", encodeURIComponent(envUrl), "checkout", checkoutId),
    );

    return {
      type: "success",
      value: parsedResponse.data,
    };
  } catch (error) {
    logger.error("Failed to update shipping address", { error });
    return {
      type: "error",
      name: "UpdateShippingAddressError",
      message: "Failed to update shipping address",
    };
  }
};
