import { InitalizePaymentGatewaySchemaType } from "../schemas";

export const extractGatewayConfigData = (
  response: InitalizePaymentGatewaySchemaType,
) => {
  const { gatewayConfigs } = response.paymentGatewayInitialize;

  return gatewayConfigs[0].data;
};
