import { z } from "zod";

import { PaymentMethodsResponseSchema } from "./payment-method-response";

export const InitalizePaymentGatewaySchema = z.object({
  paymentGatewayInitialize: z.object({
    gatewayConfigs: z.array(
      z.object({
        id: z.string(),
        data: z.object({
          clientKey: z.string(),
          environment: z.string(),
          paymentMethodsResponse: PaymentMethodsResponseSchema,
        }),
        errors: z.array(
          z.object({
            field: z.string(),
            message: z.string(),
            code: z.string(),
          }),
        ),
      }),
    ),
    errors: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
        code: z.string(),
      }),
    ),
  }),
});

export type InitalizePaymentGatewaySchemaType = z.infer<
  typeof InitalizePaymentGatewaySchema
>;
