import { Cart } from "@/app/components/cart";
import { Shipping } from "@/app/components/shipping";
import { graphql } from "gql.tada";
import request from "graphql-request";
import { Billing, billingAddressTypesFragment } from "./sections/billing";

const GetCheckoutQuery = graphql(
  `
    query getCheckout($checkoutId: ID!) {
      checkout(id: $checkoutId) {
        billingAddress {
          ...BillingAddress
        }
      }
    }
  `,
  [billingAddressTypesFragment],
);

export default async function Checkout({
  params: { envUrl, checkoutId },
}: {
  params: { envUrl: string; checkoutId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const data = await request(decodedEnvUrl, GetCheckoutQuery, {
    checkoutId,
  });

  console.log(data);

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <div className="grid gap-4 md:gap-8">
        <Billing
          address={data.checkout?.billingAddress}
          envUrl={decodedEnvUrl}
          checkoutId={checkoutId}
        />
        <Shipping />
      </div>
      <div className="grid gap-4 md:gap-8">
        <Cart />
      </div>
    </main>
  );
}
