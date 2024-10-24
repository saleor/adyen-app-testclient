"use client";
import "@adyen/adyen-web/dist/adyen.css";

import AdyenCheckout from "@adyen/adyen-web";
import { type FragmentOf, readFragment } from "gql.tada";
import { useEffect, useRef } from "react";

import { UnknownError } from "@/lib/errors";

import { getAdyenDropinConfig } from "../adyen";
import { SaleorPrice } from "../adyen/price";
import { TotalPriceFragment } from "../fragments";
import { type InitalizePaymentGatewaySchemaType } from "../schemas";

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
  // there are always going to be at least one gateway config
  const gatewayConfig = gatewayConfigs[0]!;
  const { clientKey, environment, paymentMethodsResponse } = gatewayConfig.data;
  const totalPrice = readFragment(TotalPriceFragment, totalPriceData);
  const dropinContainerRef = useRef<HTMLDivElement | null>(null);

  if (!totalPrice) {
    throw new UnknownError("Total price is missing from Saleor response.");
  }

  const initDropin = async () => {
    // We first need to create the Checkout instance, to later pass it into the config
    // this is required for onOrderCancel handler
    const adyenCheckout = await AdyenCheckout({
      clientKey,
      environment,
    });

    const priceFromSaleorCheckout = SaleorPrice.create({
      amount: totalPrice.gross.amount,
      currency: totalPrice.gross.currency,
    });

    await adyenCheckout.update(
      getAdyenDropinConfig({
        paymentMethodsResponse,
        envUrl,
        checkoutId,
        paymentGatewayId,
        checkout: adyenCheckout,
        priceFromSaleorCheckout,
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
