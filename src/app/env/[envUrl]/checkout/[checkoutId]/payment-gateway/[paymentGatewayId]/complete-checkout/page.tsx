import { graphql } from "gql.tada";
import request from "graphql-request";

const CompleteCheckoutMutation = graphql(`
  mutation CompleteCheckout($checkoutId: ID!) {
    checkoutComplete(id: $checkoutId) {
      order {
        id
      }
      errors {
        field
        message
        code
      }
    }
  }
`);

export default async function PaymentGatewayPage({
  params: { envUrl, checkoutId },
}: {
  params: { envUrl: string; checkoutId: string };
}) {
  const decodedEnvUrl = decodeURIComponent(envUrl);
  const data = await request(decodedEnvUrl, CompleteCheckoutMutation, {
    checkoutId,
  });

  console.log(JSON.stringify(data, null, 2));

  return <div>Checkout completed!</div>;
}
