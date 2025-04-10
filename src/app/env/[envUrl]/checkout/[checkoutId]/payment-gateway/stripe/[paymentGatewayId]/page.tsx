import { TotalPriceFragment } from "@/graphql/fragments";
import { readFragment } from "@/graphql/gql";
import { BaseError } from "@/lib/errors";
import { getCheckoutTotalPrice } from "@/modules/stripe/actions/get-checkout-total-price";
import { initializePaymentGateway } from "@/modules/stripe/actions/initialize-payment-gateway";
import { StripeCheckoutForm } from "@/modules/stripe/components/stripe-checkout-form";

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

  if (!initializedStripeData?.data) {
    throw new BaseError("No data returned from the server");
  }

  const publishableKey = initializedStripeData?.data?.data.stripePublishableKey;

  if (!publishableKey) {
    throw new BaseError("No publishable key returned from the server");
  }

  const total = await getCheckoutTotalPrice({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  const totalPrice = readFragment(
    TotalPriceFragment,
    total?.data?.checkout?.totalPrice,
  );

  if (!totalPrice?.gross.amount) {
    throw new BaseError("Amount empty");
  }

  return (
    <div className="m-auto my-10 max-w-lg">
      <StripeCheckoutForm
        pk={publishableKey}
        totalPrice={totalPrice}
        currency={totalPrice?.gross.currency.toLowerCase()}
        checkoutId={checkoutId}
        envUrl={decodedEnvUrl}
        paymentGatewayId={decodedPaymentGatewayId}
      />
    </div>
  );
}
