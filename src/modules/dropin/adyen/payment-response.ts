import { z } from "zod";

import { InitalizeTransactionSchema } from "../actions";

export class AdyenPaymentResponse {
  constructor(public data: z.infer<typeof InitalizeTransactionSchema>) {}

  getSaleorTransactionId() {
    return this.data.transactionInitialize.transaction.id;
  }

  getAction() {
    return this.data.transactionInitialize.data.paymentResponse.action;
  }

  isRedirectOrAdditionalActionFlow() {
    return this.getAction() !== undefined;
  }

  isSuccessful() {
    return ["Authorised", "Pending", "Received"].includes(
      this.data.transactionInitialize.data.paymentResponse.resultCode,
    );
  }
}
