import { graphql } from "gql.tada";
import request from "graphql-request";
import { err, ok, ResultAsync } from "neverthrow";
import { z } from "zod";

import { BaseError } from "@/lib/errors";

const InitalizePaymentGatewayError = BaseError.subclass(
  "InitalizePaymentGatewayError",
);

export const PaymentMethodsResponseSchema = z.object({
  paymentMethods: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("paypal"),
        name: z.string(),
        configuration: z.object({
          merchantId: z.string().optional(),
          intent: z.enum(["sale", "capture", "authorize", "order", "tokenize"]),
        }),
      }),
      z.object({
        type: z.literal("scheme"),
        name: z.string(),
        brands: z.array(z.string()),
      }),
      z.object({
        type: z.literal("applepay"),
        name: z.string(),
        brands: z.array(z.string()),
        configuration: z.object({
          merchantId: z.string(),
          merchantName: z.string(),
        }),
      }),
      z.object({
        type: z.literal("giftcard"),
        name: z.string(),
        brand: z.string(),
      }),
      z.object({
        type: z.literal("klarna"),
        name: z.string(),
      }),
      z.object({
        type: z.literal("klarna_account"),
        name: z.string(),
      }),
      z.object({
        type: z.literal("klarna_paynow"),
        name: z.string(),
      }),
      z.object({
        type: z.literal("paysafecard"),
        name: z.string(),
      }),
      z.object({
        type: z.literal("blik"),
        name: z.string(),
      }),
      z.object({
        type: z.literal("swish"),
        name: z.string(),
      }),
      z.object({
        type: z.literal("trustly"),
        name: z.string(),
      }),
    ]),
  ),
});

const InitalizePaymentGatewaySchema = z.object({
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
