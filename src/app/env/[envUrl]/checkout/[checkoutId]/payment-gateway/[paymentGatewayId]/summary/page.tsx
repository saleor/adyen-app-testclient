import { readFragment } from "gql.tada";
import Link from "next/link";

import { getCheckoutSummary, Summary } from "@/modules/summary";
import { CheckoutFragment } from "@/modules/summary/fragments";

export default async function PaymentGatewayPage({
  params: { envUrl, checkoutId },
}: {
  params: { envUrl: string; checkoutId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const checkoutSummaryData = await getCheckoutSummary({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  if (checkoutSummaryData.isErr()) {
    // Sends the error to the error boundary
    throw checkoutSummaryData.error;
  }

  const checkout = readFragment(
    CheckoutFragment,
    checkoutSummaryData.value.checkout,
  );

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      {checkout?.id ? (
        <Summary
          data={checkoutSummaryData.value.checkout}
          envUrl={decodedEnvUrl}
        />
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
