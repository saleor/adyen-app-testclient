import Link from "next/link";

import { readFragment } from "@/graphql/gql";
import { BaseError } from "@/lib/errors";
import { initializePaymentGateway } from "@/modules/stripe/actions/initialize-payment-gateway";
import { StripePaymentStatus } from "@/modules/stripe/components/stripe-payment-status";
import { getCheckoutSummary } from "@/modules/summary/actions/get-checkout-summary";
import { Summary } from "@/modules/summary/components/summary";
import { CheckoutFragment } from "@/modules/summary/fragments";

const CheckoutSummaryPageError = BaseError.subclass("CheckoutSummaryPageError");

export default async function CheckoutSummaryPage({
  params: { envUrl, checkoutId, paymentGatewayId },
}: {
  params: { envUrl: string; checkoutId: string; paymentGatewayId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const checkoutSummaryDataResponse = await getCheckoutSummary({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  if (!checkoutSummaryDataResponse?.data) {
    throw new CheckoutSummaryPageError("No checkout data found");
  }

  const checkout = readFragment(
    CheckoutFragment,
    checkoutSummaryDataResponse.data.checkout,
  );

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

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      {checkout?.id ? (
        <div className="flex flex-col gap-6">
          <StripePaymentStatus
            publishableKey={publishableKey}
            envUrl={decodedEnvUrl}
          />
          <Summary
            data={checkoutSummaryDataResponse.data.checkout}
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
