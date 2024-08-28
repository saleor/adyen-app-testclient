"use client";
import "@adyen/adyen-web/dist/adyen.css";

import AdyenCheckout from "@adyen/adyen-web";
import { FragmentOf, readFragment } from "gql.tada";
import { useEffect, useRef } from "react";

import { getAdyenDropinConfig } from "../adyen";
import { TotalPriceFragment } from "../fragments";
import { InitalizePaymentGatewaySchemaType } from "../schemas";

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
  const { clientKey, environment, paymentMethodsResponse } = gatewayConfig.data;
  const totalPrice = readFragment(TotalPriceFragment, totalPriceData);
  const dropinContainerRef = useRef<HTMLDivElement | null>(null);

  const initDropin = async () => {
    // We first need to create the Checkout instance, to later pass it into the config
    // this is required for onOrderCancel handler
    const adyenCheckout = await AdyenCheckout({
      clientKey,
      environment,
    });

    await adyenCheckout.update(
      getAdyenDropinConfig({
        paymentMethodsResponse,
        totalPriceAmount: totalPrice?.gross.amount,
        totalPriceCurrency: totalPrice?.gross.currency,
        envUrl,
        checkoutId,
        paymentGatewayId,
        checkout: adyenCheckout,
      }),
    );
    if (dropinContainerRef.current) {
      adyenCheckout.create("dropin").mount(dropinContainerRef.current);
    }
  };

  useEffect(() => {
    initDropin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="h-full flex-grow" ref={dropinContainerRef} />;
};
