"use client";
import { useQueries } from "@tanstack/react-query";
import Link from "next/link";

import { FullScreenLoader } from "@/components/full-screen-loader";
import { readFragment } from "@/graphql/gql";
import { BaseError } from "@/lib/errors";
import { getInitializePaymentGatewayOptions } from "@/modules/stripe/actions/initialize-payment-gateway";
import { StripePaymentStatus } from "@/modules/stripe/components/stripe-payment-status";
import { getCheckoutSummaryOptions } from "@/modules/summary/actions/get-checkout-summary-fn";
import { Summary } from "@/modules/summary/components/summary";
import { CheckoutFragment } from "@/modules/summary/fragments";

const CheckoutSummaryPageError = BaseError.subclass("CheckoutSummaryPageError");

export default function CheckoutSummaryPage({
  params: { envUrl, checkoutId, paymentGatewayId },
}: {
  params: { envUrl: string; checkoutId: string; paymentGatewayId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const decodedPaymentGatewayId = decodeURIComponent(paymentGatewayId);

  const results = useQueries({
    queries: [
      getCheckoutSummaryOptions({
        envUrl: decodedEnvUrl,
        checkoutId,
      }),
      getInitializePaymentGatewayOptions({
        envUrl: decodedEnvUrl,
        checkoutId,
        paymentGatewayId: decodedPaymentGatewayId,
      }),
    ],
  });

  if (results.some((query) => query.isLoading)) {
    return <FullScreenLoader />;
  }

  const [
    { data: checkoutSummaryDataResponse },
    { data: initializedStripeData },
  ] = results;

  if (!checkoutSummaryDataResponse) {
    throw new CheckoutSummaryPageError("No checkout data found");
  }

  const checkout = readFragment(
    CheckoutFragment,
    checkoutSummaryDataResponse.checkout,
  );

  if (!initializedStripeData) {
    throw new BaseError("No data returned from the server");
  }

  const publishableKey = initializedStripeData.data.stripePublishableKey;

  if (!publishableKey) {
    throw new BaseError("No publishable key returned from the server");
  }

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      {checkout?.id ? (
        <div className="flex flex-col gap-6">
          <StripePaymentStatus
            publishableKey={publishableKey}
            envUrl={decodedEnvUrl}
          />
          <Summary
            data={checkoutSummaryDataResponse.checkout}
            envUrl={decodedEnvUrl}
          />
        </div>
      ) : (
        <section>
          Checkout already completed - go to{" "}
          <Link href="/" className="underline">
            home page
          </Link>{" "}
          to create new one
        </section>
      )}
    </main>
  );
}
