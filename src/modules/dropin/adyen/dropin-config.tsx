import AdyenCheckout from "@adyen/adyen-web";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { createLogger } from "@/lib/logger";

import {
  initalizeTransaction,
  processTransaction,
  redirectToSummary,
} from "../actions";
import { PaymentMethodsResponseSchema } from "../schemas";
import { AdyenPaymentDetailResponse } from "./payment-detail-response";
import { AdyenPaymentResponse } from "./payment-response";

const logger = createLogger("AdyenDropinConfig");

type CoreConfiguration = Parameters<typeof AdyenCheckout>[0];

export const getAdyenDropinConfig = (props: {
  clientKey: string;
  paymentMethodsResponse: z.infer<typeof PaymentMethodsResponseSchema>;
  totalPriceAmount: number;
  totalPriceCurrency: string;
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
  environment: string;
}): CoreConfiguration => {
  const {
    clientKey,
    paymentMethodsResponse,
    totalPriceAmount,
    totalPriceCurrency,
    envUrl,
    checkoutId,
    paymentGatewayId,
    environment,
  } = props;

  const paypalPaymentMethod = paymentMethodsResponse.paymentMethods.find(
    (method) => method.type === "paypal",
  );

  return {
    clientKey,
    locale: "en-US",
    environment,
    paymentMethodsResponse,
    paymentMethodsConfiguration: {
      paypal: paypalPaymentMethod?.configuration,
    },
    amount: {
      value: totalPriceAmount * 100,
      currency: totalPriceCurrency,
    },
    onError: (error) => {
      toast({
        title: error.name,
        description: error.message,
        variant: "destructive",
      });
      logger.error("Adyen Dropin error", { error });
    },
    onAdditionalDetails: async (state, dropin) => {
      dropin?.setStatus("loading");

      const transactionProcessResponse = await processTransaction({
        envUrl,
        transactionId: dropin?.state.saleorTransactionId,
        data: state.data,
      });

      if (transactionProcessResponse.type === "error") {
        dropin?.setStatus("error");
        toast({
          title: transactionProcessResponse.name,
          variant: "destructive",
          description: transactionProcessResponse.message,
        });
        return;
      }

      const adyenPaymentDetailResponse = new AdyenPaymentDetailResponse(
        transactionProcessResponse.value,
      );

      if (adyenPaymentDetailResponse.isRefused()) {
        toast({
          title: "Payment refused",
          description: adyenPaymentDetailResponse.getRefusalReason(),
          variant: "destructive",
        });
      }

      // @ts-expect-error - method is not defined in the types
      dropin?.handleResponse(adyenPaymentDetailResponse.getRawResponse());

      if (adyenPaymentDetailResponse.isSuccessful()) {
        dropin?.setStatus("success");
        await redirectToSummary(paymentGatewayId);
      }
    },
    onSubmit: async (state, dropin) => {
      dropin.setStatus("loading");
      const transactionInitializeResponse = await initalizeTransaction({
        envUrl,
        checkoutId,
        paymentGatewayId,
        amount: totalPriceAmount,
        data: {
          ...state.data,
          returnUrl: window.location.href,
          origin: window.location.origin,
        },
        idempotencyKey: window.crypto.randomUUID(),
      });

      if (transactionInitializeResponse.type === "error") {
        dropin.setStatus("error");
        toast({
          title: transactionInitializeResponse.name,
          variant: "destructive",
          description: transactionInitializeResponse.message,
        });
        return;
      }

      const adyenPaymentResponse = new AdyenPaymentResponse(
        transactionInitializeResponse.value,
      );

      if (adyenPaymentResponse.isRedirectOrAdditionalActionFlow()) {
        dropin.setState({
          saleorTransactionId: adyenPaymentResponse.getSaleorTransactionId(),
        });

        const adyenAction = adyenPaymentResponse.getAction();

        if (adyenAction) {
          dropin.handleAction(adyenAction);
        }

        return;
      }

      if (adyenPaymentResponse.isSuccessful()) {
        dropin.setStatus("success");
        await redirectToSummary(paymentGatewayId);
      }
    },
  };
};
