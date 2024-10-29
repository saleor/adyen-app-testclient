import { BaseError } from "@/lib/errors";
import { getPaymentGateways } from "@/modules/payment-gateway/actions/get-payment-gateways";
import { PaymentGatewaySelect } from "@/modules/payment-gateway/components/payment-gateway-select";

const PaymentGatewaysError = BaseError.subclass("PaymentGatewaysError");

export default async function PaymentGatewaysPage(props: {
  params: { envUrl: string; checkoutId: string };
}) {
  const { envUrl, checkoutId } = props.params;

  const decodedEnvUrl = decodeURIComponent(envUrl);

  const paymentGatewaysResponse = await getPaymentGateways({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  if (paymentGatewaysResponse?.serverError) {
    // Sends the error to the error boundary
    throw new PaymentGatewaysError(
      paymentGatewaysResponse?.serverError.message,
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <PaymentGatewaySelect
        data={paymentGatewaysResponse?.data?.checkout?.availablePaymentGateways}
      />
    </main>
  );
}
