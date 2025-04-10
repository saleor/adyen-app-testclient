"use server";
import request from "graphql-request";
import { z } from "zod";

import { GetCheckoutTotalPriceQuery } from "@/graphql/CheckoutTotalPrice";
import { envUrlSchema } from "@/lib/env-url";
import { BaseError, UnknownError } from "@/lib/errors";
import { actionClient } from "@/lib/safe-action";

export const getCheckoutTotalPrice = actionClient
  .schema(
    z.object({
      checkoutId: z.string(),
      envUrl: envUrlSchema,
    }),
  )
  .metadata({ actionName: "getCheckoutTotalPrice" })
  .action(async ({ parsedInput: { envUrl, checkoutId } }) => {
    const response = await request(envUrl, GetCheckoutTotalPriceQuery, {
      checkoutId,
    }).catch((error) => {
      throw BaseError.normalize(error, UnknownError);
    });

    return response;
  });
