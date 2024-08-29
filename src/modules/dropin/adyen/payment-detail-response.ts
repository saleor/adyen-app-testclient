import { z } from "zod";

import { TransactionProcessSchema } from "../schemas/transaction-process";

export class AdyenPaymentDetailResponse {
  constructor(public data: z.infer<typeof TransactionProcessSchema>) {}

  isRefused() {
    return (
      this.data.transactionProcess.data.paymentDetailsResponse.resultCode ===
      "Refused"
    );
  }

  getRefusalReason() {
    return (
      this.data.transactionProcess.data.paymentDetailsResponse.refusalReason ??
      "Payment was refused by issuer"
    );
  }

  getRawResponse() {
    return this.data.transactionProcess.data.paymentDetailsResponse;
  }

  isSuccessful() {
    return ["Authorised", "Pending", "Received"].includes(
      this.data.transactionProcess.data.paymentDetailsResponse.resultCode,
    );
  }
}
