"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { err } from "neverthrow";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { BaseError } from "@/lib/errors";
import { createRedirectUrl } from "@/lib/utils";
import { ResultAsync } from "neverthrow";

const CreateCheckoutError = BaseError.subclass("CreateCheckoutError");

const CreateCheckoutSchema = z.object({
  checkoutCreate: z.object({
    checkout: z.object({
      id: z.string(),
    }),
    errors: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    ),
  }),
});

const CreateCheckoutMutation = graphql(`
  mutation createCheckout($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
      }
      errors {
        field
        message
      }
    }
  }
`);

export const createCheckout = async ({
  envUrl,
  channelSlug,
  variantId,
}: {
  envUrl: string;
  channelSlug: string;
  variantId: string;
}) => {
  const response = await ResultAsync.fromPromise(
    request(envUrl, CreateCheckoutMutation, {
      input: {
        channel: channelSlug,
        email: "adyen-testclient@saleor.io",
        lines: [
          {
            variantId,
            quantity: 1,
          },
        ],
      },
    }),
    (error) =>
      new CreateCheckoutError("Failed to create checkout", { errors: [error] }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  const parsedResponse = CreateCheckoutSchema.safeParse(response.value);

  if (parsedResponse.error) {
    return err(
      new CreateCheckoutError("Failed to parse checkout response", {
        errors: [parsedResponse.error],
      }),
    );
  }

  if (parsedResponse.data.checkoutCreate.errors.length > 0) {
    return err(
      new CreateCheckoutError("Failed to create checkout", {
        errors: parsedResponse.data.checkoutCreate.errors,
      }),
    );
  }

  revalidatePath("/");
  redirect(
    createRedirectUrl(
      "env",
      encodeURIComponent(envUrl),
      "checkout",
      parsedResponse.data.checkoutCreate.checkout.id,
    ),
    // `/env/${encodeURIComponent(envUrl)}/checkout/${data.checkoutCreate?.checkout?.id}`,
  );
};
