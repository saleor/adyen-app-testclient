import { TotalPriceFragment } from "@/graphql/fragments";
import { readFragment } from "@/graphql/gql";
import { getCheckoutTotalPrice } from "@/modules/stripe/actions/get-checkout-total-price";
import { initializePaymentGateway } from "@/modules/stripe/actions/initalize-payment-gateway";
import { StripeDropinWrapper } from "@/modules/stripe/components/stripe-dropin";

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

  const total = await getCheckoutTotalPrice({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  // @ts-ignore
  const publishableKey = initializedStripeData?.data
    .stripePublishableKey as string;

  const totalPrice = readFragment(
    TotalPriceFragment,
    total?.data?.checkout?.totalPrice,
  );

  if (!totalPrice?.gross.amount) {
    throw new Error("Amount empty");
  }

  const amountInCents = totalPrice?.gross.amount * 100;

  return (
    <div className="m-auto my-10 max-w-lg">
      <StripeDropinWrapper
        pk={publishableKey}
        amount={amountInCents}
        currency={totalPrice?.gross.currency.toLowerCase()}
      />
    </div>
  );
}
