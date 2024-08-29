import { createLogger } from "@/lib/logger";

import { InitalizePaymentGatewaySchemaType } from "../schemas";

const logger = createLogger("AdyenGatewayConfigResponse");

export class AdyenGatewayConfigResponse {
  private constructor(
    private gatewayConfig: InitalizePaymentGatewaySchemaType["paymentGatewayInitialize"]["gatewayConfigs"][number],
  ) {}

  static createFromInitializePaymentGateway(
    data: InitalizePaymentGatewaySchemaType,
  ) {
    if (data.paymentGatewayInitialize.gatewayConfigs.length > 1) {
      logger.warn("More than one gateway config found");
    }
    return new AdyenGatewayConfigResponse(
      data.paymentGatewayInitialize.gatewayConfigs[0],
    );
  }

  getGiftCardBalanceResponse() {
    return this.gatewayConfig.data.giftCardBalanceResponse;
  }

  getOrderCreateResponse() {
    return this.gatewayConfig.data.orderCreateResponse;
  }

  isOrderNotCancelled() {
    const response = this.gatewayConfig.data.orderCancelResponse;
    return !response || response.resultCode !== "Cancelled";
  }
}
