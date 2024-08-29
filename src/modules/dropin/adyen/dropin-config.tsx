import AdyenCheckout from "@adyen/adyen-web";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { createLogger } from "@/lib/logger";

import {
  initalizePaymentGateway,
  initalizeTransaction,
  processTransaction,
  redirectToCheckoutSummary,
} from "../actions";
import { PaymentMethodsResponseSchema } from "../schemas";
import {
  AdyenGiftCardBalanceResponse,
  AdyenOrderCancelledResponse,
  AdyenOrderCreateResponse,
} from "./gateway-config-responses";
import { AdyenPaymentDetailResponse } from "./payment-detail-response";
import { AdyenPaymentResponse } from "./payment-response";

const logger = createLogger("getAdyenDropinConfig");

type CoreConfiguration = Parameters<typeof AdyenCheckout>[0];

type AdyenCheckout = Awaited<ReturnType<typeof AdyenCheckout>>;

export const getAdyenDropinConfig = (props: {
  paymentMethodsResponse:
    | z.infer<typeof PaymentMethodsResponseSchema>
    | undefined;
  totalPriceAmount: number | undefined;
  totalPriceCurrency: string | undefined;
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
  checkout: AdyenCheckout;
}): CoreConfiguration => {
  const {
    paymentMethodsResponse,
    totalPriceAmount = 0,
    totalPriceCurrency = "",
    envUrl,
    checkoutId,
    paymentGatewayId,
    checkout,
  } = props;

  const paypalPaymentMethod = paymentMethodsResponse?.paymentMethods.find(
    (method) => method.type === "paypal",
  );

  return {
    locale: "en-US",
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

      const adyenPaymentDetailResponse =
        AdyenPaymentDetailResponse.createFromTransactionProcess(
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
        await redirectToCheckoutSummary({ paymentGatewayId });
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
        toast({
          title: transactionInitializeResponse.name,
          variant: "destructive",
          description: transactionInitializeResponse.message,
        });
        dropin.setStatus("error");

        return;
      }

      const adyenPaymentResponse =
        AdyenPaymentResponse.createFromTransactionInitalize(
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

      if (adyenPaymentResponse.hasOrderWithRemainingAmount()) {
        // @ts-expect-error Wrong types in Adyen Web SDK - handleOrder is defined
        dropin.handleOrder(adyenPaymentResponse.getPaymentResponse());

        return;
      }

      if (adyenPaymentResponse.isSuccessful()) {
        dropin.setStatus("success");
        await redirectToCheckoutSummary({ paymentGatewayId });
      }

      if (adyenPaymentResponse.isCancelled()) {
        toast({
          title: "Payment cancelled",
          variant: "destructive",
          description: "Your payment has been cancelled.",
        });
        dropin.setStatus("ready");

        return;
      }

      if (adyenPaymentResponse.isError()) {
        toast({
          title: "Something went wrong with payment.",
          description: "There was an error while paying for your order",
          variant: "destructive",
        });

        return;
      }

      if (adyenPaymentResponse.isRefused()) {
        toast({
          title: "Payment refused",
          description: "Your payment has been refused.",
          variant: "destructive",
        });

        return;
      }

      toast({
        title: "Payment not handled",
        description: "Your payment request couldn't be processed",
        variant: "destructive",
      });

      logger.warn("Unhandled payment response", {
        paymentResponse: adyenPaymentResponse.getPaymentResponse(),
      });
    },
    onBalanceCheck: async (resolve, _, data) => {
      // https://docs.saleor.io/developer/app-store/apps/adyen/storefront#onbalancecheck
      const initalizePaymentGatewayDataResponse = await initalizePaymentGateway(
        {
          envUrl,
          checkoutId,
          paymentGatewayId,
          data: { action: "checkBalance", paymentMethod: data.paymentMethod },
        },
      );

      if (initalizePaymentGatewayDataResponse.type === "error") {
        toast({
          title: initalizePaymentGatewayDataResponse.name,
          description: initalizePaymentGatewayDataResponse.message,
          variant: "destructive",
        });

        return;
      }

      const adyenBallanceCheckResponse =
        AdyenGiftCardBalanceResponse.createFromInitializePaymentGateway(
          initalizePaymentGatewayDataResponse.value,
        );

      void resolve(adyenBallanceCheckResponse.getResponse());
    },
    onOrderRequest: async (resolve) => {
      // https://docs.saleor.io/developer/app-store/apps/adyen/storefront#onorderrequest
      const initalizePaymentGatewayDataResponse = await initalizePaymentGateway(
        {
          envUrl,
          checkoutId,
          paymentGatewayId,
          data: { action: "createOrder" },
        },
      );

      if (initalizePaymentGatewayDataResponse.type === "error") {
        toast({
          title: initalizePaymentGatewayDataResponse.name,
          description: initalizePaymentGatewayDataResponse.message,
          variant: "destructive",
        });

        return;
      }

      const adyenOrderCreateResponse =
        AdyenOrderCreateResponse.createFromInitializePaymentGateway(
          initalizePaymentGatewayDataResponse.value,
        );

      void resolve(adyenOrderCreateResponse.getResponse());
    },
    // @ts-expect-error - onOrderCancel is not wrongly defined in the types
    onOrderCancel: async ({ order }: { order: Order }) => {
      // https://docs.saleor.io/developer/app-store/apps/adyen/storefront#onordercancel
      const initalizePaymentGatewayDataResponse = await initalizePaymentGateway(
        {
          envUrl,
          checkoutId,
          paymentGatewayId,
          data: {
            action: "cancelOrder",
            pspReference: order.pspReference,
            orderData: order.orderData,
          },
        },
      );

      if (initalizePaymentGatewayDataResponse.type === "error") {
        toast({
          title: initalizePaymentGatewayDataResponse.name,
          description: initalizePaymentGatewayDataResponse.message,
          variant: "destructive",
        });

        return;
      }

      const adyenOrderCancelledResponse =
        AdyenOrderCancelledResponse.createFromInitializePaymentGateway(
          initalizePaymentGatewayDataResponse.value,
        );

      if (adyenOrderCancelledResponse.isOrderNotCancelled()) {
        toast({
          title: "Error while cancelling order",
          description: "Order couldn't be cancelled",
          variant: "destructive",
        });
        return;
      }

      await checkout.update({ order: undefined });
    },
  };
};
