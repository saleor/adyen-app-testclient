import { readFragment } from "gql.tada";
import Link from "next/link";

import { BaseError } from "@/lib/errors";
import {
  CheckoutFragment,
  getCheckoutSummary,
  Summary,
} from "@/modules/summary";

const CheckoutSummaryPageError = BaseError.subclass("CheckoutSummaryPageError");

export default async function CheckoutSummaryPage({
  params: { envUrl, checkoutId },
}: {
  params: { envUrl: string; checkoutId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const checkoutSummaryDataResponse = await getCheckoutSummary({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  if (checkoutSummaryDataResponse.type === "error") {
    // Sends the error to the error boundary
    throw new CheckoutSummaryPageError(checkoutSummaryDataResponse.message);
  }

  const checkout = readFragment(
    CheckoutFragment,
    checkoutSummaryDataResponse.value.checkout,
  );

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      {checkout?.id ? (
        <Summary
          data={checkoutSummaryDataResponse.value.checkout}
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
