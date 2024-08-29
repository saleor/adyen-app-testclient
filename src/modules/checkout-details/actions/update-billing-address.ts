"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createLogger } from "@/lib/logger";
import { createPath } from "@/lib/utils";

import { BillingAddressSchemaType } from "../components/billing";

const logger = createLogger("updateBillingAddress");

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
}): Promise<
  | { type: "error"; name: string; message: string }
  | {
      type: "success";
      value: z.infer<typeof UpdateBillingAddressSchema>;
    }
> => {
  const { envUrl, checkoutId, billingAddress } = props;

  try {
    const response = await request(envUrl, UpdateBillingAddressMutation, {
      checkoutId,
      input: billingAddress,
    });
    const parsedResponse = UpdateBillingAddressSchema.safeParse(response);

    if (parsedResponse.error) {
      logger.error("Failed to parse updateBillingAddress response", {
        error: parsedResponse.error,
      });
      return {
        type: "error",
        name: "ParsingUpdateBillingAddressError",
        message: parsedResponse.error.message,
      };
    }

    if (parsedResponse.data.checkoutBillingAddressUpdate.errors.length > 0) {
      logger.error("Failed to update billing address of checkout", {
        errors: parsedResponse.data.checkoutBillingAddressUpdate.errors,
      });
      return {
        type: "error",
        name: "UpdateBillingAddressError",
        message:
          "Failed to update billing address - errors in updateBillingAddress mutation",
      };
    }

    revalidatePath(
      createPath("env", encodeURIComponent(envUrl), "checkout", checkoutId),
    );

    return { type: "success", value: parsedResponse.data };
  } catch (error) {
    logger.error("Failed to update billing address", { error });
    return {
      type: "error",
      name: "UpdateBillingAddressError",
      message: "Failed to update billing address",
    };
  }
};
