import { queryOptions } from "@tanstack/react-query";
import request from "graphql-request";

import { GetCheckoutTotalPriceQuery } from "@/graphql/CheckoutTotalPrice";
import { BaseError, UnknownError } from "@/lib/errors";

export const getCheckoutTotalPriceOptions = (args: {
  envUrl: string;
  checkoutId: string;
}) =>
  queryOptions({
    queryKey: ["stripeCheckoutTotalPrice"],
    queryFn: async () => {
      const response = await request(args.envUrl, GetCheckoutTotalPriceQuery, {
        checkoutId: args.checkoutId,
      }).catch((error) => {
        throw BaseError.normalize(error, UnknownError);
      });

      return response;
    },
  });
