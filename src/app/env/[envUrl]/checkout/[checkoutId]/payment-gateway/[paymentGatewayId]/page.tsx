import { graphql } from "gql.tada";
import request from "graphql-request";

import { AdyenDropin } from "@/components/sections/dropin";

const GetCheckoutTotalPriceQuery = graphql(`
  query GetCheckoutTotalPrice($checkoutId: ID!) {
    checkout(id: $checkoutId) {
      totalPrice {
        gross {
          amount
          currency
        }
      }
    }
  }
`);

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

export default async function PaymentGatewayPage({
  params: { envUrl, checkoutId, paymentGatewayId },
}: {
  params: { envUrl: string; checkoutId: string; paymentGatewayId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const decodedPaymentGatewayId = decodeURIComponent(paymentGatewayId);

  const data = await request(decodedEnvUrl, GetCheckoutTotalPriceQuery, {
    checkoutId,
  });

  const additionalData = await request(
    decodedEnvUrl,
    InitalizePaymentGatewayMutation,
    {
      checkoutId,
      paymentGatewayId: decodedPaymentGatewayId,
      amount: data.checkout?.totalPrice?.gross?.amount ?? 0,
    },
  );

  console.log(JSON.stringify(additionalData, null, 2));

  const paymentData =
    additionalData.paymentGatewayInitialize?.gatewayConfigs?.[0]?.data;

  return (
    <AdyenDropin
      // @ts-expect-error - type this
      paymentMethodsResponse={paymentData.paymentMethodsResponse}
      // @ts-expect-error
      clientKey={paymentData.clientKey}
      // @ts-expect-error
      totalPrice={data.checkout?.totalPrice?.gross}
      envUrl={decodedEnvUrl}
      checkoutId={checkoutId}
      appId={paymentGatewayId}
    />
  );
}
