"use client";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StripePaymentStatusWrapped = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("⌛ Loading ...");

  const stripe = useStripe();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const paymentIntentClientSecret = searchParams.get(
      "payment_intent_client_secret",
    );

    if (!paymentIntentClientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(paymentIntentClientSecret).then((result) => {
      if (result.error) {
        // eslint-disable-next-line no-console
        console.error("Error retrieving payment intent:", result.error);
        return;
      }
      const paymentIntent = result.paymentIntent;

      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("✅ Success! Payment received.");
          break;

        case "processing":
          setMessage(
            "🔄 Payment processing. We'll update you when payment is received.",
          );
          // TODO: preferably call here transactionProcessSession?
          break;

        case "requires_payment_method":
          // TODO: Redirect your user back to your payment page to attempt collecting payment again
          setMessage("❌ Payment failed. Please try another payment method.");
          break;

        default:
          setMessage("⚠️ Something went wrong.");
          break;
      }
    });
  }, [stripe, searchParams]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            <p>Stripe Payment status</p>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">{message}</CardContent>
    </Card>
  );
};

export const StripePaymentStatus = (props: { publishableKey: string }) => {
  return (
    <Elements stripe={loadStripe(props.publishableKey)}>
      <StripePaymentStatusWrapped />
    </Elements>
  );
};
