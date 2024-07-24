import { graphql } from "gql.tada";
import request from "graphql-request";

import { SelectPaymentMethod } from "@/components/sections/payment-gateway";

const GetPaymentGateways = graphql(`
  query GetPaymentGateways($checkoutId: ID!) {
    checkout(id: $checkoutId) {
      totalPrice {
        gross {
          amount
        }
      }
      availablePaymentGateways {
        id
        name
      }
    }
  }
`);

export default async function PaymentGatewayPage({
  params: { envUrl, checkoutId },
}: {
  params: { envUrl: string; checkoutId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const data = await request(decodedEnvUrl, GetPaymentGateways, {
    checkoutId,
  });

  return (
    <SelectPaymentMethod
      availablePaymentGateways={data.checkout?.availablePaymentGateways ?? []}
      envUrl={decodedEnvUrl}
      checkoutId={checkoutId}
      amount={data.checkout?.totalPrice?.gross?.amount ?? 0}
    />
  );
}
