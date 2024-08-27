import { BaseError } from "@/lib/errors";
import {
  getPaymentGateways,
  PaymentGatewaySelect,
} from "@/modules/payment-gateway";

const PaymentGatewayError = BaseError.subclass("PaymentGatewayError");

export default async function PaymentGatewaysPage(props: {
  params: { envUrl: string; checkoutId: string };
}) {
  const { envUrl, checkoutId } = props.params;

  const decodedEnvUrl = decodeURIComponent(envUrl);

  const paymentGatewaysResponse = await getPaymentGateways({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  if (paymentGatewaysResponse.type === "error") {
    // Sends the error to the error boundary
    throw new PaymentGatewayError(paymentGatewaysResponse.message);
  }

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <PaymentGatewaySelect
        data={paymentGatewaysResponse.value.checkout?.availablePaymentGateways}
      />
    </main>
  );
}
