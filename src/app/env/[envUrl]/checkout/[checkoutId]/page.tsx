import {
  Billing,
  DeliveryMethod,
  getCheckoutDetails,
  Shipping,
} from "@/modules/checkout-details";

export default async function CheckoutDetailsPage(props: {
  params: { envUrl: string; checkoutId: string };
}) {
  const { envUrl, checkoutId } = props.params;
  const decodedEnvUrl = decodeURIComponent(envUrl);

  const checkoutDetails = await getCheckoutDetails({
    envUrl: decodedEnvUrl,
    checkoutId,
  });

  // todo: handle error in error boundary
  if (checkoutDetails.isErr()) {
    throw checkoutDetails.error;
  }

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <Billing
        data={checkoutDetails.value.checkout?.billingAddress}
        envUrl={decodedEnvUrl}
        checkoutId={checkoutId}
      />
      <Shipping
        data={checkoutDetails.value.checkout?.shippingAddress}
        envUrl={decodedEnvUrl}
        checkoutId={checkoutId}
      />
      <DeliveryMethod
        deliveryMethodData={checkoutDetails.value.checkout?.deliveryMethod}
        shippingMethodData={checkoutDetails.value.checkout?.shippingMethods}
        envUrl={decodedEnvUrl}
        checkoutId={checkoutId}
      />
    </main>
  );
}
