"use client";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

import { processTransaction } from "../actions/process-transaction";

const StripePaymentStatusWrapped = (props: { envUrl: string }) => {
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

        case "requires_capture":
          setMessage("💳 Payment requires capture.");
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
      <CardContent className="flex items-center justify-between gap-4 p-6 text-sm">
        <p>{message}</p>
        <Button
          variant="secondary"
          onClick={async () => {
            const transactionId = searchParams.get("saleorTransactionId");

            if (!transactionId) {
              return;
            }

            const response = await processTransaction({
              transactionId,
              envUrl: props.envUrl,
            });

            const processTransactionDataErrors =
              response?.data?.data?.paymentIntent?.errors ?? [];

            if (processTransactionDataErrors.length > 0) {
              toast({
                variant: "destructive",
                title: processTransactionDataErrors[0]?.code,
                description: processTransactionDataErrors[0]?.message,
              });

              return;
            }

            toast({
              title: "Success",
              description: "Session processed successfully",
            });
          }}
        >
          Force process session
        </Button>
      </CardContent>
    </Card>
  );
};

export const StripePaymentStatus = (props: {
  publishableKey: string;
  envUrl: string;
}) => {
  return (
    <Elements stripe={loadStripe(props.publishableKey)}>
      <StripePaymentStatusWrapped envUrl={props.envUrl} />
    </Elements>
  );
};
