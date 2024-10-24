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
import { AdyenPrice, SaleorPrice } from "./price";
import { SplitPaymentSaleorPriceResolver } from "./split-payment-saleor-price-resolver";

const logger = createLogger("getAdyenDropinConfig");

type CoreConfiguration = Parameters<typeof AdyenCheckout>[0];

type AdyenCheckout = Awaited<ReturnType<typeof AdyenCheckout>>;

export const getAdyenDropinConfig = (props: {
  paymentMethodsResponse:
    | z.infer<typeof PaymentMethodsResponseSchema>
    | undefined;
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
  checkout: AdyenCheckout;
  priceFromSaleorCheckout: SaleorPrice;
}): CoreConfiguration => {
  const {
    paymentMethodsResponse,
    envUrl,
    checkoutId,
    paymentGatewayId,
    checkout,
    priceFromSaleorCheckout,
  } = props;

  const splitPaymentSaleorPriceResolver = new SplitPaymentSaleorPriceResolver();

  const paypalPaymentMethod = paymentMethodsResponse?.paymentMethods.find(
    (method) => method.type === "paypal",
  );

  const adyenPrice = priceFromSaleorCheckout.toAdyenPrice();

  return {
    locale: "en-US",
    paymentMethodsResponse,
    paymentMethodsConfiguration: {
      paypal: paypalPaymentMethod?.configuration,
    },
    amount: {
      currency: adyenPrice.getCurrency(),
      value: adyenPrice.getAmount(),
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

      if (transactionProcessResponse?.serverError) {
        dropin?.setStatus("error");
        toast({
          title: transactionProcessResponse.serverError.name,
          variant: "destructive",
          description: transactionProcessResponse.serverError.message,
        });
        return;
      }

      if (!transactionProcessResponse?.data) {
        dropin?.setStatus("error");
        toast({
          title: "Error while processing transaction",
          description: "No data back from Adyen app",
          variant: "destructive",
        });
        return;
      }

      const adyenPaymentDetailResponse =
        AdyenPaymentDetailResponse.createFromTransactionProcess(
          transactionProcessResponse.data,
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

      const saleorPrice =
        splitPaymentSaleorPriceResolver.resolveToSaleorPrice() ||
        priceFromSaleorCheckout;

      const transactionInitializeResponse = await initalizeTransaction({
        envUrl,
        checkoutId,
        paymentGatewayId,
        amount: saleorPrice.getAmount(),
        data: {
          ...state.data,
          returnUrl: window.location.href,
          origin: window.location.origin,
        },
        idempotencyKey: window.crypto.randomUUID(),
      });

      splitPaymentSaleorPriceResolver.resetAdyenSplitPaymentPrice();

      if (transactionInitializeResponse?.serverError) {
        toast({
          title: transactionInitializeResponse?.serverError.name,
          variant: "destructive",
          description: transactionInitializeResponse?.serverError.message,
        });
        dropin.setStatus("error");

        return;
      }

      if (!transactionInitializeResponse?.data) {
        toast({
          title: "Error while initializing transaction",
          description: "No data back from Adyen app",
          variant: "destructive",
        });
        dropin.setStatus("error");

        return;
      }

      const adyenPaymentResponse =
        AdyenPaymentResponse.createFromTransactionInitalize(
          transactionInitializeResponse?.data,
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
        return;
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

      if (initalizePaymentGatewayDataResponse?.serverError) {
        toast({
          title: initalizePaymentGatewayDataResponse.serverError.name,
          description: initalizePaymentGatewayDataResponse.serverError.message,
          variant: "destructive",
        });

        return;
      }

      if (!initalizePaymentGatewayDataResponse?.data) {
        toast({
          title: "Error while checking balance",
          description:
            "Balance couldn't be checked - no data back from Adyen app",
          variant: "destructive",
        });

        return;
      }

      const adyenBallanceCheckResponse =
        AdyenGiftCardBalanceResponse.createFromInitializePaymentGateway(
          initalizePaymentGatewayDataResponse?.data,
        );

      const balanceCheckResponse = adyenBallanceCheckResponse.getResponse();

      if (!balanceCheckResponse?.balance) {
        toast({
          title: "Error while checking balance",
          description: "No balance data back from Adyen app",
          variant: "destructive",
        });
        return;
      }

      const priceFromAdyenBalanceCheck = AdyenPrice.create({
        amount: balanceCheckResponse.balance.value,
        currency: balanceCheckResponse.balance.currency,
      });

      splitPaymentSaleorPriceResolver.setAdyenSplitPaymentPrice(
        priceFromAdyenBalanceCheck,
      );

      void resolve(balanceCheckResponse);
    },
    onOrderRequest: async (resolve) => {
      // https://docs.saleor.io/developer/app-store/apps/adyen/storefront#onorderrequest
      const initalizePaymentGatewayDataResponse = await initalizePaymentGateway(
        {
          envUrl,
          checkoutId,
          paymentGatewayId,
          data: { action: "createOrder" },
          amount: priceFromSaleorCheckout.getAmount(),
        },
      );

      if (initalizePaymentGatewayDataResponse?.serverError) {
        toast({
          title: initalizePaymentGatewayDataResponse.serverError.name,
          description: initalizePaymentGatewayDataResponse.serverError.message,
          variant: "destructive",
        });

        return;
      }

      if (!initalizePaymentGatewayDataResponse?.data) {
        toast({
          title: "Error while creating order",
          description:
            "Order couldn't be created - no data back from Adyen app",
          variant: "destructive",
        });

        return;
      }

      const adyenOrderCreateResponse =
        AdyenOrderCreateResponse.createFromInitializePaymentGateway(
          initalizePaymentGatewayDataResponse?.data,
        );

      void resolve(adyenOrderCreateResponse.getResponse());
    },
    // @ts-expect-error - onOrderCancel is not wrongly defined in the types
    onOrderCancel: async ({ order, _rest }: { order: Order }) => {
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

      if (initalizePaymentGatewayDataResponse?.serverError) {
        toast({
          title: initalizePaymentGatewayDataResponse.serverError.name,
          description: initalizePaymentGatewayDataResponse.serverError.message,
          variant: "destructive",
        });

        return;
      }

      if (!initalizePaymentGatewayDataResponse?.data) {
        toast({
          title: "Error while cancelling order",
          description:
            "Order couldn't be cancelled - no data back from Adyen app",
          variant: "destructive",
        });
        return;
      }

      const adyenOrderCancelledResponse =
        AdyenOrderCancelledResponse.createFromInitializePaymentGateway(
          initalizePaymentGatewayDataResponse?.data,
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
