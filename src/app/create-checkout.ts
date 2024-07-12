"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EnvironmentConfigSchemaType } from "./components/environment";

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
) => {
  const data = await request(inputData.url, CreateCheckoutMutation, {
    input: {
      channel: inputData.channelSlug,
      lines: [],
    },
  });
  console.log(data);
  revalidatePath("/");
  redirect(
    `/env/${encodeURIComponent(inputData.url)}/checkout/${data.checkoutCreate?.checkout?.id}`,
  );
};
