"use client";
import "@adyen/adyen-web/dist/adyen.css";

import AdyenCheckout from "@adyen/adyen-web";
import { useEffect, useRef } from "react";

import { initalizeTransaction } from "@/lib/saleor/initalize-transaction";

const wait = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

type AdyenDropinProps = {
  paymentMethodsResponse: any;
  clientKey: string;
  totalPrice: {
    amount: number;
    currency: string;
  };
  envUrl: string;
  checkoutId: string;
  appId: string;
};

export const AdyenDropin = ({
  paymentMethodsResponse,
  clientKey,
  totalPrice,
  envUrl,
  checkoutId,
  appId,
}: AdyenDropinProps) => {
  const dropinContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initDropin = async () => {
      const checkout = await AdyenCheckout({
        clientKey,
        paymentMethodsResponse,
        environment: "test",
        locale: "en-US",
        amount: {
          value: totalPrice.amount * 100,
          currency: totalPrice.currency,
        },
        onSubmit: async (state, dropin) => {
          dropin.setStatus("loading");
          const transactionInitializeResponse = await initalizeTransaction({
            envUrl,
            checkoutId,
            appId,
            amount: totalPrice.amount,
            data: {
              ...state.data,
              returnUrl: window.location.href,
              origin: window.location.origin,
            },
            idempotencyKey: window.crypto.randomUUID(),
          });

          console.log(JSON.stringify(transactionInitializeResponse, null, 2));

          const { transaction, data } =
            transactionInitializeResponse.transactionInitialize;
          const paymentResponse = data?.paymentResponse;

          if (paymentResponse.action) {
            dropin.setState({ saleorTransactionId: transaction?.id });

            dropin.handleAction(paymentResponse.action);

            return;
          }

          if (
            paymentResponse?.order?.remainingAmount &&
            paymentResponse?.order?.remainingAmount?.value !== 0
          ) {
            // @ts-expect-error Wrong types in Adyen Web SDK - handleOrder is defined
            dropin.handleOrder(paymentResponse);

            return;
          }

          if (
            ["Authorised", "Pending", "Received"].includes(
              paymentResponse.resultCode,
            )
          ) {
            dropin.setStatus("success");

            await wait(1500);

            // redirect(
            // todo: use helper with array
            //   `/env/${encodeURIComponent(envUrl)}/checkout/${checkoutId}/payment-gateway/${appId}/complete-checkout`,
            // );
          }
        },
      });
      checkout.create("dropin").mount(dropinContainerRef.current!);
    };
    initDropin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="h-full flex-grow" ref={dropinContainerRef} />;
};
