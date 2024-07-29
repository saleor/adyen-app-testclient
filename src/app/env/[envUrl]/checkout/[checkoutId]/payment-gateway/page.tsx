import {
  getPaymentGateways,
  SelectPaymentMethod,
} from "@/modules/payment-gateway";

export default async function PaymentGatewaysPage(props: {
  params: { envUrl: string; checkoutId: string };
}) {
  const { envUrl, checkoutId } = props.params;

  const decodedEnvUrl = decodeURIComponent(envUrl);

  const paymentGatewaysData = await getPaymentGateways({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  if (paymentGatewaysData.isErr()) {
    // Sends the error to the error boundary
    throw paymentGatewaysData.error;
  }

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <SelectPaymentMethod
        data={paymentGatewaysData.value.checkout?.availablePaymentGateways}
      />
    </main>
  );
}
