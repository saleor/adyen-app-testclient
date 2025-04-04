import { initializePaymentGateway } from "@/modules/stripe/actions/initalize-payment-gateway";

export default async function StripeDropinPage({
  params: { envUrl, checkoutId, paymentGatewayId },
}: {
  params: { envUrl: string; checkoutId: string; paymentGatewayId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const decodedPaymentGatewayId = decodeURIComponent(paymentGatewayId);

  const initializedStripeData = await initializePaymentGateway({
    checkoutId,
    envUrl: decodedEnvUrl,
    paymentGatewayId: decodedPaymentGatewayId,
  });

  // @ts-ignore
  const publishableKey = initializedStripeData?.data.publishableKey as string;

  return <div>{publishableKey}</div>;
}
