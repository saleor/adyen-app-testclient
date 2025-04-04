"use client";

import {
  Elements,
  ElementsConsumer,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();

    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    // TODO transaction initialize
    const res = await fetch("/create-intent", {
      method: "POST",
    });

    const { client_secret: clientSecret } = await res.json();

    const { error } = await stripe!.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: "https://example.com/order/123/complete", //todo
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="flex justify-stretch">
        <button
          className={
            "my-4 w-full rounded-md bg-black px-4 py-2 text-xl font-semibold text-white"
          }
          type="submit"
          disabled={!stripe || !elements}
        >
          Pay
        </button>
      </div>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export const StripeDropinWrapper = ({ pk }: { pk: string }) => {
  return (
    <Elements
      stripe={loadStripe(pk)}
      options={{
        amount: 100 * 100,
        currency: "usd",
        mode: "payment",
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};
