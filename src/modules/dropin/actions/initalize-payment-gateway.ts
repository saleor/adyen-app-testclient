import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";
import { z } from "zod";

import { BaseError } from "@/lib/errors";

const InitalizePaymentGatewayError = BaseError.subclass(
  "InitalizePaymentGatewayError",
);

const InitalizePaymentGatewaySchema = z.object({
  paymentGatewayInitialize: z.object({
    gatewayConfigs: z.array(
      z.object({
        id: z.string(),
        data: z.object({
          clientKey: z.string(),
          environment: z.string(),
          paymentMethodsResponse: z.object({
            paymentMethods: z.any(),
          }),
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

const InitalizePaymentGatewayMutation = graphql(`
  mutation InitalizePaymentGateway(
    $checkoutId: ID!
    $paymentGatewayId: String!
    $amount: PositiveDecimal!
  ) {
    paymentGatewayInitialize(
      id: $checkoutId
      paymentGateways: [{ id: $paymentGatewayId }]
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

export const initalizePaymentGateway = async (props: {
  envUrl: string;
  checkoutId: string;
  paymentGatewayId: string;
  amount: number;
}) => {
  const { envUrl, checkoutId, paymentGatewayId, amount } = props;
  const response = await ResultAsync.fromPromise(
    request(envUrl, InitalizePaymentGatewayMutation, {
      checkoutId,
      paymentGatewayId,
      amount,
    }),
    (error) =>
      new InitalizePaymentGatewayError("Failed to initalize payment gateway", {
        errors: [error],
      }),
  );

  if (response.isErr()) {
    return err(response.error);
  }

  console.log(JSON.stringify(response.value, null, 2));

  const parsedResponse = InitalizePaymentGatewaySchema.safeParse(
    response.value,
  );

  if (parsedResponse.error) {
    return err(
      new InitalizePaymentGatewayError(
        "Failed to parse initalize payment gateway response",
        {
          errors: [parsedResponse.error],
        },
      ),
    );
  }

  if (
    parsedResponse.data.paymentGatewayInitialize.errors.length > 0 ||
    parsedResponse.data.paymentGatewayInitialize.gatewayConfigs.some(
      (config) => config.errors.length > 0,
    )
  ) {
    return err(
      new InitalizePaymentGatewayError("Failed to initalize payment gateway", {
        errors: parsedResponse.data.paymentGatewayInitialize.errors,
      }),
    );
  }

  return ok(parsedResponse.data);
};
