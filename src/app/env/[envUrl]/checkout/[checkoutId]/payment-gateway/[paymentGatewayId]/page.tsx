import { readFragment } from "gql.tada";

import { BaseError } from "@/lib/errors";
import {
  AdyenDropin,
  getCheckoutTotalPrice,
  initalizePaymentGateway,
  TotalPriceFragment,
} from "@/modules/dropin";

const PaymentGatewayError = BaseError.subclass("PaymentGatewayError");

export default async function PaymentGatewayPage({
  params: { envUrl, checkoutId, paymentGatewayId },
}: {
  params: { envUrl: string; checkoutId: string; paymentGatewayId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const decodedPaymentGatewayId = decodeURIComponent(paymentGatewayId);

  const checkoutTotalPriceDataResponse = await getCheckoutTotalPrice({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  if (checkoutTotalPriceDataResponse.type === "error") {
    // Sends the error to the error boundary
    throw new PaymentGatewayError(checkoutTotalPriceDataResponse.message);
  }

  const totalPrice = readFragment(
    TotalPriceFragment,
    checkoutTotalPriceDataResponse.value.checkout?.totalPrice,
  );

  const initalizePaymentGatewayDataResponse = await initalizePaymentGateway({
    envUrl: decodedEnvUrl,
    checkoutId,
    paymentGatewayId: decodedPaymentGatewayId,
    amount: totalPrice?.gross.amount ?? 0,
  });

  if (initalizePaymentGatewayDataResponse.type === "error") {
    // Sends the error to the error boundary
    throw new PaymentGatewayError(initalizePaymentGatewayDataResponse.message);
  }

  return (
    <AdyenDropin
      initalizePaymentGatewayData={initalizePaymentGatewayDataResponse.value}
      totalPriceData={checkoutTotalPriceDataResponse.value.checkout?.totalPrice}
      envUrl={decodedEnvUrl}
      checkoutId={checkoutId}
      paymentGatewayId={decodedPaymentGatewayId}
    />
  );
}
