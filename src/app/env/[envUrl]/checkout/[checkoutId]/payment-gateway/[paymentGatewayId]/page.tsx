import { readFragment } from "gql.tada";

import {
  AdyenDropin,
  getCheckoutTotalPrice,
  initalizePaymentGateway,
} from "@/modules/dropin";
import { TotalPriceFragment } from "@/modules/dropin/fragments";

export default async function PaymentGatewayPage({
  params: { envUrl, checkoutId, paymentGatewayId },
}: {
  params: { envUrl: string; checkoutId: string; paymentGatewayId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const decodedPaymentGatewayId = decodeURIComponent(paymentGatewayId);

  const checkoutTotalPriceData = await getCheckoutTotalPrice({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  if (checkoutTotalPriceData.isErr()) {
    // Sends the error to the error boundary
    throw checkoutTotalPriceData.error;
  }

  const totalPrice = readFragment(
    TotalPriceFragment,
    checkoutTotalPriceData.value.checkout?.totalPrice,
  );

  const initalizePaymentGatewayData = await initalizePaymentGateway({
    envUrl: decodedEnvUrl,
    checkoutId,
    paymentGatewayId: decodedPaymentGatewayId,
    amount: totalPrice?.gross.amount ?? 0,
  });

  if (initalizePaymentGatewayData.isErr()) {
    // Sends the error to the error boundary
    throw initalizePaymentGatewayData.error;
  }

  return (
    <AdyenDropin
      initalizePaymentGatewayData={initalizePaymentGatewayData.value}
      totalPriceData={checkoutTotalPriceData.value.checkout?.totalPrice}
      envUrl={decodedEnvUrl}
      checkoutId={checkoutId}
      paymentGatewayId={decodedPaymentGatewayId}
    />
  );
}
