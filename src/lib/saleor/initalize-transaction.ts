import { graphql } from "gql.tada";
import request from "graphql-request";

const initalizeTransactionMutation = graphql(`
  mutation InitalizeTransaction(
    $checkoutId: ID!
    $data: JSON
    $idempotencyKey: String
    $appId: String!
    $amount: PositiveDecimal!
  ) {
    transactionInitialize(
      id: $checkoutId
      paymentGateway: { id: $appId, data: $data }
      amount: $amount
      idempotencyKey: $idempotencyKey
    ) {
      transaction {
        id
      }
      data
      errors {
        field
        message
        code
      }
    }
  }
`);

export const initalizeTransaction = async ({
  envUrl,
  checkoutId,
  data,
  appId,
  amount,
  idempotencyKey,
}: {
  envUrl: string;
  checkoutId: string;
  appId: string;
  data: unknown;
  amount: number;
  idempotencyKey: string;
}) => {
  return await request(envUrl, initalizeTransactionMutation, {
    checkoutId,
    data,
    amount,
    idempotencyKey,
    appId,
  });
};
