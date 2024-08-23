import AdyenCheckout from "@adyen/adyen-web";

import { ErrorToastDescription } from "@/components/error-toast-description";
import { toast } from "@/components/ui/use-toast";

import {
  initalizeTransaction,
  processTransaction,
  redirectToSummary,
} from "../actions";

type CoreConfiguration = Parameters<typeof AdyenCheckout>[0];

export const getAdyenDropinConfig = (props: {
  clientKey: string;
  paymentMethodsResponse: any;
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
  return {
    clientKey,
    locale: "en-US",
    environment,
    paymentMethodsResponse,
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

      console.error(error.name, error.message, error.stack);
    },
    onAdditionalDetails: async (state, dropin) => {
      dropin?.setStatus("loading");

      const transactionProcessResponse = await processTransaction({
        envUrl,
        transactionId: dropin?.state.saleorTransactionId,
        data: state.data,
      });

      if (transactionProcessResponse.isErr()) {
        dropin?.setStatus("error");
        return toast({
          title: `${transactionProcessResponse.error.name}: ${transactionProcessResponse.error.message}`,
          variant: "destructive",
          description: (
            <ErrorToastDescription
              details={transactionProcessResponse.error.errors}
            />
          ),
        });
      }

      const adyenPaymentDetailResponse = transactionProcessResponse.value;

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

      if (transactionInitializeResponse.isErr()) {
        dropin.setStatus("error");
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

      const adyenPaymentResponse = transactionInitializeResponse.value;

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
