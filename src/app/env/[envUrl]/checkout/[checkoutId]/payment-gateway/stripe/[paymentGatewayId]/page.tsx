"use client";
import { useQueries } from "@tanstack/react-query";
import { readFragment } from "gql.tada";

import { FullScreenLoader } from "@/components/full-screen-loader";
import { TotalPriceFragment } from "@/graphql/fragments";
import { BaseError } from "@/lib/errors";
import { getCheckoutTotalPriceOptions } from "@/modules/stripe/actions/get-checkout-total-price";
import { getInitializePaymentGatewayOptions } from "@/modules/stripe/actions/initialize-payment-gateway";
import { StripeCheckoutForm } from "@/modules/stripe/components/stripe-checkout-form";

export default function StripeDropinPage({
  params: { envUrl, checkoutId, paymentGatewayId },
}: {
  params: { envUrl: string; checkoutId: string; paymentGatewayId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const decodedPaymentGatewayId = decodeURIComponent(paymentGatewayId);

  const results = useQueries({
    queries: [
      getInitializePaymentGatewayOptions({
        envUrl: decodedEnvUrl,
        checkoutId,
        paymentGatewayId: decodedPaymentGatewayId,
      }),
      getCheckoutTotalPriceOptions({
        envUrl: decodedEnvUrl,
        checkoutId,
      }),
    ],
  });

  if (results.some((query) => query.isLoading)) {
    return <FullScreenLoader />;
  }

  const [{ data: initializedStripeData }, { data: total }] = results;

  const publishableKey = initializedStripeData?.data.stripePublishableKey;

  if (!publishableKey) {
    throw new BaseError("No publishable key returned from the server");
  }

  const totalPrice = readFragment(
    TotalPriceFragment,
    total?.checkout?.totalPrice,
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
