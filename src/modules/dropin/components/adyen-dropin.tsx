"use client";
import "@adyen/adyen-web/dist/adyen.css";

import AdyenCheckout from "@adyen/adyen-web";
import { FragmentOf, readFragment } from "gql.tada";
import { useEffect, useRef } from "react";

import { InitalizePaymentGatewaySchemaType } from "../actions";
import { getAdyenDropinConfig } from "../adyen";
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

  useEffect(() => {
    const initDropin = async () => {
      const adyenCheckoutConfig = getAdyenDropinConfig({
        clientKey: gatewayConfig.data.clientKey,
        environment: gatewayConfig.data.environment,
        paymentMethodsResponse: gatewayConfig.data.paymentMethodsResponse,
        totalPriceAmount: totalPrice?.gross.amount ?? 0,
        totalPriceCurrency: totalPrice?.gross.currency ?? "",
        envUrl,
        checkoutId,
        paymentGatewayId,
      });
      const adyenCheckout = await AdyenCheckout(adyenCheckoutConfig);
      if (dropinContainerRef.current) {
        adyenCheckout.create("dropin").mount(dropinContainerRef.current);
      }
    };
    initDropin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="h-full flex-grow" ref={dropinContainerRef} />;
};
