"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { EnvironmentConfigSchemaType } from "./environment";

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

export const createCheckout = async (
  inputData: EnvironmentConfigSchemaType,
  variantId: string,
) => {
  const data = await request(inputData.url, CreateCheckoutMutation, {
    input: {
      channel: inputData.channelSlug,
      lines: [
        {
          variantId,
          quantity: 1,
        },
      ],
    },
  });
  console.log(data);
  revalidatePath("/");
  redirect(
    `/env/${encodeURIComponent(inputData.url)}/checkout/${data.checkoutCreate?.checkout?.id}`,
  );
};
