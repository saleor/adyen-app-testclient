import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BaseError } from "@/lib/errors";
import { clearIdempotencyKey, getIdempotencyKey } from "@/lib/idempotency-key";
import { createPath } from "@/lib/utils";

import { getBaseUrl } from "../actions/get-base-url";
import { initializeTransaction } from "../actions/initialize-transaction";

const createStripeReturnUrl = async (args: {
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
}) => {
  const encodedEnvUrl = encodeURIComponent(args.envUrl);
  const encodedPaymentGatewayId = encodeURIComponent(args.paymentGatewayId);
  const baseUrl = await getBaseUrl();

  return new URL(
    createPath(
      "env",
      encodedEnvUrl,
      "checkout",
      args.checkoutId,
      "payment-gateway",
      "stripe",
      encodedPaymentGatewayId,
      "summary",
    ),
    baseUrl,
  ).href;
};

export const StripeCheckoutForm = (props: {
  checkoutId: string;
  saleorAmount: number;
  envUrl: string;
  paymentGatewayId: string;
  currency: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe) {
    return null;
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();

    if (submitError) {
      toast({
        variant: "destructive",
        title: "Error submitting checkout form",
        description: submitError.message,
      });
      return;
    }

    const initializeTransactionData = await initializeTransaction({
      checkoutId: props.checkoutId,
      amount: props.saleorAmount,
      envUrl: props.envUrl,
      paymentGatewayId: props.paymentGatewayId,
      idempotencyKey: getIdempotencyKey(),
    });

    if (initializeTransactionData?.serverError) {
      throw initializeTransactionData.serverError;
    }

    if (!initializeTransactionData?.data) {
      throw new BaseError("No data returned from the server");
    }

    const stripeClientSecret =
      initializeTransactionData?.data?.data.stripeClientSecret;

    if (!stripeClientSecret) {
      throw new BaseError("No stripeClientSecret returned from the server");
    }

    const returnUrl = await createStripeReturnUrl({
      envUrl: props.envUrl,
      checkoutId: props.checkoutId,
      paymentGatewayId: props.paymentGatewayId,
    });

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: stripeClientSecret,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      toast({
        variant: "destructive",
        title: "Error confirming payment",
        description: error.message,
      });
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      clearIdempotencyKey();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <div className="flex justify-stretch">
        <Button
          type="submit"
          className="w-full"
          disabled={!stripe || !elements}
        >
          Pay {props.saleorAmount} {props.currency}
        </Button>
      </div>
    </form>
  );
};
