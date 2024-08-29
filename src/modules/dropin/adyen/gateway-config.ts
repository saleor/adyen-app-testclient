import { createLogger } from "@/lib/logger";

import { InitalizePaymentGatewaySchemaType } from "../schemas";

const logger = createLogger("AdyenGatewayConfigResponse");

export class AdyenGiftCardBalanceResponse {
  private constructor(
    private gatewayConfig: InitalizePaymentGatewaySchemaType["paymentGatewayInitialize"]["gatewayConfigs"][number],
  ) {}

  static createFromInitializePaymentGateway(
    data: InitalizePaymentGatewaySchemaType,
  ) {
    if (data.paymentGatewayInitialize.gatewayConfigs.length > 1) {
      logger.warn("More than one gateway config found");
    }
    return new AdyenGiftCardBalanceResponse(
      data.paymentGatewayInitialize.gatewayConfigs[0],
    );
  }

  getResponse() {
    return this.gatewayConfig.data.giftCardBalanceResponse;
  }
}

export class AdyenOrderCreateResponse {
  private constructor(
    private gatewayConfig: InitalizePaymentGatewaySchemaType["paymentGatewayInitialize"]["gatewayConfigs"][number],
  ) {}

  static createFromInitializePaymentGateway(
    data: InitalizePaymentGatewaySchemaType,
  ) {
    if (data.paymentGatewayInitialize.gatewayConfigs.length > 1) {
      logger.warn("More than one gateway config found");
    }
    return new AdyenOrderCreateResponse(
      data.paymentGatewayInitialize.gatewayConfigs[0],
    );
  }

  getResponse() {
    return this.gatewayConfig.data.orderCreateResponse;
  }
}

export class AdyenOrderCancelledResponse {
  private constructor(
    private gatewayConfig: InitalizePaymentGatewaySchemaType["paymentGatewayInitialize"]["gatewayConfigs"][number],
  ) {}

  static createFromInitializePaymentGateway(
    data: InitalizePaymentGatewaySchemaType,
  ) {
    if (data.paymentGatewayInitialize.gatewayConfigs.length > 1) {
      logger.warn("More than one gateway config found");
    }
    return new AdyenOrderCancelledResponse(
      data.paymentGatewayInitialize.gatewayConfigs[0],
    );
  }

  isOrderNotCancelled() {
    const response = this.gatewayConfig.data.orderCancelResponse;
    return !response || response.resultCode !== "Cancelled";
  }
}
