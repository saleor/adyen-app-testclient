import { BaseError } from "@/lib/errors";
import {
  Billing,
  DeliveryMethod,
  getCheckoutDetails,
  Shipping,
} from "@/modules/checkout-details";

const CheckoutDetailsPageError = BaseError.subclass("CheckoutDetailsPageError");

export default async function CheckoutDetailsPage(props: {
  params: { envUrl: string; checkoutId: string };
}) {
  const { envUrl, checkoutId } = props.params;
  const decodedEnvUrl = decodeURIComponent(envUrl);

  const checkoutDetailsResponse = await getCheckoutDetails({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  if (checkoutDetailsResponse.type === "error") {
    // Sends the error to the error boundary
    throw new CheckoutDetailsPageError(checkoutDetailsResponse.message);
  }

  const hasDeliveryMethodsToSelect =
    checkoutDetailsResponse.value.checkout?.shippingMethods?.length ?? 0;

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <Billing
        data={checkoutDetailsResponse.value.checkout?.billingAddress}
        envUrl={decodedEnvUrl}
        checkoutId={checkoutId}
      />
      <Shipping
        data={checkoutDetailsResponse.value.checkout?.shippingAddress}
        envUrl={decodedEnvUrl}
        checkoutId={checkoutId}
      />
      {hasDeliveryMethodsToSelect ? (
        <DeliveryMethod
          deliveryMethodData={
            checkoutDetailsResponse.value.checkout?.deliveryMethod
          }
          shippingMethodData={
            checkoutDetailsResponse.value.checkout?.shippingMethods
          }
          envUrl={decodedEnvUrl}
          checkoutId={checkoutId}
        />
      ) : null}
    </main>
  );
}
