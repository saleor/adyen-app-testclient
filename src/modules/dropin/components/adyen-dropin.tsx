"use client";
import "@adyen/adyen-web/dist/adyen.css";

import AdyenCheckout from "@adyen/adyen-web";
import { FragmentOf, readFragment } from "gql.tada";
import { useEffect, useRef } from "react";

import { ErrorToastDescription } from "@/components/error-toast-description";
import { toast } from "@/components/ui/use-toast";

import {
  InitalizePaymentGatewaySchemaType,
  initalizeTransaction,
  redirectToSummary,
} from "../actions";
import { TotalPriceFragment } from "../fragments";

export const AdyenDropin = (props: {
  initalizePaymentGatewayData: InitalizePaymentGatewaySchemaType;
  totalPriceData: FragmentOf<typeof TotalPriceFragment> | undefined;
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
}) => {
  const {
    initalizePaymentGatewayData: {
      paymentGatewayInitialize: { gatewayConfigs },
    },
    totalPriceData,
    envUrl,
    checkoutId,
    paymentGatewayId,
  } = props;
  const gatewayConfig = gatewayConfigs[0];
  const totalPrice = readFragment(TotalPriceFragment, totalPriceData);

  const dropinContainerRef = useRef<HTMLDivElement | null>(null);

  const getAdyenCoreOptions = () => {
    return {
      clientKey: gatewayConfig.data.clientKey,
      locale: "en-US",
      environment: gatewayConfig.data.environment,
      paymentMethodsResponse: gatewayConfig.data.paymentMethodsResponse,
      paymentMethodsConfiguration: {
        applepay: {
          value: totalPrice ? totalPrice.gross.amount * 100 : 0,
          currency: totalPrice?.gross.currency ?? "",
        },
        countryCode: "US",
      },
      amount: {
        value: totalPrice ? totalPrice.gross.amount * 100 : 0,
        currency: totalPrice?.gross.currency ?? "",
      },
      onSubmit: async (state: any, dropin: any) => {
        dropin.setStatus("loading");
        const transactionInitializeResponse = await initalizeTransaction({
          envUrl,
          checkoutId,
          paymentGatewayId,
          amount: totalPrice?.gross.amount ?? 0,
          data: {
            ...state.data,
            returnUrl: window.location.href,
            origin: window.location.origin,
          },
          idempotencyKey: window.crypto.randomUUID(),
        });

        if (transactionInitializeResponse.isErr()) {
          return toast({
            title: `${transactionInitializeResponse.error.name}: ${transactionInitializeResponse.error.message}`,
            variant: "destructive",
            description: (
              <ErrorToastDescription
                details={transactionInitializeResponse.error.errors}
              />
            ),
          });
        }

        const { transaction, data } =
          transactionInitializeResponse.value.transactionInitialize;
        const paymentResponse = data.paymentResponse;

        if (paymentResponse.action) {
          dropin.setState({ saleorTransactionId: transaction?.id });

          dropin.handleAction(data.paymentResponse.action);

          return;
        }

        if (
          paymentResponse.order?.remainingAmount &&
          paymentResponse.order?.remainingAmount.value !== 0
        ) {
          dropin.handleOrder(paymentResponse);
          return;
        }

        if (
          ["Authorised", "Pending", "Received"].includes(
            paymentResponse.resultCode,
          )
        ) {
          dropin.setStatus("success");
          await redirectToSummary(paymentGatewayId);
        }
      },
    };
  };

  useEffect(() => {
    const initDropin = async () => {
      // @ts-expect-error
      const adyenCheckout = await AdyenCheckout(getAdyenCoreOptions());
      adyenCheckout.create("dropin").mount(dropinContainerRef.current!);
    };
    initDropin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="h-full flex-grow" ref={dropinContainerRef} />;
};
