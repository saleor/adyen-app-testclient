"use server";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const UpdateDeliveryMethodMutation = graphql(`
  mutation checkoutDeliveryMethodUpdate($checkoutId: ID!, $input: ID!) {
    checkoutDeliveryMethodUpdate(id: $checkoutId, deliveryMethodId: $input) {
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

export const updateDeliveryMethod = async ({
  envUrl,
  checkoutId,
  deliveryMethod,
}: {
  envUrl: string;
  checkoutId: string;
  deliveryMethod: string;
}) => {
  const data = await request(envUrl, UpdateDeliveryMethodMutation, {
    checkoutId,
    input: deliveryMethod,
  });

  revalidatePath(`/env/${encodeURIComponent(envUrl)}/checkout/${checkoutId}`);

  redirect(
    `/env/${encodeURIComponent(envUrl)}/checkout/${checkoutId}/payment-gateway`,
  );
};
