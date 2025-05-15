"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BaseError } from "@/lib/errors";
import { getIdempotencyKey } from "@/lib/idempotency-key";
import { createPath } from "@/lib/utils";

import { getBaseUrl } from "../actions/get-base-url";
import { initializeTransaction } from "../actions/initialize-transaction";
import { StripeMoney } from "../stripe-money";

const createStripeReturnUrl = async (args: {
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
  saleorTransactionId: string | undefined;
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
      `summary?saleorTransactionId=${args.saleorTransactionId}`,
    ),
    baseUrl,
  ).href;
};

export const StripeCheckoutFormWrapped = (props: {
  checkoutId: string;
  saleorAmount: number;
  envUrl: string;
  paymentGatewayId: string;
  currency: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    if (!stripe) {
      return null;
    }

    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError, selectedPaymentMethod } =
      await elements.submit();

    if (submitError) {
      toast({
        variant: "destructive",
        title: "Error submitting checkout form",
        description: submitError.message,
      });
      return;
    }

    setLoading(true);

    if (!selectedPaymentMethod) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error submitting checkout form",
        description: "No payment method selected",
      });
      return;
    }

    // eslint-disable-next-line no-console
    console.log("Selected payment method", selectedPaymentMethod);

    const initializeTransactionResult = await initializeTransaction({
      checkoutId: props.checkoutId,
      amount: props.saleorAmount,
      envUrl: props.envUrl,
      paymentGatewayId: props.paymentGatewayId,
      idempotencyKey: getIdempotencyKey(),
      data: {
        paymentIntent: {
          paymentMethod: selectedPaymentMethod,
        },
      },
    });

    if (!initializeTransactionResult?.data) {
      setLoading(false);
      throw new BaseError("No data returned from the server");
    }

    const dataErrors =
      initializeTransactionResult?.data.data.paymentIntent?.errors ?? [];

    if (dataErrors.length > 0) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: dataErrors[0]?.code,
        description: dataErrors[0]?.message,
      });
      return;
    }

    const stripeClientSecret =
      initializeTransactionResult?.data?.data.paymentIntent.stripeClientSecret;

    const saleorTransactionId =
      initializeTransactionResult?.data?.transaction?.id;

    if (!stripeClientSecret) {
      setLoading(false);
      throw new BaseError("No stripeClientSecret returned from the server");
    }

    const returnUrl = await createStripeReturnUrl({
      envUrl: props.envUrl,
      checkoutId: props.checkoutId,
      paymentGatewayId: props.paymentGatewayId,
      saleorTransactionId,
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
      setLoading(false);

      toast({
        variant: "destructive",
        title: "Error confirming payment",
        description: error.message,
      });
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
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
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              Pay {props.saleorAmount} {props.currency}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export const StripeCheckoutForm = ({
  pk,
  checkoutId,
  envUrl,
  paymentGatewayId,
  totalPrice,
}: {
  pk: string;
  currency: string;
  checkoutId: string;
  envUrl: string;
  paymentGatewayId: string;
  totalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
}) => {
  const stripeMoney = StripeMoney.createFromSaleorAmount({
    amount: totalPrice.gross.amount,
    currency: totalPrice.gross.currency,
  });
  return (
    <Elements
      stripe={loadStripe(pk)}
      options={{
        amount: stripeMoney.amount,
        currency: stripeMoney.currency,
        mode: "payment",
      }}
    >
      <StripeCheckoutFormWrapped
        saleorAmount={totalPrice.gross.amount}
        envUrl={envUrl}
        paymentGatewayId={paymentGatewayId}
        checkoutId={checkoutId}
        currency={totalPrice.gross.currency}
      />
    </Elements>
  );
};
