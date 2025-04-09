"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { StripeMoney } from "../stripe-money";
import { StripeCheckoutForm } from "./stripe-checkout-form";

export const StripeCheckoutWrapper = ({
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
      <StripeCheckoutForm
        saleorAmount={totalPrice.gross.amount}
        envUrl={envUrl}
        paymentGatewayId={paymentGatewayId}
        checkoutId={checkoutId}
        currency={totalPrice.gross.currency}
      />
    </Elements>
  );
};
