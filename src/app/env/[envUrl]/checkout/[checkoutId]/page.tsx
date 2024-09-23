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

  if (checkoutDetailsResponse?.serverError) {
    // Sends the error to the error boundary
    throw new CheckoutDetailsPageError(
      checkoutDetailsResponse?.serverError.message,
    );
  }

  const hasDeliveryMethodsToSelect =
    checkoutDetailsResponse?.data?.checkout?.shippingMethods?.length ?? 0;

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <Billing
        data={checkoutDetailsResponse?.data?.checkout?.billingAddress}
        envUrl={decodedEnvUrl}
        checkoutId={checkoutId}
      />
      <Shipping
        data={checkoutDetailsResponse?.data?.checkout?.shippingAddress}
        envUrl={decodedEnvUrl}
        checkoutId={checkoutId}
      />
      {hasDeliveryMethodsToSelect ? (
        <DeliveryMethod
          deliveryMethodData={
            checkoutDetailsResponse?.data?.checkout?.deliveryMethod
          }
          shippingMethodData={
            checkoutDetailsResponse?.data?.checkout?.shippingMethods
          }
          envUrl={decodedEnvUrl}
          checkoutId={checkoutId}
        />
      ) : null}
    </main>
  );
}
