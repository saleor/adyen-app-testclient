"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { revalidatePath } from "next/cache";

import { ShippingConfigSchemaType } from "./shipping";

const UpdateShippingAddressMutation = graphql(`
  mutation updateBillingAddress($checkoutId: ID!, $input: AddressInput!) {
    checkoutShippingAddressUpdate(
      checkoutId: $checkoutId
      shippingAddress: $input
    ) {
      checkout {
        id
        shippingAddress {
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
        shippingMethods {
          id
          name
          price {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`);

export const updateShippingAddress = async ({
  envUrl,
  checkoutId,
  shippingAddress,
}: {
  envUrl: string;
  checkoutId: string;
  shippingAddress: ShippingConfigSchemaType;
}) => {
  const data = await request(envUrl, UpdateShippingAddressMutation, {
    checkoutId,
    input: shippingAddress,
  });

  revalidatePath(`/env/${encodeURIComponent(envUrl)}/checkout/${checkoutId}`);

  return data;
};
