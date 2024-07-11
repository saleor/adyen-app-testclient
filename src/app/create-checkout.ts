"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { revalidatePath } from "next/cache";
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
  revalidatePath("/");
  return data;
};
