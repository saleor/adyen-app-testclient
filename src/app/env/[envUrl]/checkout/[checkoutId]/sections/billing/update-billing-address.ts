"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { revalidatePath } from "next/cache";
import { BillingConfigSchemaType } from "./billing";

const UpdateBillingAddressMutation = graphql(`
  mutation updateBillingAddress($checkoutId: ID!, $input: AddressInput!) {
    checkoutBillingAddressUpdate(
      checkoutId: $checkoutId
      billingAddress: $input
    ) {
      checkout {
        id
        billingAddress {
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          postalCode
          country {
            code
          }
          countryArea
          phone
        }
      }
      errors {
        field
        message
      }
    }
  }
`);

export const updateBillingAddress = async ({
  envUrl,
  checkoutId,
  billingAddress,
}: {
  envUrl: string;
  checkoutId: string;
  billingAddress: BillingConfigSchemaType;
}) => {
  const data = await request(envUrl, UpdateBillingAddressMutation, {
    checkoutId,
    input: billingAddress,
  });

  revalidatePath(`/env/${encodeURIComponent(envUrl)}/checkout/${checkoutId}`);

  return data;
};
