import { readFragment } from "gql.tada";

import { BaseError } from "@/lib/errors";
import { getCheckoutTotalPrice } from "@/modules/dropin/actions/get-checkout-total-price";
import { initalizePaymentGateway } from "@/modules/dropin/actions/initalize-payment-gateway";
import { AdyenDropin } from "@/modules/dropin/components/adyen-dropin";
import { TotalPriceFragment } from "@/modules/dropin/fragments";

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

  if (checkoutTotalPriceDataResponse?.serverError) {
    // Sends the error to the error boundary
    throw new PaymentGatewayError(
      checkoutTotalPriceDataResponse.serverError.message,
    );
  }

  const totalPrice = readFragment(
    TotalPriceFragment,
    checkoutTotalPriceDataResponse?.data?.checkout?.totalPrice,
  );

  const initalizePaymentGatewayDataResponse = await initalizePaymentGateway({
    envUrl: decodedEnvUrl,
    checkoutId,
    paymentGatewayId: decodedPaymentGatewayId,
    amount: totalPrice?.gross.amount,
  });

  if (initalizePaymentGatewayDataResponse?.serverError) {
    // Sends the error to the error boundary
    throw new PaymentGatewayError(
      initalizePaymentGatewayDataResponse.serverError.message,
    );
  }

  if (!initalizePaymentGatewayDataResponse?.data) {
    // Sends the error to the error boundary
    throw new PaymentGatewayError("No data returned from the server");
  }

  return (
    <AdyenDropin
      initalizePaymentGatewayData={initalizePaymentGatewayDataResponse?.data}
      totalPriceData={
        checkoutTotalPriceDataResponse?.data?.checkout?.totalPrice
      }
      envUrl={decodedEnvUrl}
      checkoutId={checkoutId}
      paymentGatewayId={decodedPaymentGatewayId}
    />
  );
}
