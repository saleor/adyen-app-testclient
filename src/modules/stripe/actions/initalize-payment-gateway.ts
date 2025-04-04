"use server";
import request from "graphql-request";
import { z } from "zod";

import { graphql } from "@/graphql/gql";
import { envUrlSchema } from "@/lib/env-url";
import { BaseError, UnknownError } from "@/lib/errors";
import { actionClient } from "@/lib/safe-action";

const InitalizePaymentGatewayMutation = graphql(`
  mutation initalizePaymentGateway(
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

// const InitalizePaymentGatewayParsingResponseError = BaseError.subclass(
//   "InitalizePaymentGatewayParsingResponseError",
// );
const InitalizePaymentGatewayMutationError = BaseError.subclass(
  "InitalizePaymentGatewayMutationError",
);

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
      const response = await request(envUrl, InitalizePaymentGatewayMutation, {
        checkoutId,
        paymentGatewayId,
        amount,
        data,
      }).catch((error) => {
        throw BaseError.normalize(error, UnknownError);
      });

      // todo maybe parse to validate response

      const config =
        response.paymentGatewayInitialize?.gatewayConfigs &&
        response.paymentGatewayInitialize?.gatewayConfigs[0];

      if (!config) {
        throw new InitalizePaymentGatewayMutationError(
          "Failed to initalize payment gateway - errors in initalizePaymentGateway mutation",
        );
      }

      if ((config.errors ?? []).length > 0) {
        throw new InitalizePaymentGatewayMutationError(
          "Failed to initalize payment gateway - errors in initalizePaymentGateway mutation",
          {
            errors: config.errors?.map((e) =>
              InitalizePaymentGatewayMutationError.normalize(e),
            ),
          },
        );
      }

      return config.data;
    },
  );
