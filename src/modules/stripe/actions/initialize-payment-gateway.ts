"use server";
import request from "graphql-request";
import { z } from "zod";

import { graphql } from "@/graphql/gql";
import { envUrlSchema } from "@/lib/env-url";
import { BaseError, UnknownError } from "@/lib/errors";
import { actionClient } from "@/lib/safe-action";

const InitializePaymentGatewayMutation = graphql(`
  mutation InitializePaymentGateway(
    $checkoutId: ID!
    $paymentGatewayId: String!
    $amount: PositiveDecimal
    $data: JSON
  ) {
    paymentGatewayInitialize(
      id: $checkoutId
      paymentGateways: [{ id: $paymentGatewayId, data: $data }]
      amount: $amount
    ) {
      gatewayConfigs {
        id
        data
        errors {
          field
          message
          code
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`);

const InitializePaymentGatewayError = BaseError.subclass(
  "InitializePaymentGatewayError",
);

const saleorDataSchema = z.object({
  stripePublishableKey: z.string(),
});

export const initializePaymentGateway = actionClient
  .schema(
    z.object({
      checkoutId: z.string(),
      envUrl: envUrlSchema,
      paymentGatewayId: z.string(),
      amount: z.number().optional(), // todo check if this is required for stripe?
      data: z.any(), // todo
    }),
  )
  .metadata({
    actionName: "initializePaymentGateway",
  })
  .action(
    async ({
      parsedInput: { envUrl, checkoutId, paymentGatewayId, amount, data },
    }) => {
      const response = await request(envUrl, InitializePaymentGatewayMutation, {
        checkoutId,
        paymentGatewayId,
        amount,
        data,
      }).catch((error) => {
        throw BaseError.normalize(error, UnknownError);
      });

      if (response.paymentGatewayInitialize?.gatewayConfigs?.length !== 1) {
        throw new InitializePaymentGatewayError(
          "More than one gateway config found",
        );
      }

      const config = response.paymentGatewayInitialize?.gatewayConfigs[0];

      if (!config) {
        throw new InitializePaymentGatewayError(
          "Gateway config is not defined",
        );
      }

      if ((config.errors ?? []).length > 0) {
        throw new InitializePaymentGatewayError(
          "Errors in initializePaymentGateway mutation",
          {
            errors: config.errors?.map((e) =>
              InitializePaymentGatewayError.normalize(e),
            ),
          },
        );
      }

      const parsedSaleorDataResult = saleorDataSchema.safeParse(config.data);

      if (parsedSaleorDataResult.success) {
        return {
          ...config,
          data: parsedSaleorDataResult.data,
        };
      }

      throw new InitializePaymentGatewayError(
        "Failed to parse initializePaymentGateway mutation response",
        {
          errors: parsedSaleorDataResult.error.errors,
        },
      );
    },
  );
