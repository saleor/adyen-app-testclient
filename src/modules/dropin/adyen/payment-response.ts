import { z } from "zod";

import { InitalizeTransactionSchema } from "../schemas";

export class AdyenPaymentResponse {
  constructor(public data: z.infer<typeof InitalizeTransactionSchema>) {}

  getSaleorTransactionId() {
    return this.data.transactionInitialize.transaction.id;
  }

  getAction() {
    return this.getPaymentResponse().action;
  }

  isRedirectOrAdditionalActionFlow() {
    return this.getAction() !== undefined;
  }

  isSuccessful() {
    return ["Authorised", "Pending", "Received"].includes(
      this.getPaymentResponse().resultCode,
    );
  }

  isCancelled() {
    return this.getPaymentResponse().resultCode === "Cancelled";
  }

  isError() {
    return this.getPaymentResponse().resultCode === "Error";
  }

  isRefused() {
    return this.getPaymentResponse().resultCode === "Refused";
  }

  getPaymentResponse() {
    return this.data.transactionInitialize.data.paymentResponse;
  }

  hasOrderWithRemainingAmount() {
    return this.getPaymentResponse().order;
  }
}
