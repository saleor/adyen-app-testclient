import { z } from "zod";

export const initializePaymentGatewayResponseSchema = z.object({
  id: z.string(),
  data: z.object({
    stripePublishableKey: z.string(),
  }),
});
