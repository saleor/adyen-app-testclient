"use server";

import { graphql } from "gql.tada";
import request from "graphql-request";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const InitalizePaymentGatewayMutation = graphql(`
  mutation InitalizePaymentGateway(
    $checkoutId: ID!
    $paymentGatewayId: String!
    $amount: PositiveDecimal!
  ) {
    paymentGatewayInitialize(
      id: $checkoutId
      paymentGateways: [{ id: $paymentGatewayId }]
      amount: $amount
    ) {
      gatewayConfigs {
        id
        data
        errors {
          field
          message
          code
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`);

export const InitalizePaymentGateway = async ({
  envUrl,
  checkoutId,
  paymentGatewayId,
  amount,
}: {
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
  amount: number;
}) => {
  const data = await request(envUrl, InitalizePaymentGatewayMutation, {
    checkoutId,
    paymentGatewayId,
    amount,
  });

  // TODO: move to components
  revalidatePath(
    `/env/${encodeURIComponent(envUrl)}/checkout/${checkoutId}/payment-gateway`,
  );

  redirect(
    `/env/${encodeURIComponent(envUrl)}/checkout/${checkoutId}/payment-gateway/${encodeURIComponent(data.paymentGatewayInitialize?.gatewayConfigs?.[0]?.id ?? "")}`,
  );
};
